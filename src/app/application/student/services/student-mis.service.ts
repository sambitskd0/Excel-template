import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { Observable, Subject, throwError } from "rxjs";
import { catchError, tap } from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class StudentMisService {

  constructor(private httpClient: HttpClient) { }
  private studentApiURL = environment.studentAPI;
  private refreshRequired = new Subject<void>();
  httpOptions = {
    headers: new HttpHeaders({
      "Content-Type": "application/json",
    }),
  };
  get RefreshRequired() {
    return this.refreshRequired;
  }
  loadCasteWiseEnrollmentData(post: any): Observable<any> {
    return this.httpClient
      .post(
        this.studentApiURL + "/loadCasteWiseEnrollmentData",
        Object.assign(post)
      )
  }

  /**Gender Wise Report as per filter, By: Sonu Kumar, On: 09-01-2022, Component Name : getGenderWiseReport **/
  getSchoolCategory(): Observable<any> {
    return this.httpClient.post(
      this.studentApiURL + "/getSchoolCategory",
      JSON.stringify({})
    );
  }

  getSchoolCategoryBySchoolId(post: any): Observable<any> {
    return this.httpClient.post(
      this.studentApiURL + "/getSchoolCategoryBySchoolId",
      JSON.stringify(post)
    );
  }

  /**Gender Wise Report as per filter, By: Sonu Kumar, On: 09-01-2022, Component Name : getGenderWiseReport **/
  getGenderWiseReport(post: any): Observable<any> {
    return this.httpClient.post(
      this.studentApiURL + "/getGenderWiseReport",
      JSON.stringify(post)
    );
  }

  /**Get School list as per filter, By: Sonu Kumar, On: 10-01-2022, Component Name : getGenderWiseReport **/
  getSchoolList(post: any): Observable<any> {
    return this.httpClient.post(
      this.studentApiURL + "/getSchoolList",
      JSON.stringify(post)
    );
  }

  /**Get Gender Wise Enrollment as per filter, By: Sonu Kumar, On: 11-01-2022, Component Name : getGenderWiseReport **/
  downloadGenderWiseReportCsv(post: any): Observable<any> {
    return this.httpClient.post(
      this.studentApiURL + "/downloadGenderWiseReportCsv",
      JSON.stringify(post)
    );
  }

  /**Get Class according to school Category as per filter, By: Sonu Kumar, On: 11-01-2022, Component Name : getGenderWiseReport **/
  getClass(post: any): Observable<any> {
    return this.httpClient.post(
      this.studentApiURL + "/getClass",
      JSON.stringify(post)
    );
  }

  /**Get Class according to school Category as per filter, By: Sonu Kumar, On: 11-01-2022, Component Name : getGenderWiseReport **/
  getAllClass() {
    return this.httpClient.post(
      this.studentApiURL + "/getAllClass",
      JSON.stringify({})
    );
  }

  /**Get Religion Wise Report as per filter, By: Sonu Kumar, On: 11-01-2022, Component Name : ReligionWiseEnrollmentReportComponent **/
  getReligionWiseReport(post: any): Observable<any> {
    return this.httpClient.post(
      this.studentApiURL + "/getReligionWiseReport",
      JSON.stringify(post)
    );
  }

  /**Get Disability Wise Report as per filter, By: Sonu Kumar, On: 13-01-2022, Component Name : DisabilityWiseEnrollmentReportComponent **/
  getDisabilityWiseReport(post: any): Observable<any> {
    return this.httpClient.post(
      this.studentApiURL + "/getDisabilityWiseReport",
      JSON.stringify(post)
    );
  }

  /**Get Caste Wise Report as per filter, By: Sonu Kumar, On: 25-01-2022, Component Name : CasteWiseEnrollmentReportComponent **/
  getCasteWiseReport(post: any): Observable<any> {
    return this.httpClient.post(
      this.studentApiURL + "/getCasteWiseReport",
      JSON.stringify(post)
    );
  }

  /**Get Health Wise Report as per filter, By: Sonu Kumar, On: 25-01-2022, Component Name : HealthWiseReportComponent **/
  getHealthWiseReport(post: any): Observable<any> {
    return this.httpClient.post(
      this.studentApiURL + "/getHealthWiseReport",
      JSON.stringify(post)
    );
  }

  /**Get Remedial Wise Report as per filter, By: Sonu Kumar, On: 27-01-2022, Component Name : RemedialTrainingReportComponent **/
  getRemedialReport(post: any): Observable<any> {
    return this.httpClient.post(
      this.studentApiURL + "/getRemedialReport",
      JSON.stringify(post)
    );
  }

}
