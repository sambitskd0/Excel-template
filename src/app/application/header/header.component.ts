/**
 * Created By  : Sambit Kumar Dalai
 * Created On  : 13-05-2022
 * Description : Header component for managing header items.
 **/

import {
  Component,
  OnInit,
  EventEmitter,
  Output,
  Renderer2,
  ViewChild,
  ElementRef,
} from "@angular/core";
import { NavigationEnd, Router } from "@angular/router";
import { filter } from "rxjs/operators";
import { AuthenticationService } from "src/app/core/services/authentication.service";
import { interval, Observable, Subject } from "rxjs";
import { CommonserviceService } from "src/app/core/services/commonservice.service";
import { isDevMode } from "@angular/core";
import { environment } from "src/environments/environment";
@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.css"],
})
export class HeaderComponent implements OnInit {
  @ViewChild("settingRef") settingRef!: ElementRef;
  @ViewChild("nofifyRef") nofifyRef!: ElementRef;

  pageName: any = "";
  intervalSubscription: any;
  oauthClientDetails: any = "";
  loggedInUserDetails!: any;
  isHidden = false;
  showAdminConsole = false;
  adminConsoleUrl!: string;
  notifications: any = [];
  unreadNotification: Number = 0;
  headerNotificationsSubject!: any;
  public userdetails = JSON.parse(
    sessionStorage.getItem("userProfile") || "{}"
  );
  loginUserType = this.userdetails.loginUserTypeId;
  userDesignation = this.userdetails.designationId;

  constructor(
    public router: Router,
    private authenticationService: AuthenticationService,
    private commonserviceService: CommonserviceService,
    private renderer: Renderer2
  ) {
    this.notificationCountObservable();
    this.checkHeaderStatus();
    router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((res: any) => {
        if (res.url != "/") {
          this.pageName = res.url.split("/").pop();
          this.pageName = this.pageName.split("?").shift();
        } else {
          this.pageName = "/";
        }
      });
    this.renderer.listen("window", "click", (event: Event) => {
      if (event.target !== this.settingRef.nativeElement) {
        this.opensetting = false;
      } else {
        this.opensetting = this.opensetting ? false : true;
      }
    });
  }
  ngAfterViewInit(): void {
    this.renderer.listen("window", "click", (event: Event) => {
      if (event.target !== this.nofifyRef.nativeElement) {
        this.showone = false;
        this.renderer.addClass(this.nofifyRef.nativeElement, "bi-bell");
        this.renderer.removeClass(this.nofifyRef.nativeElement, "bi-x-lg");
      } else {
        this.showone = this.showone ? true : false;
        // if( this.showone==true){
        //   this.renderer.removeClass(this.nofifyRef.nativeElement,'bi-x-lg');
        //   this.renderer.addClass(this.nofifyRef.nativeElement,'bi-bell');
        // }
      }
    });
  }

  ngOnInit(): void {
    this.loggedInUserDetails = this.authenticationService.getUserProfile();
    this.getHeaderNotifications();
    this.navHandler();
  }

  //notification toggle menu
  public showone: boolean = false;
  public showtwo: boolean = true;
  public showthree: boolean = false;
  public opensetting: boolean = false;
  notificationtoggle() {
    this.showone = !this.showone;

    if (this.showone == true) {
      this.renderer.removeClass(this.nofifyRef.nativeElement, "bi-bell");
      this.renderer.addClass(this.nofifyRef.nativeElement, "bi-x-lg");
    }
    if (this.showone == false) {
      this.renderer.removeClass(this.nofifyRef.nativeElement, "bi-x-lg");
      this.renderer.addClass(this.nofifyRef.nativeElement, "bi-bell");
    }
    // if (this.showone) {
    //   this.showtwo = false;
    //   this.showthree = true;
    // } else {
    //   this.showtwo = true;
    //   this.showthree = false;
    // }
  }
  settingtoggle() {
    this.opensetting = !this.opensetting;
  }
  //sidervar toggle menu
  @Output() toggleEvent = new EventEmitter();
  menuToggler() {
    this.toggleEvent.emit();
  }

  startRefreshInterval(allData: any) {
    if (sessionStorage.getItem("expires_in")) {
      const expiresIn: any = sessionStorage.getItem("expires_in");

      this.intervalSubscription = interval(expiresIn * 1000).subscribe((x) => {
        this.refreshToken(allData);
      });
    }
  }
  refreshToken(allData: any) {
    if (
      sessionStorage.getItem("jwtToken")?.length &&
      sessionStorage.getItem("access_token")?.length
    ) {
      this.authenticationService.increaseTokenExpiration().subscribe({
        next: (res: any) => {
          sessionStorage.setItem("jwtToken", res.token);
          const getOauthDetailsObserver = new Observable((subscriber) => {
            subscriber.next(this.refreshOauthToken(allData));
          });
          getOauthDetailsObserver.subscribe({
            next: (res: any) => {},
          });
        },
      });
    } else {
      this.intervalSubscription.unsubscribe();
    }
  }
  refreshOauthToken(allData: any) {
    allData.refresh_token = sessionStorage.getItem("refresh_token");
    this.authenticationService.refreshToken(allData).subscribe({
      next: (res: any) => {
        sessionStorage.setItem("access_token", res.access_token);
        sessionStorage.setItem("refresh_token", res.refresh_token);
        sessionStorage.setItem("expires_in", res.expires_in);
      },
      error: (error: any) => {},
    });
  }
  checkHeaderStatus() {
    // check if side nav status
    this.commonserviceService.hideNavHeader.subscribe((res: any) => {
      this.isHidden = res;
    });
  }

  getHeaderNotifications() {
    this.commonserviceService.getHeaderNotifications().subscribe({
      next: (res: any) => {
        this.notifications = res.data;
        // trigger event to update notification count
        this.commonserviceService.notificationCountObservable.next(
          res.unreadRecords
        );
      },
      error: (error: any) => {
        // this.spinner.hide();
      },
    });
  }

  goToNotification() {
    this.commonserviceService.navNotification();
  }

  navHandler() {
    // show admin conosle only in supAdmin login
    if (this.loggedInUserDetails.loginId === "supAdmin") {
      this.showAdminConsole = true;
      // ====== admin console url setup
      if (isDevMode() === false) {
        // 1) Live
        if (environment.BASEURL?.includes("eshikshakosh.bihar.gov.in")) {
          this.adminConsoleUrl = environment.BASEURL?.replace(
            "eshikshakosh.bihar.gov.in",
            "apieshikshakosh.bihar.gov.in"
          )?.replace("/eshikshakosh", "/esk-admin-console");
        } else {
          // 2) Staging
          this.adminConsoleUrl =
            environment.BASEURL?.replace("/eshikshakosh", "") +
            "/esk-admin-console/";
        }
      } else {
        // 3) local
        this.adminConsoleUrl =
          environment.BASEURL.slice(0, 21) +
          ":7001/eshiksha/esk-admin-console/";
      }
    } else {
      // for rest of the user hide admin console
      this.showAdminConsole = false;
    }
  }

  /**
   * Created By  : Sambit Kumar Dalai
   * Created On  : 13-01-2023
   * Description : Notification count observable
   **/
  notificationCountObservable() {
    this.headerNotificationsSubject =
      this.commonserviceService.notificationCountObservable?.subscribe({
        next: (response: any) => {
          this.unreadNotification = response; // update notifcation count
          this.notificationCount(); // update notification count
        },
      });
  }
  /**
   * Created By  : Sambit Kumar Dalai
   * Created On  : 13-01-2023
   * Description : Get notification count
   **/
  notificationCount() {
    return this.unreadNotification;
  }
  /**
   * Created By  : Sambit Kumar Dalai
   * Created On  : 13-01-2023
   * Description : Get notification content status
   **/
  get getNotificationContentStatus() {
    return this.unreadNotification ? true : false;
  }

  ngOnDestroy() {
    this.headerNotificationsSubject.unsubscribe();
  }
}
