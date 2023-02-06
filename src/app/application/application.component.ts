import {  Component, OnInit } from "@angular/core";
import { NavigationEnd, Router } from "@angular/router";
import { filter } from "rxjs/operators"; 
import { CommonserviceService } from "src/app/core/services/commonservice.service";  
@Component({
  selector: "app-application",
  templateUrl: "./application.component.html",
  styleUrls: ["./application.component.css"],
})
export class ApplicationComponent implements OnInit {
  dashboard = window.location.pathname.includes("dashboard");
  dashboardlanding = window.location.pathname.includes("dashboardlanding");
  pageName: any = "";
  hideSideNav = false;
  menuShow: boolean = false;
  countdown: any;
  lastPing: any;
  constructor(
    public router: Router,
    private commonserviceService: CommonserviceService
  ) {
    this.checkUserLoginStatus(); // check user login status
    this.checkSideNavStatus(); // check side nav status
    this.pageNavigationHandler(); // page navigation
    this.checkSideNavDashboard(); // check side nav for dashboard
  }

  ngOnInit(): void {
  }
  /**
   * Created By   : Sambit Kumar Dalai
   * Created On   : 20-07-2022
   * Description  : Side nav and header visibility handler
   **/

  // 1) check menu status
  toggleSideMenu() {
    this.menuShow = !this.menuShow;
  }
  //2) check side nav status
  checkSideNavStatus() {
    this.commonserviceService.hideNavHeader.subscribe((res: any) => {
      this.hideSideNav = res;
    });
  } //end
  checkSideNavDashboard() {
    this.commonserviceService.hideNav.subscribe((res: any) => {
      this.hideSideNav = res;
    });
  }
  /**
   * Created By   : Sambit Kumar Dalai
   * Created On   : 17-08-2022
   * Description  : if token not present logout user
   **/
  checkUserLoginStatus() {
    // check token present
    if (!sessionStorage.getItem("jwtToken")?.length) {
      this.router.navigateByUrl("/login");
    }
  }
  pageNavigationHandler() {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((res: any) => {
        if (res.url != "/") {
          this.pageName = res.url.split("/").pop();
          this.pageName = this.pageName.split("?").shift();
        } else {
          this.pageName = "/";
        }
      });
  }
}
