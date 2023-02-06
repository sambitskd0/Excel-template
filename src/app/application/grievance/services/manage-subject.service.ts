/**
* Created By  : Deepti Ranjan
* Created On  : 01-06-2022
* Module Name : Grievance
* Description : Managing services for add, view, delete, edit and search actions of Grievance Subject.
**/

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject,throwError,catchError } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ManageSubjectService {
  
  private userProfile = JSON.parse(sessionStorage.getItem("userProfile") || '{}');
  private userId = this.userProfile.userId;

  private refreshRequired = new Subject<void>();
  get RefreshRequired() {
    return this.refreshRequired;
  }
  
  private apiURL = environment.grievanceAPI;
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }
  
  constructor(private httpClient: HttpClient) { }

  /* Created By : Deepti Ranjan || Created On : 01-06-2022 || Service method Name : addSubject || Description: Add Subject */
  addSubject(post:any):Observable<any>{
    post.userId = this.userId;
    return this.httpClient.post(this.apiURL + '/addSubject', JSON.stringify(post), this.httpOptions);    
  }

  /* Created By : Deepti Ranjan || Created On : 01-06-2022 || Service method Name : viewSubject || Description: Show all subject in view page */
  // viewSubject():Observable<any>{
  //   return this.httpClient.get(this.apiURL + '/viewSubject', this.httpOptions);    
  // }
  viewSubject(post: any): Observable<any> {
    return this.httpClient
   .post(
     this.apiURL + '/viewSubject',
     JSON.stringify(post),
     this.httpOptions
   )
   .pipe(catchError(this.errorHandler)); 
}

  /* Created By : Deepti Ranjan || Created On : 01-06-2022 || Service method Name : deleteSubject || Description: To delete subject */
  deleteSubject(id:any,userId:any, profileId:any){
    return this.httpClient.post(this.apiURL + '/deleteSubject', JSON.stringify({'encId':id, 'userId':this.userId, 'profileId': profileId}), this.httpOptions)
    .pipe(tap(()=>{
      this.RefreshRequired.next();
    }));
  }

  /* Created By : Deepti Ranjan || Created On : 01-06-2022 || Service method Name : getSubjectDetails || Description: Show subject details in edit page */
  // getSubjectDetails(id: any):Observable<any>{
  //   return this.httpClient.get(this.apiURL + '/getSubjectDetails/'+ id, this.httpOptions);    
  // }
  getSubjectDetails(id: number): Observable<any> {
    const allData = {id};
    return this.httpClient.post(
      this.apiURL + '/getSubjectDetails',JSON.stringify(allData))
  }

  /* Created By : Deepti Ranjan || Created On : 01-06-2022 || Service method Name : updateSubject || Description: update subject details */
  updateSubject(post:any){
    post.userId = this.userId;
    return this.httpClient.post(this.apiURL + '/updateSubject', JSON.stringify(post), this.httpOptions);    
  }

  /* Created By : Deepti Ranjan || Created On : 16-06-2022 || Service method Name : getSubjectBySubCatId || Description: Show sub category wise subjects in dropdown */
  getSubjectBySubCatId(subCategoryId: any){  
    return this.httpClient.post(this.apiURL + '/getSubjectBySubCatId',JSON.stringify({subCategoryId}), this.httpOptions);    
  }

  /* Created By : Deepti Ranjan || Created On : 27-06-2022 || Service method Name : getGrievanceSubject || Description: Show sub category wise subjects in dropdown which are set in configuration */
  getGrievanceSubject(subCategoryId: any){  
    return this.httpClient.post(this.apiURL + '/getGrievanceSubject',JSON.stringify({subCategoryId}), this.httpOptions);    
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
