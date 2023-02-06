/**
 * Created By  : Sambit Kumar Dalai
 * Created On  : 22-06-2022
 * Module Name : Question Bank
 * Description : Question bank Service.
 **/

import { HttpClient, HttpParams, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { CommonserviceService } from "src/app/core/services/commonservice.service";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root",
})
export class QuestionBankService {
  private schoolAPI = environment.schoolAPI;
  private userProfile!: any;
  questionsEmitter = new Subject();

  constructor(
    private httpClient: HttpClient,
    private commonserviceService: CommonserviceService
  ) {
    this.userProfile = this.commonserviceService.getUserProfile();
  }

  /**
   * Created By   : Sambit Kumar Dalai
   * Created On   : 19-08-2022
   * Description  : Http header for formData content type (hanlded in auth interceptor)
   **/
  formDataHttpOptions = {
    headers: new HttpHeaders({
      contentType: "formData",
    }),
  };
  // get subjects class wise
  getSubjectsClassWise(classId: number | string) {
    return this.httpClient.post(
      this.schoolAPI + "/getSubjectsClassWise",
      JSON.stringify({ classId })
    );
  }
  // get subjects class wise
  getSubjectsClassStreamGroupWise(classStreamGroupObj: object) {
    return this.httpClient.post(
      this.schoolAPI + "/getSubjectsClassStreamGroupWise",
      JSON.stringify(classStreamGroupObj)
    );
  }
  addQuestionBank(formData: any) {
    return this.httpClient.post(
      this.schoolAPI + "/addQuestionBank",
      formData,
      this.formDataHttpOptions
    );
  }
  //get all question bank
  getQuestionBankData(params: object) {
    console.log(params);
    
    return this.httpClient.post(
      this.schoolAPI + "/getQuestionBankData",
      params
    );
  }
  //delete question bank
  deleteQuestion(questionDetails: any) {
    const userId = this.commonserviceService.getUserProfile()?.userId;;
    const params = {
      questionDetails,
      userId,
    };
    return this.httpClient.post(
      this.schoolAPI + "/deleteQuestion",
      JSON.stringify({ params })
    );
  }
  getQuestionDetails(encId: string | null) {
    return this.httpClient.post(
      this.schoolAPI + "/getQuestionDetails",
      JSON.stringify({ encId })
    );
  }
  getQuestionBankDetails(encId: string | null) {
    return this.httpClient.post(
      this.schoolAPI + "/getQuestionBankDetails",
      JSON.stringify({ encId })
    );
  }
  updateQuestionBank(formData: any) {
    return this.httpClient.post(
      this.schoolAPI + "/updateQuestionBank",
      formData,
      this.formDataHttpOptions
    );
  }

  // =============== Assessment Schedule
  addAssessmentSchedule(
    formData: any,
    userId: string,
    assessmentScheduleId: string | null = null
  ) {
    return this.httpClient.post(
      this.schoolAPI + "/addAssessmentSchedule",
      JSON.stringify({ formData, userId, assessmentScheduleId })
    );
  }
  getAssessmentScheduleData(params: object) {
    return this.httpClient.post(
      this.schoolAPI + "/getAssessmentScheduleData",
      params
    );
  }
  deleteAssessmentSchedule(assessmentScheduleId: number) {
    const userId = this.commonserviceService.getUserProfile()?.userId;;
    const params = {
      assessmentScheduleId,
      userId,
    };
    return this.httpClient.post(
      this.schoolAPI + "/deleteAssessmentSchedule",
      JSON.stringify({ params })
    );
  }
  getAssessmentScheduleDetails(encId: string | null) {
    return this.httpClient.post(
      this.schoolAPI + "/getAssessmentScheduleDetails",
      JSON.stringify({ encId })
    );
  }
  //get all question bank
  getAppearAssessmentDetails(params: object) {
    return this.httpClient.post(
      this.schoolAPI + "/getAppearAssessmentDetails",
      params
    );
  }
  getAssessmentDetails(encId: any) {
    return this.httpClient.post(
      this.schoolAPI + "/getAssessmentDetails",
      JSON.stringify({ encId })
    );
  }
  validateStudent(
    studentInput: string,
    schoolId: string,
    encId: string | null
  ) {
    return this.httpClient.post(
      this.schoolAPI + "/validateStudent",
      JSON.stringify({ studentInput, schoolId, encId })
    );
  }
  getQuestions(encId: any) {
    return this.httpClient.post(
      this.schoolAPI + "/getQuestions",
      JSON.stringify({ encId })
    );
  }
  submitAssessment(dataObj: Object) {
    return this.httpClient.post(
      this.schoolAPI + "/submitAssessment",
      JSON.stringify(dataObj)
    );
  }
  forceSubmitAssessment(encId: any, userId: string) {
    return this.httpClient.post(
      this.schoolAPI + "/forceSubmitAssessment",
      JSON.stringify({ encId, userId })
    );
  }
  //get online assessment results
  getOnlineResult(params: object) {
    return this.httpClient.post(this.schoolAPI + "/getOnlineResult", params);
  }
  //get all resutl
  getAllResult(params: object) {
    return this.httpClient.post(this.schoolAPI + "/getAllResult", params);
  }
  //get all question bank
  getStudentResultDetails(params: Object) {
    return this.httpClient.post(
      this.schoolAPI + "/getStudentResultDetails",
      JSON.stringify(params)
    );
  }
  //get all question bank
  getStudentsSchoolClassSectionWise(params: Object) {
    return this.httpClient.post(
      this.schoolAPI + "/getStudentsSchoolClassSectionWise",
      JSON.stringify(params)
    );
  }
  getTotalMark(params: Object) {
    return this.httpClient.post(
      this.schoolAPI + "/getTotalMark",
      JSON.stringify(params)
    );
  }
  getAnswerSheetData(params: any) {
    return this.httpClient.post(this.schoolAPI + "/getAnswerSheetData", params);
  }
  getAnswerSheetDetails(encId: string | null) {
    return this.httpClient.post(
      this.schoolAPI + "/getAnswerSheetDetails",
      JSON.stringify({ encId })
    );
  }
  //delete question bank
  deleteAnswerSheet(answerSheetId: string) {
    const userId = this.commonserviceService.getUserProfile()?.userId;;
    const params = {
      answerSheetId,
      userId,
    };
    return this.httpClient.post(
      this.schoolAPI + "/deleteAnswerSheet",
      JSON.stringify({ params })
    );
  }
  getAllQuestions(encId: any) {
    return this.httpClient.post(
      this.schoolAPI + "/getAllQuestions",
      JSON.stringify({ encId })
    );
  }
  getAssessmentStatus(params: Object) {
    return this.httpClient.post(
      this.schoolAPI + "/getAssessmentStatus",
      JSON.stringify(params)
    );
  }
  getQuestionsToDownload(questions: any) {
    console.log(questions, "questions");

    this.questionsEmitter.next(questions);
  }
  submitAnswerSheet(formData: any) {
    return this.httpClient.post(
      this.schoolAPI + "/submitAnswerSheet",
      formData,
      this.formDataHttpOptions
    );
  }
}
