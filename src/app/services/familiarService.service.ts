import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Familiar } from '../model/familiar';
import { Observable, of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { Cliente } from '../model/cliente';

const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
};

//const apiUrl = 'http://localhost:8080/familiares/';
const apiUrl = 'https://web-app-takahashi.herokuapp.com/familiares/';


@Injectable({
  providedIn: 'root'
})
export class FamiliarService {

  constructor(private http: HttpClient) { }

  getFamiliares(idCliente: number): Observable<Familiar[]> {
    return this.http.get<Familiar[]>(apiUrl+ `${idCliente}` + "/")
    .pipe(
      tap(_ => console.log('leu os Familiares')),
      catchError(this.handleError('getFamiliares', []))
    );
  }

  addFamiliar(familiar: Familiar, idCliente: number): Observable<Familiar[]> {
    return this.http.post<Familiar[]>(apiUrl + "add/" + `${idCliente}` + "/", familiar)
    .pipe(
      // tslint:disable-next-line:no-shadowed-variable
      tap(_ => console.log('adiconou um familiar')),
      catchError(this.handleError<Familiar[]>('addFamiliar'))
    );
  }

  deleteFamiliar(familiarId: any) {
    return this.http.delete<Familiar>(apiUrl + "remove/" + `${familiarId}` + "/");
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      return of(result as T);
    };
  }

}
