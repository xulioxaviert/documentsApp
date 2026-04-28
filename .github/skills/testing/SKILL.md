---
name: testing
description: Testing Angular (Karma/Jasmine) para este repositorio. Usar cuando se pidan tests unitarios, ampliar cobertura, auditar specs, crear mocks, revisar calidad de pruebas o validar comportamiento critico.
keywords: testing, angular, karma, jasmine, unit-tests, coverage, mocks, specs, e2e, protractor
---

# Skill: Testing Angular (Karma/Jasmine)

## Proposito
Establecer una base reusable para crear, auditar y mejorar tests en este proyecto Angular 9, con foco en cobertura util, estabilidad y mantenibilidad.

## Cuándo usar esta skill
- Crear specs desde cero para componentes, servicios, guards, interceptors, pipes y directivas.
- Ampliar pruebas que solo tienen `should create`.
- Auditar calidad de suites existentes y detectar gaps de cobertura.
- Estandarizar mocks (StorageService, Router, HttpClient, TranslateService, Mosaic SDK).
- Verificar regresiones funcionales en flujos criticos.

## Integracion documental del repositorio
- Referencia documental: [../../documentation](../../documentation)
- Mapa agente-skill: [../../documentation/AGENT-SKILL-MAP.md](../../documentation/AGENT-SKILL-MAP.md)
- Agente principal para ejecucion de pruebas: [../../agents/testing.agent.md](../../agents/testing.agent.md)
- Agente para documentar estrategia de pruebas: [../../agents/senior-documentation-architect.agent.md](../../agents/senior-documentation-architect.agent.md)

## Stack de testing del proyecto
- Unit tests: Karma + Jasmine (`npm test`)
- E2E existente: Protractor (`npm run e2e`)
- Configuracion: `karma.conf.js`, `tsconfig.spec.json`

## Flujo de trabajo recomendado
1. Leer implementacion real del archivo bajo prueba.
2. Identificar dependencias inyectadas y contratos publicos.
3. Diseñar casos: happy path, error path, edge cases.
4. Preparar mocks/spies tipados para todas las dependencias.
5. Escribir pruebas con aserciones de comportamiento observable.
6. Ejecutar pruebas y ajustar para evitar flaky tests.

## Criterios minimos de calidad
- Cada suite debe tener pruebas de comportamiento (no solo existencia).
- Errores y estados de fallo deben estar cubiertos en codigo critico.
- No usar `any` en mocks salvo justificacion tecnica.
- Evitar `NO_ERRORS_SCHEMA` por defecto; preferir stubs declarativos.
- Incluir limpieza adecuada (`fixture.destroy()`, cleanup de globals/mocks).

## Mocks recurrentes del repositorio
```typescript
// StorageService
const storageServiceSpy = jasmine.createSpyObj('StorageService', ['getItem', 'setItem', 'removeItem']);

// Router
const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

// HttpClientTesting
imports: [HttpClientTestingModule]

// Mosaic SDK
beforeEach(() => {
  (window as any).tsPlatform = {
    ido: jasmine.createSpyObj('ido', ['startJourney', 'submitClientResponse'])
  };
});
afterEach(() => {
  delete (window as any).tsPlatform;
});
```

## Checklist rapido de auditoria
- [ ] Hay mas que `should create`.
- [ ] Se cubren errores HTTP y ramas de rechazo.
- [ ] Se testean validaciones de formularios y submit.
- [ ] Se evita acoplamiento a detalles privados internos.
- [ ] No existen `fdescribe` ni `fit`.

## Comandos utiles
```bash
npm test
npm test -- --include=**/archivo.spec.ts
npm run e2e
```

## Nota de ortografia
Ortografía verificada según .github/documentation/ORTHOGRAPHY-GUIDELINES.md.
