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
import { TeacherForTrainingService } from "../services/teacher-for-training.service";
import { SelfTrainingRequestService } from "../services/self-training-request.service";
import { Constant } from "src/app/shared/constants/constant";
import { ErrorHandler } from "src/app/core/helpers/error-handler";

@Component({
  selector: "app-view-teacher-for-training",
  templateUrl: "./view-teacher-for-training.component.html",
  styleUrls: ["./view-teacher-for-training.component.css"],
})
export class ViewTeacherForTrainingComponent implements OnInit {
  config = new Constant();
  academicYear: any = this.config.getAcademicCurrentYear();
  displayTable: boolean = false;
  // questSearchform!: FormGroup;
  cardIsDisplayed = true;
  scDistrictId: any = "";
  scBlockId: any = "";
  scClusterId: any = "";
  schoolId: any = "";
  scDisrtictChanged: boolean = false;
  scBlockChanged: boolean = false;
  scClusterChanged: boolean = false;
  scSchoolChanged: boolean = false;
  viewTableForm!: FormGroup;

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
    //"chkAll",
    "slNo",
    "TrainingSubject",
    "TrainingName",
    "dist",
    "block",
    "Academic_Year",
    "cluster",
    "school",
    "teacherList",
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
  //scDisrtictChanged: boolean = false;
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
  allTeacherName: any;
  teacherListModal: any;
  //districtData: any;
  blockData: any;
  clusterData: any;
  getSchoolData: any;
  res: any;
  trainingNames: any;
  subjectName: any;
  traineeType: any;
  trainerList: any;
  totalTrainerList: any;
  scDisrtictChangedload: boolean = false;
  scBlockChangedload: boolean = false;
  training: any;
  trainingNameChanged: boolean = false;
  trainingNameLoad: boolean = true;
  loadingObj: any = {
    traiingLoading: false,
    subjectLoad: false,
    districtLoad: false,
    blockLoad: false,
  };
  csvData: any;
  csvoptions: any;
  preAndPastYear:any = [];
  trainingLevel:any;
  constructor(
    private formBuilder: FormBuilder,
    public commonService: CommonserviceService,
    private alertHelper: AlertHelper,
    private spinner: NgxSpinnerService,
    private http: HttpClient,
    private route: Router,
    private router: ActivatedRoute,
    //private registrationService: RegistrationService,
    private el: ElementRef,
    private errorHandler: ErrorHandler,

    private trainingTypeServices: TeacherForTrainingService,
    private trainingServices: SelfTrainingRequestService
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

  getSubjectList() {
    this.trainingName = "";
    this.subjectName = "";
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

  showTeacherList(post: any) {
    this.spinner.show();
    this.traineeType = post.traineeType;
    let paramList = { encId: post.encId, traineeType: post.traineeType };
    this.trainingTypeServices
      .getTrainerList(paramList)
      .subscribe((res: any) => {
        this.trainerList = res.data;
        this.totalTrainerList = this.trainerList.length;
        this.spinner.hide();
      });
  }

  onDelete(encId: string) {
    this.alertHelper
      .deleteAlert("Are you sure to delete?", "", "question", "Yes, delete it!")
      .then((result) => {
        if (result.value) {
          this.spinner.show(); // ==== show spinner
          let paramList: any = {
            encId: encId,
            updatedBy: this.userProfile.userId,
          };
          this.trainingTypeServices
            .deleteTeacherforTraining(paramList)
            .subscribe((res: any) => {
              this.spinner.hide(); //==== hide spinner
              this.alertHelper.successAlert(
                "Deleted!",
                "Deleted Successfully",
                "success"
              );
              this.loadData(this.getSearchParams());
            });
        }
      });
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

  getSearchParams() {
    return {
      previousSize: this.previousSize,
      offset: this.offset.toString(),
      pageSize: this.pageSize.toString(),
      academicYear: this.viewTableForm?.get("academicYear")?.value,
      scDistrictId: this.viewTableForm?.get("scDistrictId")?.value,
      scBlockId: this.viewTableForm?.get("scBlockId")?.value,
      scClusterId: this.viewTableForm?.get("scClusterId")?.value,
      schoolId: this.viewTableForm?.get("schoolId")?.value,
      trainingName: this.viewTableForm?.get("trainingName")?.value,
      subjectName: this.viewTableForm?.get("subjectName")?.value,
    };
  }

  validateForm() {
    if (this.subjectName == "") {
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
    if(this.userLevel == 5){
      this.trainingLevel = 5;
    }else if(this.userLevel == 4){
      this.trainingLevel = 5;
    }else if(this.userLevel == 3){
      this.trainingLevel = 4;
    }else if(this.userLevel == 1){
      this.trainingLevel = 3;
    }
    const {
      previousSize,
      offset,
      pageSize,
      academicYear,
      scDistrictId,
      scBlockId,
      scClusterId,
      schoolId,
      trainingName,
      subjectName,
    } = params[0];

    const paramObj = {
      offset: offset,
      limit: pageSize,
      academicYear: this.academicYear,
      scDistrictId: this.sessionDistrictId == ""? this.scDistrictId:this.sessionDistrictId,
      scBlockId: this.scBlockId,
      scClusterId: this.scClusterId,
      schoolId: this.schoolId,
      trainingName: this.trainingName,
      subjectName: this.subjectName,
      trainingLevel:this.trainingLevel,
      userId: this.userProfile.userId,
    };
    this.isLoading = true;
    this.trainingTypeServices.viewTeacherFoTraining(paramObj).subscribe({
      next: (res: any) => {
        //console.log(res);
        this.resultListData.length = previousSize; // set current size
        this.resultListData.push(...res?.data); // merge with existing data
        this.resultListData.length = res?.totalRecord; // update length
        this.dataSource.paginator = this.paginator; // update paginator
        this.dataSource._updateChangeSubscription(); // update table
        this.isLoading = false;
        this.isNorecordFound = this.resultListData.length ? false : true;
        this.traineeType = res?.data.traineeType;
        this.isInitAdmin = false;
        this.spinner.hide();
      },
      error: (error: any) => {
        this.isLoading = false;
        this.spinner.hide();
      },
    });
  }

  // deleteTraining(id: any): void {
  // 	this.alertHelper
  // 		.deleteAlert("Are you sure to delete?", "", "question", "Yes, delete it!")
  // 		.then((result) => {
  // 			if (result.value) {

  // 				let paramList: any = { teacherTraningid: id, updatedBy: this.userProfile.userId };
  // 				//console.log(paramList);
  // 				this.trainingTypeServices.deleteTrainingData(paramList).subscribe((res: any) => {
  // 					//this.ngOnInit();
  // 					this.alertHelper.successAlert(
  // 						"Deleted!",
  // 						"Deleted Successfully",
  // 						"success"
  // 					).then(() => {
  // 						this.ngOnInit();
  // 					});

  // 				});
  // 			}
  // 		});

  // }

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
    //this.blockData = [];
    this.loadingObj.districtLoad = true;
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
        this.scDisrtictChanged = true;
        this.loadingObj.districtLoad = false;
      }
      this.loadingObj.districtLoad = false;
      this.scDisrtictChangedload = false;
    });
  }

  getBlock(id: any) {
    this.loadingObj.blockLoad = true;
    this.scBlockId = "";
    this.scClusterId = "";
    this.schoolId = "";
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
            // this.searchForm.controls["scBlockId"].patchValue(
            //   this.userProfile.block
            // );
            this.scBlockChanged = false;
            this.loadingObj.blockLoad = false;
            this.getCluster(this.userProfile.block);
          } else {
            this.blockData = this.blockData;
            this.scBlockChanged = true;
            this.loadingObj.blockLoad = false;
          }
          this.scBlockChangedload = false;
          this.loadingObj.blockLoad = false;
        });
    } else {
      this.scBlockChangedload = false;
      this.loadingObj.blockLoad = false;
    }
  }

  getCluster(id: any) {
    this.scClusterId = "";
    this.schoolId = "";
    this.scClusterChanged = true;
    this.clusterData = [];
    this.getSchoolData = [];
    if (id != "") {
      this.commonService.getClusterByBlockId(id).subscribe((res: any) => {
        let data: any = res;
        for (let key of Object.keys(data["data"])) {
          this.clusterData.push(data["data"][key]);
        }
        if (this.userProfile.cluster != 0 || this.userProfile.cluster != "") {
          this.clusterData = this.clusterData.filter((cls: any) => {
            return cls.clusterId == this.userProfile.cluster;
          });
          this.getSchool(this.userProfile.cluster);
        }
        //this.clusterChanged = false;

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
        this.getSchoolData = res.data;
        if (
          this.userProfile.udiseCode != 0 ||
          this.userProfile.udiseCode != ""
        ) {
          this.getSchoolData = this.getSchoolData.filter((sch: any) => {
            return sch.schoolUdiseCode == this.userProfile.udiseCode;
          });
          this.searchForm.controls["schoolId"]?.patchValue(
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

  downloadTeacherForTraining(e:any){
    this.spinner.show();
    this.csvData = e;
    //console.log(e);
    this.trainingTypeServices.downloadTeacherForTraining(
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
            "Training Subject",
            "Training Name",
            "District / जिला",
            "Block / प्रखण्ड",
            "Academic Year / शैक्षणिक वर्ष",
            "Cluster / संकुल",
            "School / विद्यालय"
          ],
        };
      
      new ngxCsv(data, "teacherForTraining", this.csvoptions);
      this.spinner.hide();
    });
  }

  printPage() {
    let cloneTable 	= document.getElementById("viewTable")?.innerHTML;
    const pageTitle = document.querySelector(".pageName")?.innerHTML;
    this.commonService.printPage(cloneTable, pageTitle);
  }
  
}
