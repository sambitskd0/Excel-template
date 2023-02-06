import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http'
import { catchError, Observable, Subject, throwError,tap } from 'rxjs';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class ManageEventTypeService {
  private userProfile = JSON.parse(sessionStorage.getItem("userProfile") || '{}');
  private userId = this.userProfile.userId;
  private apiURL = environment.masterAPI;
  
//   httpOptions = {
//     headers: new HttpHeaders({
//   'Content-Type': 'application/json',
// }),
// }

  constructor(private http:HttpClient) { }
  addEventType(post: any): Observable<any> {
    post.userId = this.userId;
    return this.http.post(
      this.apiURL + '/addEventType',
      JSON.stringify(post)
    );
  }
 
  viewEventType(post: any): Observable<any> {
    return this.http
   .post(
     this.apiURL + '/viewEventType',
     JSON.stringify(post)
   );
}
  
  getEventType(id: number): Observable<any> {
    const allData = {id};
    return this.http.post(
      this.apiURL + '/getEventType',JSON.stringify(allData));
  }
  updateEventType(post: any){
    post.userId = this.userId;
    return this.http.post(this.apiURL + '/updateEventType', JSON.stringify(post));
  }
 
   
  deleteEventType(id: number,userId:any,profileId:any): Observable<any> {
    return this.http.post(this.apiURL + '/deleteEventType',JSON.stringify({'encId':id, 'userId':userId,'profileId':profileId}));
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
  //   return throwError(() => new Error(errorMessage));
  // }
}
