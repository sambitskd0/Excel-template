import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http'
import { catchError, Observable, Subject, throwError,tap } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ManageMarkconfigurationService {
  private apiURL = environment.masterAPI;
//   httpOptions = {
//     headers: new HttpHeaders({
//   'Content-Type': 'application/json',
// }),
// }

  constructor(private http:HttpClient) { }
  
  getClassByTermId(examinationTypeId: any)
  {
  return this.http.post(
    this.apiURL + "/getClassByTermId",
    JSON.stringify({ examinationTypeId })
  );
  }
  getSubjectForMarkConfiguration(post: any)
  {
    return this.http.post(
      this.apiURL + "/getSubjectForMarkConfiguration" ,JSON.stringify(post)
    );
  }
  addMarkConfiguration(post: any): Observable<any> {
    return this.http.post(
      this.apiURL + '/addMarkConfiguration',
      JSON.stringify(post)
    );
  }
}
