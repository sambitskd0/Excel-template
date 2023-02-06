import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { catchError, Observable, Subject, tap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ManageAppointSubjectService {
  private userProfile = JSON.parse(sessionStorage.getItem("userProfile") || '{}');
  private userId = this.userProfile.userId;
  private apiURL = environment.masterAPI;
  private refreshRequired = new Subject<void>();
  get RefreshRequired() {
    return this.refreshRequired;
  }

  // httpOptions = {
  //   headers: new HttpHeaders({
  //     'Content-Type': 'application/json',
  //   }),
  // }

  constructor(private httpClient : HttpClient) { }

   /* Created By  :  Swagatika ||  Created On  : 16-05-2022 || Component Name : ViewAppointSubjectComponent || Description: listing the appoint subject according to filter  */
   viewAppointSubject(post: any): Observable<any> {
    return this.httpClient
      .post(
        this.apiURL + '/viewAppointSubject',
        JSON.stringify(post)
      );
  }

  /* Created By  :  Swagatika ||  Created On  : 16-05-2022 || Component Name : AddAppointSubjectComponent || Description: add new of appoint subject  */
  createAppointSubject(post: any): Observable<any> {
    return this.httpClient.post(
      this.apiURL + '/addAppointSubject',
      JSON.stringify(post)
    );
  } 

  /* Created By  :  Swagatika ||  Created On  : 16-05-2022 || Component Name : EditAppointSubjectComponent || Description: get record by id for edit screen */
  // getAppointSubject(id: number) {
  //   return this.httpClient.get(
  //     this.apiURL + '/getAppointSubject/' + id,
  //     this.httpOptions
  //   );
  // }
  getAppointSubject(id: number): Observable<any> {
    const allData = {id};
    return this.httpClient.post(
      this.apiURL + '/getAppointSubject',JSON.stringify(allData))
  }

  /* Created By  :  Swagatika ||  Created On  : 16-05-2022 || Component Name : ViewAppointSubjectComponent || Description: listing the appoint subject according to filter  */

  updateAppointSubject(post: any) {
    return this.httpClient
      .post(
        this.apiURL + '/updateAppointSubject',
        JSON.stringify(post)
      );
  }

  /* Created By  :  Swagatika ||  Created On  : 16-05-2022 || Component Name : ViewAppointSubjectComponent || Description: listing the appoint subject according to filter  */

  deleteAppointSubject(id: number,userId:any,profileId:any): Observable<any> {
    return this.httpClient.post(this.apiURL + '/deleteAppointSubject',JSON.stringify({'encId':id, 'userId':userId,'profileId':profileId}));
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
