import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import {  Observable, Subject, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class StudentAchievementService {
constructor(private httpClient:HttpClient ) { }
private masterApiURL = environment.masterAPI;
private studentApiURL =environment.studentAPI;
private refreshRequired = new Subject<void>();
 get RefreshRequired() {
   return this.refreshRequired;
 }
 /* Created By  :  Saubhgya Ranjan Patra ||  Created On  : 23-06-2022 || Component Name : AddStudentAchievementComponent || Description: get  event name data */
 getEventName(post: any=""){
  return this.httpClient.post(this.masterApiURL + '/eventName',JSON.stringify(post))
}
getEventCategoryAccordingToEventType(eventId:any){
  return this.httpClient.post(this.studentApiURL + '/getEventCategoryAccordingToEventType', JSON.stringify({eventId}))
}
getEventMasterAccordingToEventCategory(categoryId:any){
  return this.httpClient.post(this.studentApiURL + '/getEventMasterAccordingToEventCategory', JSON.stringify({categoryId}))
}
 /* Created By  :  Saubhgya Ranjan Patra ||  Created On  : 23-06-2022 || Component Name : AddStudentAchievementComponent || Description: get all students data */
getStudents(schoolId:number,academicYear:string,classId:number,sectionId:number,streamId:number,groupId:number,eventDate:any=""){
  const allData = { schoolId,academicYear,classId,sectionId,streamId,groupId,eventDate };
  return this.httpClient.post(this.studentApiURL + '/getStudents', JSON.stringify(allData))
}
/* Created By  :  Saubhgya Ranjan Patra ||  Created On  : 23-06-2022 || Component Name : AddStudentAchievementComponent || Description: add student achievement data */
addStudentAchievement(post: any):Observable<any> {
  return this.httpClient.post(this.studentApiURL + "/addStudentAchievement",JSON.stringify(post));
}
/* Created By  :  Saubhgya Ranjan Patra ||  Created On  : 24-06-2022 || Component Name : EditStudentAchievementComponent || Description: update  student  achievement data */
updateStudentAchievement(post: any):Observable<any> {
  return this.httpClient.post(
    this.studentApiURL + "/updateStudentAchievement",JSON.stringify(post));
}
/* Created By  :  Saubhgya Ranjan Patra ||  Created On  : 28-06-2022 || Component Name : ViewStudentAchievementComponent || Description:view student  achievement data */
viewStudentAchievement(post:any): Observable<any>{
  return this.httpClient.post(this.studentApiURL + '/viewStudentAchievement',JSON.stringify(post))
}
/* Created By  :  Saubhgya Ranjan Patra ||  Created On  : 24-06-2022 || Component Name : ViewStudentAchievementComponent || Description:delete student achievement data */
deleteStudentAchievement(Id:number,userId:string,profileId:string){
  const allData = { Id,userId,profileId };
  return this.httpClient.post(this.studentApiURL + '/deleteStudentAchievement',  JSON.stringify(allData))
  .pipe(tap(()=>{
    this.RefreshRequired.next();
  }));
}
 /* Created By  :  Saubhgya Ranjan Patra ||  Created On  : 24-05-2022 || Component Name : EditStudentAchievementComponent || Description: get  Data for edit student achievement */
 getStudentAchievement(encId:string){
  return this.httpClient
    .post(this.studentApiURL + '/getStudentAchievement',JSON.stringify({encId:encId}))
  }
}
