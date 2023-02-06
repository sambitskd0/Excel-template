/**
* Created By  : Deepti Ranjan
* Created On  : 31-05-2022
* Module Name : Grievance
* Description : Managing services for add, view, delete, edit and search actions of Grievance Sub Category.
**/

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject,throwError,catchError } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ManageSubCategoryService {

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

  /* Created By : Deepti Ranjan || Created On : 31-05-2022 || Service method Name : addSubCategory || Description: Add Sub Category */
  addSubCategory(post:any):Observable<any>{
    post.userId = this.userId;
    return this.httpClient.post(this.apiURL + '/addSubCategory', JSON.stringify(post), this.httpOptions);    
  }

  /* Created By : Deepti Ranjan || Created On : 31-05-2022 || Service method Name : viewSubCategory || Description: Show all sub category in view page */
  viewSubCategory(post: any): Observable<any> {
    return this.httpClient.post(this.apiURL + '/viewSubCategory', JSON.stringify(post), this.httpOptions); 
  }

  /* Created By : Deepti Ranjan || Created On : 31-05-2022 || Service method Name : deleteSubCategory || Description: To delete sub category */
  deleteSubCategory(id:any,userId:any, profileId:any){
    return this.httpClient.post(this.apiURL + '/deleteSubCategory', JSON.stringify({'encId':id, 'userId':this.userId, 'profileId': profileId}), this.httpOptions)
    .pipe(tap(()=>{
      this.RefreshRequired.next();
    }));
  }

  /* Created By : Deepti Ranjan || Created On : 31-05-2022 || Service method Name : getSubCategoryDetails || Description: Show sub category details in edit page */
  getSubCategoryDetails(id: number): Observable<any> {
    const allData = {id};
    return this.httpClient.post(this.apiURL + '/getSubCategoryDetails',JSON.stringify(allData));
  }

  /* Created By : Deepti Ranjan || Created On : 31-05-2022 || Service method Name : updateSubCategory || Description: update sub category details */
  updateSubCategory(post:any){
    post.userId = this.userId;
    return this.httpClient.post(this.apiURL + '/updateSubCategory', JSON.stringify(post), this.httpOptions);    
  }

  /* Created By : Deepti Ranjan || Created On : 01-06-2022 || Service method Name : getSubCategoryByCatId || Description: Show all sub category in dropdown */
  getSubCategoryByCatId(categoryId: any){  
    return this.httpClient.post(this.apiURL + '/getSubCategoryByCatId',JSON.stringify({categoryId}), this.httpOptions);    
  }

  /* Created By : Deepti Ranjan || Created On : 27-06-2022 || Service method Name : getGrievanceSubCategory || Description: Show all sub category in dropdown which are set in configuration */
  getGrievanceSubCategory(categoryId: any){  
    return this.httpClient.post(this.apiURL + '/getGrievanceSubCategory',JSON.stringify({categoryId}), this.httpOptions);    
  }
  
}



