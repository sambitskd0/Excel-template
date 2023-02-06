import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
} from "@angular/core";
import { FormGroup, FormBuilder, Validators, NgForm, FormArray, FormControl } from "@angular/forms";
import { Constant } from "src/app/shared/constants/constant";
import { CommonserviceService } from "src/app/core/services/commonservice.service";
import { SchoolService } from "../../school/services/school.service";
import { NgxSpinnerService } from "ngx-spinner";
import { DataTableDirective } from "angular-datatables";
import { AlertHelper } from "src/app/core/helpers/alert-helper";
import { RegistrationService } from "../services/registration.service";
import { Subject } from "rxjs";
import { IndustrialTrainingService } from "../services/industrial-training.service";
import { ProgressBarMode } from "@angular/material/progress-bar";
import { MatSort } from "@angular/material/sort";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableExporterDirective } from "mat-table-exporter";
import { MatTableDataSource } from "@angular/material/table";
import { CustomValidators } from "src/app/shared/validations/custom-validators";
import { TeacherVerificationService } from "../services/teacher-verification.service";
import { environment } from "src/environments/environment";
import { PrivilegeHelper } from "src/app/core/helpers/privilege-helper";
import { Router } from "@angular/router";
import { Location } from "@angular/common";

@Component({
  selector: "app-view-teacher",
  templateUrl: "./view-teacher.component.html",
  styleUrls: ["./view-teacher.component.css"],
})
export class ViewTeacherComponent implements AfterViewInit, OnInit {
  public fileUrl = environment.filePath;
  schoolVerificationForm!: FormGroup;
  beoVerificationForm!: FormGroup;
  deoVerificationForm!: FormGroup;
  changeRequestForm!: FormGroup;
  allErrorMessages: string[] = [];
  submitted = false;
  public show: boolean = true;
  public buttonName: any = "Show";
  optionVal: any;
  optionstream: any;
  config = new Constant();
  genders = this.config.genderList;
  religions = this.config.religionList;
  socialCatagories = this.config.socialCatagoryList;
  maritialStatuses = this.config.maritalList;
  bloodGroups = this.config.bloodGroupList;
  districts: any = "";
  districtData: any = "";
  showSpinnerBlock: boolean = false;
  blockData: any = "";
  clusterData: any = "";
  permanentBlockData: any = "";
  currentBlockData: any = "";
  stateOthers: any = "";
  cstateOthers: any = "";
  scDisrtictChanged: boolean = false;
  scBlockChanged: boolean = false;
  scClusterChanged: boolean = false;
  pBlockChanged: boolean = false;
  cBlockChanged: boolean = false;
  scSchoolChanged: boolean = false;
  teacherTitles: any = "";
  teacherTitleChanged: boolean = false;
  teacherAppointmentChanged: boolean = false;
  teacherAppointSubjectChanged: boolean = false;
  appointType: boolean = false;
  appointingAuthority: boolean = false;
  disability: boolean = false;
  teacherImageChange: boolean = false;
  appointmentType: any = "";
  teacherAppointSubject: any = "";
  teacherAppointment: any = "";
  // teacherTitle: any ="";
  appointingAuth: any = "";
  disabilityType: any = "";
  scSchool: any = "";
  schoolDatas: any = "";
  getSchoolData: any = "";
  fileToUploadTeacher: any = "";
  imageUrlTeacher: any = "";
  isimageUrlTeacher: boolean = false;
  teacherListData: any = "";
  teacherMgmtData: any = [];
  managemanentData: any = "";
  schoolMgmtChanged: boolean = false;
  emptyCheck: boolean = false;
  csvExports: any = "";
  dtInstance: any = "";
  // userProfile:any=[];
  sessionSchoolId: any = "";
  districtName: any = "";
  blockName: any = "";
  clusterName: any = "";
  teacherList: any = "";
  IschoolIds: any = "";
  isLoading = false;
  isNorecordFound: boolean = false;
  schoolId: any = "";
  userId: any = "";
  loginUserTypeId: any = "";
  pageIndex: any = 0;
  previousSize: any = 0;
  isInitAdmin: boolean = false;
  paramObj: any; 
  serviceType: string = "Search";
  @ViewChild("teacherSearchForm") teacherSearchForm!: NgForm;
  public userProfile = this.commonService.getUserProfile();
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
  displayedColumns: string[] = []; // define mat table columns

  resultListData: any = [];
  questionDetailsData!: any;
  dataSource = new MatTableDataSource(this.resultListData);
  //end
  plPrivilege:string="view"; //For menu privilege
	adminPrivilege: boolean = false;
  searchAcademicYear: any = "";
  searchDistrictId: any = "";
  searchBlockId: any = "";
  searchClusterId: any = "";
  searchSchoolId: any = "";
  searchBillNo: any = "";
  searchTeacherTitle: any = "";
  searchNatureOfAppointmt: any = "";
  searchTeacherId: any = "";
  searchTeacherTempLoginId: any = "";
  searchTeacherName: any = "";
  searchStatusWise: any = "";
  searchSelManagement: any = "";
  searchVerification: any = "";

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
  blockChanged: boolean = false;
  loginUserType = this.userProfile.loginUserTypeId;
  userDesignation = this.userProfile.designationId;
  userRole = this.userProfile.userRoleId;
  
  teacherNameModal: any = "";
  teacherIdModal: any = "";
  teacherCodeModal: any = "";
  actionType: any = "";
  remark: any = "";
  teacherencId: any = "";
  beoactionType: any = "";
  beoremark: any = "";
  deoactionType: any = "";
  deoremark: any = "";
  authorityRemark:any="";
  teacherPrefix:any=[];
  prefixData:any="";
  allLabel: string[] = ["", "Action Type", "Remark"];
  allLabelAllAprv: string[] = ["Remark"];
  @ViewChild("closebuttonSchool") closebuttonSchool!: any;
  @ViewChild("closebuttonBeo") closebuttonBeo!: any;
  @ViewChild("closebuttonDeo") closebuttonDeo!: any;
  @ViewChild("closebuttonReq") closebuttonReq!: any;
  @ViewChild("closeButtonAprvAll") closeButtonAprvAll!: any;
  resnFullText:any="";
  viewTableForm!: FormGroup;
  approveAllForm!: FormGroup;
  checkAll: boolean = false;
  aproveBtn: boolean = false;
  approveAllAction:any="1";
  approveAllRemark:any="";
  selectedTeacherId:any=[];
  modalOpen:boolean = false;
  takeActionForm!:FormGroup;
  changeRequestAction: any = "";
  changeRequestRemark: any = "";
  genModal: any = "";
  jfDistrictModal: any = "";
  serviceJoiningDtModal: any = "";
  teacherTitleModal: any = "";
  pendingProfileSts: any = "";
  teacherTitleList: any = "";
  @ViewChild("closebuttonTakeAction") closebuttonTakeAction!: any;
  constructor(
    private commonService: CommonserviceService,
    private privilegeHelper: PrivilegeHelper,   //For menu privilege
  	private router:Router,
    private schoolService: SchoolService,
    private formBuilder: FormBuilder,
    private spinner: NgxSpinnerService,
    private registrationService: RegistrationService,
    private alertHelper: AlertHelper,
    private industrialTraining: IndustrialTrainingService,
    public customValidators: CustomValidators,
    private el: ElementRef,
    private teacherVerification: TeacherVerificationService,
    private location: Location,
  ) { const pageUrl:any = this.router.url;  
    this.plPrivilege = this.privilegeHelper.PrimaryLinkPrivilege(pageUrl);  //For menu privilege    
    this.commonService.verifyLinkPermission(pageUrl, this.config.linkType[2], this.config.privilege[1]);  // For authorization
    const users = this.commonService.getUserProfile();
    this.userId = users?.userId;
  }

  ngOnInit(): void {
    if(this.plPrivilege=='admin'){
      this.adminPrivilege = true;
      this.displayedColumns = [
            "chkAll",
            "slNo",
            "teacherLoginCode",
            "teacherId",
            "teacherName",
            "teacherTitle",
            "mobileNo",
            "school",
            "serviceAction",            
            "status",
            "pendingAt",
            "changeRequest",
            "action",
      ]; 
    } else {
      this.displayedColumns = [
        "chkAll",
        "slNo",
        "teacherLoginCode",
        "teacherId",
        "teacherName",
        "teacherTitle",
        "mobileNo",
        "school",
        "serviceAction",        
        "status",
        "pendingAt",
        "changeRequest",
      ]; 
    }
    localStorage.removeItem("teacherDetails");
    // this.initializeForm();
    if (this.userProfile.loginUserTypeId != 3) {
      this.loadTeacherData(this.getSearchParams());
    } else {
      this.isInitAdmin = true;
    }

    this.getDistrict();
    this.getAnnextureData();
    this.getAnnextureDataBySeq();
    // this.getTeacherAppointment();
    // this.getSchoolManagement();
    // this.getDetails();
    $("#searchbox").show();
    $(".bi-caret-down-fill").hide();
    this.initializeviewTableForm();
    this.schoolInitialzeForm();
    this.beoInitialzeForm();
    this.deoInitialzeForm();
    this.approveAllInitForm();
    this.takeActionInitialzeForm();
  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  initializeviewTableForm() {
    this.viewTableForm = this.formBuilder.group({
      checkAll: [this.checkAll],
      checkRecordArr: this.formBuilder.array([], [Validators.required]),
    });
  }
  
  schoolInitialzeForm() {
    this.schoolVerificationForm = this.formBuilder.group({
      teacherIdModal: [this.teacherencId],
      actionType: [this.actionType, [Validators.required]],
      remark: [this.remark, [Validators.required, Validators.maxLength(500)]],
      updatedBy: [this.userProfile.userId],
      userType:[this.loginUserType],
    });
  }
  beoInitialzeForm() {
    this.beoVerificationForm = this.formBuilder.group({
      teacherIdModal: [this.teacherencId],
      beoactionType: [this.beoactionType, [Validators.required]],
      beoremark: [
        this.beoremark,
        [Validators.required, Validators.maxLength(500)],
      ],
      userType:[this.loginUserType],
      updatedBy: [this.userProfile.userId],
      multipleData:0
    });
  }
  deoInitialzeForm() {
    this.deoVerificationForm = this.formBuilder.group({
      teacherIdModal: [this.teacherencId],
      deoactionType: [this.deoactionType, [Validators.required]],
      deoremark: [
        this.deoremark,
        [Validators.required, Validators.maxLength(500)],
      ],
      userType:[this.loginUserType],
      updatedBy: [this.userProfile.userId],
    });
  }

  getAnnextureData() {
    this.commonService
      .getCommonAnnexture([
        // "TEACHER_TITLE",
        // "NATURE_OF_APPOINTMENT",
        "SCHOOL_MANAGEMENT",
        "PREFIX",        
      ])
      .subscribe({
        next: (res: any) => {
          this.spinner.hide();
         // this.teacherTitles = res?.data?.TEACHER_TITLE;
        //  this.teacherAppointment = res?.data?.NATURE_OF_APPOINTMENT;
          this.teacherMgmtData = res?.data?.SCHOOL_MANAGEMENT;
          this.prefixData = res?.data?.PREFIX;         
          this.prefixData.forEach((value:any) => {           
            this.teacherPrefix[value.anxtValue] = value.anxtName;                
        }); 
        
        

        },
      });
  }
  getAnnextureDataBySeq() {
    this.commonService
      .getCommonAnnexture([
        "TEACHER_TITLE",
        "NATURE_OF_APPOINTMENT",
               
      ],true)
      .subscribe({
        next: (res: any) => {
          this.spinner.hide();
          this.teacherTitleList = res?.data?.TEACHER_TITLE;
          this.teacherAppointment = res?.data?.NATURE_OF_APPOINTMENT;

        },
      });
  }
  getSearchParams() {
    return {
      previousSize: this.previousSize,
      offset: this.offset.toString(),
      pageSize: this.pageSize.toString(),
      searchAcademicYear: this.searchAcademicYear,
      searchDistrictId: this.searchDistrictId,
      searchBlockId: this.searchBlockId,
      searchClusterId: this.searchClusterId,
      searchSchoolId: this.searchSchoolId,
      searchTeacherTitle: this.searchTeacherTitle,
      searchNatureOfAppointmt: this.searchNatureOfAppointmt,
      searchTeacherId: this.searchTeacherId,
      searchTeacherTempLoginId: this.searchTeacherTempLoginId,
      searchTeacherName: this.searchTeacherName,
      searchStatusWise: this.searchStatusWise,
      searchSelManagement: this.searchSelManagement,
      searchVerification: this.searchVerification,
    };
  }
  loadTeacherData(...params: any) {
    // this.spinner.show();
    const {
      previousSize,
      offset,
      pageSize,
      searchDistrictId,
      searchBlockId,
      searchClusterId,
      searchSchoolId,
      searchTeacherTitle,
      searchNatureOfAppointmt,
      searchTeacherId,
      searchTeacherTempLoginId,
      searchTeacherName,
      searchStatusWise,
      searchSelManagement,
      searchVerification,
    } = params[0];

    this.paramObj = {
      offset: offset,
      limit: pageSize,
      serviceType: this.serviceType, 
      searchDistrictId: searchDistrictId,
      searchBlockId: searchBlockId,
      searchClusterId: searchClusterId,
      searchSchoolId: searchSchoolId,
      searchTeacherTitle: searchTeacherTitle,
      searchNatureOfAppointmt: searchNatureOfAppointmt,
      searchTeacherId: searchTeacherId,
      searchTeacherTempLoginId: searchTeacherTempLoginId,
      searchTeacherName: searchTeacherName,
      searchStatusWise: searchStatusWise,
      searchSelManagement: searchSelManagement,
      searchVerification: searchVerification,
      schoolId: this.userProfile.school,
      userId: this.userProfile.userId,
      loginUserTypeId: this.userProfile.loginUserTypeId,
      district:this.userProfile.district,
      block:this.userProfile.block,
      cluster:this.userProfile.cluster,
    };
    this.isLoading = true;
    this.registrationService.viewTeacher(this.paramObj).subscribe({
      next: (res: any) => {
        this.resultListData.length = previousSize; // set current size
        this.resultListData.push(...res?.data); // merge with existing data
        this.resultListData.length = res?.totalRecord; // update length
        this.dataSource.paginator = this.paginator; // update paginator
        this.dataSource._updateChangeSubscription(); // update table
        this.isLoading = false;
        this.isNorecordFound = this.resultListData.length ? false : true;
        if(this.loginUserType == 1){
          if((res?.data[0].gender !=null || res?.data[0].gender !='') && (res?.data[0].jfDistrictCode !=null) && (res?.data[0].serviceJoiningDt !=null || res?.data[0].serviceJoiningDt !='') && (res?.data[0].teacherTitle !=null || res?.data[0].teacherTitle !='')){
            this.pendingProfileSts = 1;  // gender,doj service,title etc  fiiled for teacher code generation
          }else{
            this.pendingProfileSts = 0; // gender,doj service,title etc not fiiled for teacher code generation
          }
          
        }
        this.spinner.hide();
      },
      error: (error: any) => {
        this.isLoading = false;
        this.spinner.hide();
      },
    });
  }
  checkUncheckAll() {
    this.resetFormArray();
    if (this.viewTableForm.get("checkAll")?.value !== true) {
      const checkRecordArr: FormArray = this.viewTableForm.get(
        "checkRecordArr"
      ) as FormArray;
      this.resultListData.forEach((eachdata: any) => {
        // console.log(eachdata);
        if((eachdata.pendingAt == 1 && this.userDesignation == 46) || (eachdata.pendingAt == 2 && this.userDesignation == 33)){
          checkRecordArr.push(new FormControl(eachdata.tId));
          eachdata.isChecked = true;
        }
      });
      //this.selectedTeacherId = checkRecordArr;
      this.aproveBtn = true;
    }
    console.log(this.selectedTeacherId);
    
  }
  onCheckboxChange(e: any){
    const checkRecordArr: FormArray = this.viewTableForm.get(
      "checkRecordArr"
    ) as FormArray;
    if (e.target.checked) {
      checkRecordArr.push(new FormControl(e.target.value));
      //this.selectedTeacherId = checkRecordArr;
      this.aproveBtn = true;
    } else {
      
      this.viewTableForm.get("checkAll")?.setValue(false);
      let i: number = 0;
      checkRecordArr.controls.forEach((item: any) => {
        if (item.value == e.target.value) {
          checkRecordArr.removeAt(i);
          if(checkRecordArr.length > 0){
              this.aproveBtn = true;
          }else{
            this.aproveBtn = false;
          }
          return;
          
        }
        i++;
      });
     // this.selectedTeacherId = checkRecordArr;
    }
    console.log(this.selectedTeacherId,'onChkBox');
    
    
  }
  resetFormArray() {
    this.aproveBtn = false;
    this.resultListData.forEach((eachdata: any) => {
      eachdata.isChecked = false;     
    });
    (this.viewTableForm.get("checkRecordArr") as FormArray).clear();
  }
  approveAllTeacher(){
    
    const checkRecordArr: FormArray = this.viewTableForm.get(
      "checkRecordArr"
    ) as FormArray;
    
    if (checkRecordArr.controls.length < 1) {
      this.modalOpen=false;
      this.alertHelper.viewAlertHtml(
        "error",
        "Invalid",
        "Select atleast one record"
      );
      return;
    }else{
      this.modalOpen=true;
    }

  }
  approveAllInitForm() {
    this.approveAllForm = this.formBuilder.group({     
      approveAllAction: [this.approveAllAction, [Validators.required]],
      approveAllRemark: [
        this.approveAllRemark,
        [Validators.required, Validators.maxLength(500)],
      ],
      teacherIds:this.formBuilder.array([]),
      userType:[this.loginUserType],
      updatedBy: [this.userProfile.userId],
      multipleData:1
    });
  }
  getDistrict() {
    this.scDisrtictSelect = false;
    this.scDisrtictLoading = true;
    this.commonService.getAllDistrict().subscribe((data: any) => {
      this.districtData = data;
      this.districtData = this.districtData.data;

      if (this.userProfile.district != 0 || this.userProfile.district != "") {
        this.searchDistrictData = this.districtData.filter((dis: any) => {
          return dis.districtId == this.userProfile.district;
        });
        this.teacherSearchForm.controls["searchDistrictId"]?.patchValue(
          this.userProfile.district
        );
        this.getBlock(this.userProfile.district);
      } else {
        this.searchDistrictData = this.districtData;
        this.scDisrtictSelect = true;
      }

      this.searchBlockId = "";
      this.scDisrtictLoading = false;
    });
  }

  getBlock(districtId: any) {
    this.scBlockSelect = false;
    this.scBlockLoading = true;

    this.searchBlockData = [];
    this.teacherSearchForm.controls["searchBlockId"]?.patchValue("");

    this.clusterData = [];
    this.teacherSearchForm.controls["searchClusterId"]?.patchValue("");

    this.getSchoolData = [];
    this.teacherSearchForm.controls["searchSchoolId"]?.patchValue("");

    if (districtId !== "") {
      this.commonService
        .getBlockByDistrictid(districtId)
        .subscribe((res: any) => {
          this.searchBlockData = res;
          this.searchBlockData = this.searchBlockData.data;

          if (this.userProfile.block != 0 || this.userProfile.block != "") {
            this.searchBlockData = this.searchBlockData.filter((blo: any) => {
              return blo.blockId == this.userProfile.block;
            });
            this.teacherSearchForm.controls["searchBlockId"]?.patchValue(
              this.userProfile.block
            );
            this.getCluster(this.userProfile.block);
          } else {
            this.scBlockSelect = true;
          }
          this.scBlockLoading = false;
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
    this.teacherSearchForm.controls["searchClusterId"]?.patchValue("");

    this.getSchoolData = [];
    this.teacherSearchForm.controls["searchSchoolId"]?.patchValue("");

    if (blockId !== "") {
      this.commonService.getClusterByBlockId(blockId).subscribe((res: any) => {
        this.clusterData = res;
        this.clusterData = this.clusterData.data;

        if (this.userProfile.cluster != 0 || this.userProfile.cluster != "") {
          this.clusterData = this.clusterData.filter((clu: any) => {
            return clu.clusterId == this.userProfile.cluster;
          });
          this.teacherSearchForm.controls["searchClusterId"]?.patchValue(
            this.userProfile.cluster
          );
          this.getSchool(this.userProfile.cluster);
        } else {
          this.scClusterSelect = true;
        }
        this.scClusterLoading = false;
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
    this.teacherSearchForm.controls["searchSchoolId"]?.patchValue("");

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
          this.teacherSearchForm.controls["searchSchoolId"]?.patchValue(
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
    this.loadTeacherData(this.getSearchParams());
  }
  onSearch() {
    this.pageIndex = 0;
    this.offset = 0;
    this.previousSize = 0;
    //this.loadTeacherData(this.getSearchParams());
   // this.isInitAdmin = false;
    //if district/block/cluster mandatory then open the comment
    if (this.validateForm() === true) {
      this.spinner.show();
      this.loadTeacherData(this.getSearchParams());
      this.isInitAdmin = false;
    }
  }
  validateForm(): Boolean {
    if (this.searchDistrictId === "") {
      this.alertHelper.successAlert("", "Please select district.", "error");
      return false;
    }
    // if (this.searchBlockId === "") {
    //   this.alertHelper.successAlert("", "Please select Block.", "info");
    //   return false;
    // }
    // if (this.searchClusterId === "") {
    //   this.alertHelper.successAlert("", "Please select Cluster.", "info");
    //   return false;
    // }
    // if (this.searchSchoolId === "") {
    //   this.alertHelper.successAlert("", "Please select School.", "info");
    //   return false;
    // }

    return true;
  }
  deleteTeacher(encId: string) {
    this.alertHelper
      .deleteAlert("Are you sure to delete?", "", "question", "Yes, delete it!")
      .then((result) => {
        if (result.value) {
          this.spinner.show(); // ==== show spinner
          let paramList: any = {
            encId: encId,
            updatedBy: this.userProfile.userId,
          };

          this.registrationService.deleteTeacher(paramList).subscribe({
            next: (res: any) => {
              if (res?.success === true) {
                this.alertHelper.successAlert(
                  "Deleted!",
                  "Deleted Successfully",
                  "success"
                );
                this.loadTeacherData(this.getSearchParams());
              } else {
                this.alertHelper.viewAlert("info", res?.msg);
              }
              this.isLoading = false;
              this.spinner.hide();
            },
            error: (error: any) => {
              this.isLoading = false;
              this.spinner.hide();
            },
          });
        }
      });
  }
  toggle() {
    // this.show = !this.show;
    // if(this.show)
    //   this.buttonName = "Hide";
    // else
    //   this.buttonName = "Show";
    const visible = $("#searchbox").css("display");
    if (visible == "none") {
      $("#searchbox").show(1000);
      $(".bi-caret-up-fill").show();
      $(".bi-caret-down-fill").hide();
    } else {
      $("#searchbox").hide(400);
      $(".bi-caret-up-fill").hide();
      $(".bi-caret-down-fill").show();
    }
  }
  csvExport() {
    this.registrationService.downloadRawCsv().subscribe((res: any) => {
      // console.log(res);
    });
  }
  getDetails() {
    this.districtName = this.userProfile.districtName;
        this.blockName = this.userProfile.blockName;
        this.clusterName = this.userProfile.clusterName;
        //  this.teacherList = res.data[3];
        this.IschoolIds = this.userProfile.school;
    // this.spinner.show();
    // this.industrialTraining.getDetails(this.userProfile).subscribe({
    //   next: (res: any) => {
    //     this.districtName = res.data[0].districtName;
    //     this.blockName = res.data[1].blockName;
    //     this.clusterName = res.data[2].clusterName;
    //     //  this.teacherList = res.data[3];
    //     this.IschoolIds = this.userProfile.school;

    //     this.spinner.hide();
    //   },
    // });
  }
  teacherModal(encId: string, teacherName: any, teacherCode: any) {
    this.teacherNameModal = teacherName;
    this.teacherencId = encId; //teacher Id
    this.teacherCodeModal = teacherCode; //teacher code
    this.schoolInitialzeForm();
  }
  beoModal(encId: string, teacherName: any, teacherCode: any) {
    this.teacherNameModal = teacherName;
    this.teacherencId = encId; //teacher Id
    this.teacherCodeModal = teacherCode; //teacher code
    this.beoInitialzeForm();
  }
  deoModal(encId: string, teacherName: any, teacherCode: any) {
    this.teacherNameModal = teacherName;
    this.teacherencId = encId; //teacher Id
    this.teacherCodeModal = teacherCode; //teacher code
    this.deoInitialzeForm();
  }
  takeActionInitialzeForm() {
    this.takeActionForm = this.formBuilder.group({
      teacherIdModal: [this.teacherencId],
      changeRequestAction: [this.changeRequestAction, [Validators.required]],
      changeRequestRemark: [
        this.changeRequestRemark,
        [Validators.required, Validators.maxLength(500)],
      ],
      userType:[this.loginUserType],
      updatedBy: [this.userProfile.userId],
      multipleData:0
    });
  }
  changeRequestModal(encId: string, teacherName: any,teacherCode: any) {    
    this.teacherNameModal = teacherName;
    this.teacherencId = encId; //teacher Id
    this.teacherCodeModal = teacherCode; //teacher code
    this.takeActionInitialzeForm();
  }

  onSubmit(verificationType: any) {
    //for school
    // if (verificationType == 1) {
    //   if ("INVALID" === this.schoolVerificationForm.status) {
    //     for (const key of Object.keys(this.schoolVerificationForm.controls)) {
    //       if (this.schoolVerificationForm.controls[key].status === "INVALID") {
    //         const invalidControl = this.el.nativeElement.querySelector(
    //           '[formControlName="' + key + '"]'
    //         );
    //         invalidControl.focus();
    //         this.customValidators.formValidationHandler(
    //           this.schoolVerificationForm,
    //           this.allLabel
    //         );
    //         break;
    //       }
    //     }
    //   }
    //   if (this.schoolVerificationForm.invalid) {
    //     return;
    //   }
    //   if (this.schoolVerificationForm.valid === true) {
    //     // console.log(this.schoolVerificationForm.value);
    //     this.alertHelper.submitAlert().then((result: any) => {
    //       if (result.value) {
    //         this.spinner.show(); // ==== show spinner
    //         this.teacherVerification
    //           .schoolVerification(this.schoolVerificationForm.value)
    //           .subscribe({
    //             next: (res: any) => {
    //               this.spinner.hide(); //==== hide spinner
    //               this.alertHelper
    //                 .successAlert(
    //                   "Saved!",
    //                   "Teacher status updated successfully.",
    //                   "success"
    //                 )
    //                 .then(() => {
    //                   this.closebuttonSchool.nativeElement.click();
    //                   this.loadTeacherData(this.getSearchParams());
    //                   this.schoolInitialzeForm();
    //                 });
    //             },
    //             error: (error: any) => {
    //               this.spinner.hide(); //==== hide spinner
    //               let errorMessage: string = "";
    //               if (typeof error.error.msg === "string") {
    //                 errorMessage +=
    //                   '<i class="bi bi-arrow-right text-danger"></i> ' +
    //                   error.error.msg +
    //                   `<br>`;
    //               } else {
    //                 error.error.msg.map(
    //                   (message: string) =>
    //                     (errorMessage +=
    //                       '<i class="bi bi-arrow-right text-danger"></i> ' +
    //                       message +
    //                       `<br>`)
    //                 );
    //               }
    //               this.alertHelper.viewAlertHtml(
    //                 "error",
    //                 "Invalid inputs",
    //                 errorMessage
    //               );
    //             },
    //           });
    //       }
    //     });
    //   }
    // }
    //for beo user
    if (verificationType == 2) {
      if ("INVALID" === this.beoVerificationForm.status) {
        for (const key of Object.keys(this.beoVerificationForm.controls)) {
          if (this.beoVerificationForm.controls[key].status === "INVALID") {
            const invalidControl = this.el.nativeElement.querySelector(
              '[formControlName="' + key + '"]'
            );
            invalidControl.focus();
            this.customValidators.formValidationHandler(
              this.beoVerificationForm,
              this.allLabel
            );
            break;
          }
        }
      }
      if (this.beoVerificationForm.invalid) {
        return;
      }
      if (this.beoVerificationForm.valid === true) {
        // console.log(this.beoVerificationForm.value);
        this.alertHelper.submitAlert().then((result: any) => {
          if (result.value) {
            this.spinner.show(); // ==== show spinner
            this.teacherVerification
              .beoVerification(this.beoVerificationForm.value)
              .subscribe({
                next: (res: any) => {
                  this.spinner.hide(); //==== hide spinner
                  this.alertHelper
                    .successAlert(
                      "Saved!",
                      "Teacher status updated successfully.",
                      "success"
                    )
                    .then(() => {
                      this.closebuttonBeo.nativeElement.click();
                      this.loadTeacherData(this.getSearchParams());
                      this.beoInitialzeForm();
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

    //deo user
    if (verificationType == 3) {
      if ("INVALID" === this.deoVerificationForm.status) {
        for (const key of Object.keys(this.deoVerificationForm.controls)) {
          if (this.deoVerificationForm.controls[key].status === "INVALID") {
            const invalidControl = this.el.nativeElement.querySelector(
              '[formControlName="' + key + '"]'
            );
            invalidControl.focus();
            this.customValidators.formValidationHandler(
              this.deoVerificationForm,
              this.allLabel
            );
            break;
          }
        }
      }
      if (this.deoVerificationForm.invalid) {
        return;
      }
      if (this.deoVerificationForm.valid === true) {
        // console.log(this.deoVerificationForm.value);
        this.alertHelper.submitAlert().then((result: any) => {
          if (result.value) {
            this.spinner.show(); // ==== show spinner
            this.teacherVerification
              .deoVerification(this.deoVerificationForm.value)
              .subscribe({
                next: (res: any) => {
                  this.spinner.hide(); //==== hide spinner
                  this.alertHelper
                    .successAlert(
                      "Saved!",
                      "Teacher status updated successfully.",
                      "success"
                    )
                    .then(() => {
                      this.closebuttonDeo.nativeElement.click();
                      this.loadTeacherData(this.getSearchParams());
                      this.deoInitialzeForm();
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
    // beo All Application Verify
    if (verificationType == 46) {
      
      // if ("INVALID" === this.approveAllForm.status) {
      //   for (const key of Object.keys(this.approveAllForm.controls)) {
      //     if (this.approveAllForm.controls[key].status === "INVALID") {
      //       const invalidControl = this.el.nativeElement.querySelector(
      //         '[formControlName="' + key + '"]'
      //       );
      //       invalidControl.focus();
      //       this.customValidators.formValidationHandler(
      //         this.approveAllForm,
      //         this.allLabelAllAprv
      //       );
      //       break;
      //     }
      //   }
      // }
      this.customValidators.formValidationHandler(this.approveAllForm,this.allLabelAllAprv);
      if (this.approveAllForm.invalid) {
        return;
      }
      if (this.approveAllForm.valid === true) {
        // console.log(this.deoVerificationForm.value);
        this.alertHelper.submitAlert().then((result: any) => {
          //const objData = { teacherIds: this.selectedTeacherId , formdata:this.approveAllForm.value}          
          const checkRecordArr: FormArray = this.viewTableForm.get(
            "checkRecordArr"
          ) as FormArray;
          const teacherArr: FormArray = this.approveAllForm.get(
            "teacherIds"
          ) as FormArray;
          let i: number = 0;
          checkRecordArr.controls.forEach((item: any) => {
            teacherArr.push(new FormControl(item.value));
            i++;
          });   
          if (result.value) {
            this.spinner.show(); // ==== show spinner
            this.teacherVerification
              .beoVerification(this.approveAllForm.value)
              .subscribe({
                next: (res: any) => {
                  this.spinner.hide(); //==== hide spinner
                  this.alertHelper
                    .successAlert(
                      "Saved!",
                      "Teacher status updated successfully.",
                      "success"
                    )
                    .then(() => {
                      this.closeButtonAprvAll.nativeElement.click();
                      this.loadTeacherData(this.getSearchParams());
                      this.approveAllInitForm();
                      this.viewTableForm.get("checkAll")?.patchValue("");
                      this.aproveBtn = false;
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
    // deo All Application Verify
    if (verificationType == 33) {
      
      if ("INVALID" === this.approveAllForm.status) {
        for (const key of Object.keys(this.approveAllForm.controls)) {
          if (this.approveAllForm.controls[key].status === "INVALID") {
            const invalidControl = this.el.nativeElement.querySelector(
              '[formControlName="' + key + '"]'
            );
            invalidControl.focus();
            this.customValidators.formValidationHandler(
              this.approveAllForm,
              this.allLabelAllAprv
            );
            break;
          }
        }
      }
      if (this.approveAllForm.invalid) {
        return;
      }
      if (this.approveAllForm.valid === true) {
        // console.log(this.deoVerificationForm.value);
        this.alertHelper.submitAlert().then((result: any) => {
          //const objData = { teacherIds: this.selectedTeacherId , formdata:this.approveAllForm.value}          
          const checkRecordArr: FormArray = this.viewTableForm.get(
            "checkRecordArr"
          ) as FormArray;
          const teacherArr: FormArray = this.approveAllForm.get(
            "teacherIds"
          ) as FormArray;
          let i: number = 0;
          checkRecordArr.controls.forEach((item: any) => {
            teacherArr.push(new FormControl(item.value));
            i++;
          });   
          if (result.value) {
            this.spinner.show(); // ==== show spinner
            this.teacherVerification
              .deoVerification(this.approveAllForm.value)
              .subscribe({
                next: (res: any) => {
                  this.spinner.hide(); //==== hide spinner
                  this.alertHelper
                    .successAlert(
                      "Saved!",
                      "Teacher status updated successfully.",
                      "success"
                    )
                    .then(() => {
                      this.closeButtonAprvAll.nativeElement.click();
                      this.loadTeacherData(this.getSearchParams());
                      this.approveAllInitForm();
                      this.viewTableForm.get("checkAll")?.patchValue("");
                      this.aproveBtn = false;
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
  }

  //Csv DownLoad Function
  downloadTeacherList()
  {
    this.spinner.show();   
    this.paramObj.serviceType = "Download";

    this.registrationService.viewTeacher(this.paramObj).subscribe({
      next: (res: any) => {       
        let filepath = this.fileUrl + '/' + res.data.replace('.', '~');
        window.open(filepath);
        this.spinner.hide();
      },
      error: (error: any) => {
        this.spinner.hide();
      },
    });

  }
  //End

  //Print function
  printPage()
  {
    let cloneTable 	= document.getElementById("viewTable")?.innerHTML;
    const pageTitle = document.querySelector(".pageName")?.innerHTML;
    this.commonService.printPage(cloneTable, pageTitle);
  }
  //End
  changeRequest(teacherEncId: any) {
    const obj ={ encId : teacherEncId,updatedBy:this.userProfile.userId};
    this.alertHelper.confirmAlert("Are you sure to send request for modify?").then((result: any) => { 
      if(result.value){
      this.teacherVerification.changeRequest(obj).subscribe({
        next: (res: any) => {
          this.spinner.hide(); //==== hide spinner
          this.alertHelper
            .successAlert(
              "Sent!",
              "Request Sent successfully.",
              "success"
            )
            .then(() => {
              this.closebuttonReq.nativeElement.click();
              this.loadTeacherData(this.getSearchParams());
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
          this.alertHelper.viewAlertHtml("error", "Invalid inputs", errorMessage);
        },
      });
    }

    });
    
  }
  reasonModal(resnText:any){
    this.resnFullText = resnText;
    
   }

   requestTeacher(teacherEncId: any){
    const obj ={ encId : teacherEncId,updatedBy:this.userProfile.userId};   
    this.alertHelper.confirmAlert("Are you sure to send request for verify?").then((result: any) => {  
      if(result.value){
        this.teacherVerification.requestTeacher(obj).subscribe({
          next: (res: any) => {
            this.spinner.hide(); //==== hide spinner
            this.alertHelper
              .successAlert(
                "Sent!",
                "Request Sent successfully.",
                "success"
              )
              .then(() => {
                this.closebuttonReq.nativeElement.click();
                this.loadTeacherData(this.getSearchParams());
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
            this.alertHelper.viewAlertHtml("error", "Invalid inputs", errorMessage);
          },
        });

      }
     
    });    

   }
   changeRequestSubmit(){
    if ("INVALID" === this.takeActionForm.status) {
      for (const key of Object.keys(this.takeActionForm.controls)) {
        if (this.takeActionForm.controls[key].status === "INVALID") {
          const invalidControl = this.el.nativeElement.querySelector(
            '[formControlName="' + key + '"]'
          );
          invalidControl.focus();
          this.customValidators.formValidationHandler(
            this.takeActionForm,
            this.allLabel
          );
          break;
        }
      }
    }
    if (this.takeActionForm.invalid) {
      return;
    }
    if (this.takeActionForm.valid === true) {
      
      this.alertHelper.submitAlert().then((result: any) => {
        if (result.value) {
          this.spinner.show(); // ==== show spinner
          this.teacherVerification
            .changeRequestSubmit(this.takeActionForm.value)
            .subscribe({
              next: (res: any) => {
                this.spinner.hide(); //==== hide spinner
                this.alertHelper
                  .successAlert(
                    "Saved!",
                    "Request updated successfully.",
                    "success"
                  )
                  .then(() => {
                    this.closebuttonTakeAction.nativeElement.click();
                    this.loadTeacherData(this.getSearchParams());
                    this.takeActionInitialzeForm();
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
  // open a file in new tab// Debasis Patra :: 04-01-2023 
  newTabHandler(encId:any,pageName:any){
    const currentUrl = this.location.path(); // get current url
    const pageUrl =
    environment.BASEURL +
    currentUrl + "/"+ pageName +"/" + encId;
    window.open(pageUrl, "_blank");    
  }
  pendingData(gender:any,jfDistrictCode:any,serviceJoiningDt:any,teacherTitle:any){
    if(gender ==null || gender ==""){
      this.genModal = 'Gender,';
    }else{
      this.genModal='';
    }
    if(jfDistrictCode ==null || jfDistrictCode ==""){
      this.jfDistrictModal = 'District of First Joining,';
    }else{
      this.jfDistrictModal='';
    }
    if(serviceJoiningDt ==null || serviceJoiningDt ==""){
      this.serviceJoiningDtModal = 'Date of joining in service,';
    }else{
      this.serviceJoiningDtModal='';
    }
    if(teacherTitle ==null || teacherTitle ==""){
      this.teacherTitleModal = 'Type of Teacher';
    }else{
      this.teacherTitleModal='';
    }
    console.log(this.genModal+''+this.jfDistrictModal+''+this.serviceJoiningDtModal+''+this.teacherTitleModal);
    
  }
  teacherTypeFtch(data: any){ 
    this.teacherTitles = this.teacherTitleList.filter((dis: any) => {         
      return dis.parentValue == data;       
     });     
    }
}
