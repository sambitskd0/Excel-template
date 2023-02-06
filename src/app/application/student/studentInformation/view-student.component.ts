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
import { SchoolService } from "../../school/services/school.service";
import { StudentInformationService } from "../services/student-information.service";
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from "src/environments/environment";
import { PrivilegeHelper } from "src/app/core/helpers/privilege-helper";

@Component({
  selector: "app-view-student",
  templateUrl: "./view-student.component.html",
  styleUrls: ["./view-student.component.css"],
})
export class ViewStudentComponent implements OnInit, AfterViewInit {
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
  facilitationForm!: FormGroup;
  studName: any = "";
  facilationStudentId: any = "";
  facilationAcademicyear: any = "";
  receivedDressSet: any = "0";
  facilityId: any = "0";
  freeTextBook: any = "0";
  freeTransport: any = "0";
  freeEscort: any = "0";
  freeBicycle: any = "0";
  freeHostel: any = "0";
  attendedSpecialTraining: any = "0";
  homeless: any = "0";
  gotMedicine: any = "0";
  ironTablets: any = "0";
  dewormingTablets: any = "0";
  vitaminATablets: any = "0";
  hostleFacilityList: any =[];
  facilityList: any =[];
  specialTrainingList: any =[];
  homelessList: any =[];
  studFacilityData: any =[];
  studFacilityRes: any =[];
  submitted = false;
  checkAll: boolean = false;
  isChecked: boolean = false;

  delList : any = [];
  delListId : any = [];
  noDelList : any = [];
  noDelListId : any = [];

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
    "tagSubject",
    "studentFacility",
    "Transfer",
    "Pending",
    "Status",
    "Verification Status",
  ]; // define mat table columns


  allLabelForStudFacilation: string[] = [
    "Student received set of dresses",
    "Facilities recived by CWSN",
    "Free set of text books",
    "Free transport",
    "Free escort facility",
    "Free bicycle",
    "Free hostel facility",
    "Child attended special training",
    "Whether the child is homeless",
    "Did you get any medicine in last three months",
    "What kind of medicine did you get in the last three months(Iron and Folic acid tablets)",
    "What kind of medicine did you get in the last three months(Deworming tablets)",
    "What kind of medicine did you get in the last three months(Vitamin A tablets)",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
  ];
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

  verifyList : any = [];
  verifyListId : any = [];
  noVerifyList : any = [];
  noVerifyListId : any = [];

  modifyList : any = [];
  modifyListId : any = [];
  noModifyList : any = [];
  noModifyListId : any = [];

  approveList : any = [];
  approveListId : any = [];
  noApproveList : any = [];
  noApproveListId : any = [];

/** Verification Form Controls Intialization :: End */


/** CR Form Controls Intialization :: Start */
crApprovalForm!: FormGroup;
crStatus:any = '2';
crRemarks:any = '';

bulkApprovalFlag = 0;

approveCRList : any = [];
approveCRListId : any = [];
noApproveCRList : any = [];
noApproveCRListId : any = [];
/** CR Form Controls Intialization :: End */

/** Transfer Form Controls Intialization :: Start */
  studentTransferForm!: FormGroup;
  trStdCode :any = '';
  trStdName :any = '';
  trActionId:any = '2';
  trUDISECode:any = '';
  trDistrictId:any = '';
  trBlockId:any = '';
  trClusterId:any = '';
  trSchoolId:any = '';
  trStudentId:any = '';

  trDistrictSelect :boolean = true;
  trDistrictData:any = [];

  trBlockSelect :boolean = true;
  trBlockData:any = [];

  trClusterSelect :boolean = true;
  trClusterData:any = [];

  trSchoolSelect :boolean = true;
  trSchoolData:any = [];

  modalTCData!: any;

  @ViewChild('stdVerifyClose') stdVerifyClose!:any;
  @ViewChild('stdCRClose') stdCRClose!:any;
  @ViewChild('stdTransferClose') stdTransferClose!:any;
  @ViewChild('stdSubTagClose') stdSubTagClose!:any;
  @ViewChild('facilationClose') facilationClose!:any;
  
/** Transfer Form Controls Intialization :: End */
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
    this.initializeSubjectTagForm();
    this.initializeFacilitationForm();
    this.initStudentTransfer();
    this.initializeVerifyForm();
    this.initializeCRForm();
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

  initializeFacilitationForm() {
    this.facilitationForm = this.formBuilder.group({
      receivedDressSet: [this.receivedDressSet],
      facilityId: [this.facilityId],
      freeTextBook: [this.freeTextBook],
      freeTransport: [this.freeTransport],
      freeEscort: [this.freeEscort],
      freeBicycle: [this.freeBicycle],
      freeHostel: [this.freeHostel],
      attendedSpecialTraining: [this.attendedSpecialTraining],
      homeless: [this.homeless],
      gotMedicine: [this.gotMedicine],
      ironTablets: [this.ironTablets],
      dewormingTablets: [this.dewormingTablets],
      vitaminATablets: [this.vitaminATablets],
      academicYearStudent: [this.academicYearStudent],
      studentId: [this.studentId],
      classId: [this.classId],
      streamId: [this.streamId],
      groupId: [this.groupId],
      section: [this.section],
      schoolId: [this.schoolId],
      userId: [this.userId],
    });
  }
  initializeSubjectTagForm() {
    this.tagSubjectForm = this.formBuilder.group({
      opsubjectTaggingArray: this.formBuilder.array(this.opsubjectTaggingArray),
      compsubjectTaggingArray: this.formBuilder.array(this.compsubjectTaggingArray),
      classNameModal: [this.classNameModal],
      streamId: [this.streamId],
      groupId: [this.groupId],
      academicYearStudent: [this.academicYearStudent],
      studentId: [this.studentId],
      schoolId: [this.schoolId],
    });
  }

  loadAnnexturesData() {
    const anxTypes = ["STREAM_TYPE", "STREAM_GROUP_TYPE","HOSTEL_FACILITY","STD_FACILITY","SPECIAL_TRAINING_TYPE","CHILD_HOMELESS"];
    // this.anxData = this.commonFunction.getAnnextureData(anxTypes);
    let annextureData!: [];
    this.commonService.getCommonAnnexture(anxTypes).subscribe({
      next: (res: any) => {
        annextureData = res?.data;
        this.streamList = res?.data?.STREAM_TYPE;
        this.groupList = res?.data?.STREAM_GROUP_TYPE;
        this.hostleFacilityList = res?.data?.HOSTEL_FACILITY;
        this.facilityList = res?.data?.STD_FACILITY;
        this.specialTrainingList = res?.data?.SPECIAL_TRAINING_TYPE;
        this.homelessList = res?.data?.CHILD_HOMELESS;
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
    this.spinner.show(); 
    this.studentServices.viewStudentList(this.paramObj).subscribe({
      next: (res: any) => {
        this.resultListData.length = previousSize; // set current size
        res?.success === true && this.resultListData.push(...res?.data); // merge with existing data
        this.resultListData.length = res?.totalRecord; // update length
        this.dataSource.paginator = this.paginator; // update paginator
        this.dataSource._updateChangeSubscription(); // update table
        this.isLoading = false;
        this.emptyResult = this.resultListData.length ? false : true;
        this.spinner.hide();

        /* Bulk Delete,Verify & Modify Req Flag Check :: Start */
        this.resultListData.forEach((value:any) => {

          if(this.adminPrivilege && value?.verificationStatus == 0 && !value?.freezStatus && value?.crStatus == 0){
            this.delList[value.studentId] = value.studentCode;   
            this.delListId.push(value.studentId);
          }else{
            this.noDelList[value.studentId] = value.studentCode;   
            this.noDelListId.push(value.studentId);
          }

          if(value.verificationStatus<1){
            this.verifyList[value.studentId] = value.studentCode;   
            this.verifyListId.push(value.studentId);
          }else{
            this.noVerifyList[value.studentId] = value.studentCode;   
            this.noVerifyListId.push(value.studentId);
          }    

          if(value?.freezStatus && value?.crStatus != 1){
            this.modifyList[value.studentId] = value.studentCode;   
            this.modifyListId.push(value.studentId);
          }else{
            this.noModifyList[value.studentId] = value.studentCode;   
            this.noModifyListId.push(value.studentId);
          }    

          if(value.crStatus==1){
            this.approveCRList[value.studentId] = value.studentCode;   
            this.approveCRListId.push(value.studentId);
          }else{
            this.noApproveCRList[value.studentId] = value.studentCode;   
            this.noApproveCRListId.push(value.studentId);
          }   

          if(value.verificationStatus==1){
            this.approveList[value.studentId] = value.studentCode;   
            this.approveListId.push(value.studentId);
          }else{
            this.noApproveList[value.studentId] = value.studentCode;   
            this.noApproveListId.push(value.studentId);
          } 

        }); 
        /* Bulk Delete,Verify & Modify Req Flag Check :: End */

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
    this.stdSearchForm.controls["section"].patchValue("");
    this.stdSearchForm.controls["stream"].patchValue("");
    this.stdSearchForm.controls["group"].patchValue("");
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
    this.stdSearchForm.controls["group"].patchValue("");
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

  deleteStudent(encId: string) {
    this.alertHelper
      .deleteAlert("Are you sure to delete?", "", "question", "Yes, delete it!")
      .then((result) => {
        if (result.value) {
          this.spinner.show(); // show spinner
          this.isLoading = true;
          let paramList: any = {
            encId: encId,
            createdBy: this.userProfile.userId,
          };
          this.studentServices.deleteStudent(paramList).subscribe({
            next: (res: any) => {
              if (res?.status === "SUCCESS") {
                this.alertHelper
                  .successAlert(
                    "Deleted!",
                    "student deleted successfully",
                    "success"
                  )
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

  deleteMultipleStudents() {
    this.submitted = true;
    const checkRecordArr: FormArray = this.viewTableForm.get(
      "checkRecordArr"
    ) as FormArray;
    if (checkRecordArr.controls.length < 1) {
      this.alertHelper.viewAlertHtml(
        "error",
        "Invalid",
        "Select atleast one record !"
      );
      return;
    }
    if (this.viewTableForm.valid == true) {

      let diffIds : any = [];
      let difference = checkRecordArr.value.filter((x: any)  => !this.delListId.includes(x));
      // console.log('difference:::',difference);
      if(difference.length>0){
        difference.forEach((val:any) => {        
          diffIds.push(this.noDelList[val]);
        });
        
        let errMsg = 'Some of the student(s) profiles are not eligible for delete, please unselect the following student(s).<br/>';

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

      this.alertHelper.deleteAlert("Are you sure to delete?", "", "question", "Yes, delete it!").then((result) => {
        if (result.value) {
          this.spinner.show();
          this.studentServices
            .deleteMultipleStudent(this.viewTableForm.value)
            .subscribe({
              next: (res: any) => {
                this.spinner.hide();
                this.alertHelper
                  .successAlert(
                    "Deleted!",
                    "Student records deleted successfully.",
                    "success"
                  )
                  .then(() => {
                    this.resetFormArray();
                    this.initializeviewTableForm();
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
            });
        }
      });
    }
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

  subjectTag(studentId: any,academicYear: any,classId: any,streamId: any,groupId: any,schoolId: any,tagStatus:any) {
    this.compsubjectTaggingArray =[];
    this.opsubjectTaggingArray =[];
    const objParams ={studentId:studentId,academicYear:academicYear,classId:classId,streamId:streamId,groupId:groupId,schoolId:schoolId}
    this.spinner.show(); 
    this.studentServices
      .studentSubjectTag(objParams)
      .subscribe((res: any = []) => {
        this.spinner.hide();        
        this.tagSubjectData = res.data;       
       this.tagSubCompData = this.tagSubjectData.filter((obj:any) => {
          return obj.subjectType === 1;
        });
        this.tagSubOptData = this.tagSubjectData.filter((obj:any) => {
          return obj.subjectType === 2;
        });
        this.tagSubCompData.forEach((obj:any,key: string) => {
          this.compsubjectTaggingArray[key] = obj.subjectId;
        });
        res?.selectedSub.forEach((obj:any,key: string) => {
          this.opsubjectTaggingArray[key] = obj.subjectId;         
        });
        this.classNameModal = res?.classId;
        this.streamId = res?.streamId;
        this.groupId = res?.groupId;
        this.academicYearStudent = res?.academicYear;
        this.studentId = res?.studentId;
        this.tagStatusSubject = tagStatus;
        
        this.initializeSubjectTagForm();
      });
  }
  studFacility(studentId: any,academicYear: any,schoolId: any, classId: any,streamId: any,groupId: any,section: any,studentName:any) {
    this.initializeFacilitationForm();
    this.studName=studentName;
    this.el.nativeElement.querySelector('[formControlName="receivedDressSet"]').focus();
    this.facilitationForm.patchValue({academicYearStudent: academicYear});
    this.facilitationForm.patchValue({studentId: studentId});
    this.facilitationForm.patchValue({classId: classId});
    this.facilitationForm.patchValue({streamId: streamId});
    this.facilitationForm.patchValue({groupId: groupId});
    this.facilitationForm.patchValue({section: section});
    this.studFacilityData=[];
    const objFacilityParams ={studentId:studentId,academicYear:academicYear,schoolId:schoolId,classId:classId,streamId:streamId,groupId:groupId,section:section}
    this.spinner.show(); 
    this.studentServices
      .studentFacilityTag(objFacilityParams)
      .subscribe((res: any = []) => {
        this.spinner.hide();        
            this.studFacilityRes = res.data;
            if(this.studFacilityRes.length>0){
            this.studFacilityData=this.studFacilityRes[0];
            this.receivedDressSet =  this.studFacilityData?.receivedDressSet;
            this.facilityId =  this.studFacilityData?.facilityId;
            this.freeTextBook =  this.studFacilityData?.freeTextBook;
            this.freeTransport =  this.studFacilityData?.freeTransport;
            this.freeEscort =  this.studFacilityData?.freeEscort;
            this.freeBicycle =  this.studFacilityData?.freeBicycle;
            this.freeHostel =  this.studFacilityData?.freeHostel;
            this.attendedSpecialTraining =  this.studFacilityData?.attendedSpecialTraining;
            this.homeless =  this.studFacilityData?.homeless;
            this.gotMedicine =  this.studFacilityData?.gotMedicine?.toString();
            this.ironTablets =  this.studFacilityData?.ironTablets?.toString();
            this.dewormingTablets =  this.studFacilityData?.dewormingTablets?.toString();
            this.vitaminATablets =  this.studFacilityData?.vitaminATablets?.toString();
            this.academicYearStudent = res?.academicYear;
            this.studentId = res?.studentId;
            this.classId = res?.classId;
            this.streamId = res?.streamId;
            this.groupId = res?.groupId;
            this.section = res?.section;
            this.initializeFacilitationForm();
          }else{
            this.resetFacilitationForm();
           // this.initializeFacilitationForm();
          }      
      });
  }
  resetFacilitationForm(){
    this.medicineRdControl("0");
    this.facilitationForm.patchValue({receivedDressSet: 0});
    this.facilitationForm.patchValue({facilityId: 0});
    this.facilitationForm.patchValue({freeTextBook: 0});
    this.facilitationForm.patchValue({freeTransport: 0});
    this.facilitationForm.patchValue({freeEscort: 0});
    this.facilitationForm.patchValue({freeBicycle: 0});
    this.facilitationForm.patchValue({freeHostel: 0});
    this.facilitationForm.patchValue({attendedSpecialTraining: 0});
    this.facilitationForm.patchValue({homeless: 0});
    this.facilitationForm.patchValue({gotMedicine: "0"});
    this.facilitationForm.patchValue({ironTablets: "0"});
    this.facilitationForm.patchValue({dewormingTablets: "0"});
    this.facilitationForm.patchValue({vitaminATablets: "0"});
  }
  opSubCheckboxChange(event: any) {
    const opsubjectTaggingArray: FormArray = this.tagSubjectForm.get(
      "opsubjectTaggingArray"
    ) as FormArray;
    if (event.target.checked) {
      opsubjectTaggingArray.push(new FormControl(event.target.value));
    } else {      
      let i: number = 0;
      opsubjectTaggingArray.controls.forEach((item: any) => {
        if (item.value == event.target.value) {
          opsubjectTaggingArray.removeAt(i);
          return;
        }
        i++;
      });
    }
  }

  comSubCheckboxChange(event: any){
    const compsubjectTaggingArray: FormArray = this.tagSubjectForm.get(
      "compsubjectTaggingArray"
    ) as FormArray;
    if (event.target.checked) {
      compsubjectTaggingArray.push(new FormControl(event.target.value));
    } else {      
      let i: number = 0;
      compsubjectTaggingArray.controls.forEach((item: any) => {
        if (item.value == event.target.value) {
          compsubjectTaggingArray.removeAt(i);
          return;
        }
        i++;
      });
    }
  }

  facilitationSumbit(){
    if (this.facilitationForm.valid == true) {
      this.alertHelper.submitAlert().then((result) => {
        if (result.value) {
          this.spinner.show();
          this.studentServices
            .addFacilatationToStudent(this.facilitationForm.value)
            .subscribe({
              next: (res: any) => {
                this.spinner.hide();
                this.alertHelper
                  .successAlert(
                    "Saved!",
                    "Student Facilatation added successfully.",
                    "success"
                  )
                  .then(() => {
                    this.facilationClose.nativeElement.click();
                    this.initializeForm();
                    this.getDistrict();                    
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
            });
        }
      });
    }
    
  }
  medicineRdControl(val: any) {
    this.gotMedicine = val;
    //this.studentForm.patchValue({ medicine: "" });
    this.facilitationForm.patchValue({ ironTablets: "0" });
    this.facilitationForm.patchValue({ dewormingTablets: "0" });
    this.facilitationForm.patchValue({ vitaminATablets: "0" });
  }
  tagSubjectSumbit(){
    if (this.tagSubjectForm.valid == true) {
      this.alertHelper.submitAlert().then((result) => {
        if (result.value) {
          this.spinner.show();
          this.studentServices
            .addSubjectToStudent(this.tagSubjectForm.value)
            .subscribe({
              next: (res: any) => {
                this.spinner.hide();
                this.alertHelper
                  .successAlert(
                    "Saved!",
                    "Subject Tagged successfully.",
                    "success"
                  )
                  .then(() => {
                    this.stdSubTagClose.nativeElement.click();
                    this.initializeForm();
                    this.getDistrict();                    
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
            });
        }
      });
    }
    
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

      // validation logic for remarks
      if (validationType === "crRemarks" && parentValue == 3) {
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
    this.stdVerifyForm = this.formBuilder.group({
      verifyStatus: [this.verifyStatus,Validators.required],
      //remarks: [this.remarks,Validators.required],
      remarks: [
        this.remarks,
        [
          Validators.max(500),
          this.conditionalValidator(
            () => this.stdVerifyForm?.get("verifyStatus")?.value,
            Validators.required,
            "conditionalValidation",
            "remarks"
          ),
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

  bulkVerifyReq(){
    const checkRecordArr: FormArray = this.viewTableForm.get(
      "checkRecordArr"
    ) as FormArray;
    
    if (checkRecordArr.controls.length < 1) {
      this.alertHelper.viewAlertHtml(
        "error",
        "Invalid",
        "Select atleast one record for verification request !!!"
      );
      return;
    }

    // let intersection = checkRecordArr.value.filter((x: any) => this.verifyListId.includes(x));
    // console.log('intersection:::',intersection);

    let diffIds : any = [];
    let difference = checkRecordArr.value.filter((x: any)  => !this.verifyListId.includes(x));
    console.log('verify difference:::',difference);
    if(difference.length>0){
      difference.forEach((val:any) => {        
        diffIds.push(this.noVerifyList[val]);
      });
      
      let errMsg = 'Some of the student(s) are not eligible for request verification, please unselect the following student(s).<br/>' ;

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
    .confirmAlert("Are you sure to send verification request for all the selected student at a time ?")
    .then((result) => {
      if(result.value){
        this.spinner.show(); // show spinner
        this.isLoading = true;
        let paramList: any = {
          studentIds: checkRecordArr.value,
          createdBy: this.userProfile.userId,
          sessionValue: this.userProfile,
        };
        this.studentServices.bulkVerifyReq(paramList).subscribe({
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

  bulkModifyReq(){
    const checkRecordArr: FormArray = this.viewTableForm.get(
      "checkRecordArr"
    ) as FormArray;
    
    if (checkRecordArr.controls.length < 1) {
      this.alertHelper.viewAlertHtml(
        "error",
        "Invalid",
        "Select atleast one record for modification request !!!"
      );
      return;
    }

    // let intersection = checkRecordArr.value.filter((x: any) => this.verifyListId.includes(x));
    // console.log('intersection:::',intersection);

    let diffIds : any = [];
    let difference = checkRecordArr.value.filter((x: any)  => !this.modifyListId.includes(x));
    console.log('modify difference:::',difference);
    if(difference.length>0){
      difference.forEach((val:any) => {        
        diffIds.push(this.noModifyList[val]);
      });
      
      let errMsg = 'Some of the student(s) are not eligible for request modification, please unselect the following student(s).<br/>' ;

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
    .confirmAlert("Are you sure to send modification request for all the selected student at a time ?")
    .then((result) => {
      if(result.value){
        this.spinner.show(); // show spinner
        this.isLoading = true;
        let paramList: any = {
          studentIds: checkRecordArr.value,
          createdBy: this.userProfile.userId,
          sessionValue:this.userProfile,
        };
        this.studentServices.bulkModifyReq(paramList).subscribe({
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

  requestforVerification(encId: string){
    this.alertHelper
      .confirmAlert("Are you sure to request for verification?")
      .then((result) => {
        if(result.value){
          this.spinner.show(); // show spinner
          this.isLoading = true;
          let paramList: any = {
            studentId: encId,
            createdBy: this.userProfile.userId,
            sessionValue : this.userProfile,
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

  rdverifyStatusControl(val: any) {
    this.verifyStatus = val;
  }

  onVerifySubmit(){
    this.submitted = true;

    if ("INVALID" === this.stdVerifyForm.status) {
      for (const key of Object.keys(this.stdVerifyForm.controls)) {
        if (this.stdVerifyForm.controls[key].status === "INVALID") {
          const invalidControl = this.el.nativeElement.querySelector(
            '[formControlName="' + key + '"]'
          );
          invalidControl.focus();
          this.customValidators.customFormValidationHandler(this.stdVerifyForm);
          break;
        }
      }
    }

    if (this.stdVerifyForm.valid === true && this.checkRemarks()) {
      this.alertHelper.submitAlert().then((result: any) => {
        if(result.value) {
          this.spinner.show(); // ==== show spinner
          this.studentServices
            .verifyStudent(this.stdVerifyForm.value)
            .subscribe({
              next: (res: any) => {
                this.spinner.hide(); //==== hide spinner
                this.alertHelper.successAlert("Saved!",res.msg,"success")
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

  initializeCRForm() {
    this.crApprovalForm = this.formBuilder.group({
      crStatus: [this.crStatus,Validators.required],
      //crRemarks: [this.crRemarks,Validators.required],
      crRemarks: [
        this.crRemarks,
        [
          Validators.max(500),
          this.conditionalValidator(
            () => this.crApprovalForm?.get("crStatus")?.value,
            Validators.required,
            "conditionalValidation",
            "crRemarks"
          ),
        ],
      ],
      studentId: [this.studentId],
      createdBy: [this.userProfile.userId],
      sessionValue: [this.userProfile],
      schoolId: [this.schoolId],
    });
  }

  checkCRRemarks(){
    if(this.crApprovalForm?.get("crStatus")?.value == 3 && this.crApprovalForm?.get("crRemarks")?.value.length == 0){
      const invalidControl = this.el.nativeElement.querySelector(
        '[formControlName="crRemarks"]');
          invalidControl.focus();
          this.alertHelper.viewAlert("error","Invalid","Please provide revert remarks.");
      return;
    }else{
      return true;
    }
  }

  rdCRStatusControl(val: any) {
    this.crStatus = val;
  }

  approvalForCR(encId:string){
    this.initializeCRForm();
    this.crApprovalForm.patchValue({ studentId: encId });
    this.crApprovalForm.patchValue({ schoolId: this.stdSearchForm?.get("searchSchoolId")?.value });
  }

  crApprovalSubmit(){
    this.submitted = true;

    if ("INVALID" === this.crApprovalForm.status) {
      for (const key of Object.keys(this.crApprovalForm.controls)) {
        if (this.crApprovalForm.controls[key].status === "INVALID") {
          const invalidControl = this.el.nativeElement.querySelector(
            '[formControlName="' + key + '"]'
          );
          invalidControl.focus();
          this.customValidators.customFormValidationHandler(this.crApprovalForm);
          break;
        }
      }
    }

    if (this.crApprovalForm.valid === true && this.checkCRRemarks()) {
      this.alertHelper.submitAlert().then((result: any) => {
        if(result.value) {
          this.spinner.show(); // ==== show spinner
          this.studentServices
            .crApproval(this.crApprovalForm.value)
            .subscribe({
              next: (res: any) => {
                this.spinner.hide(); //==== hide spinner
                this.alertHelper.successAlert("Saved!",res.msg,"success")
                  .then(() => {
                    this.stdCRClose.nativeElement.click();
                    this.clearControl(this.crApprovalForm,["crStatus","studentId","crRemarks"]);
                    this.initializeCRForm();  
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
      for(const control of Object.keys(this.crApprovalForm.controls)) {
        this.crApprovalForm.controls[control].markAsTouched();
    
      }
    }
  }

  bulkCRAprroval(){
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

    // let intersection = checkRecordArr.value.filter((x: any) => this.approveCRListId.includes(x));
    // console.log('intersection:::',intersection);

    let diffIds : any = [];
    let difference = checkRecordArr.value.filter((x: any)  => !this.approveCRListId.includes(x));
    // console.log('difference:::',difference);
    if(difference.length>0){
      difference.forEach((val:any) => {        
        diffIds.push(this.noApproveList[val]);
      });
      
      let errMsg = 'Some of the student(s) profiles are not eligible for approval, please unselect the following student(s).<br/>' ;
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
          sessionValue: this.userProfile,
        };
        this.studentServices.bulkCRApproval(paramList).subscribe({
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
    
    let pageUrl = environment.BASEURL+'/Application/student/info/preview/'+encId;
    window.open(
      pageUrl,
      "_blank"
    );
  }

  /** Student Transer Actions :: Start */

  studentTransferHandle(encId:any,stdCode:number,stdName:string){
    this.trStudentId = encId;
    this.trStdCode = stdCode;
    this.trStdName = stdName;
    this.loadTrDistrictData();
    this.initStudentTransfer();
  }

  transferRdControl(val: any){
    this.trActionId = val;
    this.studentTransferForm.patchValue({ trUDISECode: "" });
    this.studentTransferForm.patchValue({ trDistrictId: "" });
    this.studentTransferForm.patchValue({ trBlockId: "" });
    this.studentTransferForm.patchValue({ trClusterId: "" });
    this.studentTransferForm.patchValue({ trSchoolId: "" });
  }

  loadTrDistrictData(){
    this.trDistrictSelect = false;
    this.trBlockData = [];
    this.trBlockId = '';
    this.trClusterData = [];
    this.trClusterId = '';
    this.trSchoolId = '';
    this.trSchoolData = [];
    this.commonService.getAllDistrict().subscribe((res: any = []) => {
      this.trDistrictData = res.data;
      this.trDistrictSelect = true;
    });
  }

  loadtTrBlockData(districtId: any){
    this.trBlockSelect = false;
    this.trDistrictId = districtId;
    this.trBlockData = [];
    this.trBlockId = '';
    this.trClusterData = [];
    this.trClusterId = '';
    this.trSchoolId = '';
    this.trSchoolData = [];
    if (districtId !== "") {
      this.commonService
        .getBlockByDistrictid(districtId)
        .subscribe((res: any = []) => {
          this.trBlockData = res.data;
          this.trBlockSelect = true;
        });
    } else {
      this.trBlockSelect = true;
    }
  }

  loadtTrClusterData(id: any) {
    this.trClusterSelect = false;
    this.trBlockId = id;
    this.trClusterData = [];
    this.trClusterId = '';
    this.trSchoolId = '';
    this.trSchoolData = [];
    if (id !== "") {
      this.commonService.getClusterByBlockId(id).subscribe((res: any = []) => {
        this.trClusterData = res.data;
        this.trClusterSelect = true;
      });
    } else {
      this.trClusterSelect = true;
    }
  }

  loadtTrSchoolData(clusterId: any) {
    this.trSchoolSelect = false;
    this.trClusterId = clusterId;
    this.trSchoolData = [];
    this.trSchoolId = '';
    let paramList: any = { clusterId: this.trClusterId };
    if (clusterId !== "") {
      this.schoolService.getSchoolList(paramList).subscribe((res: any = []) => {
        this.trSchoolData = res.data;
        this.trSchoolSelect = true;
        if (this.userProfile.udiseCode != '') {
          this.trSchoolData = this.trSchoolData.filter((dis: any) => {
            return dis.schoolUdiseCode != this.userProfile.udiseCode;
          });
        } 
      });
    } else {
      this.trSchoolSelect = true;
    }
  }

  initStudentTransfer(){
    this.studentTransferForm = this.formBuilder.group({
      trActionId:[this.trActionId,Validators.required],
      trUDISECode:[this.trUDISECode,[Validators.pattern("^[0-9]*$"),
      Validators.maxLength(15)]],
      trDistrictId:[this.trDistrictId],
      trBlockId:[this.trBlockId],
      trClusterId:[this.trClusterId],
      trSchoolId:[this.trSchoolId,Validators.required],
      trStudentId:[this.trStudentId,Validators.required],
      academicYear: [this.academicYear],
      createdBy: [this.userProfile.userId],
      sessionValue: [this.userProfile],
    });
  }

  searchByUDISECode(){
    if(this.studentTransferForm.controls["trUDISECode"].value!=''){
      if(this.studentTransferForm.controls["trUDISECode"].value == this.userProfile.udiseCode){
        this.alertHelper.viewAlertHtml(
          "warning",
          "UDISE Code Error",
          "You are searching for your own school!"
        );
      }else{
        this.spinner.show();
        this.commonService
          .getSchoolBasicInfo({
            schoolUdiseCode: this.studentTransferForm.controls["trUDISECode"].value,
            academicYear: this.academicYear,
          })
          .subscribe((res: any = []) => {
            this.spinner.hide();
            if(res.data){
              this.studentTransferForm.patchValue({ trDistrictId: res.data?.districtId });
              this.loadtTrBlockData(res.data?.districtId);
              this.studentTransferForm.patchValue({ trBlockId: res.data?.blockId });
              this.loadtTrClusterData(res.data?.blockId);
              this.studentTransferForm.patchValue({ trClusterId: res.data?.clusterId });
              this.loadtTrSchoolData(res.data?.clusterId);
              this.studentTransferForm.patchValue({ trSchoolId: res.data?.schoolId });
            }else{
              //this.initStudentTransfer();
              this.clearControl(this.studentTransferForm,["trDistrictId","trBlockId","trClusterId","trSchoolId"],'trUDISECode');
              this.alertHelper.viewAlertHtml(
                "warning",
                "Invalid UDISE Code",
                "There is no record found against this UDISE Code"
              );
            }
          });
      }      
    }else{
      const invalidControl = this.el.nativeElement.querySelector(
        '[formControlName="trUDISECode"]'
      );
      invalidControl.focus();
    }
  }

  submitTransfer(){
    if(this.studentTransferForm.controls["trActionId"].value == 1 && this.studentTransferForm.controls["trSchoolId"].value == ''){
      const invalidControl = this.el.nativeElement.querySelector(
        '[formControlName="trSchoolId"]'
      );
      invalidControl.focus();
      this.alertHelper.viewAlertHtml(
        "error",
        "Invalid input",
        "Please select the school to transfer"
      );
    }else{
      this.alertHelper.submitAlert().then((result: any) => {
        if(result.value) {
          this.spinner.show(); // ==== show spinner
          this.studentServices
            .studentTransfer(this.studentTransferForm.value)
            .subscribe({
              next: (res: any) => {
                this.spinner.hide(); //==== hide spinner
                this.alertHelper.successAlert("Saved!",res.msg,"success")
                  .then(() => {
                    this.stdTransferClose.nativeElement.click();
                    this.trActionId = "2";
                    this.clearControl(this.studentTransferForm,["trUDISECode","trDistrictId","trBlockId","trClusterId","trSchoolId"]);
                    this.initStudentTransfer();   
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
            });
        }
      });
    }      
  }

  /** Student Transer Actions :: End */

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
  
  TCInfo(stdEncId:any){ 
    this.spinner.show();
    const paramObj = {
      stdEncId: stdEncId,
      schoolEncId:this.schoolId,
      academicYear:this.academicYear
    };
    this.studentServices.getTCInfo(paramObj).subscribe({
      next: (res: any) => {
        this.modalTCData = res?.data;    
        this.spinner.hide();
      },
      error: (error: any) => {
        this.isLoading = false;
        this.spinner.hide();
      },
    });
  }

  /* Modification Request Process :: Start  */

  requestToModify(encId: string){
    this.alertHelper
      .confirmAlert("Are you sure to request for modify?")
      .then((result) => {
        if(result.value){
          this.spinner.show(); // show spinner
          this.isLoading = true;
          let paramList: any = {
            studentId: encId,
            createdBy: this.userProfile.userId,
            sessionValue: this.userProfile,
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
