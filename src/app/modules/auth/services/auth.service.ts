import { RegisterResponse } from './../models/Responses.model';
import { RefreshAccessTokenRequest } from './../models/Requests.model';
import { User } from './../../../core/models/user.model';
import { LocalStorageService } from './../../../core/services/local-storage.service';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { catchError, retry, map, tap } from 'rxjs/operators';
import { AuthenticateResponse } from '../models/Responses.model';
import { AuthenticateRequest, RegisterRequest } from '../models/Requests.model';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private appUrl: string;
  private apiUrl: string;
  private reqHeader = new HttpHeaders({ 'Content-Type': 'application/json' });
  private _user = new BehaviorSubject < User | null>(null);
  private user = this._user.asObservable();
  private cachedRequests: Array<HttpRequest<any>> = [];

  constructor(
    private http: HttpClient,
    private localStorageService: LocalStorageService,
    private router: Router
  ) {
    this.appUrl = environment.appUrl;
    this.apiUrl = 'api/Auth/';
  }

  public get User(): Observable<User | null> {
    return this.user;
  }

  public isAuthenticated(): Observable<boolean> {
    console.log("isAuthenticated called");

    if (this.localStorageService.getAccessToken() !== null) {
      console.log("Access Token available");
      if (this._user.getValue() === null) {
        console.log("User profile null");
        return this.http.get<User>(
            this.appUrl + this.apiUrl + this.localStorageService.getId())
          .pipe(
            map( response => {
              this._user.next(response);
              return true;
            }),
            catchError( error => {
              return of(false);
            })
          );
      } else {
        console.log("User profile isn't null");
        return of(true);
      }

    }
    console.log("Access Token not available");

    return of(false);
  }

  public authenticate(authenticateRequest: AuthenticateRequest): Observable<AuthenticateResponse> {
    return this.http.post<AuthenticateResponse>(
        this.appUrl + this.apiUrl + 'authenticate', JSON.stringify(authenticateRequest),  {  headers: new HttpHeaders({
          'Content-Type': 'application/json; charset=utf-8'
        })})
        .pipe(
          tap(
            data => {
              console.log(data);
              this.localStorageService.persistAuthorization(data.accessToken, data.refreshToken, data.id);
            },
            error => this.handleError
          )
        )

  }

  public register(registerRequest: RegisterRequest): Observable<RegisterResponse> {
    return this.http.post<RegisterResponse>(
        this.appUrl + this.apiUrl + 'register', JSON.stringify(registerRequest), {  headers: new HttpHeaders({
          'Content-Type': 'application/json; charset=utf-8'
        })})
      .pipe(
        tap(
          data => {
            console.log(data);
          },
          error => this.handleError
        )
      )
  }

  public async getNewAccessToken() {
    const refreshAccessTokenRequest: RefreshAccessTokenRequest =
    { id: this.localStorageService.getId() , refreshToken: this.localStorageService.getRefreshToken() };
    console.log('Trying to get new access token');

    const res: AuthenticateResponse = await this.http.post<AuthenticateResponse>(
        this.appUrl + this.apiUrl + 'refresh', JSON.stringify(refreshAccessTokenRequest),   {  headers: new HttpHeaders({
          'Content-Type': 'application/json; charset=utf-8'
        })})
        .toPromise();
    console.log('Got the new access token using refresh token');
    console.log(res);
    this.localStorageService.persistAuthorization(res.accessToken, res.refreshToken, res.id);
    this.router.navigate(['/']);
  }


  public logout(): void {
    this.router.navigate(['/auth/login']);
    this._user.next(null);
    this.localStorageService.clearStorage();
  }

  public collectFailedRequest(failedRequest: HttpRequest<any>): void {
    this.cachedRequests.push(failedRequest);
  }
  public retryFailedRequests(): void {
    this.cachedRequests.forEach(req => {
      this.http.request(req).pipe(
        tap(
          res => {
            console.log('This is the response for the failed request');
            console.log(res)
          },
          error => {
            console.log('This is the error for the failed request');
            console.log(error)
          }
        )
      )
    });
    // retry the requests. this method can
    // be called after the token is refreshed
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    }
    // else {
    //   // The backend returned an unsuccessful response code.
    //   // The response body may contain clues as to what went wrong.
    //   console.error(
    //     `Backend returned code ${error.status}, ` +
    //     `body was: ${error.error}`);
    // }

    // Return an observable with a user-facing error message.
    return of(error);
  }

}
