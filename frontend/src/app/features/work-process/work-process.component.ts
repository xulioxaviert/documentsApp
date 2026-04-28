import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IaAgentService } from '../../core/services/ia-agent.service';

@Component({
  selector: 'app-work-process',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-8 font-sans selection:bg-indigo-500/30">
      
      <!-- Header -->
      <div class="text-center mb-12 space-y-4 max-w-2xl">
        <h1 class="text-5xl font-extrabold tracking-tight bg-gradient-to-br from-white via-indigo-200 to-indigo-500 bg-clip-text text-transparent drop-shadow-sm">
          Automatización de Documentos
        </h1>
        <p class="text-slate-400 text-lg">Impulsado por IA Local con precisión milimétrica.</p>
      </div>

      <!-- Main Card (Glassmorphism) -->
      <div class="w-full max-w-3xl bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl transition-all duration-500 hover:shadow-indigo-500/10 hover:border-indigo-500/20">
        
        @if (iaService.currentState() === 'IDLE') {
          <div class="flex flex-col items-center justify-center py-16 space-y-6 animate-in fade-in zoom-in duration-500">
            <div class="w-24 h-24 rounded-full bg-indigo-500/20 flex items-center justify-center border border-indigo-500/30">
              <svg class="w-10 h-10 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h2 class="text-2xl font-semibold text-white">Listo para procesar</h2>
            <p class="text-slate-400 text-center max-w-md">Sube tus archivos de referencia y la plantilla DOCX para comenzar la magia.</p>
            <button (click)="startSimulation()" class="px-8 py-3.5 mt-4 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white font-medium tracking-wide shadow-lg shadow-indigo-600/30 transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0">
              Iniciar Procesamiento Mágico
            </button>
          </div>
        }

        @if (iaService.isProcessing()) {
          <div class="py-12 flex flex-col items-center animate-in fade-in duration-500">
            
            <!-- Progress Steps -->
            <div class="w-full max-w-md space-y-6">
              
              @for (step of steps; track step.state) {
                <div class="flex items-center space-x-4 transition-all duration-500" 
                     [class.opacity-100]="step.state === iaService.currentState()"
                     [class.opacity-40]="step.state !== iaService.currentState() && !isPastStep(step.state)">
                  
                  <!-- Step Icon / Loader -->
                  <div class="w-10 h-10 rounded-full flex items-center justify-center shrink-0 border-2"
                       [class.border-indigo-500]="step.state === iaService.currentState()"
                       [class.bg-indigo-500/20]="step.state === iaService.currentState()"
                       [class.border-emerald-500]="isPastStep(step.state)"
                       [class.bg-emerald-500/20]="isPastStep(step.state)"
                       [class.border-slate-700]="!isPastStep(step.state) && step.state !== iaService.currentState()">
                    
                    @if (step.state === iaService.currentState()) {
                      <div class="w-4 h-4 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin"></div>
                    } @else if (isPastStep(step.state)) {
                      <svg class="w-5 h-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                      </svg>
                    }
                  </div>
                  
                  <!-- Step Text -->
                  <div>
                    <h3 class="font-medium text-lg" 
                        [class.text-white]="step.state === iaService.currentState() || isPastStep(step.state)"
                        [class.text-slate-500]="!isPastStep(step.state) && step.state !== iaService.currentState()">
                      {{ step.title }}
                    </h3>
                    <p class="text-sm"
                       [class.text-indigo-300]="step.state === iaService.currentState()"
                       [class.text-emerald-300/70]="isPastStep(step.state)"
                       [class.text-slate-600]="!isPastStep(step.state) && step.state !== iaService.currentState()">
                      {{ step.description }}
                    </p>
                  </div>

                </div>
              }

            </div>
          </div>
        }

        @if (iaService.currentState() === 'COMPLETED') {
          <div class="flex flex-col items-center py-10 space-y-8 animate-in slide-in-from-bottom-8 fade-in duration-700">
            <div class="w-20 h-20 rounded-full bg-emerald-500/20 flex items-center justify-center border border-emerald-500/30">
              <svg class="w-10 h-10 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            
            <div class="text-center">
              <h2 class="text-3xl font-bold text-white mb-2">¡Documento Generado!</h2>
              <p class="text-slate-400">El agente ha concluido la redacción con éxito.</p>
            </div>

            <!-- Preview Card -->
            <div class="w-full bg-slate-900/50 rounded-2xl p-6 border border-slate-800 shadow-inner">
              <p class="text-slate-300 font-mono text-sm leading-relaxed">
                {{ iaService.generatedText() || 'Texto de previsualización generado por la IA...' }}
              </p>
            </div>

            <div class="flex space-x-4">
              <button class="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-medium shadow-lg shadow-emerald-600/20 transition-all active:scale-95 flex items-center space-x-2">
                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                <span>Descargar DOCX</span>
              </button>
              
              <button (click)="iaService.resetState()" class="px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-medium border border-slate-700 transition-all active:scale-95">
                Empezar de nuevo
              </button>
            </div>
          </div>
        }

        @if (iaService.currentState() === 'ERROR') {
          <div class="flex flex-col items-center py-12 space-y-4 animate-in fade-in duration-300">
            <div class="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center border border-red-500/30 mb-4">
              <svg class="w-8 h-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
            </div>
            <h2 class="text-2xl font-bold text-red-400">Error en el proceso</h2>
            <p class="text-slate-400 text-center">{{ iaService.error() }}</p>
            <button (click)="iaService.resetState()" class="mt-6 px-6 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white transition-colors">
              Intentar nuevamente
            </button>
          </div>
        }

      </div>
    </div>
  `
})
export class WorkProcessComponent {
  iaService = inject(IaAgentService);

  readonly steps = [
    { state: 'ANALYZING', title: 'Analizando Contexto', description: 'Leyendo documentos de referencia...' },
    { state: 'RESEARCHING', title: 'Investigando', description: 'Extrayendo entidades clave...' },
    { state: 'DRAFTING', title: 'Redactando Documento', description: 'Autocompletando plantilla DOCX...' }
  ];

  isPastStep(stepState: string): boolean {
    const currentState = this.iaService.currentState();
    const stateOrder = ['ANALYZING', 'RESEARCHING', 'DRAFTING', 'COMPLETED'];
    return stateOrder.indexOf(currentState) > stateOrder.indexOf(stepState);
  }

  startSimulation() {
    // Simular el inicio del proceso (en el servicio usaríamos el método processDocuments pasándole archivos reales)
    // Por ahora, para ver la maqueta y la transición de la IA llamamos a la lógica del servicio que tiene el timer
    this.iaService.processDocuments([], new File([], ''));
  }
}
