import { Injectable } from "@angular/core";
import { catchError, tap, map } from "rxjs/operators";
import { Observable, of, throwError } from "rxjs";
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
} from "@angular/common/http";
import { Cliente } from "../model/cliente";

const httpOptions = {
  headers: new HttpHeaders({ "Content-Type": "application/json" }),
};

//const apiUrl = "http://localhost:8080/clientes/";
const apiUrl = 'https://web-app-takahashi.herokuapp.com/clientes/';

@Injectable({
  providedIn: "root",
})
export class ClienteService {
  constructor(private http: HttpClient) {}

  getClientes(): Observable<Cliente[]> {
    return this.http.get<Cliente[]>(apiUrl).pipe(
      tap((clientes) => console.log("leu os clientes")),
      catchError(this.handleError("getClientes", []))
    );
  }

  getClienteById(id: number): Observable<Cliente> {
    return this.http.get<Cliente>(apiUrl + "id/").pipe(
      tap((_) => console.log("fetched cliente by id :: ${id}" + id)),
      catchError(this.handleError<Cliente>("getClienteById id"))
    );
  }

  // email e senha esta vindo null
  getClienteByEmailAndPass(cliente: Cliente): Observable<Cliente> {
    return this.http.post<Cliente>(apiUrl + "login/", cliente).pipe(
      tap((cliente) => console.log("recebeu o objeto")),
      catchError(this.handleError<Cliente>("getClienteById id"))
    );
  }

  addCliente(cliente: Cliente): Observable<Cliente> {
    return this.http.post<Cliente>(apiUrl + "add/", cliente).pipe(
      tap((cliente: Cliente) =>
        console.log(`adicionou o cliente com w/ nome=${cliente.nomeCompleto}`)
      ),
      catchError(this.handleError<Cliente>("addCliente"))
    );
  }

  sendPhotoBase64(
    encodedImage: string,
    idCliente: number
  ): Observable<Cliente> {
    var blob = this.dataURItoBlob(encodedImage);
    var formDataToUpload = new FormData();
    formDataToUpload.append("file", blob);
    return this.http
      .post<Cliente>(
        apiUrl + "upload/" + `${idCliente}` + "/",
        formDataToUpload
      )
      .pipe(
        tap((cliente: Cliente) =>
          console.log(`adicionou o cliente com w/ nome=${cliente.nomeCompleto}`)
        ),
        catchError(this.handleError<Cliente>("getClienteById id"))
      );
  }

  sendFile(file: File, idCliente: number): Observable<Cliente> {
    var formDataToUpload = new FormData();
    formDataToUpload.append("file", file);
    return this.http
      .post<Cliente>(
        apiUrl + "upload/" + `${idCliente}` + "/",
        formDataToUpload
      )
      .pipe(
        tap((cliente: Cliente) =>
          console.log(`adicionou o cliente com w/ nome=${cliente.nomeCompleto}`)
        ),
        catchError(this.handleError<Cliente>("getClienteById id"))
      );
  }

  private dataURItoBlob(dataURI) {
    // convert base64/URLEncoded data component to raw binary data held in a string
    var byteString;
    if (dataURI.split(",")[0].indexOf("base64") >= 0)
      byteString = atob(dataURI.split(",")[1]);
    else byteString = unescape(dataURI.split(",")[1]);
    // separate out the mime component
    var mimeString = dataURI.split(",")[0].split(":")[1].split(";")[0];
    // write the bytes of the string to a typed array
    var ia = new Uint8Array(byteString.length);
    for (var i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ia], { type: mimeString });
  }

  
  private handleError<T>(operation = "operation", result?: T) {
    return (error: any): Observable<T> => {
      console.error(error.status);
      return of(result as T);
    };
  }
}
