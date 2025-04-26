import {Injectable} from '@angular/core';
import {
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot, CanActivate
} from '@angular/router';
import {AuthService} from './auth.service';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    if (this.authService.hasValidToken()) {
      return true;
    }

    // Redirect to login page with return url
    this.router.navigate(['/login'], {queryParams: {returnUrl: state.url}});
    return false;
  }
}

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    const requiredRole = route.data['role'];

    if (!this.authService.hasValidToken()) {
      this.router.navigate(['/login'], {queryParams: {returnUrl: state.url}});
      return false;
    }

    // Check if user has the required role
    if (requiredRole === 'ROLE_ADMIN' && !this.authService.isAdmin()) {
      this.router.navigate(['/']).then(r => console.log('redirecting to home'));
      return false;
    }

    if (requiredRole === 'ROLE_USER' && !this.authService.isUser()) {
      this.router.navigate(['/']).then(r => console.log('redirecting to home'));
      return false;
    }
    return true;
  }
}

@Injectable({
  providedIn: 'root'
})
export class UnauthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {
  }

  canActivate(): Observable<boolean> | Promise<boolean> | boolean {
    return !this.authService.hasValidToken();
  }
}
