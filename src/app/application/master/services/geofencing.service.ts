import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { catchError, Observable, Subject, throwError, tap } from 'rxjs';
import { HttpHeaders, HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class GeofencingService {
  private userProfile = JSON.parse(sessionStorage.getItem("userProfile") || '{}');
  private userId = this.userProfile.userId;
  private apiURL = environment.masterAPI;
  //   httpOptions = {
  //     headers: new HttpHeaders({
  //   'Content-Type': 'application/json',
  // }),
  // }


  constructor(private http: HttpClient) { }

  getGeoFencingData(id: number): Observable<any> {
    const allData = { id };
    return this.http.post(
      this.apiURL + '/getGeoFencing', JSON.stringify(allData))
  }
  updateGeoFencingData(post: any) {
    post.userId = this.userId;
    return this.http.post(this.apiURL + '/updateGeoFencing', JSON.stringify(post));
  }
}
