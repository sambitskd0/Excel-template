import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { catchError, Observable, Subject, throwError, tap } from 'rxjs';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class ManageEventCategoryService {
  private userProfile = JSON.parse(sessionStorage.getItem("userProfile") || '{}');
  private userId = this.userProfile.userId;
  private apiURL = environment.masterAPI;
  //   httpOptions = {
  //     headers: new HttpHeaders({
  //   'Content-Type': 'application/json',
  // }),
  //   }

  constructor(private http: HttpClient) { }
  getEventType() {
    const allData = {};
    return this.http.post(
      this.apiURL + '/getEvent', JSON.stringify(allData)
    );
  }

  getEventTypeById(id: number): Observable<any> {
    const allData = { id };
    return this.http.post(
      this.apiURL + '/getEvent', JSON.stringify(allData));
  }
  addEventCategory(post: any): Observable<any> {
    post.userId = this.userId;
    return this.http.post(
      this.apiURL + '/addEventCategory',
      JSON.stringify(post)
    );
  }
  viewEventCategory(post: any): Observable<any> {
    return this.http
      .post(
        this.apiURL + '/viewEventCategory',
        JSON.stringify(post)
      );
  }

  getEventCategory(id: number): Observable<any> {
    const allData = { id };
    return this.http.post(
      this.apiURL + '/getEventCategory', JSON.stringify(allData));
  }
  updateEventCategory(post: any) {
    post.userId = this.userId;
    return this.http.post(this.apiURL + '/updateEventCategory', JSON.stringify(post));
  }

  deleteEventCategory(id: number, userId: any,profileId:any): Observable<any> {
    return this.http.post(this.apiURL + '/deleteEventCategory', JSON.stringify({ 'encId': id, 'userId': userId,'profileId': profileId }));

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
