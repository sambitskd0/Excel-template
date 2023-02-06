/**
 * Created By  : Sambit Kumar Dalai
 * Created On  : 20-05-2022
 * Description : Authguard to check user authenticated.
 **/
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { AlertHelper } from "../helpers/alert-helper";
import { AuthenticationService } from "../services/authentication.service";

@Injectable({
  providedIn: "root",
})
export class AuthGuardService {
  constructor(
    private auth: AuthenticationService,
    private router: Router,
    private alertHelper: AlertHelper
  ) {}
  canActivate(): boolean {
    if (!this.auth.isAuthenticated()) {
      this.alertHelper
        .viewAlertHtml(
          "error",
          "",
          `<i class="bi bi-arrow-right text-danger"></i> Your session has expired. Please log in. 
        <br>`
        )
        .then(() => {
          this.auth.logout();
        });
      return false;
    }
    return true;
  }
}
