/**
 * Created By  : Deepti Ranjan
 * Created On  : 10-06-2022
 * Module Name : common
 * Description : To manage frontend menu authorization
 **/
import { Injectable } from "@angular/core";
import {
  ActivatedRouteSnapshot,
  CanActivate,
  RouterStateSnapshot,
  UrlTree,
  Router,
} from "@angular/router";
import { Observable } from "rxjs";
import { AuthenticationService } from "../services/authentication.service";

@Injectable({
  providedIn: "root",
})
export class RoleGuard implements CanActivate {
  private userProfile: any;
  private pageURL: any;
  private menus: any;
  private linkArr: any;
  private glLink: any;
  private plLink: any;
  private tbPageName: any;
  private btPageName: any;
  private findGLMenu: any;
  private findPLMenus: any;
  private findTBMenus: any;
  private findBTMenus: any;
  private routData: any;

  constructor(private auth: AuthenticationService, public router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    if (this.auth.isLoggedIn()) {
      this.userProfile = JSON.parse(
        sessionStorage.getItem("userProfile") || "{}"
      );
      const userType: any = this.userProfile.userType;

      if (userType == "admin") {
        return true;
      } else {
        this.menus = JSON.parse(sessionStorage.getItem("userMenus") || "{}");

        this.pageURL = state.url;
        this.linkArr = this.pageURL.split("/");

        this.glLink = this.linkArr[2]; //Global Link
        this.findGLMenu = this.menus.find((item: any) => {
          //Check for Global Link
          return item.gl_path === this.glLink;
        });

        if (this.findGLMenu) {
          // Check for Global Link

          if (this.linkArr[3] != null) {
            this.plLink = this.linkArr[3]; //Primary Link

            this.findPLMenus = this.findGLMenu.pl_links.find((item: any) => {
              //Check if primary Link exists
              return item.pl_path === this.glLink + "/" + this.plLink;
            });

            if (this.findPLMenus) {
              //Check if primary Link exists
              this.routData = route.data;
              if (this.routData.linkType != null) {
                if (this.routData.linkType == "TB") {
                  //Check for Tab
                  this.tbPageName =
                    this.glLink + "/" + this.plLink + "/" + this.linkArr[4];
                  this.findTBMenus = this.findPLMenus.pl_tabs.find(
                    (item: any) => {
                      return item.tb_path === this.tbPageName;
                    }
                  );

                  if (this.findTBMenus != null) {
                    if (
                      this.findTBMenus.tb_privilege != "" &&
                      this.findTBMenus.tb_privilege != "admin" &&
                      this.findTBMenus.tb_privilege != this.routData.role
                    ) {
                      this.auth.logout();
                      return false;
                    }
                    return true;
                  } else {
                    this.auth.logout();
                    return false;
                  }
                }

                if (this.routData.linkType == "BT") {
                  //Check for button
                  this.btPageName =
                    this.glLink + "/" + this.plLink + "/" + this.linkArr[4];
                  this.findBTMenus = this.findPLMenus.pl_buttons.find(
                    (item: any) => {
                      return item.bt_path === this.btPageName;
                    }
                  );

                  if (this.findBTMenus != null) {
                    if (
                      this.findBTMenus.bt_privilege != "" &&
                      this.findBTMenus.bt_privilege != "admin" &&
                      this.findBTMenus.bt_privilege != this.routData.role
                    ) {
                      this.auth.logout();
                      return false;
                    }
                    return true;
                  } else {
                    this.auth.logout();
                    return false;
                  }
                }
              } else {
                if (
                  this.findPLMenus.pl_privilege != "" &&
                  this.findPLMenus.pl_privilege != "admin" &&
                  this.findPLMenus.pl_privilege != this.routData.role
                ) {
                  this.auth.logout();
                  return false;
                }
                return true;
              }
            } else {
              this.auth.logout();
              return false;
            }
          }
          return true;
        } else {
          this.auth.logout();
          return false;
        }
      }
    } else {
      this.auth.logout();
      return false;
    }
  }
}
