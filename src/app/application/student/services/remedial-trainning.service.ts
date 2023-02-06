import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import {  Observable, Subject, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class RemedialTrainningService {
  constructor(private httpClient:HttpClient) { }
  private apiURL = environment.schoolAPI;
  private masterApiURL = environment.masterAPI;
  private studentApiURL =environment.studentAPI;

 private refreshRequired = new Subject<void>();
 get RefreshRequired() {
   return this.refreshRequired;
 }
    /* Created By  :  Saubhgya Ranjan Patra ||  Created On  : 12-07-2022 || Component Name : AddRemedialTrainingComponent || Description: get all students data */
getStudentsForRemedialTraining(post: any){
  return this.httpClient
    .post(this.studentApiURL + '/getStudentsForRemedialTraining', JSON.stringify(post)
    )
    
}
/* Created By  :  Saubhgya Ranjan Patra ||  Created On  : 30-06-2022 || Component Name : AddRemedialTrainingComponent || Description:ll  Add Remedial Training data */
addRemedialTraining(post: any):Observable<any> {
  return this.httpClient.post(
    this.studentApiURL + "/addRemedialTraining",
    JSON.stringify(post)
  );
}
  /* Created By  :  Saubhgya Ranjan Patra ||  Created On  : 12-07-2022 || Component Name : AddHealthCheckUpComponent || Description: get all students data */
  viewRemedialTraining(post: any){
    return this.httpClient
      .post(this.studentApiURL + '/viewRemedialTraining', JSON.stringify(post)
      ) 
  }
  /* Created By  :  Saubhgya Ranjan Patra ||  Created On  : 25-05-2022 || Component Name : ViewCategoryComponent || Description: Delete SchoolCategory */
  removeStudentFromRemedialTraining(id:number,userId:string,profileId:string){
  const allData = { id,userId,profileId };
  return this.httpClient.post(this.studentApiURL + '/removeStudentFromRemedialTraining',JSON.stringify(allData))
  .pipe(tap(()=>{
    this.RefreshRequired.next();
   
  }));
}

}
