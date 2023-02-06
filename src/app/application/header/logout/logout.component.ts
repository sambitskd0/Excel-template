/**
 * Created By  : Sambit Kumar Dalai
 * Created On  : 22-06-2022
 * Description : User logout.
 **/

import { Component, OnInit } from "@angular/core";
import { AuthenticationService } from "src/app/core/services/authentication.service";
import { AlertHelper } from "src/app/core/helpers/alert-helper";
@Component({
  selector: "app-logout",
  templateUrl: "./logout.component.html",
  styleUrls: ["./logout.component.css"],
})
export class LogoutComponent implements OnInit {
  constructor(
    private authenticationService: AuthenticationService,
    private alertHelper: AlertHelper
  ) {}

  ngOnInit(): void {}

  // 1) logout
  logout() {
    this.alertHelper
      .submitAlert(`Are you sure to logout?`, "", "Yes", "No")
      .then((result: any) => {
        if (result.value) {
          this.authenticationService.logout();
        }
      });
  }
}
