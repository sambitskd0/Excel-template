import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http'
import { catchError, Observable, Subject, throwError,tap } from 'rxjs';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class SubjectService {
  private userProfile = JSON.parse(sessionStorage.getItem("userProfile") || '{}');
  private userId = this.userProfile.userId;
  // private apiURL = "http://localhost:8000";
  private apiURL = environment.masterAPI;
  

  // httpOptions = {
  //       headers: new HttpHeaders({
  //     'Content-Type': 'application/json',
  //   }),
  // }
  constructor(private http:HttpClient) { }
  saveusers(post: any): Observable<any> {
    post.userId = this.userId;
    return this.http.post(
      this.apiURL + '/addSubject',
      JSON.stringify(post)
    );
  }
  subjectservice(id: number){
    return this.http.get(
      this.apiURL + '/viewsubject' + id
    );
   }
 
  viewSubjectCategory(post: any): Observable<any> {
       return this.http
      .post(
        this.apiURL + '/viewSubject',
        JSON.stringify(post)
      );
  }
  // errorHandler(error: any) {
  //   let errorMessage = '';
  //   if (error.error instanceof ErrorEvent) {
  //     errorMessage = error.error.message;
  //   } else {
  //     errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
  //   }
  //   return throwError(() => new Error(errorMessage));
  // }
  
  deleteSubject(id: number,userId:any,profileId:any): Observable<any> {
 return this.http.post(this.apiURL + '/deleteSubject',JSON.stringify({'encId':id, 'userId':userId,'profileId':profileId}));
    // .pipe(tap(()=>{
    //   catchError(this.errorHandler)
    // }));
  }
  
  getSubjectData(id: number): Observable<any> {
    const allData = {id};
    return this.http.post(
      this.apiURL + '/showSubject',JSON.stringify(allData));
  }
  updateSubject(post: any){
    post.userId = this.userId;
     return this.http.post(this.apiURL + '/updateSubject', JSON.stringify(post));
   }
}
