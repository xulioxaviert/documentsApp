---
name: senior-frontend
description: Experto en desarrollo frontend Angular con TypeScript. Aplica arquitectura modular, patrones de diseño, optimización de rendimiento, accesibilidad y mejores prácticas de desarrollo. Utiliza este skill para componentes, servicios, guards, interceptors, directivas, pipes, routing, testing y gestión de estado.
keywords: angular, typescript, componentes, servicios, rxjs, observables, routing, guards, interceptors, directivas, pipes, módulos, lazy-loading, optimización, performance, accesibilidad, i18n, testing, jasmine, karma, protractor, scss, responsive, forms, reactive-forms, http-client, state-management
---

# Senior Frontend Developer - Angular & TypeScript

## 🎯 Propósito
Este skill proporciona directrices y mejores prácticas para el desarrollo de aplicaciones Angular empresariales, enfocándose en arquitectura escalable, código mantenible, rendimiento óptimo y experiencia de usuario excepcional.

## 🔗 Integración documental del repositorio

- Referencia documental: [../../documentation](../../documentation)
- Agente recomendado para crear/actualizar documentación: [../../agents/senior-documentation-architect.agent.md](../../agents/senior-documentation-architect.agent.md)
- Para contenidos de arquitectura y guías operativas, alinear con:
  - [../../documentation/PROJECT-BASELINE.md](../../documentation/PROJECT-BASELINE.md)
  - [../../documentation/TEMPLATES.md](../../documentation/TEMPLATES.md)

## 📋 Cuándo usar este skill
- Crear o modificar componentes Angular
- Implementar servicios y gestión de estado
- Configurar routing, guards e interceptors
- Desarrollar directivas y pipes personalizados
- Optimizar rendimiento y bundle size
- Implementar características de accesibilidad (WCAG 2.1)
- Configurar internacionalización (i18n)
- Escribir tests unitarios y e2e
- Refactorizar código existente
- Revisar arquitectura y patrones de diseño

---

## 🏗️ Arquitectura y Estructura

### Organización de Módulos
```
src/app/
├── core/           # Singleton services, guards, interceptors, configuración global
├── shared/         # Componentes, directivas, pipes reutilizables
├── api/           # Modelos de API, servicios HTTP, constantes
└── [features]/    # Módulos de características (home, cases, deposit, etc.)
    ├── components/
    ├── services/
    ├── models/
    ├── utils/
    └── [feature]-routing.module.ts
```

**Reglas:**
- **Core Module**: Importar una sola vez en AppModule. Contiene servicios singleton.
- **Shared Module**: Exportar componentes/directivas/pipes reutilizables. Importar en módulos de features.
- **Feature Modules**: Lazy-loading cuando sea posible. Auto-contenidos y con routing propio.
- **Path Aliases**: Usar aliases verificados en `tsconfig.json`. Aliases disponibles:
  `@environment/*`, `@core/*`, `@shared/*`, `@api/*`, `@global-position/*`, `@transactions/*`,
  `@transfer/*`, `@deposit/*`, `@cases/*`, `@virtual-mailbox/*`, `@personal-data/*`,
  `@security-policy/*`, `@help/*`, `@home/*`, `@documentation/*`, `@terms-conditions/*`,
  `@legal-warning/*`, `@accessibility/*`.
  ⚠️ `@login/*` apunta a directorio inexistente — no usar.

### Lazy Loading
```typescript
// app-routing.module.ts
const routes: Routes = [
  {
    path: 'deposit',
    loadChildren: () => import('./deposit/deposit.module').then(m => m.DepositModule),
    canActivate: [AuthGuard]
  }
];
```

---

## 💻 Componentes

### Estructura de Componente
```typescript
import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-feature-component',
  templateUrl: './feature-component.component.html',
  styleUrls: ['./feature-component.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush // Usar siempre que sea posible
})
export class FeatureComponentComponent implements OnInit, OnDestroy {
  @Input() data: DataModel;
  @Output() actionPerformed = new EventEmitter<ActionResult>();
  
  private destroy$ = new Subject<void>();
  
  constructor(
    private readonly service: FeatureService,
    private readonly cd: ChangeDetectorRef
  ) {}
  
  ngOnInit(): void {
    this.loadData();
  }
  
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
  
  private loadData(): void {
    this.service.getData()
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        data => this.handleSuccess(data),
        error => this.handleError(error)
      );
  }
}
```

**Mejores Prácticas:**
- ✅ Usar `ChangeDetectionStrategy.OnPush` para optimización
- ✅ Implementar `OnDestroy` y usar `takeUntil()` para evitar memory leaks
- ✅ Mantener componentes pequeños (<300 líneas)
- ✅ Separar lógica de negocio en servicios
- ✅ Usar `readonly` en servicios inyectados
- ✅ Tipado fuerte en TypeScript (evitar `any`)
- ✅ Smart Components (con lógica) vs Presentational Components (solo UI)

### Comunicación entre Componentes
```typescript
// 1. Parent → Child: @Input
@Input() userData: User;

// 2. Child → Parent: @Output
@Output() userUpdated = new EventEmitter<User>();

// 3. Siblings: Servicio compartido con Subject/BehaviorSubject
export class SharedDataService {
  private dataSubject = new BehaviorSubject<Data>(null);
  data$ = this.dataSubject.asObservable();
  
  updateData(data: Data): void {
    this.dataSubject.next(data);
  }
}
```

---

## 🔧 Servicios

### Estructura de Servicio
```typescript
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map, retry } from 'rxjs/operators';

@Injectable({
  providedIn: 'root' // Singleton application-wide
})
export class DataService {
  private readonly API_URL = environment.apiUrl;
  
  constructor(private readonly http: HttpClient) {}
  
  getData(id: string): Observable<DataModel> {
    return this.http.get<ApiResponse>(`${this.API_URL}/data/${id}`)
      .pipe(
        retry(2),
        map(response => this.transformResponse(response)),
        catchError(this.handleError)
      );
  }
  
  private transformResponse(response: ApiResponse): DataModel {
    // Transformar respuesta API a modelo de dominio
    return { /* ... */ };
  }
  
  private handleError(error: HttpErrorResponse): Observable<never> {
    // Logging, analytics, user notification
    return throwError(() => new Error('Error message'));
  }
}
```

**Reglas:**
- ✅ Usar `providedIn: 'root'` para servicios singleton
- ✅ Operadores RxJS: `map`, `switchMap`, `catchError`, `retry`, `debounceTime`
- ✅ Transformar respuestas API a modelos de dominio
- ✅ Manejo centralizado de errores
- ✅ Evitar suscripciones anidadas (usar `switchMap`, `mergeMap`)

---

## 🛡️ Guards e Interceptors

### Auth Guard
```typescript
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(
    private readonly authService: AuthService,
    private readonly router: Router
  ) {}
  
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | boolean {
    if (this.authService.isAuthenticated()) {
      return true;
    }
    
    this.router.navigate(['/login'], { 
      queryParams: { returnUrl: state.url } 
    });
    return false;
  }
}
```

### HTTP Interceptor
```typescript
import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = localStorage.getItem('auth_token');
    
    if (token) {
      const clonedReq = req.clone({
        headers: req.headers.set('Authorization', `Bearer ${token}`)
      });
      return next.handle(clonedReq);
    }
    
    return next.handle(req);
  }
}
```

---

## 📐 Directivas y Pipes

### Directiva Personalizada
```typescript
import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[appHighlight]'
})
export class HighlightDirective {
  @Input() appHighlight: string;
  
  constructor(private readonly el: ElementRef) {}
  
  @HostListener('mouseenter') onMouseEnter() {
    this.highlight(this.appHighlight || 'yellow');
  }
  
  @HostListener('mouseleave') onMouseLeave() {
    this.highlight(null);
  }
  
  private highlight(color: string): void {
    this.el.nativeElement.style.backgroundColor = color;
  }
}
```

### Pipe Personalizado
```typescript
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatIban',
  pure: true // Cacheado por Angular
})
export class FormatIbanPipe implements PipeTransform {
  transform(value: string): string {
    if (!value) return '';
    return value.replace(/(.{4})/g, '$1 ').trim();
  }
}
```

---

## 🎨 Estilos y Responsive

### Arquitectura SCSS
```scss
// src/scss/
// ├── base/         # Reset, tipografía, variables
// ├── components/   # Botones, cards, modales
// └── pages/        # Estilos específicos de página

// Usar variables y mixins
:host {
  display: block;
  
  .container {
    padding: var(--spacing-md);
    
    @include respond-to('tablet') {
      padding: var(--spacing-lg);
    }
  }
}
```

**Reglas:**
- ✅ Encapsulación de estilos (ViewEncapsulation.Emulated por defecto)
- ✅ Variables CSS o SCSS para colores, espaciados, breakpoints
- ✅ Mobile-first approach
- ✅ Evitar `::ng-deep` (deprecado, usar @HostBinding o variables CSS)
- ✅ BEM methodology o convención consistente

---

## ♿ Accesibilidad (A11y)

### Checklist WCAG 2.1
```html
<!-- ✅ ARIA estático -->
<button type="button" aria-label="Cerrar modal" (click)="closeModal()">
  <span aria-hidden="true">&times;</span>
</button>

<!-- ✅ ARIA dinámico -->
<button type="button" [attr.aria-label]="modalLabel" (click)="closeModal()">
  <span [attr.aria-hidden]="isIconHidden ? 'true' : null">&times;</span>
</button>

<!-- ✅ ARIA estático -->
<label for="email">Correo electrónico</label>
<input
  id="email"
  type="email"
  formControlName="email"
  aria-required="true"
  aria-describedby="email-error">
<span id="email-error" role="alert">
  Email inválido
</span>

<!-- ✅ ARIA dinámico -->
<label for="email-dynamic">Correo electrónico</label>
<input
  id="email-dynamic"
  type="email"
  formControlName="email"
  [attr.aria-required]="isRequired ? 'true' : null"
  [attr.aria-describedby]="form.get('email')?.invalid ? 'email-error-dynamic' : null">
<span id="email-error-dynamic" role="alert" *ngIf="form.get('email')?.invalid">
  Email inválido
</span>

<!-- Navegación por teclado -->
<div role="navigation" aria-label="Menú principal">
  <a routerLink="/home" 
     [attr.aria-current]="isActive('/home') ? 'page' : null">
    Inicio
  </a>
</div>
```

**Requisitos:**
- ✅ Contraste mínimo 4.5:1 (texto normal), 3:1 (texto grande)
- ✅ Navegación completa por teclado (Tab, Enter, Esc, Arrow keys)
- ✅ Roles ARIA apropiados (`role="button"`, `role="alert"`, etc.)
- ✅ Labels en todos los inputs (`<label>`, `aria-label`, `aria-labelledby`)
- ✅ Estados de focus visibles
- ✅ Mensajes de error descriptivos
- ✅ Landmarks semánticos (`<nav>`, `<main>`, `<aside>`)

---

## 🌍 Internacionalización (i18n)

### ngx-translate
```typescript
// app.module.ts
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  imports: [
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient]
      }
    })
  ]
})
```

```html
<!-- En templates -->
<h1>{{ 'HOME.TITLE' | translate }}</h1>
<p [translate]="'HOME.DESCRIPTION'" [translateParams]="{name: userName}"></p>
```

```typescript
// En componentes
constructor(private translate: TranslateService) {
  this.translate.use('es');
}

this.translate.get('MESSAGES.SUCCESS').subscribe(text => {
  console.log(text);
});
```

---

## 🧪 Testing

### Test Unitario (Jasmine + Karma)
```typescript
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of, throwError } from 'rxjs';

describe('FeatureComponent', () => {
  let component: FeatureComponent;
  let fixture: ComponentFixture<FeatureComponent>;
  let service: jasmine.SpyObj<FeatureService>;
  
  beforeEach(async () => {
    const serviceSpy = jasmine.createSpyObj('FeatureService', ['getData']);
    
    await TestBed.configureTestingModule({
      declarations: [ FeatureComponent ],
      imports: [ HttpClientTestingModule ],
      providers: [
        { provide: FeatureService, useValue: serviceSpy }
      ]
    }).compileComponents();
    
    service = TestBed.inject(FeatureService) as jasmine.SpyObj<FeatureService>;
    fixture = TestBed.createComponent(FeatureComponent);
    component = fixture.componentInstance;
  });
  
  it('should load data on init', () => {
    const mockData = { id: '1', name: 'Test' };
    service.getData.and.returnValue(of(mockData));
    
    fixture.detectChanges(); // ngOnInit
    
    expect(service.getData).toHaveBeenCalled();
    expect(component.data).toEqual(mockData);
  });
  
  it('should handle errors', () => {
    service.getData.and.returnValue(throwError(() => new Error('API Error')));
    
    fixture.detectChanges();
    
    expect(component.errorMessage).toBeTruthy();
  });
});
```

**Cobertura objetivo:** >80% en componentes críticos

### Test E2E (Protractor)
```typescript
import { browser, by, element } from 'protractor';

describe('Login Flow', () => {
  it('should login successfully', async () => {
    await browser.get('/login');
    
    await element(by.id('email')).sendKeys('user@example.com');
    await element(by.id('password')).sendKeys('password123');
    await element(by.css('button[type="submit"]')).click();
    
    await browser.wait(() => {
      return browser.getCurrentUrl().then(url => url.includes('/home'));
    }, 5000);
    
    expect(await browser.getCurrentUrl()).toContain('/home');
  });
});
```

---

## ⚡ Optimización de Rendimiento

### Estrategias
1. **Lazy Loading**: Cargar módulos bajo demanda
2. **OnPush Change Detection**: Reducir ciclos de detección
3. **TrackBy en *ngFor**: Evitar re-renders innecesarios
   ```html
   <div *ngFor="let item of items; trackBy: trackById">{{ item.name }}</div>
   ```
   ```typescript
   trackById(index: number, item: Item): string {
     return item.id;
   }
   ```
4. **Unsubscribe**: Usar `takeUntil()`, async pipe, o `@ngneat/until-destroy`
5. **Bundle Size**: Analizar con `webpack-bundle-analyzer`
6. **Preloading**: Estrategia de precarga personalizada
   ```typescript
   RouterModule.forRoot(routes, {
     preloadingStrategy: PreloadAllModules
   })
   ```
7. **Virtual Scrolling**: Para listas largas (CDK Virtual Scroll)
8. **Pure Pipes**: Cachean resultados automáticamente
9. **Web Workers**: Para operaciones pesadas
10. **Service Workers**: PWA con caching estratégico

### Métricas Core Web Vitals
- **LCP** (Largest Contentful Paint): <2.5s
- **FID** (First Input Delay): <100ms
- **CLS** (Cumulative Layout Shift): <0.1

---

## 🔒 Seguridad

### Checklist
- ✅ Sanitizar inputs del usuario (Angular lo hace automáticamente)
- ✅ Evitar `bypassSecurityTrust*` a menos que sea absolutamente necesario
- ✅ Validación en cliente Y servidor
- ✅ HTTPS obligatorio en producción
- ✅ Tokens JWT con expiración
- ✅ Content Security Policy (CSP) headers
- ✅ Protección CSRF (tokens en formularios)
- ✅ No almacenar datos sensibles en localStorage (usar httpOnly cookies)
- ✅ Actualizar dependencias regularmente (`npm audit`)

---

## 📦 Forms: Reactive vs Template-Driven

### Reactive Forms (Recomendado)
```typescript
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

export class UserFormComponent implements OnInit {
  userForm: FormGroup;
  
  constructor(private fb: FormBuilder) {}
  
  ngOnInit(): void {
    this.userForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      age: ['', [Validators.min(18), Validators.max(120)]]
    });
  }
  
  onSubmit(): void {
    if (this.userForm.valid) {
      const formValue = this.userForm.value;
      // Enviar datos
    }
  }
}
```

```html
<form [formGroup]="userForm" (ngSubmit)="onSubmit()">
  <input formControlName="email" type="email" />
  <div *ngIf="userForm.get('email').invalid && userForm.get('email').touched">
    <span *ngIf="userForm.get('email').errors?.required">Email requerido</span>
    <span *ngIf="userForm.get('email').errors?.email">Email inválido</span>
  </div>
  
  <button type="submit" [disabled]="userForm.invalid">Enviar</button>
</form>
```

**Ventajas Reactive Forms:**
- Más testeable
- Más escalable para formularios complejos
- Validaciones síncronas y asíncronas
- Mejor control programático

---

## 🧠 Gestión de Contexto con TODOs

### ¿Por qué usar TODOs?
Los comentarios TODO son fundamentales para mantener el contexto y no perder de vista tareas pendientes, especialmente en:
- Refactorizaciones complejas
- Implementaciones parciales que requieren revisión
- Optimizaciones futuras identificadas
- Deuda técnica que debe abordarse

### Formato estándar de TODOs
```typescript
// TODO: [PRIORIDAD] [USUARIO] [FECHA] - Descripción detallada
// TODO: [HIGH] @xulio.rojas 2026-02-09 - Implementar caché para mejorar performance
// TODO: [MEDIUM] Refactorizar método usando RxJS operators para mejor legibilidad
// FIXME: [CRITICAL] Memory leak en subscription - implementar takeUntil()
// HACK: Solución temporal - revisar cuando API actualice endpoint
// NOTE: Este componente depende del servicio AuthService inicializado en AppModule
```

### Tipos de marcadores
- **TODO**: Tarea pendiente de implementación
- **FIXME**: Bug o problema que debe corregirse
- **HACK**: Solución temporal que requiere refactorización
- **NOTE**: Información importante para otros desarrolladores
- **OPTIMIZE**: Punto identificado para optimización de rendimiento
- **REFACTOR**: Código que necesita reestructuración

### Herramientas para gestión de TODOs
```bash
# Buscar todos los TODOs en el proyecto
grep -r "TODO" src/ --exclude-dir=node_modules

# Extensiones VS Code recomendadas:
# - Todo Tree: Visualizar TODOs en el sidebar
# - Better Comments: Colorear comentarios por tipo
```

### Ejemplo en código
```typescript
export class UserService {
  // TODO: [HIGH] @team 2026-02-09 - Migrar a nuevo endpoint /api/v2/users
  // cuando backend despliegue la nueva versión
  getUser(id: string): Observable<User> {
    return this.http.get(`${this.API_URL}/api/v1/users/${id}`);
  }
  
  // OPTIMIZE: Esta búsqueda no es eficiente con grandes datasets
  // Considerar implementar paginación o virtual scrolling
  searchUsers(query: string): Observable<User[]> {
    return this.users$.pipe(
      map(users => users.filter(u => u.name.includes(query)))
    );
  }
  
  // FIXME: [CRITICAL] Esta lógica no maneja correctamente el caso
  // cuando el usuario tiene múltiples roles activos simultáneamente
  hasPermission(permission: string): boolean {
    // HACK: Temporal hasta que se defina modelo de permisos correcto
    return this.currentUser?.role === 'admin';
  }
}
```

**Regla de oro**: Si encuentras algo que no puedes resolver inmediatamente, deja un TODO bien documentado. Es mejor un TODO claro que código confuso o incompleto sin explicación.

---

## 🛠️ Herramientas de Debugging y Análisis

### Model Context Protocol (MCP)
Utiliza herramientas MCP para debugging avanzado y análisis de errores:

#### 1. Console Ninja / Runtime Errors
```typescript
// Acceso a errores de runtime en tiempo real
// Usa MCP tools para:
// - mcp_io_github_chr_get_console_messages: Ver logs de consola
// - console-ninja_runtimeErrors: Obtener errores de runtime
// - console-ninja_runtimeLogs: Acceder a logs detallados

// Ejemplo: Logging estructurado para facilitar debugging
export class ErrorService {
  logError(error: Error, context?: string): void {
    console.error('🔴 Error:', {
      message: error.message,
      stack: error.stack,
      context: context,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent
    });
    // TODO: Integrar con sistema de monitoring (Sentry, LogRocket)
  }
}
```

#### 2. Lighthouse y Accesibilidad
```typescript
// Usa MCP tools para análisis automatizado:
// - mcp_lighthouse_get_accessibility_score: Score de accesibilidad
// - mcp_lighthouse_get_performance_score: Métricas de rendimiento
// - mcp_lighthouse_get_seo_analysis: Análisis SEO

// OPTIMIZE: Ejecutar Lighthouse en CI/CD pipeline
// TODO: Configurar threshold mínimo de 90 en accessibility score
```

#### 3. Chrome DevTools Integration
```typescript
// Herramientas MCP disponibles:
// - mcp_io_github_chr_performance_analyze_insight: Análisis de performance
// - mcp_io_github_chr_get_network_request: Inspección de requests HTTP
// - mcp_accessibility_are-colors-accessible: Verificar contraste de colores

// Ejemplo de verificación de contraste
// mcp_accessibility_get-color-contrast: Calcular ratio WCAG
const primaryColor = '#007bff';
const backgroundColor = '#ffffff';
// Verificar que el ratio sea >= 4.5:1
```

### Debugging Efectivo

#### Logging estratégico
```typescript
import { environment } from '@environment/environment';

export class DebugService {
  private readonly isDev = !environment.production;
  
  log(message: string, data?: any): void {
    if (this.isDev) {
      console.log(`[${new Date().toISOString()}] ${message}`, data);
    }
  }
  
  // Grupos colapsables para organizar logs
  group(label: string, fn: () => void): void {
    if (this.isDev) {
      console.group(label);
      fn();
      console.groupEnd();
    }
  }
  
  // Performance timing
  time(label: string): void {
    if (this.isDev) console.time(label);
  }
  
  timeEnd(label: string): void {
    if (this.isDev) console.timeEnd(label);
  }
}

// Uso:
this.debug.time('Load Users');
this.userService.getUsers().subscribe(users => {
  this.debug.timeEnd('Load Users');
  this.debug.log('Users loaded', { count: users.length });
});
```

#### Angular DevTools
```typescript
// Habilitar debug mode en desarrollo
import { enableDebugTools } from '@angular/platform-browser';

if (!environment.production) {
  // Acceder en consola: ng.profiler.timeChangeDetection()
  platformBrowserDynamic()
    .bootstrapModule(AppModule)
    .then(moduleRef => {
      const applicationRef = moduleRef.injector.get(ApplicationRef);
      const componentRef = applicationRef.components[0];
      enableDebugTools(componentRef);
    });
}
```

### Herramientas de análisis de errores

```typescript
// Global Error Handler
import { ErrorHandler, Injectable } from '@angular/core';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  // TODO: Integrar con MCP runtime error tools
  handleError(error: Error): void {
    // 1. Log detallado
    console.error('🔥 Global Error:', {
      message: error.message,
      stack: error.stack,
      timestamp: Date.now()
    });
    
    // 2. Enviar a servicio de monitoring
    // this.monitoringService.captureException(error);
    
    // 3. Mostrar mensaje al usuario si es crítico
    // this.notificationService.showError('Ha ocurrido un error');
  }
}

// Registrar en AppModule:
providers: [
  { provide: ErrorHandler, useClass: GlobalErrorHandler }
]
```

---

## 🏛️ Principios SOLID y Clean Code

### Principios SOLID

#### S - Single Responsibility Principle (Responsabilidad Única)
Cada clase/componente debe tener una única responsabilidad.

```typescript
// ❌ MAL: Componente con múltiples responsabilidades
export class UserDashboardComponent {
  loadUsers() { /* HTTP call */ }
  validateEmail(email: string) { /* validation */ }
  formatDate(date: Date) { /* formatting */ }
  sendAnalytics(event: string) { /* analytics */ }
}

// ✅ BIEN: Separar responsabilidades
export class UserDashboardComponent {
  constructor(
    private userService: UserService,           // HTTP calls
    private validator: ValidationService,        // Validation
    private formatter: FormatterService,         // Formatting
    private analytics: AnalyticsService          // Analytics
  ) {}
}
```

#### O - Open/Closed Principle (Abierto/Cerrado)
Abierto para extensión, cerrado para modificación.

```typescript
// ✅ Usar interfaces y composición
export interface PaymentStrategy {
  processPayment(amount: number): Observable<PaymentResult>;
}

export class CreditCardPayment implements PaymentStrategy {
  processPayment(amount: number): Observable<PaymentResult> {
    // Implementación específica
  }
}

export class PayPalPayment implements PaymentStrategy {
  processPayment(amount: number): Observable<PaymentResult> {
    // Implementación específica
  }
}

export class PaymentService {
  // Extendible sin modificar el servicio
  process(strategy: PaymentStrategy, amount: number) {
    return strategy.processPayment(amount);
  }
}
```

#### L - Liskov Substitution Principle (Sustitución de Liskov)
Las subclases deben ser sustituibles por sus clases base.

```typescript
// ✅ Las implementaciones son intercambiables
export abstract class DataSource {
  abstract getData(): Observable<any[]>;
}

export class ApiDataSource extends DataSource {
  getData(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }
}

export class CacheDataSource extends DataSource {
  getData(): Observable<any[]> {
    return of(this.cachedData);
  }
}

// Cualquier DataSource funciona aquí
export class DataComponent {
  constructor(private dataSource: DataSource) {}
  
  ngOnInit() {
    this.dataSource.getData().subscribe(/* ... */);
  }
}
```

#### I - Interface Segregation Principle (Segregación de Interfaces)
Muchas interfaces específicas son mejores que una general.

```typescript
// ❌ MAL: Interface demasiado grande
interface UserOperations {
  create(user: User): Observable<User>;
  read(id: string): Observable<User>;
  update(id: string, user: User): Observable<User>;
  delete(id: string): Observable<void>;
  exportToPdf(id: string): Observable<Blob>;
  sendEmail(id: string, message: string): Observable<void>;
}

// ✅ BIEN: Interfaces segregadas
interface UserCrud {
  create(user: User): Observable<User>;
  read(id: string): Observable<User>;
  update(id: string, user: User): Observable<User>;
  delete(id: string): Observable<void>;
}

interface UserExport {
  exportToPdf(id: string): Observable<Blob>;
}

interface UserNotification {
  sendEmail(id: string, message: string): Observable<void>;
}

// Servicios implementan solo lo que necesitan
export class UserService implements UserCrud { /* ... */ }
export class UserExportService implements UserExport { /* ... */ }
```

#### D - Dependency Inversion Principle (Inversión de Dependencias)
Depender de abstracciones, no de implementaciones concretas.

```typescript
// ✅ Depender de interfaces
export interface Logger {
  log(message: string): void;
  error(error: Error): void;
}

@Injectable()
export class ConsoleLogger implements Logger {
  log(message: string): void {
    console.log(message);
  }
  error(error: Error): void {
    console.error(error);
  }
}

// El servicio depende de la abstracción, no de la implementación
export class DataService {
  constructor(private logger: Logger) {} // Inyección de abstracción
  
  getData(): Observable<Data> {
    this.logger.log('Fetching data...');
    // ...
  }
}

// En módulo: permitir cambiar implementación fácilmente
providers: [
  { provide: Logger, useClass: ConsoleLogger } // o CloudLogger, FileLogger, etc.
]
```

### Clean Code Principles

#### Nombres significativos
```typescript
// ❌ MAL
const d = new Date();
const arr = [1, 2, 3];
function get(id) { /* ... */ }

// ✅ BIEN
const currentDate = new Date();
const userIds = [1, 2, 3];
function getUserById(userId: string): Observable<User> { /* ... */ }
```

#### Funciones pequeñas y enfocadas
```typescript
// ❌ MAL: Función que hace demasiado
function processUser(user: User) {
  // validar
  if (!user.email || !user.name) return;
  // transformar
  const formatted = user.name.toUpperCase();
  // guardar
  this.http.post('/users', user).subscribe();
  // notificar
  this.notificationService.show('Usuario guardado');
}

// ✅ BIEN: Funciones pequeñas y específicas
function validateUser(user: User): boolean {
  return Boolean(user.email && user.name);
}

function formatUserName(name: string): string {
  return name.toUpperCase();
}

function saveUser(user: User): Observable<User> {
  return this.http.post<User>('/users', user);
}

function notifySuccess(message: string): void {
  this.notificationService.show(message);
}

// Composición
function processUser(user: User): void {
  if (!this.validateUser(user)) return;
  
  const processedUser = {
    ...user,
    name: this.formatUserName(user.name)
  };
  
  this.saveUser(processedUser).subscribe(() => {
    this.notifySuccess('Usuario guardado');
  });
}
```

#### DRY (Don't Repeat Yourself)
```typescript
// ❌ MAL: Código duplicado
getUser() {
  this.loading = true;
  this.http.get('/user').subscribe(
    data => { this.loading = false; this.user = data; },
    error => { this.loading = false; this.error = error; }
  );
}

getOrders() {
  this.loading = true;
  this.http.get('/orders').subscribe(
    data => { this.loading = false; this.orders = data; },
    error => { this.loading = false; this.error = error; }
  );
}

// ✅ BIEN: Extraer lógica común
private loadData<T>(
  request: Observable<T>,
  successCallback: (data: T) => void
): void {
  this.loading = true;
  request.pipe(
    finalize(() => this.loading = false)
  ).subscribe(
    data => successCallback(data),
    error => this.error = error
  );
}

getUser() {
  this.loadData(
    this.http.get<User>('/user'),
    user => this.user = user
  );
}

getOrders() {
  this.loadData(
    this.http.get<Order[]>('/orders'),
    orders => this.orders = orders
  );
}
```

#### KISS (Keep It Simple, Stupid)
```typescript
// ❌ MAL: Complejidad innecesaria
function isAdult(user: User): boolean {
  const birthDate = new Date(user.birthDate);
  const now = new Date();
  const age = now.getFullYear() - birthDate.getFullYear();
  const monthDiff = now.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && now.getDate() < birthDate.getDate())) {
    return age - 1 >= 18;
  }
  return age >= 18;
}

// ✅ BIEN: Simple y directo
function isAdult(user: User): boolean {
  const age = moment().diff(moment(user.birthDate), 'years');
  return age >= 18;
}
// TODO: Migrar de moment.js a date-fns (moment está deprecado)
```

#### Comentarios útiles
```typescript
// ❌ MAL: Comentarios obvios o desactualizados
// Incrementa i
i++;

// Obtiene el usuario (código hace otra cosa)
getUser() { return this.users[0]; }

// ✅ BIEN: Comentarios que añaden valor
// NOTA: Este timeout es necesario porque el backend tiene un delay
// de 2 segundos en el procesamiento. Ver ticket #1234
const PROCESSING_TIMEOUT = 3000;

// IMPORTANTE: Este array debe mantener el orden específico
// requerido por el algoritmo de cifrado (ver documentación)
const encryptionKeys = ['key1', 'key2', 'key3'];

// TODO: [HIGH] Refactorizar cuando migre a RxJS 8
// La sintaxis de switchMap cambia significativamente
```

### Code Smells a evitar

```typescript
// ❌ Código muerto (comentado)
// function oldMethod() {
//   // ...
// }
// Usar Git para historial, no comentarios

// ❌ Magic numbers
if (user.age > 18) { /* ... */ }
// ✅ Usar constantes
const LEGAL_AGE = 18;
if (user.age > LEGAL_AGE) { /* ... */ }

// ❌ Flags booleanos en parámetros
function getUser(id: string, isAdmin: boolean) { /* ... */ }
// ✅ Métodos separados o strategy pattern
function getUser(id: string) { /* ... */ }
function getAdminUser(id: string) { /* ... */ }

// ❌ God components (>500 líneas)
// ✅ Dividir en componentes más pequeños

// ❌ Lógica de negocio en componentes
// ✅ Mover a servicios
```

### Métricas de Código Limpio

- **Complejidad Ciclomática**: <10 por método
- **Líneas por método**: <20 líneas
- **Líneas por clase**: <300 líneas
- **Parámetros por método**: <4 parámetros
- **Nivel de anidación**: <3 niveles
- **Cobertura de tests**: >80% en código crítico

---

## 🎯 Patrones de Diseño Comunes

### 1. Facade Pattern (Servicio Fachada)
```typescript
@Injectable({ providedIn: 'root' })
export class UserFacadeService {
  constructor(
    private userApi: UserApiService,
    private authService: AuthService,
    private store: Store
  ) {}
  
  loadUserProfile(): Observable<User> {
    return this.userApi.getProfile().pipe(
      tap(user => this.store.dispatch(setUser(user)))
    );
  }
}
```

### 2. Adapter Pattern (Transformación de datos)
```typescript
export class UserAdapter {
  adapt(apiUser: ApiUser): User {
    return {
      id: apiUser.user_id,
      fullName: `${apiUser.first_name} ${apiUser.last_name}`,
      registeredAt: new Date(apiUser.created_at)
    };
  }
}
```

### 3. Observer Pattern (RxJS)
```typescript
private notificationsSubject = new Subject<Notification>();
notifications$ = this.notificationsSubject.asObservable();

addNotification(notification: Notification): void {
  this.notificationsSubject.next(notification);
}
```

### 4. Singleton Pattern (Servicios con providedIn)
Ya implementado por defecto en Angular con `providedIn: 'root'`

---

## 📚 Recursos y Herramientas

### Librerías recomendadas
- **State Management**: NgRx, Akita, NgXs
- **UI Components**: Angular Material, ngx-bootstrap (ya en proyecto), PrimeNG
- **Forms**: @ngneat/reactive-forms
- **Utils**: lodash-es, date-fns, moment (ya en proyecto)
- **Validación**: class-validator, yup
- **HTTP**: @ngneat/cashew (caching)
- **Testing**: @testing-library/angular

### Herramientas de desarrollo
- **Linting**: ESLint + @angular-eslint
- **Formatting**: Prettier
- **Debugging**: Angular DevTools (Chrome Extension)
- **Performance**: Lighthouse, webpack-bundle-analyzer
- **Git Hooks**: Husky + lint-staged

---

## ✅ Checklist de PR Review

Antes de crear un Pull Request, verificar:

- [ ] Código compilable sin warnings (`ng build --prod`)
- [ ] Tests pasando (`ng test`)
- [ ] Linter sin errores (`ng lint`)
- [ ] Performance: No memory leaks (unsubscribe de Observables)
- [ ] Accesibilidad: Tested con keyboard navigation + MCP lighthouse tools
- [ ] Responsive: Tested en mobile, tablet, desktop
- [ ] i18n: Todos los textos traducibles
- [ ] Error handling: Casos edge cubiertos
- [ ] Documentación: README actualizado si es necesario
- [ ] Code review: Clean code, DRY, SOLID principles aplicados
- [ ] Security: No credentials hardcoded, inputs sanitizados
- [ ] TODOs: Todos los TODOs tienen contexto y prioridad documentada
- [ ] Console errors: Verificar con MCP tools que no hay errores en runtime
- [ ] WCAG compliance: Usar MCP accessibility tools para verificar contraste y semántica
- [ ] Bundle size: Sin incrementos injustificados (usar webpack-bundle-analyzer)
- [ ] Code smells: Sin código duplicado, funciones >20 líneas, o complejidad >10

---

## 🚀 Comandos Útiles

```bash
# Desarrollo
ng serve --port=4201 --open
ng serve --configuration=develop

# Build
ng build --prod --source-map=false
ng build --configuration=test

# Testing
ng test --code-coverage
ng e2e

# Linting
ng lint --fix

# Generación de código
ng generate component feature/components/my-component
ng generate service core/services/my-service
ng generate guard core/guards/auth

# Análisis de bundle
ng build --prod --stats-json
npx webpack-bundle-analyzer dist/stats.json
```

---

## 💡 Tips Finales

1. **Mantén los componentes tontos (dumb)**: Lógica en servicios, no en componentes
2. **Composición sobre herencia**: Usa servicios inyectables en lugar de herencia de clases
3. **Fail fast**: Validar inputs temprano, usar TypeScript strict mode
4. **Logs significativos**: Usa niveles apropiados (error, warn, info, debug)
5. **Documentar decisiones técnicas**: Comentarios en código complejo
6. **Refactorizar constantemente**: No acumular deuda técnica
7. **Pensar en el usuario final**: Performance y UX son prioridad
8. **TODOs siempre**: No pierdas contexto, documenta tareas pendientes
9. **Use MCP tools**: Aprovecha herramientas de análisis automático de errores y accesibilidad
10. **SOLID en todo momento**: Mantén el código extensible y mantenible
11. **Clean Code es no negociable**: Código limpio hoy, menos bugs mañana
12. **Automatiza el análisis**: Linters, formatters, y herramientas de calidad en CI/CD

---

## 📞 Próximos Pasos

Cuando trabajes en este proyecto:
1. Revisa la estructura existente antes de crear nuevos componentes
2. Reutiliza componentes de `shared/` cuando sea posible
3. Mantén consistencia con patrones existentes
4. Actualiza tests cuando modifiques código
5. Considera el impacto en otros módulos (regresión)
6. Comunica cambios significativos al equipo

**¡Recuerda!**: Un buen código es aquel que otro desarrollador puede entender y mantener fácilmente.

## Nota de Ortografía (aplicable a documentación)

Cuando este skill genere o apoye la creación de documentación técnica (guides, ADRs, runbooks, PR descriptions, checklists), aplicar las reglas definidas en `.github/documentation/ORTHOGRAPHY-GUIDELINES.md`. Añadir en el encabezado del artefacto: "Ortografía verificada según .github/documentation/ORTHOGRAPHY-GUIDELINES.md".
