import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { catchError, Observable, Subject, throwError } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class TeacherServiceService {
  private masterAPI = environment.masterAPI;
  private teacherAPI = environment.teacherAPI;
  private schoolAPI = environment.schoolAPI;
  constructor(private httpClient: HttpClient) { }

  httpOptions = {
    headers: new HttpHeaders({
      "Content-Type": "multipart/form-data",
      Accept: "application/json",
    }),
  };

  errorHandler(error: any) {
    let errorMessage = "";
    if (error.error instanceof ErrorEvent) {
      errorMessage = error.error.message;
    } else {
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    return throwError(() => new Error(errorMessage));
  }

  getSchool(clusterId: any,sessionSchoolId:any) {
    return this.httpClient.post(
      this.schoolAPI + "/getSchool",
      JSON.stringify({ clusterId : clusterId , encId : sessionSchoolId}),
      this.httpOptions
    );
  }

  getTeacherAppointment() {
    const anxtType = "NATURE_OF_APPOINTMENT";
    return this.httpClient.post(
      this.masterAPI + "/getAnnexture",
      JSON.stringify({ anxtType }),
      this.httpOptions
    );
  }

   /* for viewing teacher service */
   viewTeacherService(post: any): Observable<any> {

   
    return this.httpClient
      .post(
        this.teacherAPI + "/viewTeacherService",
        // JSON.stringify(post),
        // this.httpOptions,
        Object.assign(post)
      )
      .pipe(catchError(this.errorHandler));
  }
  
  /* for updating the service of the teacher */
 

  updateTeacherService(post: any): Observable<any> {
    return this.httpClient.post(
      this.teacherAPI + "/updateTeacherService",
      JSON.stringify(post),
      this.httpOptions
    );
  }

  
  /* get the details of teacher for service page ,Created by: vivek ranjan jha , date: 22-06-2022*/
  getTeacherServiceDetails(techId:string)
  {
    return this.httpClient
    .post(
      this.teacherAPI + "/getTeacherServiceDetails",
      JSON.stringify({ techId: techId }),
      this.httpOptions
    )
    .pipe(catchError(this.errorHandler));
  }

  downloadTeacherServiceCsv(data:any): Observable<any>
  {
    return this.httpClient
    .post(
      this.teacherAPI + "/downloadServiceCsv",
      JSON.stringify({ data: data }),
      this.httpOptions
    )
    .pipe(catchError(this.errorHandler));
  }

  viewLastServiceDetails(post: any): Observable<any> {    
    return this.httpClient.post(this.teacherAPI + "/viewLastServiceDetails",Object.assign(post)).pipe(catchError(this.errorHandler));
  }
  addDeputation(post: any): Observable<any> {    
    return this.httpClient.post(this.teacherAPI + "/addDeputation",Object.assign(post));
  }
  updateReturnDate(post: any): Observable<any> {    
    return this.httpClient.post(this.teacherAPI + "/updateReturnDate",Object.assign(post));
  }

  deputaionList(post: any): Observable<any> {    
    return this.httpClient.post(this.teacherAPI + "/deputaionList",Object.assign(post)).pipe(catchError(this.errorHandler));
  }

  getDeputeDetails(post: any): Observable<any> {    
    return this.httpClient.post(this.teacherAPI + "/getDeputeDetails",Object.assign(post)).pipe(catchError(this.errorHandler));
  }
  getDeputeHistory(post: any): Observable<any> {    
    return this.httpClient.post(this.teacherAPI + "/getDeputeHistory",Object.assign(post)).pipe(catchError(this.errorHandler));
  }

  reInstateSubmit(post: any): Observable<any> {
    return this.httpClient.post(
      this.teacherAPI + "/reInstateSubmit",
      JSON.stringify(post)
    );
  }
 

}
