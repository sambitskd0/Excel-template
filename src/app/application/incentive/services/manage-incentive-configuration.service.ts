import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, Subject, throwError ,tap} from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ManageIncentiveConfigurationService {

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
  constructor(private httpClient:HttpClient) { }

  getIncentiveName(){
    const allData = {};
    return this.httpClient.post(
      this.apiURL + '/getIncentiveName',JSON.stringify(allData))
  }

  addIncentiveConfig(post:any):Observable<any>{
    return this.httpClient.post(this.apiURL + '/addIncentiveConfigData', JSON.stringify(post))
  }
  viewIncentiveConfig(post:any): Observable<any>{
    return this.httpClient.post(this.apiURL+'/viewIncentiveConfigData', JSON.stringify(post))
  }
  getIncentiveConfig(id:number): Observable<any>{
    const allData = ({'id':id});
    return this.httpClient.post(this.apiURL + '/getIncentiveConfigData', JSON.stringify(allData))
  }
  updateIncentiveConfig(post:any): Observable<any>{
    return this.httpClient.post(this.apiURL + '/updateIncentiveConfigData', JSON.stringify(post))
    
  }
  deleteIncentiveConfigMaster(id: number,userId:any, profileId:any){
    const allData = {'encId':id, 'userId':userId, 'profileId':profileId};
    return this.httpClient.post(this.apiURL + '/deleteIncentiveConfigData', JSON.stringify(allData))
  } 
  
}
