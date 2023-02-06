import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, Subject, tap, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class ManageClusterService {
  private apiURL = environment.masterAPI;

  private refreshRequired = new Subject<void>();
  get RefreshRequired() {
    return this.refreshRequired;
  }

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }

  constructor(private httpClient: HttpClient) { }

  /* Created By  :  Saubhgya Ranjan Patra ||  Created On  : 09-05-2022 || Component Name : ViewmanageclusterComponent || Description: Cluster view eith filter search  */
  viewCluster(post: any): Observable<any> {
    return this.httpClient.post(this.apiURL + '/viewCluster', JSON.stringify(post));
    // .pipe(
    //   catchError(this.errorHandler)
    // )   
  }

  /* Created By  :  Saubhgya Ranjan Patra ||  Created On  : 09-05-2022 || Component Name : AddmanageclusterComponent || Description: Cluster creating  */
  createCluster(post: any): Observable<any> {
    return this.httpClient.post(this.apiURL + '/addCluster', JSON.stringify(post));
  }

  /* Created By  :  Saubhgya Ranjan Patra ||  Created On  : 09-05-2022 || Component Name : EditmanageclusterComponent || Description:Get Cluster data for edit purpose  */
  getClusterById(id: number): Observable<any> {
    const allData = { id };
    return this.httpClient.post(this.apiURL + '/getClusterById', JSON.stringify(allData));
  }

  /* Created By  :  Saubhgya Ranjan Patra ||  Created On  : 09-05-2022 || Component Name : ViewmanageclusterComponent || Description: Delete Cluster  */
  deleteCluster(id: number, userId: any,profileId:any) {
    return this.httpClient.post(this.apiURL + '/deleteCluster', JSON.stringify({ 'encId': id, 'userId': userId,'profileId': profileId }))
  }

  /* Created By  :  Saubhgya Ranjan Patra ||  Created On  : 09-05-2022 || Component Name : EditmanageclusterComponent || Description: Update Cluster data  */
  updateCluster(post: any) {
    return this.httpClient.post(this.apiURL + '/updateCluster', JSON.stringify(post));
  }

  errorHandler(error: any) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      errorMessage = error.error.message;
    } else {
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    // this.alertHelper.viewAlert('error','Invalid Inputs',errorMessage)
    return throwError(() => new Error(errorMessage));
  }
}
