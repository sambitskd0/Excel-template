import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import {  Observable, Subject, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class LibraryattendanceService {
  httpOptions = {
    headers: new HttpHeaders({
  'Content-Type': 'application/json',
}),
};
  constructor(private httpClient:HttpClient) { }
  private apiURL = environment.schoolAPI;

  addLibraryAttendance(post: any): Observable<any> {
    return this.httpClient.post(
      this.apiURL + '/addLibraryAttendance',
      JSON.stringify(post),
      this.httpOptions
    )
  }
  viewLibraryAttendance(post: any): Observable<any> {
    return this.httpClient
   .post(
     this.apiURL + '/viewLibraryAttendance',
     JSON.stringify(post),
     this.httpOptions
   ) 
}
getTeacherCount(schoolId:any,academicYear:any){
  return this.httpClient
    .post(
      this.apiURL + '/getTeacherCount',
      JSON.stringify({schoolId:schoolId,academicYear:academicYear}),
      this.httpOptions,
    )

}
}
