import { EventEmitter, Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { catchError, Observable, Subject, throwError } from "rxjs";
@Injectable({
  providedIn: "root",
})
export class RegistrationService {
  constructor(private httpClient: HttpClient) {}
  private masterAPI = environment.masterAPI;
  private teacherAPI = environment.teacherAPI;
  private schoolAPI = environment.schoolAPI;
  private refreshRequired = new Subject<void>();
  public teacherDetailsChanged = new EventEmitter();

  get RefreshRequired() {
    return this.refreshRequired;
  }
  httpOptions = {
    headers: new HttpHeaders({
      "Content-Type": "multipart/form-data",
      Accept: "application/json",
    }),
  };
  // ===== cross component teacher detail share :: Sambit Kumar Dalai :: 28-06-2022
  setTeacherDetails(teacherDetails: any) {
    localStorage.setItem("teacherDetails", JSON.stringify(teacherDetails));
    this.teacherDetailsChanged.emit(teacherDetails); // emit
  }
  getTeacherGender() {
    const anxtType = "GENDER";
    return this.httpClient.post(
      this.masterAPI + "/getAnnexture",
      JSON.stringify({ anxtType }),
      
    );
  }
  getTeacherCategory() {
    const anxtType = "TEACHER_SOCIAL_CATEGORY";
    return this.httpClient.post(
      this.masterAPI + "/getAnnexture",
      JSON.stringify({ anxtType }),
      
    );
  }
  getTeacherReligion() {
    const anxtType = "RELIGION";
    return this.httpClient.post(
      this.masterAPI + "/getAnnexture",
      JSON.stringify({ anxtType }),
      
    );
  }
  getTeacherBloodGroup() {
    const anxtType = "BLOODGRP";
    return this.httpClient.post(
      this.masterAPI + "/getAnnexture",
      JSON.stringify({ anxtType }),
      
    );
  }
  getTeacherRecCaste() {
    const anxtType = "TEACHER_SOCIAL_CATEGORY";
    return this.httpClient.post(
      this.masterAPI + "/getAnnexture",
      JSON.stringify({ anxtType }),
      
    );
  }
  getTeachermaritialStatus() {
    const anxtType = "MARITIAL_STATUS";
    return this.httpClient.post(
      this.masterAPI + "/getAnnexture",
      JSON.stringify({ anxtType }),
      
    );
  }
  getTeacherTitle() {
    const anxtType = "TEACHER_TITLE";
    return this.httpClient.post(
      this.masterAPI + "/getAnnexture",
      JSON.stringify({ anxtType }),
      
    );
  }
  getTeacherAppointment() {
    const anxtType = "NATURE_OF_APPOINTMENT";
    return this.httpClient.post(
      this.masterAPI + "/getAnnexture",
      JSON.stringify({ anxtType }),
      
    );
  }

  getAppointSubject() {
    return this.httpClient.post(this.masterAPI + "/viewSubject",JSON.stringify({ }));
  }
  getAppointType() {
    const anxtType = "APPOINTMENT_TYPE";
    return this.httpClient.post(
      this.masterAPI + "/getAnnexture",
      JSON.stringify({ anxtType }),
      
    );
  }
  getAppointingAuthority() {
    const anxtType = "APPOINTING_AUTHORITY";
    return this.httpClient.post(
      this.masterAPI + "/getAnnexture",
      JSON.stringify({ anxtType }),
      
    );
  }
  getDisability() {
    const anxtType = "DISABILITY";
    return this.httpClient.post(
      this.masterAPI + "/getAnnexture",
      JSON.stringify({ anxtType }),
      
    );
  }
  getSchool(clusterId: any) {
    return this.httpClient.post(
      this.schoolAPI + "/getSchool",
      JSON.stringify({ clusterId }),
      
    );
  }

  getSchoolCategoryType() {
    const anxtType = "CLASSES_TAUGHT_TEACHER";
    return this.httpClient.post(
      this.masterAPI + "/getAnnexture",
      JSON.stringify({ anxtType }),
      
    );
  }
  getTeacherLanguage() {
    const anxtType = "MEDIUM_OF_INSTRUCTION";
    return this.httpClient.post(
      this.masterAPI + "/getAnnexture",
      JSON.stringify({ anxtType }),
      
    );
  }
  getTeacherAssociate() {
    const anxtType = "TEACHER_ASSOCIATED_AS";
    return this.httpClient.post(
      this.masterAPI + "/getAnnexture",
      JSON.stringify({ anxtType }),
      
    );
  }

  teacherRegistraion(post: any): Observable<any> {
    return this.httpClient.post(
      this.teacherAPI + "/addTeacher",
      JSON.stringify(post),
      
    );
  }
  viewTeacher(post: any): Observable<any> {
    // console.log(csvExport);
    return this.httpClient
      .post(
        this.teacherAPI + "/viewTeacher",
        // JSON.stringify(post),
        // ,
        Object.assign(post)
      )
      ;
  }
  deleteTeacher(postParams: any) {
    return this.httpClient
      .post(this.teacherAPI + "/deleteTeacher", postParams, )
      ;
  }
  getEducationalQualificationType() {
    return this.httpClient.get(
      this.teacherAPI + "/getEducationalQualificationType"
    );
  }
  getProfessionalQualificationType() {
    return this.httpClient.get(
      this.teacherAPI + "/getProfessionalQualificationType"
    );
  }
  getExistingEducationalInfo(teacherId: string | null) {
    return this.httpClient.post(
      this.teacherAPI + "/getExistingEducationalInfo",
      JSON.stringify({ teacherId })
    );
  }
  getExistingProfessionalInfo(teacherId: string | null) {
    return this.httpClient.post(
      this.teacherAPI + "/getExistingProfessionalInfo",
      JSON.stringify({ teacherId })
    );
  }
  saveEducationalInfAsDraft(
    teacherId: string | null,
    inServiceFormFilled: boolean,
    preServiceFormData: any,
    inServiceFormData: any
  ) {
    const allData = {
      teacherId,
      preServiceFormData,
      inServiceFormData,
      inServiceFormFilled,
    };
    return this.httpClient.post(
      this.teacherAPI + "/saveEducationalInfAsDraft",
      JSON.stringify(allData)
    );
  }
  saveProfessionalInfAsDraft(
    teacherId: string | null,
    professionalFormData: any
  ) {
    const allData = { teacherId, professionalFormData };
    return this.httpClient.post(
      this.teacherAPI + "/saveProfessionalInfAsDraft",
      JSON.stringify(allData)
    );
  }

  getTeacher(encId: string) {
    return this.httpClient
      .post(
        this.teacherAPI + "/getTeacher",
        JSON.stringify({ encId: encId }),
        
      )
      ;
  }

  registrationInfo(encId: string) {
    return this.httpClient
      .post(
        this.teacherAPI + "/registrationInfo",
        JSON.stringify({ encId: encId }),
        
      )
      ;
  }

  teacherUpdate(post: any): Observable<any> {
    
    return this.httpClient.post(
      this.teacherAPI + "/updateTeacher",
      JSON.stringify(post),
      
    );
    //
  }

  saveOtherInfoAsDraft(post: any) {
    return this.httpClient.post(
      this.teacherAPI + "/saveOtherInfoAsDraft",
      JSON.stringify(post)
    );
  }
  getTeacherOtherInfo(encId: string) {
    return this.httpClient
      .post(
        this.teacherAPI + "/getTeacherOtherInfo",
        JSON.stringify({ encId: encId }),
        
      )
      ;
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

  downloadRawCsv(): Observable<any> {   
    return this.httpClient
      .post(
        this.teacherAPI + "/downloadRawCsv",
        JSON.stringify({}),
        
      )
      ;
  }
  getPlaceOfTraining(): Observable<any> {
    return this.httpClient
      .get(this.teacherAPI + "/getPlaceOfTraining")
      ;
  }
  getTeacherDetails(teacherId: string | null): Observable<any> {
    return this.httpClient.post(
      this.teacherAPI + "/getTeacherDetails",
      JSON.stringify({ teacherId })
    );
  }
  saveTrainingAndLanguageInfoAndSubmitAllDraft(
    teacherId: string | null,
    formData: any
  ) {
    const allData = { teacherId, formData };
    return this.httpClient.post(
      this.teacherAPI + "/saveTrainingAndLanguageInfoAndSubmitAllDraft",
      JSON.stringify(allData)
    );
  }
  getExistingtrainingAndLanguageInfo(teacherId: string | null) {
    return this.httpClient.post(
      this.teacherAPI + "/getExistingTrainingAndLanguageInfo",
      JSON.stringify({ teacherId })
    );
  }
  getExistingSalaryInfo(teacherEncryptedId: string | null) {
    return this.httpClient.post(
      this.teacherAPI + "/getExistingSalaryInfo",
      JSON.stringify({ teacherEncryptedId })
    );
  }

  saveSalaryInfo(
    teacherEncryptedId: string | null,
    formData: any,
    isAppointed: boolean,
    userId: string
  ) {
    return this.httpClient.post(
      this.teacherAPI + "/saveSalaryInfo",
      JSON.stringify({ teacherEncryptedId, formData, isAppointed, userId })
    );
  }
  getTeacherSalaryDetails(teacherId: string | null): Observable<any> {
    return this.httpClient.post(
      this.teacherAPI + "/getTeacherSalaryDetails",
      JSON.stringify({ teacherId })
    );
  }
  getExistingServiceInfo(teacherEncryptedId: string | null) {
    return this.httpClient.post(
      this.teacherAPI + "/getExistingServiceInfo",
      JSON.stringify({ teacherEncryptedId })
    );
  }
  saveServiceInfo(
    dataObj:Object
  ) {
    // const allData = { teacherEncryptedId, serviceInfoData, userId };
    return this.httpClient.post(
      this.teacherAPI + "/saveServiceInfo",
      JSON.stringify(dataObj)
    );
  }
  headMasterCheck(teacherTit: any, teacherSch: any) {
    return this.httpClient.post(
      this.teacherAPI + "/headMasterCheck",
      JSON.stringify({ teacherTit, teacherSch }),
      
    );
  }
}
