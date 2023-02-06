/**
* Created By  : Deepti Ranjan
* Created On  : 04-07-2022
* Module Name : Grievance
* Description : Managing common services.
**/
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpHeaders, HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CommonGrievanceService {

  private userProfile = JSON.parse(sessionStorage.getItem("userProfile") || '{}');
  private userId = this.userProfile.userId;

  private refreshRequired = new Subject<void>();
  get RefreshRequired() {
    return this.refreshRequired;
  }

  private apiURL = environment.grievanceAPI;
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    })
  }
  
  constructor(private httpClient: HttpClient) { }

  /* Created By : Deepti Ranjan || Created On : 04-07-2022 || Service method Name : getGrievanceStatus || Description: Show all grievance status in dropdown */
  getGrievanceStatus():Observable<any>{
    return this.httpClient.get(this.apiURL + '/getGrievanceStatus', this.httpOptions);    
  }
  
}
