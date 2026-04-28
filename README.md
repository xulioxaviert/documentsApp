# DocumentsApp 📄🤖

DocumentsApp es una aplicación profesional de automatización de documentos que integra tecnologías frontend y backend modernas junto con inteligencia artificial local (LLM) para procesar archivos de referencia y autocompletar plantillas DOCX.

## Stack Tecnológico 🛠️

### Frontend
- **Framework:** Angular 20
- **Rendimiento:** Zoneless Change Detection (`provideZonelessChangeDetection()`)
- **Estado Reactivo:** Angular Signals (sin dependencias innecesarias de RxJS para estado local)
- **Control Flow:** Uso exhaustivo de la sintaxis moderna de plantillas (`@if`, `@for`, `@switch`)
- **Arquitectura:** Core/Shared/Features con Standalone Components.
- **Estilos:** Tailwind CSS para la maquetación y diseño rápido UI.

### Backend
- **Entorno:** Node.js
- **Framework:** Express
- **Lenguaje:** TypeScript
- **Arquitectura:** Arquitectura Hexagonal (Puertos y Adaptadores)
- **Patrones:** Principios SOLID, inyección de dependencias y Clean Code.

### Inteligencia Artificial
- **Motor:** Agente de IA local gestionado a través de **Ollama**.
- **Proceso:** Analiza documentos de referencia provistos por el usuario y redacta la información procesada dentro de una plantilla DOCX.

## Estructura del Proyecto 📁

El proyecto está dividido en dos grandes bloques para separar responsabilidades y asegurar una alta escalabilidad y un bajo acoplamiento:

```text
documentsApp/
│
├── frontend/             # Interfaz de Usuario (Angular 20)
│   └── src/app/
│       ├── core/         # Servicios base, guards, interceptores (ej. AuthInterceptor, IaAgentService)
│       ├── features/     # Módulos y vistas principales (Carga de documentos, vista de progreso)
│       └── shared/       # Componentes y UI reutilizables
│
└── backend/              # Lógica de servidor y API (Node.js/Express)
    ├── src/
    │   ├── domain/       # Entidades y lógica de negocio (Core)
    │   ├── application/  # Casos de uso (Servicios de aplicación)
    │   └── infra/        # Adaptadores (Controladores de Express, conexión a Ollama, File System)
```

## Flujo Principal de la Aplicación 🔄

1. **Carga de Archivos:** El usuario sube sus documentos de referencia y una plantilla DOCX utilizando un formulario gestionado de manera reactiva.
2. **Autenticación (Seguridad):** El frontend interviene cada petición (vía un Interceptor funcional) anexando un Bearer Token válido para garantizar que la sesión está autorizada.
3. **Procesamiento AI:** El servicio expone Signals (`IDLE` -> `ANALYZING` -> `RESEARCHING` -> `DRAFTING` -> `COMPLETED`) que dirigen las animaciones y la experiencia de usuario visual mientras el LLM trabaja de fondo.
4. **Respuesta y Descarga:** Tras recibir la respuesta final del agente IA, el usuario tiene la opción de revisar el contenido, descargar el documento DOCX resultante y limpiar/reiniciar el flujo.

## Desarrollo Local 💻

*(Las instrucciones de instalación específicas como comandos `npm install` o configuración de variables de entorno se definirán a medida que las capas de infraestructura estén finalizadas).*

---
> Proyecto desarrollado bajo estrictos estándares de ingeniería de software, priorizando la mantenibilidad, escalabilidad y una experiencia de usuario altamente fluida.
