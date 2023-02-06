import { EventEmitter, Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { catchError, Observable, Subject, throwError } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class InspectionMisService {
  private userProfile = JSON.parse(
    sessionStorage.getItem("userProfile") || "{}"
  );
  private userId = this.userProfile.userId;

  constructor(private httpClient: HttpClient) {}
  private masterAPI = environment.masterAPI;
  private inspectionAPI = environment.inspectionAPI;

  private refreshRequired = new Subject<void>();
  get RefreshRequired() {
    return this.refreshRequired;
  }

  httpOptions = {
    headers: new HttpHeaders({
      "Content-Type": "application/json",
    }),
  };

  /**View Inspection as per filter, By: Sonu Kumar, On: 05-08-2022, Component Name : viewInspection **/
  viewInspection(post: any): Observable<any> {
    return this.httpClient.post(
      this.inspectionAPI + "/viewInspectionData",
      JSON.stringify(post)
    );
  }

  viewInspectionData(post: any): Observable<any> {
    return this.httpClient.post(
      this.inspectionAPI + "/viewInspectionData",
      JSON.stringify(post)
    );
  }

  inspectionDataSearch(post: any): Observable<any> {
    return this.httpClient.post(
      this.inspectionAPI + "/inspectionDataSearch",
      JSON.stringify(post)
    );
  }
  getInspectionById(post: any): Observable<any> {
    return this.httpClient.post(
      this.inspectionAPI + "/getInspectionById",
      JSON.stringify(post)
    );
  }

  userGetInspection(post: any): Observable<any> {
    return this.httpClient.post(
      this.inspectionAPI + "/userGetInspection",
      JSON.stringify(post)
    );
  }

  getSchoolList(clusterId: any) {
    return this.httpClient.post(
      this.inspectionAPI + "/getSchoolList",
      JSON.stringify({ clusterId })
    );
  }

  getActiveSchoolLists(post: any): Observable<any> {
    return this.httpClient.post(
      this.inspectionAPI + "/getActiveSchoolLists",
      JSON.stringify(post)
    );
  }

  getIndicatorsList(post: any): Observable<any> {
    return this.httpClient.post(
      this.inspectionAPI + "/getIndicatorsList",
      JSON.stringify(post)
    );
  }

  getActiveInactiveUserList(post: any): Observable<any> {
    return this.httpClient.post(
      this.inspectionAPI + "/getActiveInactiveUserList",
      JSON.stringify(post)
    );
  }

  getSchool(clusterId: any) {
    return this.httpClient.post(
      this.inspectionAPI + "/getSchool",
      JSON.stringify({ clusterId })
    );
  }

  DesignationList(): Observable<any> {
    return this.httpClient.post(
      this.inspectionAPI + "/getDesignationList",
      JSON.stringify({})
    );
  }

  designationWiseResport(post: any): Observable<any> {
    return this.httpClient.post(
      this.inspectionAPI + "/designationWiseResport",
      JSON.stringify(post)
    );
  }

  openCloseReport(post: any): Observable<any> {
    return this.httpClient.post(
      this.inspectionAPI + "/openCloseSchoolReport",
      JSON.stringify(post)
    );
  }

  mdmDoneNotDoneReport(post: any): Observable<any> {
    return this.httpClient.post(
      this.inspectionAPI + "/mdmDoneNotDoneReport",
      JSON.stringify(post)
    );
  }

  indicatorReport(post: any): Observable<any> {
    return this.httpClient.post(
      this.inspectionAPI + "/indicatorReport",
      JSON.stringify(post)
    );
  }

  downloadIndicatorReport(post: any): Observable<any> {
    return this.httpClient.post(
      this.inspectionAPI + "/downloadIndicatorReport",
      JSON.stringify(post)
    );
  }

  mdmReportPanchayatWise(post: any): Observable<any> {
    return this.httpClient.post(
      this.inspectionAPI + "/mdmReportPanchayatWise",
      JSON.stringify(post)
    );
  }

  downloadMdmPanchayatCsv(post: any): Observable<any> {
    return this.httpClient.post(
      this.inspectionAPI + "/downloadMdmPanchayatCsv",
      JSON.stringify(post)
    );
  }

  teacherAbsentList(post: any): Observable<any> {
    return this.httpClient.post(
      this.inspectionAPI + "/teacherAbsentList",
      JSON.stringify(post)
    );
  }

  teacherAbsentCount(post: any): Observable<any> {
    return this.httpClient.post(
      this.inspectionAPI + "/teacherAbsentCount",
      JSON.stringify(post)
    );
  }

  downloadAbsentTeacherCountCsv(post: any): Observable<any> {
    return this.httpClient.post(
      this.inspectionAPI + "/downloadAbsentTeacherCountCsv",
      JSON.stringify(post)
    );
  }
  downloadAbsentTeacherDetailCsv(post: any): Observable<any> {
    return this.httpClient.post(
      this.inspectionAPI + "/downloadAbsentTeacherDetailCsv",
      JSON.stringify(post)
    );
  }

  studentAttendenceBest(post: any): Observable<any> {
    return this.httpClient.post(
      this.inspectionAPI + "/studentAttendenceBest",
      JSON.stringify(post)
    );
  }

  absentTeacherAction(post: any): Observable<any> {
    return this.httpClient.post(
      this.inspectionAPI + "/absentTeacherAction",
      JSON.stringify(post)
    );
  }

  takeAction(post: any): Observable<any> {
    return this.httpClient.post(
      this.inspectionAPI + "/takeActionById",
      JSON.stringify(post)
    );
  }

  noOfAbsentee(post: any): Observable<any> {
    return this.httpClient.post(
      this.inspectionAPI + "/noOfAbsentee",
      JSON.stringify(post)
    );
  }

  /**
   * Created By   : Sambit Kumar Dalai
   * Created On   : 09-08-2022
   * Description  : Inspection visit data
   **/
  inspectionVisitData(dataObj: object) {
    return this.httpClient.post(
      this.inspectionAPI + "/inspectionVisitData",
      JSON.stringify({ dataObj })
    );
  }
  /**
   * Created By   : Sambit Kumar Dalai
   * Created On   : 09-08-2022
   * Description  : get modal details of inspection
   **/
  getInspectionDetails(dataObj: object) {
    return this.httpClient.post(
      this.inspectionAPI + "/getInspectionDetails",
      JSON.stringify({ dataObj })
    );
  }

  /**
   * Created By   : vivek ranjan jha
   * Created On   : 019-08-2022
   * Description  : get teacher attendance inspection
   **/
  getTeacherAttendanceInspection(post: any): Observable<any> {
    return this.httpClient.post(
      this.inspectionAPI + "/getTeacherAttendanceInspection",
      JSON.stringify(post)
    );
  }

  getTeacherAttendanceInspectionNN(post: any): Observable<any> {
    return this.httpClient.post(
      this.inspectionAPI + "/getTeacherAttendanceInspectionNN",
      JSON.stringify(post)
    );
  }

  getInspectionReport(post: any): Observable<any> {
    return this.httpClient.post(
      this.inspectionAPI + "/getInspectionReport",
      JSON.stringify(post)
    );
  }

  downloadAbTeacherAction(post: any) {
    return this.httpClient.post(
      this.inspectionAPI + "/downloadAbTeacherAction",
      JSON.stringify(post)
    );
  }

  downloadOpenCloseCsv(post: any) {
    return this.httpClient.post(
      this.inspectionAPI + "/downloadOpenCloseCsv",
      JSON.stringify(post)
    );
  }

  downloadMdmCsv(post: any) {
    return this.httpClient.post(
      this.inspectionAPI + "/downloadMdmCsv",
      JSON.stringify(post)
    );
  }

  downloadMdmNNCsv(post: any) {
    return this.httpClient.post(
      this.inspectionAPI + "/downloadMdmNNCsv",
      JSON.stringify(post)
    );
  }

  downloadSchoolMonitoringReport(post: any) {
    return this.httpClient.post(
      this.inspectionAPI + "/downloadSchoolMonitoringReport",
      JSON.stringify(post)
    );
  }

  exportSchoolMonitoringReport(post: any) {
    return this.httpClient.post(
      this.inspectionAPI + "/exportSchoolMonitoringReport",
      JSON.stringify(post)
    );
  }

  downloadActiveSchoolList(post: any) {
    return this.httpClient.post(
      this.inspectionAPI + "/downloadActiveSchoolList",
      JSON.stringify(post)
    );
  }

  downloadDesignationWiseReport(post: any) {
    return this.httpClient.post(
      this.inspectionAPI + "/downloadDesignationWiseReport",
      JSON.stringify(post)
    );
  }

  downloadActiveInactiveUser(post: any) {
    return this.httpClient.post(
      this.inspectionAPI + "/downloadActiveInactiveUser",
      JSON.stringify(post)
    );
  }

  downloadTeacherAttendanceInpCsv(post: any) {
    return this.httpClient.post(
      this.inspectionAPI + "/downloadTeacherAttendanceInpCsv",
      JSON.stringify(post)
    );
  }
  downloadTeacherAttendanceInpNNCsv(post: any) {
    return this.httpClient.post(
      this.inspectionAPI + "/downloadTeacherAttendanceInpNNCsv",
      JSON.stringify(post)
    );
  }

  downloadAbsentTeacherAttendanceInpCsv(post: any) {
    return this.httpClient.post(
      this.inspectionAPI + "/downloadAbsentTeacherAttendanceInpCsv",
      JSON.stringify(post)
    );
  }

  studentAttendanceInpCsv(post: any) {
    return this.httpClient.post(
      this.inspectionAPI + "/downloadStudentAttendanceInpCsv",
      JSON.stringify(post)
    );
  }
  downloadOpenCloseNNCsv(post: any) {
    return this.httpClient.post(
      this.inspectionAPI + "/downloadOpenCloseNNCsv",
      JSON.stringify(post)
    );
  }
  getNagarPanchayat(post: any) {
    return this.httpClient.post(
      this.inspectionAPI + "/getNagarPanchayat",
      JSON.stringify(post)
    );
  }
  getSchoolListNagarWise(nagarId: any) {
    return this.httpClient.post(
      this.inspectionAPI + "/getSchoolListNagarWise",
      JSON.stringify({ nagarId })
    );
  }
  absentNagarNigamWiseReport(post: any): Observable<any> {
    return this.httpClient.post(
      this.inspectionAPI + "/absentNagarNigamWiseReport",
      JSON.stringify(post)
    );
  }
  downloadabsentNagarNigamWiseCsv(post: any) {
    return this.httpClient.post(
      this.inspectionAPI + "/downloadabsentNagarNigamWiseCsv",
      JSON.stringify(post)
    );
  }
  openCloseReportNagarWise(post: any) {
    return this.httpClient.post(
      this.inspectionAPI + "/openCloseReportNagarWise",
      JSON.stringify(post)
    );
  }

  mdmReportNagarWise(post: any) {
    return this.httpClient.post(
      this.inspectionAPI + "/mdmReportNagarWise",
      JSON.stringify(post)
    );
  }

  attendanceNigamWiseReport(post: any): Observable<any> {
    return this.httpClient.post(
      this.inspectionAPI + "/attendanceNigamWiseReport",
      JSON.stringify(post)
    );
  }
  attendanceNigamWiseReportCsv(post: any) {
    return this.httpClient.post(
      this.inspectionAPI + "/attendanceNigamWiseReportCsv",
      JSON.stringify(post)
    );
  }
  absentPanchayatWiseReport(post: any) {
    return this.httpClient.post(
      this.inspectionAPI + "/absentPanchayatWiseReport",
      JSON.stringify(post)
    );
  }
  getTeacherAttendancePanchayatInspection(post: any) {
    return this.httpClient.post(
      this.inspectionAPI + "/getTeacherAttendancePanchayatInspection",
      JSON.stringify(post)
    );
  }

  downloadTeacherAttendanceInpPanchCsv(post: any) {
    return this.httpClient.post(
      this.inspectionAPI + "/downloadTeacherAttendanceInpPanchCsv",
      JSON.stringify(post)
    );
  }
  schoolStatusPanchayatWiseReport(post: any) {
    return this.httpClient.post(
      this.inspectionAPI + "/schoolStatusPanchayatWiseReport",
      JSON.stringify(post)
    );
  }
  downloadSchoolStatusPanhayatWIseReportCsv(post: any) {
    return this.httpClient.post(
      this.inspectionAPI + "/downloadSchoolStatusPanhayatWIseReportCsv",
      JSON.stringify(post)
    );
  }
  studentAttendencePanchBest(post: any){
    return this.httpClient.post(
      this.inspectionAPI + "/studentAttendencePanchBest",
      JSON.stringify(post)
    );
  }
  studentAttendanceInpPanchCsv(post:any)
  {
    return this.httpClient.post(
      this.inspectionAPI + "/studentAttendanceInpPanchCsv",
      JSON.stringify(post)
    );
  }

  downloadAbsentPanchayatWiseCsv(post:any){
    return this.httpClient.post(
      this.inspectionAPI + "/downloadAbsentPanchayatWiseCsv",
      JSON.stringify(post)
    );
  }
  getDesignation(post:any){
    return this.httpClient.post(
      this.inspectionAPI + "/getDesignation",
      JSON.stringify(post)
    );
  }

  exportSchoolReport(post:any)
  {
    return this.httpClient.post(
      this.inspectionAPI + "/exportSchoolReport",
      JSON.stringify(post)
    );
  }

  exportTeacherAttenInspectionReport(post:any)
  {
    return this.httpClient.post(
      this.inspectionAPI + "/exportTeacherAttenInspectionReport",
      JSON.stringify(post)
    );
  }

  exportStuAttenInspectionReport(post:any)
  {
    return this.httpClient.post(
      this.inspectionAPI + "/exportStuAttenInspectionReport",
      JSON.stringify(post)
    );
  }

  downloadSchoolMonitoringReportDegWise(post:any)
  {
    return this.httpClient.post(
      this.inspectionAPI + "/downloadSchoolMonitoringReportDegWise",
      JSON.stringify(post)
    );
  }
}
