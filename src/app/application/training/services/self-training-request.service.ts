import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";

import { Observable, Subject, throwError } from "rxjs";
import { catchError, tap } from "rxjs/operators";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root",
})
export class SelfTrainingRequestService {
  private apiURL = environment.teacherAPI;
  private userProfile = JSON.parse(
    sessionStorage.getItem("userProfile") || "{}"
  );
  private userId = this.userProfile.userId;
  private masterAPI = environment.masterAPI;

  private refreshRequired = new Subject<void>();
  get RefreshRequired() {
    return this.refreshRequired;
  }
  httpOptions = {
    headers: new HttpHeaders({
      "Content-Type": "application/json",
    }),
  };

  constructor(private httpClient: HttpClient) {}

  getSubject() {
    return this.httpClient.post(this.masterAPI + "/viewSubject", {});
  }
  // get training details
  getTrainingDetails(subjectId: number = 0) {
    return this.httpClient.post(
      this.apiURL + "/getTrainingDetails",
      JSON.stringify({
        subjectId,
      })
    );
  }

  // get training details
  getTrainingForAttendence(subjectId: number = 0) {
    return this.httpClient.post(
      this.apiURL + "/getTrainingForAttendence",
      JSON.stringify({
        subjectId,
      })
    );
  }

  // get training details
  getTrainingViewAtten(subjectId: number = 0) {
    return this.httpClient.post(
      this.apiURL + "/getTrainingViewAtten",
      JSON.stringify({
        subjectId,
      })
    );
  }

  // get training details
  getTrainingSchedule(subjectId: number = 0) {
    return this.httpClient.post(
      this.apiURL + "/getTrainingSchedule",
      JSON.stringify({
        subjectId,
      })
    );
  }

  // Check training date
  checkTrainingDate(post:any) {
    return this.httpClient.post(
      this.apiURL + "/checkTrainingDate",
      JSON.stringify(post)
    );
  }
  // validate appear assessment
  validateTrainee(dataObj: Object) {
    return this.httpClient.post(
      this.apiURL + "/validateTrainee",
      JSON.stringify(dataObj)
    );
  }

  getTrainings(post: any): Observable<any> {
    return this.httpClient.post(
      this.apiURL + "/viewTrainingAssessment",
      JSON.stringify(post)
    );
  }

  getTrainingLevl() {
    const anxtType = "LVL";
    return this.httpClient.post(
      this.masterAPI + "/getAnnexture",
      JSON.stringify({ anxtType })
    );
  }

  getTrainingLocation() {
    const anxtType = "PLACE_OF_TRAINING";
    return this.httpClient.post(
      this.masterAPI + "/getAnnexture",
      JSON.stringify({ anxtType })
    );
  }

   /** Download Self Training request as per filter, By: Sonu Kumar, On: 12-Oct-2022, Component Name : ViewTrainingTypeComponent **/  
   downloadTrainingRequest(post: any): Observable<any> {   
    return this.httpClient
   .post(
     this.apiURL + '/downloadTrainingRequest',
     JSON.stringify(post),
   )
  }

  /** Delete Training Type as per filter, By: Sonu Kumar, On: 26-Aug-2022, Component Name : viewTrainingTypeComponent **/
  deleteTrainingData(post: any): Observable<any> {
    return this.httpClient.post(
      this.apiURL + "/deleteTeacherTraining",
      JSON.stringify(post)
    );
  }

  /** Self Training Request as per filter, By: Sonu Kumar, On: 29-Aug-2022, Component Name : SelfTrainingRequest **/
  viewSelfTrainingRequest(post: any): Observable<any> {
    return this.httpClient.post(
      this.apiURL + "/viewselfTrainingrequest",
      JSON.stringify(post)
    );
  }

  /** Self Training Request as per filter, By: Sonu Kumar, On: 29-Aug-2022, Component Name : SelfTrainingRequest **/
  saveSelfTrainingRequest(post: any): Observable<any> {
    return this.httpClient.post(
      this.apiURL + "/addSelfTrainingRequest",
      JSON.stringify(post)
    );
  }

  /** Self Training Request as per filter, By: Sonu Kumar, On: 29-Aug-2022, Component Name : SelfTrainingRequest **/
  getSelfTrainingRequestDataById(post: any): Observable<any> {
    return this.httpClient.post(
      this.apiURL + "/editTrainingRequest",
      JSON.stringify(post)
    );
  }

  /** Self Training Request as per filter, By: Sonu Kumar, On: 29-Aug-2022, Component Name : viewSelfTrainingRequest **/
  updateSelfTrainingRequest(post: any): Observable<any> {
    return this.httpClient.post(
      this.apiURL + "/updateSelfTrainingRequest",
      JSON.stringify(post)
    );
  }

  /** Self Training Request as per filter, By: Sonu Kumar, On: 29-Aug-2022, Component Name : viewSelfTrainingRequest **/
  getSelfRequestStatusById(post: any): Observable<any> {
    return this.httpClient.post(
      this.apiURL + "/editStatusTrainingRequest",
      JSON.stringify(post)
    );
  }

  /** Self Training Request as per filter, By: Sonu Kumar, On: 29-Aug-2022, Component Name : viewSelfTrainingRequest **/
  updateSelfRequestAction(post: any): Observable<any> {
    return this.httpClient.post(
      this.apiURL + "/updateSelfRequestAction",
      JSON.stringify(post)
    );
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
