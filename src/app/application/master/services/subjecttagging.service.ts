import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { catchError, Observable, Subject, throwError, tap } from 'rxjs';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class SubjecttaggingService {
  private apiURL = environment.masterAPI;

  //   httpOptions = {
  //     headers: new HttpHeaders({
  //   'Content-Type': 'application/json',
  // }),
  // }
  addSubjectTagging(post: any): Observable<any> {

    return this.http.post(
      this.apiURL + '/addSubjectTagging',
      JSON.stringify(post)
    );
  }

  constructor(private http: HttpClient) { }
  getSubjectTagging(id: number, streamId: number, groupId: number) {
    const allData = { id, streamId, groupId };
    return this.http.post(
      this.apiURL + '/getSubjectTagging', JSON.stringify(allData));

  }
  viewSubjectTagging(): Observable<any> {
    const allData = {};
    return this.http.post(this.apiURL + '/viewSubjectTagging', JSON.stringify(allData));
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
  getSubjectTaggingData(id: number) {
    return this.http.get(
      this.apiURL + '/getSubjectTagging/' + id,
    );
  }
  updateSubjectTagging(post: any) {

    return this.http.post(this.apiURL + '/updateSubjectTagging', JSON.stringify(post));
  }
  // getSubjectName(id: number){
  //   return this.http.get(
  //     this.apiURL + '/getSubjectName/' + id,
  //     this.httpOptions
  //   )
  // }
  getSubjectName(id: number): Observable<any> {
    const allData = { id };
    return this.http.post(
      this.apiURL + '/getSubjectName', JSON.stringify(allData));
  }
  getSubject() {
    const allData = {};
    return this.http.post(
      this.apiURL + '/getSubject', JSON.stringify(allData)
    );
  }
  getSubjectOpt(post: any) {
    return this.http.post(
      this.apiURL + "/getSubjectOpt",
      JSON.stringify({ post: post })
    );
  }
  deleteSubjectTagging(id: number, userId: any): Observable<any> {
    return this.http.post(this.apiURL + '/deleteSubjectTagging', JSON.stringify({ 'encId': id, 'userId': userId }));
  }

}
