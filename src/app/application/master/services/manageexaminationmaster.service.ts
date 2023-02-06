import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http'
import { catchError, Observable, Subject, throwError,tap } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ManageexaminationmasterService {
  private userProfile = JSON.parse(sessionStorage.getItem("userProfile") || '{}');
  private userId = this.userProfile.userId;
  private apiURL = environment.masterAPI;
//   httpOptions = {
//     headers: new HttpHeaders({
//   'Content-Type': 'application/json',
// }),
//   }

  private refreshRequired = new Subject<void>();
  get RefreshRequired() {
    return this.refreshRequired;
  }
  constructor(private http:HttpClient) { }
  addExaminationMaster(post: any): Observable<any> {
    post.userId = this.userId;
    return this.http.post(
      this.apiURL + '/addExaminationMaster',
      JSON.stringify(post)
    );
  }
  viewExaminationMaster():Observable<any>{
    const allData = {};
    return this.http.post(this.apiURL+'/viewExaminationMaster', JSON.stringify(allData));
    // .pipe(catchError(this.errorHandler));
  }
  getExaminationMaster(id: number){
    return this.http.get(
      this.apiURL + '/getExaminationMaster/' + id,
    );
  }
  // getExaminationMaster(id: number): Observable<any> {
  //   const allData = {id};
  //   return this.http.post(
  //     this.apiURL + '/getExaminationMaster/',JSON.stringify(allData))
  // }
  
  updateExaminationMaster(post: any){
    post.userId = this.userId;
    return this.http.post(this.apiURL + '/updateExaminationMaster', JSON.stringify(post));
  }
 
  deleteExaminationMaster(id: number,userId:any,profileId:any): Observable<any> {
    return this.http.post(this.apiURL + '/deleteExaminationMaster',JSON.stringify({'encId':id, 'userId':userId,'profileId':profileId}));
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
}
