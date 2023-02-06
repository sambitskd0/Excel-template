import { Component, ElementRef, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { AlertHelper } from "src/app/core/helpers/alert-helper";
import { CustomValidators } from "src/app/shared/validations/custom-validators";
import { DeviceInfoServicesService } from "../../services/device-info.service";
import { NgxSpinnerService } from "ngx-spinner";
import { CommonserviceService } from "src/app/core/services/commonservice.service";
import { Constant } from "src/app/shared/constants/constant";
import { PrivilegeHelper } from "src/app/core/helpers/privilege-helper";
import { CommonFunctionHelper } from "src/app/core/helpers/common-function-helper";

@Component({
  selector: "app-edit-device-info",
  templateUrl: "./edit-device-info.component.html",
  styleUrls: ["./edit-device-info.component.css"],
})
export class EditDeviceInfoComponent implements OnInit {
  updateDeviceForm!: FormGroup;
  submitted = false;
  id: number = 0;
  categoryData: any;
  districtId: any = "";
  blockId: any = "";
  clusterId: any = "";
  schoolId: any = "";
  teacherId: any = "";
  deviceType: any = "";
  receivedDate: any = "";
  receivedDateStr: any = "";
  uuid_imei: any = "";
  encId: any = "";
  userId: any = "";
  profileId: any = "";
  allErrorMessages: string[] = [];
  filterChanged: boolean = false;
  filterChangedCluster: boolean = false;
  filterChangedSchool: boolean = false;
  filterChangedTeacher: boolean = false;
  allLabel: string[] = [
    "District",
    "Block",
    "Cluster",
    "school",
    "Teacher",
    "Device type",
    "Received date",
    "hi",
    "UUID/IMEI",
  ];
  posts: any;
  allDistrict: any;
  blockData: any = [];
  clusterData: any = [];
  schoolData: any = [];
  teacherData: any = [];
  districtLoading: boolean = false;
  blockLoading: boolean = false;
  clusterLoading: boolean = false;
  schoolLoading: boolean = false;
  plPrivilege: string = "view"; //For menu privilege
  config = new Constant();
  adminPrivilege: boolean = false;
  maxDate: any = Date;

  constructor(
    public customValidators: CustomValidators,
    private formBuilder: FormBuilder,
    public deviceinfoservicesService: DeviceInfoServicesService,
    private privilegeHelper: PrivilegeHelper, //For menu privilege
    private route: Router,
    public commonService: CommonserviceService,
    private router: ActivatedRoute,
    private el: ElementRef,
    private commonFunctionHelper: CommonFunctionHelper,
    private alertHelper: AlertHelper,
    private spinner: NgxSpinnerService
  ) {
    this.maxDate = new Date();
    const pageUrl: any = this.route.url;
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
    this.id = this.router.snapshot.params["encId"];
    const userProfile = this.commonService.getUserProfile();
    this.userId = userProfile?.userId;
    this.profileId = userProfile?.profileId;
    this.districtLoading = true;
    this.commonService.getAllDistrict().subscribe((data: []) => {
      this.posts = data;
      this.allDistrict = this.posts.data;
      this.districtLoading = false;
    });
    this.initializeForm();
    this.el.nativeElement.querySelector("[formControlName=districtId]").focus();
    this.getDeviceInfo(this.id);
  }
  getBlock(id: any) {
    this.filterChanged = true;
    // this.showSpinnerBlock = true;
    this.updateDeviceForm.patchValue({
      blockId: "",
    });
    this.updateDeviceForm.patchValue({
      clusterId: "",
    });
    this.updateDeviceForm.patchValue({
      schoolId: "",
    });
    this.updateDeviceForm.patchValue({
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
      this.updateDeviceForm.patchValue({
        districtId: "",
      });
      this.updateDeviceForm.patchValue({
        blockId: "",
      });
      this.updateDeviceForm.patchValue({
        clusterId: "",
      });
      this.updateDeviceForm.patchValue({
        schoolId: "",
      });
      this.updateDeviceForm.patchValue({
        teacherId: "",
      });
      this.filterChanged = false;
    }
  }
  getCluster(id: any) {
    this.filterChangedCluster = true;
    // this.showSpinnerCluster = true;
    this.updateDeviceForm.patchValue({
      clusterId: "",
    });
    this.updateDeviceForm.patchValue({
      schoolId: "",
    });
    this.updateDeviceForm.patchValue({
      teacherId: "",
    });
    const blockId = id;
    this.clusterData = [];
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
      this.updateDeviceForm.patchValue({
        blockId: "",
      });
      this.updateDeviceForm.patchValue({
        clusterId: "",
      });
      this.updateDeviceForm.patchValue({
        schoolId: "",
      });
      this.updateDeviceForm.patchValue({
        teacherId: "",
      });
      this.filterChangedCluster = false;
    }
  }
  clusterChange(val: any) {
    this.updateDeviceForm.patchValue({
      schoolId: "",
    });
    this.updateDeviceForm.patchValue({
      teacherId: "",
    });
    this.clusterId = val;

    if (this.clusterId !== "") {
      this.getSchool(this.clusterId);
    } else {
      this.updateDeviceForm.patchValue({
        schoolId: "",
      });
      this.updateDeviceForm.patchValue({
        teacherId: "",
      });
    }
  }
  schoolChange(val: any) {
    this.updateDeviceForm.patchValue({
      teacherId: "",
    });
    this.schoolId = val;
    if (this.schoolId !== "") {
      this.getTeacher(this.schoolId);
    } else {
      this.updateDeviceForm.patchValue({
        teacherId: "",
      });
    }
  }
  getSchool(id: number) {
    this.filterChangedSchool = true;
    // this.showSpinnerSchool = true;
    const clusterId = id;
    this.schoolData = [];
    this.schoolLoading = true;
    this.commonService.getSchoolList(clusterId).subscribe((res: any) => {
      this.schoolData = res;
      this.schoolData = this.schoolData.data;
      this.schoolLoading = false;
    });
    this.filterChangedSchool = false;
    // this.showSpinnerSchool = false;
  }
  getTeacher(id: number) {
    this.filterChangedTeacher = true;
    const schoolId = id;
    this.teacherData = [];
    this.commonService
      .getTeacherAccordingToSchool(schoolId)
      .subscribe((res: any) => {
        this.teacherData = res;
        this.teacherData = this.teacherData.data;
      });
    this.filterChangedTeacher = false;
  }

  initializeForm() {
    this.updateDeviceForm = this.formBuilder.group({
      districtId: [this.districtId, Validators.required],
      blockId: [this.blockId, Validators.required],
      clusterId: [this.clusterId, Validators.required],
      schoolId: [this.schoolId, Validators.required],
      teacherId: [this.teacherId, Validators.required],
      deviceType: [this.deviceType, Validators.required],
      receivedDate: [this.receivedDate, [Validators.required]],
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
      encId: [this.encId],
      userId: [this.userId],
      profileId: [this.profileId],
    });
  }
  getDeviceInfo(id: any) {
    this.spinner.show();
    this.deviceinfoservicesService
      .getDeviceInfo(this.id)
      .subscribe((res: any) => {
        this.categoryData = res;
        this.categoryData = this.categoryData.data;
        this.districtId = this.categoryData.districtId;
        this.blockId = this.categoryData.blockId;
        this.clusterId = this.categoryData.clusterId;
        this.schoolId = this.categoryData.schoolId;
        this.teacherId = this.categoryData.teacherId;
        this.deviceType = this.categoryData.deviceType;
        this.receivedDate = new Date(this.categoryData.receivedDate.toString());
        this.uuid_imei = this.categoryData.uuid_imei;
        this.encId = this.categoryData.encId;
        this.getBlock(this.districtId);
        this.getCluster(this.blockId);
        this.getSchool(this.clusterId);
        this.getTeacher(this.schoolId);
        this.initializeForm();
        this.spinner.hide();
      });
  }
  onSubmit() {
    // if ("INVALID" === this.updateDeviceForm.status) {
    //   for (const key of Object.keys(this.updateDeviceForm.controls)) {
    //     if (this.updateDeviceForm.controls[key].status === "INVALID") {
    //       const invalidControl = this.el.nativeElement.querySelector(
    //         '[formControlName="' + key + '"]'
    //       );
    //       invalidControl.focus();
    //       this.customValidators.formValidationHandler(
    //         this.updateDeviceForm,
    //         this.allLabel
    //       );
    //       break;
    //     }
    //   }
    // }

    if (this.updateDeviceForm.invalid) {
      this.customValidators.formValidationHandler(this.updateDeviceForm, this.allLabel, this.el);
    }

    if (this.updateDeviceForm.invalid) {
      return;
    }
    if (this.updateDeviceForm.valid === true) {
      this.alertHelper.updateAlert().then((result) => {
        if (result.value) {
          this.spinner.show();
          let receivedDateVar = this.commonFunctionHelper.formatDateHelper(
            this.updateDeviceForm.get("receivedDate")?.value
          );
          this.updateDeviceForm.patchValue({
            receivedDateStr: receivedDateVar,
          });
          this.deviceinfoservicesService
            .updateDeviceInfo(this.updateDeviceForm.value)
            .subscribe({
              next: (res: any) => {
                this.spinner.hide();
                this.alertHelper
                  .successAlert(
                    "Saved!",
                    "Deviceinformation updated successfully",
                    "success"
                  )
                  .then(() => {
                    this.initializeForm();
                    this.route.navigate(["../../viewDeviceInfo"], {
                      relativeTo: this.router,
                    });
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
  onCancel() {
    this.route.navigate(["../../viewDeviceInfo"], {
      relativeTo: this.router,
    });
  }
}
