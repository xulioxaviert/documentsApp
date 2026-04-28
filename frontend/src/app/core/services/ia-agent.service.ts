import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

export type IaProcessState = 'IDLE' | 'ANALYZING' | 'RESEARCHING' | 'DRAFTING' | 'COMPLETED' | 'ERROR';

@Injectable({
  providedIn: 'root'
})
export class IaAgentService {
  // Signals para el manejo de estado
  private readonly _currentState = signal<IaProcessState>('IDLE');
  private readonly _generatedText = signal<string | null>(null);
  private readonly _error = signal<string | null>(null);

  // Computed signals expuestas para los componentes
  public readonly currentState = this._currentState.asReadonly();
  public readonly generatedText = this._generatedText.asReadonly();
  public readonly error = this._error.asReadonly();
  public readonly isProcessing = computed(() => {
    const state = this._currentState();
    return state === 'ANALYZING' || state === 'RESEARCHING' || state === 'DRAFTING';
  });

  private readonly API_URL = 'http://localhost:3000/api/documents';

  constructor(private http: HttpClient) {}

  /**
   * Envía los archivos al backend y simula el avance de estado si el backend aún
   * no proporciona Server-Sent Events (SSE) o WebSockets.
   */
  async processDocuments(referenceFiles: File[], templateFile: File): Promise<void> {
    if (this.isProcessing()) return;

    try {
      this._error.set(null);
      this._generatedText.set(null);
      this._currentState.set('ANALYZING');

      const formData = new FormData();
      referenceFiles.forEach(file => formData.append('references', file));
      formData.append('template', templateFile);

      // Simulamos progresión de estados para mejor UX mientras esperamos al backend
      const simTimer = this.simulateProgress();

      // Petición al backend Node.js
      const response = await firstValueFrom(
        this.http.post<{ generatedText: string }>(`${this.API_URL}/process`, formData)
      );

      clearInterval(simTimer);
      
      // Estado final
      this._currentState.set('COMPLETED');
      this._generatedText.set(response.generatedText);

    } catch (err: any) {
      this._currentState.set('ERROR');
      this._error.set(err.message || 'Error procesando los documentos.');
    }
  }

  /**
   * Reinicia las Signals al estado inicial.
   */
  resetState(): void {
    this._currentState.set('IDLE');
    this._generatedText.set(null);
    this._error.set(null);
  }

  // Simulación temporal de progreso
  private simulateProgress(): any {
    let step = 0;
    const states: IaProcessState[] = ['ANALYZING', 'RESEARCHING', 'DRAFTING'];
    
    return setInterval(() => {
      if (step < states.length - 1) {
        step++;
        this._currentState.set(states[step]);
      }
    }, 2000); // Avanza de estado cada 2 segundos
  }
}
