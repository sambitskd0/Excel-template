/**
 * Created By  : Sambit Kumar Dalai
 * Created On  : 13-06-2022
 * Description : Common functions.
 **/

import { Injectable } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
// import { NgbDateStruct } from "@ng-bootstrap/ng-bootstrap";
import { AlertHelper } from "src/app/core/helpers/alert-helper";
import { CommonserviceService } from "src/app/core/services/commonservice.service";
import { NgxSpinnerService } from "ngx-spinner";

@Injectable({
  providedIn: "root",
})
export class CommonFunctionHelper {
  readonly DELIMITER = "-";
  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private alertHelper: AlertHelper,
    private commonService: CommonserviceService,
    private spinner: NgxSpinnerService
  ) {}

  /**
   * Created By  : Sambit Kumar Dalai
   * Created On  : 13-06-2022
   * Description : Show warning message while going to next page.
   **/
  pageChangeWarningHandler(
    path: string,
    id: string | null,
    ralativeRouter: any
  ) {
    this.alertHelper.pageChangeWarningAlert().then((result: any) => {
      if (result.isConfirmed === true) {
        this.router.navigate([path, id], {
          relativeTo: ralativeRouter,
        });
      }
    });
  }

  // method to get annextures data by types :: swagatika ::
  getAnnextureData(anxTypes: any = []) {
    let annextureData!: [];
    this.commonService.getCommonAnnexture(anxTypes).subscribe({
      next: (res: any) => {
        annextureData = res?.data;
      },
    });

    return annextureData;
  }

  /**
   * Created By  : Sambit Kumar Dalai
   * Created On  : 13-06-2022
   * Description : format date object to "yyyy-m-d".
   **/
  formatDateHelper(date: Date): string {
    return (
      date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate()
    );
  }
  /**
   * Created By  : Sambit Kumar Dalai
   * Created On  : 24-03-2023
   * Description : format date object to "yyyy-m-d" and deal with one day before issue.
   **/
  formatDateHelperExcel(date: Date): string {
    return (
      date?.getFullYear() + "-" + (date.getMonth() + 1) + "-" + (date.getDate() + 1)
    );
  }
  // dateFormatHelper(date: NgbDateStruct | null): string | null {
  //   // return date ? date.day + this.DELIMITER + date.month + this.DELIMITER + date.year : null;
  //   return date
  //     ? date.year + this.DELIMITER + date.month + this.DELIMITER + date.day
  //     : null;
  // }

  // get current academic year
  currentAcademicYear(
    year = new Date().getFullYear(),
    month = new Date().getMonth()
  ) {
    if (month > 3) {
      return `${year}-${String(year + 1).slice(-2)}`;
    } else {
      return `${year - 1}-${String(year).slice(-2)}`;
    }
  }

  /**
   * Created By  : Sambit Kumar Dalai
   * Created On  : 08-12-2022
   * Description : Send notification
   **/
  sendNotification(notificationObj: Object) {
    this.commonService.sendNotification(notificationObj).subscribe({
      next: (res: any) => {
        this.spinner.hide();
        return res;
      },
      error: (error: any) => {
        this.spinner.hide();
      },
    });
  }
}
