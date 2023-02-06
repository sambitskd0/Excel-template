import { HttpClient, HttpHeaders } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { catchError, Observable, Subject, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TeacherVerificationService {
  constructor(private httpClient: HttpClient) {}
  private masterAPI = environment.masterAPI;
  private teacherAPI = environment.teacherAPI;
  private schoolAPI = environment.schoolAPI;
  private refreshRequired = new Subject<void>();
  public teacherDetailsChanged = new EventEmitter();
  get RefreshRequired() {
    return this.refreshRequired;
  }
  httpOptions = {
    headers: new HttpHeaders({
      "Content-Type": "multipart/form-data",
      Accept: "application/json",
    }),
  };
  schoolVerification(post: any): Observable<any> {
    return this.httpClient.post(
      this.teacherAPI + "/schoolVerification",
      JSON.stringify(post),
      this.httpOptions
    );
  }
  beoVerification(post: any): Observable<any> {
    return this.httpClient.post(
      this.teacherAPI + "/beoVerification",
      JSON.stringify(post),
      this.httpOptions
    );
  }
  deoVerification(post: any): Observable<any> {
    return this.httpClient.post(
      this.teacherAPI + "/deoVerification",
      JSON.stringify(post),
      this.httpOptions
    );
  }
  changeRequest(post: any): Observable<any> {
    return this.httpClient.post(
      this.teacherAPI + "/changeRequest",
      JSON.stringify(post),
      this.httpOptions
    );
  }
  changeRequestApplications(post: any): Observable<any> {   
    return this.httpClient
      .post(
        this.teacherAPI + "/changeRequestApplications",       
        Object.assign(post)
      )
      .pipe(catchError(this.errorHandler));
  }
  changeRequestSubmit(post: any): Observable<any> {
    return this.httpClient.post(
      this.teacherAPI + "/changeRequestSubmit",
      JSON.stringify(post),
      this.httpOptions
    );
  }
  changeRequestApproveSubmit(post: any): Observable<any> {
    return this.httpClient.post(
      this.teacherAPI + "/changeRequestApproveSubmit",
      JSON.stringify(post),
      this.httpOptions
    );
  }
  changeRequestBeoApprove(post: any): Observable<any> {
    return this.httpClient.post(
      this.teacherAPI + "/changeRequestBeoApprove",
      JSON.stringify(post),
      this.httpOptions
    );
  }
  teacherLog(post: any): Observable<any> {
    return this.httpClient.post(
      this.teacherAPI + "/teacherLog",
      JSON.stringify(post),
      this.httpOptions
    );
  }
  requestTeacher(post: any): Observable<any> {
    return this.httpClient.post(
      this.teacherAPI + "/requestTeacher",
      JSON.stringify(post)
    );
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
