/**
 * Created By   : Sambit Kumar Dalai
 * Created On   : 14-Aug-2022
 * Description  : teacher training assessment realted services
 **/

import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { CommonserviceService } from "src/app/core/services/commonservice.service";
@Injectable({
  providedIn: "root",
})
export class TeacherTrainingAssessmentService {
  private teacherAPI = environment.teacherAPI;
  private masterAPI = environment.masterAPI;

  constructor(
    private httpClient: HttpClient,
    private commonserviceService: CommonserviceService
  ) {}

  getSubject() {
    return this.httpClient.post(this.masterAPI + "/getSubject", {});
  }
  getAssessments(paramObj: Object) {
    return this.httpClient.post(
      this.teacherAPI + "/getAssessments",
      JSON.stringify(paramObj)
    );
  }
  validateAssessment(dataObj: Object) {
    return this.httpClient.post(
      this.teacherAPI + "/validateAssessment",
      JSON.stringify(dataObj)
    );
  }
  getQuestions(dataObj: Object) {
    return this.httpClient.post(
      this.teacherAPI + "/getQuestions",
      JSON.stringify(dataObj)
    );
  }
  submitAssessment(dataObj: Object) {
    return this.httpClient.post(
      this.teacherAPI + "/submitAssessment",
      JSON.stringify(dataObj)
    );
  }
  submitAssessmentSchedule(dataObj: Object) {
    return this.httpClient.post(
      this.teacherAPI + "/submitAssessmentSchedule",
      JSON.stringify(dataObj)
    );
  }
  getAssessmentSchedules(paramObj: Object) {
    return this.httpClient.post(
      this.teacherAPI + "/getAssessmentSchedules",
      JSON.stringify(paramObj)
    );
  }
  deleteAssessmentSchedule(scheduleId: number) {
    const params = JSON.stringify({
      userId: this.commonserviceService.getUserProfile()?.userId,
      scheduleId,
    });
    return this.httpClient.post(
      this.teacherAPI + "/deleteAssessmentSchedule",
      params
    );
  }
  getAssessmentScheduleDetails(encId: string | null) {
    return this.httpClient.post(
      this.teacherAPI + "/getAssessmentScheduleData",
      JSON.stringify({ encId })
    );
  }
  getResult(params: object) {
    return this.httpClient.post(this.teacherAPI + "/getResult", params);
  }
  getResultDetails(params: Object) {
    return this.httpClient.post(
      this.teacherAPI + "/getResultDetails",
      JSON.stringify(params)
    );
  }
}
