import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable, Subject, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ManageTrainingBatchService {
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

  /** Get Training Department List as per filter, By: Sonu Kumar, On: 14-Oct-2022, Component Name : ViewTrainingTypeComponent **/  
  getTrainingDepartment() {
    const anxtType = "TEACHER_TRAINING_DEPARTMENT";
    return this.httpClient.post(
      this.masterAPI + "/getAnnexture",
      JSON.stringify({ anxtType }),
      
    );
  }
  // getTrainingDepartment() {   
  //   return this.httpClient.post(this.apiURL + '/getTrainingDepartment',{})
  // }
  
  /** Download Training Batch as per filter, By: Sonu Kumar, On: 12-Oct-2022, Component Name : ViewTrainingTypeComponent **/  
  downloadTrainingBatch(post: any): Observable<any> {   
  return this.httpClient
 .post(
   this.apiURL + '/downloadTrainingBatch',
   JSON.stringify(post),
 )
}

/** Download Teacher List Batch as per filter, By: Sonu Kumar, On: 12-Oct-2022, Component Name : ViewTrainingTypeComponent **/  
downloadTeacherListBatch(post: any): Observable<any> {   
  return this.httpClient
 .post(
   this.apiURL + '/downloadTeacherListBatch',
   JSON.stringify(post),
 )
}

  /** Get Teacher List, By: Sonu Kumar, On: 01-Sep-2022, Component Name : ViewTeacherForTrainingComponent **/  
  getTeacherCount(post: any): Observable<any> { 
    return this.httpClient
  .post(
    this.apiURL + '/getTeacherCount',
    JSON.stringify(post),
  )
  }

  getTeacherList(post: any): Observable<any> { 
    return this.httpClient
  .post(
    this.apiURL + '/getTeacherListss',
    JSON.stringify(post),
  )
  }

   /** Save Training Type as per filter, By: Sonu Kumar, On: 26-Aug-2022, Component Name : addTrainingTypeComponent **/  
   saveBatches(post: any): Observable<any> {   
    return this.httpClient
   .post(
     this.apiURL + '/addTrainingBatches',
     JSON.stringify(post),
   )
  }

  /** Save Training Type as per filter, By: Sonu Kumar, On: 26-Aug-2022, Component Name : addTrainingTypeComponent **/  
  viewTrainingBatch(post: any): Observable<any> {   
    return this.httpClient
   .post(
     this.apiURL + '/viewTrainingBatch',
     JSON.stringify(post),
   )
  }

  /** Save Training Type as per filter, By: Sonu Kumar, On: 26-Aug-2022, Component Name : addTrainingTypeComponent **/  
  editTrainingBatch(post: any): Observable<any> {   
    return this.httpClient
   .post(
     this.apiURL + '/editTrainingBatch',
     JSON.stringify(post),
   )
  }

   /** Save Training Type as per filter, By: Sonu Kumar, On: 26-Aug-2022, Component Name : addTrainingTypeComponent **/  
   editBatchById(post: any): Observable<any> {   
    return this.httpClient
   .post(
     this.apiURL + '/editBatchById',
     JSON.stringify(post),
   )
  }

  /** Save Training Type as per filter, By: Sonu Kumar, On: 26-Aug-2022, Component Name : addTrainingTypeComponent **/  
  updateBatches(post: any): Observable<any> {   
    return this.httpClient
   .post(
     this.apiURL + '/updateBatches',
     JSON.stringify(post),
   )
  }

  updatBatchById(post: any): Observable<any> {   
    return this.httpClient
   .post(
     this.apiURL + '/updatBatchById',
     JSON.stringify(post),
     
   )
  }


  /** Save Training Type as per filter, By: Sonu Kumar, On: 26-Aug-2022, Component Name : addTrainingTypeComponent **/  
  deleteTrainingBatch(post: any): Observable<any> {   
    return this.httpClient
   .post(
     this.apiURL + '/deleteTrainingBatch',
     JSON.stringify(post),
   )
  }

  /** Save Teacher For Batches as per filter, By: Sonu Kumar, On: 26-Aug-2022, Component Name : addTrainingTypeComponent **/  
  viewTeacherBatch(post: any): Observable<any> {   
    return this.httpClient
   .post(
     this.apiURL + '/viewTeacherBatch',
     JSON.stringify(post),
   )
  }

  /** send Training Notification to add master traininer list, By: Ayasakanta Swain, On: 30-Aug-2022, Component Name : ViewTrainingTypeComponent **/  
  assignBatch(post: any): Observable<any> {   
  post.userId = this.userId;
  return this.httpClient
 .post(
   this.apiURL + '/assignBatch',
   JSON.stringify(post),
 )
}


}
