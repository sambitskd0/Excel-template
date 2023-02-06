/**
 * Created By  : Sambit Kumar Dalai
 * Created On  : 01-01-2023
 * Module Name :Teacher
 * Description : Tab route handler component
 **/

import { Component, OnInit } from "@angular/core";
import { PrivilegeHelper } from "src/app/core/helpers/privilege-helper";
import { ActivatedRoute, Router } from "@angular/router";
import { Constant } from "src/app/shared/constants/constant";
import { CommonserviceService } from "src/app/core/services/commonservice.service";

@Component({
  selector: "app-promotion",
  templateUrl: "./promotion.component.html",
  styleUrls: ["./promotion.component.css"],
})
export class PromotionComponent implements OnInit {
  //=========== member declaration
  plPrivilege: string = "view"; //For menu privilege
  tabs: any = []; //For shwoing tabs
  config = new Constant();
  adminPrivilege: boolean = false;
  constructor(
    private privilegeHelper: PrivilegeHelper, //For menu privilege,
    private router: Router,
    private commonService: CommonserviceService,
    private route: ActivatedRoute
  ) {
    const pageUrl: any = this.router.url;
    this.plPrivilege = this.privilegeHelper.PrimaryLinkPrivilege(pageUrl); //For menu privilege
    this.commonService.verifyLinkPermission(
      pageUrl,
      this.config.linkType[2],
      this.config.privilege[1]
    ); // For authorization
    this.tabs = this.privilegeHelper.PrimaryLinkTabNames(pageUrl); //For shwoing tabs
  }

  ngOnInit(): void {
    switch (this.tabs[0]) {
      case "Promotion List Generation":
        this.router.navigate([`./generate/view`], {
          relativeTo: this.route,
        });
        break;
      case "Approve Promotion List":
        this.router.navigate([`./approve/view`], {
          relativeTo: this.route,
        });
        break;
      case "School View":
        this.router.navigate([`./schoolView`], {
          relativeTo: this.route,
        });
        break;
      default:
        break;
    }
  }
}
