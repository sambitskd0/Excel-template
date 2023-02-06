import { Component, Input, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder,FormGroup, NgForm,ValidatorFn,Validators  } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { ProgressBarMode } from '@angular/material/progress-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute,Router } from '@angular/router';
import { MatTableExporterDirective } from 'mat-table-exporter';
import { NgxSpinnerService } from 'ngx-spinner';
import { AlertHelper } from 'src/app/core/helpers/alert-helper';
import { PrivilegeHelper } from 'src/app/core/helpers/privilege-helper';
import { CommonserviceService } from 'src/app/core/services/commonservice.service';
import { Constant } from 'src/app/shared/constants/constant';
import { CustomValidators } from 'src/app/shared/validations/custom-validators';
import { SchoolService } from '../services/school.service';
import { environment } from 'src/environments/environment';
import { ErrorHandler } from "src/app/core/helpers/error-handler";
@Component({
  selector: 'app-view-school',
  templateUrl: './view-school.component.html',
  styleUrls: ['./view-school.component.css']
})
export class ViewSchoolComponent implements OnInit {
  public fileUrl1 = environment.filePath;
  public show:boolean = true;
  public buttonName:any = 'Show';
  @ViewChild("searchForm") searchForm!: NgForm;
  public userProfile = JSON.parse(sessionStorage.getItem("userProfile") || '{}');
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
  adminPrivilege: boolean = false;
  displayedColumns: string[] = [];
  viewSchoolData: any = [];
  dataSource = new MatTableDataSource(this.viewSchoolData);
  //end
  paramObj: any; 
  serviceType: string = "Search";
  isLoading = false;
  pageIndex: any = 0;
  previousSize: any = 0;

  loginUserTypeId:any = "";
  searchAcademicYear:any = "";
  searchDistrictId:any = "";
  searchBlockId:any = "";
  searchClusterId:any = "";
  operationalStatus:any="0";
  schoolName:any="";
  searchManagementId:any="";
  searchSchoolCategoryId:any="";

  scDisrtictSelect:boolean = true; 
  scDisrtictLoading:boolean = false; 
  scBlockSelect:boolean = true; 
  scBlockLoading:boolean = false; 
  scClusterSelect:boolean = true;
  scClusterLoading:boolean = false;
  scSchoolSelect:boolean = true;
  scSchoolLoading:boolean = false; 
  scManagementSelect:boolean=true;
  scManagementLoading:boolean=false;
  scSchoolCategorySelect:boolean=true;
  scSchoolCategoryLoading:boolean=false;
  loginUserType:any = '';
  // schoolSearchform ! : FormGroup
  posts: any; 
  select_all = false;
  isEmpty: boolean = false; 
  
  userId:any="";
  id:any="";
  districtId:any ;
  blockId:any ;
  clusterId:any ;
  //schoolCategoryId:any="";
  districtData: any= [];
  blockData: any = [];
  clusterData: any =[];
  schoolTypeData:any = [];
  schoolMgmtData:any = [];
  schoolCatData:any = [];
  schoolListData:any = [];
  schoolStatusData:any = [];

  showSpinnerBlock: boolean = false;
  disrtictChanged:boolean = false; 
  clusterChanged:boolean = false; 
  blockChanged:boolean = false; 
  //schoolCategorySelect:boolean=false;
  disrtictSelect:boolean = true; 
  clusterSelect:boolean = true; 
  blockSelect:boolean = true; 
  schoolTypeChanged:boolean = false;
  schoolMgmtChanged:boolean = false;
  schoolCatagoryChanged:boolean = false;

 plPrivilege: string = "view"; //For menu privilege
  isNorecordFound: boolean = false;
  isInitAdmin: boolean = false;
  /* School Status Form Control :: Start */
  submitted = false;
  public fileUrl = environment.filePath;

  allLabel: string[] = [
    "Status",
    "Remarks",
    "Upload Document"
  ];

  schoolStatusform! : FormGroup
  activationFlag:any = 0;
  activationRemark:any = '';
  activationDoc:any = '';
  activationDocPath:any = '';
  designationId:any = '';
  fileSource!:File;
  docExist:boolean= false;
  encId:any = '';
  profileId:any = '';
  config = new Constant();
  academicYear:any = this.config.getAcademicCurrentYear();


  /* School Status Form Control :: End */

  /** Verification Form Controls Intialization :: Start */
  crApprovalForm!: FormGroup;
  crStatus:any = '2';
  remarks:any = '';
  schoolId:any = '';
  @ViewChild('schlCRApproveClose') schlCRApproveClose!:any;
  revertReason:any = '';
/** Verification Form Controls Intialization :: Start */
schlVerifyForm!: FormGroup;
verifyType:any = '1';
verifyReqSchoolId:any = '';
verificationRemark:any = '';
verReq:any = '';
@ViewChild('schlVerificationApprovrClose') schlVerificationApprovrClose!:any;
vfRevertReason:any = '';
  constructor(
    private commonService:CommonserviceService,
    private schoolService:SchoolService,
    private formBuilder: FormBuilder,
    private spinner: NgxSpinnerService,
    private alertHelper: AlertHelper,
    private route:Router,
    private router:ActivatedRoute,
    private errorHandler: ErrorHandler,
    public customValidators: CustomValidators,
    private el: ElementRef,
    private privilegeHelper: PrivilegeHelper,
  ) {
    const pageUrl:any = this.route.url;  
    this.plPrivilege = this.privilegeHelper.PrimaryLinkPrivilege(pageUrl);  //For menu privilege    
    this.commonService.verifyLinkPermission(pageUrl, this.config.linkType[2], this.config.privilege[1]);  // For authorization
    const users = this.commonService.getUserProfile();
    this.userId = users?.userId; 
  }
ngOnInit(): void {
  if(this.plPrivilege=='admin'){
    this.adminPrivilege = true;
    this.displayedColumns = [
      "slNo",
      "SchoolUDISECode",
      "District",
      "Block",
      "Cluster",
      "SchoolName",
      "Management",
      "Category",
      "Status",
      "Info",
      "AcadmicYear",
      "Remarks",
      "pending_at",
      "action", 
      
    ]; 
  } else {
    this.displayedColumns = [
      "slNo",
      "SchoolUDISECode",
      "District",
      "Block",
      "Cluster",
      "SchoolName",
      "Management",
      "Category",
      "Status",
      "Info",
      "AcadmicYear",
      "Remarks",
      "pending_at",
      "action", 
      // "Verification Status",
      
      
    ]; 
  }
    this.searchAcademicYear = this.academicYear;
    this.userProfile = this.commonService.getUserProfile();
    this.designationId = this.userProfile?.designationId;
    this.loginUserType = this.userProfile?.loginUserType;
    this.loginUserTypeId = this.userProfile?.loginUserTypeId;
    if(this.userProfile.district != 0 || this.userProfile.district != ""){
      this.districtId = this.userProfile.district;
      this.disrtictSelect = false;
    }
    if(this.userProfile.block != 0 || this.userProfile.block != ""){
      this.blockId = this.userProfile.block; 
      this.blockSelect = false;
    }    
    if(this.userProfile.cluster != 0 || this.userProfile.cluster != ""){
      this.clusterId = this.userProfile.cluster; 
      this.clusterSelect = false;
    }
    // if(this.userProfile.schoolCategory != 0 || this.userProfile.schoolCategory != ""){
    //   this.schoolCategoryId = this.userProfile.schoolCategory; 
    //   this.schoolCategorySelect = false;
    // }

    if(this.userProfile.loginUserTypeId != 3){      
      this.loadSchoolData(this.getSearchParams());
    }else{
      this.isInitAdmin = true;
    }
    this.getDistrict();
    this.getSchoolType();
    this.getSchoolManagement();
    this.getSchoolCategory();
    this. initSchoolStatusForm();
    this.initializeCRForm();
    this.initializeVerifyForm();
  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  requestToModify(schoolId:any){
    this.alertHelper
      .confirmAlert("Are you sure to request for modify?")
      .then((result) => {
        if(result.value){
          this.spinner.show(); // show spinner
          this.isLoading = true;
          let paramList: any = {
            schoolId: schoolId,
            createdBy: this.userProfile.userId,
            profileId: this.userProfile.profileId,
          };
          this.schoolService.requestToModify(paramList).subscribe({
            next: (res: any) => {
              if (res?.status === "SUCCESS") {
                this.alertHelper.successAlert("Saved!",res.msg,"success")
                .then(() => {
                  this.loadSchoolData(this.getSearchParams());
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
  assignToSchool(schoolId:any,respondentName:any,respondentNumber:any){
    console.log(respondentName,"name-mob",respondentNumber);
    if(respondentName=="" || respondentNumber==""){
      this.alertHelper.viewAlert("error","Invalid","Please fill up respondent name and respondent number then you can assign.");
    }else{
      this.alertHelper
      .confirmAlert("Are you sure to assign to school?")
      .then((result) => {
        if(result.value){
          this.spinner.show(); // show spinner
          this.isLoading = true;
          let paramList: any = {
            schoolId: schoolId,
            createdBy: this.userProfile.userId,
            profileId: this.userProfile.profileId,
          };
          this.schoolService.assignToSchool(paramList).subscribe({
            next: (res: any) => {
              if (res?.status === "SUCCESS") {
                this.alertHelper.successAlert("Saved!",res.msg,"success")
                .then(() => {
                  this.loadSchoolData(this.getSearchParams());
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

  }
  requestforVerification(schoolId:any){
    this.alertHelper
      .confirmAlert("Are you sure to request for verification?")
      .then((result) => {
        if(result.value){
          this.spinner.show(); // show spinner
          this.isLoading = true;
          let paramList: any = {
            schoolId: schoolId,
            createdBy: this.userProfile.userId,
            profileId: this.userProfile.profileId,
          };
          this.schoolService.requestToVerify(paramList).subscribe({
            next: (res: any) => {
              if (res?.status === "SUCCESS") {
                this.alertHelper.successAlert("Saved!",res.msg,"success")
                .then(() => {
                  this.loadSchoolData(this.getSearchParams());
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
      //remarks: [this.remarks,Validators.required],
      remarks: [this.remarks],
      schoolId: [this.schoolId],
      createdBy: [this.userProfile.userId],
      profileId: [this.userProfile.profileId],
      sessionValue: [this.userProfile],
    });
  }
  approvalForCR(schoolId:any){
    this.initializeCRForm();
    this.crApprovalForm.patchValue({ schoolId: schoolId });
  }
  rdverifyStatusControl(val: any) {
    this.crStatus = val;
    // this.initializeVerifyForm();
  }
  checkRemarks(){
    if(this.crApprovalForm?.get("crStatus")?.value == 3 && this.crApprovalForm?.get("remarks")?.value.length == 0){
      const invalidControl = this.el.nativeElement.querySelector(
        '[formControlName="remarks"]');
          invalidControl.focus();
          this.alertHelper.viewAlert("error","Invalid","Please provide revert remarks.");
      return;
    }else if(this.crApprovalForm?.get("crStatus")?.value == 3 && this.crApprovalForm?.get("remarks")?.value.length > 500){
      const invalidControl = this.el.nativeElement.querySelector(
        '[formControlName="remarks"]');
          invalidControl.focus();
          this.alertHelper.viewAlert("error","Invalid","Revert remarks can not be grater than 500 charecter");
      return;
    }else{
      return true;
    }
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

    if (this.crApprovalForm.valid === true && this.checkRemarks()) {
      this.alertHelper.submitAlert().then((result: any) => {
        if(result.value) {
          this.spinner.show(); // ==== show spinner
          this.schoolService
            .crApproval(this.crApprovalForm.value)
            .subscribe({
              next: (res: any) => {
                this.spinner.hide(); //==== hide spinner
                this.alertHelper.successAlert("Saved!",res.msg,"success")
                  .then(() => {
                    this.schlCRApproveClose.nativeElement.click();
                    this.clearControl(this.crApprovalForm,["crStatus","studentId","remarks"]);
                    this.initializeCRForm();  
                    this.loadSchoolData(this.getSearchParams());
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
  showRevertReason(reason:any){
    this.revertReason = reason;
  }
 
  verifySchool(encId:any){
    this.alertHelper
    .confirmAlert("Are you sure to verify?")
    // .deleteAlert("Are you sure to verify?", "", "question", "Yes, verify it!")
    .then((result) => {
      if (result.value) {
        this.spinner.show();
        this.isLoading = true;
        this.schoolService
          .verifySchool(encId, this.userId )
          .subscribe({
            next: (res: any) => {
              if (res?.success === true) {
                this.alertHelper.successAlert(
                  "Verified!",
                  "Verified Successfully",
                  "success"
                );
                this.loadSchoolData(this.getSearchParams());
              } else {
                this.alertHelper.viewAlert("info", res?.msg, "");
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
  verificationStatusChangeControl(val: any) {
    this.verifyType = val;
  
  }
  ActionOnSchlVerificationReq(schlId:string,verReq:any){ 
    this.schoolId = schlId;
    this.verReq=verReq;
    this.schlVerifyForm.patchValue({schoolId: schlId});
  }
  initializeVerifyForm() {
    this.schlVerifyForm = this.formBuilder.group({
      verifyType: [this.verifyType,Validators.required],
      verificationRemark: [this.verificationRemark, ],
      schoolId: [this.schoolId],
      createdBy: [this.userProfile.userId],
      profileId: [this.userProfile.profileId],
      sessionValue: [this.userProfile],
    });
  }

  checkVerificationRemarks(){
    if(this.schlVerifyForm?.get("verifyType")?.value == 2 && this.schlVerifyForm?.get("verificationRemark")?.value.length == 0){
      const invalidControl = this.el.nativeElement.querySelector(
        '[formControlName="verificationRemark"]');
          invalidControl.focus();
          this.alertHelper.viewAlert("error","Invalid","Please provide revert remarks.");
      return;
    }else if(this.schlVerifyForm?.get("verifyType")?.value == 2 && this.schlVerifyForm?.get("verificationRemark")?.value.length > 500){
      const invalidControl = this.el.nativeElement.querySelector(
        '[formControlName="verificationRemark"]');
          invalidControl.focus();
          this.alertHelper.viewAlert("error","Invalid","Revert remarks can not be grater than 500 charecter");
      return;
    }else{
      return true;
    }
  }
  onVerifySubmit(){
    this.submitted = true;
    if (this.schlVerifyForm.valid === true && this.checkVerificationRemarks()) {
      this.alertHelper.submitAlert().then((result: any) => {
        if(result.value) {
          this.spinner.show(); // ==== show spinner
          this.schoolService
            .onVerifySubmit(this.schlVerifyForm.value)
            .subscribe({
              next: (res: any) => {
                this.spinner.hide(); //==== hide spinner
                this.alertHelper.successAlert("Saved!","School varification action taken successfully.","success")
                  .then(() => {
                    this.schlVerificationApprovrClose.nativeElement.click();
                    this.clearControl(this.schlVerifyForm,["verifyType","verificationRemark","verifyReqSchoolId"]);
                    this.initializeVerifyForm();  
                    this.loadSchoolData(this.getSearchParams());
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
      for(const control of Object.keys(this.schlVerifyForm.controls)) {
        this.schlVerifyForm.controls[control].markAsTouched();
    
      }
    }
  }
  showVfRevertReason(vfReason:any){
    this.vfRevertReason = vfReason;
  }
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
  getSearchParams() {
    return {
      previousSize: this.previousSize,
      offset: this.offset.toString(),
      pageSize: this.pageSize.toString(), 
      searchAcademicYear: this.searchAcademicYear,
      searchDistrictId: this.searchDistrictId,
      searchBlockId: this.searchBlockId,
      searchClusterId: this.searchClusterId,
      operationalStatus:this.operationalStatus,
      schoolName:this.schoolName,
      searchManagementId:this.searchManagementId,
      searchSchoolCategoryId:this.searchSchoolCategoryId,
    };
  }
  loadSchoolData(...params: any){
    this.spinner.show();
    const {
      previousSize,
      offset,
      pageSize, 
      searchDistrictId,
      searchBlockId,
      searchClusterId,
      searchAcademicYear,
      operationalStatus,
      schoolName,
      searchManagementId,
      searchSchoolCategoryId,
      
    } = params[0];
    this.paramObj = {
      offset: offset,
      limit: pageSize,
      //userId:this.userProfile.userId,
      loginUserType:this.userProfile.loginUserType,
      schoolId:this.userProfile.school,
      searchDistrictId:searchDistrictId,
      searchBlockId:searchBlockId,
      searchClusterId:searchClusterId,
      searchAcademicYear:searchAcademicYear,
      operationalStatus:operationalStatus,
      schoolName:schoolName,
      searchManagementId:searchManagementId,
      searchSchoolCategoryId:searchSchoolCategoryId,
      serviceType: this.serviceType, 
      userId: this.userId   
      
    };
    this.isLoading = true;
    //console.log(this.paramObj);    
    this.schoolService.viewSchool(this.paramObj).subscribe({
      next: (res: any) => {
        this.viewSchoolData.length = previousSize; // set current size
        this.viewSchoolData.push(...res?.data); // merge with existing data
        this.viewSchoolData.length = res?.totalRecord; // update length
        this.dataSource.paginator = this.paginator; // update paginator
        this.dataSource._updateChangeSubscription(); // update table
        this.isLoading = false;
        this.isNorecordFound = this.viewSchoolData.length ? false : true;
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
    this.loadSchoolData(this.getSearchParams());
  }
  onSearch() {
    this.pageIndex = 0;
    this.previousSize = 0;
    this.offset = 0;
    // this.previousSize = 0;   
      if (this.validateForm() === true) {
        this.spinner.show();
        this.loadSchoolData(this.getSearchParams());
        this.isInitAdmin = false;
      } 
  }
  validateForm() :Boolean{
    // if (this.searchDistrictId === "") {
    //   this.alertHelper.successAlert(
    //     "",
    //     "Please select District.",
    //     "info"
    //   );
    //   return false;
    // }
    // if (this.searchBlockId === "") {
    //   this.alertHelper.successAlert(
    //     "",
    //     "Please select Block.",
    //     "info"
    //   );
    //   return false;
    // }
    // if (this.searchClusterId === "") {
    //   this.alertHelper.successAlert(
    //     "",
    //     "Please select Cluster.",
    //     "info"
    //   );
    //   return false;
    // }
    // if (this.searchManagementId === "") {
    //   this.alertHelper.successAlert(
    //     "",
    //     "Please select Cluster.",
    //     "info"
    //   );
    //   return false;
    // }
    // if (this.searchSchoolCategoryId === "") {
    //   this.alertHelper.successAlert(
    //     "",
    //     "Please select Cluster.",
    //     "info"
    //   );
    //   return false;
    // }
    return true;
    
  }
  deleteSchool(id: number) {
  const users = this.commonService.getUserProfile();
  this.userId = users?.userId;
  this.profileId = users?.profileId;
  this.alertHelper
    .deleteAlert("Are you sure to delete?", "", "question", "Yes, delete it!")
    .then((result) => {
      if (result.value) {
        this.spinner.show();
        this.isLoading = true;
        this.schoolService
          .deleteSchool(id, this.userId,this.profileId)
          .subscribe({
            next: (res: any) => {
              if (res?.success === true) {
                this.alertHelper.successAlert(
                  "Deleted!",
                  "Deleted Successfully",
                  "success"
                );
                this.loadSchoolData(this.getSearchParams());
              } else {
                this.alertHelper.viewAlert("info", res?.msg, "");
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
  getSchoolStatus(encId: string){
    this.schoolService.getSchoolStatus(encId).subscribe((res: any) => {
    this.schoolStatusData = res.data;    
      
      this.activationFlag = this.schoolStatusData.activationFlag;
      this.activationRemark = this.schoolStatusData.activationRemark;
      this.encId = this.schoolStatusData.encId;
      this.academicYear = this.schoolStatusData.academicYear;
      if(this.schoolStatusData.activationDoc !== null && this.schoolStatusData.activationDoc.length>0){
        this.docExist= true;
        var str = this.schoolStatusData.activationDoc;
        var newstr = str.replace('.','~'); 
        this.activationDocPath= this.fileUrl+'/'+newstr;   
      }else{
        this.docExist= false;
        this.activationDocPath = '';
      }
      this.initSchoolStatusForm();
    });
  }
  initSchoolStatusForm(){
    this.schoolStatusform = this.formBuilder.group({
      activationFlag:[this.activationFlag],
      activationRemark:[this.activationRemark,[Validators.required,Validators.maxLength(300)]],
      activationDoc: [this.activationDoc],
      fileSource: [''],
      encId: [this.encId],
      academicYear: [this.academicYear],
      sessionValue:[this.userProfile],  
      profileId:[this.profileId],   
    });
  }
  updateSchoolStatus(){
    //this.customValidators.customFormValidationHandler(this.schoolStatusform);
    if ("INVALID" === this.schoolStatusform.status) {
      for (const key of Object.keys(this.schoolStatusform.controls)) {
        if (this.schoolStatusform.controls[key].status === "INVALID") {
          const invalidControl = this.el.nativeElement.querySelector(
            '[formControlName="' + key + '"]'
          );
          invalidControl.focus();
          this.customValidators.formValidationHandler(this.schoolStatusform,this.allLabel);
          break;
        }
      }
    }

    if (this.schoolStatusform.valid === true) {
      this.alertHelper.submitAlert().then((result: any) => {
        if (result.value) {
          this.spinner.show(); 
          this.schoolService
            .updateSchoolStatus(this.schoolStatusform.value)
            .subscribe({
              next: (res: any) => {
                this.spinner.hide(); 
                this.alertHelper
                  .successAlert(
                    "Saved!",
                    "School status updated successfully.",
                    "success"
                  )
                  .then(() => {
                    window.location.reload();
                    // this.route.navigate(["../../schoolRegistration/viewSchool"], {
                    //   relativeTo: this.router,
                    // });
                  });
              },
              error: (error: any) => {
                this.spinner.hide(); 
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
    }
    
  }
  onFileChange(event:any) {
    
    let file = event.target.files;
    var ext = file[0].name.substring(file[0].name.lastIndexOf(".") + 1);    

    if (ext == "jpg" || ext == "png" || ext == "jpeg" || ext == "pdf" || ext == "JPG" || ext == "PNG" || ext == "JPEG" || ext == "PDF") {
      const fileSize = file[0].size;
      const fileSizeInKB = Math.round(fileSize / 1024);
      if (fileSizeInKB > 2000) {
        this.alertHelper.viewAlert(
          "error",
          "Invalid",
          "Upload document of maximum 2MB"
        );  
        this.schoolStatusform.patchValue({
          activationDoc: "",
        });      
        return;
      } else{
        var doc:File = event.target.files[0];
        var myReader:FileReader = new FileReader();
        myReader.onloadend = (e) => {
          this.schoolStatusform?.patchValue({
            fileSource: myReader.result
          });
        }
        myReader.readAsDataURL(doc);
      }
    } else {
      this.alertHelper.viewAlert("error", "Invalid", "Inavlid file format");
      this.schoolStatusform.patchValue({
        activationDoc: "",
      });
    }
  }
  getDistrict(){
    this.disrtictChanged = true;
    this.commonService.getAllDistrict().subscribe((res:[])=>{
      this.posts = res;
      this.districtData = this.posts.data; 
      if(this.userProfile.district != 0 || this.userProfile.district != ""){
        this.districtData = this.districtData.filter((dis: any) => {    
          return dis.districtId == this.userProfile.district;
        });
        this.searchForm.controls['searchDistrictId']?.patchValue(this.userProfile.district);
        this.getBlock(this.userProfile.district);
      }    
      this.disrtictChanged = false;
     });
  }
  getBlock(id: any) {  
    this.blockChanged = true;
    const districtId = id;
    this.blockData = [];  
    if(districtId !== ''){        
      this.commonService.getBlockByDistrictid(districtId).subscribe((res) => {      
        let data: any = res;
        for (let key of Object.keys(data['data'])) {
          this.blockData.push(data['data'][key]);
        }
        if(this.userProfile.block != 0 || this.userProfile.block != ""){
          this.blockData = this.blockData.filter((blo: any) => {
            return blo.blockId == this.userProfile.block;
          });
          this.searchForm.controls['searchBlockId']?.patchValue(this.userProfile.block);
          this.getCluster(this.userProfile.block);
        }
        this.blockChanged = false;
      });
    }else{
      this.blockChanged = false;
    }    
  }
  getCluster(id: any) {   
    this.clusterChanged = true;
    const blockId = id;
    this.clusterData = [];  
    if(blockId !== ''){    
      this.commonService.getClusterByBlockId(blockId).subscribe((res) => {      
        let data: any = res;
        for (let key of Object.keys(data['data'])) {
          this.clusterData.push(data['data'][key]);
        }
        if(this.userProfile.cluster != 0 || this.userProfile.cluster != ""){
          this.clusterData = this.clusterData.filter((cls: any) => {
            return cls.clusterId == this.userProfile.cluster;
          });
        }
        this.searchForm.controls['searchClusterId']?.patchValue(this.userProfile.cluster);
        this.clusterChanged = false;
      });
    }else{
      this.clusterChanged = false;
    }
  }
  getSchoolType(){
    this.schoolTypeChanged = true;
    this.schoolTypeData = [];  
    this.commonService.getSchoolType().subscribe((res)=>{
      this.posts = res;
      let data: any = res;
      for (let key of Object.keys(data['data'])) {
        this.schoolTypeData.push(data['data'][key]);
      } 
      this.schoolTypeChanged = false;
     });  
  }
  getSchoolManagement(){
    this.schoolMgmtChanged = true;
    this.schoolMgmtData = [];  
    this.commonService.getSchoolManagement().subscribe((res)=>{
      this.posts = res;
      let data: any = res;
      for (let key of Object.keys(data['data'])) {
        this.schoolMgmtData.push(data['data'][key]);
      } 
      this.schoolMgmtChanged = false;
     });  
  }
  getSchoolCategory(){
    this.schoolCatagoryChanged = true;
    this.schoolCatData = [];  
    this.schoolService.getSchoolCategory().subscribe((res)=>{
      this.posts = res;
      let data: any = res;
      for (let key of Object.keys(data['data'])) {
        this.schoolCatData.push(data['data'][key]);
      } 
      this.schoolCatagoryChanged = false;
     });  
  }
  downloadSchoolList()
  {
    this.spinner.show();   
    this.paramObj.serviceType = "Download";

    this.schoolService.viewSchool(this.paramObj).subscribe({
      next: (res: any) => {       
        let filepath = this.fileUrl1 + '/' + res.data.replace('.', '~');
        window.open(filepath);
        this.spinner.hide();
      },
      error: (error: any) => {
        this.spinner.hide();
      },
    });
  }
  toggle() {
    this.show = !this.show;
    if(this.show)  
      this.buttonName = "Hide";
    else
      this.buttonName = "Show";
  }
  onSelectAll(e: any): void {}
  printPage() {
    let cloneTable 	= document.getElementById("viewTable")?.innerHTML;
    const pageTitle = document.querySelector(".pageName")?.innerHTML;
    this.commonService.printPage(cloneTable, pageTitle);
  }
}
