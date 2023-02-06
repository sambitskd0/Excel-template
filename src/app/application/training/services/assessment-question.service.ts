import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable, Subject, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AssessmentQuestionService {

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

  getSubject()
  {
    return this.httpClient.post(this.masterAPI + "/viewSubject",{});
  }

  getTraining()
  {
    return this.httpClient.post(this.apiURL + '/viewTrainingAssessment',{});
  }

  getTrainings(post: any): Observable<any> {   
    return this.httpClient
   .post(
     this.apiURL + '/viewTrainingAssessment',
     JSON.stringify(post),
   )
  }
 
  /** Download Assesment Question as per filter, By: Sonu Kumar, On: 12-Oct-2022, Component Name : ViewTrainingTypeComponent **/  
  downloadAssesmentQuestion(post: any): Observable<any> {   
    return this.httpClient
   .post(
     this.apiURL + '/downloadAssesmentQuestion',
     JSON.stringify(post),
   )
  }

  /** Delete Training Type as per filter, By: Sonu Kumar, On: 26-Aug-2022, Component Name : viewTrainingTypeComponent **/  
  deleteTrainingData(post: any): Observable<any> {   
    return this.httpClient
   .post(
     this.apiURL + '/deleteTeacherTraining',
     JSON.stringify(post),
   )
  }



/** View Training Assessment Question as per filter, By: Sonu Kumar, On: 26-Aug-2022, Component Name : viewTrainingTypeComponent **/  
viewTeacherAssesment(post: any): Observable<any> {   
  return this.httpClient
 .post(
   this.apiURL + '/viewteacherAssessment',
   JSON.stringify(post),
 )
}

/** Save Training Assesment as per filter, By: Sonu Kumar, On: 26-Aug-2022, Component Name : addTrainingTypeComponent **/  
saveTrainingAssesment(post: any): Observable<any> {   
  return this.httpClient
 .post(
   this.apiURL + '/teacherSelfAssessment',
   JSON.stringify(post),
 )
}

/** Read Training Assesment as per filter, By: Sonu Kumar, On: 26-Aug-2022, Component Name : addTrainingTypeComponent **/  
readTrainingAssesment(post: any): Observable<any> {   
  return this.httpClient
 .post(
   this.apiURL + '/editteacherSelfAssessment',
   JSON.stringify(post),
 )
}

/** Save Training Assesment as per filter, By: Sonu Kumar, On: 26-Aug-2022, Component Name : addTrainingTypeComponent **/  
updateTrainingAssesment(post: any): Observable<any> {   
  return this.httpClient
 .post(
   this.apiURL + '/updateTrainingAssessment',
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
