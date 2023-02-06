import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, Subject, tap, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ManageNotificationCategoryService {
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

  viewNotificationCategory(post:any):Observable<any>{
    return this.httpClient.post(this.apiURL+'/viewNotificationCategory', JSON.stringify(post));
    // .pipe(catchError(this.errorHandler));
  }

  deleteNotificationCategory(id: number,userId:any,profileId:any){
    return this.httpClient
      .post(this.apiURL + '/deleteNotificationCategory',JSON.stringify({'encId':id, 'userId':userId,'profileId':profileId}));
  }

  deleteNotificationComponent(id: number,userId:any,profileId:any){
    return this.httpClient
      .post(this.apiURL + '/deleteNotificationComponent',JSON.stringify({'encId':id, 'userId':userId,'profileId':profileId}));
  }

  createNotificationCategory(post: any): Observable<any> {
    return this.httpClient.post(
      this.apiURL + '/addNotificationCategory',
      JSON.stringify(post)      
    )
  }


/*   getNotificationCategoryData(id: number){
      return this.httpClient.get(
        this.apiURL + '/getNotificationCategoryData/' + id,
        this.httpOptions
      )
    } */
  getNotificationCategoryData(id: number): Observable<any> {
    const allData = {id};
    return this.httpClient.post(
      this.apiURL + '/getNotificationCategoryData',JSON.stringify(allData));
  }
  updateNotificationCategory(post: any){
    return this.httpClient.post(this.apiURL + '/updateNotificationCategory', JSON.stringify(post));
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
