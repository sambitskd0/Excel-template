import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from "src/environments/environment";
import {  Observable, Subject, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class ManageLeaveApplyService {
  
  private userProfile = JSON.parse(sessionStorage.getItem("userProfile") || '{}');
  constructor(private httpClient: HttpClient) {}
  private apiURL    = environment.leaveAPI;

  private refreshRequired = new Subject<void>();
  get RefreshRequired() {
    return this.refreshRequired;
  }
  
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };  

  getUserProfile() {
    let userProfile: any = sessionStorage.getItem("userProfile");
    userProfile = JSON.parse(userProfile);
    return userProfile;
  }


  /**Add LeaveApply, By: Ayasakanta Swain, On: 28-Jun-2022, Component Name : AddLeaveApplyComponent **/  
  createLeaveApply(post: any): Observable<any> {
    post.userId = this.getUserProfile()?.userId;
    post.profileId = this.getUserProfile()?.profileId;
    return this.httpClient.post(
      this.apiURL + '/addLeaveApply',
      JSON.stringify(post),
      this.httpOptions
    )
  } 

  /**View Leave Apply as per filter, By: Ayasakanta Swain, On: 30-Jun-2022, Component Name : ViewLeaveApplyComponent **/  
  viewLeaveApply(post: any): Observable<any> {
    post.teacherId = this.userProfile.loginId;
    post.userId    = this.getUserProfile()?.userId;
    return this.httpClient
    .post(
      this.apiURL + '/viewLeaveApply',
      JSON.stringify(post),
      this.httpOptions
    )
    .pipe(catchError(this.errorHandler)); 
  }

  /**Cancel Leave Type, By: Ayasakanta Swain, On: 01-Jul-2022, Component Name : ViewLeaveApplyComponent **/
  cancelLeave(encId:any ,userId:any,profileId:any){
    return this.httpClient.post(this.apiURL + '/cancelLeave', JSON.stringify({'encId':encId, 'userId':this.getUserProfile()?.userId,'profileId':profileId}), this.httpOptions)
    .pipe(tap(()=>{
      this.RefreshRequired.next();
    }));
  }  

  /**Get Leave Balance, By: Ayasakanta Swain, On: 06-Jul-2022, Component Name : AddLeaveApplyComponent **/  
  getLeaveBalance(leaveType: any, teacherid: any) {
    return this.httpClient.post(
      this.apiURL + "/getLeaveBalance",
      JSON.stringify({ leaveType, teacherid }),
      this.httpOptions
    );
  }


  /**Get teacher list, By: Ayasakanta Swain, On: 08-Jul-2022, Component Name : AddLeaveApplyComponent **/  
  getTeachersList(schoolId: any, teaherId : any, excludeHM : any) {
    return this.httpClient.post(
      this.apiURL + "/getTeachersList",
      JSON.stringify({ schoolId, teaherId, excludeHM }),
      this.httpOptions
    );
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
