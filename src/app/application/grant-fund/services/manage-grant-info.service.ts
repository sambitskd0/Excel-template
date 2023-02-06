import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, Subject, throwError, tap } from 'rxjs';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class ManageGrantInfoService {
  private apiURL = environment.grantAPI;

  private refreshRequired = new Subject<void>();
  get RefreshRequired() {
    return this.refreshRequired;
  }
  constructor(private httpClient: HttpClient) { }
  getGrantName(schoolCategory: any) {
    return this.httpClient.post(
      this.apiURL + '/getGrantName', JSON.stringify({ 'schoolCategory': schoolCategory })
    )
  }
  addGrantInfo(post: any): Observable<any> {
    return this.httpClient.post(
      this.apiURL + '/addGrantInfo',
      JSON.stringify(post)
    )
  }
  viewGrantInfo(post: any): Observable<any> {
    return this.httpClient
      .post(
        this.apiURL + "/viewGrantInfo",
        Object.assign(post)
      )
  }
  getGrantInfo(id: number): Observable<any> {
    const allData = { id };
    return this.httpClient.post(
      this.apiURL + '/getGrantInfo', JSON.stringify(allData))
  }
  updateGrantInfo(post: any) {
    return this.httpClient.post(this.apiURL + '/updateGrantInfo', JSON.stringify(post))
  }
  // deleteGrantInfo(id: number, userId: any) {
  //   return this.httpClient.post(this.apiURL + '/deleteGrantInfo', JSON.stringify({ 'encId': id, 'userId': userId }))
  // }
  deleteGrantInfo(id: number,userId:any,grantTypeId:any,schoolId:any, profileId:any){
    return this.httpClient.post(this.apiURL + '/deleteGrantInfo',JSON.stringify({'encId':id,'userId':userId,'grantTypeId':grantTypeId,'schoolId':schoolId, 'profileId': profileId}))
    .pipe(
      tap(() => {
        this.RefreshRequired.next();
      })
    );
  } 
}
