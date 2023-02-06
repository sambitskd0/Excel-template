import { EventEmitter, Injectable } from "@angular/core";
import { ActivatedRoute, Data, Router } from "@angular/router";
import { AlertHelper } from "src/app/core/helpers/alert-helper";
import { JwtHelperService } from "@auth0/angular-jwt";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { catchError, Observable, Subject, throwError } from "rxjs";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root",
})
export class DivyaService {
  private divyaInspectionAPI = environment.divyaInspectionAPI;
  public tokenEmitter = new EventEmitter();

  constructor(
    private httpClient: HttpClient,
    private alertHelper: AlertHelper,
    private jwtHelper: JwtHelperService
  ) {}

  /**
   * Created By   : Sambit Kumar Dalai
   * Created On   : 03-08-2022
   * Description  : Submit survey work
   **/
  submitSurveyWork(data: object) {
    return this.httpClient.post(
      this.divyaInspectionAPI + "/surveyWork",
      JSON.stringify({ data })
    );
  }
  //============ Swagatika Start =============//

  getAllDistrict(): Observable<any> {
    return this.httpClient.post(this.divyaInspectionAPI + "/districtList", {});
  }

  getBlockByDistrictid(districtId: any) {
    // console.log(JSON.stringify(districtId));
    return this.httpClient.post(
      this.divyaInspectionAPI + "/blockList",
      JSON.stringify({ districtId })
    );
  }

  /* Any Other Work Inspection */
  saveAnyOtherWork(post: any): Observable<any> {
    return this.httpClient.post(
      this.divyaInspectionAPI + "/saveAnyOtherWork",
      JSON.stringify(post)
    );
  }
  /* KGBV Inspection */
  saveKGBV(post: any): Observable<any> {
    return this.httpClient.post(
      this.divyaInspectionAPI + "/saveKGBV",
      JSON.stringify(post)
    );
  }
  /* KGBV Teacher Inspection */
  saveKGBVTeacher(post: any): Observable<any> {
    return this.httpClient.post(
      this.divyaInspectionAPI + "/saveKGBVTeacher",
      JSON.stringify(post)
    );
  }
  /* Home Based Education Inspection */
  saveHomeBasedEducation(post: any): Observable<any> {
    return this.httpClient.post(
      this.divyaInspectionAPI + "/saveHomeBasedEducation",
      JSON.stringify(post)
    );
  }
  /* Home Based Education Teacher Inspection */
  saveHomeBasedEducationTeacher(post: any): Observable<any> {
    return this.httpClient.post(
      this.divyaInspectionAPI + "/saveHomeBasedEducationTeacher",
      JSON.stringify(post)
    );
  }
  // ============== Swagatika End ===========//

  //============ debasis

  saveSchoolSurvey(post: any): Observable<any> {
    return this.httpClient.post(
      this.divyaInspectionAPI + "/saveSchoolSurvey",
      JSON.stringify(post)
    );
  }
  saveSchoolSurveyTeacher(post: any): Observable<any> {
    return this.httpClient.post(
      this.divyaInspectionAPI + "/saveSchoolSurveyTeacher",
      JSON.stringify(post)
    );
  }
  saveCamp(post: any): Observable<any> {
    return this.httpClient.post(
      this.divyaInspectionAPI + "/saveCamp",
      JSON.stringify(post)
    );
  }
  // =============================debasis end
  // ==================================saubhagya start
  saveResourceCenterTeacher(post: any): Observable<any> {
    return this.httpClient.post(
      this.divyaInspectionAPI + "/saveResourceCenterTeacher",
      JSON.stringify(post)
    );
  }
  saveResourceCenter(post: any): Observable<any> {
    return this.httpClient.post(
      this.divyaInspectionAPI + "/saveResourceCenter",
      JSON.stringify(post)
    );
  }
  saveArtificialLimb(post: any): Observable<any> {
    return this.httpClient.post(
      this.divyaInspectionAPI + "/saveArtificialLimb",
      JSON.stringify(post)
    );
  }
  saveArtificialLimbCenterTeacher(post: any): Observable<any> {
    return this.httpClient.post(
      this.divyaInspectionAPI + "/saveArtificialLimbCenterTeacher",
      JSON.stringify(post)
    );
  }
  saveTrainingDataByTeacher(post: any): Observable<any> {
    return this.httpClient.post(
      this.divyaInspectionAPI + "/saveTrainingDataByTeacher",
      JSON.stringify(post)
    );
  }
  //=====================================saubhagya end

  /* Created By : Sambit Kumar Dalai || Created On : 03-08-2022 || Service method Name : getTokenDetails || Description: get token from url query params  */
  getTokenDetails(route: ActivatedRoute, router: Router) {
    route.queryParams.subscribe(async (params: any) => {
      if (params["token"] && params["token"]?.length) {
        try {
          // if jwt token not expired
          if (this.jwtHelper.isTokenExpired(params["token"]) === false) {
            this.emitTokenDetails(params["token"]);
          } else {
            // if jwt token expired
            this.alertHelper
              .viewAlert("error", "", "Your session has expired.")
              .then(() => {
                router.navigate(["../pageNotFound"], {
                  relativeTo: route,
                });
              });
          }
        } catch (error) {
          if (error) {
            router.navigate(["../pageNotFound"], {
              relativeTo: route,
            });
          }
        }
      } else {
        router.navigate(["../pageNotFound"], {
          relativeTo: route,
        });
      }
    });
  }
  /* Created By : Sambit Kumar Dalai || Created On : 03-08-2022 || Service method Name : getTokenDetails || Description: user details from token emitter  */
  emitTokenDetails(token: any) {
    sessionStorage.setItem("mobileAuthToken", token);
    setTimeout(() => {
      this.tokenEmitter.emit(this.jwtHelper.decodeToken(token)); // emit
    });
  }

  /* Created By  :  Deepti Ranjan ||  Created On  : 03-08-2022 || Component Name : getAnextureType || Description: Get data from anexture table */
  getAnextureType(anxtType: any) {
    return this.httpClient.post(
      this.divyaInspectionAPI + "/getAnnexture",
      JSON.stringify({ anxtType })
    );
  }

  /* Created By  :  Deepti Ranjan ||  Created On  : 03-08-2022 || Component Name : submitTraining || Description: Submit Training form details*/
  submitTraining(data: any) {
    return this.httpClient.post(
      this.divyaInspectionAPI + "/submitTraining",
      JSON.stringify({ data })
    );
  }
}
