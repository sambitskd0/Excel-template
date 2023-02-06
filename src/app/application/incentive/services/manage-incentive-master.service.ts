import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, Subject, throwError,tap } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ManageIncentiveMasterService {

  private apiURL = environment.masterAPI;
  private refreshRequired = new Subject<void>();
  get RefreshRequired() {
    return this.refreshRequired;
  }

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };
  constructor(private httpClient: HttpClient) { }

  /* Created By  : Manoj Kumar Baliarsingh ||  Created On  : 31-05-2022 || Component Name : AddIncentiveMasterComponent || Description: Add Incentive   */

  createIncentive(post: any): Observable<any> {
    return this.httpClient.post(this.apiURL + '/addIncentiveData',JSON.stringify(post))
  }
  deleteIncentive(id: number,userId:any, profileId:any): Observable<any>{
    const allData = {'encId':id, 'userId':userId, 'profileId':profileId};
    return this.httpClient.post(this.apiURL + '/deleteIncentiveData', JSON.stringify(allData))
  } 

  viewIncentive(post:any):Observable<any>{
    return this.httpClient.post(this.apiURL+'/viewIncentiveData', JSON.stringify(post))
  }

  getIncentive(id:number): Observable<any>{
    const allData = {'id':id};
    return this.httpClient.post(this.apiURL + '/getIncentiveData',JSON.stringify(allData))
  }

  updateIncentive(post: any): Observable<any>{
    return this.httpClient.post(this.apiURL + '/updateIncentiveData', JSON.stringify(post))
  }

 
}
