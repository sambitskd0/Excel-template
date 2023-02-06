import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError,Observable, Subject,throwError } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ViewdetailsService {

  constructor(private httpClient: HttpClient) { }
  private masterAPI = environment.masterAPI;
  private teacherAPI = environment.teacherAPI;
  private schoolAPI = environment.schoolAPI;
  private refreshRequired = new Subject<void>();
  get RefreshRequired() {
    return this.refreshRequired;
  }
  httpOptions = {
    headers: new HttpHeaders({
      "Content-Type": "multipart/form-data",
      Accept: "application/json",
    }),
  };

  viewTeacherOtherInfo(encId: string) {
    return this.httpClient
      .post(
        this.teacherAPI + "/viewTeacherOtherInfo",
        JSON.stringify({ encId: encId }),
        this.httpOptions
      )
      .pipe(catchError(this.errorHandler));
  }
  viewTeacherEducationInfo(encId: string) {
    return this.httpClient
      .post(
        this.teacherAPI + "/viewTeacherEducationInfo",
        JSON.stringify({ encId: encId }),
        this.httpOptions
      )
      .pipe(catchError(this.errorHandler));
  }
  viewTeacherProfessionalInfo(encId: string) {
    return this.httpClient
      .post(
        this.teacherAPI + "/viewTeacherProfessionalInfo",
        JSON.stringify({ encId: encId }),
        this.httpOptions
      )
      .pipe(catchError(this.errorHandler));
  }
  viewTeacherTrainingInfo(encId: string) {
    return this.httpClient
      .post(
        this.teacherAPI + "/viewTeacherTrainingInfo",
        JSON.stringify({ encId: encId }),
        this.httpOptions
      )
      .pipe(catchError(this.errorHandler));
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
