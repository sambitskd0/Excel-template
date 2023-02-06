import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CommonmasterService {
  private apiURL = environment.masterAPI;
  httpOptions = {
   headers: new HttpHeaders({
     'Content-Type': 'application/json',
     //'skipInterCept':'true'
   })
 }
  constructor(private httpClient: HttpClient) { }
  getBlockaccordingToDistrictid(distId: any){
    return this.httpClient.get(this.apiURL + '/getBlockaccordingToDistrictid'+ distId)
  }
  getClusterAccordingToBlockid(blockId:any)
  {
    return this.httpClient.get(this.apiURL + '/getClusterAccordingToBlockid'+ blockId)
  }
  getAllDist(): Observable<any> {
  
    return this.httpClient.get(this.apiURL + '/getDistrict')
  
    .pipe(
      catchError(this.errorHandler)
    )   
  }
  errorHandler(error:any) {
    let errorMessage = '';
    if(error.error instanceof ErrorEvent) {
      errorMessage = error.error.message;
    } else {
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    return throwError(() => new Error(errorMessage));
 }
}
