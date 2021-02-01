import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { Incident } from 'src/app/core/models/incident.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class IncidentService {

  private appUrl: string;
  private apiUrl: string;
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json; charset=utf-8'
    })
  };
  private _incidents = new BehaviorSubject<Incident[] | null>(null);
  incidents = this._incidents.asObservable();

  constructor(
    private http: HttpClient
  ) {
    this.appUrl = environment.appUrl;
    this.apiUrl = 'api/Incidents/';
   }

  public getIncidents(): Observable<Incident[]>{
    return this.http.get<Incident[]>(this.appUrl + this.apiUrl + '/tech/115', this.httpOptions)
      .pipe(
        retry(1),
        catchError(this.errorHandler)
      );
  }

  public acceptRejectIncident(incident: Incident, acceptReject: boolean, reason: string): Observable<any> {
    return this.http.put(this.appUrl + this.apiUrl + 'tech/acceptreject/' + incident.incident_ID + '/' + acceptReject + '/' + reason,
                         JSON.stringify(incident), this.httpOptions)
      .pipe(
        retry(1),
        catchError(this.errorHandler)
      );
  }

  public closeIncident(incident: Incident): Observable<any> {
    return this.http.put(this.appUrl + this.apiUrl + 'tech/close/' + incident.incident_ID,
                         JSON.stringify(incident), this.httpOptions)
      .pipe(
        retry(1),
        catchError(this.errorHandler)
      );
  }

  // tslint:disable-next-line: typedef
  errorHandler(error: { error: any; status: any; message: any; }) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // Get server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.log(errorMessage);
    return throwError(errorMessage);
  }






}
