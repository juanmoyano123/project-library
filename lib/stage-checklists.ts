import { ProjectStage } from './types';

export interface StageChecklistTemplate {
  stage: ProjectStage;
  name: string;
  tasks: string[];
}

export const STAGE_CHECKLISTS: Record<ProjectStage, StageChecklistTemplate> = {
  0: {
    stage: 0,
    name: 'Inicialización',
    tasks: [
      'Definir el alcance del proyecto',
      'Identificar tecnologías principales',
      'Crear estructura de carpetas',
      'Configurar repositorio Git',
    ],
  },
  1: {
    stage: 1,
    name: 'Discovery',
    tasks: [
      'Analizar requerimientos funcionales',
      'Identificar usuarios y stakeholders',
      'Definir casos de uso principales',
      'Documentar restricciones técnicas',
    ],
  },
  2: {
    stage: 2,
    name: 'Diseño',
    tasks: [
      'Crear wireframes/mockups',
      'Definir arquitectura de información',
      'Diseñar flujos de usuario',
      'Establecer guía de estilos',
    ],
  },
  3: {
    stage: 3,
    name: 'Setup',
    tasks: [
      'Instalar dependencias',
      'Configurar variables de entorno',
      'Configurar base de datos',
      'Setup de herramientas de desarrollo',
    ],
  },
  4: {
    stage: 4,
    name: 'Backend',
    tasks: [
      'Diseñar esquema de base de datos',
      'Implementar API endpoints',
      'Configurar autenticación',
      'Implementar lógica de negocio',
    ],
  },
  5: {
    stage: 5,
    name: 'Frontend',
    tasks: [
      'Implementar componentes base',
      'Integrar con API backend',
      'Implementar routing',
      'Agregar manejo de estados',
    ],
  },
  6: {
    stage: 6,
    name: 'Testing',
    tasks: [
      'Escribir tests unitarios',
      'Realizar tests de integración',
      'Tests end-to-end',
      'Corregir bugs encontrados',
    ],
  },
  7: {
    stage: 7,
    name: 'Deploy',
    tasks: [
      'Configurar entorno de producción',
      'Setup CI/CD pipeline',
      'Deploy inicial',
      'Verificar funcionamiento en producción',
    ],
  },
  8: {
    stage: 8,
    name: 'Docs',
    tasks: [
      'Documentar API',
      'Crear guía de usuario',
      'Documentar código',
      'Crear README completo',
    ],
  },
};

export const getChecklistForStage = (stage: ProjectStage): StageChecklistTemplate => {
  return STAGE_CHECKLISTS[stage];
};
