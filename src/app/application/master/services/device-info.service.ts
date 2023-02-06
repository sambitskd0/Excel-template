import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { catchError, Observable, Subject, throwError, tap } from 'rxjs';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class DeviceInfoServicesService {
  private userProfile = JSON.parse(sessionStorage.getItem("userProfile") || '{}');
  private userId = this.userProfile.userId;
  private apiURL = environment.masterAPI;
  // httpOptions = {
  //   headers: new HttpHeaders({
  //     'Content-Type': 'application/json',
  //   }),
  // }
  constructor(private http: HttpClient) { }
  createdevice(post: any): Observable<any> {
    post.userId = this.userId;
    return this.http.post(
      this.apiURL + '/addDeviceInfo',
      JSON.stringify(post)
    );
  }
  deviceinfoServicesservice(id: number): Observable<any> {
    return this.http.get(
      this.apiURL + '/viewDeviceInfo/' + id
    );
  }
  viewDeviceInfo(post: any): Observable<any> {
    return this.http.post(this.apiURL + '/viewDeviceInfo', JSON.stringify(post));
    // .pipe(catchError(this.errorHandler));
  }
  /* Created By  :  Saubhgya Ranjan Patra ||  Created On  : 25-05-2022 || Component Name : ViewCategoryComponent || Description: Delete SchoolCategory */
  deleteDeviceInfo(id: number, userId: any,profileId:any): Observable<any> {

    return this.http.post(this.apiURL + '/deleteDeviceInfo', JSON.stringify({ 'encId': id, 'userId': userId ,'profileId': profileId}));
    // .pipe(tap(()=>{
    //   catchError(this.errorHandler)
    // }));
  }
  getDeviceInfo(id: number): Observable<any> {
    const allData = { id };
    return this.http.post(
      this.apiURL + '/getDeviceInfo', JSON.stringify(allData));
  }
  updateDeviceInfo(post: any): Observable<any> {
    post.userId = this.userId;
    return this.http.post(this.apiURL + '/updateDeviceInfo', JSON.stringify(post));
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
