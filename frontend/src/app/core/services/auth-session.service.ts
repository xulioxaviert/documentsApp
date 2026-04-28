import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthSessionService {
  private readonly _accessToken = signal<string | null>(null);

  readonly accessToken = this._accessToken.asReadonly();

  setAccessToken(token: string | null): void {
    this._accessToken.set(token);
  }

  clear(): void {
    this._accessToken.set(null);
  }
}