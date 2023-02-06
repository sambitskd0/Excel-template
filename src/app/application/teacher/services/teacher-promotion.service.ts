/**
 * Created By  : Sambit Kumar Dalai
 * Created On  : 27-12-2022
 * Module Name : Teacher
 * Description : Managing services related to Teacher Promotion.
 **/

import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class TeacherPromotionService {
  private teacherAPI = environment.teacherAPI;
  constructor(private httpClient: HttpClient) {}

  getTeacherListForPromotion(params: Object) {
    return this.httpClient.post(
      this.teacherAPI + "/getTeacherListForPromotion",
      JSON.stringify({ params })
    );
  }
  getTeacherPrmotionGeneratedList(params: Object) {
    return this.httpClient.post(
      this.teacherAPI + "/getTeacherPrmotionGeneratedList",
      JSON.stringify({ params })
    );
  }
  getTeacherPrmotedListSchoolWise(params: Object) {
    return this.httpClient.post(
      this.teacherAPI + "/getTeacherPrmotedListSchoolWise",
      JSON.stringify({ params })
    );
  }
  submitTeacherListForPromotion(params: Object) {
    console.log(params);

    return this.httpClient.post(
      this.teacherAPI + "/submitTeacherListForPromotion",
      JSON.stringify({ params })
    );
  }
  deleteTeacherFromGeneratedList(params: Object) {
    return this.httpClient.post(
      this.teacherAPI + "/deleteTeacherFromGeneratedList",
      JSON.stringify({ params })
    );
  }

  getTeacherList(params: Object) {
    return this.httpClient.post(
      this.teacherAPI + "/getTeacherList",
      JSON.stringify({ params })
    );
  }

  getAllPromotedTeacher(post: any): Observable<any> {
    return this.httpClient.post(
      this.teacherAPI + "/promotTeacher",
      JSON.stringify({ post })
    );
  }

  approvePromotion(params: any): Observable<any> {
    return this.httpClient.post(
      this.teacherAPI + "/approvePromotion",
      JSON.stringify({ params })
    );
  }

  rejectPromotion(params: any): Observable<any> {
    return this.httpClient.post(
      this.teacherAPI + "/rejectPromotion",
      JSON.stringify({ params })
    );
  }

  getApprovedPromotion(params: any): Observable<any> {
    return this.httpClient.post(
      this.teacherAPI + "/getApprovedPromotion",
      JSON.stringify({ params })
    );
  }
  getPromotionDetails(teacherId: string) {
    return this.httpClient.post(
      this.teacherAPI + "/getPromotionDetails",
      JSON.stringify({ teacherId })
    );
  }

  forwardToDeo(params: Object) {
    return this.httpClient.post(
      this.teacherAPI + "/forwardToDeo",
      JSON.stringify(params)
    );
  }
}
