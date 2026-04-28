---
description: "Use when implementing or modifying Angular frontend features in DocumentsApp (components, services, interceptors, routes, UI flow, and document-processing states)."
name: "DocumentsApp Frontend Conventions"
applyTo: "frontend/src/**/*.ts"
---
# DocumentsApp Frontend Conventions

- Keep Angular architecture aligned with `core` / `shared` / `features` and use standalone components.
- Prefer Angular Signals for local reactive state. Avoid adding RxJS-based state layers unless integration constraints require them.
- Use modern Angular template control flow (`@if`, `@for`, `@switch`) for new template logic.
- Preserve the IA process state model: `IDLE -> ANALYZING -> RESEARCHING -> DRAFTING -> COMPLETED`, plus `ERROR` for failures.
- Keep UI and copy in Spanish unless a task explicitly asks for another language.
- For API calls, centralize behavior in services (`core/services`) and keep components focused on presentation and interaction flow.
- Do not store sensitive data in `localStorage` or `sessionStorage` (for example user identifiers, session payloads, or long-lived auth artifacts).
- For authentication/session handling, prefer in-memory state and secure server-side session mechanisms (for example HttpOnly cookies and session endpoints).
- Preserve strict TypeScript types (avoid `any` when a concrete type can be defined).
- Keep comments minimal and only for non-obvious logic.
