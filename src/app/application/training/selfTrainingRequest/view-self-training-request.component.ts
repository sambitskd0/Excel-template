import {
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
  ElementRef,
  Input,
} from "@angular/core";
import { FormGroup, FormBuilder, Validators, NgForm } from "@angular/forms";
import { CommonserviceService } from "src/app/core/services/commonservice.service";
import { NgxSpinnerService } from "ngx-spinner";
import { DataTableDirective } from "angular-datatables";
import { Subject } from "rxjs";
import { AlertHelper } from "src/app/core/helpers/alert-helper";
import { CustomValidators } from "src/app/shared/validations/custom-validators";
import { ngxCsv } from "ngx-csv/ngx-csv";
//import { RegistrationService } from "src/app/application/teacher/services/registration.service";
import { HttpClient } from "@angular/common/http";
import { ActivatedRoute, Router } from "@angular/router";
import { environment } from "src/environments/environment";
import { ProgressBarMode } from "@angular/material/progress-bar";
import { MatSort } from "@angular/material/sort";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableExporterDirective } from "mat-table-exporter";
import { MatTableDataSource } from "@angular/material/table";
import { SelfTrainingRequestService } from "../services/self-training-request.service";
import { Constant } from "src/app/shared/constants/constant";
import { PrivilegeHelper } from "src/app/core/helpers/privilege-helper";
import { ConditionalExpr } from "@angular/compiler";
import { Pipe, PipeTransform } from '@angular/core';


@Component({
  selector: "app-view-self-training-request",
  templateUrl: "./view-self-training-request.component.html",
  styleUrls: ["./view-self-training-request.component.css"],
})
export class ViewSelfTrainingRequestComponent implements OnInit {
  config = new Constant();
  academicYear: any = this.config.getAcademicCurrentYear();
  EditSelfRequest!: FormGroup;
  idselfTrainingRequest: any = "";

  status1: any = "";
  remarks: any = "";
  displayTable: boolean = false;
  questSearchform!: FormGroup;
  SearchformId!: FormGroup;
  isLoading = false;
  isNorecordFound: boolean = false;
  pageIndex: any = 0;
  previousSize: any = 0;
  // mat table
  submitted = false;
  @ViewChild('closeModal') private closeModal: ElementRef | any;
  @ViewChild("searchForm") searchForm!: NgForm;
  @Input() mode!: ProgressBarMode;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatTableExporterDirective, { static: true })
  allErrorMessages: string[] = [];
  allLabel: string[] = ["", "Action Type", "Remarks"];

  exporter!: MatTableExporterDirective;
  pageSize = 10;
  offset = 0;
  currentPage = 0;
  totalRows = 0;
  pageSizeOptions: number[] = [10, 25, 100];
  displayedColumns: string[] = [
    "slNo",
    "Academic_Year",
    "Training_Name",
    "Desc",
    "Status",
    "Action",
  ]; // define mat table columns

  resultListData: any = [];
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
  loginUserTypeId = this.userProfile.loginUserTypeId;
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
  trainingNames: any;
  id: any;
  data: any;
  close: any;
  res: any;
  trainingSubject: any;

  loadingObj: any = {
    trainingLoads: false,
    subjectLoad: false,
    districtLoad: false,
    blockLoad: false,
  };
  csvData: any;
  csvoptions:any;
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
    private trainingTypeServices: SelfTrainingRequestService
  ) {
    this.maxDate = new Date();
  }

  ngOnInit(): void {
    this.getPresentAndPastAcademicYear();
    this.initializeForm();
    this.getSubjectList();
    this.isInitAdmin = true;
    //this.loadData(this.getSearchParams());
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
  
  initializeForm() {
    this.EditSelfRequest = this.formBuilder.group({
      idselfTrainingRequest: [this.idselfTrainingRequest],
      status1: [this.status1, [Validators.required]],
      remarks: [this.remarks, [Validators.required]],

      //createdBy:[this.userProfile.userId],
      updatedBy: [this.userProfile.userId],
    });
  }

  getSubjectList() {
    this.trainingName = "";
    this.loadingObj.subjectLoad = true;
    this.trainingTypeServices.getSubject().subscribe((data: any) => {
      this.res = data.data;
      this.loadingObj.subjectLoad = false;
    });
  }

  getTrainingName(id: any) {
    this.loadingObj.trainingLoads = true;
    this.trainingNames = [];
    this.trainingName = "";

    this.trainingTypeServices.getTrainingDetails(id).subscribe((data: any) => {
      if (data == null) {
        this.trainingNames = [];
        this.loadingObj.trainingLoads = false;
      } else {
        this.trainingName = "";
        this.trainingNames = data.data;
        this.loadingObj.trainingLoads = false;
      }
    });
  }

  getSearchParams() {
    return {
      previousSize: this.previousSize,
      offset: this.offset.toString(),
      pageSize: this.pageSize.toString(),
      userType: this.userProfile.userType,
      userId: this.userProfile.userId,
      academicYear: this.questSearchform?.get("academicYear")?.value,
      trainingSubject: this.questSearchform?.get("trainingSubject")?.value,
      trainingName: this.questSearchform?.get("trainingName")?.value,
    };
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
    if (this.trainingSubject == "" || this.trainingSubject == undefined) {
      this.alertHelper.viewAlert(
        "info",
        "",
        "Please select Traning Subject."
      );
      return false;
    }
    if (this.trainingName == "") {
      this.alertHelper.viewAlert(
        "info",
        "",
        "Please select Traning Name."
      );
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
      trainingSubject,
      trainingName,
      userType,
      userId,
    } = params[0];

    const paramObj = {
      offset: offset,
      limit: pageSize,
      academicYear: this.academicYear,
      trainingSubject: this.trainingSubject,
      trainingName: this.trainingName,
      userType: this.userProfile.loginUserTypeId,
      userId: this.userProfile.userId,
    };
    this.isLoading = true;
    this.trainingTypeServices.viewSelfTrainingRequest(paramObj).subscribe({
      next: (res: any) => {
        this.resultListData.length = previousSize; // set current size
        this.resultListData.push(...res?.data); // merge with existing data
        this.resultListData.length = res?.totalRecord; // update length
        this.dataSource.paginator = this.paginator; // update paginator
        this.dataSource._updateChangeSubscription(); // update table
        this.isLoading = false;
        this.isNorecordFound = this.resultListData.length ? false : true;
        this.isInitAdmin = false;
        this.spinner.hide();
      },
      error: (error: any) => {
        this.isLoading = false;
        this.spinner.hide();
      },
    });
  }

  TakeAction(id: any) {
    let paramList = { encId: id };
    this.spinner.show();
    this.trainingTypeServices
      .getSelfRequestStatusById(paramList)
      .subscribe((resp: any) => {
        this.data = resp.data[0];
        this.idselfTrainingRequest = this.data.requestId;
        let status = this.data.status;
        if (status == null) {
        } else {
          this.status1 = this.data.status.toString();
        }
        this.remarks = this.data.remarks;
        this.initializeForm();
        this.spinner.hide();
      });
  }

  onSubmit() {
    this.submitted = true;
    //console.log(this.EditSelfRequest.value);
    if ("INVALID" === this.EditSelfRequest.status) {
      for (const key of Object.keys(this.EditSelfRequest.controls)) {
        if (this.EditSelfRequest.controls[key].status === "INVALID") {
          const invalidControl = this.el.nativeElement.querySelector(
            '[formControlName="' + key + '"]'
          );
          invalidControl.focus();
          this.customValidators.formValidationHandler(
            this.EditSelfRequest,
            this.allLabel
          );
          break;
        }
      }
    }

    if (this.EditSelfRequest.valid === true) {
      this.alertHelper.updateAlert().then((result) => {
        if (result.value) {
          this.spinner.show(); // ==== show spinner
          this.trainingTypeServices
            .updateSelfRequestAction(this.EditSelfRequest.value)
            .subscribe({
              next: (res: any) => {
                this.spinner.hide(); //==== hide spinner
                this.alertHelper
                  .successAlert(
                    "Updated!",
                    "Training request updated successfully .",
                    "success"
                  )
                  .then(() => {
                    this.closeModal.nativeElement.click();
                    this.loadData(this.getSearchParams());
                   
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

  downloadTrainingRequest(e:any){
    this.spinner.show();
    this.csvData = e;
    this.csvData['userId'] = this.userProfile.userId;
    this.csvData['userType'] = this.userProfile.loginUserTypeId;
    this.trainingTypeServices.downloadTrainingRequest(
      this.csvData
    ).subscribe((res: any) => {
      
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
            "Training Name",
            "Description",
            "Status"
          ],
        };
      
      new ngxCsv(data, "trainingRequest", this.csvoptions);
      this.spinner.hide();
    });
  }

  printPage() {
    let cloneTable 	= document.getElementById("viewTable")?.innerHTML;
    const pageTitle = document.querySelector(".pageName")?.innerHTML;
    this.commonService.printPage(cloneTable, pageTitle);
  }

  deleteTraining(id: any): void {
    this.alertHelper
      .deleteAlert("Are you sure to delete?", "", "question", "Yes, delete it!")
      .then((result) => {
        if (result.value) {
          let paramList: any = {
            teacherTraningid: id,
            updatedBy: this.userProfile.userId,
          };
          //console.log(paramList);
          this.trainingTypeServices
            .deleteTrainingData(paramList)
            .subscribe((res: any) => {
              //this.ngOnInit();
              this.alertHelper
                .successAlert("Deleted!", "Deleted Successfully", "success")
                .then(() => {
                  this.ngOnInit();
                });
            });
        }
      });
  }
}
