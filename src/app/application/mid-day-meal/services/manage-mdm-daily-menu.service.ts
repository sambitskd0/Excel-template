import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, Subject, throwError,tap } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ManageMdmDailyMenuService {

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
  constructor(public httpClient:HttpClient) { }
  
  getWeekDays(){
    const allData = {};
    return this.httpClient.post(
      this.apiURL + '/getWeekDays',JSON.stringify(allData))
  }
  getMdmItemName(){
    const allData = {};
    return this.httpClient.post(this.apiURL + '/getMdmItemName',JSON.stringify(allData))
  }
  getMdmDailyItemName(id:number){
    const allData = {id};
    return this.httpClient.post(this.apiURL + '/getMdmDailyItem',JSON.stringify(allData))
  }

  updateMdmDailyItem(post: any){
    return this.httpClient.post(this.apiURL + '/updateMdmDailyItem', JSON.stringify(post))
  }

  createMdmDailyItem(post: any): Observable<any> {
    return this.httpClient.post(this.apiURL + '/addMdmDailyItem',JSON.stringify(post))
  }

  viewMdmDailyItem(post:any):Observable<any>{
    return this.httpClient.post(this.apiURL+'/viewMdmDailyItem',JSON.stringify(post))
  }

  deleteMdmDailyItem(id: number,userId:any){
    return this.httpClient
      .post(this.apiURL + '/deleteMdmDailyItem',JSON.stringify({'encId':id, 'userId':userId}))
  }
}
