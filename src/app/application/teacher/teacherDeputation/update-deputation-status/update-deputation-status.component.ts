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
import { AlertHelper } from "src/app/core/helpers/alert-helper";
import { TeacherServiceService } from "../../services/teacher-service.service";
import { ngxCsv } from "ngx-csv/ngx-csv";
import { Subject } from "rxjs";
import { ProgressBarMode } from "@angular/material/progress-bar";
import { MatSort } from "@angular/material/sort";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableExporterDirective } from "mat-table-exporter";
import { MatTableDataSource } from "@angular/material/table";
import { environment } from "src/environments/environment";
import { CommonFunctionHelper } from "src/app/core/helpers/common-function-helper";
import { Constant } from "src/app/shared/constants/constant";
import { PrivilegeHelper } from "src/app/core/helpers/privilege-helper";
import { ActivatedRoute, Router } from "@angular/router";
import { CustomValidators } from "src/app/shared/validations/custom-validators";
import { Location } from "@angular/common";
// declare const $: any;

@Component({
  selector: 'app-update-deputation-status',
  templateUrl: './update-deputation-status.component.html',
  styleUrls: ['./update-deputation-status.component.css']
})
export class UpdateDeputationStatusComponent implements OnInit {

  public fileUrl = environment.filePath;
  scDisrtictChanged: boolean = false;
  districtData: any = "";
  bodyData: any;
  scBlockChanged: boolean = false;
  blockData: any;
  scClusterChanged: boolean = false;
  clusterData: any;
  scSchoolChanged: boolean = false;
  getSchoolData: any = "";
  teacherAppointmentChanged: boolean = false;
  teacherAppointment: any = "";
  schoolMgmtChanged: boolean = false;
  teacherMgmtData: any = "";
  csvExports: any = "";
  teacherListData: any = "";
  emptyCheck: boolean = false;
  dtInstance: any = "";
  teacherTitles:any=[];
  isLoading = false;
  isNorecordFound: boolean = false;
  schoolId: any = ''; 
  pageIndex: any = 0;
  previousSize: any = 0; 
  isInitAdmin: boolean = false;
  userId: any="";
  maxDate: any = Date;
  minDate: any = Date;
  descFullText: string = "";
  isNorecordFoundModal: boolean = false;
@ViewChild("teacherSearchForm") teacherSearchForm!: NgForm;
public userProfile = JSON.parse(sessionStorage.getItem("userProfile") || '{}');
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
    "teacherId",
    "teacherName",
    "teacherTitle",
    "mobile",
    "districtName",
    "blockName",
    "clusterName",
    "schoolName",
    "lastServiceStatus",
    "deputation",
    "returnDate",
    "history"
    //"updateLetter",
    //"pendingService"
  
  ]; // define mat table columns

  resultListData: any = [];
  questionDetailsData!: any;
  dataSource = new MatTableDataSource(this.resultListData);
  //end

  paramObj: any; 
  serviceType: string = "Search";
  plPrivilege:string="view"; //For menu privilege
	adminPrivilege: boolean = false;
  config = new Constant();

  searchAcademicYear:any = "";
  searchDistrictId:any = "";
  searchBlockId:any = "";
  searchClusterId:any = "";
  searchSchoolId:any = "";  
  searchBillNo:any = "";
  searchTeacherTitle:any = "";
  searchNatureOfAppointmt:any = "";
  searchTeacherId:any = "";
  searchTeacherName:any = "";
  searchStatusWise:any = "";
  searchSelManagement:any = "";
  searchDeputeType:any = "";
  searchProfileStatus:any = "";
  searchFromDate:any = "";
  searchToDate:any = "";
  scDisrtictSelect:boolean = true; 
  scDisrtictLoading:boolean = false; 
  scBlockSelect:boolean = true; 
  scBlockLoading:boolean = false; 
  scClusterSelect:boolean = true;
  scClusterLoading:boolean = false;
  scSchoolSelect:boolean = true;
  scSchoolLoading:boolean = false; 

  searchDistrictData: any = [];
  searchBlockData: any = [];
  sessionSchool :any=""; 
  blockChanged: boolean = false;
  serviceModalData :any =[];
  uploadedDocs: any = '';
  teacherReturnForm!: FormGroup;
  teacherIdModal:any="";
  deputationToDate:any="";
  allLabel: string[] = [
    "",
    "",
    "Deputation Return Date",    
  ];
  @ViewChild("closebuttonService") closebuttonService!: any;
  constructor(
    private commonService: CommonserviceService,
    private formBuilder: FormBuilder,
    private spinner: NgxSpinnerService,
    private privilegeHelper: PrivilegeHelper,   //For menu privilege
    private route: Router,
    private router: ActivatedRoute,
    private TeacherServiceService: TeacherServiceService,
    private alertHelper: AlertHelper,
    private el: ElementRef,
    private commonFunctionHelper: CommonFunctionHelper,
    public customValidators: CustomValidators,
    private location: Location,
    
  ) {
    const pageUrl:any = this.route.url;  
    this.plPrivilege = this.privilegeHelper.PrimaryLinkPrivilege(pageUrl);  //For menu privilege    
    // this.commonService.verifyLinkPermission(pageUrl, this.config.linkType[2], this.config.privilege[1]);  // For authorization
    const users = this.commonService.getUserProfile();
    this.userId = users?.userId;
    this.sessionSchool = users?.school;
    this.maxDate = new Date();
    
  }


  deptutaionTypeChange :any = 1;
  levelTypeChange :any = 1;


  deputeModalData :any =[];
  deputeHistoryData :any =[];
  orgSchoolData :any =[];
  teacherEncId:any="";
  deputationId:any="";

  ngOnInit(): void {
    if(this.plPrivilege=='admin'){
      this.adminPrivilege = true;
    }
    this.getDistrict();
    this.initializeForm();
    // this.getTeacherAppointment();
    // this.getSchoolManagement();
    this.getAnnextureData();
    this.getAnnextureDataBySeq();
    
    if ((this.userProfile.loginUserTypeId != 3)) {
      this.loadTeacherData(this.getSearchParams());
    } else {
      this.isInitAdmin = true;
    }
    
  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  getAnnextureData() {
    this.commonService
      .getCommonAnnexture([
        "TEACHER_TITLE",
        //"NATURE_OF_APPOINTMENT",
        "APPOINTMENT_TYPE",
        "APPOINTING_AUTHORITY",
        "DISABILITY",
        "CLASSES_TAUGHT_TEACHER",
        "MEDIUM_OF_INSTRUCTION",
        "TEACHER_ASSOCIATED_AS","SCHOOL_MANAGEMENT"])
      .subscribe({
        next: (res: any) => {
          this.spinner.hide();
          this.teacherTitles = res?.data?.TEACHER_TITLE; 
          //this.teacherAppointment = res?.data?.NATURE_OF_APPOINTMENT; 
          this.teacherMgmtData = res?.data?.SCHOOL_MANAGEMENT;                          
        },
      });
  }
  getAnnextureDataBySeq() {
    this.commonService
      .getCommonAnnexture([
        
        "NATURE_OF_APPOINTMENT",
        ],true)
      .subscribe({
        next: (res: any) => {
          this.spinner.hide();
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
      searchTeacherName: this.searchTeacherName,
      searchStatusWise: this.searchStatusWise,
      searchSelManagement: this.searchSelManagement,
      searchDeputeType: this.searchDeputeType,
      searchProfileStatus: this.searchProfileStatus,
      searchFromDate: (this.searchFromDate) ? this.commonFunctionHelper.formatDateHelper(this.searchFromDate):this.searchFromDate,
      searchToDate: (this.searchToDate)?this.commonFunctionHelper.formatDateHelper(this.searchToDate):this.searchToDate

    };
  }
  toggle() {
    // const visible = $("#searchbox").css("display");
    // if (visible == "none") {
    //   $("#searchbox").show(1000);
    //   $(".bi-caret-up-fill").show();
    //   $(".bi-caret-down-fill").hide();
    // } else {
    //   $("#searchbox").hide(400);
    //   $(".bi-caret-up-fill").hide();
    //   $(".bi-caret-down-fill").show();
    // }
  }

  getDistrict(){   
    this.scDisrtictSelect = false;
    this.scDisrtictLoading = true;
    this.commonService.getAllDistrict().subscribe((data:any)=>{
      this.districtData = data;
      this.districtData = this.districtData.data; 
      
      if(this.userProfile.district != 0 || this.userProfile.district != ""){
        this.searchDistrictData = this.districtData.filter((dis: any) => {
          return dis.districtId == this.userProfile.district;
        });
        this.teacherSearchForm.controls['searchDistrictId'].patchValue(this.userProfile.district);
        this.getBlock(this.userProfile.district);
      }
      else{
        this.searchDistrictData = this.districtData;
        this.scDisrtictSelect = true;
      }

      this.searchBlockId='';      
      this.scDisrtictLoading = false;
    });
    
  }

  getBlock(districtId: any) { 
    this.scBlockSelect = false;
    this.scBlockLoading = true;

    this.searchBlockData = [];
    this.teacherSearchForm.controls['searchBlockId'].patchValue('');

    this.clusterData = [];
    this.teacherSearchForm.controls['searchClusterId'].patchValue('');

    this.getSchoolData = [];    
    this.teacherSearchForm.controls['searchSchoolId'].patchValue('');

    if(districtId !== ''){  
      this.commonService.getBlockByDistrictid(districtId).subscribe((res: any) => {      
        this.searchBlockData = res;
        this.searchBlockData = this.searchBlockData.data; 

        if(this.userProfile.block != 0 || this.userProfile.block != ""){
          this.searchBlockData = this.searchBlockData.filter((blo: any) => {
            return blo.blockId == this.userProfile.block;
          });
          this.teacherSearchForm.controls['searchBlockId'].patchValue(this.userProfile.block);
          this.getCluster(this.userProfile.block);
        }
        else{
          this.scBlockSelect = true; 
        }   
        this.scBlockLoading = false;         
      });
    } else{      
      this.scBlockSelect = true; 
      this.scBlockLoading = false;         
    }       
  }

  getCluster(blockId: any) {      
    this.scClusterSelect = false;
    this.scClusterLoading = true;

    this.clusterData = [];
    this.teacherSearchForm.controls['searchClusterId'].patchValue('');

    this.getSchoolData = [];    
    this.teacherSearchForm.controls['searchSchoolId'].patchValue('');   

    if(blockId !== ''){  
      this.commonService.getClusterByBlockId(blockId).subscribe((res: any) => {      
        this.clusterData = res;
        this.clusterData = this.clusterData.data;
        
        if(this.userProfile.cluster != 0 || this.userProfile.cluster != ""){
          this.clusterData = this.clusterData.filter((clu: any) => {
            return clu.clusterId == this.userProfile.cluster;
          });
          this.teacherSearchForm.controls['searchClusterId'].patchValue(this.userProfile.cluster);
          this.getSchool(this.userProfile.cluster);
        }
        else{
          this.scClusterSelect = true; 
        }  
        this.scClusterLoading = false;
      });      
    }else{
      this.scClusterSelect = true; 
      this.scClusterLoading = false;
    }   
  }

  getSchool(clusterId:any){ 
    this.scSchoolSelect = false;
    this.scSchoolLoading = true;

    this.getSchoolData = [];    
    this.teacherSearchForm.controls['searchSchoolId'].patchValue('');

    if(clusterId !== ''){  
      this.commonService.getSchoolList(clusterId).subscribe((res:any) => {      
        this.getSchoolData = res;
        this.getSchoolData = this.getSchoolData.data;

        if(this.userProfile.udiseCode != 0 || this.userProfile.udiseCode != ""){
          this.getSchoolData = this.getSchoolData.filter((sch: any) => {
            return sch.schoolUdiseCode == this.userProfile.udiseCode;
          });
          this.teacherSearchForm.controls['searchSchoolId'].patchValue(this.getSchoolData[0].schoolId);
        }
        else{
          this.scSchoolSelect = true; 
        }  
        this.scSchoolLoading = false;
      });
    }else{
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
  getTeacherAppointment() {
    this.teacherAppointmentChanged = true;
    this.teacherAppointment = [];
    this.TeacherServiceService.getTeacherAppointment().subscribe((res: any) => {
      let data: any = res;
      for (let key of Object.keys(data["data"])) {
        this.teacherAppointment.push(data["data"][key]);
      }
      this.teacherAppointmentChanged = false;
    });
  }

  getSchoolManagement() {
    this.schoolMgmtChanged = true;
    this.teacherMgmtData = [];
    this.commonService.getSchoolManagement().subscribe((res: any) => {
      // this.managemanentData = res;

      let data: any = res;
      for (let key of Object.keys(data["data"])) {
        this.teacherMgmtData.push(data["data"][key]);
      }
      this.schoolMgmtChanged = false;
    });
  }

  onSearch(){    
    this.pageIndex = 0;    
    this.offset = 0;
    this.previousSize = 0;   
    this.loadTeacherData(this.getSearchParams());
    this.isInitAdmin = false;
    //if district/block/cluster mandatory then open the comment
      // if (this.validateForm() === true) {
      //   this.spinner.show();
      //   this.loadTeacherData(this.getSearchParams());
      //   this.isInitAdmin = false;
      // }
    
  }

  loadTeacherData(...params:any) {
    
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
      searchTeacherName,
      searchStatusWise,
      searchSelManagement,
      searchDeputeType,      
      searchProfileStatus,
      searchFromDate,
      searchToDate,
      
    } = params[0];

    this.paramObj = {
      offset: offset,
      limit: pageSize,
      serviceType: this.serviceType, 
      userId: this.userId,
      sessionSchool: this.sessionSchool,
      searchDistrictId:searchDistrictId,
      searchBlockId:searchBlockId,
      searchClusterId:searchClusterId,
      searchSchoolId:searchSchoolId,
      searchTeacherTitle:searchTeacherTitle,
      searchNatureOfAppointmt:searchNatureOfAppointmt,
      searchTeacherId:searchTeacherId,
      searchTeacherName:searchTeacherName,
      searchStatusWise:searchStatusWise,
      searchSelManagement:searchSelManagement,
      searchDeputeType:searchDeputeType,     
      searchProfileStatus:searchProfileStatus,
      searchFromDate:searchFromDate,
      searchToDate:searchToDate,
    };
   
    if(this.compareDate()){
      this.isLoading = true;
      this.spinner.show();
      this.TeacherServiceService.deputaionList(this.paramObj).subscribe({
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
    
  }
//Csv Function
  downloadUpdateStatusList()
  {
    this.spinner.show();   
    this.paramObj.serviceType = "Download";

    this.TeacherServiceService.viewTeacherService(this.paramObj).subscribe({
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

  //Print Function
  printPage() {
    let cloneTable 	= document.getElementById("viewTable")?.innerHTML;
    const pageTitle = document.querySelector(".pageName")?.innerHTML;
    this.commonService.printPage(cloneTable, pageTitle);
  }
  //End

  // csvExport() {
  //   this.spinner.show();
  //   this.csvData = this.teacherSearchForm.value;
  //   this.TeacherServiceService.downloadTeacherServiceCsv(
  //     this.csvData
  //   ).subscribe((res: any) => {
  //     console.log(res);
  //     const data = res["data"];

  //     var options = {
  //       fieldSeparator: ",",
  //       quoteStrings: '"',
  //       decimalseparator: ".",
  //       showLabels: true,
  //       useBom: true,
  //       headers: [
  //         "SLN#",
  //         "Teacher Id",
  //         "Teacher Name",
  //         "Teacher Title",
  //         "Mobile",
  //         "District Name",
  //         "Block Name",
  //         "Cluster Name",
  //         "School Name",
  //         "UDISE Code",
  //         "Service Status",
  //         "Profile Update Status",
  //       ],
  //     };

  //     new ngxCsv(data, "servicereport", options);
  //     this.spinner.hide();
  //   });

  //   // this.TeacherServiceService.downloadTeacherServiceServiceCsv(this.csvData).subscribe((res: any) => {
  //   //   console.log(res);
  //   // });
  // }
  validateForm() :Boolean{
    
    if (this.searchDistrictId === "") {
      this.alertHelper.successAlert(
        "",
        "Please select District.",
        "info"
      );
      return false;
    }
    if (this.searchBlockId === "") {
      this.alertHelper.successAlert(
        "",
        "Please select Block.",
        "info"
      );
      return false;
    }
    if (this.searchClusterId === "") {
      this.alertHelper.successAlert(
        "",
        "Please select Cluster.",
        "info"
      );
      return false;
    }
    if (this.searchSchoolId === "") {
      this.alertHelper.successAlert(
        "",
        "Please select School.",
        "info"
      );
      return false;
    }
    
    return true;
    
  }
  printMe() {
    window.print();
  }
  
  compareDate() {
    let sd = this.searchFromDate;
    let ed = this.searchToDate;
    if (sd != "" && ed != "") {
      if (new Date(ed) < new Date(sd)) {
        // const invalidControl = this.el.nativeElement.querySelector(
        //   '[formControlName="endDate"]'
        // );
        // invalidControl.focus();
        this.alertHelper.viewAlertHtml(
          "error",
          "Invalid inputs",
          "End date should not be less than start date."
        );
        return false;
      } else {
        return true;
      }
    } else {
      return true;
    }
  }

  viewDeptDetails(encId:any){
    this.spinner.show();
    const obj ={techId : encId}
    this.teacherEncId = encId;
    this.TeacherServiceService.getDeputeDetails(obj).subscribe({
      next: (res: any) => {          
        this.spinner.hide();        
        this.deputeModalData = res?.data;
        this.deputationId = this.deputeModalData?.deptId;
        this.minDate = new Date(this.deputeModalData?.deputationFromDate?.toString());
        this.initializeForm();
      },
      error: (error: any) => {
        this.isLoading = false;
        this.spinner.hide();
      },
      
    });
  

  }
  viewDeptHistory(encId:any){
    this.spinner.show();
    const obj ={techId : encId}
    this.teacherEncId = encId;
    this.TeacherServiceService.getDeputeHistory(obj).subscribe({
      next: (res: any) => {          
        this.spinner.hide();    
        this.orgSchoolData = res?.actualSchoolData;   
        this.deputeHistoryData = res?.data;
        this.deputationId = this.deputeHistoryData?.deptId;
        this.minDate = new Date(this.deputeHistoryData?.deputationFromDate?.toString());
        this.initializeForm();
      },
      error: (error: any) => {
        this.isLoading = false;
        this.spinner.hide();
      },
      
    });
  

  }
  initializeForm() {
    this.teacherReturnForm = this.formBuilder.group({      
      teacherIdModal: [this.teacherEncId],
      deputationIdModal : [this.deputationId],
      deputationToDate: [this.deputationToDate,[Validators.required]],      
      userId : [this.userId]
    });
  }
  getFormValue(allValue: any) {    
    return {     
      ...allValue,
      deputationToDate: this.commonFunctionHelper.formatDateHelper(
        allValue?.deputationToDate
      ),    
          
    };
  }
  onSubmit(){
    if ("INVALID" === this.teacherReturnForm.status) {
      for (const key of Object.keys(this.teacherReturnForm.controls)) {
        if (this.teacherReturnForm.controls[key].status === "INVALID") {
          const invalidControl = this.el.nativeElement.querySelector(
            '[formControlName="' + key + '"]'
          );
          invalidControl.focus();
          this.customValidators.formValidationHandler(this.teacherReturnForm, this.allLabel);
          break;
        }
      }
    }
    if (this.teacherReturnForm.invalid) {
      return;
    }
    if (this.teacherReturnForm.valid === true) {
      this.alertHelper.submitAlert().then((result: any) => {
        if (result.value) {
          const allValue = this.teacherReturnForm.value;
          this.spinner.show(); // ==== show spinner

          this.TeacherServiceService
            .updateReturnDate(this.getFormValue(allValue))
            .subscribe({
              next: (res: any) => {
                this.spinner.hide(); //==== hide spinner
                this.alertHelper
                  .successAlert(
                    "Saved!",
                    "Teacher deputation status updated successfully.",
                    "success"
                  )
                  .then(() => {                   
                   this.closebuttonService.nativeElement.click();
                      this.loadTeacherData(this.getSearchParams());
                      this.initializeForm();
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
              // complete: () => console.log("done"),
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
    console.log(pageUrl);
    
    window.open(pageUrl, "_blank");    
  }
}
