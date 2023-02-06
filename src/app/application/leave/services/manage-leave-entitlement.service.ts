import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { Observable, Subject, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ManageLeaveEntitlementService {
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

  /**View Leave Entitlement as per filter, By: Ayasakanta Swain, On: 26-Jun-2022, Component Name : viewLeaveEntitlement **/  
  viewLeaveEntitlement(post: any): Observable<any> {
    return this.httpClient
    .post(
      this.apiURL + '/viewLeaveEntitlement',
      JSON.stringify(post),
      this.httpOptions
    )
    .pipe(catchError(this.errorHandler)); 
  }

  /**Delete Leave Type, By: Ayasakanta Swain, On: 26-Jun-2022, Component Name : viewLeaveEntitlement **/
  deleteLeaveEntitlement(encId:any,userId:any,profileId:any){
    return this.httpClient.post(this.apiURL + '/deleteLeaveEntitlement', JSON.stringify({'encId':encId, 'userId':this.userId,'profileId':profileId}), this.httpOptions)
    .pipe(tap(()=>{
      this.RefreshRequired.next();
    }));
  }  

  /**View Approval Process as per id, By: Ayasakanta Swain, On: 27-Jun-2022, Component Name : viewLeaveEntitlement **/  
  viewLvApprovalProcess(encId:string) {
    return this.httpClient.post(
      this.apiURL + '/viewLvApprovalProcess',
      JSON.stringify({encId:encId}),
      this.httpOptions,
    )
    .pipe(catchError(this.errorHandler))
  }


   /**Add LeaveEntitlement, By: Ayasakanta Swain, On: 27-Jun-2022, Component Name : AddLeaveEntitlementComponent **/  
   createLeaveEntitlement(post: any): Observable<any> {
    return this.httpClient.post(
      this.apiURL + '/addLeaveEntitlement',
      JSON.stringify(post),
      this.httpOptions
    )
  } 


  /**Update Leave Entitlement, By: Ayasakanta Swain, On: 27-Jun-2022, Component Name : EditLeaveEntitlementComponent **/  
  updateLeaveEntitlement(post: any): Observable <any> {
    return this.httpClient
      .post(
        this.apiURL + '/updateLeaveEntitlement',
        JSON.stringify(post),
        this.httpOptions
      )  
  }
    
  /**View Leave Entitlement as per id, By: Ayasakanta Swain, On: 27-Jun-2022, Component Name : EditLeaveEntitlementComponent **/  
  readLeaveEntitlement(encId:string) {
    return this.httpClient.post(
      this.apiURL + '/readLeaveEntitlement',
      JSON.stringify({encId:encId}),
      this.httpOptions,
    )
    .pipe(catchError(this.errorHandler))
  }

    /**Get only single user designtaion list, By: Ayasakanta Swain, On: 22-Sep-2022, Component Name : viewLeaveEntitlement **/  
    getDesignationSingleUser(levelId: any): Observable<any> {
      return this.httpClient
      .post(
        this.apiURL + '/getDesignationSingleUser',
        JSON.stringify({levelId:levelId}),
        this.httpOptions
      )
      .pipe(catchError(this.errorHandler)); 
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