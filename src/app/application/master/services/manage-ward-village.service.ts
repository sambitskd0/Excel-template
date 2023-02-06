import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ManageWardVillageService {
  private apiURL = environment.masterAPI;
  private refreshRequired = new Subject<void>();
  get RefreshRequired() {
    return this.refreshRequired;
  }
  //   httpOptions = {
  //    headers: new HttpHeaders({
  //      'Content-Type': 'application/json'
  //    })
  //  } 
  constructor(private httpClient: HttpClient) { }
  /* Created By  :  Saubhgya Ranjan Patra ||  Created On  : 09-05-2022 || Component Name : ViewmanagenagarnigamComponent || Description: nagarnigam Listisg  */
  viewWardVillage(post: any): Observable<any> {
    return this.httpClient.post(this.apiURL + '/viewVillage', JSON.stringify(post));
  }
  /* Created By  :  Saubhgya Ranjan Patra ||  Created On  : 10-05-2022 || Component Name : AddmanagenagarnigamComponent || Description: Create nagarnigam */
  createWardVillage(post: any): Observable<any> {
    return this.httpClient.post(this.apiURL + '/addVillage', JSON.stringify(post));

  }
  /* Created By  :  Saubhgya Ranjan Patra ||  Created On  : 09-05-2022 || Component Name : ViewmanagenagarnigamComponent || Description: single delete nagarnigam   */
  deleteVillage(id: number, userId: any,profileId:any) {
    return this.httpClient.post(this.apiURL + '/deleteVillage', JSON.stringify({ 'encId': id, 'userId': userId,'profileId': profileId }));
  }
  /* Created By  :  Saubhgya Ranjan Patra ||  Created On  : 10-05-2022 || Component Name : EditmanagenagarnigamComponent || Description: get data for edit  nagarnigam   */

  getWardVillage(id: number): Observable<any> {
    const allData = { id };
    return this.httpClient.post(this.apiURL + '/getVillage', JSON.stringify(allData));
  }
  /* Created By  :  Saubhgya Ranjan Patra ||  Created On  : 10-05-2022 || Component Name : EditmanagenagarnigamComponent || Description: update data of  nagarnigam  */
  updateWardVillage(post: any) {
    return this.httpClient.post(this.apiURL + '/updateVillage', JSON.stringify(post));

  }

}
