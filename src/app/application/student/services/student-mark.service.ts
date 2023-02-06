import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { Observable, Subject, throwError } from "rxjs";
import { catchError, tap } from "rxjs/operators";
@Injectable({
  providedIn: "root",
})
export class StudentMarkService {
  constructor(private httpClient: HttpClient) {}
  private studentApiURL = environment.studentAPI;
  private refreshRequired = new Subject<void>();
  get RefreshRequired() {
    return this.refreshRequired;
  }
  /* Created By  :  Saubhgya Ranjan Patra ||  Created On  : 15-07-2022 || Component Name : AddStudentMarkComponent || Description: get all students data */
  getStudentsForStudentMark(post: any) {
    return this.httpClient.post(this.studentApiURL + "/getStudentsForStudentMark",JSON.stringify(post))
  }
  viewStudentMark(post: any) {
    return this.httpClient.post(this.studentApiURL + "/viewStudentMark", JSON.stringify(post))
  }
  getSubjectAccordingToClass(post: any) {
    return this.httpClient.post( this.studentApiURL + "/getSubjectAccordingToClass",JSON.stringify(post))
  }
  saveStudentMark(post: any) {
    return this.httpClient.post(this.studentApiURL + "/saveStudentMark", JSON.stringify(post))
  }
  /* Created By  :  Swagatika ||  Created On  : 01-09-2022 || Component Name : EditStudentMarkComponent || Description: get all students data */
  getStudentMark(encId: any) {
    return this.httpClient.post(this.studentApiURL + "/getStudentMark",JSON.stringify({ encId: encId }))
  }
  /* Created By  :  Saubhgya Ranjan Patra ||  Created On  : 14-09-2022 || Component Name : MarkReportCardComponent || Description: get all students mark list for view */
  viewStudentMarkListReport(post: any) {
    return this.httpClient.post(this.studentApiURL + "/viewStudentMarkListReport",JSON.stringify(post));
  }
   /* Created By  :  Saubhgya Ranjan Patra ||  Created On  : 14-09-2022 || Component Name : MarkReportCardComponent || Description: view indivisual report data */
  viewReportCard(stdMarkId: any) {
    return this.httpClient.post(this.studentApiURL + "/viewReportCard",JSON.stringify({stdMarkId: stdMarkId}),);
  }

}
