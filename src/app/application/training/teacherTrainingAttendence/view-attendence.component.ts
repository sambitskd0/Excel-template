import {
  AfterViewInit,
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  Input,
} from "@angular/core";
import {
  FormGroup,
  FormBuilder,
  Validators,
  NgForm,
  FormArray,
  FormControl,
} from "@angular/forms";
import { CommonserviceService } from "src/app/core/services/commonservice.service";
import { NgxSpinnerService } from "ngx-spinner";
import { DataTableDirective } from "angular-datatables";
import { Subject } from "rxjs";
import { AlertHelper } from "src/app/core/helpers/alert-helper";
import { HttpClient } from "@angular/common/http";
import { ActivatedRoute, Router } from "@angular/router";
import { ProgressBarMode } from "@angular/material/progress-bar";
import { MatSort } from "@angular/material/sort";
import { ngxCsv } from "ngx-csv/ngx-csv";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableExporterDirective } from "mat-table-exporter";
import { MatTableDataSource } from "@angular/material/table";
import { TeacherTrainingAttendenceService } from "../services/teacher-training-attendence.service";
import { CustomValidators } from "src/app/shared/validations/custom-validators";
import { Constant } from "src/app/shared/constants/constant";
import { ErrorHandler } from "src/app/core/helpers/error-handler";
import { SelfTrainingRequestService } from "../services/self-training-request.service";
import { DatePipe } from '@angular/common';

@Component({
  selector: "app-view-attendence",
  templateUrl: "./view-attendence.component.html",
  styleUrls: ["./view-attendence.component.css"],
})
export class ViewAttendenceComponent implements OnInit {
  public show: boolean = true;
  public buttonName: any = "Show";
  EditSelfRequest!: FormGroup;
  config = new Constant();
  academicYear: any = this.config.getAcademicCurrentYear();
  displayTable: boolean = false;
  // questSearchform!: FormGroup;

  viewTableForm!: FormGroup;

  scDistrictId: any = "";
  scBlockId: any = "";
  trainingLevel: any = "";

  scDisrtictChanged: boolean = false;
  scBlockChanged: boolean = false;

  isLoading = false;
  isNorecordFound: boolean = false;
  pageIndex: any = 0;
  previousSize: any = 0;
  // mat table
  @ViewChild("searchForm") searchForm!: NgForm;
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
  displayedColumns: string[] = [
    "slNo",
    "academicYear",
    "trainingSubject",
    "trainingName",
    "trainingDate",
    "trainingLocation",
    "batchName",
    "present",
    "absent",
    "attendanceDetails",
  ];

  resultListData: any = [];
  questionDetailsData!: any;
  dataSource = new MatTableDataSource(this.resultListData);
  //end
  bodyData: any;
  @ViewChild(DataTableDirective, { static: false })
  datatableElement!: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
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

  emptyCheck: boolean = false;
  isInitAdmin: boolean = false;
  tev: boolean = false;

  maxDate: any = Date;
  trainingName: any;

  checkAll: boolean = false;
  isChecked: boolean = false;
  submitted = false;
  blockData: any;

  batches = [
    { id: 1, batchName: "Batch A" },
    { id: 2, batchName: "Batch B" },
    { id: 3, batchName: "Batch C" },
    { id: 4, batchName: "Batch D" },
    { id: 5, batchName: "Batch E" },
    { id: 6, batchName: "Batch F" },
    { id: 7, batchName: "Batch G" },
    { id: 8, batchName: "Batch H" },
    { id: 9, batchName: "Batch I" },
    { id: 10, batchName: "Batch J" },
  ];
  batchLists: any = [];
  data: any;
  encId: any;
  trainer: any;
  scDisrtictChangedload: boolean = false;
  scBlockChangedload: boolean = false;
  trainingSubjectload: boolean = false;
  trainingNameload: boolean = false;
  trainingNameloads: boolean = true;
  trainingNames: any = [];
  res: any;
  trainingSubject: any;
  batchList: any;
  batchess: any;
  batchAssign: any;
  batchName: any;
  attenstatus: any;
  attenStat: any = [];
  status: any;
  tDate: any;
  teacherLists: any;
  trainingNameLoad: boolean = false;
  loadingObj: any = {
    traiingLoading: false,
    subjectLoad: false,
    districtLoad: false,
    blockLoad: false,
    trainingDateLoad:false,
  };
  csvData: any;
  csvoptions: any;
  trainingDate: any;
  trainingLevelType: any;
  trainingLocationType: any;
  trainingLevelTypes: any;
  anxtName: any;
  anxtValue: any;
  trainingEndDate: any;
  trainingStartDate: any;
  preAndPastYear:any = [];
  constructor(
    private formBuilder: FormBuilder,
    public commonService: CommonserviceService,
    private alertHelper: AlertHelper,
    private spinner: NgxSpinnerService,
    private http: HttpClient,
    private route: Router,
    private router: ActivatedRoute,
    public customValidators: CustomValidators,
    //private registrationService: RegistrationService,
    private el: ElementRef,
    private errorHandler: ErrorHandler,
    private trainingTypeServices: TeacherTrainingAttendenceService,
    private trainingServices: SelfTrainingRequestService,
    public datepipe: DatePipe
  ) {
    this.maxDate = new Date();
  }

  ngOnInit(): void {
    this.getPresentAndPastAcademicYear();
    this.isInitAdmin = true;
    //this.loadData(this.getSearchParams());
    this.initializeviewTableForm();
    this.getDistrict();
    this.getSubjectList();
    this.getTrainingLevel();
    this.getTrainingLocation();
  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  getPresentAndPastAcademicYear(){
    var splitted = this.academicYear.split("-", 2);
    var y1 = splitted[0] - 1;
    var y2 = splitted[1] - 1;
    var y3 = y1+"-"+y2;
    const spilit = this.academicYear+","+y3;
    this.preAndPastYear = spilit.split(",");
  }

  getTrainingLocation() {
    this.loadingObj.traningLoc = true;
    this.trainingServices.getTrainingLocation().subscribe((data: any) => {
      this.trainingLocationType = data.data;
      this.loadingObj.traningLoc = false;
    });
  }

  getTrainingLevel() {
    this.trainingServices.getTrainingLevl().subscribe((data: any) => {
      this.trainingLevelTypes = data.data;
      this.trainingLevelTypes.forEach((val: any, key: any) => {
        if (this.userProfile.userLevel == val.anxtValue) {
          this.anxtName = val.anxtName;
          this.anxtValue = val.anxtValue;
        }
      });
      this.searchForm.controls["trainingLevel"].patchValue(this.userProfile.userLevel);
    });
  }

  getSubjectList() {
    this.trainingName = "";
    this.trainingSubject = "";
    this.loadingObj.subjectLoad = true;
    this.trainingServices.getSubject().subscribe((data: any) => {
      this.res = data.data;
      this.loadingObj.subjectLoad = false;
    });
  }

  getTraininingName(id: any) {
    this.trainingName = "";
    this.loadingObj.traiingLoading = true;
    if (id == "") {
      this.trainingNames = [];
      this.trainingName = "";
      this.viewTableForm.get("trainingName")?.patchValue("");
      this.loadingObj.traiingLoading = false;
    }

    this.trainingServices.getTrainingViewAtten(id).subscribe((data: any) => {
      if (data == null) {
        this.trainingNames = [];
        this.spinner.hide();
        this.loadingObj.traiingLoading = false;
      } else {
        this.trainingNames = data.data;
        this.spinner.hide();
        this.loadingObj.traiingLoading = false;
      }
    });
  }

  checkTrainingDate(e:any){
    this.loadingObj.trainingDateLoad = true;
    if(e.trainingId != ""){
      this.trainingServices.checkTrainingDate(e).subscribe((res:any)=>{
        this.trainingStartDate = new Date(res.data[0].trainingStartDate);
        this.trainingEndDate = new Date(res.data[0].trainingEndDate);
        this.loadingObj.trainingDateLoad = false;
      });
    }
  }

  getSearchParams() {
    return {
      previousSize: this.previousSize,
      offset: this.offset.toString(),
      pageSize: this.pageSize.toString(),
      userType: this.userProfile.userType,
      userId: this.userProfile.userId,
      academicYear: this.viewTableForm?.get("academicYear")?.value,
      scDistrictId: this.viewTableForm?.get("scDistrictId")?.value,
      scBlockId: this.viewTableForm?.get("scBlockId")?.value,
      trainingSubject: this.viewTableForm?.get("trainingSubject")?.value,
      trainingName: this.viewTableForm?.get("trainingName")?.value,
      trainingDate: this.viewTableForm?.get("trainingDate")?.value,
      trainingLevel: this.viewTableForm?.get("trainingLevel")?.value,
    };
  }

  checkValid(e:any){
    if (e == 5) {
        this.scDistrictId = "";
        this.scBlockId = "";
        this.trainingDate = "";
        this.viewTableForm.get("scDistrictId")?.patchValue("");
        this.viewTableForm.get("scBlockId")?.patchValue("");
        this.viewTableForm.get("trainingDate")?.patchValue("");
    }else if(e == 4){
        this.scBlockId = "";
        this.trainingDate = "";
        this.viewTableForm.get("scBlockId")?.patchValue("");
        this.viewTableForm.get("trainingDate")?.patchValue("");
    }else if(e == 3){
      this.trainingDate = "";
      this.viewTableForm.get("trainingDate")?.patchValue("");
    }
    //this.getTeacherCount(e);
  }

  onPageChange(event: any) {
    this.spinner.show();
    this.isLoading = true;
    // event: PageEvent
    this.pageSize = event.pageSize; // current page size ex: 10

    this.offset = event.pageIndex * event.pageSize;
    this.previousSize = this.pageSize * event.pageIndex; // set previous size
    this.pageIndex = event.pageIndex;
    this.loadData(this.getSearchParams());
  }
  onSearch() {
    this.pageIndex = 0;
    this.previousSize = 0;
    this.offset = 0;
    this.previousSize = 0;
    this.resultListData.splice(0, this.resultListData.length); // empty current data
    this.dataSource.paginator = this.paginator; // update paginator
    if (this.validateForm() === true) {
      this.loadData(this.getSearchParams());
    }
  }

  validateForm() {

    if(this.trainingLevel == "4"){
      if (this.scDistrictId == "") {
        this.alertHelper.viewAlert("info","","Please select District.");
        return false;
      }

    }else if(this.trainingLevel == "3"){
      if (this.scDistrictId == "") {
        this.alertHelper.viewAlert("info","","Please select District.");
        return false;
      }
      if (this.scBlockId == "") {
        this.alertHelper.viewAlert("info","","Please select Block.");
        return false;
      }
    }
    
    if (this.trainingSubject == "" || this.trainingSubject == undefined) {
      this.alertHelper.viewAlert("info", "", "Please select Traning Subject.");
      return false;
    }
    if (this.trainingName == "") {
      this.alertHelper.viewAlert("info", "", "Please select Traning Name.");
      return false;
    }

    if (this.trainingLevel == "" || this.trainingLevel == undefined) {
      this.alertHelper.viewAlert("info", "", "Please select Traning Level.");
      return false;
    }

    if (this.trainingDate == "" || this.trainingDate == undefined) {
      this.alertHelper.viewAlert("info", "", "Please select Traning Date.");
      return false;
    }
    return true;
  }

  loadData(...params: any) {
    this.spinner.show();
    const {
      previousSize,
      offset,
      pageSize,
      academicYear,
      scDistrictId,
      scBlockId,
      trainingSubject,
      trainingName,
      userType,
      userId,
    } = params[0];

    const paramObj = {
      offset: offset,
      limit: pageSize,
      academicYear: this.academicYear,
      scDistrictId: this.scDistrictId,
      scBlockId: this.scBlockId,
      trainingSubject: this.trainingSubject,
      trainingName: this.trainingName,
      trainingDate: this.trainingDate,
      trainingLevel: this.trainingLevel,
      userType: this.userProfile.userType,
      userId: this.userProfile.userId,
    };
    this.isLoading = true;
    //console.log(paramObj);
    this.trainingTypeServices.viewTeacherLstForAtten(paramObj).subscribe({
      next: (res: any) => {
        //console.log(res);
        this.resultListData.length = previousSize; // set current size
        this.resultListData.push(...res?.data); // merge with existing data
        this.resultListData.length = res?.totalRecord; // update length
        this.dataSource.paginator = this.paginator; // update paginator
        this.dataSource._updateChangeSubscription(); // update table
        this.isLoading = false;
        this.isNorecordFound = this.resultListData.length ? false : true;
        this.isInitAdmin = false;
        this.batchLists = [];
        this.batchList = res?.batches;

        this.spinner.hide();
      },
      error: (error: any) => {
        this.isLoading = false;
        this.spinner.hide();
      },
    });
  }

  getTeacherList(post: any) {
    this.spinner.show();
    let paramList = {
      subjectId: post.subjectId,
      trainingId: post.trainingId,
      trainingDate: post.trainingDate,
      batchId: post.batchId,
    };
    this.trainingTypeServices
      .getTeacherListforAtten(post)
      .subscribe((resp: any) => {
        //console.log(resp);
        this.teacherLists = resp.data;
        this.spinner.hide();
      });
  }

  initializeviewTableForm() {
    this.viewTableForm = this.formBuilder.group({
      status: [this.attenStat],
      tDate: [this.tDate, [Validators.required]],
      createdBy: [this.userProfile.userId],
    });
    //console.log(this.viewTableForm.value);
  }
  onCheckboxChange(e: any) {
    this.attenStat.push(e);
  }

  addAttendence() {
    //this.initializeviewTableForm();
    this.viewTableForm.get("status")?.patchValue(this.attenStat);
    //console.log(this.viewTableForm.value);
    if (this.viewTableForm.valid === true) {
      this.alertHelper.submitAlert().then((result) => {
        if (result.value) {
          this.spinner.show(); // ==== show spinner
          this.trainingTypeServices
            .AddTeacherAttendence(this.viewTableForm.value)
            .subscribe({
              next: (res: any) => {
                this.spinner.hide(); //==== hide spinner

                this.alertHelper
                  .successAlert(
                    "Saved!",
                    "Training Batches created successfully.",
                    "success"
                  )
                  .then(() => {
                    this.initializeviewTableForm();
                    this.route.navigate(["./../viewAttendence"], {
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
        this.searchForm.controls["scDistrictId"].patchValue(
          this.userProfile.district
        );
        this.getBlock(this.userProfile.district);
        this.loadingObj.districtLoad = false;
      } else {
        this.districtData = this.districtData;
        this.loadingObj.districtLoad = false;
      }

      this.loadingObj.districtLoad = false;
    });
  }

  getBlock(id: any) {
    this.loadingObj.blockLoad = true;
    this.scBlockId = "";
    this.scBlockChangedload = true;
    this.scBlockChanged = false;
    const districtId = id;
    this.blockData = [];
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
            this.searchForm.controls["scBlockId"].patchValue(
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

  downloadTeacherListBatch(e: any) {
    this.spinner.show();
    this.csvData = e;
    this.csvData['academicYear'] = this.academicYear;
    // const index = academicYear;
    // let element = this.academicYear;
    this.trainingTypeServices
      .downloadTeacherAttendence(this.csvData)
      .subscribe((res: any) => {
        const data = res["data"];
        this.csvoptions = {
          fieldSeparator: ",",
          quoteStrings: '"',
          decimalseparator: ".",
          showLabels: true,
          useBom: true,
          headers: [
            "SLN#",
            "Academic Year",
            "Training Subject",
            "Training Name",
            "Training Date",
            "Training Location",
            "Batch Name",
          ],
        };

        new ngxCsv(data, "teacherAttendence", this.csvoptions);
        this.spinner.hide();
      });
  }

  printPage() {
    let cloneTable = document.getElementById("viewTable")?.innerHTML;
    const pageTitle = document.querySelector(".pageName")?.innerHTML;
    this.commonService.printPage(cloneTable, pageTitle);
  }

  toggle() {
    this.show = !this.show;
    if (this.show) this.buttonName = "Hide";
    else this.buttonName = "Show";
  }
}
