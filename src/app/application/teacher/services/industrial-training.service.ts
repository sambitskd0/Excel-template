import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, Subject, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class IndustrialTrainingService {

  constructor(private httpClient: HttpClient) { }
  private masterAPI = environment.masterAPI;
  private teacherAPI = environment.teacherAPI;
  private schoolAPI = environment.schoolAPI;
  private refreshRequired = new Subject<void>();

  httpOptions = {
    headers: new HttpHeaders({
      "Content-Type": "multipart/form-data",
      Accept: "application/json",
    }),
  };

  addTrainingCategory(post: any): Observable<any> {
    return this.httpClient.post(
      this.teacherAPI + "/addTrainingCategory",
      JSON.stringify(post)
    );
  }
  // viewTrainingCategory(post: any,dataTable: any): Observable<any> {
  //   return this.httpClient
  //   .post(
  //     this.teacherAPI + "/viewTrainingCategory",      
  //     Object.assign(dataTable, post)
  //   )
  //   .pipe(catchError(this.errorHandler));   
  // }
  viewTrainingCategory(post: any): Observable<any> {
    return this.httpClient
      .post(
        this.teacherAPI + '/viewTrainingCategory',
        JSON.stringify(post)
      )
      ;
  }

  deleteTraining(id: any, userId: any) {
    return this.httpClient
      .post(this.teacherAPI + "/deleteTraining", JSON.stringify({ 'encId': id, 'updatedBy': userId }))
      ;
  }
  getTrainingCategory(encId: string) {
    return this.httpClient
      .post(
        this.teacherAPI + "/getTrainingCategory",
        JSON.stringify({ encId: encId })
      )
      ;
  }
  updateTrainingCategory(post: any) {
    return this.httpClient.post(
      this.teacherAPI + "/updateTrainingCategory",
      JSON.stringify(post)
    );
  }
  addTrainingAgency(post: any): Observable<any> {
    return this.httpClient.post(
      this.teacherAPI + "/addTrainingAgency",
      JSON.stringify(post)
    );
  }
  // viewTrainingAgency(post: any,dataTable: any): Observable<any> {
  //   return this.httpClient
  //   .post(
  //     this.teacherAPI + "/viewTrainingAgency",      
  //     Object.assign(dataTable, post)
  //   )
  //   ;   
  //  }
  viewTrainingAgency(post: any): Observable<any> {
    return this.httpClient
      .post(
        this.teacherAPI + '/viewTrainingAgency',
        JSON.stringify(post)
      )
      ;
  }
  deleteTrainingAgency(id: any, userId: any) {
    return this.httpClient
      .post(this.teacherAPI + "/deleteTrainingAgency", JSON.stringify({ 'encId': id, 'updatedBy': userId }))
      ;
  }
  getTrainingAgency(encId: string) {
    return this.httpClient
      .post(
        this.teacherAPI + "/getTrainingAgency",
        JSON.stringify({ encId: encId })
      )
      ;
  }
  updateTrainingAgency(post: any) {
    return this.httpClient.post(
      this.teacherAPI + "/updateTrainingAgency",
      JSON.stringify(post)
    );
  }
  getAgency(encId: string) {
    return this.httpClient
      .post(
        this.teacherAPI + "/getTrainingAgency",
        JSON.stringify({ encId: '' })
      )
      ;
  }
  getTraining(encId: string) {
    return this.httpClient
      .post(
        this.teacherAPI + "/getTrainingCategory",
        JSON.stringify({ encId: '' })
      )
      ;
  }
  getDetails(post: any) {
    return this.httpClient
      .post(
        this.teacherAPI + "/getDetailList",
        JSON.stringify(post)

      )
      ;
  }
  addIndustrialTraining(post: any): Observable<any> {
    return this.httpClient.post(
      this.teacherAPI + "/addIndustrialTraining",
      JSON.stringify(post)
    );
  }
  // viewIndustrialTraining(post: any,dataTable: any): Observable<any> {
  //   return this.httpClient
  //   .post(
  //     this.teacherAPI + "/viewIndustrialTraining",      
  //     Object.assign(dataTable, post)
  //   )
  //   .pipe(catchError(this.errorHandler));   
  // }
  viewIndustrialTraining(post: any): Observable<any> {
    return this.httpClient
      .post(
        this.teacherAPI + "/viewIndustrialTraining",
        Object.assign(post)
      );
  }
  deleteIndustrialTraining(postParams: any) {
    return this.httpClient
      .post(this.teacherAPI + "/deleteIndustrialTraining", postParams)
      ;
  }
  getIndustrialTraining(encId: string) {
    return this.httpClient
      .post(
        this.teacherAPI + "/getIndustrialTraining",
        JSON.stringify({ encId: encId })
      );
  }
  updateIndustrialTraining(post: any) {
    return this.httpClient.post(
      this.teacherAPI + "/updateIndustrialTraining",
      JSON.stringify(post)
    );
  }
  // errorHandler(error: any) {
  //   let errorMessage = "";
  //   if (error.error instanceof ErrorEvent) {
  //     errorMessage = error.error.message;
  //   } else {
  //     errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
  //   }
  //   return throwError(() => new Error(errorMessage));
  // }
}
