import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable, Subject, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TrainingTypeService {
  private apiURL          = environment.teacherAPI;
  private userProfile     = JSON.parse(sessionStorage.getItem("userProfile") || '{}');
  private userId          = this.userProfile.userId;
  private userLevel       = this.userProfile.userLevel;
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

  checkTrainingDate(post: any): Observable<any> {   
    return this.httpClient
   .post(
     this.apiURL + '/checkTrainingDate',
     JSON.stringify(post),
   )
  }

  /** View Teacher Type as per filter, By: Ayasakanta Swain, On: 24-Aug-2022, Component Name : ViewTrainingTypeComponent **/  
  viewTrainingType(post: any): Observable<any> {   
    return this.httpClient
   .post(
     this.apiURL + '/viewTrainingType',
     JSON.stringify(post),
   )
  }

  /** Download Teacher Training Type as per filter, By: Sonu Kumar, On: 12-Oct-2022, Component Name : ViewTrainingTypeComponent **/  
  downloadTrainingType(post: any): Observable<any> {   
    return this.httpClient
   .post(
     this.apiURL + '/downloadTrainingType',
     JSON.stringify(post),
   )
  }

  /** Download Teacher Training Type for District and Block as per filter, By: Sonu Kumar, On: 17-Oct-2022, Component Name : ViewTrainingTypeComponent **/  
  downloadTrainingData(post: any): Observable<any> {   
    return this.httpClient
   .post(
     this.apiURL + '/downloadTrainingData',
     JSON.stringify(post),
   )
  }

    /** View Trainings for dist,blk login, By: Ayasakanta Swain, On: 02-Sep-2022, Component Name : ViewTrainingComponent **/  
    viewTrainings(post: any): Observable<any> { 
      return this.httpClient
     .post(
       this.apiURL + '/viewTrainings',
       JSON.stringify(post),
     )
    }

    viewTrainingsblock(post: any): Observable<any> { 
      return this.httpClient
     .post(
       this.apiURL + '/viewTrainingsblock',
       JSON.stringify(post),
     )
    }

  /** Save Training Type as per filter, By: Sonu Kumar, On: 26-Aug-2022, Component Name : addTrainingTypeComponent **/  
  saveTraining(post: any): Observable<any> {   
    return this.httpClient
   .post(
     this.apiURL + '/addTeacherTraining',
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
/** Read Training Type as per filter, By: Sonu Kumar, On: 26-Aug-2022, Component Name : viewTrainingTypeComponent **/  
  readTrainingData(post: any): Observable<any> {   
    return this.httpClient
   .post(
     this.apiURL + '/viewTeacherTrainingById',
     JSON.stringify(post),
   )
  }
/** Update Training Type as per filter, By: Sonu Kumar, On: 26-Aug-2022, Component Name : viewTrainingTypeComponent **/  
  updateTrainingData(post: any): Observable<any> {   
    return this.httpClient
   .post(
     this.apiURL + '/updateTeacherTraining',
     JSON.stringify(post),
   )
  }

/** Training status change after complete training, By: sonu kumar, On: 07-Nov-2022, Component Name : ViewTrainingTypeComponent **/  
trainingStatus(post: any): Observable<any> {  
  return this.httpClient
 .post(
   this.apiURL + '/trainingStatus',
   JSON.stringify(post),
 )
}

stateTrainingStatus(post: any): Observable<any> {  
  return this.httpClient
 .post(
   this.apiURL + '/stateTrainingStatus',
   JSON.stringify(post),
 )
}

districtNotification(post: any): Observable<any> {  
  return this.httpClient
 .post(
   this.apiURL + '/districtNotification',
   JSON.stringify(post),
 )
}

BlockNotification(post: any): Observable<any> {  
  return this.httpClient
 .post(
   this.apiURL + '/BlockNotification',
   JSON.stringify(post),
 )
}


/** send Training Notification to add master traininer list, By: Ayasakanta Swain, On: 30-Aug-2022, Component Name : ViewTrainingTypeComponent **/  
sendTrainingNotification(post: any): Observable<any> {   
  post.userId = this.userId;
  if(this.userLevel == 5){
    post.notificationStatus = 1;
  }else if(this.userLevel == 4){
    post.notificationStatus = 2;
  }else if(this.userLevel == 3){
    post.notificationStatus = 3;
  }
  return this.httpClient
 .post(
   this.apiURL + '/sendTrainingNotification',
   JSON.stringify(post),
 )
}

sendNotificationByDisAndBlock(post: any): Observable<any> {  
  post.userId = this.userId;
  if(this.userLevel == 5){
    post.notificationStatus = 1;
  }else if(this.userLevel == 4){
    post.notificationStatus = 2;
  }else if(this.userLevel == 3){
    post.notificationStatus = 3;
  }
  return this.httpClient
 .post(
   this.apiURL + '/sendNotificationByDisAndBlock',
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
