import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {  Observable, Subject, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ContextTaggingService {

  constructor(private httpClient: HttpClient) { }
  private apiURL = environment.studentAPI;
  private schoolApiURL = environment.schoolAPI;
  private refreshRequired = new Subject<void>();
  get RefreshRequired() {
    return this.refreshRequired;
  }
  getContextList() {
    
    const allData = {}
    return this.httpClient.post(this.apiURL + "/getContextList",JSON.stringify(allData))
  }
  addContextTagging(post: any) {
    return this.httpClient.post(this.apiURL + "/addContextTagging", JSON.stringify(post))
  }
  viewContextTagging(post: any): Observable<any> {
    return this.httpClient
   .post(
     this.apiURL + '/viewContextTagging',
     JSON.stringify(post)
   );
  }
  getContextTagging(id: number): Observable<any> {
    const allData = {id};
    return this.httpClient.post(
      this.apiURL + '/getContextTagging',JSON.stringify(allData));
  }
  updateContextTagging(post: any): Observable<any> {
    return this.httpClient.post(
      this.apiURL + '/updateContextTagging',
      JSON.stringify(post)
    );
  }
  deleteContextTagging(id: number,userId:any,profileId:any): Observable<any> {
    return this.httpClient.post(this.apiURL + '/deleteContextTagging',JSON.stringify({'encId':id, 'userId':userId,'profileId':profileId}));
  }

}
