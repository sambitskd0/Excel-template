import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { Observable, Subject, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ApproveLeaveService {

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


   /**View Leaves as per filter, By: Ayasakanta Swain, On: 14-Jul-2022, Component Name : ApproveLeaveComponent **/  
   viewLeavesList(post: any): Observable<any> {
    post.teacherId        = this.userProfile.loginId;
    post.userId           = this.getUserProfile()?.userId; 
    post.designationId    = this.userProfile.designationId;
    post.loginUserType    = this.userProfile.loginUserType; 
    post.school           = this.userProfile.school;
    return this.httpClient
    .post(
      this.apiURL + '/viewLeavesList',
      JSON.stringify(post),
      this.httpOptions
    )
    .pipe(catchError(this.errorHandler)); 
  }


  /**Add leave Take Action, By: Ayasakanta Swain, On: 18-Jul-2022, Component Name : ApproveLeaveComponent **/  
  leaveTakeAction(post: any, typeId: any): Observable<any> {
    post.userId = this.getUserProfile()?.userId; 
    post.profileId = this.getUserProfile()?.profileId; 
    post.typeId = typeId;
    return this.httpClient.post(
      this.apiURL + '/leaveTakeAction',
      JSON.stringify(post),
      this.httpOptions
    )
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
