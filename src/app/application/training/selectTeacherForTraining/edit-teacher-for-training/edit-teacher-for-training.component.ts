import {
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit,
  ElementRef,
  Input,
} from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { CommonserviceService } from "src/app/core/services/commonservice.service";

import { NgxSpinnerService } from "ngx-spinner";
//import { DataTableDirective } from "angular-datatables";
import { Subject } from "rxjs";
import { AlertHelper } from "src/app/core/helpers/alert-helper";
import { RegistrationService } from "src/app/application/teacher/services/registration.service";
import { ActivatedRoute, Router } from "@angular/router";

import { Constant } from "src/app/shared/constants/constant";
import { TeacherForTrainingService } from "../../services/teacher-for-training.service";
import { IDropdownSettings } from "ng-multiselect-dropdown";
import { CustomValidators } from "src/app/shared/validations/custom-validators";
import { IndustrialTrainingService } from "src/app/application/teacher/services/industrial-training.service";
import { SelfTrainingRequestService } from "../../services/self-training-request.service";

declare var $: any;

@Component({
  selector: "app-edit-teacher-for-training",
  templateUrl: "./edit-teacher-for-training.component.html",
  styleUrls: ["./edit-teacher-for-training.component.css"],
})
export class EditTeacherForTrainingComponent implements OnInit {
  dropdownSettings: IDropdownSettings = {};
  dropdownSettings1: IDropdownSettings = {};
  dropdownList: any = [];
  SelectTeacherForTraining!: FormGroup;
  public show: boolean = true;
  public buttonName: any = "Show";
  config = new Constant();
  academicYear: any = this.config.getAcademicCurrentYear();
  preAndPastYear:any = [];
  displayTable: boolean = false;
  questSearchform!: FormGroup;
  SearchformId!: FormGroup;
  isLoading = false;
  isNorecordFound: boolean = false;
  tattenlength: boolean = false;
  pageIndex: any = 0;
  previousSize: any = 0;

  resultListData: any = [];
  resultListDatas: any = [];
  questionDetailsData!: any;

  scDisrtictChanged: boolean = false;
  districtData: any;
  userProfile = this.commonService.getUserProfile();
  userType = this.userProfile.userType;
  userLevel = this.userProfile.userLevel;
  userId = this.userProfile.userId;
  sessionDistrictId: any =
    this.userProfile.district != 0 ? this.userProfile.district : "";
  sessionBlockId: any =
    this.userProfile.block != 0 ? this.userProfile.block : "";
  sessionClusterId: any =
    this.userProfile.cluster != 0 ? this.userProfile.cluster : "";
  sessionSchoolId: any =
    this.userProfile.school != 0 ? this.userProfile.school : "";
  scBlockChanged: boolean = false;
  blockData: any = [];
  scClusterChanged: boolean = false;
  desgNameChanged: boolean = false;
  scDesgChanged: boolean = false;
  clusterData: any;
  scSchoolChanged: boolean = false;
  teacherTypeChanged: boolean = false;
  getSchoolData: any;
  getTeacherData: any;
  inspectionListData: any;
  emptyCheck: boolean = false;
  isInitAdmin: boolean = false;
  tev: boolean = false;
  scDistrictId: any = "";
  scBlockId: any = "";
  scClusterId: any = "";
  schoolId: any = "";
  teacherList: any = [];
  //teacherList: any = "";
  schoolUdiseCode: any = "";
  desList: any = "";
  datas: any;
  tatten: any;
  absentTeacherList: any;
  studentAttendence: any;
  questionList: any;
  answerList: any;
  datasd: any;
  startDate: any;
  desgName: any;
  endDate: any;
  maxDate: any = Date;
  numOfVisetedSchool: any;
  numOfVisit: any;
  openPer: any;
  label: any;
  res: any;
  training: any;
  showSpinnerBlock: boolean = false;
  appointType: boolean = false;
  appointmentType: any = "";
  teacherLists: any = [];
  post: any;
  id: any;
  trainingSubject: any;
  teacherTraningid: any;
  traineeType: any;
  allErrorMessages: string[] = [];
  allLabel: string[] = [
    "",
    "",
    "Training Subject",
    "Training Name",
    "Training Level",
    "",
    "Trainee Type",
    "District",

    "Trainee List",
  ];
  data: any;
  selectedItems: any = [];
  teacherType: any;
  trainingLevel: any;
  encId: any;
  submitted = false;
  teacherListss: any = [];
  teachersAttenedTraining: any;
  result: any = [];
  officersList: any = [];
  trainingId: any;
  trainingNameLoad: boolean = false;
  loadingObj: any = {
    traiingLoading: false,
    subjectLoad: false,
    districtLoad: false,
    blockLoad: false,
    traineeTypeLoad: false,
  };
  trainingLevelType: any;
  teacherListId: any;
  officerList: any;
  trainingLevelTypes: any;
  anxtName: any;
  anxtValue: any;

  constructor(
    private formBuilder: FormBuilder,
    private route: Router,
    private router: ActivatedRoute,
    private alertHelper: AlertHelper,
    private registrationService: RegistrationService,
    private spinner: NgxSpinnerService,
    private el: ElementRef,
    private commonService: CommonserviceService,
    private trainingTypeServices: TeacherForTrainingService,
    public customValidators: CustomValidators,
    private industrialTraining: IndustrialTrainingService,
    private trainingServices: SelfTrainingRequestService
  ) {}

  ngOnInit(): void {
    this.getPresentAndPastAcademicYear();
    $(".dvOffice").hide();
    $(function () {
      $("#officerList").CreateMultiCheckBox({
        width: "100%",
        defaultText: "Select Below",
        height: "250px",
      });

      $("#selTrainerType").click(function () {
        var selTrainerType = $("#selTrainerType").val();
        if (selTrainerType == 1) {
          $(".dvTeacher").show();
          $(".dvOffice").hide();
        } else if (selTrainerType == 2) {
          $(".dvOffice").show();
          $(".dvTeacher").hide();
        }
      });
    });

    //this.getTeacherList({});
    this.getDistrict();
    this.getAppointType();
    this.getSubjectList();
    this.dropdownSettings = {
      idField: "tId",
      textField: "teacherName",
      enableCheckAll: true,
      selectAllText: "Select All Teacher",
      unSelectAllText: "UnSelect All Teacher",
      noDataAvailablePlaceholderText: "No data available",
      allowSearchFilter: true,
      itemsShowLimit: 3,
      singleSelection: false,
    };

    this.dropdownSettings1 = {
      idField: "intProfileId",
      textField: "vchfullName",
      enableCheckAll: true,
      selectAllText: "Select All Officers",
      unSelectAllText: "UnSelect All Officers",
      noDataAvailablePlaceholderText: "No data available",
      allowSearchFilter: true,
      itemsShowLimit: 3,
    };
    this.initializeForm();
    this.id = this.router.snapshot.params["encId"];

    this.editViewTraining(this.id);
    //this.getDetails();
    //this.getofficersDetails();
    this.getTrainingLevel();
  }

  getPresentAndPastAcademicYear(){
    var splitted = this.academicYear.split("-", 2);
    var y1 = splitted[0] - 1;
    var y2 = splitted[1] - 1;
    var y3 = y1+"-"+y2;
    const spilit = this.academicYear+","+y3;
    this.preAndPastYear = spilit.split(",");
  }

  getSubjectList() {
    this.trainingId = "";
    this.trainingSubject = "";
    this.loadingObj.subjectLoad = true;
    this.trainingServices.getSubject().subscribe((data: any) => {
      this.res = data.data;
      this.loadingObj.subjectLoad = false;
    });
  }

  getTrainingLevel() {
    this.trainingServices.getTrainingLevl().subscribe((data: any) => {
      this.trainingLevelTypes = data.data;
      if(this.userProfile.userLevel == 1){
        this.trainingLevelTypes.forEach((val: any, key: any) => {
          if ((this.userProfile.userLevel + 2 ) == val.anxtValue) {
           this.anxtName = val.anxtName;
           this.anxtValue = val.anxtValue;
         }
         
         this.loadingObj.trainingLevel = false;
       });
       this.SelectTeacherForTraining.controls["trainingLevel"].patchValue(this.userProfile.userLevel + 2);
      }else{
        this.trainingLevelTypes.forEach((val: any, key: any) => {
          if ((this.userProfile.userLevel + 1 ) == val.anxtValue) {
           this.anxtName = val.anxtName;
           this.anxtValue = val.anxtValue;
         }
         
         this.loadingObj.trainingLevel = false;
       });
      }
    });
  }

  getTrainingName(id: any) {
    this.SelectTeacherForTraining.get("trainingId")?.patchValue("");
    this.loadingObj.traiingLoading = true;
    this.trainingServices.getTrainingDetails(id).subscribe((data: any) => {
      if (data == null) {
        this.training = [];
        this.spinner.hide();
        this.loadingObj.traiingLoading = false;
      } else {
        this.training = data.data;
        this.spinner.hide();
        this.loadingObj.traiingLoading = false;
      }
    });
  }

  getofficersDetails() {
    this.spinner.show();
    this.trainingTypeServices.getofficersDetails(this.userProfile).subscribe({
      next: (res: any) => {
        this.officersList = res.data;
        this.spinner.hide();
      },
    });
  }
  getDetails() {
    this.spinner.show();
    this.trainingTypeServices.getDetails(this.userProfile).subscribe({
      next: (res: any) => {
        this.teacherList = res.data;
        this.spinner.hide();
      },
    });
  }

  initializeForm() {
    this.SelectTeacherForTraining = this.formBuilder.group({
      encId: [this.id],
      academicYear: [this.academicYear, [Validators.required]],
      trainingSubject: [this.trainingSubject, [Validators.required]],
      trainingId: [this.trainingId, [Validators.required]],
      trainingLevel: [this.trainingLevel, [Validators.required]],
      scDistrictId: [this.scDistrictId, [Validators.required]],
      traineeType: [this.traineeType, [Validators.required]],
      scBlockId: [this.scBlockId],
      scClusterId: [this.scClusterId],
      schoolId: [this.schoolId],
      teacherType: [this.teacherType],
      teacherLists: [this.selectedItems],
      officerList: [this.selectedItems],
      updatedBy: [this.userProfile.userId],
    });
  }

  checkValid(e: any) {
    this.SelectTeacherForTraining.get("traineeType")?.patchValue("");
    if (this.userProfile.userLevel == 5) {
      this.SelectTeacherForTraining.get("scDistrictId")?.patchValue("");
      this.SelectTeacherForTraining.get("scBlockId")?.patchValue("");
      this.SelectTeacherForTraining.get("scClusterId")?.patchValue("");
      this.SelectTeacherForTraining.get("schoolId")?.patchValue("");
      //this.SelectTeacherForTraining.get("teacherType")?.patchValue("");
      this.selectedItems = [];
      this.SelectTeacherForTraining.get("teacherLists")?.patchValue("");
      this.SelectTeacherForTraining.get("officerList")?.patchValue("");
    } else if (this.userProfile.userLevel == 4) {
      this.SelectTeacherForTraining.get("scBlockId")?.patchValue("");
      this.SelectTeacherForTraining.get("scClusterId")?.patchValue("");
      this.SelectTeacherForTraining.get("schoolId")?.patchValue("");
      //this.SelectTeacherForTraining.get("teacherType")?.patchValue("");
      this.SelectTeacherForTraining.get("teacherLists")?.patchValue("");
      this.SelectTeacherForTraining.get("officerList")?.patchValue("");
      this.selectedItems = [];
    } else if (this.userProfile.userLevel == 3) {
      this.SelectTeacherForTraining.get("scClusterId")?.patchValue("");
      this.SelectTeacherForTraining.get("schoolId")?.patchValue("");
      //this.SelectTeacherForTraining.get("teacherType")?.patchValue("");
      this.SelectTeacherForTraining.get("teacherLists")?.patchValue("");
      this.SelectTeacherForTraining.get("officerList")?.patchValue("");
      this.selectedItems = [];
    }
    if (e == "3") {
      this.SelectTeacherForTraining.controls["scBlockId"].setValidators([
        Validators.required,
      ]);
      this.SelectTeacherForTraining.controls[
        "scBlockId"
      ].updateValueAndValidity();
      this.allLabel = [
        "",
        "Training Subject",
        "Training Name",
        "Training Level",
        "District",
        "",
        "Trainee Type",
        "Block",
        "Trainee List",
      ];
    } else {
      this.allLabel = [
        "",
        "",
        "Training Subject",
        "Training Name",
        "Training Level",
        "District",
        "Trainee Type",
        "Trainee List",
      ];
      this.SelectTeacherForTraining.controls["scBlockId"].setValidators([
        Validators.nullValidator,
      ]);
      this.SelectTeacherForTraining.controls[
        "scBlockId"
      ].updateValueAndValidity();
    }
    //this.getTeacherCount(e);
  }

  editViewTraining(id: any) {
    this.spinner.show();
    let paramList: any = { encId: id };
    this.trainingTypeServices
      .editTeacherForTraining(paramList)
      .subscribe((resp: any) => {
        //console.log(resp);
        this.data = resp.data[0];
        this.encId = this.id;
        this.academicYear = this.data.academicYear;
        this.trainingSubject = this.data.trainingSubject;
        this.trainingLevel = this.data.trainingLevel;
        this.trainingId = this.data.trainingId;
        this.traineeType = this.data.traineeType;
        this.scDistrictId = this.data.scDistrictId;
        this.scBlockId = this.data.scBlockId;
        this.scClusterId = this.data.scClusterId;
        this.getBlock(this.scDistrictId);
        this.getCluster(this.scBlockId);
        this.getTrainingName(this.trainingSubject);
        if (this.data.traineeType == 1) {
          $(".dvTeacher").show();
          $(".dvOffice").hide();
          this.getDetails();
          this.SelectTeacherForTraining.get("teacherLists")?.patchValue(
            this.data.teacherListId
          );
          this.SelectTeacherForTraining.get("teacherType")?.patchValue(
            this.data.teacherType
          );
          if (this.data.scClusterId != null) {
            this.getSchool(this.data.scClusterId);
            this.SelectTeacherForTraining.get("schoolId")?.patchValue(
              this.data.schoolId
            );
          } else {
            this.SelectTeacherForTraining.get("schoolId")?.patchValue("");
          }
        }

        if (this.data.traineeType == 2) {
          $(".dvTeacher").hide();
          $(".dvOffice").show();
          this.getofficersDetails();
          this.SelectTeacherForTraining.get("officerList")?.patchValue(
            this.data.officerListId
          );
        }

        this.SelectTeacherForTraining.get("encId")?.patchValue(this.encId);
        this.SelectTeacherForTraining.get("academicYear")?.patchValue(
          this.academicYear
        );
        this.SelectTeacherForTraining.get("trainingLevel")?.patchValue(
          this.trainingLevel
        );
        this.SelectTeacherForTraining.get("scDistrictId")?.patchValue(
          this.scDistrictId
        );
        this.SelectTeacherForTraining.get("scBlockId")?.patchValue(
          this.data.scBlockId
        );
        this.SelectTeacherForTraining.get("scClusterId")?.patchValue(
          this.scClusterId
        );

        this.SelectTeacherForTraining.get("trainingSubject")?.patchValue(
          this.trainingSubject
        );
        this.SelectTeacherForTraining.get("trainingId")?.patchValue(
          this.trainingId
        );
        this.SelectTeacherForTraining.get("traineeType")?.patchValue(
          this.traineeType
        );

        this.spinner.hide();
      });
  }

  getDistrict() {
    this.loadingObj.districtLoad = true;
    this.blockData = [];
    this.scBlockId = "";
    this.scBlockChanged = true;
    this.scDisrtictChanged = true;
    this.commonService.getAllDistrict().subscribe((res: []) => {
      this.districtData = res;
      this.districtData = this.districtData.data;

      if (this.userProfile.district != 0 || this.userProfile.district != "") {
        this.districtData = this.districtData.filter((dis: any) => {
          return dis.districtId == this.userProfile.district;
        });
        this.SelectTeacherForTraining.controls["scDistrictId"].patchValue(
          this.userProfile.district
        );
        //this.SelectTeacherForTraining.controls["trainingLevel"].patchValue(this.userProfile.userLevel);
        this.getBlock(this.userProfile.district);
        this.scDisrtictChanged = false;
        this.loadingObj.districtLoad = false;
      } else {
        this.districtData = this.districtData;
        this.scDisrtictChanged = true;
        this.loadingObj.districtLoad = false;
      }

      this.loadingObj.districtLoad = false;
    });
  }

  getBlock(id: any) {
    this.loadingObj.blockLoad = true;
    const districtId = id;
    this.SelectTeacherForTraining.controls["scBlockId"].patchValue("");
    this.SelectTeacherForTraining.controls["scClusterId"].patchValue("");
    this.SelectTeacherForTraining.controls["schoolId"].patchValue("");
    if (districtId !== "") {
      this.commonService
        .getBlockByDistrictid(districtId)
        .subscribe((res: any) => {
          this.blockData = res;
          this.blockData = this.blockData.data;
          if (this.userProfile.block != 0 || this.userProfile.block != "") {
            this.blockData = this.blockData.filter((blo: any) => {
              return blo.blockId == this.userProfile.block;
            });
            this.SelectTeacherForTraining.controls["scBlockId"].patchValue(
              this.userProfile.block
            );
            this.loadingObj.blockLoad = false;
          } else {
            this.blockData = this.blockData;
            this.loadingObj.blockLoad = false;
          }
          this.loadingObj.blockLoad = false;
        });
    } else {
      this.loadingObj.blockLoad = false;
    }
  }

  getCluster(id: any) {
    this.scClusterChanged = true;
    //this.scClusterId = "";
    //this.schoolId = "";
    this.clusterData = [];
    this.getSchoolData = [];
    this.teacherList = [];
    this.SelectTeacherForTraining.controls["scClusterId"].patchValue("");
    this.SelectTeacherForTraining.controls["schoolId"].patchValue("");
    if (id != "") {
      this.commonService.getClusterByBlockId(id).subscribe((res: any) => {
        let data: any = res;
        for (let key of Object.keys(data["data"])) {
          this.clusterData.push(data["data"][key]);
        }
        this.scClusterChanged = false;
      });
    } else {
      this.scClusterChanged = false;
    }
  }

  getSchool(post: any) {
    this.showSpinnerBlock = true;
    const clusterId = post;
    //this.schoolId = "";
    this.getSchoolData = [];
    this.teacherList = [];
    this.SelectTeacherForTraining.controls["schoolId"].patchValue("");
    if (clusterId !== "") {
      this.registrationService.getSchool(post).subscribe((res: any) => {
        let data: any = res;
        for (let key of Object.keys(data["data"])) {
          this.getSchoolData.push(data["data"][key]);
        }

        this.showSpinnerBlock = false;
        this.scSchoolChanged = false;
      });
    } else {
      this.scSchoolChanged = false;
    }
  }

  getTeacherList(post: any) {
    let paramList = { schoolId: post };
    const tId = post;
    this.teacherList = [];
    this.schoolId = post;

    this.trainingTypeServices
      .getTeacherList(paramList)
      .subscribe((res: any) => {
        return (this.teacherList = res.data);
      });
  }

  getTeacherListByAppointment(_post: any) {
    let paramList = {
      schoolId: _post.schoolId,
      appoitmentType: _post.appoitmentType,
    };
    this.trainingTypeServices
      .getTeacherList(paramList)
      .subscribe((res: any) => {
        this.teacherList = res.data;
      });
  }

  getAppointType() {
    this.appointmentType = [];
    this.appointType = false;
    this.registrationService.getAppointType().subscribe((res: any) => {
      let data: any = res;
      for (let key of Object.keys(data["data"])) {
        this.appointmentType.push(data["data"][key]);
      }
      this.appointType = false;
    });
  }

  checkTeacherEnroll(e: any) {
    if (e.traineeType != "null") {
      if (e.traineeType == 1) {
        this.loadingObj.teacherLoad = true;
        this.trainingTypeServices.enrolledTeacher(e).subscribe((resp: any) => {
          this.data = resp.data;
          this.teacherList = resp.data;
          this.loadingObj.teacherLoad = false;
        });
      }
      if (e.traineeType == 2) {
        this.loadingObj.officerListLoad = true;
        this.trainingTypeServices.enrolledTeacher(e).subscribe((resp: any) => {
          this.data = resp.data;
          this.officerList = resp.data;
          this.loadingObj.officerListLoad = false;
        });
      }
    }
  }

  getSchoolid(post: any) {
    const clusterId = post;
    this.schoolId = post;
    if (clusterId !== "") {
      let paramList = { scBlockId: "", scClusterId: "", schoolId: post };
      this.getTeacherListOnSelect(paramList);
    }
  }

  getTeacherListOnSelect(post: any) {
    let paramList = post;
    this.trainingTypeServices
      .getTeacherListonSelect(paramList)
      .subscribe((res: any) => {
        this.teacherList = res.data;
      });
  }

  onSubmit() {
    this.submitted = true;
    if (this.SelectTeacherForTraining.get("traineeType")?.value == "1") {
      if (
        this.SelectTeacherForTraining.get("teacherLists")?.value.length ==
          "0" ||
        this.SelectTeacherForTraining.get("teacherLists")?.value == ""
      ) {
        this.SelectTeacherForTraining.setErrors({ INVALID: true });
        this.alertHelper.viewAlertHtml(
          "error",
          "Invalid inputs",
          '<i class="bi bi-arrow-right text-danger"></i> ' +
            "Teacher List is Manadatory" +
            `<br>`
        );
      }
    }

    if (this.SelectTeacherForTraining.get("traineeType")?.value == "2") {
      if (
        this.SelectTeacherForTraining.get("officerList")?.value.length == "0"
      ) {
        this.SelectTeacherForTraining.setErrors({ INVALID: true });
        this.alertHelper.viewAlertHtml(
          "error",
          "Invalid inputs",
          '<i class="bi bi-arrow-right text-danger"></i> ' +
            "Officers List is Manadatory" +
            `<br>`
        );
      }
    }

    // if ("INVALID" === this.SelectTeacherForTraining.status) {
    //   for (const key of Object.keys(this.SelectTeacherForTraining.controls)) {
    //     if (this.SelectTeacherForTraining.controls[key].status === "INVALID") {
    //       const invalidControl = this.el.nativeElement.querySelector(
    //         '[formControlName="' + key + '"]'
    //       );
    //       invalidControl.focus();
    //       this.customValidators.formValidationHandler(
    //         this.SelectTeacherForTraining,
    //         this.allLabel
    //       );
    //       break;
    //     }
    //   }
    // }

    if(this.SelectTeacherForTraining.invalid){
      this.customValidators.formValidationHandler(
                this.SelectTeacherForTraining,
                this.allLabel,
                this.el
              );
    }

    if (this.SelectTeacherForTraining.valid === true) {
      //console.log(this.SelectTeacherForTraining.value);
      this.alertHelper.updateAlert().then((result) => {
        if (result.value) {
          this.spinner.show(); // ==== show spinner
          this.trainingTypeServices
            .updateTeacherForTraining(this.SelectTeacherForTraining.value)
            .subscribe({
              next: (res: any) => {
                this.spinner.hide(); //==== hide spinner
                this.alertHelper
                  .successAlert(
                    "success!",
                    "Teacher Training successfully Updated.",
                    "success"
                  )
                  .then(() => {
                    this.route.navigate(["../../view"], {
                      relativeTo: this.router,
                    });
                  });
              },
              error: (error: any) => {
                this.spinner.hide(); //==== hide spinner
                let errorMessage: string = "";
                if (typeof error.error.msg === "string") {
                  errorMessage +=
                    '<i class="bi bi-arrow-right text-danger"></i> ' +
                    error.error.msg +
                    `<br>`;
                } else {
                  error.error.msg.map(
                    (message: string) =>
                      (errorMessage +=
                        '<i class="bi bi-arrow-right text-danger"></i> ' +
                        message +
                        `<br>`)
                  );
                }
                this.alertHelper.viewAlertHtml(
                  "error",
                  "Invalid inputs",
                  errorMessage
                );
              },
              //complete: () => console.log("done"),
            });
        }
      });
    }
  }

  toggle() {
    this.show = !this.show;
    if (this.show) this.buttonName = "Hide";
    else this.buttonName = "Show";
  }
}
