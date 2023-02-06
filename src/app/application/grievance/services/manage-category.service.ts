/**
* Created By  : Deepti Ranjan
* Created On  : 26-05-2022
* Module Name : Grievance
* Description : Managing services for add, view, delete, edit and search actions of Grievance Category.
**/

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, Subject, throwError } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class ManageCategoryService {

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

  /* Created By : Deepti Ranjan || Created On : 26-05-2022 || Service method Name : addCategory || Description: Add Category */
  addCategory(post:any):Observable<any>{
    post.userId = this.userId;
    return this.httpClient.post(this.apiURL + '/addCategory', JSON.stringify(post), this.httpOptions);    
  }

  /* Created By : Deepti Ranjan || Created On : 26-05-2022 || Service method Name : viewCategory || Description: Show all category in view page */
  viewCategory(post: any): Observable<any> {
    return this.httpClient.post(this.apiURL + '/viewCategory', JSON.stringify(post), this.httpOptions); 
  }

  /* Created By : Deepti Ranjan || Created On : 30-05-2022 || Service method Name : getCategoryDetails || Description: Show category details in edit page */
  getCategoryDetails(id: number): Observable<any> {
    const allData = {id};
    return this.httpClient.post(this.apiURL + '/getCategoryDetails',JSON.stringify(allData));
  }

  /* Created By : Deepti Ranjan || Created On : 30-05-2022 || Service method Name : updateCategory || Description: update category details */
  updateCategory(post:any){
    post.userId = this.userId;
    return this.httpClient.post(this.apiURL + '/updateCategory', JSON.stringify(post), this.httpOptions);    
  }

  /* Created By : Deepti Ranjan || Created On : 30-05-2022 || Service method Name : deleteCategory || Description: To delete category */
  deleteCategory(id:any,userId:any, profileId:any){
    return this.httpClient.post(this.apiURL + '/deleteCategory', JSON.stringify({'encId':id, 'userId':this.userId, 'profileId':profileId}), this.httpOptions)
    .pipe(tap(()=>{
      this.RefreshRequired.next();
    }));
  }

  /* Created By : Deepti Ranjan || Created On : 31-05-2022 || Service method Name : getAllCategory || Description: Show all category in dropdown */
  getAllCategory():Observable<any>{
    return this.httpClient.post(this.apiURL + '/getAllCategory', this.httpOptions);    
  }

  /* Created By : Deepti Ranjan || Created On : 27-06-2022 || Service method Name : getGrievanceCategory || Description: Show all category in dropdown which are set in configuration */
  getGrievanceCategory():Observable<any>{
    return this.httpClient.post(this.apiURL + '/getGrievanceCategory', this.httpOptions);    
  }
  
}
