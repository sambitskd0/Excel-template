import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http'
import { catchError, Observable, Subject, throwError,tap } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ManageSubdesignationService {
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

  getDesignationName(levelId:any){
    return this.httpClient.post(
      this.apiURL + '/getDesignationName',JSON.stringify({levelId:levelId}),
      this.httpOptions
    )
  }
  addSubDesignation(post: any): Observable<any> {
    post.userId = this.userId;
    return this.httpClient.post(
      this.apiURL + '/addSubDesignation',
      JSON.stringify(post),
      this.httpOptions
    )
  }
  viewSubDesignation(post: any): Observable<any> {
    return this.httpClient
   .post(
     this.apiURL + '/viewSubDesignation',
     JSON.stringify(post),
     this.httpOptions
   )
   .pipe(catchError(this.errorHandler)); 
}
getSubDesignation(id: number): Observable<any> {
  const allData = {id};
  return this.httpClient.post(
    this.apiURL + '/getSubDesignation',JSON.stringify(allData))
} 
updateSubDesignation(post: any){
  post.userId = this.userId;
  return this.httpClient.post(this.apiURL + '/updateSubDesignation', JSON.stringify(post), this.httpOptions)
}
publishStatus(post: any){
  
  return this.httpClient.post(this.apiURL + '/SubDesgpublishStatus', JSON.stringify(post), this.httpOptions)
}
unPublishStatus(post: any){
  
  return this.httpClient.post(this.apiURL + '/SubDesgunPublishStatus', JSON.stringify(post), this.httpOptions)
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
