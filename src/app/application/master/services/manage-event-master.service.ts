import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { catchError, Observable, Subject, throwError, tap } from 'rxjs';
import { environment } from 'src/environments/environment';



@Injectable({
  providedIn: 'root'
})
export class ManageEventMasterService {
  private apiURL = environment.masterAPI;
  //   httpOptions = {
  //     headers: new HttpHeaders({
  //   'Content-Type': 'application/json',
  // }),
  //   }

  constructor(private http: HttpClient) { }
  getEventName() {
    const allData = {};
    return this.http.post(
      this.apiURL + '/getEventName', JSON.stringify(allData)
    );
  }
  getEventCategory() {
    const allData = {};
    return this.http.post(
      this.apiURL + '/getEventCategoryName', JSON.stringify(allData)
    );
  }
  getEventCategories(id: any) {
    return this.http.post(
      this.apiURL + '/getEventCategoryName', JSON.stringify({ 'id': id })
    );
  }
  addEventMaster(post: any): Observable<any> {
    return this.http.post(
      this.apiURL + '/addEventMaster',
      JSON.stringify(post)
    );
  }
  viewEventMaster(post: any): Observable<any> {
    return this.http
      .post(
        this.apiURL + '/viewEventMaster',
        JSON.stringify(post)
      );
  }
  getEventMaster(id: number): Observable<any> {
    const allData = { id };
    return this.http.post(
      this.apiURL + '/getEventMaster', JSON.stringify(allData));
  }
  updateEventMaster(post: any) {
    return this.http.post(this.apiURL + '/updateEventMaster', JSON.stringify(post));
  }

  deleteEventMaster(id: number, userId: any,profileId:any): Observable<any> {
    return this.http.post(this.apiURL + '/deleteEventMaster', JSON.stringify({ 'encId': id, 'userId': userId,'profileId': profileId }))
    //  .pipe(tap(()=>{
    //    catchError(this.errorHandler)
    //  }));
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
