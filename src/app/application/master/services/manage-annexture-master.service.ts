import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, Subject, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ManageAnnextureMasterService {

  private apiURL = environment.masterAPI;
  //  private apiURL = "http://localhost:8000";
   private refreshRequired = new Subject<void>();
   get RefreshRequired() {
     return this.refreshRequired;
   }
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };
  
  constructor(private httpClient:HttpClient) { }

  createAnnextureData(post: any): Observable<any> {
    return this.httpClient.post(this.apiURL + '/addAnnextureData',JSON.stringify(post),this.httpOptions)
  }

  getAnnextureData(anxtId: number): Observable<any> {
    const allData = {anxtId};
    return this.httpClient.post(this.apiURL + '/getAnnexture',JSON.stringify(allData))
  }
  updateAnnextureData(post: any){
    return this.httpClient.post(this.apiURL + '/updateAnnextureData', JSON.stringify(post), this.httpOptions)
  }
  viewtAnnextureData(post:any):Observable<any>{
    return this.httpClient.post(this.apiURL+'/viewtAnnextureData', JSON.stringify(post),this.httpOptions)
    .pipe(catchError(this.errorHandler));
  }
  errorHandler(error: any) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      errorMessage = error.error.message;
    } else {
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    // this.alertHelper.viewAlert('error','Invalid Inputs',errorMessage)
    return throwError(() => new Error(errorMessage));
  }
}
