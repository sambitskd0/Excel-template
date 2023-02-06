import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable, Subject, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class ManageGrantReceiveService {

  constructor(private httpClient: HttpClient) { }
  private apiURL = environment.grantAPI;
  private refreshRequired = new Subject<void>();
  get RefreshRequired() {
    return this.refreshRequired;
  }
  /* Created By : Saubhagya Ranjan || Created On : 06-09-2022 || Service method Name : addGrantReceive || Description: Add addSmartClass */
  addGrantReceive(post: any): Observable<any> {
    return this.httpClient.post(this.apiURL + '/addGrantReceive', JSON.stringify(post));
  }
  viewGrantReceive(post: any): Observable<any> {
    return this.httpClient.post(this.apiURL + '/viewGrantReceive', JSON.stringify(post))
  }
  /* Created By  :  Saubhgya Ranjan Patra ||  Created On  : 06-09-2022 || Component Name : ViewCategoryComponent || Description: Delete Grant Receive */
  deleteGrantReceive(id: number, userId: string, profileId:any) {
    const allData = { id, userId, profileId };
    return this.httpClient.post(this.apiURL + '/deleteGrantReceive', JSON.stringify(allData))
      .pipe(tap(() => {
        this.RefreshRequired.next();
      }));
  }
  /* Created By  :  Saubhgya Ranjan Patra ||  Created On  : 06-09-2022 || Component Name : EditGrantReceiveComponent || Description: get  Data for Grant Receive */
  getGrantReceive(encId: string) {
    return this.httpClient.post(this.apiURL + '/getGrantReceive', JSON.stringify({ encId: encId }))
  }
  /* Created By  :  Saubhgya Ranjan Patra ||  Created On  : 07-09-2022 || Component Name : editGrantReceiveComponent || Description: Updata Grant fund Receive data  */
  updateGrantReceive(post: any) {
    return this.httpClient.post(this.apiURL + '/updateGrantReceive', JSON.stringify(post))
  }

}
