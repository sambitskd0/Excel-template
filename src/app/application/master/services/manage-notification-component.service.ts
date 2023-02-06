import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, Subject, tap, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ManageNotificationComponentService {

  private apiURL = environment.masterAPI;
  //  private apiURL = "http://localhost:8000";
   private refreshRequired = new Subject<void>();
   get RefreshRequired() {
     return this.refreshRequired;
   }

  //  httpOptions = {
  //   headers: new HttpHeaders({
  //     'Content-Type': 'application/json',
  //   }),
  // }
  
  constructor(private httpClient:HttpClient) { }

  viewNotificationComponent(post:any):Observable<any>{
    return this.httpClient.post(this.apiURL+'/viewNotificationComponent', JSON.stringify(post));
    // .pipe(catchError(this.errorHandler));
  }

  deleteNotificationComponent(id: number,userId:any,profileId:any){
    return this.httpClient
      .post(this.apiURL + '/deleteNotificationComponent',JSON.stringify({'encId':id, 'userId':userId,'profileId':profileId}));
  }
  createNotificationComponent(post: any): Observable<any> {
    return this.httpClient.post(
      this.apiURL + '/addNotificationComponent',
      JSON.stringify(post)
    );
  }
  getNotificationComponentData(id: number): Observable<any> {
    const allData = {id};
    return this.httpClient.post(
      this.apiURL + '/getNotificationComponentData',JSON.stringify(allData));
  }
  updateNotificationCategory(post: any){
    return this.httpClient.post(this.apiURL + '/updateNotificationComponent', JSON.stringify(post));
  }

  getNotificationCategoryName(): Observable<any> {
    const allData = {};
    return this.httpClient.post(
      this.apiURL + '/getNotificationCategoryName', JSON.stringify(allData));
  }

  // errorHandler(error: any) {
  //   let errorMessage = '';
  //   if (error.error instanceof ErrorEvent) {
  //     errorMessage = error.error.message;
  //   } else {
  //     errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
  //   }
  //   // this.alertHelper.viewAlert('error','Invalid Inputs',errorMessage)
  //   return throwError(() => new Error(errorMessage));
  // }

}
