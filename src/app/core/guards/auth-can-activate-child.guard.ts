import { Injectable } from '@angular/core';
import { CanActivateChild, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { AuthService } from '../../modules/auth/services/auth.service';

@Injectable({
    providedIn: 'root'
})
export class AuthCanActivateChildGuard implements CanActivateChild {
    constructor(
        private router: Router,
        private authService: AuthService
    ) { }

    canActivateChild(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<boolean> | Promise<boolean> | boolean {
        return this.authService.isAuthenticated().pipe(
            take(1),
            map( authState => {
              if (authState) {
                return true;
              } else {
                this.router.navigate(['auth'], { queryParams: { returnUrl: state.url }});
                return false;
              }
            })
          );
    }
}

