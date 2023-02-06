import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators,NgForm } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { ProgressBarMode } from '@angular/material/progress-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { MatTableExporterDirective } from 'mat-table-exporter';
import { NgxSpinnerService } from 'ngx-spinner';
import { CommonFunctionHelper } from 'src/app/core/helpers/common-function-helper';
import { PrivilegeHelper } from 'src/app/core/helpers/privilege-helper';
import { CommonserviceService } from 'src/app/core/services/commonservice.service';
import { Constant } from 'src/app/shared/constants/constant';
import { CustomValidators } from 'src/app/shared/validations/custom-validators';
import { environment } from 'src/environments/environment';
import { SchoolService } from '../../school/services/school.service';
import { DocterDetailsService } from '../services/doctor-details.service';
import { HealthCheckUpService } from '../services/health-check-up.service';
import { SmartClassService } from '../services/smart-class.service';

@Component({
  selector: 'app-view-health-check-up',
  templateUrl: './view-health-check-up.component.html',
  styleUrls: ['./view-health-check-up.component.css']
})
export class ViewHealthCheckUpComponent implements OnInit {
  paramObj: any;
  serviceType: string = "Search";
  public fileUrl = environment.filePath;
  @ViewChild("searchForm") searchForm!: NgForm;
  public userProfile = JSON.parse(sessionStorage.getItem("userProfile") || '{}');
  public show:boolean = true;
  public buttonName:any = 'Show';
  optionVal:any;
  config = new Constant();
  clusterName: any = "";
  schoolName: any = "";
  blockName: any = "";
  districtName: any = "";
  villageName: any = "";
  schoolUdiseCode: any = "";
  schoolInfoData: any;
  academicYear: any = this.config.getAcademicCurrentYear();
  userId: any = "";
  schoolId: any="";
  healthCheckupSearchForm!: FormGroup;
  classData: any;
  streamData: any;
  groupData: any;
  sectionData: any;
  doctorData: any;
  healthCheckupData: any;

  classId: any = "";
  streamId: any = "";
  groupId: any = "";
  sectionId: any = "";
  checkupDate: any = "";
  doctorId: any = "";
  checkupDateStr: any = "";
  descFullText: any = "";
  isInitAdmin: boolean=false;

  // ===============Material Table Variable and Decorators
  isLoading = false;
  isNorecordFound: boolean = false;
  pageIndex: any = 0;
  previousSize: any = 0;
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
  // start define mat table reference columns
  displayedColumns: string[] = []; // end define mat table columns
  resultListData: any = [];
  dataSource = new MatTableDataSource(this.resultListData);
  //end Material Table Variable and Decorators
  searchAcademicYear:any = "";
  searchDistrictId:any = "";
  searchBlockId:any = "";
  searchClusterId:any = "";
  searchSchoolId:any = "";
  studentCode:any = "";

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
  districtData: any = [];
  getSchoolData: any = [];
  clusterData: any = [];
  classChanged: boolean = false;
  plPrivilege:string="view"; //For menu privilege
  adminPrivilege: boolean = false;
  tabs: any = [];  //For shwoing tabs
  maxDate: any = Date;
  constructor(
    private commonService: CommonserviceService,
    private privilegeHelper: PrivilegeHelper,   //For menu privilege
    private router:Router,
    private spinner: NgxSpinnerService,
    private schoolService: SchoolService,
    private formBuilder: FormBuilder,
    private smartClassService: SmartClassService,
    public healthCheckUpService: HealthCheckUpService,
    private docterDetailsService: DocterDetailsService,
    private commonFunctionHelper: CommonFunctionHelper,
    public  customValidators: CustomValidators,
  ) { const pageUrl:any = this.router.url;  
    this.plPrivilege = this.privilegeHelper.PrimaryLinkPrivilege(pageUrl);  //For menu privilege    
    this.commonService.verifyLinkPermission(pageUrl, this.config.linkType[2], this.config.privilege[1]);  // For authorization
    this.tabs = this.privilegeHelper.PrimaryLinkTabNames(pageUrl);  //For shwoing tabs 
    this.maxDate = new Date();
  }
  ngOnInit(): void {
    this.spinner.show();
    if(this.plPrivilege=='admin'){
      this.adminPrivilege = true;
      this.displayedColumns = [
          "slNo",
          "Student_Code",
          "Student_Name",
          "Chest",
          "dental",
          "throat",
          "Left_Eye",
          "Right_Eye",
          "Hemoglobin_Level",
          "Dose_of_De_Worming",
          "Hearing",
          "Chronic_Disease",
          "Weight",
          "Height",
          "BMI",
          "Blood_Pressure",
          "Doctor's_Name",
          "Checkup_Date",
          "Doctor's_Advice",
          "Emergency_Contact_No",
          "action",
      ]; 
    } else {
      this.displayedColumns = [
        "slNo",
        "Student_Code",
        "Student_Name",
        "Chest",
        "dental",
        "throat",
        "Left_Eye",
        "Right_Eye",
        "Hemoglobin_Level",
        "Dose_of_De_Worming",
        "Hearing",
        "Chronic_Disease",
        "Weight",
        "Height",
        "BMI",
        "Blood_Pressure",
        "Doctor's_Name",
        "Checkup_Date",
        "Doctor's_Advice",
        "Emergency_Contact_No",
      ]; 
    }
    this.getDistrict();
    this.searchAcademicYear=this.academicYear;
    const userProfile = this.commonService.getUserProfile();
    this.schoolId = userProfile?.school;
    this.userId = userProfile?.userId;
    if(userProfile.loginUserTypeId ==2){
      this.getSchoolClasses(this.schoolId);
      this.getSchoolInfo(this.schoolId, this.academicYear);
      this.getDoctors(this.schoolId);
      this.viewHealthCheckup(this.getSearchParams());
    }
    else{
      this.isInitAdmin = true;
     
    }
      this.initializeFormForSearch();
      // this.spinner.hide();
  }
   // ===========initialize Datasource after complete Component Load
   ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
   // ==============Get serch Parameters For Material Table
   getSearchParams() {
    if(this.checkupDate != ""){
      this.checkupDateStr = this.commonFunctionHelper.formatDateHelper(this.checkupDate);
    }
    return {
      previousSize: this.previousSize,
      offset: this.offset.toString(),
      pageSize: this.pageSize.toString(),
      schoolId: this.schoolId,
      searchAcademicYear: this.searchAcademicYear,
      searchDistrictId: this.searchDistrictId,
      searchBlockId: this.searchBlockId,
      searchClusterId: this.searchClusterId,
      searchSchoolId: this.searchSchoolId,
      classId: this.classId,
      sectionId: this.sectionId,
      streamId: this.streamId,
      groupId: this.groupId,
      checkupDate: this.checkupDateStr,
      doctorId: this.doctorId,
      studentCode: this.studentCode,
    };
  }
  // ===========For Updation Table If Page Changes
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
    this.viewHealthCheckup(this.getSearchParams());
  }
  onSearch() {
    this.pageIndex = 0;
    this.previousSize = 0;
    this.offset = 0;
    this.resultListData.splice(0, this.resultListData.length); // empty current data
    this.dataSource.paginator = this.paginator; // update paginator
    this.viewHealthCheckup(this.getSearchParams());
    this.isInitAdmin = false;
  }
  getSchoolInfo(schoolId: any, academicYear: any) {
    this.schoolService
      .getSchoolInfo(schoolId, academicYear)
      .subscribe((res: any) => {
        this.schoolInfoData = res.data[0];
        this.districtName = this.schoolInfoData?.districtName;
        this.blockName = this.schoolInfoData?.blockName;
        this.clusterName = this.schoolInfoData?.clusterName;
        this.villageName = this.schoolInfoData?.villageName;
        this.schoolName = this.schoolInfoData?.schoolName;
        this.schoolUdiseCode = this.schoolInfoData?.schoolUdiseCode;
        // this.spinner.hide();
      });
  }
  initializeFormForSearch() {
    this.healthCheckupSearchForm = this.formBuilder.group({
      userId: [this.userId],
      schoolId: [this.schoolId],
      academicYear: [this.academicYear],
      classId: [this.classId, Validators.required],
      streamId: [this.streamId],
      groupId: [this.groupId],
      sectionId: [this.sectionId],
      checkupDate: [this.checkupDate],
      doctorId: [this.doctorId],
    });
  }
  getSchoolClasses(schoolEncId:string) {
    this.classChanged = true;
    if(schoolEncId !== ''){
      this.schoolService.getSchoolClasses(schoolEncId).subscribe((res : any = []) => {
        this.classData = res.data;
           this.classChanged = false;
      });
    }
  }
  getSchoolWiseClasses(schoolId:any){
    this.healthCheckupSearchForm.patchValue({
      streamId: "",
    });
    this.healthCheckupSearchForm.patchValue({
      groupId: "",
    });
    this.healthCheckupSearchForm.patchValue({
      sectionId: "",
    });
    this.classId = '';
    this.classChanged = true;
    if (schoolId !== "") {
      this.schoolService
        .getSchoolWiseClasses(schoolId)
        .subscribe((res: any = []) => {
          this.classData = res.data;
          this.classChanged = false;
        });
    }
  }
  getStream() {
    this.commonService
      .getCommonAnnexture(["STREAM_TYPE"])
      .subscribe((data: any = []) => {
        this.streamData = data?.data?.STREAM_TYPE;
      });
  }
  getGroup() {
    this.commonService
      .getCommonAnnexture(["STREAM_GROUP_TYPE"])
      .subscribe((data: any = []) => {
        this.groupData = data?.data?.STREAM_GROUP_TYPE;
      });
  }
  getSection(classId: any, schoolId: any, academicYear: any) {
    this.smartClassService
      .getSection(classId, schoolId, academicYear)
      .subscribe((data: any = []) => {
        this.sectionData = data;
        this.sectionData = this.sectionData.data["sections"];
      });
  }
  getDoctors(schoolId: any) {
    this.docterDetailsService
      .getDoctorAccordingToSchoolId(schoolId)
      .subscribe((data: any = []) => {
        this.doctorData = data?.data;
      });
  }
  classChange(val: any) {
    this.healthCheckupSearchForm.patchValue({
      streamId: "",
    });
    this.healthCheckupSearchForm.patchValue({
      groupId: "",
    });
    this.healthCheckupSearchForm.patchValue({
      sectionId: "",
    });
    this.classId = val;
    if (this.classId !== "") {
      this.getSection(this.classId, this.schoolId, this.academicYear);
      if (this.classId == 11 || this.classId == 12) {
        this.getStream();
      }
    } else {
      this.healthCheckupSearchForm.patchValue({
        classId: "",
      });
      this.healthCheckupSearchForm.patchValue({
        sectionId: "",
      });
      this.healthCheckupSearchForm.patchValue({
        streamId: "",
      });
    }
  }
  streamChange(val: any) {
    this.healthCheckupSearchForm.patchValue({
      groupId: "",
    });
    this.streamId = val;
    if (this.streamId == 3) {
      this.getGroup();
    } else {
      this.groupId = "";
    }
  }
  viewHealthCheckup(...params: any){
    //  this.spinner.show(); // ==== show spinner
      const {
        previousSize,
        offset,
        pageSize,
        searchAcademicYear,
        searchDistrictId,
        searchBlockId,
        searchClusterId,
        searchSchoolId,
        schoolId,
        classId,
        sectionId,
        streamId,
        groupId,
        checkupDate,
        doctorId,
        studentCode
        // doctorId,
      } = params[0];
  
       this.paramObj = {
        offset: offset,
        limit: pageSize,
        searchAcademicYear:searchAcademicYear,
        searchDistrictId:searchDistrictId,
        searchBlockId:searchBlockId,
        searchClusterId:searchClusterId,
        searchSchoolId:searchSchoolId,
        classId:classId,
        sectionId:sectionId,
        streamId:streamId,
        groupId:groupId,
        checkupDate:checkupDate,
        doctorId:doctorId,
        schoolId: schoolId,
        serviceType:this.serviceType,
        userId:this.userId,
        studentCode:this.studentCode,
      };
      this.isLoading = true;
      this.healthCheckUpService.viewHealthCheckup(this.paramObj).subscribe({
        next: (res: any) => {
          this.resultListData.length = previousSize; // set current size
          this.resultListData.push(...res?.data); // merge with existing data
          this.resultListData.length = res?.totalRecord; // update length
          this.dataSource.paginator = this.paginator; // update paginator
          this.dataSource._updateChangeSubscription(); // update table
          this.isLoading = false;
          this.isNorecordFound = this.resultListData.length ? false : true;
          setTimeout(() => {
            this.spinner.hide();
          },100);
        },
        error: (error: any) => {
          this.isLoading = false;
          this.spinner.hide();
        },
      });
  }
  printPage() {
    let cloneTable = document.getElementById("viewTable")?.innerHTML;
    const pageTitle = document.querySelector(".pageName")?.innerHTML;
    this.commonService.printPage(cloneTable, pageTitle);
  }
  downLoadHealthCheckUpList() {
    this.spinner.show();
    this.paramObj.serviceType = "Download";
    this.healthCheckUpService.viewHealthCheckup(this.paramObj).subscribe({
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
  toggle() {
    this.show = !this.show;
    if(this.show)  
      this.buttonName = "Hide";
    else
      this.buttonName = "Show";
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
        this.searchForm.controls['searchDistrictId']?.patchValue(this.userProfile.district);
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
    this.searchForm.controls['searchBlockId']?.patchValue('');
  
    this.clusterData = [];
    this.searchForm.controls['searchClusterId']?.patchValue('');
  
    this.getSchoolData = [];    
    this.searchForm.controls['searchSchoolId']?.patchValue('');
  
    if(districtId !== ''){  
      this.commonService.getBlockByDistrictid(districtId).subscribe((res: any) => {      
        this.searchBlockData = res;
        this.searchBlockData = this.searchBlockData.data; 
  
        if(this.userProfile.block != 0 || this.userProfile.block != ""){
          this.searchBlockData = this.searchBlockData.filter((blo: any) => {
            return blo.blockId == this.userProfile.block;
          });
          this.searchForm.controls['searchBlockId']?.patchValue(this.userProfile.block);
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
    this.searchForm.controls['searchClusterId']?.patchValue('');
  
    this.getSchoolData = [];    
    this.searchForm.controls['searchSchoolId']?.patchValue('');   
  
    if(blockId !== ''){  
      this.commonService.getClusterByBlockId(blockId).subscribe((res: any) => {      
        this.clusterData = res;
        this.clusterData = this.clusterData.data;
        
        if(this.userProfile.cluster != 0 || this.userProfile.cluster != ""){
          this.clusterData = this.clusterData.filter((clu: any) => {
            return clu.clusterId == this.userProfile.cluster;
          });
          this.searchForm.controls['searchClusterId']?.patchValue(this.userProfile.cluster);
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
    this.searchForm.controls['searchSchoolId']?.patchValue('');
  
    if(clusterId !== ''){  
      this.commonService.getSchoolList(clusterId).subscribe((res:any) => {      
        this.getSchoolData = res;
        this.getSchoolData = this.getSchoolData.data;
  
        if(this.userProfile.udiseCode != 0 || this.userProfile.udiseCode != ""){
          this.getSchoolData = this.getSchoolData.filter((sch: any) => {
            return sch.schoolUdiseCode == this.userProfile.udiseCode;
          });
          this.searchForm.controls['searchSchoolId']?.patchValue(this.getSchoolData[0].schoolId);
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
  showDoctorAdvice(descText: string){
    this.descFullText = descText;
  }
}


