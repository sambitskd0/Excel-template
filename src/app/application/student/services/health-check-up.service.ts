import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import {  Observable, Subject, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class HealthCheckUpService {

  constructor(private httpClient:HttpClient) { }
  private apiURL = environment.schoolAPI;
  private masterApiURL = environment.masterAPI;
  private studentApiURL =environment.studentAPI;
 private refreshRequired = new Subject<void>();
 get RefreshRequired() {
   return this.refreshRequired;
 }
   /* Created By  :  Saubhgya Ranjan Patra ||  Created On  : 08-07-2022 || Component Name : AddHealthCheckUpComponent || Description: get all students data */
getStudents(post: any){
  return this.httpClient
    .post(this.studentApiURL + '/getStudentsForHealthCheckup', JSON.stringify(post))
  
}
/* Created By  :  Saubhgya Ranjan Patra ||  Created On  : 08-07-2022 || Component Name : AddHealthCheckUpComponent || Description:ll  add health checkup details data */
addHealthCheckup(post: any):Observable<any> {
  return this.httpClient.post(
    this.studentApiURL + "/addHealthCheckup",
    JSON.stringify(post)
  );
}
/* Created By  :  Saubhgya Ranjan Patra ||  Created On  : 08-07-2022 || Component Name : ViewHealthCheckUpComponent || Description:view health checkup  data */
viewHealthCheckup(post: any): Observable<any>{
  return this.httpClient.post(this.studentApiURL + '/viewHealthCheckup',JSON.stringify(post))
 
}
/* Created By  :  Saubhgya Ranjan Patra ||  Created On  : 08-07-2022 || Component Name : EditHealthCheckUpComponent || Description: get  Data for indivisual student health checkup details */
getHealthCheckup(encId:string){
  return this.httpClient
    .post(this.studentApiURL + '/getHealthCheckup',JSON.stringify({encId:encId})
    )
   
}
/* Created By  :  Saubhgya Ranjan Patra || Created On  : 08-07-2022 || Component Name : EditHealthCheckUpComponent || Description: update health checkup data */
updateHealthCheckup(post: any):Observable<any> {
  return this.httpClient.post(
    this.studentApiURL + "/updateHealthCheckup",
    JSON.stringify(post));
}
}
