/**
 * Created By  : Sambit Kumar Dalai
 * Created On  : 15-05-2022
 * Description : Common service for all modules.
 **/

import { HttpClient, HttpHeaders } from "@angular/common/http";
import { EventEmitter, Injectable } from "@angular/core";
import { Observable, Subject } from "rxjs";
import { environment } from "src/environments/environment";
import { AuthenticationService } from "./authentication.service";
import { formatDate } from "@angular/common";
import { Router } from "@angular/router";
import { AlertHelper } from "../helpers/alert-helper";
import { isDevMode } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class CommonserviceService {
  private masterAPI = environment.masterAPI;
  private studentAPI = environment.studentAPI;
  private schoolAPI = environment.schoolAPI;
  private authAPI = environment.authAPI;
  private profileAPI = environment.profileAPI;
  private notificationAPI = environment.notificationAPI;

  private userProfile: any;
  private userPrivilege: any;
  public hideNavHeader = new EventEmitter();
  public hideNav = new EventEmitter();
  public routeNotification = new Subject<string>();
  public isSideNavAndHeaderHidden = false;
  public isSideNavHidden = false;
  private encKey = environment.jsEncKey;
  notificationCountObservable = new Subject(); // dynamically show notification count

  httpOptions = {
    headers: new HttpHeaders({
      "Content-Type": "application/json",
      //"skipInterCept": "true"
    }),
  };
  constructor(
    private httpClient: HttpClient,
    private authenticationService: AuthenticationService,
    private route: Router,
    private alertHelper: AlertHelper
  ) {}

  getAllDistrict(): Observable<any> {
    return this.httpClient.post(
      this.masterAPI + "/getDistrict",
      this.httpOptions
    );
  }

  getBlockByDistrictid(districtId: any) {
    return this.httpClient.post(
      this.masterAPI + "/getBlock",
      JSON.stringify({ districtId }),
      this.httpOptions
    );
  }

  getmunicipaltyByBlockId(districtId: any, blockId: any, nagarType: any) {
    return this.httpClient.post(
      this.masterAPI + "/viewNagarnigam",
      JSON.stringify({ districtId, blockId, nagarType }),
      this.httpOptions
    );
  }

  getClusterByBlockId(blockId: any) {
    return this.httpClient.post(
      this.masterAPI + "/getCluster",
      JSON.stringify({ blockId }),
      this.httpOptions
    );
  }

  getTeacherAccordingToSchool(schoolId: any) {
    return this.httpClient.post(
      this.masterAPI + "/getTeacherAccordingToSchool",
      JSON.stringify({ schoolId })
    );
  }

  getPanchayatByBlockId(blockId: any) {
    const nagarType = 2; // for panchayat
    return this.httpClient.post(
      this.masterAPI + "/viewNagarnigam",
      JSON.stringify({ blockId, nagarType }),
      this.httpOptions
    );
  }

  getMunicipalityByDistrictId(districtId: any) {
    const nagarType = 1; // for municipality
    const blockId = 0;
    return this.httpClient.post(
      this.masterAPI + "/viewNagarnigam",
      JSON.stringify({ districtId, blockId, nagarType }),
      this.httpOptions
    );
  }

  /* Created By  :  Saubhgya Ranjan Patra ||  Created On  : 25-05-2022 || Component Name : ViewCategoryComponent,EditCategoryComponent,AddCategoryComponent || Description: get all anexture  (School Tagging Type)  */
  getAnextureType(anxtType: any) {
    return this.httpClient.post(
      this.masterAPI + "/getAnnexture",
      JSON.stringify({ anxtType }),
      this.httpOptions
    );
  }

  /* Created By  :  Saubhgya Ranjan Patra ||  Created On  : 25-05-2022 || Component Name : addSmartClassComponent || Description: get class */
  getSmartClassFromAnnexture(anxtType: any) {
    return this.httpClient.post(
      this.masterAPI + "/getSmartClassFromAnnexture",
      JSON.stringify({ anxtType }),
      this.httpOptions
    );
  }

  /* Created By  :  Saubhgya Ranjan Patra ||  Created On  : 25-05-2022 || Component Name : ViewCategoryComponent,EditCategoryComponent,AddCategoryComponent || Description: get all anexture  (School Tagging Type)  */
  getschoolTypeName(anxtValue: any, anxtType: any) {
    return this.httpClient.post(
      this.masterAPI + "/getAnnexture",
      JSON.stringify({ anxtValue, anxtType }),
      this.httpOptions
    );
  }

  getVillageByPanchayatId(panchayatId: any) {
    const villageType = 2; // for village
    return this.httpClient.post(
      this.masterAPI + "/viewVillage",
      JSON.stringify({ panchayatId, villageType }),
      this.httpOptions
    );
  }

  getWardByMunicipalityId(panchayatId: any) {
    const villageType = 1; // for ward
    return this.httpClient.post(
      this.masterAPI + "/viewVillage",
      JSON.stringify({ panchayatId, villageType }),
      this.httpOptions
    );
  }

  getSchoolType() {
    const anxtType = "SCHOOL_TYPE";
    return this.httpClient.post(
      this.masterAPI + "/getAnnexture",
      JSON.stringify({ anxtType }),
      this.httpOptions
    );
  }

  getSchoolManagement() {
    const anxtType = "SCHOOL_MANAGEMENT";
    return this.httpClient.post(
      this.masterAPI + "/getAnnexture",
      JSON.stringify({ anxtType }),
      this.httpOptions
    );
  }

  getIncentiveUnit() {
    const anxtType = "INCENTIVE_UNIT";
    return this.httpClient.post(
      this.masterAPI + "/getAnnexture",
      JSON.stringify({ anxtType }),
      this.httpOptions
    );
  }
  getGender() {
    const anxtType = "GENDER";
    return this.httpClient.post(
      this.masterAPI + "/getAnnexture",
      JSON.stringify({ anxtType }),
      this.httpOptions
    );
  }

  getCaste() {
    const anxtType = "CASTE";
    return this.httpClient.post(
      this.masterAPI + "/getAnnexture",
      JSON.stringify({ anxtType }),
      this.httpOptions
    );
  }

  getDisabilityType() {
    const anxtType = "DISABILITY_TYPE";
    return this.httpClient.post(
      this.masterAPI + "/getAnnexture",
      JSON.stringify({ anxtType }),
      this.httpOptions
    );
  }

  getClass() {
    const anxtType = "CLASS_TYPE";
    return this.httpClient.post(
      this.masterAPI + "/getAnnexture",
      JSON.stringify({ anxtType }),
      this.httpOptions
    );
  }

  /* Created By : Deepti Ranjan || Created On : 16-06-2022 || Service method Name : getStage || Description: To get demography level for grivance */
  getStage() {
    const anxtType = "LVL";
    const anxtFromLevel = 2;
    return this.httpClient.post(
      this.masterAPI + "/getAnnexture",
      JSON.stringify({ anxtType, anxtFromLevel }),
      this.httpOptions
    );
  }

  /* Created By : Deepti Ranjan || Created On : 16-06-2022 || Service method Name : getAuthorityDesignation || Description: To get demography level widse designation for grivance */
  getAuthorityDesignation() {
    return this.httpClient.get(this.profileAPI + "/getAuthorityDesignation");
  }

  /* Created By : Deepti Ranjan || Created On : 06-07-2022 || Service method Name : getAuthority || Description: To get designation wise authority */
  getAuthority(authorityParams: any) {
    return this.httpClient.post(
      this.profileAPI + "/getAuthority",
      authorityParams,
      this.httpOptions
    );
  }

  /* Created By : Deepti Ranjan || Created On : 09-06-2022 || Service method Name : verifyLinkPermission || Description: Verify backend authorization */
  verifyLinkPermission(pageURL: any, pageType: any, privilege: any) {
    // let errorMessage: string = '<i class="bi bi-arrow-right text-danger"></i> You are not authorized for this page.';
    this.userProfile = JSON.parse(
      sessionStorage.getItem("userProfile") || "{}"
    );
    const userRole: any = this.userProfile.userRole;

    this.httpClient
      .post(
        this.authAPI + "/verifyLinkPermission",
        JSON.stringify({ pageURL, pageType, privilege, userRole }),
        this.httpOptions
      )
      .subscribe({
        next: (res: any) => {
          if (res.message == "Authorized") {
            if (pageType != "GL") {
              this.userPrivilege = res.privilege;
              if (
                this.userPrivilege != "" &&
                this.userPrivilege != "admin" &&
                this.userPrivilege != privilege
              ) {
                this.authenticationService.logout();
              }
            }
          } else {
            this.authenticationService.logout();
          }
        },
      });
  }

  /* Created By : Sambit Kumar Dalai || Created On : 17-06-2022 || Description: common service function for getting all type of annexture details */
  getCommonAnnexture(
    anxtTypes: Array<string>,
    sortBySeq: boolean = false
  ): Observable<any> {
    return this.httpClient.post(
      this.masterAPI + "/getCommonAnnexture",
      JSON.stringify({ anxtTypes, sortBySeq }),
      this.httpOptions
    );
  }

  /* Created By : Sambit Kumar Dalai || Created On : 17-06-2022 || Description: get logged in user profile details */
  getUserProfile() {
    let userProfile: any = sessionStorage.getItem("userProfile");
    userProfile = JSON.parse(userProfile);
    return userProfile;
  }

  getImage(imageString: any) {
    return this.httpClient.get(this.studentAPI + "/getAfile/" + imageString);
  }

  /* get current acedemic year :: Sambit :: 08-07-2022 */
  getCurrentAcademicYear() {
    return this.httpClient.get(this.schoolAPI + "/getCurrentAcademicYear");
  }

  // get subjects class wise
  getSubjectsClassWise(classId: number | string) {
    return this.httpClient.post(
      this.schoolAPI + "/getSubjectsClassWise",
      JSON.stringify({ classId })
    );
  }

  getClassAccordingToExamType(examtype: number | string) {
    return this.httpClient.post(
      this.masterAPI + "/getClassAccordingToExamType",
      JSON.stringify({ examtype })
    );
  }

  /* get search panel data depending on usertype :: Sambit :: 12-07-2022 */
  getSearchPanelData(userId: any, userType: string): any {
    switch (userType) {
      case "SCHOOL":
        return this.httpClient.post(
          this.schoolAPI + "/getSearchPanelData",
          JSON.stringify({ userId })
        );
        break;

      default:
        break;
    }
  }

  pageSetup(status: boolean) {
    this.isSideNavAndHeaderHidden = status;
    this.hideNavHeader.emit(status); // emit
  }
  dashboardPageSetup(status: boolean) {
    this.isSideNavHidden = status;
    this.hideNav.emit(status); // emit
  }

  /* Created By  : Deepti Ranjan ||  Created On  : 12-07-2022 || Description: School Listing for dropdown list   */
  getSchoolList(clusterId: any, schoolCategoryId: any = "") {
    return this.httpClient.post(
      this.schoolAPI + "/getSchoolList",
      JSON.stringify({ clusterId, schoolCategoryId }),
      this.httpOptions
    );
  }

  /* Created By  : Swagatika ||  Created On  : 19-07-2022 || Description: School basic info to show   */
  getSchoolBasicInfo(params: any): Observable<any> {
    return this.httpClient.post(
      this.schoolAPI + "/getSchoolBasicInfo",
      params,
      this.httpOptions
    );
  }

  /* Created By  : Swagatika ||  Created On  : 19-07-2022 || Description: School basic info to show   */
  getSchoolInfo(params: any = []) {
    let schoolInfo: any = [];

    console.log("Before:::", sessionStorage.getItem("schooInfo"));
    // if(sessionStorage.getItem("schooInfo")){
    //   schoolInfo = sessionStorage.getItem("schooInfo");
    // }else{
    this.getSchoolBasicInfo(params).subscribe((res: any) => {
      console.log("Middle:::", res.data);
      schoolInfo = res.data;

      sessionStorage.setItem("schoolInfo", JSON.stringify(schoolInfo));
    });
    // }
    console.log(schoolInfo);
    sessionStorage.setItem(schoolInfo, schoolInfo);
    console.log(JSON.parse(sessionStorage["schoolInfo"]).schoolId);

    let item = JSON.parse(sessionStorage.getItem("schooInfo") || "{}");
    console.log("After:::", item);
  }

  /* Created By  : Deepti Ranjan Dash ||  Created On  : 24-08-2022 || Description: Use for print window   */

  printPage(cloneTable: any, pageTitle: any ,printType:string = "eshiksha") {
    const windowName = "PrintPage";
    let curDate = formatDate(new Date(), "dd-MMM-yyyy hh:mm:ss a", "en");
    const wOption =
      "width=1000,height=600,menubar=yes,scrollbars=yes,location=no,left=100,top=100";

    let wWinPrint = window.open("", windowName, wOption);
    wWinPrint?.document.write("<html><head>");
    wWinPrint?.document.write("<title>" + pageTitle + "</title>");
    wWinPrint?.document.write(
      `<link href= ${this.BASEURL + "/assets/css/print.css"} rel='stylesheet'>`
    );
    wWinPrint?.document.write("</head><body>");
    wWinPrint?.document.write(
      `<div id='header' style='margin-bottom:10px;'>
        <div style="float: left;">
          ${printType === "best" ?
            `<img style="height: 120px; width: 101px; margin-top: -30px;" src=${this.BASEURL + "/assets/img/BEST_logo.jpeg"} alt='logo image'>`:''
          }
        </div>
        <div style="float: right;">${curDate}</div>
        <div class='print-logo'>
          <img src=${this.BASEURL + "/assets/img/purple-logo.png"} alt='logo image'></div>
          <div id='printHeader' style='text-align: center;'>
          <h5 class='heading'>Bihar Education Project Council</h5><br /> 
          <span class='headingSub'> Shiksha Bhawan, Rashtrabhasha Parishad Campus, Saidpur, Rajendra Nagar, Patna-04</span>
        </div>
          <a href='javascript:void(0)' title='Print' class='btn btn-success btn-sm pull-right print-btn' onclick='this.style.display=\"none\";window.print();this.style.display=\"block\";'><i class='icon-white icon-print'></i> Print</a>
          <div class='clearfix'></div>
      </div>`
    );
    wWinPrint?.document.write(
      "<div id='printHeader'><h3 class='heading'>" + pageTitle + "</h3></div>"
    );
    wWinPrint?.document.write(
      "<div id='printContent' class='printReport'>" + cloneTable + "</div>"
    );
    wWinPrint?.document.write(
      "<div id='printFooter'>Copyright &copy; " +
        new Date().getFullYear() +
        ", All rights reserved.</div>"
    );
    wWinPrint?.document.write("</body></html>");

    wWinPrint?.document.close();
    wWinPrint?.focus();
    return wWinPrint;
  }

  /* Created By  : Deepti Ranjan ||  Created On  : 06-09-2022 || Description: Get school or teacher demography details   */
  getDemographyByClusterId(clusterId: any) {
    return this.httpClient.post(
      this.masterAPI + "/getDemographyByClusterId",
      JSON.stringify({ clusterId }),
      this.httpOptions
    );
  }

  /* Created By  : Saubhagya Ranjan ||  Created On  : 06-08-2022 || Description: Get section according to class and schoolId  */
  getSection(classId: any, schoolId: any, academicYear: any) {
    return this.httpClient.post(
      this.schoolAPI + "/getSection",
      JSON.stringify({ classId, schoolId, academicYear })
    );
  }

  /* Created By  : Saubhagya Ranjan ||  Created On  : 06-08-2022 || Description: Get class according to exam term id  */
  getClassByTermId(examinationTypeId: any) {
    return this.httpClient.post(
      this.masterAPI + "/getClassByTermId",
      JSON.stringify({ examinationTypeId }),
      this.httpOptions
    );
  }

  /* Created By : Deepti Ranjan || Created On : 19-10-2022 || Service method Name : getHeaderNotifications || Description: To get header notifications */
  getHeaderNotifications(): Observable<any> {
    const userDetails = this.getUserProfile();
    return this.httpClient.post(
      this.notificationAPI + "/getHeaderNotifications",
      JSON.stringify({
        userId: userDetails.userId,
        userType: userDetails.loginUserTypeId,
      })
    );
  }

  navNotification() {
    this.routeNotification.next("notification");
    this.route.navigateByUrl("/Application/notification/portalInbox");
  }
  /* Created By : Deepti Ranjan || Created On : 09-08-2022 || Service method Name : encryptObject || Description: encrypt object */
  encryptObject(encObj: any) {
    return encodeURIComponent(
      CryptoJS.AES.encrypt(JSON.stringify(encObj), this.encKey).toString()
    );
  }

  /* Created By : Deepti Ranjan || Created On : 09-08-2022  || Service method Name : decryptObject || Description: decrypt object */
  decryptObject(encObj: any) {
    let deData = CryptoJS.AES.decrypt(decodeURIComponent(encObj), this.encKey);
    return JSON.parse(deData.toString(CryptoJS.enc.Utf8));
  }

  /**
   * Created By  : Sambit Kumar Dalai
   * Created On  : 22-12-2022
   * Description : Send notification
   **/
  sendNotification(notificationObj: Object): Observable<any> {
    return this.httpClient.post(
      this.notificationAPI + "/sendNotification",
      JSON.stringify({
        ...notificationObj,
        ...this.getUserProfile(),
      })
    );
  }
  /**
   * Created By  : Sambit Kumar Dalai
   * Created On  : 22-12-2022
   * Description : Dynamic BASE URL for local,staging,live
   **/
  get BASEURL() {
    // ====== BASE url setup
    if (
      isDevMode() === false &&
      environment.BASEURL?.includes("eshikshakosh.bihar.gov.in")
    ) {
      // 1) Live
      return environment.BASEURL?.replace(
        "eshikshakosh.bihar.gov.in/eshikshakosh",
        "eshikshakosh.bihar.gov.in"
      );
    } else {
      return environment.BASEURL;
    }
  }

  /**
   * Created By  : Sambit Kumar Dalai
   * Created On  : 09-01-2023
   * Description : Get school categories
   **/
  getSchoolCategory() {
    return this.httpClient.post(this.schoolAPI + "/getSchoolCategory", {});
  }
}
