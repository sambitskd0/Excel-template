import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, Subject, throwError ,tap} from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ManageMdmItemService {

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

  createMDMItem(post: any): Observable<any> {
    return this.httpClient.post(this.apiURL + '/addMDMItem',JSON.stringify(post))
  }

  viewMdmItem(post:any):Observable<any>{
    return this.httpClient.post(this.apiURL+'/viewMDMItem',JSON.stringify(post));
  }

  getMdmItem(id:number){
    const allData = {id};
    return this.httpClient.post(this.apiURL + '/getMDMItem',JSON.stringify(allData))
  }
  
  updateMdmItem(post: any){
    return this.httpClient.post(this.apiURL + '/updateMDMItem', JSON.stringify(post))
  }
  deleteMdmItem(id: number,userId:any, profileId:any){
    return this.httpClient.post(this.apiURL + '/deleteMDMItem',JSON.stringify({'encId':id, 'userId':userId, 'profileId': profileId}))
      
  }
}
