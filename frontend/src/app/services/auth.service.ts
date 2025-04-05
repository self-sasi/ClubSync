import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })

export class AuthService {

  private readonly TOKEN_KEY = 'auth_token';
  private router = inject(Router);

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  setToken(token: string) {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  logout() {
    localStorage.removeItem(this.TOKEN_KEY);
    this.router.navigate(['/auth']);
  }
}
