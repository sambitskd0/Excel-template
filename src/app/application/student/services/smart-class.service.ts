import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import {  Observable, Subject, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class SmartClassService {
  constructor(private httpClient:HttpClient) { }
  private apiURL = environment.schoolAPI;
  private masterApiURL = environment.masterAPI;
  private studentApiURL =environment.studentAPI;
 private refreshRequired = new Subject<void>();
 get RefreshRequired() {
   return this.refreshRequired;
 }
 getSection(classId: any,schoolId: any,academicYear: any) {
  return this.httpClient.post(
    this.apiURL + "/getSection",
    JSON.stringify({classId,schoolId,academicYear})
  );
}
 getSubjectAccordingToClass(classId:any) {
  return this.httpClient.post(
    this.masterApiURL +"/getSubjectAccordingToClass",
    JSON.stringify({classId}) 
  );
}
/* Created By : Saubhagya Ranjan || Created On : 17-06-2022 || Service method Name : addSmartClass || Description: Add addSmartClass */
addSmartClass(post:any):Observable<any>{
  return this.httpClient.post(this.studentApiURL + '/addSmartClass', JSON.stringify(post));    
}
 /* Created By  :  Saubhgya Ranjan  ||  Created On  : 20-06-2022 || Component Name : ViewSmartClassComponent || Description: View of all smart class with search filter  */
viewSmartClass(post:any): Observable<any> { 
  return this.httpClient.post(this.studentApiURL + '/viewSmartClass',JSON.stringify(post))
 
}

 /* Created By  :  Saubhgya Ranjan Patra ||  Created On  : 25-05-2022 || Component Name : ViewCategoryComponent || Description: Delete SchoolCategory */
 deleteSmartClass(id:number,userId:string,profileId:string){
  const allData = { id,userId,profileId };
  return this.httpClient.post(this.studentApiURL + '/deleteSmartClass',JSON.stringify(allData))
  .pipe(tap(()=>{
    this.RefreshRequired.next();
    
  }));
}
 /* Created By  :  Saubhgya Ranjan Patra ||  Created On  : 25-05-2022 || Component Name : EditCategoryComponent || Description: get  Data for edit SchoolCategory */
getSmartClass(encId:string){
  return this.httpClient
    .post(this.studentApiURL + '/getSmartClass',JSON.stringify({encId:encId}))
}
 /* Created By  :  Saubhgya Ranjan Patra ||  Created On  : 26-05-2022 || Component Name : EditCategoryComponent || Description: Updata SchoolCategory data  */
 updateSmartClass(post:any){
  return this.httpClient.post(this.studentApiURL + '/updateSmartClass', JSON.stringify(post))
} 
getSubject(post:any=''){
  return this.httpClient.post(this.masterApiURL+ '/getSubject', JSON.stringify(post))
}
}
 