import {Injectable} from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import {Observable, throwError, BehaviorSubject, from} from 'rxjs';
import {catchError, filter, take, switchMap, finalize} from 'rxjs/operators';
import {AuthService} from './auth.service';
import {Router} from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null);

  constructor(private authService: AuthService, private router: Router) {
  }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const token = this.authService.getAccessToken();
    if (token && !request.url.includes('refresh-token') && !request.url.includes('authenticate')) {
      request = this.addToken(request, token);
    }

    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        // Handle 401 errors - either expired token or unauthorized
        if (error.status === 401) {
          // Check if it's an expired token
          if (error.error?.message === 'Expired JWT token' ||
            error.error?.message?.includes('expired') ||
            error.error?.message?.includes('Invalid token')) {
            return this.handle401Error(request, next);
          }

          // For other 401 errors, logout and redirect to login
          this.authService.logout();
          this.router.navigate(['/auth/login']);
          return throwError(() => error);
        }

        // For other errors, just pass through
        return throwError(() => error);
      })
    );
  }

  private addToken(request: HttpRequest<any>, token: string): HttpRequest<any> {
    return request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  private handle401Error(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);

      // Convert Promise to Observable using 'from'
      return from(this.authService.refreshToken()).pipe(
        switchMap((response: { access_token: string }) => {
          this.refreshTokenSubject.next(response.access_token);
          return next.handle(this.addToken(request, response.access_token));
        }),
        catchError((error) => {
          // If refresh token fails, redirect to login with session expired flag
          this.authService.logout();
          this.router.navigate(['/auth/login'], {queryParams: {sessionExpired: 'true'}});
          return throwError(() => error);
        }),
        finalize(() => {
          this.isRefreshing = false;
        })
      );
    } else {
      // Wait for the token refresh to complete
      return this.refreshTokenSubject.pipe(
        filter(token => token !== null),
        take(1),
        switchMap(token => {
          return next.handle(this.addToken(request, token as string));
        })
      );
    }
  }
}
