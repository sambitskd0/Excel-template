import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable, Subject, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TeacherForTrainingService {

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


/** Download Teacher For Training as per filter, By: Sonu Kumar, On: 12-Oct-2022, Component Name : ViewTrainingTypeComponent **/  
downloadTeacherForTraining(post: any): Observable<any> {   
  return this.httpClient
 .post(
   this.apiURL + '/downloadTeacherForTraining',
   JSON.stringify(post),
 )
}

getDetails(post:any) {
  return this.httpClient
    .post(
      this.apiURL + "/getDetails",
      JSON.stringify(post),
      this.httpOptions
    )
    .pipe(catchError(this.errorHandler));
}

/** Get Teacher List, By: Sonu Kumar, On: 01-Sep-2022, Component Name : ViewTeacherForTrainingComponent **/  
getTeacherList(post: any): Observable<any> { 
  return this.httpClient
 .post(
   this.apiURL + '/getTeacherList',
   JSON.stringify(post),
 )
}

/** Get Teacher List, By: Sonu Kumar, On: 01-Sep-2022, Component Name : ViewTeacherForTrainingComponent **/  
enrolledTeacher(post: any): Observable<any> { 
  return this.httpClient
 .post(
   this.apiURL + '/enrolledTeacher',
   JSON.stringify(post),
 )
}

/** Get Trainer List, By: Sonu Kumar, On: 07-Sep-2022, Component Name : ViewTeacherForTrainingComponent **/  
getTrainerList(post: any): Observable<any> { 
  return this.httpClient
 .post(
   this.apiURL + '/getTrainerList',
   JSON.stringify(post),
 )
}

/** Get Teacher List, By: Sonu Kumar, On: 01-Sep-2022, Component Name : ViewTeacherForTrainingComponent **/  
getTeacherListonSelect(post: any): Observable<any> { 
  return this.httpClient
 .post(
   this.apiURL + '/getTeacherListonSelect',
   JSON.stringify(post),
 )
}

/** Get Officers List, By: Sonu Kumar, On: 01-Sep-2022, Component Name : ViewTeacherForTrainingComponent **/  
getOfficersList(post: any): Observable<any> { 
  return this.httpClient
 .post(
   this.apiURL + '/getOfficersList',
   JSON.stringify(post),
 )
}

/** Get Officers List, By: Sonu Kumar, On: 01-Sep-2022, Component Name : ViewTeacherForTrainingComponent **/  
getOfficersListonSelect(post: any): Observable<any> { 
  return this.httpClient
 .post(
   this.apiURL + '/getOfficersListonSelect',
   JSON.stringify(post),
 )
}

/** Get Teacher List, By: Sonu Kumar, On: 01-Sep-2022, Component Name : ViewTeacherForTrainingComponent **/  
addTeacherForTraining(post: any): Observable<any> { 
  return this.httpClient
 .post(
   this.apiURL + '/addTeacherForTraining',
   JSON.stringify(post),
 )
}

/** Get Teacher List, By: Sonu Kumar, On: 02-Sep-2022, Component Name : ViewTeacherForTrainingComponent **/  
viewTeacherFoTraining(post: any): Observable<any> { 
  return this.httpClient
 .post(
   this.apiURL + '/viewTeacherFoTraining',
   JSON.stringify(post),
 )
}

/** Delete Teacher For Training, By: Sonu Kumar, On: 02-Sep-2022, Component Name : ViewTeacherForTrainingComponent **/  
deleteTeacherforTraining(post: any): Observable<any> { 
  return this.httpClient
 .post(
   this.apiURL + '/deleteTeacherforTraining',
   JSON.stringify(post),
 )
}

/** Delete Teacher For Training, By: Sonu Kumar, On: 02-Sep-2022, Component Name : ViewTeacherForTrainingComponent **/  
editTeacherForTraining(post: any): Observable<any> { 
  return this.httpClient
 .post(
   this.apiURL + '/editTeacherForTraining',
   JSON.stringify(post),
 )
}

/** Update Teacher For Training, By: Sonu Kumar, On: 02-Sep-2022, Component Name : ViewTeacherForTrainingComponent **/  
updateTeacherForTraining(post: any): Observable<any> { 
  return this.httpClient
 .post(
   this.apiURL + '/updateTeacherForTraining',
   JSON.stringify(post),
 )
}

/** Self Training Request as per filter, By: Sonu Kumar, On: 29-Aug-2022, Component Name : viewSelfTrainingRequest **/  
getofficersDetails(post: any): Observable<any> {   
  return this.httpClient
 .post(
   this.apiURL + '/getofficersDetails',
   JSON.stringify(post),
 )
}


  errorHandler(error: any) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      errorMessage = error.error.message;
    } else {
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    return throwError(() => new Error(errorMessage));
  }

}
