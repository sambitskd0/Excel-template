import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { catchError, Observable, Subject, throwError, tap } from 'rxjs';
import { environment } from 'src/environments/environment';



@Injectable({
  providedIn: 'root'
})
export class ShiftmasterService {
  private userProfile = JSON.parse(sessionStorage.getItem("userProfile") || '{}');
  private userId = this.userProfile.userId;
  private apiURL = environment.masterAPI;

  // httpOptions = {
  //       headers: new HttpHeaders({
  //     'Content-Type': 'application/json',
  //   }),
  // }

  constructor(private http: HttpClient) { }
  addshiftmaster(post: any): Observable<any> {
    post.userId = this.userId;
    return this.http.post(
      this.apiURL + '/addShiftMaster',
      JSON.stringify(post)
    );
  }
 
   viewShiftMaster(post:any):Observable<any>{
     return this.http.post(this.apiURL+'/viewShiftMaster',JSON.stringify(post))
     
   }

  getShiftMaster(id: number): Observable<any> {
    const allData = { id };
    return this.http.post(
      this.apiURL + '/getShiftMaster', JSON.stringify(allData));
  }
  updateShiftMaster(post: any) {
    post.userId = this.userId;
    return this.http.post(this.apiURL + '/updateShiftMaster', JSON.stringify(post));
  }

  deleteShiftMaster(id: number, userId: any,profileId:any): Observable<any> {
    return this.http.post(this.apiURL + '/deleteShiftMaster', JSON.stringify({ 'encId': id, 'userId': userId,'profileId':profileId }));
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
