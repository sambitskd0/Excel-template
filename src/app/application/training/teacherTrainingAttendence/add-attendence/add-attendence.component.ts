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
import { MatPaginator } from "@angular/material/paginator";
import { MatTableExporterDirective } from "mat-table-exporter";
import { MatTableDataSource } from "@angular/material/table";
import { TeacherTrainingAttendenceService } from "../../services/teacher-training-attendence.service";
import { CustomValidators } from "src/app/shared/validations/custom-validators";
import { Constant } from "src/app/shared/constants/constant";
import { ErrorHandler } from "src/app/core/helpers/error-handler";
import { SelfTrainingRequestService } from "../../services/self-training-request.service";
import { DatePipe } from '@angular/common'



@Component({
  selector: "app-add-attendence",
  templateUrl: "./add-attendence.component.html",
  styleUrls: ["./add-attendence.component.css"],
})
export class AddAttendenceComponent implements OnInit {
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
  displayedColumns: string[] = ["slNo", "TeacherName", "District"];

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
  //AttStatus:any= "1";

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
  batchListss: any = [];
  data: any;
  encId: any;
  trainer: any;
  scDisrtictChangedload: boolean = false;
  scBlockChangedload: boolean = false;
  trainingSubjectload: boolean = false;
  trainingNameloads: boolean = false;
  trainingNames: any = [];
  res: any;
  trainingSubject: any;
  batchList: any;
  batchess: any;
  batchAssign: any;
  batchName: any;
  attenstatus: any;
  attenStat: any = [];
  tDate: any;
  loadingObj: any = {
    traiingLoading: false,
    subjectLoad: false,
    districtLoad: false,
    blockLoad: false,
    batchNameselect: false,
    batchNameLoad: false,
    atten: false,
  };
  trainingLevelType: any;
element: any;
  startDate: any;
  endDate: any;
  trainingLevels: any;
  latest_date: any;
  e: any;
  trainingLevelTypes: any;
  anxtName: any;
  anxtValue: any;
  batch:any;
  bookName: any;
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
    this.latest_date =this.datepipe.transform(this.maxDate, 'yyyy-MM-dd');
    
  }

  ngOnInit(): void {
    
    this.getPresentAndPastAcademicYear();
    this.getSubjectList();
    this.isInitAdmin = true;
    //this.loadData(this.getSearchParams());
    this.initializeviewTableForm();
    this.getDistrict();
    this.getTrainingLevel();
    const checkStockArr: FormArray = this.viewTableForm.get(
      "attendanceArray"
    ) as FormArray;
    console.log(checkStockArr);
    
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

  getTrainingLevel() {
    this.loadingObj.batchNameselect = true;
    this.trainingServices.getTrainingLevl().subscribe((data: any) => {
      this.trainingLevelTypes = data.data;
      this.trainingLevelTypes.forEach((val: any, key: any) => {
        if (this.userProfile.userLevel == val.anxtValue) {
          this.anxtName = val.anxtName;
          this.anxtValue = val.anxtValue;
        }
      });
      this.searchForm.controls["trainingLevel"].patchValue(this.userProfile.userLevel);
      this.loadingObj.batchNameselect = false;
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

  getBatchName(e:any){
    this.batchName = "";
    this.batchListss = [];
    this.loadingObj.batchNameLoad = true;
    e['scDistrictId'] = this.userProfile.district ? this.userProfile.district : "";
    e['scBlockId'] = this.userProfile.block ? this.userProfile.block : "";
    this.trainingTypeServices.getBatchName(e).subscribe((data:any)=>{
      this.batch = data.data;
      this.batches.forEach((val: any, key: any) => {
        if (this.batch.find((x: any) => x >= val.id)) {
          this.batchListss.push({
            id: val.id,
            batchName: val.batchName,
          });
        }
      });
      this.loadingObj.batchNameLoad = false;
      this.batchName = "";
    })
    
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

    this.trainingServices.getTrainingForAttendence(id).subscribe((data: any) => {
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
      trainingLevel: this.viewTableForm?.get("trainingLevel")?.value,
      trainingSubject: this.viewTableForm?.get("trainingSubject")?.value,
      trainingName: this.viewTableForm?.get("trainingName")?.value,
      batchName: this.viewTableForm?.get("batchName")?.value,
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

  checkValid(e:any){
    if (e == 5) {
        this.scDistrictId = "";
        this.scBlockId = "";
        this.batchName = "";
        this.viewTableForm.get("scDistrictId")?.patchValue("");
        this.viewTableForm.get("scBlockId")?.patchValue("");
        this.viewTableForm.get("batchName")?.patchValue("");
    }else if(e == 4){
        this.scBlockId = "";
        this.batchName = "";
        this.viewTableForm.get("scBlockId")?.patchValue("");
        this.viewTableForm.get("batchName")?.patchValue("");
    }else if(e == 3){
      this.batchName = "";
      this.viewTableForm.get("batchName")?.patchValue("");
    }
    //this.getTeacherCount(e);
  }

  onSearch() {
    this.pageIndex = 0;
    this.previousSize = 0;
    this.offset = 0;
    this.previousSize = 0;
    this.resultListData.splice(0, this.resultListData.length); // empty current data
    //this.viewTableForm.get('status')?.patchValue("");
    this.attenStat = [];
    this.attenStat.length = 0;
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
    if (this.trainingSubject == "") {
      this.alertHelper.viewAlert("info", "", "Please select traning subject.");
      return false;
    }
    if (this.trainingName == "") {
      this.alertHelper.viewAlert("info", "", "Please select traning name.");
      return false;
    }
    if (this.trainingLevel == "") {
      this.alertHelper.viewAlert("info", "", "Please select training level.");
      return false;
    }

    if (this.batchName == "" || this.batchName == undefined) {
      this.alertHelper.viewAlert("info", "", "Please select batch name.");
      return false;
    }
    return true;
  }

  get minDateGetter() {
    return new Date();
    //return this.datepipe.transform(new Date(), 'yyyy-MM-dd');
    //return 2022-10-24;
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
      trainingLevel,
      trainingSubject,
      trainingName,
      batchName,
      userType,
      userId,
    } = params[0];

    const paramObj = {
      offset: offset,
      limit: pageSize,
      academicYear: this.academicYear,
      scDistrictId: this.scDistrictId,
      scBlockId: this.scBlockId,
      trainingLevel: this.trainingLevel,
      trainingSubject: this.trainingSubject,
      trainingName: this.trainingName,
      batchName: this.batchName,
      userType: this.userProfile.userType,
      userId: this.userProfile.userId,
    };
    this.isLoading = true;
    this.trainingTypeServices.viewTeacherAttendence(paramObj).subscribe({
      next: (res: any) => {
        if(res?.data[0]){
          this.startDate = res?.data[0].start_date;
          this.endDate = res?.data[0].end_date;
        }
        if(res?.totalRecord == 0){
          this.isLoading = false;
        this.isNorecordFound = this.resultListData.length ? false : true;
        this.isInitAdmin = false;
       
        this.spinner.hide();
        }
        
        this.resultListData.length = previousSize; // set current size
        this.resultListData = res.data; // merge with existing data
        
        if (this.resultListData?.length) {
          this.resultListData.map((item: any) => {           
            this.attendanceInfo().push(
              this.formBuilder.group({
                tId: [item.tId],
                batchId: [item.trainingBatchId],
                AttStatus: [
                  {
                    value: item.attendenceStatus ? item.attendenceStatus:'1',
                     disabled: false,
                  },
                  //  [ Validators.pattern(/^[0-9]+$/)],
                ],
  
              })
            );
          });
        }
        //this.trainingLevels = res?.data[0].trainingLevel;
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

  

  initializeviewTableForm() {
    this.viewTableForm = this.formBuilder.group({
      createdBy: [this.userProfile.userId],
      attendanceArray: this.formBuilder.array([]),
    });
  }
  // attendanceArrayInfo(): FormArray {
  //   return this.viewTableForm.get("attendanceArray") as FormArray;
  // }

  attendanceInfo() {
    return this.viewTableForm.get("attendanceArray") as FormArray;
  }
  getFormValue(allValue: any) {
    return {
      ...allValue,       
    };
  }

  onCheckboxChange(e: any) {
    let index = this.attenStat.findIndex((x: { tId: any; })=>x.tId === e.tId);
    if(index == -1){
      this.attenStat.push(e);
    }else if(index == 0){
      this.attenStat.splice(index, 1);
    }else{
      this.attenStat.splice(index, 1);
      this.attenStat.push(e);
    }
   console.log(this.attenStat);
    
  }

 

  validateForms() {
    if(this.viewTableForm.value.status.length == 0){
      this.alertHelper
                    .viewAlert(
                      "info",
                      "",
                      "Please Select at least one field."
                    )
                    .then(() => {
                      this.loadData(this.getSearchParams());
                    });
      
      return false;
    }
    
    return true;
  }

  

  addAttendence() {
    const allValue = this.viewTableForm?.value;
     console.log(this.getFormValue(allValue));
    // return 1;
    //this.viewTableForm.get("status")?.patchValue(this.attenStat);
    // console.log(this.viewTableForm.value);
    // return 1;
    //if (this.validateForms() == true) {
      if (this.viewTableForm.valid === true) {
        this.alertHelper.submitAlert().then((result) => {
          if (result.value) {
            this.spinner.show(); // ==== show spinner
            this.trainingTypeServices
              .AddTeacherAttendence(this.getFormValue(allValue))
              .subscribe({
                next: (res: any) => {
                  this.spinner.hide(); //==== hide spinner
                  this.alertHelper
                    .successAlert(
                      "Saved!",
                      "Attendence added successfully.",
                      "success"
                    )
                    .then(() => {
                      this.route.navigate(["./../viewAttendence"], {
                        relativeTo: this.router,
                      });
                      //this.isInitAdmin = true;
                      //this.ngOnInit();
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
          }else{
            this.viewTableForm.get('status')?.patchValue("");
                      this.attenStat = [];
                      this.attenStat.length = 0;
          }
        });
      }
    // }else{
    //   this.viewTableForm.get('status')?.patchValue("");
    //         this.attenStat = [];
    //         this.attenStat.length = 0;
    // }
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

  toggle() {
    this.show = !this.show;
    if (this.show) this.buttonName = "Hide";
    else this.buttonName = "Show";
  }
}
