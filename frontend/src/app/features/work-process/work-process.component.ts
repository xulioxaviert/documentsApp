import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { IaAgentService } from '../../core/services/ia-agent.service';
import { GlobalProgressComponent } from './components/global-progress/global-progress.component';
import { ProcessingPipelineComponent } from './components/processing-pipeline/processing-pipeline.component';
import { SideNavComponent } from './components/side-nav/side-nav.component';
import { TopAppbarComponent } from './components/top-appbar/top-appbar.component';
import { UploadAreaComponent } from './components/upload-area/upload-area.component';

@Component({
  selector: 'app-work-process',
  standalone: true,
  imports: [CommonModule, SideNavComponent, TopAppbarComponent, UploadAreaComponent, ProcessingPipelineComponent, GlobalProgressComponent],
  templateUrl: './work-process.component.html',
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
    this.iaService.processDocuments({
      referenceFiles: [],
      templateFile: new File([], 'template.docx')
    });
  }
}
