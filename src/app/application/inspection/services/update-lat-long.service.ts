import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, Subject, tap, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UpdateLatLongService {

  constructor(
    private httpClient: HttpClient,
  ) { }
  private apiURL = environment.inspectionAPI;
  private refreshRequired = new Subject<void>();
  get RefreshRequired() {
    return this.refreshRequired;
  }

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',

    })
  }

  getNewRequestUpdateLatLong(post: any): Observable<any> {
    return this.httpClient.post(
      this.apiURL + '/updateLatLongNewRequest',
      JSON.stringify(post),
      this.httpOptions
    )
  }

  getRejectedRequestUpdateLatLong(post: any): Observable<any> {
    return this.httpClient.post(
      this.apiURL + '/updateLatLongRejectedRequest',
      JSON.stringify(post),
      this.httpOptions
    )
  }

  updateStatusLatLongRequest(post: any): Observable<any> {
    return this.httpClient.post(
      this.apiURL + '/updateStatusLatLongRequest',
      JSON.stringify(post),
      this.httpOptions
    )
  }

  getApprovedRequestUpdateLatLong(post: any): Observable<any> {
    return this.httpClient.post(
      this.apiURL + '/getApprovedRequestUpdateLatLong',
      JSON.stringify(post),
      this.httpOptions
    )
  }
  getAutoRequestUpdateLatLong(post:any){
    return this.httpClient.post(
      this.apiURL + '/getAutoRequestUpdateLatLong',
      JSON.stringify(post),
      this.httpOptions
    )
  }
}
