import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable, Subject, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TeacherTrainingAttendenceService {
  private apiURL          = environment.teacherAPI;
  private userProfile     = JSON.parse(sessionStorage.getItem("userProfile") || '{}');
  private userId          = this.userProfile.userId;
  private masterAPI = environment.masterAPI;

  private refreshRequired = new Subject<void>();
  get RefreshRequired() {
    return this.refreshRequired;
  }
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  }; 

  constructor(private httpClient: HttpClient) { }
 
/** Download Teacher Attendence as per filter, By: Sonu Kumar, On: 12-Oct-2022, Component Name : ViewTrainingTypeComponent **/  
downloadTeacherAttendence(post: any): Observable<any> {   
  return this.httpClient
 .post(
   this.apiURL + '/downloadTeacherAttendence',
   JSON.stringify(post),
 )
}

getBatchName(post: any): Observable<any> {   
  return this.httpClient
 .post(
   this.apiURL + '/getBatchName',
   JSON.stringify(post),
 )
}



/** Check Attendence according to date as per filter, By: Sonu Kumar, On: 14-Oct-2022, Component Name : ViewTrainingTypeComponent **/  
checktrainingDate(post: any): Observable<any> {   
  return this.httpClient
 .post(
   this.apiURL + '/checktrainingDate',
   JSON.stringify(post),
 )
}
 
  /** Save Teacher For Batches as per filter, By: Sonu Kumar, On: 26-Aug-2022, Component Name : addTrainingTypeComponent **/  
  viewTeacherAttendence(post: any): Observable<any> {   
    return this.httpClient
   .post(
     this.apiURL + '/viewTeacherAttendence',
     JSON.stringify(post),
   )
  }

  
  /** Save Teacher For Batches as per filter, By: Sonu Kumar, On: 26-Aug-2022, Component Name : addTrainingTypeComponent **/  
  AddTeacherAttendence(post: any): Observable<any> { 
    return this.httpClient
   .post(
     this.apiURL + '/AddTeacherAttendence',
     JSON.stringify(post),
   )
  }

   /** Save Teacher For Batches as per filter, By: Sonu Kumar, On: 26-Aug-2022, Component Name : addTrainingTypeComponent **/  
   viewTeacherLstForAtten(post: any): Observable<any> {   
    return this.httpClient
   .post(
     this.apiURL + '/viewTeacherLstForAtten',
     JSON.stringify(post),
   )
  }

  /** Save Teacher For Batches as per filter, By: Sonu Kumar, On: 26-Aug-2022, Component Name : addTrainingTypeComponent **/  
  getTeacherListforAtten(post: any): Observable<any> {   
    return this.httpClient
   .post(
     this.apiURL + '/getTeacherListforAtten',
     JSON.stringify(post),
   )
  }

 


}
