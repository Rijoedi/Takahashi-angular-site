import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { Emprego } from '../model/emprego';

const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
};

//const apiUrl = 'http://localhost:8080/empregos/';
const apiUrl = 'https://web-app-takahashi.herokuapp.com/empregos/';

@Injectable({
  providedIn: 'root'
})
export class EmpregoService {

  constructor(private http: HttpClient) { }

  getEmpregos( clienteId: number): Observable<Emprego[]> {
    return this.http.get<Emprego[]>(apiUrl+ `${clienteId}` + "/")
    .pipe(
      tap(_ => console.log('leu os empregos')),
      catchError(this.handleError('getEmpregos', []))
    );
  }

  addEmprego(emprego: Emprego, clienteId: number): Observable<Emprego[]> {
    return this.http.post<Emprego[]>(apiUrl + "add/" + `${clienteId}` + "/", emprego)
    .pipe(
      // tslint:disable-next-line:no-shadowed-variable
      tap(_ => console.log('adiconou um emprego')),
      catchError(this.handleError<Emprego[]>('addEmprego'))
    );
  }

  deleteEmprego(empregoId: any) {
    return this.http.delete<Emprego>(apiUrl + "remove/" + `${empregoId}` + "/");
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      return of(result as T);
    };

  }
}