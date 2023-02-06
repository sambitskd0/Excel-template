import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { Observable, Subject, throwError } from "rxjs";
import { catchError, tap } from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class ContextMasterService {

  constructor(private httpClient: HttpClient) {}
  private studentApiURL = environment.studentAPI;

  addContext(post: any) {
    return this.httpClient.post(this.studentApiURL + "/addContext",JSON.stringify(post))
  }

  viewContext(post: any) {
    return this.httpClient.post(this.studentApiURL + "/viewContext",JSON.stringify(post))
  }

  deleteContext(encId: any,userId:any,profileId:any) {
    return this.httpClient.post(this.studentApiURL + '/deleteContext', JSON.stringify({'encId': encId,'userId':userId,'profileId':profileId}));
  }

  editContext(encId: any) {
    return this.httpClient.post(this.studentApiURL + '/editContext', JSON.stringify({'encId': encId}));
  }

  updateContext(data: any) {
    return this.httpClient.post(this.studentApiURL + '/updateContext', JSON.stringify(data));
  }
}
