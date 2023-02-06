import { Component, ElementRef, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { AlertHelper } from "src/app/core/helpers/alert-helper";
import { CustomValidators } from "src/app/shared/validations/custom-validators";
import { DeviceInfoServicesService } from "../../services/device-info.service";
import { NgxSpinnerService } from "ngx-spinner";
import { CommonserviceService } from "src/app/core/services/commonservice.service";
import { Constant } from "src/app/shared/constants/constant";
import { PrivilegeHelper } from "src/app/core/helpers/privilege-helper";
import { Router } from "@angular/router";
import { CommonFunctionHelper } from "src/app/core/helpers/common-function-helper";

@Component({
  selector: "app-add-device-info",
  templateUrl: "./add-device-info.component.html",
  styleUrls: ["./add-device-info.component.css"],
})
export class AddDeviceInfoComponent implements OnInit {
  DeviceForm!: FormGroup;
  submitted = false;
  posts: any;
  allDistrict: any;
  blockData: any = [];
  clusterData: any = [];
  schoolData: any = [];
  teacherData: any = [];
  allErrorMessages: string[] = [];
  filterChanged: boolean = false;
  filterChangedCluster: boolean = false;
  filterChangedSchool: boolean = false;
  filterChangedTeacher: boolean = false;
  districtId: any = "";
  blockId: any = "";
  clusterId: any = "";
  schoolId: any = "";
  teacherId: any = "";
  deviceType: any = "";
  receivedDate: any = "";
  receivedDateStr: any = "";
  uuid_imei: any = "";
  userId: any = "";
  profileId: any = "";
  districtLoading: boolean = false;
  blockLoading: boolean = false;
  clusterLoading: boolean = false;
  schoolLoading: boolean = false;
  plPrivilege: string = "view"; //For menu privilege
  config = new Constant();
  adminPrivilege: boolean = false;
  maxDate: any = Date;
  allLabel: string[] = [
    "District",
    "Block",
    "Cluster",
    "School",
    "Teacher",
    "Device type",
    "Received date",
    "",
    "",
    "UUID/IMEI",
  ];
  constructor(
    private formBuilder: FormBuilder,
    public commonService: CommonserviceService,
    private deviceInfoServicesService: DeviceInfoServicesService,
    private privilegeHelper: PrivilegeHelper, //For menu privilege
    private router: Router,
    private alertHelper: AlertHelper,
    public customValidators: CustomValidators,
    private spinner: NgxSpinnerService,
    private el: ElementRef,
    private commonFunctionHelper: CommonFunctionHelper
  ) {
    this.maxDate = new Date();
    const pageUrl: any = this.router.url;
    this.plPrivilege = this.privilegeHelper.PrimaryLinkPrivilege(pageUrl); //For menu privilege
    this.commonService.verifyLinkPermission(
      pageUrl,
      this.config.linkType[2],
      this.config.privilege[4]
    ); // For authorization
  }

  ngOnInit(): void {
    if (this.plPrivilege == "admin") {
      this.adminPrivilege = true;
    }
    const userProfile = this.commonService.getUserProfile();
    this.userId = userProfile?.userId;
    this.profileId = userProfile?.profileId;
    this.el.nativeElement.querySelector("[formControlName=districtId]").focus();
    this.districtLoading = true;
    this.commonService.getAllDistrict().subscribe((data: []) => {
      this.posts = data;
      this.allDistrict = this.posts.data;
      this.districtLoading = false;
    });
    this.initializeForm();
  }
  initializeForm() {
    this.DeviceForm = this.formBuilder.group({
      districtId: [this.districtId, Validators.required],
      blockId: [this.blockId, Validators.required],
      clusterId: [this.clusterId, Validators.required],
      schoolId: [this.schoolId, Validators.required],
      teacherId: [this.teacherId, Validators.required],
      deviceType: [this.deviceType, Validators.required],
      receivedDate: [this.receivedDate, Validators.required],
      receivedDateStr: [this.receivedDateStr],
      uuid_imei: [
        this.uuid_imei,
        [
          Validators.required,
          Validators.maxLength(30),
          Validators.min(1),
          Validators.minLength(1),
        ],
      ],
      userId: [this.userId],
      profileId: [this.profileId],
    });
  }
  onSubmit() {
    // if ("INVALID" === this.DeviceForm.status) {
    //   for (const key of Object.keys(this.DeviceForm.controls)) {
    //     if (this.DeviceForm.controls[key].status === "INVALID") {
    //       const invalidControl = this.el.nativeElement.querySelector(
    //         '[formControlName="' + key + '"]'
    //       );
    //       invalidControl.focus();
    //       this.customValidators.formValidationHandler(
    //         this.DeviceForm,
    //         this.allLabel
    //       );
    //       break;
    //     }
    //   }
    // }

    if (this.DeviceForm.invalid) {
      this.customValidators.formValidationHandler(this.DeviceForm, this.allLabel, this.el);
    }

    if (this.DeviceForm.invalid) {
      return;
    }
    if (this.DeviceForm.valid === true) {
      this.alertHelper.submitAlert().then((result: any) => {
        if (result.value) {
          this.spinner.show();
          let receivedDateVar = this.commonFunctionHelper.formatDateHelper(
            this.DeviceForm.get("receivedDate")?.value
          );
          this.DeviceForm.patchValue({
            receivedDateStr: receivedDateVar,
          });
          this.deviceInfoServicesService
            .createdevice(this.DeviceForm.value)
            .subscribe({
              next: (res: any) => {
                this.spinner.hide();
                this.alertHelper
                  .successAlert(
                    "Saved!",
                    "Device information created successfully",
                    "success"
                  )
                  .then(() => {
                    this.initializeForm();
                    this.resetForm();
                  });
              },
              error: (error: any) => {
                this.spinner.hide();
              },
            });
        }
      });
    }
  }
  resetForm(){
    this.blockData = [];
    this.clusterData = [];
    this.schoolData = [];
    this.teacherData = [];
    this.DeviceForm.patchValue({
      districtId: "",
    });
    this.DeviceForm.patchValue({
      blockId: "",
    });
    this.DeviceForm.patchValue({
      clusterId: "",
    });
    this.DeviceForm.patchValue({
      schoolId: "",
    });
    this.DeviceForm.patchValue({
      teacherId: "",
    });
    this.DeviceForm.patchValue({
      deviceType: "",
    });
    this.DeviceForm.patchValue({
      receivedDate: "",
    });
    this.DeviceForm.patchValue({
      uuid_imei: "",
    });
  }
  getBlock(id: any) {
    this.filterChanged = true;
    this.DeviceForm.patchValue({
      blockId: "",
    });
    this.DeviceForm.patchValue({
      clusterId: "",
    });
    this.DeviceForm.patchValue({
      schoolId: "",
    });
    this.DeviceForm.patchValue({
      teacherId: "",
    });
    const districtId = id;
    this.blockData = [];
    this.clusterData = [];
    this.schoolData = [];
    this.teacherData = [];
    this.blockLoading = true;
    if (districtId !== "") {
      this.commonService
        .getBlockByDistrictid(districtId)
        .subscribe((res: any) => {
          let data: any = res;
          for (let key of Object.keys(data["data"])) {
            this.blockData.push(data["data"][key]);
          }
          // this.showSpinnerBlock = false;
          this.filterChanged = false;
          this.blockLoading = false;
        });
    } else {
      this.DeviceForm.patchValue({
        districtId: "",
      });
      this.DeviceForm.patchValue({
        blockId: "",
      });
      this.DeviceForm.patchValue({
        clusterId: "",
      });
      this.DeviceForm.patchValue({
        schoolId: "",
      });
      this.DeviceForm.patchValue({
        teacherId: "",
      });
      this.filterChanged = false;
    }
  }
  getCluster(id: any) {
    this.filterChangedCluster = true;
    // this.showSpinnerCluster = true;
    this.DeviceForm.patchValue({
      clusterId: "",
    });
    this.DeviceForm.patchValue({
      schoolId: "",
    });
    this.DeviceForm.patchValue({
      teacherId: "",
    });
    const blockId = id;
    this.clusterData = [];
    this.schoolData = [];
    this.clusterLoading = true;
    if (blockId !== "") {
      this.commonService.getClusterByBlockId(blockId).subscribe((res: any) => {
        let data: any = res;
        for (let key of Object.keys(data["data"])) {
          this.clusterData.push(data["data"][key]);
        }
        // this.showSpinnerCluster = false;
        this.filterChangedCluster = false;
        this.clusterLoading = false;
      });
    } else {
      this.DeviceForm.patchValue({
        blockId: "",
      });
      this.DeviceForm.patchValue({
        clusterId: "",
      });
      this.DeviceForm.patchValue({
        schoolId: "",
      });
      this.DeviceForm.patchValue({
        teacherId: "",
      });
      this.filterChangedCluster = false;
    }
  }
  clusterChange(val: any) {
    this.DeviceForm.patchValue({
      schoolId: "",
    });
    this.DeviceForm.patchValue({
      teacherId: "",
    });
    this.clusterId = val;

    if (this.clusterId !== "") {
      this.getSchool(this.clusterId);
    } else {
      this.DeviceForm.patchValue({
        schoolId: "",
      });
      this.DeviceForm.patchValue({
        teacherId: "",
      });
    }
  }
  schoolChange(val: any) {
    this.DeviceForm.patchValue({
      teacherId: "",
    });
    this.schoolId = val;

    if (this.schoolId !== "") {
      this.getTeacher(this.schoolId);
    } else {
      this.DeviceForm.patchValue({
        teacherId: "",
      });
    }
  }
  getSchool(id: number) {
    this.filterChangedSchool = true;
    const clusterId = id;
    this.schoolData = [];
    this.schoolLoading = true;
    this.commonService.getSchoolList(clusterId).subscribe((res: any) => {
      this.schoolData = res;
      this.schoolData = this.schoolData.data;
      this.schoolLoading = false;
    });
    this.filterChangedSchool = false;
  }
  getTeacher(id: any) {
    this.filterChangedTeacher = true;
    const schoolId = id;
    this.teacherData = [];
    this.commonService
      .getTeacherAccordingToSchool(schoolId)
      .subscribe((res: any) => {
        this.teacherData = res;
        this.teacherData = this.teacherData?.data;
      });
    this.filterChangedTeacher = false;
  }
}
