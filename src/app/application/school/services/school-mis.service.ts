import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { catchError, Observable, Subject, throwError } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class SchoolMisService {
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

  // START SCHOOL COUNT REPORT 
  loadSchoolCountReportData(post: any): Observable<any> {
    return this.httpClient.post(
      this.schoolAPI + '/loadSchoolCountReportData',
      JSON.stringify(post),
      this.httpOptions
    )
  }
  getschoolMis(post: any): Observable<any> {
    return this.httpClient.post(
      this.schoolAPI + '/getschoolMis',
      JSON.stringify(post),
      this.httpOptions
    )
  }

  getSchoolCategories(post: any): Observable<any> {
    return this.httpClient.post(
      this.schoolAPI + '/getSchoolCategories',
      JSON.stringify(post),
      this.httpOptions
    )
  }

  exportSchoolCountReport(post:any): Observable<any> {
    return this.httpClient.post(
      this.schoolAPI + '/exportSchoolCountReport',
      JSON.stringify(post),
      this.httpOptions
    )
  }

  exportSchoolCountDetailsReport(post:any): Observable<any> {
    return this.httpClient.post(
      this.schoolAPI + '/exportSchoolCountDetailsReport',
      JSON.stringify(post),
      this.httpOptions
    )
  }
//END OF SCHOOL COUNT REPORT

//START SCHOOL RAW REPORT
  loadSchoolRawReportData(post:any): Observable<any> {
    return this.httpClient.post(
      this.schoolAPI + '/loadSchoolRawReportData',
      JSON.stringify(post),
      this.httpOptions
    )
  }

  exportSchoolRawDetailsReport(post:any): Observable<any> {
    return this.httpClient.post(
      this.schoolAPI + '/exportSchoolRawDetailsReport',
      JSON.stringify(post),
      this.httpOptions
    )
  }
  //END OF SCHOOL RAW REPORT

// START SCHOOL VERIFICATION
  loadSchoolVerificationReportData(post:any): Observable<any> {
    return this.httpClient.post(
      this.schoolAPI + '/loadSchoolVerificationReportData',
      JSON.stringify(post),
      // this.httpOptions
    )
  }

  exportSchoolVerifyDetailReport(post:any): Observable<any> {
    return this.httpClient.post(
      this.schoolAPI + '/exportSchoolVerifyDetailReport',
      JSON.stringify(post),
      this.httpOptions
    )
  }

  exportSchoolVerifyCountReport(post:any): Observable<any> {
    return this.httpClient.post(
      this.schoolAPI + '/exportSchoolVerifyCountReport',
      JSON.stringify(post),
      this.httpOptions
    )
  }

//END SCHOOL VERIFICATION REPORT

//START INSPECTION REPORT
  loadSchoolInspectionReportData(post:any): Observable<any> {
    return this.httpClient.post(
      this.schoolAPI + '/loadSchoolInspectionReportData',
      JSON.stringify(post),
      this.httpOptions
    )
  }

  getInspectionDetails(post:any): Observable<any> {
    return this.httpClient.post(
      this.schoolAPI + '/getInspectionDetails',
      JSON.stringify(post),
      this.httpOptions
    )
  }
  
  exportSchoolInspectionDetailsReport(post:any): Observable<any> {
    return this.httpClient.post(
      this.schoolAPI + '/exportSchoolInspectionDetailsReport',
      JSON.stringify(post),
      this.httpOptions
    )
  }
//END INSPECTION REPORT
}
