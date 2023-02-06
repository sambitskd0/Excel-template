import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ManageMdmAttendanceService {

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };
  private apiURL = environment.mdmAPI;
  private refreshRequired = new Subject<void>();
  get RefreshRequired() {
    return this.refreshRequired;
  }

  constructor(private httpClient: HttpClient) { }

  createAttendance(post: any): Observable<any> {
    return this.httpClient.post(this.apiURL + '/createAttendance',JSON.stringify(post));
  }
  getSchoolCategory(data:any): Observable<any>{
    return this.httpClient.post(this.apiURL + '/getSchoolCategory',JSON.stringify({'schoolCategory':data}))
  }
  checkTodayEntry(schoolId:any): Observable<any>{
    return this.httpClient.post(this.apiURL + '/getTodayEntry',JSON.stringify({'schoolId':schoolId}));
  }
  viewMdmAttendance(post:any):Observable<any>{
    return this.httpClient.post(this.apiURL+'/viewMdmAttendance',JSON.stringify(post));
  }

}
