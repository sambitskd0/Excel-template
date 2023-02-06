/**
* Created By  : Deepti Ranjan
* Created On  : 15-07-2022
* Module Name : Teacher
* Description : Managing services for teacher transfer.
**/

import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable, Subject, throwError } from 'rxjs';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { catchError, tap } from "rxjs/operators";


@Injectable({
  providedIn: 'root'
})
export class TeacherTransferService {
  private userProfile = JSON.parse(sessionStorage.getItem("userProfile") || '{}');

  private refreshRequired = new Subject<void>();
  get RefreshRequired() {
    return this.refreshRequired;
  }
  
  private teacherAPI = environment.teacherAPI;

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      "skipInterCept": "true"
    })
  }
  constructor(private httpClient: HttpClient) { }

  getUserProfile() {
    let userProfile: any = sessionStorage.getItem("userProfile");
    userProfile = JSON.parse(userProfile);
    return userProfile;
  }


  /* Created By : Deepti Ranjan || Created On : 15-07-2022 || Service method Name : raiseTransferRequest || Description: Raise Transfer Request by teacher */
  raiseTransferRequest(post:any):Observable<any>{
    post.userId = this.getUserProfile()?.userId;
    return this.httpClient.post(this.teacherAPI + '/raiseTransferRequest', JSON.stringify(post))
    .pipe(catchError(this.errorHandler));
  }

  /* Created By : Ayasakanta Swain || Created On : 09-Jan-2023 || Service method Name : transferList || Description: View all Transfer list for take action */
  transferList(params: object):Observable<any>{
    return this.httpClient.post(this.teacherAPI + '/transferList', params)
    .pipe(catchError(this.errorHandler));  
  }

  /* Created By : Ayasakanta Swain || Created On : 10-Jan-2023 || Service method Name : transferTakeAction || Description: transfer take action */
  transferTakeAction(post: any, typeId: any): Observable<any> {
    post.userId = this.getUserProfile()?.userId;
    post.typeId = typeId;
    return this.httpClient.post(
      this.teacherAPI + '/transferTakeAction',
      JSON.stringify(post),
      this.httpOptions
    )
  } 


  /* Created By : Deepti Ranjan || Created On : 18-07-2022 || Service method Name : viewTransferRequest || Description: View all Transfer Request made by teacher */
  viewTransferRequest(params: object):Observable<any>{
    return this.httpClient.post(this.teacherAPI + '/viewTransferRequest', params)
    .pipe(catchError(this.errorHandler));  
  }
  viewTeacherByHeadMaster(params: object):Observable<any>{
    //console.log(params);
    return this.httpClient.post(this.teacherAPI + '/viewTeacherByHeadMaster', params)
    .pipe(catchError(this.errorHandler));  
  }
  viewTeacherTransferByHeadMaster(params: object):Observable<any>{
    console.log(params);
    return this.httpClient.post(this.teacherAPI + '/viewTeacherTransferByHeadMaster', params)
    .pipe(catchError(this.errorHandler));  
  }
  TransferRequestByHeadMaster(post:any){
    post.userId = this.getUserProfile()?.userId;
    post.blockId = this.getUserProfile()?.block;  
    post.distId  = this.getUserProfile()?.district;
    return this.httpClient.post(this.teacherAPI + '/transferRequestByHeadMaster', JSON.stringify(post))
    .pipe(catchError(this.errorHandler));  
  }
  getTeacherListByHeadMaster(params:Object) {
    return this.httpClient.post(
      this.teacherAPI + "/getTeacherListByHeadMaster",
      JSON.stringify({ params })
    );
  }
  submitTeacherListByHeadMaster(params:Object) {
    console.log(params);
    
    return this.httpClient.post(
      this.teacherAPI + "/submitTeacherListByHeadMaster",
      JSON.stringify({ params })
    );
  }
  /* Created By : Deepti Ranjan || Created On : 19-07-2022 || Service method Name : deleteTransferRequest || Description: To delete Transfer Request */
  deleteTransferRequest(id:any){
    return this.httpClient.post(this.teacherAPI + '/deleteTransferRequest', JSON.stringify({'encId':id, 'userId':this.getUserProfile()?.userId}))
    .pipe(catchError(this.errorHandler)); 
  }

  getTransferDetails(encId: any){
    return this.httpClient.post(this.teacherAPI + '/getTransferDetails', JSON.stringify({ encId: encId }))
    .pipe(catchError(this.errorHandler));  
  }
  /* Created By : Deepti Ranjan || Created On : 19-07-2022 || Service method Name : updateTransferRequest || Description: update Transfer Request details */
  updateTransferRequest(post:any){
    post.userId = this.getUserProfile()?.userId;
    return this.httpClient.post(this.teacherAPI + '/updateTransferRequest', JSON.stringify(post))
    .pipe(catchError(this.errorHandler));  
  }

  /* Created By : Deepti Ranjan || Created On : 20-07-2022 || Service method Name : getTransferStatusDetails || Description: Show Transfer Request and status details in pop up page */
  getTransferStatusDetails(encId: any){
    return this.httpClient.post(this.teacherAPI + '/getTransferStatusDetails', JSON.stringify({ encId: encId }))  
    .pipe(catchError(this.errorHandler));   
  }


  deleteTeacherTransferByHeadMaster(postParams: any) {
    return this.httpClient
      .post(this.teacherAPI + "/deleteTeacherTransferByHeadMaster", postParams)
      ;
  }
  /* Created By : Deepti Ranjan || Created On : 25-07-2022 || Service method Name : forwardTransferRequest || Description: forward Transfer Request */
  forwardTransferRequest(post:any){
    post.userId  = this.getUserProfile()?.userId;
    post.blockId = this.getUserProfile()?.block;  
    post.distId  = this.getUserProfile()?.district;
    return this.httpClient.post(this.teacherAPI + '/forwardTransferRequest', JSON.stringify(post))
    .pipe(catchError(this.errorHandler));  
  }

  /* Created By : Deepti Ranjan || Created On : 25-07-2022 || Service method Name : rejectTransferRequest || Description: reject Transfer Request */
  rejectTransferRequest(post:any){
    post.userId = this.getUserProfile()?.userId;
    return this.httpClient.post(this.teacherAPI + '/rejectTransferRequest', JSON.stringify(post))
    .pipe(catchError(this.errorHandler));      
  }



  // getTeachersList(schoolId: any, excludeHM : any) {
  //   return this.httpClient.post(
  //     this.teacherAPI + "/getTeachersList",
  //     JSON.stringify({ schoolId, excludeHM }),
  //     this.httpOptions
  //   );
  // }

  getTeachersList(schoolId: any, excludeHM : any){
    return this.httpClient.post(this.teacherAPI + '/getTeachersList', JSON.stringify({ schoolId: schoolId, excludeHM : excludeHM}))
    .pipe(catchError(this.errorHandler));  
  }  
  // getSchoolCategory(schoolCategoryId: any) {
  //   return this.httpClient.post(this.teacherAPI + '/getSchoolCategory', JSON.stringify({schoolCategoryId:schoolCategoryId}));
  // }

  viewTeacherForRelieve(params: object):Observable<any>{
    return this.httpClient.post(this.teacherAPI + '/viewTeacherForRelieve', params)
    .pipe(catchError(this.errorHandler));  
  }
  viewTeacherForJoining(params: object):Observable<any>{
    return this.httpClient.post(this.teacherAPI + '/viewTeacherForJoining', params)
    .pipe(catchError(this.errorHandler));  
  }
  viewTeacherDetails(post: any): Observable<any> {    
    return this.httpClient.post(this.teacherAPI + "/viewTeacherDetails",Object.assign(post)).pipe(catchError(this.errorHandler));
  }
  updateRelieveDate(post: any): Observable<any> {
    post.userId =  this.getUserProfile()?.userId;
    return this.httpClient.post(
      this.teacherAPI + '/updateRelieveDate',
      JSON.stringify(post)
    )
  }
  updateJoiningDate(post: any): Observable<any> {
    post.userId =  this.getUserProfile()?.userId;
    return this.httpClient.post(
      this.teacherAPI + '/updateJoiningDate',
      JSON.stringify(post)
    )
  }
  teacherListForBlock(params: object):Observable<any>{
    return this.httpClient.post(this.teacherAPI + '/teacherListForBlock', params)
    .pipe(catchError(this.errorHandler));  
  }
  transferTakeActionByBlock(post: any): Observable<any> {
    post.userId = this.getUserProfile()?.userId;
    return this.httpClient.post(
      this.teacherAPI + '/transferTakeActionByBlock',
      JSON.stringify(post)
    )
  }
  getSchoolCategory() {
    return this.httpClient.post(this.teacherAPI + '/getSchoolCategory', this.httpOptions)
  }
  transferTakeDeleteAction(post: any): Observable<any> {
    post.userId = this.getUserProfile()?.userId;
    return this.httpClient.post(
      this.teacherAPI + '/transferTakeDeleteAction',
      JSON.stringify(post)
    )
  }  
  addNotification(post: any): Observable<any> {
    post.userId = this.getUserProfile()?.userId;
    return this.httpClient.post(
      this.teacherAPI + '/addNotification',
      JSON.stringify(post)
    )
  }
  viewNotification(post: any): Observable<any> {
    post.userId = this.getUserProfile()?.userId;
    return this.httpClient.post(
      this.teacherAPI + '/viewNotification',
      JSON.stringify(post)
    )
  }  
  errorHandler(error: any) {
		let errorMessage = "";
		if (error.error instanceof ErrorEvent) {
			errorMessage = error.error.message;
		} else {
			errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
		}
		return throwError(() => new Error(errorMessage));
	}

}