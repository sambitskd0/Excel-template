import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, Subject, throwError,tap } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ManageMdmStudentExpensesService {

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };

  private apiURL = environment.mdmAPI;
  private refreshRequired = new Subject<void>();
  get RefreshRequired() {
    return this.refreshRequired;
  }
  
  constructor(private httpClient: HttpClient) { }

  createStudentExpenses(post: any): Observable<any> {
    return this.httpClient.post(
      this.apiURL + '/addStudentExpenses',
      JSON.stringify(post))
  }

  viewStudentExpenses(post:any):Observable<any>{
    return this.httpClient.post(this.apiURL+'/viewStudentExpenses', JSON.stringify(post))
    
  }

  getStudentExpenses(id:number){
    const allData = {id};
    return this.httpClient.post(
      this.apiURL + '/getStudentExpenses',JSON.stringify(allData))
  }
  updateStudentExpenses(post: any){
    return this.httpClient.post(this.apiURL + '/updateStudentExpenses', JSON.stringify(post))
  }
  deleteStudentExpenses(id: number,userId:any, profileId:any){
    // console.log(id);
    return this.httpClient
      .post(this.apiURL + '/deleteStudentExpenses',JSON.stringify({'encId':id, 'userId':userId, 'profileId': profileId}))
  }
}
