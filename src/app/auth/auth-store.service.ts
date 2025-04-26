import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthStoreService {
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.checkInitialAuth());
  private userRoleSubject = new BehaviorSubject<string | null>(this.getInitialRole());

  public isAuthenticated$: Observable<boolean> = this.isAuthenticatedSubject.asObservable();
  public userRole$: Observable<string | null> = this.userRoleSubject.asObservable();

  constructor() {
  }

  get isUserAuthenticated(): boolean {
    return this.isAuthenticatedSubject.value;
  }

  get isAdmin(): boolean {
    return this.userRoleSubject.value === 'ROLE_ADMIN';
  }

  get isUser(): boolean {
    return this.userRoleSubject.value === 'ROLE_USER';
  }

  login(role: string): void {
    this.isAuthenticatedSubject.next(true);
    this.userRoleSubject.next(role);
  }

  logout(): void {
    this.isAuthenticatedSubject.next(false);
    this.userRoleSubject.next(null);
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  }

  private checkInitialAuth(): boolean {
    return !!localStorage.getItem('access_token');
  }

  private getInitialRole(): string | null {
    const token = localStorage.getItem('access_token');
    if (!token) return null;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.role;
    } catch (e) {
      return null;
    }
  }
}
