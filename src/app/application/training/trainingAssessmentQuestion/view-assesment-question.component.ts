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
import { ngxCsv } from "ngx-csv/ngx-csv";
//import { RegistrationService } from "src/app/application/teacher/services/registration.service";
import { HttpClient } from "@angular/common/http";
import { ActivatedRoute, Router } from "@angular/router";
import { ProgressBarMode } from "@angular/material/progress-bar";
import { MatSort } from "@angular/material/sort";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableExporterDirective } from "mat-table-exporter";
import { MatTableDataSource } from "@angular/material/table";
import { AssessmentQuestionService } from "../services/assessment-question.service";
import { Constant } from "src/app/shared/constants/constant";
import { SelfTrainingRequestService } from "../services/self-training-request.service";

@Component({
  selector: "app-view-assesment-question",
  templateUrl: "./view-assesment-question.component.html",
  styleUrls: ["./view-assesment-question.component.css"],
})
export class ViewAssesmentQuestionComponent implements OnInit {
  config = new Constant();
  academicYear: any = this.config.getAcademicCurrentYear();
  displayTable: boolean = false;
  questSearchform!: FormGroup;
  SearchformId!: FormGroup;
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
    "Question",
    "OptionA",
    "OptionB",
    "OptionC",
    "OptionD",
    "Answer",
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
  assesmentType: any;
  trainingSubject: any;
  trainingNames: any = [];
  res: any;
  trainingNameLoad: boolean = false;
  loadingObj: any = {
    traiingLoading: false,
    subjectLoad: false,
    districtLoad: false,
    blockLoad: false,
    assesType: false,
  };
  csvData: any;
  csvoptions: any;
  preAndPastYear:any = [];
  constructor(
    private formBuilder: FormBuilder,
    public commonService: CommonserviceService,
    private alertHelper: AlertHelper,
    private spinner: NgxSpinnerService,
    private http: HttpClient,
    private route: Router,
    private router: ActivatedRoute,
    private el: ElementRef,
    private trainingTypeServices: AssessmentQuestionService,
    private trainingServices: SelfTrainingRequestService
  ) {
    this.maxDate = new Date();
  }

  ngOnInit(): void {
    this.getPresentAndPastAcademicYear();
    this.isInitAdmin = true;
    this.getSubjectList();
    //this.loadData(this.getSearchParams());assesType
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
    this.trainingSubject = "";
    this.loadingObj.subjectLoad = true;
    this.loadingObj.assesType = true;
    this.trainingServices.getSubject().subscribe((data: any) => {
      this.res = data.data;
      this.loadingObj.subjectLoad = false;
      this.loadingObj.assesType = false;
    });
  }

  getTraininingName(id: any) {
    this.trainingName = "";
    this.loadingObj.traiingLoading = true;
    if (id == "") {
      this.trainingNames = [];
      this.trainingName = "";
      //this.questSearchform.get("trainingName")?.patchValue('');
      this.loadingObj.traiingLoading = false;
    }

    this.trainingServices.getTrainingDetails(id).subscribe((data: any) => {
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
      academicYear: this.questSearchform?.get("academicYear")?.value,
      trainingName: this.questSearchform?.get("trainingName")?.value,
      trainingSubject: this.questSearchform?.get("trainingSubject")?.value,
      assesmentType: this.questSearchform?.get("assesmentType")?.value,
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
      trainingName,
      trainingSubject,
      assesmentType,
      userType,
      userId,
    } = params[0];

    const paramObj = {
      offset: offset,
      limit: pageSize,
      academicYear: this.academicYear,
      trainingName: this.trainingName,
      trainingSubject: this.trainingSubject,
      assesmentType: this.assesmentType,
      userType: this.userProfile.userType,
      userId: this.userProfile.userId,
    };
    this.isLoading = true;
    //console.log(paramObj);
    this.trainingTypeServices.viewTeacherAssesment(paramObj).subscribe({
      next: (res: any) => {
        console.log(res);
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

  downloadAssesmentQuestion(e:any){
    this.spinner.show();
    this.csvData = e;
    //console.log(e);
    this.trainingTypeServices.downloadAssesmentQuestion(
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
            "Question",
            "Option A",
            "Option B",
            "Option C",
            "Option D",
            "Answer"
          ],
        };
      
      new ngxCsv(data, "trainingAssessmentQuestion", this.csvoptions);
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
