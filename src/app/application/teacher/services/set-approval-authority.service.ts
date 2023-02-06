import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { Observable, Subject, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SetApprovalAuthorityService {
  private userProfile = JSON.parse(sessionStorage.getItem("userProfile") || '{}');
  private userId = this.userProfile.userId;
  constructor(private httpClient: HttpClient) {}
  private apiURL    = environment.teacherAPI;

  private refreshRequired = new Subject<void>();
  get RefreshRequired() {
    return this.refreshRequired;
  }
  
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };
   /**Add Appral Authority, By: Sonali Jena, On: 02-Jan-2023, Component Name : SetApprovalAuthority **/  
   setApprovalAuthority(post: any): Observable<any> {
    post.userId = this.userId;
    return this.httpClient.post(
      this.apiURL + '/setApprovalAuthority',
      JSON.stringify(post),
      this.httpOptions
    )
  } 
  
    /**Get only single user designtaion list, By: Sonali Jena, On: 02-Jan-2023, Component Name : SetApprovalAuthority **/  
    getDesignationSingleUser(levelId: any): Observable<any> {
      return this.httpClient
      .post(
        this.apiURL + '/getDesignationSingleUser',
        JSON.stringify({levelId:levelId}),
        this.httpOptions
      )
      .pipe(catchError(this.errorHandler)); 
    }

    readApprovalAuthority(){
      return this.httpClient.post(
        this.apiURL + '/readApprovalAuthority',
        JSON.stringify({}),
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
  viewApprovalAuthority(post: any): Observable<any> {
    return this.httpClient
    .post(
      this.apiURL + '/viewApprovalAuthority',
      JSON.stringify(post),
      this.httpOptions
    )
    .pipe(catchError(this.errorHandler)); 
  }

}