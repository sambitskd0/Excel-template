import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ManagenagarnigamService {
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
  getAllNagarNigam(post: any): Observable<any> {
    return this.httpClient.post(this.apiURL + '/viewNagarnigam', JSON.stringify(post));
    // .pipe(
    //   catchError(this.errorHandler)
    // )   
  }

  /* Created By  :  Saubhgya Ranjan Patra ||  Created On  : 09-05-2022 || Component Name : ViewmanagenagarnigamComponent || Description: single delete nagarnigam   */
  deleteNagarnigam(id: number, userId: any,profileId:any) {
    return this.httpClient.post(this.apiURL + '/deleteNagarnigam', JSON.stringify({ 'encId': id, 'userId': userId ,'profileId': profileId }));
    // .pipe(tap(()=>{
    //   catchError(this.errorHandler)
    // }));
  }
  /* Created By  :  Saubhgya Ranjan Patra ||  Created On  : 10-05-2022 || Component Name : AddmanagenagarnigamComponent || Description: Create nagarnigam */
  createNagarNigam(post: any): Observable<any> {
    return this.httpClient.post(this.apiURL + '/addNagarnigam', JSON.stringify(post));

  }
  /* Created By  :  Saubhgya Ranjan Patra ||  Created On  : 10-05-2022 || Component Name : EditmanagenagarnigamComponent || Description: get data for edit  nagarnigam   */
  // getNagarnigam(id:any){ 
  //   return this.httpClient.get(this.apiURL + '/getNagarnigam/'+ id,  this.httpOptions)
  // }
  getNagarnigam(id: number): Observable<any> {
    const allData = { id };
    return this.httpClient.post(
      this.apiURL + '/getNagarnigam', JSON.stringify(allData));
  }
  /* Created By  :  Saubhgya Ranjan Patra ||  Created On  : 10-05-2022 || Component Name : EditmanagenagarnigamComponent || Description: update data of  nagarnigam  */
  updateNagarNigam(post: any) {
    return this.httpClient.post(this.apiURL + '/updateNagarnigam', JSON.stringify(post));

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
