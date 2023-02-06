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
import { ngxCsv } from "ngx-csv/ngx-csv";
import { ProgressBarMode } from "@angular/material/progress-bar";
import { MatSort } from "@angular/material/sort";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableExporterDirective } from "mat-table-exporter";
import { MatTableDataSource } from "@angular/material/table";
import { ManageTrainingBatchService } from "../services/manage-training-batch.service";
import { CustomValidators } from "src/app/shared/validations/custom-validators";
import { Constant } from "src/app/shared/constants/constant";
import { ErrorHandler } from "src/app/core/helpers/error-handler";
import { SelfTrainingRequestService } from "../services/self-training-request.service";
import { DatePipe } from "@angular/common";

@Component({
  selector: "app-view-training-batch",
  templateUrl: "./view-training-batch.component.html",
  styleUrls: ["./view-training-batch.component.css"],
})
export class ViewTrainingBatchComponent implements OnInit, AfterViewInit {
  EditSelfRequest!: FormGroup;
  config = new Constant();
  academicYear: any = this.config.getAcademicCurrentYear();
  displayTable: boolean = false;
  // questSearchform!: FormGroup;

  viewTableForm!: FormGroup;

  scDistrictId: any = "";
  scBlockId: any = "";

  scDisrtictChanged: boolean = false;
  scBlockChanged: boolean = false;

  isLoading = false;
  isNorecordFound: boolean = false;
  pageIndex: any = 0;
  previousSize: any = 0;
  // mat table
  @ViewChild("closeModal") private closeModal: ElementRef | any;
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
    "subject",
    "tName",
    "District",
    "Block",
    "location",
    "academicYear",
    "noofTeachers",
    "Batches",
    "Trainer",
    "startDate",
    "endDate",
    "AssignTrainer",
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
    { id: 1, batchName: "Batch-A" },
    { id: 2, batchName: "Batch-B" },
    { id: 3, batchName: "Batch-C" },
    { id: 4, batchName: "Batch-D" },
    { id: 5, batchName: "Batch-E" },
    { id: 6, batchName: "Batch-F" },
    { id: 7, batchName: "Batch-G" },
    { id: 8, batchName: "Batch-H" },
    { id: 9, batchName: "Batch-I" },
    { id: 10, batchName: "Batch-J" },
  ];
  data: any;
  encId: any;
  trainer: any;
  scDisrtictChangedload: boolean = false;
  scBlockChangedload: boolean = false;
  loadingObj: any = {
    traiingLoading: false,
    subjectLoad: false,
    districtLoad: false,
    blockLoad: false,
  };
  csvData: any;
  csvoptions: any;
  trainingSubject: any;
  res: any;
  training: any;
  trainingLocationType: any;
  latest_date: string | null;
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

    private trainingTypeServices: ManageTrainingBatchService,
    private trainingServices: SelfTrainingRequestService,
    public datepipe: DatePipe
  ) {
    this.maxDate = new Date();
    this.latest_date = this.datepipe.transform(this.maxDate, "yyyy-MM-dd");
  }

  ngOnInit(): void {
    this.getPresentAndPastAcademicYear();
    this.isInitAdmin = true;
    //this.loadData(this.getSearchParams());
    this.initializeviewTableForm();
    this.getDistrict();
    this.initializeForm();
    this.getSubjectList();
    this.getTrainingLocation();
  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  initializeForm() {
    this.EditSelfRequest = this.formBuilder.group({
      encId: [this.encId],
      trainer: [this.trainer],
      updatedBy: [this.userProfile.userId],
    });
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

  getSubjectList() {
    this.trainingName = "";
    this.trainingSubject = "";
    this.loadingObj.subjectLoad = true;
    this.trainingServices.getSubject().subscribe((data: any) => {
      this.res = data.data;
      this.loadingObj.subjectLoad = false;
    });
  }
  getTrainingName(id: any) {
    this.trainingName = "";
    this.loadingObj.traiingLoading = true;
    if (id == "") {
      this.training = [];
      this.trainingName = "";
      this.viewTableForm.get("trainingName")?.patchValue("");
      this.loadingObj.traiingLoading = false;
    }

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

  editBatch(id: any) {
    this.spinner.show();
    let paramList: any = { encId: id };

    this.trainingTypeServices
      .editBatchById(paramList)
      .subscribe((resp: any) => {
        this.data = resp.data[0];
        this.encId = this.data.encId;
        this.trainer = this.data.trainer;
        this.initializeForm();
        this.spinner.hide();
      });
  }

  onSubmit() {
    this.submitted = true;
    if (
      this.EditSelfRequest.get("trainer")?.value == null ||
      this.EditSelfRequest.get("trainer")?.value == "null"
    ) {
      this.alertHelper.viewAlertHtml(
        "error",
        "Invalid inputs",
        "Trainer is required"
      );
    } else {
      if (this.EditSelfRequest.valid === true) {
        this.alertHelper.updateAlert().then((result) => {
          if (result.value) {
            this.spinner.show(); // ==== show spinner
            this.trainingTypeServices
              .updatBatchById(this.EditSelfRequest.value)
              .subscribe({
                next: (res: any) => {
                  this.spinner.hide(); //==== hide spinner
                  this.alertHelper
                    .successAlert(
                      "Updated!",
                      "Trainer assigned successfully.",
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
    if (this.trainingSubject == "") {
      this.alertHelper.viewAlert("info", "", "Please select Traning Subject.");
      return false;
    }
    if (this.trainingName == "") {
      this.alertHelper.viewAlert("info", "", "Please select Traning Name.");
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
      userType,
      userId,
    } = params[0];

    const paramObj = {
      offset: offset,
      limit: pageSize,
      academicYear: this.academicYear,
      scDistrictId:
        this.sessionDistrictId == ""
          ? this.scDistrictId
          : this.sessionDistrictId,
      scBlockId: this.scBlockId,
      trainingSubject: this.trainingSubject,
      trainingName: this.trainingName,
      userType: this.userProfile.userType,
      userId: this.userProfile.userId,
      userLevel: this.userProfile.userLevel,
    };
    this.isLoading = true;
    this.trainingTypeServices.viewTrainingBatch(paramObj).subscribe({
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
        this.spinner.hide();
      },
      error: (error: any) => {
        this.isLoading = false;
        this.spinner.hide();
      },
    });
  }

  deleteTraining(id: any): void {
    this.alertHelper
      .deleteAlert("Are you sure to delete?", "", "question", "Yes, delete it!")
      .then((result) => {
        if (result.value) {
          let paramList: any = {
            encId: id,
            updatedBy: this.userProfile.userId,
          };
          //console.log(paramList);
          this.trainingTypeServices
            .deleteTrainingBatch(paramList)
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

  initializeviewTableForm() {
    this.viewTableForm = this.formBuilder.group({
      checkAll: [this.checkAll],
      checkRecordArr: this.formBuilder.array([], [Validators.required]),
    });
  }

  resetFormArray() {
    this.resultListData.forEach((eachdata: any) => {
      eachdata.isChecked = false;
    });
    (this.viewTableForm.get("checkRecordArr") as FormArray).clear();
  }

  checkUncheckAll() {
    this.resetFormArray();
    if (this.viewTableForm.get("checkAll")?.value !== true) {
      const checkRecordArr: FormArray = this.viewTableForm.get(
        "checkRecordArr"
      ) as FormArray;
      this.resultListData.forEach((eachdata: any) => {
        // console.log('eachdata::::',eachdata);
        checkRecordArr.push(new FormControl(eachdata.studentId));
        eachdata.isChecked = true;
      });
      //console.log(this.viewTableForm);
    }
  }

  onCheckboxChange(e: any) {
    const checkRecordArr: FormArray = this.viewTableForm.get(
      "checkRecordArr"
    ) as FormArray;
    if (e.target.checked) {
      checkRecordArr.push(new FormControl(e.target.value));
    } else {
      this.viewTableForm.get("checkAll")?.setValue(false);
      let i: number = 0;
      checkRecordArr.controls.forEach((item: any) => {
        if (item.value == e.target.value) {
          checkRecordArr.removeAt(i);
          return;
        }
        i++;
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
        this.scDisrtictChanged = false;
        this.loadingObj.districtLoad = false;
      } else {
        this.districtData = this.districtData;
        this.loadingObj.districtLoad = false;
        this.scDisrtictChanged = true;
      }
      this.loadingObj.districtLoad = false;
      this.scDisrtictChangedload = false;
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
            this.scBlockChanged = false;
          } else {
            this.blockData = this.blockData;
            this.loadingObj.blockLoad = false;
            this.scBlockChanged = true;
          }
          this.loadingObj.blockLoad = false;
          this.scBlockChangedload = false;
        });
    } else {
      this.loadingObj.blockLoad = false;
      this.scBlockChangedload = false;
    }
  }

  downloadTrainingBatch(e: any) {
    this.spinner.show();
    this.csvData = e;
    //console.log(e);
    this.trainingTypeServices
      .downloadTrainingBatch(this.csvData)
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
            "Training Subject",
            "Training Name",
            "District",
            "Block",
            "Training Location",
            "Academic Year",
            "Number of trainee",
            "Create Batches",
            "Trainer",
            "Training Start Date",
            "Training End Date",
          ],
        };

        new ngxCsv(data, "trainingBatch", this.csvoptions);
        this.spinner.hide();
      });
  }

  printPage() {
    let cloneTable = document.getElementById("viewTable")?.innerHTML;
    const pageTitle = document.querySelector(".pageName")?.innerHTML;
    this.commonService.printPage(cloneTable, pageTitle);
  }
}
