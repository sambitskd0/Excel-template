/**
 * Created By  : Sambit Kumar Dalai
 * Created On  : 05-06-2022
 * Description : Common headers for teacher info.
 **/

import { Component, Input, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { RegistrationService } from "../../services/registration.service";

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.css"],
})
export class HeaderComponent implements OnInit {
  @Input() registrationInfoRoute: any = "";
  @Input() educationalInfoRoute: any = "";
  @Input() professionalInfoRoute: any = "";
  @Input() otherInfoRoute: any = "";
  @Input() trainingAndLanguageInfoRoute: any = "";

  draftStatus: boolean = false;
  trainingAndLanguageInfoRouteActive: string = "";
  teacherId!: any;
  teacherName: string = "";
  teacherTitle: string = "";
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private registrationService: RegistrationService
  ) {
    this.teacherId = this.activatedRoute.snapshot.paramMap?.get("id");
  }

  ngOnInit(): void {
    this.setTeacherInfo();
    if (this.trainingAndLanguageInfoRoute == "./") {
      this.trainingAndLanguageInfoRouteActive = "active";
    }
  }

  disableNavHelper(draftStatus: boolean) {
    this.draftStatus = draftStatus;
  }
  setTeacherInfo() {
    // 1) if not present in local storage
    if (!localStorage.getItem("teacherDetails")) {
      this.getTeacherInfo();
    } else {
      // else get from local storage
      let teacherDetails: any = localStorage.getItem("teacherDetails");
      teacherDetails = JSON.parse(teacherDetails);
      this.teacherName = teacherDetails?.teacherName;
      this.teacherTitle = teacherDetails?.teacherTitle;
    }
  }
  getTeacherInfo() {
    this.registrationService.teacherDetailsChanged.subscribe((res: any) => {
      this.teacherName = res?.teacherName;
      this.teacherTitle = res?.teacherTitle;
    });
  }
}
