import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, Subject, tap, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SchoolService {
  constructor(
    private httpClient: HttpClient,
  ) { }

  private apiURL = environment.schoolAPI;
  private apiMasterURL = environment.masterAPI;

  private refreshRequired = new Subject<void>();
  get RefreshRequired() {
    return this.refreshRequired;
  }

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    })
  }

  schoolRegistraion(post: any): Observable<any> {
    return this.httpClient.post(
      this.apiURL + '/addSchool',
      JSON.stringify(post),
      this.httpOptions
    )
  }

  schoolUpdate(post: any): Observable<any> {
    return this.httpClient.post(
      this.apiURL + '/updateSchool',
      JSON.stringify(post),
      this.httpOptions
    )
  }

  // viewSchool(post: any,dataTable:any): Observable<any> {
  //   return this.httpClient
  //     .post(
  //       this.apiURL + '/viewSchool',
  //       // JSON.stringify(post),
  //       // this.httpOptions,
  //        Object.assign(dataTable,post)
  //     )
  //     .pipe(catchError(this.errorHandler));
  // }
  viewSchool(post: any): Observable<any> {
    return this.httpClient
      .post(
        this.apiURL + '/viewSchool',
        JSON.stringify(post),
        this.httpOptions
      )
      .pipe(catchError(this.errorHandler));
  }

  getSchoolList(postParams: any) {
    return this.httpClient
      .post(
        this.apiURL + '/getSchoolList',
        postParams,
        this.httpOptions,
      )
      .pipe(catchError(this.errorHandler))
  }


  getSchool(postParams: any) {
    return this.httpClient
      .post(
        this.apiURL + '/getSchool',
        postParams,
        this.httpOptions,
      )
      .pipe(catchError(this.errorHandler))
  }

  getVillageBydistrictBlock(locateId: any="",districtId:any="",blockId="") {
    return this.httpClient
      .post(
        this.apiURL + '/getVillageBydistrictBlock', JSON.stringify({ locateId: locateId, districtId: districtId ,blockId:blockId})
      )
  }
  getWardByDistrict(locateId: any="",districtId:any="") {
    return this.httpClient
      .post(
        this.apiURL + '/getWardByDistrict', JSON.stringify({ locateId: locateId, districtId: districtId})
      )
  }

  getSchoolInfo(encId: any, academicYear: any) {
    return this.httpClient
      .post(
        this.apiURL + '/getSchoolInfo',
        JSON.stringify({ encId: encId, academicYear: academicYear }),
        this.httpOptions,
      )
      .pipe(catchError(this.errorHandler))
  }

  // deleteSchool(encId:string){
  //   return this.httpClient.get(this.apiURL + '/deleteSchool/'+ encId,  this.httpOptions)
  //   .pipe(tap(()=>{
  //     this.RefreshRequired.next();
  //     catchError(this.errorHandler)
  //   }));
  // }
  deleteSchool(id: number, userId: any,profileId:any): Observable<any> {
    return this.httpClient.post(this.apiURL + '/deleteSchool', JSON.stringify({ 'encId': id, 'userId': userId,'profileId':profileId }))
      .pipe(tap(() => {
        catchError(this.errorHandler)
      }));
  }
  verifySchool(encId: number, userId: any): Observable<any> {
    return this.httpClient.post(this.apiURL + '/verifySchool', JSON.stringify({ 'encId': encId, 'userId': userId }))
  }
  requestToModify(params: any): Observable<any> {
    return this.httpClient.post(this.apiURL + '/modifySchool', JSON.stringify(params))
  }

  assignToSchool(params: any): Observable<any> {
    return this.httpClient.post(this.apiURL + '/assignToSchool', JSON.stringify(params))
  }
  requestToVerify(params: any): Observable<any> {
    return this.httpClient.post(this.apiURL + '/requestToVerify', JSON.stringify(params))
  }
  crApproval(post: any): Observable<any> {
    return this.httpClient.post(this.apiURL + '/crApproval', JSON.stringify(post))
  }
  onVerifySubmit(post: any): Observable<any> {
    return this.httpClient.post(this.apiURL + '/onVerifySubmit', JSON.stringify(post))
  }
  getSchoolStatus(encId: string) {
    return this.httpClient
      .post(
        this.apiURL + '/getSchoolStatus',
        JSON.stringify({ encId: encId }),
        this.httpOptions,
      )
      .pipe(catchError(this.errorHandler))
  }

  updateSchoolStatus(post: any): Observable<any> {
    return this.httpClient.post(
      this.apiURL + '/updateSchoolStatus',
      post,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    )
  }

  schoolOtherInfoUpdate(post: any): Observable<any> {
    return this.httpClient.post(
      this.apiURL + '/updateSchoolOtherInfo',
      JSON.stringify(post),
      this.httpOptions
    )
  }

  getSchoolOtherInfo(encId: any, academicYear: any) {
    return this.httpClient
      .post(
        this.apiURL + '/getSchoolOtherInfo',
        JSON.stringify({ encId: encId, academicYear: academicYear }),
        this.httpOptions,
      )
      .pipe(catchError(this.errorHandler))
  }


  schoolCADInfoUpdate(post: any): Observable<any> {
    return this.httpClient.post(
      this.apiURL + '/updateCADInitiativesInfo',
      JSON.stringify(post),
      this.httpOptions
    )
  }

  getSchoolCADInfo(encId: any, academicYear: any) {
    return this.httpClient
      .post(
        this.apiURL + '/getCADInitiativesInfo',
        JSON.stringify({ encId: encId, academicYear: academicYear }),
        this.httpOptions,
      )
      .pipe(catchError(this.errorHandler))
  }
  getTeacherDetails(schoolId: any): Observable<any> {
    return this.httpClient.post(this.apiURL + '/getTeacherDetails', JSON.stringify({schoolId:schoolId}))
  }
  getSchoolCategory() {
    return this.httpClient.post(this.apiURL + '/getSchoolCategory', this.httpOptions)
  }
  getSpecialSchoolType() {
    const anxtType = 'SPECIAL_SCHOOL_TYPE';
    return this.httpClient.post(this.apiMasterURL + '/getAnnexture', JSON.stringify({ anxtType }))
  }
  getResidentialCategory() {
    const anxtType = 'RESIDENTIAL_CATEGORY';
    return this.httpClient.post(this.apiMasterURL + '/getAnnexture', JSON.stringify({ anxtType }))
  }
  getAssembly(districtId: any) {
    return this.httpClient.post(this.apiURL + '/getAssembly', JSON.stringify({ districtId: districtId }))
  }
  getParliamentary(districtId: any="") {
    return this.httpClient.post(this.apiURL + '/getParliamentary', JSON.stringify({ districtId: districtId }))
  }
  getResidentialSchoolType() {
    const anxtType = 'RESIDENTIAL_SCHOOL_TYPE';
    return this.httpClient.post(this.apiMasterURL + '/getAnnexture', JSON.stringify({ anxtType }))
  }

  getHostleType() {
    const anxtType = 'HOSTLE_TYPE';
    return this.httpClient.post(this.apiMasterURL + '/getAnnexture', JSON.stringify({ anxtType }))
  }

  getMinorityCommunity() {
    const anxtType = 'MINORITY_COMMUNITY_TYPE';
    return this.httpClient.post(this.apiMasterURL + '/getAnnexture', JSON.stringify({ anxtType }))
  }

  getLanguages() {
    const anxtType = 'LANGUAGE';
    return this.httpClient.post(this.apiMasterURL + '/getAnnexture', JSON.stringify({ anxtType }))
  }

  getBaordofSchool() {
    const anxtType = 'BOARD_OF_SCHHOL';
    return this.httpClient.post(this.apiMasterURL + '/getAnnexture', JSON.stringify({ anxtType }))
  }

  getLabModel() {
    const anxtType = 'LAB_MODEL';
    return this.httpClient.post(this.apiMasterURL + '/getAnnexture', JSON.stringify({ anxtType }))
  }

  getITCInstructorType() {
    const anxtType = 'ICT_INSTRUCTOR_TYPE';
    return this.httpClient.post(this.apiMasterURL + '/getAnnexture', JSON.stringify({ anxtType }))
  }

  getHigestAndLowestClass(encId: any, academicYear: any) {
    return this.httpClient
      .post(
        this.apiURL + '/getHigestAndLowestClass',
        JSON.stringify({ encId: encId, academicYear: academicYear }),
        this.httpOptions,
      )
      .pipe(catchError(this.errorHandler))
  }

  getMaxAndMinClass(encId: any, academicYear: any) {
    return this.httpClient
      .post(
        this.apiURL + '/getMinAndMaxClass',
        JSON.stringify({ encId: encId, academicYear: academicYear }),
        this.httpOptions,
      )
      .pipe(catchError(this.errorHandler))
  }
  getMaxAndMinClassAndMgmt(encId: any, academicYear: any) {
    return this.httpClient
      .post(
        this.apiURL + '/getMaxAndMinClassAndMgmt',
        JSON.stringify({ encId: encId, academicYear: academicYear })
      )
  }
  getSchoolStatusForEditOrViewInfo(encId: any, academicYear: any) {
    return this.httpClient
      .post(
        this.apiURL + '/getSchoolStatusForEditOrViewInfo',
        JSON.stringify({ encId: encId, academicYear: academicYear })
      )
  }
  getSchoolClasses(schoolEncId: string) {
    return this.httpClient
      .post(
        this.apiURL + '/getSchoolClasses',
        JSON.stringify({ encId: schoolEncId }),
        this.httpOptions
      )
      .pipe(catchError(this.errorHandler))
  }

  getSchoolWiseClasses(schoolId: string) {
    return this.httpClient
      .post(
        this.apiURL + '/getSchoolClasses',
        JSON.stringify({ schoolId: schoolId }),
        this.httpOptions
      )
      .pipe(catchError(this.errorHandler))
  }

  getSection(param: string) {
    return this.httpClient
      .post(
        this.apiURL + '/getSection',
        param,
        this.httpOptions
      )
      .pipe(catchError(this.errorHandler))
  }

  getSchoolBasicInfo(encId:any,academicYear:any){
    return this.httpClient
      .post(
        this.apiURL + '/getSchoolBasicInfo',
        JSON.stringify({encId:encId,academicYear:academicYear}),
        this.httpOptions,
      )
      .pipe(catchError(this.errorHandler))
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
