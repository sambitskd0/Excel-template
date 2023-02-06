import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from "src/environments/environment";
import {  Observable, Subject, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ManageOpeningBalanceService {
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

   /**Add Opening Balance, By: Ayasakanta Swain, On: 18-Aug-2022, Component Name : AddOpeningBalanceComponent **/  
   createOpeningBalance(post: any): Observable<any> {
    post.userId = this.getUserProfile()?.userId;
    post.profileId = this.getUserProfile()?.profileId;
    return this.httpClient.post(
      this.apiURL + '/addOpeningBalance',
      JSON.stringify(post),
      this.httpOptions
    )
  } 

  /**View Opening Balance as per filter, By: Ayasakanta Swain, On: 18-Aug-2022, Component Name : ViewOpeningBalanceComponent **/  
  viewOpeningBalance(post: any): Observable<any> {
    post.school           = this.userProfile.school;
    post.block            = this.userProfile.block;
    return this.httpClient
    .post(
      this.apiURL + '/viewOpeningBalance',
      JSON.stringify(post),
      this.httpOptions
    )
    .pipe(catchError(this.errorHandler)); 
  }

  /**Get Leave Balance, By: Ayasakanta Swain, On: 19-Aug-2022, Component Name : AddOpeningBalanceComponent **/  
  getLeaveEntitlement(leaveType: any, teacherid: any) {
    return this.httpClient.post(
      this.apiURL + "/getLeaveEntitlement",
      JSON.stringify({ leaveType, teacherid }),
      this.httpOptions
    );
  }


  /**Update OpeningBalance, By: Ayasakanta Swain, On: 19-Aug-2022, Component Name : EditOpeningBalanceComponent **/  
  updateOpeningBalance(post: any): Observable <any> {
    post.userId = this.getUserProfile()?.userId;
    post.profileId = this.getUserProfile()?.profileId;
    return this.httpClient
      .post(
        this.apiURL + '/updateOpeningBalance',
        JSON.stringify(post),
        this.httpOptions
      )  
  }


    /**View Opening Balance as per id, By: Ayasakanta Swain, On: 19-Aug-2022, Component Name : EditOpeningBalanceComponent **/  
    readOpeningBalance(encId:string) {
      return this.httpClient.post(
        this.apiURL + '/readOpeningBalance',
        JSON.stringify({encId:encId}),
        this.httpOptions,
      )
      .pipe(catchError(this.errorHandler))
    }

    getSchool(clusterId: any) {
      let blockId            = this.userProfile.block;
      return this.httpClient.post(
        this.apiURL + "/getSchool",
        JSON.stringify({ clusterId, blockId }),
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
