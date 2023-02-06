import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ManageOfficerNotificationService {

  private notificationAPI = environment.notificationAPI;

  formDataHttpOptions = {
    headers: new HttpHeaders({
      contentType: "formData",
    }),
  };

  private refreshRequired = new Subject<void>();
  get RefreshRequired() {
    return this.refreshRequired;
  }

  constructor(private httpClient:HttpClient) { }

  /* Created By : Deepti Ranjan || Created On : 12-09-2022 || Service method Name : getNotificationAuthority || Description: Show user list in dropdown */
  getNotificationAuthority(district:any = 0, block:any = 0, cluster:any = 0): Observable<any> {
    return this.httpClient.post(this.notificationAPI + '/getNotificationAuthority', JSON.stringify({district, block, cluster}));
  }

  /* Created By : Deepti Ranjan || Created On : 13-09-2022 || Service method Name : addOfficerNotification || Description: Add Officer Notification */
  addOfficerNotification(formData: any) {
    return this.httpClient.post(this.notificationAPI + "/addOfficerNotification", formData, this.formDataHttpOptions);
  }

  /* Created By : Deepti Ranjan || Created On : 15-09-2022 || Service method Name : getDesignationUserCount || Description: To get designation wise user count list for notification */
  getDesignationUserCount(district:any = 0, block:any = 0, cluster:any = 0): Observable<any> {
    return this.httpClient.post(this.notificationAPI + '/getDesignationUserCount', JSON.stringify({district, block, cluster}));
  }

  /* Created By : Deepti Ranjan || Created On : 16-09-2022 || Service method Name : getDesignationUser || Description: To get designation wise user list for notification */
  getDesignationUser(designation:any = 0, district:any = 0, block:any = 0, cluster:any = 0): Observable<any> {
    return this.httpClient.post(this.notificationAPI + '/getDesignationUser', JSON.stringify({designation, district, block, cluster}));
  }

  /* Created By : Deepti Ranjan || Created On : 20-09-2022 || Service method Name : viewOfficerNotification || Description: View All Officer Notifications */
  viewOfficerNotification(params: object):Observable<any>{
    return this.httpClient.post(this.notificationAPI + '/viewOfficerNotification', params);    
  }

  /* Created By : Deepti Ranjan || Created On : 21-09-2022 || Service method Name : viewOfficerNotificationDetails || Description: Show officer notifications details in pop up */
  viewOfficerNotificationDetails(encId: any):Observable<any>{
    return this.httpClient.post(this.notificationAPI + '/viewOfficerNotificationDetails', JSON.stringify({encId}));    
  }

  /* Created By : Deepti Ranjan || Created On : 21-09-2022 || Service method Name : deleteOfficerNotification || Description: To delete notification */
  deleteOfficerNotification(id:any, userId:any,profileId:any){
    return this.httpClient.post(this.notificationAPI + '/deleteOfficerNotification', JSON.stringify({'encId':id, 'userId':userId,'profileId':profileId}))
    .pipe(tap(()=>{
      this.RefreshRequired.next();
    }));
  }

  /* Created By : Deepti Ranjan || Created On : 21-09-2022 || Service method Name : getOfficerNotificationDetails || Description: Get officer notifications details for edit */
  getOfficerNotificationDetails(encId: any):Observable<any>{
    return this.httpClient.post(this.notificationAPI + '/getOfficerNotificationDetails', JSON.stringify({encId}));    
  }

  /* Created By : Deepti Ranjan || Created On : 27-09-2022 || Service method Name : updateOfficerNotification || Description: Update Officer Notification */
  updateOfficerNotification(formData: any) {
    return this.httpClient.post(this.notificationAPI + "/updateOfficerNotification", formData, this.formDataHttpOptions);
  }

  /* Created By : Deepti Ranjan || Created On : 06-10-2022 || Service method Name : sendOfficerNotification || Description: Send Officer Notification */
  sendOfficerNotification(encId: any, userId:any):Observable<any>{
    return this.httpClient.post(this.notificationAPI + '/sendOfficerNotification', JSON.stringify({encId, userId}));    
  }

}
