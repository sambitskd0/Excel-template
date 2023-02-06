import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, Subject, tap, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class HolidayService {

  constructor(
    private httpClient : HttpClient,
  ) { }

  private apiURL = environment.holidayAPI;
  private apiSchoolURL = environment.schoolAPI;
  private apiMasterURL = environment.masterAPI;

  private refreshRequired = new Subject<void>();
  get RefreshRequired() {
    return this.refreshRequired;
  }

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      //'skipInterCept':'true'
    }) 
  }

  addHoliday(post:any): Observable <any> {
    return this.httpClient.post(
      this.apiURL + '/addHoliday',
      JSON.stringify(post),
      this.httpOptions
    )
  }

  updateHoliday(post:any): Observable <any> {
    return this.httpClient.post(
      this.apiURL + '/updateHoliday',
      JSON.stringify(post),
      this.httpOptions
    )
  }

  // viewHoliday(post: any,dataTable:any): Observable<any> {
  //   return this.httpClient
  //     .post(
  //       this.apiURL + '/viewHoliday',
  //        Object.assign(dataTable,post)
  //     )
  //     .pipe(catchError(this.errorHandler));
  // }
  viewHoliday(post: any): Observable<any> {
    return this.httpClient
   .post(
     this.apiURL + '/viewHoliday',
     JSON.stringify(post),
     this.httpOptions
   )
   .pipe(catchError(this.errorHandler)); 
}

  getHoliday(postParams:any): Observable<any>{
    return this.httpClient
      .post(
        this.apiURL + '/getHoliday',
        postParams,
        this.httpOptions,
      )
      .pipe(catchError(this.errorHandler))
  }

  deleteHoliday(postParams:any){
    return this.httpClient.post(this.apiURL + '/deleteHoliday', postParams, this.httpOptions)
    .pipe(tap(()=>{
      this.RefreshRequired.next();
      catchError(this.errorHandler)
    }));
  } 

  holidayCalender(postParam:any){
    return this.httpClient.post(this.apiURL+'/holidayCalender',postParam, this.httpOptions)
    .pipe(tap(()=>{
      catchError(this.errorHandler)
    }));
  }

  errorHandler(error: any) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      errorMessage = error.error.message;
    } else {
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    return throwError(() => new Error(errorMessage));
  }

}
