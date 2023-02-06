import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnInit,
  ViewChild,
} from "@angular/core";
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
  NgForm,
  ValidatorFn,
} from "@angular/forms";
import { MatPaginator } from "@angular/material/paginator";
import { ProgressBarMode } from "@angular/material/progress-bar";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { MatTableExporterDirective } from "mat-table-exporter";
import { NgxSpinnerService } from "ngx-spinner";
import { AlertHelper } from "src/app/core/helpers/alert-helper";
import { ErrorHandler } from "src/app/core/helpers/error-handler";
import { CommonserviceService } from "src/app/core/services/commonservice.service";
import { Constant } from "src/app/shared/constants/constant";
import { CustomValidators } from "src/app/shared/validations/custom-validators";
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from "src/environments/environment";
import { PrivilegeHelper } from "src/app/core/helpers/privilege-helper";
import { SchoolService } from "src/app/application/school/services/school.service";
import { StudentInformationService } from "../../services/student-information.service";

@Component({
  selector: 'app-view-verification-request',
  templateUrl: './view-verification-request.component.html',
  styleUrls: ['./view-verification-request.component.css']
})
export class ViewVerificationRequestComponent implements OnInit {

  paramObj: any;
  serviceType: string = "Search";
  userId: any = "";
  public fileUrl = environment.filePath;
  @ViewChild("searchForm") searchForm!: NgForm;
  public userProfile = JSON.parse(
    sessionStorage.getItem("userProfile") || "{}"
  );
  schlInfo: any = [];
  stdInfo:any = [];

  pageIndex: any = 0;
  previousSize: any = 0;

  isLoading = false;
  emptyResult: boolean = false;
  noFilter: boolean = true;

  schoolId: any = "";
  config = new Constant();
  academicYear: any = this.config.getAcademicCurrentYear();

  stdSearchForm!: FormGroup;
  viewTableForm!: FormGroup;
  submitted = false;
  checkAll: boolean = false;
  isChecked: boolean = false;

  /* Search form control default value set :: start */
  studentCode: any = "";
  admissionNo: any = "";
  classId: any = "";
  stream: any = "";
  group: any = "";
  section: any = "";
  /* Search form control default value set :: end */

  /* Data binding controls :: start */
  anxData: any = [];

  classChanged: boolean = false;
  classList: any = [];
  streamChanged: boolean = false;
  streamList: any = [];
  groupChanged: boolean = false;
  groupList: any = [];
  sectionChanged: boolean = false;
  sectionList: any = [];
  /* Data binding controls :: end */

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
  displayedColumns: string[] = [
    "chkAll",
    "slNo",
    "Student Name",
    "Student Code",
    // "Admission Number",
    // "Admission Date",
    "Father Name",
    "DOB",
    "Gender",
    //"Mobile",
    "Class",
    "School",
    "Action",
    "Verification Status",
  ]; // define mat table columns

  resultListData: any = [];
  questionDetailsData!: any;
  dataSource = new MatTableDataSource(this.resultListData);
  //end

  public show: boolean = true;
  public buttonName: any = "Show";
  isVisible: any = 22;
  isSelected: boolean = true;
  optionVal: any;
  optionstream: any;

  /** Search Form Controls Intialization :: Start */

  searchAcademicYear: any = "";
  searchDistrictId: any = "";
  searchBlockId: any = "";
  searchClusterId: any = "";
  searchSchoolId: any = "";

  scDisrtictSelect: boolean = true;
  scDisrtictLoading: boolean = false;
  scBlockSelect: boolean = true;
  scBlockLoading: boolean = false;
  scClusterSelect: boolean = true;
  scClusterLoading: boolean = false;
  scSchoolSelect: boolean = true;
  scSchoolLoading: boolean = false;

  searchDistrictData: any = [];
  searchBlockData: any = [];
  districtData: any = [];
  getSchoolData: any = [];
  clusterData: any = [];
  tagSubjectData: any = [];
  tagSubCompData: any = [];
  tagSubOptData: any = [];
  tagSubjectForm!:FormGroup;
  opsubjectTaggingArray:any=[];
  compsubjectTaggingArray:any=[];
  classNameModal:any="";
  streamId:any="";
  groupId:any="";
  studentId:any="";
  academicYearStudent:any="";
  streamListModal :any=[];
  groupListModal:any=[];
  subSelected:any=[];
  tagStatusSubject:any="";

  allLabel: string[] = [
    "District",
    "Block",
    "Cluster",
    "School",
    "Class",
    "Stream",
    "Group",
    "Section",
    "StudentCode",
    "AdmissionNo",
  ]

/** Search Form Controls Intialization :: End */

/** Verification Form Controls Intialization :: Start */
  stdVerifyForm!: FormGroup;
  verifyStatus:any = '3';
  remarks:any = '';
  revertReason:any = '';
  verifyType:number = 0;
  bulkApprovalFlag = 0;

  approveList : any = [];
  approveListId : any = [];
  noApproveList : any = [];
  noApproveListId : any = [];

  allVerifyFormLabel: string[] = [
    "Action Type",
    "Remarks",
  ]

/** Verification Form Controls Intialization :: End */


  @ViewChild('stdVerifyClose') stdVerifyClose!:any;
  
plPrivilege:string="view"; //For menu privilege
adminPrivilege: boolean = false;
  constructor(
    private formBuilder: FormBuilder,
    private commonService: CommonserviceService,
    private schoolService: SchoolService,
    private studentServices: StudentInformationService,
    private spinner: NgxSpinnerService,
    private alertHelper: AlertHelper,
    private errorHandler: ErrorHandler,
    public  customValidators: CustomValidators,
    private el:ElementRef,
    private privilegeHelper: PrivilegeHelper,   //For menu privilege
    private router:Router,
    private activatedRoute:ActivatedRoute,
  ) {
    const pageUrl:any = this.router.url;  
    this.plPrivilege = this.privilegeHelper.PrimaryLinkPrivilege(pageUrl);  //For menu privilege    
    this.commonService.verifyLinkPermission(pageUrl, this.config.linkType[2], this.config.privilege[1]);  // For authorization
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  ngOnInit(): void {
    if(this.plPrivilege=='admin'){
      this.adminPrivilege = true;
    }
    this.getDistrict();
    this.userProfile = this.commonService.getUserProfile();
    this.schoolId = this.userProfile.school;
    this.userId   =this.userProfile?.userId;
    //this.commonService.getSchoolInfo({encId:this.userProfile.school,academicYear:this.academicYear});
    this.loadAnnexturesData();
    this.getSchoolInfo();
    if(this.userProfile.school){
      this.getSchoolClasses(this.userProfile.school);
    }
    this.initializeForm();
    this.initializeviewTableForm();
    this.initializeVerifyForm();
  }

  initializeForm() {
    this.stdSearchForm = this.formBuilder.group({
      searchDistrictId:[this.searchDistrictId,Validators.required],
      searchBlockId:[this.searchBlockId,Validators.required],
      searchClusterId:[this.searchClusterId,Validators.required],
      searchSchoolId:[this.searchSchoolId,Validators.required],
      classId: [this.classId,Validators.required],
      stream: [this.stream],
      group: [this.group],
      section: [this.section],
      studentCode: [this.studentCode,[Validators.pattern(/^[0-9]+$/),Validators.maxLength(15)]],
      admissionNo: [this.admissionNo],
      createdBy: [this.userProfile.userId],
      sessionValue: [this.userProfile],
    });
  }


  loadAnnexturesData() {
    const anxTypes = ["STREAM_TYPE", "STREAM_GROUP_TYPE"];
    // this.anxData = this.commonFunction.getAnnextureData(anxTypes);
    let annextureData!: [];
    this.commonService.getCommonAnnexture(anxTypes).subscribe({
      next: (res: any) => {
        annextureData = res?.data;
        this.streamList = res?.data?.STREAM_TYPE;
        this.groupList = res?.data?.STREAM_GROUP_TYPE;
        this.streamList.forEach((value:any) => {
          this.streamListModal[value.anxtValue] = value.anxtName;                
        });
        this.groupList.forEach((value:any) => {
          this.groupListModal[value.anxtValue] = value.anxtName;                
        });
      },
    });
  }

  getSchoolClasses(schoolEncId: string) {
    this.classChanged = true;
    if (schoolEncId !== "") {
      this.schoolService
        .getSchoolClasses(schoolEncId)
        .subscribe((res: any = []) => {
          this.classList = res.data;
          this.classChanged = false;
        });
    }
  }

  getSchoolWiseClasses(schoolId:any){
    this.classChanged = true;
    if (schoolId !== "") {
      this.schoolService
        .getSchoolWiseClasses(schoolId)
        .subscribe((res: any = []) => {
          this.classList = res.data;
          this.classChanged = false;
        });
    }
  }

  getSchoolInfo() {
    this.spinner.show();
    this.commonService
      .getSchoolBasicInfo({
        encId: this.userProfile.school,
        academicYear: this.academicYear,
      })
      .subscribe((res: any = []) => {
        this.spinner.hide();
        this.schlInfo = res.data;
      });
  }
  // loadData(searchParams: Object) {
  loadData(...params: any) {
    const {
      previousSize,
      offset,
      pageSize,
      searchDistrictId,
      searchBlockId,
      searchClusterId,
      searchSchoolId,
      admissionNo,
      studentCode,
      classId,
      stream,
      group,
      section,
    } = params[0];

    this.paramObj = {
      offset: offset,
      limit: pageSize,
      searchDistrictId: searchDistrictId,
      searchBlockId: searchBlockId,
      searchClusterId: searchClusterId,
      searchSchoolId: searchSchoolId,
      studentCode: studentCode,
      admissionNo: admissionNo,
      classId: classId,
      stream: stream,
      group: group,
      section: section,
      schoolEncId:this.schoolId,
      serviceType:this.serviceType,
      userId: this.userId,
      academicYear:this.academicYear
    };

    this.isLoading = true;

    this.studentServices.verifyStudentList(this.paramObj).subscribe({
      next: (res: any) => {
        this.resultListData.length = previousSize; // set current size
        res?.success === true && this.resultListData.push(...res?.data); // merge with existing data
        this.resultListData.length = res?.totalRecord; // update length
        this.dataSource.paginator = this.paginator; // update paginator
        this.dataSource._updateChangeSubscription(); // update table
        this.isLoading = false;
        this.emptyResult = this.resultListData.length ? false : true;
        this.spinner.hide();

        /* Bulk Approval Flag Check */
        this.resultListData.forEach((value:any) => {

          if(value.verificationStatus==1){
            this.approveList[value.studentId] = value.studentCode;   
            this.approveListId.push(value.studentId);
          }else{
            this.noApproveList[value.studentId] = value.studentCode;   
            this.noApproveListId.push(value.studentId);
          }            
        }); 
        if(this.approveListId.length>0){
          this.bulkApprovalFlag = 1;
        }
        /* Bulk Approval Flag Check */

      },
      error: (error: any) => {
        this.isLoading = false;
        this.spinner.hide();
      },
    });
  }

  getSearchParams() {
    return {
      previousSize: this.previousSize,
      offset: this.offset.toString(),
      pageSize: this.pageSize.toString(),
      searchDistrictId: this.stdSearchForm?.get("searchDistrictId")?.value,
      searchBlockId: this.stdSearchForm?.get("searchBlockId")?.value,
      searchClusterId:this.stdSearchForm?.get("searchClusterId")?.value,
      searchSchoolId:this.stdSearchForm?.get("searchSchoolId")?.value,
      studentCode: this.stdSearchForm?.get("studentCode")?.value,
      admissionNo: this.stdSearchForm?.get("admissionNo")?.value,
      classId: this.stdSearchForm?.get("classId")?.value,
      stream: this.stdSearchForm?.get("stream")?.value,
      group: this.stdSearchForm?.get("group")?.value,
      section: this.stdSearchForm?.get("section")?.value,
    };
  }

  exportExcel() {
    this.exporter.exportTable("xlsx", {
      fileName: "Student_List",
      columnWidths: [5, 5, 3],
    });
  }

  onPageChange(event: any) {
    this.spinner.show();
    this.isLoading = true;
    // event: PageEvent
    this.pageSize = event.pageSize; // current page size ex: 10
    /**
     * pageIndex starts from 0
     * ex: if pageIndex = 0 then offset = 0 * 10 = 0 and if pageIndex =1 then 1*10 = 10
     */
    this.offset = event.pageIndex * event.pageSize;
    this.previousSize = this.pageSize * event.pageIndex; // set previous size
    this.pageIndex = event.pageIndex;
    this.loadData(this.getSearchParams());
  }

  classControlChange(val: any) {
    this.classId = val;
    if (this.classId !== "") {
      let param = {
        schoolId: this.stdSearchForm?.get("searchSchoolId")?.value,
        classId: this.classId,
        academicYear: this.academicYear,
      };
      this.getSection(param);
    }
  }

  streamControlChange(val: any) {
    this.stream = val;
  }

  getSection(param: any) {
    this.sectionChanged = true;
    this.schoolService.getSection(param).subscribe((res: any) => {
      this.sectionList = res.data.sections;
      this.sectionChanged = false;
    });
  }

  onSearch() {

    if ("INVALID" === this.stdSearchForm.status) {
      for (const key of Object.keys(this.stdSearchForm.controls)) {
        if (this.stdSearchForm.controls[key].status === "INVALID") {
          const invalidControl = this.el.nativeElement.querySelector(
            '[formControlName="' + key + '"]'
          );
          invalidControl?.focus();
          this.customValidators.formValidationHandler(this.stdSearchForm,this.allLabel);
          break;
        }
      }
    }
    if (this.stdSearchForm.valid === true) {
      this.noFilter = false;

      // reset queryParams
      this.pageIndex = 0;
      this.previousSize = 0;
      this.offset = 0;
      this.previousSize = 0;
      this.resultListData.splice(0, this.resultListData.length); // empty current data
      this.dataSource.paginator = this.paginator; // update paginator
      this.loadData(this.getSearchParams());
    }

  }

  getDistrict() {
    this.scDisrtictSelect = false;
    this.scDisrtictLoading = true;
    this.commonService.getAllDistrict().subscribe((data: any) => {
      this.scDisrtictLoading = false;
      this.districtData = data;
      this.districtData = this.districtData.data;
      this.getBlock(this.userProfile.district);
      if (this.userProfile.district != 0 || this.userProfile.district != "") {
        this.searchDistrictData = this.districtData.filter((dis: any) => {
          return dis.districtId == this.userProfile.district;
        });
        this.stdSearchForm.controls["searchDistrictId"].patchValue(
          this.userProfile.district
        );
      } else {
        this.searchDistrictData = this.districtData;
        this.scDisrtictSelect = true;
      }
      this.searchBlockId = "";
    });
  }

  getBlock(districtId: any) {
    this.scBlockSelect = false;
    this.scBlockLoading = true;

    this.searchBlockData = [];
    this.stdSearchForm.controls["searchBlockId"].patchValue("");

    this.clusterData = [];
    this.stdSearchForm.controls["searchClusterId"].patchValue("");

    this.getSchoolData = [];
    this.stdSearchForm.controls["searchSchoolId"].patchValue("");

    if (districtId !== "") {
      this.commonService
        .getBlockByDistrictid(districtId)
        .subscribe((res: any) => {
          this.scBlockLoading = false;
          this.searchBlockData = res;
          this.searchBlockData = this.searchBlockData.data;

          if (this.userProfile.block != 0 || this.userProfile.block != "") {
            this.searchBlockData = this.searchBlockData.filter((blo: any) => {
              return blo.blockId == this.userProfile.block;
            });
            this.stdSearchForm.controls["searchBlockId"].patchValue(
              this.userProfile.block
            );
            this.getCluster(this.userProfile.block);
          } else {
            this.scBlockSelect = true;
          }
        });
    } else {
      this.scBlockSelect = true;
      this.scBlockLoading = false;
    }
  }

  getCluster(blockId: any) {
    this.scClusterSelect = false;
    this.scClusterLoading = true;

    this.clusterData = [];
    this.stdSearchForm.controls["searchClusterId"].patchValue("");

    this.getSchoolData = [];
    this.stdSearchForm.controls["searchSchoolId"].patchValue("");

    if (blockId !== "") {
      this.commonService.getClusterByBlockId(blockId).subscribe((res: any) => {
        this.scClusterLoading = false;
        this.clusterData = res;
        this.clusterData = this.clusterData.data;

        if (this.userProfile.cluster != 0 || this.userProfile.cluster != "") {
          this.clusterData = this.clusterData.filter((clu: any) => {
            return clu.clusterId == this.userProfile.cluster;
          });
          this.stdSearchForm.controls["searchClusterId"].patchValue(
            this.userProfile.cluster
          );
          this.getSchool(this.userProfile.cluster);
        } else {
          this.scClusterSelect = true;
        }
      });
    } else {
      this.scClusterSelect = true;
      this.scClusterLoading = false;
    }
  }

  getSchool(clusterId: any) {
    this.scSchoolSelect = false;
    this.scSchoolLoading = true;

    this.getSchoolData = [];
    this.stdSearchForm.controls["searchSchoolId"].patchValue("");

    if (clusterId !== "") {
      this.commonService.getSchoolList(clusterId).subscribe((res: any) => {
        this.getSchoolData = res;
        this.getSchoolData = this.getSchoolData.data;

        if (this.userProfile.udiseCode != 0 || this.userProfile.udiseCode != "") {
          this.getSchoolData = this.getSchoolData.filter((sch: any) => {
            return sch.schoolUdiseCode == this.userProfile.udiseCode;
          });
          this.stdSearchForm.controls["searchSchoolId"].patchValue(
            this.getSchoolData[0].schoolId
          );
        } else {
          this.scSchoolSelect = true;
        }
        this.scSchoolLoading = false;
      });
    } else {
      this.scSchoolSelect = true;
      this.scSchoolLoading = false;
    }
  }


  initializeviewTableForm() {
    this.viewTableForm = this.formBuilder.group({
      checkAll: [this.checkAll],
      checkRecordArr: this.formBuilder.array([], [Validators.required]),
    });
  }

  checkUncheckAll() {
    this.resetFormArray();
    if (this.viewTableForm.get("checkAll")?.value !== true) {
      const checkRecordArr: FormArray = this.viewTableForm.get(
        "checkRecordArr"
      ) as FormArray;
      this.resultListData.forEach((eachdata: any) => {
        checkRecordArr.push(new FormControl(eachdata.studentId));
        eachdata.isChecked = true;
      });
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

  resetFormArray() {
    this.resultListData.forEach((eachdata: any) => {
      eachdata.isChecked = false;
    });
    (this.viewTableForm.get("checkRecordArr") as FormArray).clear();
  }


  studentInfo(encId: string) {
    this.spinner.show();
    this.studentServices
      .studentInfo({
        encId: encId,
        academicYear: this.academicYear,
      })
      .subscribe((res: any = []) => {
        this.spinner.hide();
        this.stdInfo = res.data;
      });
  }

  toggle() {
    this.show = !this.show;
    if (this.show) this.buttonName = "Hide";
    else this.buttonName = "Show";
  }

  rdverifyStatusControl(val: any) {
    this.verifyStatus = val;
    // this.initializeVerifyForm();
  }


  // conditional validation
  conditionalValidator(
    predicate: any,
    validator: ValidatorFn,
    errorNamespace: string,
    validationType: string
  ): ValidatorFn {
    return (formControl: any) => {
      let conditionStatus = false;
      let parentValue = parseInt(predicate());

      // 1) if parent empty
      if (!formControl.parent) {
        return null;
      }

      let error = null;

      // validation logic for remarks
      if (validationType === "remarks" && parentValue == 2) {
        conditionStatus = true;
      }

      // 3) set conditional validation
      if (errorNamespace && error) {
        const customError: any = {}; // custom error property
        customError[errorNamespace] = error;
        error = customError;
      }
      return error;
    };
  }

  initializeVerifyForm() {
    console.log(this.stdVerifyForm?.get("verifyStatus")?.value);
    
    this.stdVerifyForm = this.formBuilder.group({
      verifyStatus: [this.verifyStatus,Validators.required],
      // remarks: [this.remarks,Validators.required],
      remarks: [
        this.remarks,
        [
          Validators.max(500),
          this.conditionalValidator(
            () => this.stdVerifyForm?.get("verifyStatus")?.value,
            Validators.required,
            "conditionalValidation",
            "remarks"
          )
        ],
      ],
      studentId: [this.studentId],
      stream: [this.stream],
      group: [this.group],
      section: [this.section],
      createdBy: [this.userProfile.userId],
      sessionValue: [this.userProfile],
      schoolId: [this.schoolId],
    });
  }

  requestforVerification(encId: string){
    this.alertHelper
      .confirmAlert("Are you sure to want request for verification?")
      .then((result) => {
        if(result.value){
          this.spinner.show(); // show spinner
          this.isLoading = true;
          let paramList: any = {
            studentId: encId,
            createdBy: this.userProfile.userId,
          };
          this.studentServices.requestToVerify(paramList).subscribe({
            next: (res: any) => {
              if (res?.status === "SUCCESS") {
                this.alertHelper.successAlert("Saved!",res.msg,"success")
                .then(() => {
                  this.loadData(this.getSearchParams());
                });
              } else {
                this.alertHelper.viewAlert("info", res?.msg, "");
              }
              this.spinner.hide();
              this.isLoading = false;
            },
            error: (error: any) => {
              this.spinner.hide(); //==== hide spinner
              this.isLoading = false;
              this.errorHandler.serverSideErrorHandler(error); // server side error handler
            },
          });
        }
      });
  }
  
  verifyStudent(encId:string,crType:number){
    this.verifyType = crType;
    this.studentId = encId;
    this.stdVerifyForm.patchValue({ studentId: encId });
    this.stdVerifyForm.patchValue({ schoolId: this.stdSearchForm?.get("searchSchoolId")?.value });
    // this.initializeVerifyForm();
  }

  checkRemarks(){
    if(this.stdVerifyForm?.get("verifyStatus")?.value == 2 && this.stdVerifyForm?.get("remarks")?.value.length == 0){
      const invalidControl = this.el.nativeElement.querySelector(
        '[formControlName="remarks"]');
          invalidControl.focus();
          this.alertHelper.viewAlert("error","Invalid","Please provide revert remarks.");
      return;
    }else{
      return true;
    }
  }

  onVerifySubmit(){
    this.submitted = true;
    // console.log(this.stdVerifyForm?.get("verifyStatus")?.value);
    // if ("INVALID" === this.stdVerifyForm.status) {
    //   for (const key of Object.keys(this.stdVerifyForm.controls)) {
    //     if (this.stdVerifyForm.controls[key].status === "INVALID") {
    //       const invalidControl = this.el.nativeElement.querySelector(
    //         '[formControlName="' + key + '"]'
    //       );
    //       invalidControl.focus();
    //       //this.customValidators.customFormValidationHandler(this.stdVerifyForm);
    //       this.customValidators.formValidationHandler(this.stdVerifyForm,this.allVerifyFormLabel);
    //       break;
    //     }
    //   }
    // }

    if (this.stdVerifyForm.valid === true && this.checkRemarks()) {
      console.log(this.stdVerifyForm?.get("remarks")?.value.length,this.verifyStatus,"gggg");
      this.alertHelper.submitAlert().then((result: any) => {
        if(result.value) {
          this.spinner.show(); // ==== show spinner
          this.studentServices
            .verifyStudent(this.stdVerifyForm.value)
            .subscribe({
              next: (res: any) => {
                this.spinner.hide(); //==== hide spinner
                this.alertHelper.successAlert("Saved!","Student information verified successfully.","success")
                  .then(() => {
                    this.stdVerifyClose.nativeElement.click();
                    this.clearControl(this.stdVerifyForm,["verifyStatus","studentId","remarks"]);
                    this.initializeVerifyForm();  
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
              complete: () => console.log('done'),
            });
        }
      });
    }else{
      for(const control of Object.keys(this.stdVerifyForm.controls)) {
        this.stdVerifyForm.controls[control].markAsTouched();
    
      }
    }
  }

  showRevertReason(reason:any){
    this.revertReason = reason;
  }

  bulkAprroval(){
    const checkRecordArr: FormArray = this.viewTableForm.get(
      "checkRecordArr"
    ) as FormArray;
    
    if (checkRecordArr.controls.length < 1) {
      this.alertHelper.viewAlertHtml(
        "error",
        "Invalid",
        "Select atleast one record for approval !!!"
      );
      return;
    }

    // let intersection = checkRecordArr.value.filter((x: any) => this.approveListId.includes(x));
    // console.log('intersection:::',intersection);

    let diffIds : any = [];
    let difference = checkRecordArr.value.filter((x: any)  => !this.approveListId.includes(x));
    // console.log('difference:::',difference);
    if(difference.length>0){
      difference.forEach((val:any) => {        
        diffIds.push(this.noApproveList[val]);
      });
      
      let errMsg = 'Some of the student(s) profiles are not eligible for verification, please unselect the following student(s).<br/>' ;

      diffIds.map(
        (message: string) =>
          (errMsg +=
            '<i class="bi bi-arrow-right text-danger"></i> ' +
            message +
            `<br>`)
      );

      this.alertHelper.viewAlertHtml(
        "error",
        "Invalid",
        errMsg
      );
      return;
    }

    this.alertHelper
    .confirmAlert("Are you sure to want approve all the selected student at a time ?")
    .then((result) => {
      if(result.value){
        this.spinner.show(); // show spinner
        this.isLoading = true;
        let paramList: any = {
          studentIds: checkRecordArr.value,
          createdBy: this.userProfile.userId,
          schoolId: this.stdSearchForm?.get("searchSchoolId")?.value,
          sessionValue:this.userProfile,
        };
        this.studentServices.bulkApproval(paramList).subscribe({
          next: (res: any) => {
            if (res?.status === "SUCCESS") {
              this.alertHelper.successAlert("Saved!",res.msg,"success")
              .then(() => {
                this.loadData(this.getSearchParams());
              });
            } else {
              this.alertHelper.viewAlert("info", res?.msg, "");
            }
            this.spinner.hide();
            this.isLoading = false;
          },
          error: (error: any) => {
            this.spinner.hide(); //==== hide spinner
            this.isLoading = false;
            this.errorHandler.serverSideErrorHandler(error); // server side error handler
          },
        });
      }
    });
    
  }

  openLink(encId:any){
    let pageUrl = '/Application/student/info/preview/'+encId;
    window.open(
      pageUrl,
      "_blank"
    );
  }

  printPage() {
    let cloneTable = document.getElementById("viewTable")?.innerHTML;
    const pageTitle = document.querySelector(".pageName")?.innerHTML;
    this.commonService.printPage(cloneTable, pageTitle);
  }

  downLoadStudentList() {
    this.spinner.show();
    this.paramObj.serviceType = "Download";
    this.studentServices.viewStudentList(this.paramObj).subscribe({
      next: (res: any) => {
        let filepath = this.fileUrl + "/" + res.data.replace(".", "~");
        window.open(filepath);
        this.spinner.hide();
      },
      error: (error: any) => {
        this.spinner.hide();
      },
    });
  }

  /* Modification Request Process :: Start  */

  requestToModify(encId: string){
    this.alertHelper
      .confirmAlert("Are you sure to want request for modify?")
      .then((result) => {
        if(result.value){
          this.spinner.show(); // show spinner
          this.isLoading = true;
          let paramList: any = {
            studentId: encId,
            createdBy: this.userProfile.userId,
          };
          this.studentServices.requestToModify(paramList).subscribe({
            next: (res: any) => {
              if (res?.status === "SUCCESS") {
                this.alertHelper.successAlert("Saved!",res.msg,"success")
                .then(() => {
                  this.loadData(this.getSearchParams());
                });
              } else {
                this.alertHelper.viewAlert("info", res?.msg, "");
              }
              this.spinner.hide();
              this.isLoading = false;
            },
            error: (error: any) => {
              this.spinner.hide(); //==== hide spinner
              this.isLoading = false;
              this.errorHandler.serverSideErrorHandler(error); // server side error handler
            },
          });
        }
      });
  }

  /* Modification Request Process :: End  */

  clearControl(formName:any,controlNames:string[],focusControl:any=''){
    controlNames.forEach((controlName:any,index:number) => {
      formName.get(controlName)?.patchValue(""); 
    });
    if(focusControl){
      const invalidControl = this.el.nativeElement.querySelector(
        '[formControlName="'+focusControl+'"]'
      );
      invalidControl.focus();  
    }  
  }

}
