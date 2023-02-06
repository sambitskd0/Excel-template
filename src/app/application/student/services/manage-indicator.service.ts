import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import {  Observable, Subject, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ManageIndicatorService {

  constructor(private httpClient:HttpClient) { }
  private apiURL = environment.studentAPI;
  private masterApiURL = environment.masterAPI;
  private studentApiURL =environment.studentAPI;
 private refreshRequired = new Subject<void>();
 get RefreshRequired() {
   return this.refreshRequired;
 }
 getSubject(classId:any) {

  return this.httpClient.post(
    this.apiURL + '/getSubject', JSON.stringify({classId:classId})
  );
}
addIndicator(post: any): Observable<any> {
  return this.httpClient.post(
    this.apiURL + '/addIndicator',
    JSON.stringify(post)
  );
}
viewIndicator(post: any): Observable<any> {
  return this.httpClient
 .post(
   this.apiURL + '/viewIndicator',
   JSON.stringify(post)
 );
}
getIndicator(id: number): Observable<any> {
  const allData = {id};
  return this.httpClient.post(
    this.apiURL + '/getIndicator',JSON.stringify(allData));
}
updateIndicator(post: any): Observable<any> {
  return this.httpClient.post(
    this.apiURL + '/updateIndicator',
    JSON.stringify(post)
  );
}
deleteIndicator(id: number,userId:any,profileId:any): Observable<any> {
  return this.httpClient.post(this.apiURL + '/deleteIndicator',JSON.stringify({'encId':id, 'userId':userId,'profileId':profileId}));
}
}
