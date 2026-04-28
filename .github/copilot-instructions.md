# Copilot Instructions for DocumentsApp

Estas reglas son globales para todo el repositorio.

## Alcance y arquitectura
- Respetar la separación por capas y módulos del proyecto; evitar mezclar responsabilidades de UI, dominio e infraestructura.
- Priorizar cambios pequeños, explícitos y fáciles de revisar.
- No introducir nuevas dependencias sin justificación técnica clara.

## Calidad de código
- Mantener tipado estricto y evitar `any` salvo necesidad justificada.
- Escribir código claro; comentarios solo cuando la lógica no sea evidente.
- Evitar refactors masivos no solicitados; conservar APIs públicas existentes si no hay requerimiento de cambio.

## Seguridad
- No almacenar datos sensibles en `localStorage` o `sessionStorage`.
- Preferir estado en memoria para datos efímeros y mecanismos server-side seguros para sesión (por ejemplo, cookies HttpOnly + endpoint de sesión).
- No exponer secretos, tokens ni credenciales en código, logs o ejemplos.

## Validación
- Tras cambios relevantes, ejecutar o sugerir validación con las tareas del workspace (`verify`/`test`) según aplique.
- Si no se puede validar localmente, indicar explícitamente qué faltó por verificar.

## Estilo de colaboración
- Mantener consistencia con convenciones existentes del repositorio antes de proponer nuevos patrones.
- Para reglas específicas de frontend Angular, usar y respetar instrucciones en `.github/instructions/`.
- Este archivo se ampliará con convenciones de backend cuando se definan.
