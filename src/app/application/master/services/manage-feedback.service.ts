import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, Observable, Subject, throwError, tap } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ManageFeedbackService {
  private apiURL = environment.masterAPI;
  private refreshRequired = new Subject<void>();
  get RefreshRequired() {
    return this.refreshRequired;
  }
  // httpOptions = {
  //   headers: new HttpHeaders({
  //     'Content-Type': 'application/json',
  //   }),
  // }

  constructor(private httpClient: HttpClient) { }

  viewFeedbackCategory(post: any): Observable<any> {
    return this.httpClient.post(this.apiURL + '/viewFeedbackCategory', JSON.stringify(post));
  }

  deleteFeedback(id: number, userId: any,profileId:any) {
    return this.httpClient.post(this.apiURL + '/deleteFeedbackCategory', JSON.stringify({ 'encId': id, 'userId': userId,'profileId': profileId }));
  }

  createFeedback(post: any): Observable<any> {
    return this.httpClient.post(this.apiURL + '/addFeedbackCategory', JSON.stringify(post));
  }

  getFeedbackData(id: number): Observable<any> {
    const allData = { id };
    return this.httpClient.post(this.apiURL + '/getFeedbackCategory', JSON.stringify(allData));
  }
  updateFeedback(post: any) {
    return this.httpClient.post(this.apiURL + '/updateFeedbackCategory', JSON.stringify(post));
  }
}
