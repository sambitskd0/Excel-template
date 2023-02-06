import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { Observable, Subject, throwError } from "rxjs";
import { catchError, tap } from "rxjs/operators";


@Injectable({
  providedIn: 'root'
})
export class StudentMisSecService {
  constructor(private httpClient: HttpClient) { }
  private studentApiURL = environment.studentAPI;
  private refreshRequired = new Subject<void>();
  httpOptions = {
    headers: new HttpHeaders({
      "Content-Type": "application/json",
    }),
  };
  get RefreshRequired() {
    return this.refreshRequired;
  }

  getClass(schoolId: any) {
    return this.httpClient.post(
      this.studentApiURL + "/getClassGradeWise",
      JSON.stringify({ schoolId }),
      this.httpOptions
    );
  }

  getSubject(classId: any,streamId:any,groupId : any) {
    return this.httpClient.post(
      this.studentApiURL + "/getSubjectMis",
      JSON.stringify({ classId,streamId,groupId }),
      this.httpOptions
    );
  }
  getGradeWiseReport(post:any){
    return this.httpClient.post(
      this.studentApiURL + "/getGradeWiseReport",
      JSON.stringify(post)
    );
  }
  

}
