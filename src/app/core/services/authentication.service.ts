/**
 * Created By  : Sambit Kumar Dalai
 * Created On  : 15-05-2022
 * Description : Authentication service.
 **/

import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { Router } from "@angular/router";
import { JwtHelperService } from "@auth0/angular-jwt";
import jwt_decode from "jwt-decode";
import { NgxSpinnerService } from "ngx-spinner";
import { AlertHelper } from "src/app/core/helpers/alert-helper";
import * as CryptoJS from "crypto-js";
@Injectable({
  providedIn: "root",
})
export class AuthenticationService {
  private userProfile = JSON.parse(
    sessionStorage.getItem("userProfile") || "{}"
  );
  private userId = this.userProfile.userId;
  private loginUserTypeId = this.userProfile.loginUserTypeId;
  private authAPI = environment.authAPI;
  oauthAPI = environment.oauthAPI;
  httpOptions: any;
  jwtToken: any = sessionStorage.getItem("jwtToken");
  private encKey = environment.jsEncKey;
  // decodedToken: any = jwt_decode(this.jwtToken);
  // userId:any = this.decodedToken?.userDetails?.vchUserId;

  constructor(
    private httpClient: HttpClient,
    private route: Router,
    private jwtHelper: JwtHelperService,
    private spinner: NgxSpinnerService,
    private alertHelper: AlertHelper
  ) {
    this.getHttpHeaders();
  }

  getHttpHeaders() {
    // ==== get jwt key
    this.httpOptions = {
      headers: new HttpHeaders({
        skipInterCept: "true",
        "Content-Type": "application/json",
      }),
    };
  }
  /**
   * Created By   : Sambit Kumar Dalai
   * Created On   : 17-05-2022
   * Description  : Login
   **/

  login(post: any): Observable<any> {
    var CryptoJSAesJson = {
      stringify: function (cipherParams: any) {
        var j = {
          ct: cipherParams.ciphertext.toString(CryptoJS.enc.Base64),
          iv: cipherParams.iv.toString(),
          s: cipherParams.salt.toString(),
        };

        return JSON.stringify(j);
      },
      parse: function (jsonStr: any) {
        var j = JSON.parse(jsonStr);
        var cipherParams = CryptoJS.lib.CipherParams.create({
          ciphertext: CryptoJS.enc.Base64.parse(j.ct),
        });

        return cipherParams;
      },
    };

    let params = CryptoJS.AES.encrypt(JSON.stringify(post), this.encKey, {
      format: CryptoJSAesJson,
    }).toString();
    return this.httpClient.post(this.authAPI + "/login", params);
  }

  /**
   * Created By   : Sambit Kumar Dalai
   * Created On   : 17-05-2022
   * Description  : Check user authenticated
   **/
  isAuthenticated(): boolean {
    try {
      if (sessionStorage.getItem("jwtToken")?.length) {
        const token: any = sessionStorage.getItem("jwtToken");
        return !this.jwtHelper.isTokenExpired(token);
      }
      this.route.navigateByUrl("login");
      return false;
    } catch (error) {
      return false;
    }
  }
  /* Created By : Sambit Kumar Dalai || Created On : 17-05-2022 || Description:Refresh token*/
  refreshToken(allData: any) {
    return this.httpClient.post(this.oauthAPI, allData);
  }
  /* Created By : Sambit Kumar Dalai || Created On : 17-05-2022 || Description:Increase token expiry time*/
  increaseTokenExpiration() {
    const decodedToken: any = jwt_decode(this.jwtToken);
    const userId: any = decodedToken?.userId;
    let userProfile: any = this.getUserProfile();
    return this.httpClient.post(this.authAPI + "/tokenTTL", {
      userId,
      userProfile,
    });
  }
  /**
   * Created By   : Sambit Kumar Dalai
   * Created On   : 17-05-2022
   * Description  : Logout user,Clear storage and navigate to login page
   **/
  logout() {
    this.spinner.show(); // show spinner
    this.logoutUser(sessionStorage.getItem("access_token")).subscribe({
      next: (res: any) => {
        this.spinner.hide(); // hide spinner
        // clear from storage
        localStorage.clear();
        sessionStorage.clear();
        // end
        this.alertHelper.viewAlert("success", "Logged out", res?.message); // logout message
        // redirect to login page
        this.route.navigateByUrl("/login");
      },
      error: (error: any) => {
        // if error occurs navigate to login page
        this.route.navigateByUrl("/login");
      },
    });
  }
  /**
   * Created By   : Sambit Kumar Dalai
   * Created On   : 17-05-2022
   * Description  : delete access_token and blacklist jwt token
   **/
  logoutUser(access_token: any) {
    return this.httpClient.post(
      this.authAPI + "/logout",
      JSON.stringify({ access_token })
    );
  }

  /* Created By : Deepti Ranjan || Created On : 09-06-2022 || Service method Name : isLoggedIn || Description: to check application is logged in */
  isLoggedIn(): boolean {
    if (
      sessionStorage.getItem("jwtToken")?.length &&
      sessionStorage.getItem("access_token")?.length
    )
      return true;
    else return false;
  }
  /**
   * Created By   : Sambit Kumar Dalai
   * Created On   : 17-05-2022
   * Description  : get logged in user profile details
   **/
  getUserProfile() {
    let userProfile: any = sessionStorage.getItem("userProfile");
    userProfile = JSON.parse(userProfile);
    return userProfile;
  }
  /* Created By : Ayasakanta Swain, Created On: 26-Jul-2022, Description: email temporary password */
  sendPwd(post: any, userType: any): Observable<any> {
    post.userType = userType;
    return this.httpClient.post(
      this.authAPI + "/sendPwd",
      JSON.stringify(post)
    );
  }

  /* Created By : Ayasakanta Swain, Created On: 30-Jul-2022, Description: Reset password */
  resetPassword(post: any, userid: any): Observable<any> {
    post.userId = userid;
    return this.httpClient.post(
      this.authAPI + "/resetPassword",
      JSON.stringify(post)
    );
  }

  
}
