import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from '../../modules/auth/services/auth.service';
import { tap } from 'rxjs/operators';
import { ErrorResponse } from '../models/responses.model';
import { ActivatedRoute, Router, RouterStateSnapshot } from '@angular/router';
import { LocalStorageService } from '../services/local-storage.service';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {

  constructor(
    private auth: AuthService,
    private localStorageService: LocalStorageService,
    private router: Router,
    private state: RouterStateSnapshot) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> | any {
    console.log("Jwt: Intercepted");

    return next.handle(request)
      .pipe(
        tap(
          () => {},
          async error => {
            console.log(error);
            if (error instanceof HttpErrorResponse) {

              if (error.status === 401) {
                console.log("Status is 401");
                
                if (error.headers.has('Token-Expired')) {
                  if (error.headers.get('Token-Expired')) {
                    console.log("Token Expired");
                    this.auth.collectFailedRequest(request);
                    console.log(this.router.url);
                    this.localStorageService.clearAccessToken();
                    await this.auth.getNewAccessToken();
                    //this.auth.retryFailedRequests();
                    // console.log('Navigating to: ' + this.router.url);
                    // this.router.navigate([this.router.url]);
                  }
                }

                // 401
                // 401 - 1 Wrong Credentials
                // 401 - 2 Refresh Token Expired
                // 401 - 3

                if (error.error) {
                  if (error.error.code === 1) {
                    console.log('Wrong Creditials');
                    
                  }

                  if (error.error.code === 2) {
                    console.log('Refresh Token expired');
                    console.log('Navigating to auth/login');
                    this.router.navigate(['auth'], { queryParams: { returnUrl: this.state.url }});
                  }

                }

              }
            }
          })
      )

  }
}
