import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http'
import { catchError, Observable, Subject, throwError,tap } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ManageDesignationService {
  private userProfile = JSON.parse(
    sessionStorage.getItem("userProfile") || "{}"
  );
  private userId = this.userProfile.userId;
  private apiURL = environment.profileAPI;

  httpOptions = {
    headers: new HttpHeaders({
      "Content-Type": "application/json",
    }),
  };
  constructor(private httpClient: HttpClient) { }

  addDesignation(post: any): Observable<any> {
    post.userId = this.userId;
    return this.httpClient.post(
      this.apiURL + '/addDesignation',
      JSON.stringify(post),
      this.httpOptions
    )
  }
  viewDesignationList(post: any): Observable<any> {
    return this.httpClient
   .post(
     this.apiURL + '/viewDesignationList',
     JSON.stringify(post),
     this.httpOptions
   )
   .pipe(catchError(this.errorHandler)); 
}
getDesignation(id: number): Observable<any> {
  const allData = {id};
  return this.httpClient.post(
    this.apiURL + '/getDesignation',JSON.stringify(allData))
} 
updateDesignation(post: any){
  post.userId = this.userId;
  return this.httpClient.post(this.apiURL + '/updateDesignation', JSON.stringify(post), this.httpOptions)
}

publishStatus(post: any){
  
  return this.httpClient.post(this.apiURL + '/publishStatus', JSON.stringify(post), this.httpOptions)
}
unPublishStatus(post: any){
  
  return this.httpClient.post(this.apiURL + '/unPublishStatus', JSON.stringify(post), this.httpOptions)
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
