import {
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
  ElementRef,
  Input,
} from "@angular/core";
import { FormGroup, FormBuilder, Validators, FormControl } from "@angular/forms";
import { CommonserviceService } from "src/app/core/services/commonservice.service";

import { NgxSpinnerService } from "ngx-spinner";
import { DataTableDirective } from "angular-datatables";
import { empty, Subject } from "rxjs";
import { AlertHelper } from "src/app/core/helpers/alert-helper";
import { ngxCsv } from "ngx-csv/ngx-csv";
import { RegistrationService } from "src/app/application/teacher/services/registration.service";
import { HttpClient } from "@angular/common/http";
import { ActivatedRoute, Router } from "@angular/router";
import { ProgressBarMode } from "@angular/material/progress-bar";
import { MatSort } from "@angular/material/sort";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableExporterDirective } from "mat-table-exporter";
import { MatTableDataSource } from "@angular/material/table";
import { Constant } from "src/app/shared/constants/constant";
import { TeacherForTrainingService } from "../../services/teacher-for-training.service";
import { IDropdownSettings } from "ng-multiselect-dropdown";
import { CustomValidators } from "src/app/shared/validations/custom-validators";
import { TrainingTypeService } from "../../services/training-type.service";
import { SelfTrainingRequestService } from "../../services/self-training-request.service";

declare var $: any;

@Component({
  selector: "app-add-teacher-for-training",
  templateUrl: "./add-teacher-for-training.component.html",
  styleUrls: ["./add-teacher-for-training.component.css"],
})
export class AddTeacherForTrainingComponent implements OnInit {
  dropdownSettings: IDropdownSettings = {};
  dropdownSettings1: IDropdownSettings = {};
  SelectTeacherForTraining!: FormGroup;
  public show: boolean = true;
  public buttonName: any = "Show";
  config = new Constant();
  academicYear: any = this.config.getAcademicCurrentYear();
  displayTable: boolean = false;
  questSearchform!: FormGroup;
  SearchformId!: FormGroup;
  isLoading = false;
  isNorecordFound: boolean = false;
  tattenlength: boolean = false;
  pageIndex: any = 0;
  previousSize: any = 0;

  // mat table
  @Input() mode!: ProgressBarMode;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatTableExporterDirective, { static: true })
  exporter!: MatTableExporterDirective;
  pageSize = 10;
  offset = 0;
  currentPage = 0;
  totalRows = 0;

  pageSizeOptions: number[] = [10, 25, 100];

  resultListData: any = [];
  resultListDatas: any = [];
  questionDetailsData!: any;
  dataSource = new MatTableDataSource(this.resultListData);
  //end
  bodyData: any;
  @ViewChild(DataTableDirective, { static: false })
  datatableElement!: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  scDisrtictChanged: boolean = false;
  districtData: any;
  userProfile = this.commonService.getUserProfile();
  userType = this.userProfile.userType;
  userId = this.userProfile.userId;
  userLevel = this.userProfile.userLevel;
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
  trainingLevel: any;
  teacherList: any;
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
  post: any;
  id: any;
  trainingSubject: any;
  traineeType: any;
  allErrorMessages: string[] = [];
  allLabel: string[] = [
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
  encId: any;
  disId: any;
  officeList: any = [];
  officerList: any;
  appointmentTypes: any;
  scDisrtictChangedload: boolean = false;
  scBlockChangedload: boolean = false;
  ids: any;
  trainingId: any = [];
  trainingNameLoad: boolean = false;
  teacherListLoad: boolean = false;
  officerListLoad: boolean = false;
  traineeId: any;
  selectedItems: any = [];
  loadingObj: any = {
    traiingLoading: false,
    subjectLoad: false,
    districtLoad: false,
    blockLoad: false,
    teacherLoad:false,
    officerListLoad:false,
    traineeTypeLoad:false,
    trainingLevel:false,
  };
  trainingLevelType: any;
  loginUserTypeId = false;
  var: any;
  trainingLevelTypes: any;
  anxtName: any;
  anxtValue: any;
  preAndPastYear:any = [];
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
    private trainingTypeService: TrainingTypeService,
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

      $("#selTrainerType").click(() => {
        var selTrainerType = $("#selTrainerType").val();
        if (selTrainerType == 1) {
          $(".dvTeacher").show();
          $(".dvOffice").hide();
        } else if (selTrainerType == 2) {
          $(".dvOffice").show();
          $(".dvTeacher").hide();
        }else if (selTrainerType == 3) {
          $(".dvTeacher").show();
          $(".dvOffice").hide();
        }
      });
    });
    
    this.getDistrict();
    //this.getTeacherList();
    //this.getOfficerList1();
    this.getAppointType();
    this.getTrainingLevel();
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
    this.spinner.show();

    let id = this.router.snapshot.params["encId"];
    if (id !== undefined) {
      let paramList: any = { encId: id };
      this.ids = this.router.snapshot.params["encId"];
      this.trainingTypeService
        .readTrainingData(paramList)
        .subscribe((resp: any) => {
          this.data = resp.data[0];
          this.trainingSubject = this.data.trainingSubject;
          this.trainingId = this.data.trainingId;
          this.getTrainingName(this.trainingSubject);
          //this.initializeForm();
          this.SelectTeacherForTraining.get("trainingSubject")?.patchValue(
            this.trainingSubject
          );
          this.SelectTeacherForTraining.get("trainingId")?.patchValue(
            this.trainingId
          );
          this.spinner.hide();
          this.var = "../../../manageTrainingType/ViewTraining";
        });
    } else {
      this.spinner.hide();
      this.var = "./../view";
    }
  }

  ngAfterViewInit(){
    this.el.nativeElement.querySelector("[formControlName=trainingSubject]").focus();
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
    this.loadingObj.trainingLevel = true;
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
    //this.trainingId = "";
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

  initializeForm() {
    this.SelectTeacherForTraining = this.formBuilder.group({
      //encId:[this.encId, [Validators.required,]],
      academicYear: [this.academicYear],
      trainingSubject: [this.trainingSubject, [Validators.required]],
      trainingId: [this.trainingId, [Validators.required]],
      trainingLevel: [this.trainingLevel, [Validators.required]],
      scDistrictId: [this.scDistrictId, [Validators.required]],
      traineeType: [this.traineeType, [Validators.required]],
      scBlockId: [this.scBlockId],
      scClusterId: [this.scClusterId],
      schoolId: [this.schoolId],
      appointmentTypes: [this.appointmentTypes],
      teacherList: [this.teacherList],
      officerList: [this.officerList],
      createdBy: [this.userProfile.userId],
    });
  }

  checkValid(e:any){
    this.SelectTeacherForTraining.get("traineeType")?.patchValue("");
    if (e == "3") {
      this.SelectTeacherForTraining.controls["scBlockId"].setValidators([Validators.required]);
      this.SelectTeacherForTraining.controls["scBlockId"].updateValueAndValidity();
      this.allLabel = [
        "Training Subject",
        "Training Name",
        "Training Level",
        "District",
        "",
        "Trainee Type",
        "Block",
        "Trainee List",
      ];
    }else{
      this.allLabel = [
        "",
        "Training Subject",
        "Training Name",
        "Training Level",
        "District",
        "Trainee Type",
        "Trainee List",
      ];
      this.SelectTeacherForTraining.controls["scBlockId"].setValidators([Validators.nullValidator]);
      this.SelectTeacherForTraining.controls["scBlockId"].updateValueAndValidity();
    }
    //this.getTeacherCount(e);
  }

  onSubmit() {
    if(this.SelectTeacherForTraining.get('traineeType')?.value === "1"){
      if (this.SelectTeacherForTraining.get('teacherList')?.value === null) {
        this.SelectTeacherForTraining.setErrors({ 'INVALID': true });
        this.alertHelper.viewAlertHtml(
          "error",
          "Invalid inputs",
          '<i class="bi bi-arrow-right text-danger"></i> ' +
                    'Teacher List is Manadatory' +
                    `<br>`
        );
      }
    }

    if(this.SelectTeacherForTraining.get('traineeType')?.value === "2"){
      if (this.SelectTeacherForTraining.get('officerList')?.value === null) {
        this.SelectTeacherForTraining.setErrors({ 'INVALID': true });
        this.alertHelper.viewAlertHtml(
          "error",
          "Invalid inputs",
          '<i class="bi bi-arrow-right text-danger"></i> ' +
                    'Officers List is Manadatory' +
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
      this.alertHelper.submitAlert().then((result) => {
        if (result.value) {
          this.spinner.show(); // ==== show spinner
          this.trainingTypeServices
            .addTeacherForTraining(this.SelectTeacherForTraining.value)
            .subscribe({
              next: (res: any) => {
                this.spinner.hide(); //==== hide spinner
                this.alertHelper
                  .successAlert(
                    "Saved!",
                    "Submitted successfully.",
                    "success"
                  )
                  .then(() => {
                    //this.SelectTeacherForTraining.reset();
                    this.route.navigate([this.var], {
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
              complete: () => console.log("done"),
            });
        }
      });
    }
  }

  // getSearchParams() {
  //   return {
  //     previousSize: this.previousSize,
  //     offset: this.offset.toString(),
  //     pageSize: this.pageSize.toString(),
  //     userType: this.userProfile.userType,
  //     userId: this.userProfile.userId,
  //     scDistrictId: this.questSearchform?.get("scDistrictId")?.value,
  //     //scDistrictId: this.sessionDistrictId,
  //     scBlockId: this.questSearchform?.get("scBlockId")?.value,
  //     scClusterId: this.questSearchform?.get("scClusterId")?.value,
  //     desgName: this.questSearchform?.get("desgName")?.value,
  //     startDate: this.questSearchform?.get("startDate")?.value,
  //     endDate: this.questSearchform?.get("endDate")?.value,
  //   };
  // }

  getDistrict() {
    this.loadingObj.districtLoad = true;
    this.blockData = [];
    this.scBlockId = "";
    this.scDisrtictChangedload = true;
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
        if(this.userLevel != 1){
          this.SelectTeacherForTraining.controls["trainingLevel"].patchValue(this.userProfile.userLevel + 1);
        }
        
        this.getBlock(this.userProfile.district);
        this.scDisrtictChanged = false;
        this.loadingObj.districtLoad = false;
      } else {
        this.districtData = this.districtData;
        this.scDisrtictChanged = true;
        this.loadingObj.districtLoad = false;
      }

      this.scDisrtictChangedload = false;
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
            this.getCluster(this.userProfile.block);
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
    this.scClusterId = "";
    this.schoolId = "";
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
        if (this.sessionClusterId != "") {
          this.SelectTeacherForTraining.controls["scClusterId"].patchValue(
            this.sessionClusterId
          );
          this.getSchool(this.sessionClusterId);
        }

        this.scClusterChanged = false;
      });
    } else {
      this.scClusterChanged = false;
    }
  }

  getSchool(clusterId: any) {
    this.schoolId = "";
    this.scSchoolChanged = true;

    this.getSchoolData = [];

    if (clusterId !== "") {
      this.commonService.getSchoolList(clusterId).subscribe((res: any) => {
        this.getSchoolData = res;
        this.getSchoolData = this.getSchoolData.data;
        if (
          this.userProfile.udiseCode != 0 ||
          this.userProfile.udiseCode != ""
        ) {
          this.getSchoolData = this.getSchoolData.filter((sch: any) => {
            return sch.schoolUdiseCode == this.userProfile.udiseCode;
          });
          this.SelectTeacherForTraining.controls["schoolId"]?.patchValue(
            this.getSchoolData[0].schoolId
          );
        } else {
          this.scSchoolChanged = true;
        }

        this.scSchoolChanged = false;
      });
    } else {
      this.scSchoolChanged = false;
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

  getOfficerListOnSelect(post: any) {
    this.officerListLoad = true;
    let paramList = post;
    this.trainingTypeServices
      .getOfficersListonSelect(paramList)
      .subscribe((res: any) => {
        this.officerList = res.data;
        this.officerListLoad = false;
      });
  }

  getOfficerList1() {
    this.trainingTypeServices
      .getOfficersList(this.userProfile)
      .subscribe((res: any) => {
        this.officerList = res.data;
      });
  }
  checkTeacherEnroll(e: any) {
    if(e.traineeType != "null"){
      if(e.traineeType == 1 || e.traineeType == 3){
        this.loadingObj.teacherLoad = true;
        this.trainingTypeServices.enrolledTeacher(e).subscribe((resp: any) => {
          this.data = resp.data;
          this.teacherList = resp.data;
          this.loadingObj.teacherLoad = false;
        });
      }
      if(e.traineeType == 2){
        this.loadingObj.officerListLoad = true;
        this.trainingTypeServices.enrolledTeacher(e).subscribe((resp: any) => {
          this.data = resp.data;
          this.officerList = resp.data;
          this.loadingObj.officerListLoad = false;
        });
      }
      
    }else{
      this.data = [];
      this.loadingObj.officerListLoad = false;
    }
    
  }

  getTeacherList() {
    this.trainingTypeServices
      .getTeacherList(this.userProfile)
      .subscribe((res: any) => {
        this.teacherList = res.data;
      });
  }

  getTeacherListOnSelect(post: any) {
    this.teacherListLoad = true;
    let paramList = post;
    this.trainingTypeServices
      .getTeacherListonSelect(paramList)
      .subscribe((res: any) => {
        this.teacherList = res.data;
        this.teacherListLoad = false;
      });
  }

  getTeacherListByAppointment(_post: any) {
    let paramList = {
      schoolId: _post.schoolId,
      appoitmentType: _post.appoitmentType,
    };
    this.trainingTypeServices
      .getTeacherListonSelect(paramList)
      .subscribe((res: any) => {
        this.teacherList = res.data;
      });
  }

  getAppointType() {
    this.appointType = true;
    this.appointmentType = [];
    this.registrationService.getAppointType().subscribe((res: any) => {
      let data: any = res;
      for (let key of Object.keys(data["data"])) {
        this.appointmentType.push(data["data"][key]);
      }
      this.appointType = false;
    });
  }

  toggle() {
    this.show = !this.show;
    if (this.show) this.buttonName = "Hide";
    else this.buttonName = "Show";
  }
}
