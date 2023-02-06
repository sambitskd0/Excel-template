import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from "src/environments/environment";
import {  Observable, Subject, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class ManageLeaveTypeService {
  private userProfile = JSON.parse(sessionStorage.getItem("userProfile") || '{}');
  private userId = this.userProfile.userId;
  constructor(private httpClient: HttpClient) {}
  private masterAPI = environment.masterAPI;
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


  getLeaveType() {
    const anxtType = "LEAVE_TYPE";
    return this.httpClient.post(
      this.masterAPI + "/getAnnexture",
      JSON.stringify({ anxtType }),
      this.httpOptions
    );
  }

  /**View Leave Type as per filter, By: Ayasakanta Swain, On: 24-Jun-2022, Component Name : ViewLeaveTypeComponent **/  
  viewLeaveType(post: any): Observable<any> {
    return this.httpClient
    .post(
      this.apiURL + '/viewLeaveType',
      JSON.stringify(post),
      this.httpOptions
    )
    .pipe(catchError(this.errorHandler)); 
  }

  /**Delete Leave Type, By: Ayasakanta Swain, On: 24-Jun-2022, Component Name : ViewLeaveTypeComponent **/
  deleteLeaveType(encId:any,userId:any,profileId:any){
    return this.httpClient.post(this.apiURL + '/deleteLeaveType', JSON.stringify({'encId':encId, 'userId':userId,'profileId':profileId}), this.httpOptions)
    .pipe(tap(()=>{
      this.RefreshRequired.next();
    }));
  }  


   /**Add LeaveType, By: Ayasakanta Swain, On: 24-Jun-2022, Component Name : AddLeaveTypeComponent **/  
  createLeaveType(post: any): Observable<any> {
    return this.httpClient.post(
      this.apiURL + '/addLeaveType',
      JSON.stringify(post),
      this.httpOptions
    )
  } 


  /**Update Leave Type, By: Ayasakanta Swain, On: 24-Jun-2022, Component Name : EditLeaveTypeComponent **/  
  updateLeaveType(post: any): Observable <any> {
    return this.httpClient
      .post(
        this.apiURL + '/updateLeaveType',
        JSON.stringify(post),
        this.httpOptions
      )  
  }


    /**View Leave Type as per id, By: Ayasakanta Swain, On: 24-Jun-2022, Component Name : EditLeaveTypeComponent **/  
    readLeaveType(encId:string) {
      return this.httpClient.post(
        this.apiURL + '/readLeaveType',
        JSON.stringify({encId:encId}),
        this.httpOptions,
      )
      .pipe(catchError(this.errorHandler))
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
