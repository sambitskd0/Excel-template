import { Component, OnInit } from "@angular/core";
import { analyze } from "eslint-scope";
import { CommonFunctionHelper } from "src/app/core/helpers/common-function-helper";
import { CommonserviceService } from "src/app/core/services/commonservice.service";

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.css"],
})
export class DashboardComponent implements OnInit {
  menus: any = [];

  constructor(
    private commonserviceService: CommonserviceService,
    private commonFunctionHelper: CommonFunctionHelper
  ) {
    this.commonserviceService.dashboardPageSetup(false);
  }

  ngOnInit(): void {
    this.menus = JSON.parse(sessionStorage.getItem("userMenus") || "[]");
    // this.sendNotification();
  }

  sendNotification() {
    this.commonFunctionHelper.sendNotification({
      contentType: 1, //1=>English , 2=>Hindi
      subject: "Sambit test.",
      notifyContent: "this is content.",
      notifyMode: 1, //1=>portal inbox , 2=>SMS
      sendNotifTo: 12345, //To Whom to send,
      userTye: 2,
    });
  }
}
