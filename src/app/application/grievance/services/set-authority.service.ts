/**
* Created By  : Deepti Ranjan
* Created On  : 17-06-2022
* Module Name : Grievance
* Description : Managing services related to set authority link.
**/
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject,throwError,catchError } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SetAuthorityService {

  private userProfile = JSON.parse(sessionStorage.getItem("userProfile") || '{}');
  private userId = this.userProfile.userId;

  private apiURL = environment.grievanceAPI;
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }

  constructor(private httpClient: HttpClient) { }

  /* Created By : Deepti Ranjan || Created On : 17-06-2022 || Service method Name : setAuthority || Description: add and update authority level */
  setAuthority(post:any):Observable<any>{
    post.userId = this.userId;
    return this.httpClient.post(this.apiURL + '/setAuthority', JSON.stringify(post), this.httpOptions);    
  }

  /* Created By : Deepti Ranjan || Created On : 20-06-2022 || Service method Name : getAuthorityLevel || Description: Get existing authority levels of chosen subject */
  getAuthorityLevel(post:any):Observable<any>{
    post.userId = this.userId;
    return this.httpClient.post(this.apiURL + '/getAuthorityLevel', JSON.stringify(post), this.httpOptions);    
  }

  /* Created By : Deepti Ranjan || Created On : 20-06-2022 || Service method Name : viewSetAuthority || Description: Show all set authority in view page */
  // viewSetAuthority(post: any, dataTable: any):Observable<any>{
  //   return this.httpClient.post(this.apiURL + '/viewSetAuthority', Object.assign(dataTable, post) );    
  // }
  viewSetAuthority(post: any): Observable<any> {
    return this.httpClient
   .post(
     this.apiURL + '/viewSetAuthority',
     JSON.stringify(post),
     this.httpOptions
   )
   .pipe(catchError(this.errorHandler)); 
}
errorHandler(error: any) {
  let errorMessage = '';
  if (error.error instanceof ErrorEvent) {
    errorMessage = error.error.message;
  } else {
    errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
  }
  return throwError(() => new Error(errorMessage));
}
}
