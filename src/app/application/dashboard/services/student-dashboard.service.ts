import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root",
})
export class StudentDashboardService {
  private studentAPI = environment.studentAPI;

  constructor(private httpClient: HttpClient) {}

  // get total count
  studentCount(post: any): Observable<any> {
    return this.httpClient.post(
      this.studentAPI + "/studentCount",
      JSON.stringify(post)
    );
  }
  /**
   * Created By  : Sambit Kumar Dalai
   * Created On  : 23-01-2023
   * Description : get student social category
   **/
  getStudentSocialCategoryData(post: any): Observable<any> {
    return this.httpClient.post(
      this.studentAPI + "/getStudentSocialCategoryData",
      JSON.stringify(post)
    );
  }
  /**
   * Created By  : Sambit Kumar Dalai
   * Created On  : 23-01-2023
   * Description : Get students class wise
   **/
  getClassWiseStudentsCount(post: any): Observable<any> {
    return this.httpClient.post(
      this.studentAPI + "/getClassWiseStudentsCount",
      JSON.stringify(post)
    );
  }

  genderWiseStudData(post: any): Observable<any> {
    return this.httpClient.post(
      this.studentAPI + "/genderWiseStudData",
      JSON.stringify(post)
    );
  }
}
