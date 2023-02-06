import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http'
import { catchError, Observable, Subject, throwError,tap } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ManageStudentGradeService {
  private apiURL = environment.masterAPI;
//   httpOptions = {
//     headers: new HttpHeaders({
//   'Content-Type': 'application/json',
// }),
//   }

  constructor(private http:HttpClient) { }
  viewStudentGradeMaster():Observable<any>{
    const allData = {};
    return this.http.post(this.apiURL+'/viewStudentGradeMaster', JSON.stringify(allData));
    // .pipe(catchError(this.errorHandler));
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
