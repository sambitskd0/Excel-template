import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { Observable, Subject, throwError } from "rxjs";
import { catchError, tap } from "rxjs/operators";

@Injectable({
  providedIn: "root",
})
export class ManageGrantExpenditureService {
  private apiURL = environment.grantAPI;
  private refreshRequired = new Subject<void>();
  get RefreshRequired() {
    return this.refreshRequired;
  }
  formDataHttpOptions = {
    headers: new HttpHeaders({
      contentType: "formData",
    }),
  };
  constructor(private httpClient: HttpClient) {}
  getBalance(grantType: any, schoolId: any, academicYear: any) {
    return this.httpClient.post(
      this.apiURL + "/getBalance",
      JSON.stringify({
        grantType: grantType,
        schoolId: schoolId,
        academicYear: academicYear,
      })
    );
  }
  getGrantReceiveDate(grantType: any, schoolId: any, academicYear: any) {
    return this.httpClient.post(
      this.apiURL + "/getGrantReceiveDate",
      JSON.stringify({
        grantType: grantType,
        schoolId: schoolId,
        academicYear: academicYear,
      })
    );
  }
  updateGrantExpendeture(formData: any) {
    return this.httpClient.post(this.apiURL + "/updateGrantExpendeture", formData, this.formDataHttpOptions);
  }
  addGrantExpendeture(formData: any) {
    return this.httpClient.post(this.apiURL + "/addGrantExpendeture", formData, this.formDataHttpOptions);
  }
  viewDetails(schoolId: any, academicYear: any, grantType: any) {
    return this.httpClient.post(
      this.apiURL + "/viewDetails",
      JSON.stringify({
        schoolId: schoolId,
        academicYear: academicYear,
        grantType: grantType,
      })
    );
  }
  /* Created By  :  Saubhgya Ranjan Patra ||  Created On  : 08-09-2022 || Component Name : ViewgrantexpendutureComponent || Description: view Grant expenduture */
  viewGrantExpendeture(post: any): Observable<any> {
    return this.httpClient.post(
      this.apiURL + "/viewGrantExpendeture",
      JSON.stringify(post)
    );
  }
  /* Created By  :  Saubhgya Ranjan Patra ||  Created On  : 27-09-2022 || Component Name : CheckBalanceComponent || Description: check balance of perticular grant type with details */
  viewCheckBalance(post: any): Observable<any> {
    return this.httpClient.post(
      this.apiURL + "/viewCheckBalance",
      JSON.stringify(post)
    );
  }
  /* Created By  :  Saubhgya Ranjan Patra ||  Created On  : 08-09-2022 || Component Name : ViewgrantexpendutureComponent || Description: Delete Grant expenduture */
  deleteGrantExpenduture(id: number, userId: string, profileId:any) {
    const allData = { id, userId, profileId };
    return this.httpClient
      .post(this.apiURL + "/deleteGrantExpenduture", JSON.stringify(allData))
      .pipe(
        tap(() => {
          this.RefreshRequired.next();
        })
      );
  }
  /* Created By  :  Saubhgya Ranjan Patra ||  Created On  : 09-09-2022 || Component Name : EditGrantExpenditureComponent || Description: get  Data for edit Grant Expenditure  */
  getGrantExpenditure(encId: string) {
    return this.httpClient.post(
      this.apiURL + "/getGrantExpenditure",
      JSON.stringify({ encId: encId })
    );
  }
  getGrantType(schoolNormalId: any, schoolEncId: any) {
    return this.httpClient.post(
      this.apiURL + "/getGrantTypeBySchoolId",
      JSON.stringify({
        schoolNormalId: schoolNormalId,
        schoolEncId: schoolEncId,
      })
    );
  }
  grantExpenditureType() {
    const encId=""
    return this.httpClient.post(
      this.apiURL + "/grantExpenditureType",
      JSON.stringify({encId: encId,})
    );
  }
}
