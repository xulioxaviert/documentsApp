export const IA_PROCESS_STATES = [
  'IDLE',
  'ANALYZING',
  'RESEARCHING',
  'DRAFTING',
  'COMPLETED',
  'ERROR'
] as const;

export type IaProcessState = (typeof IA_PROCESS_STATES)[number];

export interface ProcessStep {
  state: Extract<IaProcessState, 'ANALYZING' | 'RESEARCHING' | 'DRAFTING'>;
  title: string;
  description: string;
  icon: string;
}

export interface ProcessDocumentsInput {
  referenceFiles: File[];
  templateFile: File;
  instructions?: string;
}

export const PROCESS_STEPS: ProcessStep[] = [
  {
    state: 'ANALYZING',
    title: 'Analizando contexto',
    description: 'Leyendo documentos de referencia y plantilla.',
    icon: 'data_object'
  },
  {
    state: 'RESEARCHING',
    title: 'Investigando',
    description: 'Extrayendo entidades clave y verificando contexto.',
    icon: 'public'
  },
  {
    state: 'DRAFTING',
    title: 'Redactando documento',
    description: 'Generando borrador sobre la plantilla seleccionada.',
    icon: 'edit_note'
  }
];

export const PROCESS_PROGRESS: Record<IaProcessState, number> = {
  IDLE: 0,
  ANALYZING: 35,
  RESEARCHING: 65,
  DRAFTING: 90,
  COMPLETED: 100,
  ERROR: 0
};