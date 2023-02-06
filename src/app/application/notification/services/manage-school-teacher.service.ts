import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject, tap } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ManageSchoolTeacherService {
  private apiURL = environment.notificationAPI;

  private refreshRequired = new Subject<void>();
  get RefreshRequired() {
    return this.refreshRequired;
  }

  formDataHttpOptions = {
    headers: new HttpHeaders({
      contentType: "formData",
    }),
  };

  constructor(private httpClient:HttpClient) { }
 
  /* Created By : Manoj Kumar Baliarsingh || Created On : 10-09-2022 || Service method Name : addOfficerNotification || Description: Get SchoolData Notification */
  getSchoolName(district:any = 0, block:any = 0, cluster:any = 0,management:any = 0,category:any = 0): Observable<any> {
    return this.httpClient.post(this.apiURL + '/getSchoolName', JSON.stringify({district, block, cluster,management,category}));
  } 

  /* Created By : Manoj Kumar Baliarsingh || Created On : 13-09-2022 || Service method Name : getTeacherName || Description: Get Teacher Data */
  getTeacherName(school:any = 0,appointType:any = 0,natureOfAppoint:any = 0): Observable<any> {
    return this.httpClient.post(this.apiURL + '/getTeacherName', JSON.stringify({school,appointType,natureOfAppoint}));
  }

  /* Created By : Manoj Kumar Baliarsingh || Created On : 13-09-2022 || Service method Name : getTeacherBySchoolId || Description: Get TeacherData By SchoolId */
  getTeacherBySchoolId(params:any): Observable<any> {
    return this.httpClient.post(this.apiURL + '/getTeacherBySchoolId', JSON.stringify(params));
  }
  
  /* Created By : Manoj Kumar Baliarsingh || Created On : 15-09-2022 || Service method Name : getSchoolByClusterId || Description: Get School Bt Cluster Id */
  getSchoolByClusterId(selClusterId:any){
    return this.httpClient.post(this.apiURL + '/getSchoolNameByClusterId', JSON.stringify({'clusterId':selClusterId}));
  }

  getDesignationGroup(){
    return this.httpClient.post(this.apiURL + '/getDesignationGroup', "");
  }

   /* Created By : Manoj Kumar Baliarsingh || Created On : 18-09-2022 || Service method Name : addTeacherSchoolNotification || Description: Add School Teacher Notification */

  addTeacherSchoolNotification(formData: any) {
    return this.httpClient.post(this.apiURL + "/addTeacherSchoolNotification", formData, this.formDataHttpOptions);
  }
  
  /* Created By : Manoj Kumar Baliarsingh || Created On : 22-09-2022 || Service method Name : viewNotificationSchoolTeacher || Description: View School Teacher Notification */
  viewNotificationSchoolTeacher(params:any){
    return this.httpClient.post(this.apiURL + '/viewNotificationSchoolTeacher',JSON.stringify(params));
  }
  
  /* Created By : Manoj Kumar Baliarsingh || Created On : 25-09-2022 || Service method Name : viewSchoolTeacherrNotificationDetails || Description: Show School Teacher notifications details in pop up  */
  viewSchoolTeacherrNotificationDetails(encId: any):Observable<any>{
    return this.httpClient.post(this.apiURL + '/viewSchoolTeacherNotificationDetails', JSON.stringify({encId}));    
  }

  /* Created By : Manoj Kumar Baliarsingh || Created On : 25-09-2022 || Service method Name : getSchoolTeacherNotificationDetails || Description: get notification detail based on notification id for edit  */
  getSchoolTeacherNotificationDetails(encId: any):Observable<any>{
    return this.httpClient.post(this.apiURL + '/getSchoolTeacherNotificationDetails', JSON.stringify({encId}));    
  }
  
  /* Created By : Manoj Kumar Baliarsingh || Created On : 27-09-2022 || Service method Name : deleteSchoolTeacherNotification || Description: Delete School Teacher Notification */
  deleteSchoolTeacherNotification(id:any, userId:any,profileId:any){
    return this.httpClient.post(this.apiURL + '/deleteSchoolTeacherNotification', JSON.stringify({'encId':id, 'userId':userId,'profileId':profileId}))
    .pipe(tap(()=>{
      this.RefreshRequired.next();
    }));
  }

  updateSchoolTeacherNotification(formData: any) {
    return this.httpClient.post(this.apiURL + "/updateSchoolTeacherNotification", formData, this.formDataHttpOptions);
  }

  /* Created By : Deepti Ranjan || Created On : 12-10-2022 || Service method Name : sendSchoolTeacherNotification || Description: Send School Teacher Notification */
  sendSchoolTeacherNotification(encId: any, userId:any):Observable<any>{
    return this.httpClient.post(this.apiURL + '/sendSchoolTeacherNotification', JSON.stringify({encId, userId}));    
  }


}
