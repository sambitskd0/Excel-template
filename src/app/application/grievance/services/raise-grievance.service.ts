/**
* Created By  : Deepti Ranjan
* Created On  : 21-06-2022
* Module Name : Grievance
* Description : Managing services for Raise Grievance.
**/
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpHeaders, HttpClient, HttpParams } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class RaiseGrievanceService {
  private userProfile = JSON.parse(sessionStorage.getItem("userProfile") || '{}');
  private userId = this.userProfile.userId;
  private loginUserType = this.userProfile.loginUserTypeId;

  private refreshRequired = new Subject<void>();
  get RefreshRequired() {
    return this.refreshRequired;
  }

  private apiURL = environment.grievanceAPI;

  formDataHttpOptions = {
    headers: new HttpHeaders({
      contentType: "formData",
    }),
  };
  
  constructor(private httpClient: HttpClient) { }

  /* Created By : Deepti Ranjan || Created On : 20-06-2022 || Service method Name : viewSetAuthority || Description: Show all set authority in view page */
  viewGrievance(grievanceType: any):Observable<any>{
    return this.httpClient.post(this.apiURL + '/viewGrievance', JSON.stringify({'userId':this.userId, 'grievanceType':grievanceType, 'loginUserType':this.loginUserType}));    
  }

  viewGrievanceData(params: object):Observable<any>{
    return this.httpClient.post(this.apiURL + '/viewGrievanceData', params);    
  }

  /* Created By : Deepti Ranjan || Created On : 30-06-2022 || Service method Name : viewGrievanceDetails || Description: Show details of grievance in pop up */
  viewGrievanceDetails(encId: any):Observable<any>{
    return this.httpClient.post(this.apiURL + '/viewGrievanceDetails', JSON.stringify({'token':encId}));    
  }

  /* Created By : Deepti Ranjan || Created On : 04-07-2022 || Service method Name : viewActionHistory || Description: Show action history in pop up */
  viewActionHistory(encId: any, approvalId: any):Observable<any>{
    return this.httpClient.post(this.apiURL + '/viewActionHistory', JSON.stringify({'token':encId, 'approvalId':approvalId}));    
  }

  /* Created By : Deepti Ranjan || Created On : 05-07-2022 || Service method Name : viewGrievanceCount || Description: Show all status wise grievance count */
  viewGrievanceCount(grievanceType: any):Observable<any>{
    return this.httpClient.post(this.apiURL + '/viewGrievanceCount', JSON.stringify({'userId':this.userId, 'grievanceType':grievanceType, 'loginUserType':this.loginUserType}));    
  }

  /* Created By : Deepti Ranjan || Created On : 13-07-2022 || Service method Name : getForwardAuthority || Description: Get next level forward authority */
  getForwardAuthority(encId: any):Observable<any>{
    return this.httpClient.post(this.apiURL + '/getForwardAuthority', JSON.stringify({'token':encId}));    
  }

  /* Created By : Deepti Ranjan || Created On : 30-09-2022 || Service method Name : takeAction || Description: Submit Take Action form */
  takeAction(formData: any) {
    return this.httpClient.post(this.apiURL + "/takeAction", formData, this.formDataHttpOptions);
  }

  /* Created By : Deepti Ranjan || Created On : 30-09-2022 || Service method Name : addGrievance || Description: Submit Grievance form */
  addGrievance(formData: any) {
    return this.httpClient.post(this.apiURL + "/addGrievance", formData, this.formDataHttpOptions);
  }
}
