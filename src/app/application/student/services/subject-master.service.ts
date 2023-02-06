import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { Observable, Subject, throwError } from "rxjs";
import { catchError, tap } from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class SubjectMasterService {

  constructor(private httpClient: HttpClient) {}
  private studentApiURL = environment.studentAPI;

  addSubject(post: any) {
    return this.httpClient.post(this.studentApiURL + "/addSubject",JSON.stringify(post))
  }

  viewSubject(post: any) {
    return this.httpClient.post(this.studentApiURL + "/viewSubject",JSON.stringify(post))
  }

  deleteSubject(encId: any,userId:any,profileId:any) {
    return this.httpClient.post(this.studentApiURL + '/deleteSubject', JSON.stringify({'encId': encId,'userId':userId,'profileId':profileId}));
  }

  editSubject(encId: any) {
    return this.httpClient.post(this.studentApiURL + '/editSubject', JSON.stringify({'encId': encId}));
  }

  updateSubject(data: any) {
    return this.httpClient.post(this.studentApiURL + '/updateSubject', JSON.stringify(data));
  }

}
