import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import {
    PROCESS_PROGRESS,
    PROCESS_STEPS,
    type IaProcessState,
    type ProcessDocumentsInput
} from '../../features/work-process/models/process-state.model';
import { API_BASE_URL } from '../tokens/api-base-url.token';

@Injectable({
  providedIn: 'root'
})
export class IaAgentService {
  private readonly http = inject(HttpClient);
  private readonly apiBaseUrl = inject(API_BASE_URL);

  private readonly _currentState = signal<IaProcessState>('IDLE');
  private readonly _generatedText = signal<string | null>(null);
  private readonly _error = signal<string | null>(null);

  public readonly currentState = this._currentState.asReadonly();
  public readonly generatedText = this._generatedText.asReadonly();
  public readonly error = this._error.asReadonly();
  public readonly progress = computed(() => PROCESS_PROGRESS[this._currentState()]);
  public readonly steps = PROCESS_STEPS;
  public readonly isProcessing = computed(() => {
    const state = this._currentState();
    return state === 'ANALYZING' || state === 'RESEARCHING' || state === 'DRAFTING';
  });

  public readonly canStartProcessing = computed(() => !this.isProcessing());

  private simulationTimer: ReturnType<typeof setInterval> | null = null;

  async processDocuments({
    referenceFiles,
    templateFile,
    instructions
  }: ProcessDocumentsInput): Promise<void> {
    if (this.isProcessing()) return;

    if (!templateFile) {
      this._currentState.set('ERROR');
      this._error.set('Debes seleccionar una plantilla para iniciar el procesamiento.');
      return;
    }

    try {
      this._error.set(null);
      this._generatedText.set(null);
      this._currentState.set('ANALYZING');

      const formData = new FormData();
      referenceFiles.forEach((file) => formData.append('references', file));
      formData.append('template', templateFile);
      if (instructions?.trim()) {
        formData.append('instructions', instructions.trim());
      }

      this.startProgressSimulation();

      const response = await firstValueFrom(
        this.http.post<{ generatedText?: string }>(`${this.apiBaseUrl}/documents/process`, formData)
      );

      this.stopProgressSimulation();
      this._currentState.set('COMPLETED');
      this._generatedText.set(response.generatedText ?? null);

    } catch (err: unknown) {
      this.stopProgressSimulation();
      this._currentState.set('ERROR');
      this._error.set(this.toErrorMessage(err));
    }
  }

  resetState(): void {
    this.stopProgressSimulation();
    this._currentState.set('IDLE');
    this._generatedText.set(null);
    this._error.set(null);
  }

  private startProgressSimulation(): void {
    this.stopProgressSimulation();

    let step = 0;
    const states: IaProcessState[] = ['ANALYZING', 'RESEARCHING', 'DRAFTING'];

    this.simulationTimer = setInterval(() => {
      if (step < states.length - 1) {
        step++;
        this._currentState.set(states[step]);
      }
    }, 2000);
  }

  private stopProgressSimulation(): void {
    if (this.simulationTimer) {
      clearInterval(this.simulationTimer);
      this.simulationTimer = null;
    }
  }

  private toErrorMessage(error: unknown): string {
    if (error instanceof Error && error.message) {
      return error.message;
    }

    return 'Error procesando los documentos.';
  }
}
