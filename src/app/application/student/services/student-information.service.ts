import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { catchError, Observable, throwError } from "rxjs";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root",
})
export class StudentInformationService {
  private userProfile = JSON.parse(
    sessionStorage.getItem("userProfile") || "{}"
  );
  private userId = this.userProfile.userId;

  constructor(private httpClient: HttpClient) {}

  private apiURL = environment.studentAPI;
  private apiMasterURL = environment.masterAPI;

  httpOptions = {
    headers: new HttpHeaders({
      "Content-Type": "application/json",
    }),
  };

  formDataHttpOptions = {
    headers: new HttpHeaders({
      contentType: "formData",
    }),
  };

  addStudent(post: any): Observable<any> {
    return this.httpClient.post(
      this.apiURL + "/addStudent",
      post,
      this.formDataHttpOptions
    );
  }
  updateStudent(post: any){
    return this.httpClient.post(
      this.apiURL + "/updateStudent",
      post,
      this.formDataHttpOptions
    );
  }

  viewStudentList(params: object) {
    return this.httpClient.post(this.apiURL + "/viewStudentList", params);
  }

  getStudent(postParams: any) {
    return this.httpClient
      .post(
        this.apiURL + "/getStudent", 
        postParams, 
       // this.httpOptions
        );
      //.pipe(catchError(this.errorHandler));
  }

  studentInfo(postParams: any) {
    return this.httpClient
      .post(
        this.apiURL + "/studentInfo", 
        postParams,
        //this.httpOptions
        );
      //.pipe(catchError(this.errorHandler));
  }

  /* Created By : Swagatika || Created On : 28-07-2022 || Service method Name : deleteStudent || Description: delete of student */
  deleteStudent(postParams: any) {
    return this.httpClient.post(
      this.apiURL + "/deleteStudent",
      postParams,
    );
  }

  /* Created By : Swagatika || Created On : 28-07-2022 || Service method Name : deleteMultipleStudent || Description: Multiple delete of student */
  deleteMultipleStudent(post: any) {
    post.userId = this.userId;
    return this.httpClient.post(
      this.apiURL + "/deleteMultipleStudent",
      JSON.stringify(post),
    );
  }
  /* Created By : Debasis Patra || Created On : 22-08-2022 || Service method Name : studentSubjectTag || Description: show Subject tagged to student */

  studentSubjectTag(postParams: any) {
    return this.httpClient
      .post(
        this.apiURL + "/studentSubjectTag", 
        postParams, 
        );
  }
  /* Created By : saubhagya Patra || Created On : 09-01-2022 || Service method Name : studentFacilityTag || Description: show facility tagged to student */

  studentFacilityTag(postParams: any) {
    return this.httpClient.post(this.apiURL + "/studentFacilityTag", postParams);
  }

  addFacilatationToStudent(postParams: any) {
    return this.httpClient.post(this.apiURL + "/addFacilatationToStudent", postParams,);
  }
  addSubjectToStudent(postParams: any) {
    return this.httpClient
      .post(
        this.apiURL + "/addSubjectToStudent", 
        postParams,
      );
  }

  verifyStudent(postParams:any){
    return this.httpClient
      .post(
        this.apiURL + '/verifyStudent',
        postParams,
      );
  }

  bulkVerifyReq(postParams:any){
    return this.httpClient
      .post(
        this.apiURL + '/bulkVerifyReq',
        postParams,
      );
  }
  
  bulkModifyReq(postParams:any){
    return this.httpClient
      .post(
        this.apiURL + '/bulkModifyReq',
        postParams,
      );
  }

  bulkApproval(postParams:any){
    return this.httpClient
      .post(
        this.apiURL + '/bulkApproval',
        postParams,
      );
  }

  bulkCRApproval(postParams:any){
    return this.httpClient
      .post(
        this.apiURL + '/bulkCRApproval',
        postParams,
      );
  }

  studentTransfer(postParams: any){
    return this.httpClient
      .post(
      this.apiURL + "/studentTransfer", 
      postParams, 
      );
  }

  midSessionTransferList(params: any){
    return this.httpClient.post(this.apiURL + "/midSessionTransfer", params);
  }
  lastSessionTransferList(params: any){
    return this.httpClient.post(this.apiURL + "/lastSessionTransfer", params);
  }

  toSchoolTransferList(params: any){
    return this.httpClient.post(this.apiURL + "/transferToSchool", params);
  }

  dropoutList(params: any){
    return this.httpClient.post(this.apiURL + "/dropout", params);
  }

  getTCInfo(params: any){
    return this.httpClient.post(this.apiURL + "/getTCInfo", params);
  }
  
  generateTC(params: any){
    return this.httpClient.post(this.apiURL + "/generateTC", params);
  }
  
  getPrevSchlDetails(params: any){
    return this.httpClient.post(this.apiURL + "/getPrevSchlDetails", params);
  }

  studentNewEnrollment(post: any): Observable<any> {
    return this.httpClient.post(
      this.apiURL + "/studentNewEnrollment",
      post,
      this.formDataHttpOptions
    );
  }

  getStudentsProgressionList(params: any){
    return this.httpClient.post(this.apiURL + "/studentsProgressionList", params);
  }
  
  markDetails(params: any){
    return this.httpClient.post(this.apiURL + "/studentsMarkDetails", params);
  }

  saveStudentProgression(params: any){
    return this.httpClient.post(this.apiURL + "/saveStudentProgression", params);
  }

  requestToModify(postParams: any){
    return this.httpClient
      .post(
        this.apiURL + "/requestToModify", 
        postParams, 
      );
  }
  
  requestToVerify(postParams: any){
    return this.httpClient
      .post(
        this.apiURL + "/requestToVerify", 
        postParams, 
      );
  }

  verifyStudentList(params: object) {
    return this.httpClient.post(this.apiURL + "/verifyStudentList", params);
  }

  changeRequestList(params: object) {
    return this.httpClient.post(this.apiURL + "/changeRequestList", params);
  }

  crApproval(postParams:any){
    return this.httpClient
      .post(
        this.apiURL + '/crApproval',
        postParams,
       // this.httpOptions,
      );
     // .pipe(catchError(this.errorHandler))
  }

    /**
   * Created By   : Sambit Kumar Dalai
   * Created On   : 01-09-2022
   * Description  : Student Advance search functionality
   **/
     searchStudent(dataObj: Object) {
      return this.httpClient.post(
        this.apiURL + "/searchStudent",
        JSON.stringify(dataObj)
      );


    /**
   * Created By   : Swagatika
   * Created On   : 13-12-2022
   * Description  : get Progression Report Data
   **/
    }

    getProgressionData(encId:any,academicYear:any){
      return this.httpClient
        .post(
          this.apiURL + '/progressionReport',
          JSON.stringify({schoolEncId:encId,academicYear:academicYear}),
          this.httpOptions,
        )
        .pipe(catchError(this.errorHandler))
    }

    showStudentList(params: object){
      return this.httpClient.post(this.apiURL + "/showProgressionFilterStudentList", params);
    }

    viewStudentListReoprtCard(params: object) {
      return this.httpClient.post(this.apiURL + "/viewStudentListReoprtCard", params);
    }

    getReportCard(params: any){
      return this.httpClient.post(this.apiURL + "/getReportCard", params);
    }

    saveStudentListReoprtCard(postParams: any): Observable<any> {
      return this.httpClient.post(this.apiURL + "/saveStudentListReoprtCard", postParams, );
    }

    errorHandler(error: any) {
      let errorMessage = "";
      if (error.error instanceof ErrorEvent) {
        errorMessage = error.error.message;
      } else {
        errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
      }
      return throwError(() => new Error(errorMessage));
    }

}
