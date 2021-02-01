import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { retry, catchError, tap } from 'rxjs/operators';
import { Incident, Incidents } from 'src/app/core/models/incident.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class IncidentsServicesService {

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

   //get all  incidents
   getIncidents(id: any): Observable<Incidents[]>
    {
      return this.http.get<Incidents[]>(this.appUrl+this.apiUrl+ 'user/' + id, this.httpOptions)
      .pipe(
        retry(1),
        catchError(this.errorHandler)
      );
    }
  public getIncidentss(): Observable<Incidents[]>{
    return this.http.get<Incidents[]>(this.appUrl + this.apiUrl + 'user/102', this.httpOptions)
      .pipe(
        retry(1),
        catchError(this.errorHandler)
      );
  }

  

   //get incident by id 
   getIncident(id: number): Observable<Incidents> {
    const url = `${this.apiUrl}/${id}`;
      return this.http.get<Incidents>(this.appUrl + this.apiUrl + id)
      .pipe(
        tap(_ => console.log(`fetched Incident id=${id}`)),
        //catchError(this.errorHandler<Incident>(`getIncident id=${id}`))
        //retry(1),
        catchError(this.errorHandler)
      );
  }
   //Save.Log an Incident
   saveIncident (incident: Incidents): Observable<Incidents> {
    return this.http.post<Incidents>(this.appUrl +this.apiUrl, JSON.stringify(incident), this.httpOptions).pipe(
      tap((incidents: Incidents) => console.log(`added Incident w/ id=${incidents.id}`))
    );
  }

  //to update an incident
  updateIncident(id: number, incident: Incidents): Observable<Incidents> {
    //const url = `${this.myApiUrl}/${id}`;
    return this.http.put<Incidents>(this.appUrl + this.apiUrl + id, JSON.stringify(incident), this.httpOptions)
    .pipe(
      tap(next => {
        console.log('Incident that got updated: ' + id);
      }),
      retry(1),
      catchError(this.errorHandler)
    );
  }

  errorHandler(error: { error: { message: string; }; status: any; message: any; }) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // Get client-side error
      errorMessage = error.error.message;
    } else {
      // Get server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.log(errorMessage);
    return throwError(errorMessage);
  }
}
