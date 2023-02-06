import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import {  Observable, Subject, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DocterDetailsService {

  constructor(private httpClient:HttpClient) { }
  private apiURL = environment.schoolAPI;
  private masterApiURL = environment.masterAPI;
  private studentApiURL =environment.studentAPI;
 private refreshRequired = new Subject<void>();
 get RefreshRequired() {
   return this.refreshRequired;
 }
 /* Created By  :  Saubhgya Ranjan Patra ||  Created On  : 30-06-2022 || Component Name : AddDoctordetailsComponent || Description:ll  add doctor details data */
addDoctorDetails(post: any):Observable<any> {
  return this.httpClient.post(
    this.studentApiURL + "/addDoctorDetails",
    JSON.stringify(post)
  );
}
/* Created By  :  Saubhgya Ranjan Patra ||  Created On  : 30-06-2022 || Component Name : ViewDoctorDetailsComponent || Description:view doctor details data */
viewDoctorDetails(post:any): Observable<any>{
  return this.httpClient.post(this.studentApiURL + '/viewDoctorDetails',JSON.stringify(post)) 
}
/* Created By  :  Saubhgya Ranjan Patra ||  Created On  : 04-07-2022 || Component Name : EditDoctorDetailsComponent || Description: get  Data for edit doctor details */
getDoctorDetails(encId:string){
  return this.httpClient
    .post(this.studentApiURL + '/getDoctorDetails',JSON.stringify({encId:encId})
    )
}
/* Created By  :  Saubhgya Ranjan Patra ||  Created On  : 04-07-2022 || Component Name : EditDoctorDetailsComponent || Description: update doctor details data */
updateDoctorDetails(post: any):Observable<any> {
  return this.httpClient.post(
    this.studentApiURL + "/updateDoctorDetails",
    JSON.stringify(post)
  );
}
/* Created By  :  Saubhgya Ranjan Patra ||  Created On  : 04-07-2022 || Component Name : ViewDoctorDetailsComponent || Description:delete doctor details data */
deleteDoctorDetails(Id:number,userId:string,profileId:string){
  const allData = { Id,userId,profileId };
  return this.httpClient.post(this.studentApiURL + '/deleteDoctorDetails',  JSON.stringify(allData))
  .pipe(tap(()=>{
    this.RefreshRequired.next();
  }));
}
/* Created By  :  Saubhgya Ranjan Patra ||  Created On  : 04-07-2022 || Component Name : EditDoctorDetailsComponent || Description: get  Data for edit doctor details */
getDoctorAccordingToSchoolId(schoolId:string){
  return this.httpClient
    .post(this.studentApiURL + '/getDoctorAccordingToSchoolId',JSON.stringify({schoolId:schoolId})
    )
}
}
