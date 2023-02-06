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
import { TeacherTransferService } from "../services/teacher-transfer.service";
import { IDropdownSettings } from "ng-multiselect-dropdown";

@Component({
  selector: "app-view-notification",
  templateUrl: "./view-notification.component.html",
  styleUrls: ["./view-notification.component.css"],
})
export class ViewNotificationComponent implements AfterViewInit, OnInit {
  dropdownSettings: IDropdownSettings = {};
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
  maxDate: any = Date;
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
  teacherTitle: any = "";
  typeOfTeacher: any = "";
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
  searchTitle:any = "";
  searchLetterNo:any = "";
  searchFromDate:any = "";
  searchToDate:any = "";
  searchTeacherTitles: any = "";
  searchTypeOfTeacher: any = "";
  searchNatureOfAppointment: any = "";
  searchStatus: any = "";
  @ViewChild("closebuttonTakeAction") closebuttonTakeAction!: any;
  constructor(
    private privilegeHelper: PrivilegeHelper,   //For menu privilege
  	private router:Router,
    private formBuilder: FormBuilder,
    private spinner: NgxSpinnerService,
    private alertHelper: AlertHelper,
    public customValidators: CustomValidators,
    private el: ElementRef,
    private commonService: CommonserviceService,
    private transferService: TeacherTransferService,
    private location: Location,
  ) { 
    const pageUrl:any = this.router.url;  
    // this.plPrivilege = this.privilegeHelper.PrimaryLinkPrivilege(pageUrl);  //For menu privilege    
    // this.commonService.verifyLinkPermission(pageUrl, this.config.linkType[2], this.config.privilege[1]);  // For authorization
    // const users = this.commonService.getUserProfile();
    // this.userId = users?.userId;
  }

  ngOnInit(): void {
    if(this.plPrivilege=='admin'){
      this.adminPrivilege = true;
      this.displayedColumns = [
            "slNo",
            "title",
            "letterNo",
            "fromDate",
            "toDate",
            "typeOfTeacher",
            "natureOfAppointment",
            "action",
      ]; 
    } else {
      this.displayedColumns = [
            "slNo",
            "title",
            "letterNo",
            "fromDate",
            "toDate",
            "typeOfTeacher",
            "natureOfAppointment",
            "action",
      ]; 
    }
    this.loadConfigurationData(this.getSearchParams());
    this.getAnnextureDataBySeq();
    this.dropdownSettings = {
			idField: "anxtValue",
			textField: "anxtName",
			enableCheckAll: true,
			selectAllText: "Select All Nature Of Appointment",
			unSelectAllText: "UnSelect All Nature Of Appointment",
			noDataAvailablePlaceholderText: "No data available",
			allowSearchFilter: true,
			itemsShowLimit: 4,
		};
  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.maxDate = new Date();
  }
  initializeviewTableForm() {
    this.viewTableForm = this.formBuilder.group({
      checkAll: [this.checkAll],
      checkRecordArr: this.formBuilder.array([], [Validators.required]),
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
          this.typeOfTeacher = res?.data?.TEACHER_TITLE;
          this.teacherAppointment = res?.data?.NATURE_OF_APPOINTMENT;
          console.log(this.typeOfTeacher);
        },
      });
  }
  getSearchParams() {
    return {
      previousSize: this.previousSize,
      offset: this.offset.toString(),
      pageSize: this.pageSize.toString(),
      searchTitle: this.searchTitle,
      searchLetterNo: this.searchLetterNo,
      searchStatus: this.searchStatus,
      searchToDate: this.searchToDate,
      searchTypeOfTeacher: this.searchTypeOfTeacher,
      searchNatureOfAppointment: this.searchNatureOfAppointment
    };
  }
  toggle() {
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

  loadConfigurationData(...params: any) {
    // this.spinner.show();
    const {
      previousSize,
      offset,
      pageSize,
      searchTitle,
      searchLetterNo,
      searchStatus,
      searchTypeOfTeacher,
      searchNatureOfAppointment
    } = params[0];

    this.paramObj = {
      offset: offset,
      limit: pageSize,
      serviceType: this.serviceType,
      searchTitle: searchTitle,
      searchLetterNo: searchLetterNo,
      searchStatus: searchStatus,
      searchtypeOfTeacher: searchTypeOfTeacher,
      searchNatureOfAppointment: searchNatureOfAppointment
    };
    console.log(this.paramObj);
    this.isLoading = true;
    this.transferService.viewNotification(this.paramObj).subscribe({
      next: (res: any) => {
        this.resultListData.length = previousSize; // set current size
        this.resultListData.push(...res?.data); // merge with existing data
        this.resultListData.length = res?.totalRecord; // update length
        this.dataSource.paginator = this.paginator; // update paginator
        this.dataSource._updateChangeSubscription(); // update table
        this.isLoading = false;
        this.isNorecordFound = this.resultListData.length ? false : true;
        this.spinner.hide();
      },
      error: (error: any) => {
        this.isLoading = false;
        this.spinner.hide();
      },
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
    this.loadConfigurationData(this.getSearchParams());
  }
  printPage()
  {
    let cloneTable 	= document.getElementById("viewTable")?.innerHTML;
    const pageTitle = document.querySelector(".pageName")?.innerHTML;
    this.commonService.printPage(cloneTable, pageTitle);
  }

  downloadTeacherList()
  {
    this.spinner.show();   
    this.paramObj.serviceType = "Download";

    this.transferService.viewNotification(this.paramObj).subscribe({
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
  onSearch() {
    this.pageIndex = 0;
    this.offset = 0;
    this.previousSize = 0;
    // if (this.validateForm() === true) {
      this.spinner.show();
      this.loadConfigurationData(this.getSearchParams());
      this.isInitAdmin = false;
    // }
  }
  newTabHandler(encId:any,pageName:any){
    const currentUrl = this.location.path(); // get current url
    const pageUrl =
    environment.BASEURL +
    currentUrl + "/"+ pageName +"/" + encId;
    window.open(pageUrl, "_blank");    
  }
}
