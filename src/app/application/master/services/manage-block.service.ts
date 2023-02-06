import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ManageBlockService {

  private refreshRequired = new Subject<void>();
  get RefreshRequired() {
    return this.refreshRequired;
  }

  private apiURL = environment.masterAPI;
  // httpOptions = {
  //   headers: new HttpHeaders({
  //     'Content-Type': 'application/json'
  //   })
  // }

  constructor(private httpClient: HttpClient) { }

  /* Created By  :  Saubhgya Ranjan Patra ||  Created On  : 06-05-2022 || Component Name : ViewmanageblockComponent || Description: View of Block And search filter  */
  getAllBlock(post: any): Observable<any> {
    return this.httpClient.post(this.apiURL + '/viewBlock', JSON.stringify(post));
    // .pipe(
    //   catchError(this.errorHandler)
    // )   
  }

  /* Created By  :  Saubhgya Ranjan Patra ||  Created On  : 06-05-2022 || Component Name : ViewmanageblockComponent || Description: Delete Block */
  deleteBlock(id: number, userId: any,profileId:any) {
    return this.httpClient.post(this.apiURL + '/deleteBlock', JSON.stringify({ 'encId': id, 'userId': userId,'profileId': profileId }));
    // .pipe(tap(()=>{
    //   this.RefreshRequired.next();
    //   catchError(this.errorHandler)
    // }));
  }

  /* Created By  :  Saubhgya Ranjan Patra ||  Created On  : 06-05-2022 || Component Name : AddmanageblockComponent || Description: Block creating  */
  createBlock(post: any): Observable<any> {
    return this.httpClient.post(this.apiURL + '/addBlock', JSON.stringify(post));
  }

  /* Created By  :  Saubhgya Ranjan Patra ||  Created On  : 06-05-2022 || Component Name : EditmanageblockComponent || Description: Block Data for edit */
  getBlockById(id: number): Observable<any> {
    const allData = { id };
    return this.httpClient.post(this.apiURL + '/getBlockById', JSON.stringify(allData));
  }

  /* Created By  :  Saubhgya Ranjan Patra ||  Created On  : 06-05-2022 || Component Name : EditmanageblockComponent || Description: Updata Block data  */
  updateBlock(post: any) {
    return this.httpClient.post(this.apiURL + '/updateBlock', JSON.stringify(post));

  }

  // errorHandler(error:any) {
  //   let errorMessage = '';
  //   if(error.error instanceof ErrorEvent) {
  //     errorMessage = error.error.message;
  //   } else {
  //     errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
  //   }
  //   return throwError(() => new Error(errorMessage));
  // }

}
