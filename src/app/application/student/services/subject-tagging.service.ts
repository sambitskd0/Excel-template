import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SubjectTaggingService {

  constructor(private httpClient: HttpClient) { }
  private studentApiURL = environment.studentAPI;
  private schoolApiURL = environment.schoolAPI;
  private refreshRequired = new Subject<void>();
  get RefreshRequired() {
    return this.refreshRequired;
  }
  getSubjectList() {
    const allData = {}
    return this.httpClient.post(this.studentApiURL + "/getSubjectList",JSON.stringify(allData))
  }
  addSubjectTagging(post: any) {
    return this.httpClient.post(this.studentApiURL + "/addSubjectTagging", JSON.stringify(post))
  }

  viewSubjectTaggingDetails(post: any) {
    return this.httpClient.post(this.studentApiURL + "/viewSubjectTaggingDetails", JSON.stringify(post))
  }

  deleteSubjectTaggingDetails(post: any,userId:any,profileId:any) {
    return this.httpClient.post(this.studentApiURL + "/deleteSubjectTaggingDetails", JSON.stringify({'encId': post,'userId':userId,'profileId':profileId}))
  }

  editSubjectTaggingDetails(post: any) {
    return this.httpClient.post(this.studentApiURL + "/editSubjectTaggingDetails", JSON.stringify({'encId': post}))
  }

  updateSubjectTaggingDetails(post: any) {
    return this.httpClient.post(this.studentApiURL + "/updateSubjectTaggingDetails", JSON.stringify(post))
  }
}
