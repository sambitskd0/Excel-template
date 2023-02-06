import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Subject, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CommitteeMeetingService {
  private committeeURL = environment.committeeAPI;
   private refreshRequired = new Subject<void>();
   get RefreshRequired() {
     return this.refreshRequired;
   }
  formDataHttpOptions = {
    headers: new HttpHeaders({
      contentType: "formData",
    }),
  };
  constructor(private httpClient:HttpClient) { }

/*   getMemberList(event:any){
    const allData = {event};
    return this.httpClient.post(this.committeeURL+'/getCommitteeMemberList', JSON.stringify(allData),this.httpOptions)
    .pipe(catchError(this.errorHandler));
  } */
  /* addMembersAttendMeeting(post:any,userId:any,school:any){
    const allData = {post,userId,school};
   return this.httpClient.post(this.committeeURL+'/addMembersAttendMeeting', JSON.stringify(allData),this.httpOptions);
 } */

 viewMeetingMember(post:any){
    return this.httpClient.post(this.committeeURL+'/viewCommitteeMeetingList', JSON.stringify(post));
  }
  getMemberAttended(post:any){
    return this.httpClient.post(this.committeeURL+'/getMemberAttended', JSON.stringify({'id':post}));
  }
  addMembersAttendMeeting(formData: any) {
    return this.httpClient.post(this.committeeURL + "/addMembersAttendMeeting", formData, this.formDataHttpOptions);
  }
}
