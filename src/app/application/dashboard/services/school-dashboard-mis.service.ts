import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class SchoolDashboardMisService {
  private schoolApiURL = environment.schoolAPI;
  private teacherApiURL = environment.teacherAPI;
  constructor(private httpClient: HttpClient) {}
  schoolCount(post:any): Observable<any> {
    return this.httpClient.post(
      this.schoolApiURL + "/schoolCount",
      JSON.stringify(post)
    );
  }
  getSchoolCategoryData(post:any): Observable<any> {
    return this.httpClient.post(
      this.schoolApiURL + "/schoolCategoryTypeWise",
      JSON.stringify(post)
    );
  }

  getSchoolCategoryWiseForTableView(post:any): Observable<any> {
    return this.httpClient.post(
      this.schoolApiURL + "/getSchoolCategoryWiseForTableView",
      JSON.stringify(post)
    );
  }
  getSchoolMgtData(post:any): Observable<any> {
    return this.httpClient.post(
      this.schoolApiURL + "/getSchoolMgtData",
      JSON.stringify(post)
    );
  }
}
