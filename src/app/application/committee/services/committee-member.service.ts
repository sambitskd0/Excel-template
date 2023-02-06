import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Subject, tap, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CommitteeMemberService {
  private committeeURL = environment.committeeAPI;
   private refreshRequired = new Subject<void>();
   get RefreshRequired() {
     return this.refreshRequired;
   }
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };

  constructor(private httpClient:HttpClient) { }

  getMembers(post:any,school:any){
    const allData = { post, school};
    return this.httpClient.post(this.committeeURL+'/getMembers', JSON.stringify(allData));
  }
  getSchoolTypeBySchoolCatId(schoolId:any,schoolCatId:any){
    return this.httpClient.post(this.committeeURL+'/getSchoolTypeBySchoolCatId', JSON.stringify({'schoolId':schoolId,'schoolCatId':schoolCatId}));
  }
  addPriMembers(post:any,memberType:any,committeeType:any,academicYear:any){
     const allData = { post, memberType,committeeType,academicYear};
    return this.httpClient.post(this.committeeURL+'/addPriMembers', JSON.stringify(allData));
  }
  addOtherMemberData(post:any,memberType:any,committeeType:any,schoolId:any,userId:any,profileId:any,schoolCategory:any,academicYear:any){
     const allData = { post, memberType,committeeType,schoolId,userId,profileId,schoolCategory,academicYear};
    return this.httpClient.post(this.committeeURL+'/addOtherMembers', JSON.stringify(allData));
  }
  viewMembers(post:any){
   return this.httpClient.post(this.committeeURL+'/viewMembers', JSON.stringify(post));
 }
 deleteMember(id:any,userId:any,schoolId:any,profileId:any){
  return this.httpClient.post(this.committeeURL + '/deleteMember',JSON.stringify({'encId':id, 'userId':userId,'schoolId':schoolId,'profileId':profileId}))
 }
}
