import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable, Subject, throwError } from "rxjs";
import { catchError, tap } from "rxjs/operators";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: 'root'
})
export class LogInUserProfileService {

  private apiURL = environment.profileAPI;
  constructor
  (private httpClient: HttpClient,
  ){}

  viewLogInUser(userId: any): Observable<any> {
    return this.httpClient.post(this.apiURL + "/viewLogInUser", JSON.stringify({userId:userId}));
  }
 
}
