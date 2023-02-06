import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CommonNotificationServiceService {

  private apiURL = environment.notificationAPI;
  private masterURL = environment.masterAPI;
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

  getNotificationCategoryName(): Observable<any> {
    // const allData = {id};
    return this.httpClient.post(
      this.apiURL + '/getNotificationCategoryName',this.httpOptions)
  }
  getNotificationComponentName(id:any): Observable<any> {
    const allData = {id};
    return this.httpClient.post(
      this.apiURL + '/getNotificationComponentById',JSON.stringify(allData),this.httpOptions)
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
