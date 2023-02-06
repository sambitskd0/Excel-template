import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, Subject, tap, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ManageDistrictService {
  private userProfile = JSON.parse(sessionStorage.getItem("userProfile") || '{}');
  private userId = this.userProfile.userId;
  private apiURL = environment.masterAPI;
  private refreshRequired = new Subject<void>();
  get RefreshRequired() {
    return this.refreshRequired;
  }
  // httpOptions = {
  //   headers: new HttpHeaders({
  //     'Content-Type': 'application/json',
  //   }),
  // };

  constructor(private httpClient: HttpClient) { }

  /* Created By  :  Saubhgya Ranjan Patra ||  Created On  : 04-05-2022 || Component Name : ViewmanagedistrictComponent || Description: view District  according to filter  */
  viewDistrict(post: any): Observable<any> {
    return this.httpClient
      .post(
        this.apiURL + '/viewDistrict',
        JSON.stringify(post)
      )
  }

  /* Created By  :  Saubhgya Ranjan Patra ||  Created On  : 04-05-2022 || Component Name : AddmanagedistrictComponent || Description: Add District   */
  createDistrict(post: any): Observable<any> {
    return this.httpClient.post(
      this.apiURL + '/addDistrict',
      JSON.stringify(post)
    )
  }

  /* Created By  :  Saubhgya Ranjan Patra ||  Created On  : 04-05-2022 || Component Name : EditmanagedistrictComponent || Description: Data for District edit   */
  getDistrictById(id: number): Observable<any> {
    const allData = { id };
    return this.httpClient.post(
      this.apiURL + '/getDistrictById', JSON.stringify(allData))
  }

  /* Created By  :  Saubhgya Ranjan Patra ||  Created On  : 04-05-2022 || Component Name : ViewmanagedistrictComponent || Description: Delete District   */
  deleteDistrict(id: number, userId: any,profileId:any) {
    return this.httpClient
      .post(this.apiURL + '/deleteDistrict', JSON.stringify({ 'encId': id, 'userId': userId,'profileId':profileId }));
  }

  updateDistrict(post: any) {
    return this.httpClient
      .post(
        this.apiURL + '/updateDistrict',
        JSON.stringify(post)
      )
  }

  // errorHandler(error: any) {
  //   let errorMessage = '';
  //   if (error.error instanceof ErrorEvent) {
  //     errorMessage = error.error.message;
  //   } else {
  //     errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
  //   }
  //   // this.alertHelper.viewAlert('error','Invalid Inputs',errorMessage)
  //   return throwError(() => new Error(errorMessage));
  // }
}
