import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { catchError, Observable, Subject, throwError } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class TeacherMisService {
  private teacherAPI = environment.teacherAPI;
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
  loadTeacherData(post: any): Observable<any> {
    return this.httpClient.post(
      this.teacherAPI + '/loadTeacherRawData',
      JSON.stringify(post),
      this.httpOptions
    )
  }

  exportTeacherReport(post: any): Observable<any> {
    return this.httpClient.post(
      this.teacherAPI + '/exportTeacherReport',
      JSON.stringify(post),
      this.httpOptions
    )
  }

  getSchoolCategories(post: any): Observable<any> {
    return this.httpClient.post(
      this.teacherAPI + '/getSchoolCategories',
      JSON.stringify(post),
      this.httpOptions
    )
  }

  loadSchoolCatWiseTeacherData(post: any): Observable<any> {
    return this.httpClient.post(
      this.teacherAPI + '/loadSchoolCatWiseTeacherData',
      JSON.stringify(post),
      this.httpOptions
    )
  }
  getschool(post: any): Observable<any> {
    return this.httpClient.post(
      this.teacherAPI + '/getschool',
      JSON.stringify(post),
      this.httpOptions
    )
  }

  exportSchoolCatWiseTeacherReport(post: any): Observable<any> {
    return this.httpClient.post(
      this.teacherAPI + '/exportSchoolCatWiseTeacherReport',
      JSON.stringify(post),
      this.httpOptions
    )
  }
  loadAppTypeWiseTeacherData(post: any): Observable<any> {
    return this.httpClient.post(
      this.teacherAPI + '/loadAppTypeWiseTeacherData',
      JSON.stringify(post),
      this.httpOptions
    )
  }

  exportAppTypeWiseTeacherReport(post: any): Observable<any> {
    return this.httpClient.post(
      this.teacherAPI + '/exportAppTypeWiseTeacherReport',
      JSON.stringify(post),
      this.httpOptions
    )
  }

  loadNatureAppTypeWiseTeacherData(post: any): Observable<any> {
    return this.httpClient.post(
      this.teacherAPI + '/loadNatureAppTypeWiseTeacherData',
      JSON.stringify(post),
      this.httpOptions
    )
  }

  exportNatureAppTypeWiseTeacherReport(post: any): Observable<any> {
    return this.httpClient.post(
      this.teacherAPI + '/exportNatureAppTypeWiseTeacherReport',
      JSON.stringify(post),
      this.httpOptions
    )
  }
  loadTeacherTitleWiseData(post: any): Observable<any> {
    return this.httpClient.post(
      this.teacherAPI + '/loadTeacherTitleWiseData',
      JSON.stringify(post),
      this.httpOptions
    )
  }

  exportTeacherTitleWiseReport(post: any): Observable<any> {
    return this.httpClient.post(
      this.teacherAPI + '/exportTeacherTitleWiseReport',
      JSON.stringify(post),
      this.httpOptions
    )
  }

  loadSocialCateWiseTeacherData(post: any): Observable<any> {
    return this.httpClient.post(
      this.teacherAPI + '/loadSocialCateWiseTeacherData',
      JSON.stringify(post),
      this.httpOptions
    )
  }

  exportSocialCateWiseWiseTeacherReport(post: any): Observable<any> {
    return this.httpClient.post(
      this.teacherAPI + '/exportSocialCateWiseWiseTeacherReport',
      JSON.stringify(post),
      this.httpOptions
    )
  }

  
  loadGenderWiseTeacherData(post: any): Observable<any> {
    return this.httpClient.post(
      this.teacherAPI + '/loadGenderWiseTeacherData',
      JSON.stringify(post),
      this.httpOptions
    )
  }

  exportGenderWiseTeacherReport(post: any): Observable<any> {
    return this.httpClient.post(
      this.teacherAPI + '/exportGenderWiseTeacherReport',
      JSON.stringify(post),
      this.httpOptions
    )
  }

  loadEducationWiseTeacherData(post: any): Observable<any> {
    return this.httpClient.post(
      this.teacherAPI + '/loadEducationWiseTeacherData',
      JSON.stringify(post),
      this.httpOptions
    )
  }

  exportEducationWiseTeacherReport(post: any): Observable<any> {
    return this.httpClient.post(
      this.teacherAPI + '/exportEducationWiseTeacherReport',
      JSON.stringify(post),
      this.httpOptions
    )
  }

  
  loadProfessionalWiseTeacherData(post: any): Observable<any> {
    return this.httpClient.post(
      this.teacherAPI + '/loadProfessionalWiseTeacherData',
      JSON.stringify(post),
      this.httpOptions
    )
  }

  exportProfessionalWiseTeacherReport(post: any): Observable<any> {
    return this.httpClient.post(
      this.teacherAPI + '/exportProfessionalWiseTeacherReport',
      JSON.stringify(post),
      this.httpOptions
    )
  }

  loadTeacherAttendanceData(post: any): Observable<any> {
    return this.httpClient.post(
      this.teacherAPI + '/loadTeacherAttendanceData',
      JSON.stringify(post),
      this.httpOptions
    )
  }

  exportTeacherAttendanceData(post: any): Observable<any> {
    return this.httpClient.post(
      this.teacherAPI + '/exportTeacherAttendanceData',
      JSON.stringify(post),
      this.httpOptions
    )
  }

  teacherList(post: any): Observable<any> {
    return this.httpClient.post(
      this.teacherAPI + '/teacherList',
      JSON.stringify(post),
      this.httpOptions
    )
  }
}
