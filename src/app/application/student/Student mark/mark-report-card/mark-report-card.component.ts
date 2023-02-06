import { Component, Input, OnInit, ViewChild } from "@angular/core";
import { NgForm } from "@angular/forms";
import { MatPaginator } from "@angular/material/paginator";
import { ProgressBarMode } from "@angular/material/progress-bar";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { Router } from "@angular/router";
import { MatTableExporterDirective } from "mat-table-exporter";
import { NgxSpinnerService } from "ngx-spinner";
import { SchoolService } from "src/app/application/school/services/school.service";
import { AlertHelper } from "src/app/core/helpers/alert-helper";
import { PrivilegeHelper } from "src/app/core/helpers/privilege-helper";
import { CommonserviceService } from "src/app/core/services/commonservice.service";
import { Constant } from "src/app/shared/constants/constant";
import { environment } from "src/environments/environment";
import { StudentMarkService } from "../../services/student-mark.service";
@Component({
  selector: "app-mark-report-card",
  templateUrl: "./mark-report-card.component.html",
  styleUrls: ["./mark-report-card.component.css"],
})
export class MarkReportCardComponent implements OnInit {
  noFilter: boolean = true;
  public show: boolean = true;
  public buttonName: any = "Show";
  optionVal: any;
  optionstream: any;
  public fileUrl = environment.filePath;
  @ViewChild("searchForm") searchForm!: NgForm;
  public userProfile = JSON.parse(sessionStorage.getItem("userProfile") || '{}');
  config = new Constant();
  academicYear: any = this.config.getAcademicCurrentYear();
  searchAcademicYear:any = "";
  searchDistrictId:any = "";
  searchBlockId:any = "";
  searchClusterId:any = "";
  searchSchoolId:any = "";

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
  clusterData: any = [];
  getSchoolData: any = [];
 
  isInitAdmin: boolean = false;
  userId: any = "";
  schoolId: any = "";
  
  classAnnextureData: any = [];
  classData: any = [];
  streamData: any = [];
  groupData: any = [];
  classId: any = "";
  streamId: any = "";
  groupId: any = "";
  classLoad: boolean = false;
  streamLoad: boolean = false;
  groupLoad: boolean = false;
  
  examType: any = "";
  studentCode: any = "";
  studentName: any = "";
  sectionId: any = "";
  sectionData: any = [];
  sectionLoad: boolean = false;

  paramObj: any; 
  serviceType: string = "Search";
  // below variable are for modal
  schoolName: any = "";
  acaYear: any = "";
  stdName: any = "";
  examTypeName: any = "";
  className: any = "";
  stdMarkId: any = "";
  grade: any = "";
  percentage: any = "";
  secMark: any = "";
  totMark: any = "";
  sectionName: any = "";
  indivisualReportData: any = []; 
  examTypeData: any = [];
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
  displayedColumns: string[] = [
    "slNo",
    "Student_code",
    "Name",
    "Class",
    "Total_Mark",
    "Secured_Mark",
    "Percentage",
    "action",
  ]; // end define mat table columns
  resultListData: any = [];
  dataSource = new MatTableDataSource(this.resultListData);
  //end Material Table Variable and Decorators
  plPrivilege:string="view"; //For menu privilege
  adminPrivilege: boolean = false;
  constructor(
    private commonService: CommonserviceService,
    private privilegeHelper: PrivilegeHelper,   //For menu privilege
    private router:Router,
    private spinner: NgxSpinnerService,
    private schoolService: SchoolService,
    private alertHelper: AlertHelper,
    private studentMarkService: StudentMarkService,
  ) {
    const pageUrl:any = this.router.url;  
    this.plPrivilege = this.privilegeHelper.PrimaryLinkPrivilege(pageUrl);  //For menu privilege    
    this.commonService.verifyLinkPermission(pageUrl, this.config.linkType[2], this.config.privilege[1]);  // For authorization
  }

  ngOnInit(): void {
    if(this.plPrivilege=='admin'){
      this.adminPrivilege = true;
    }
    this.getExamTypeData();
    this.getDistrict(); 
    this.searchAcademicYear=this.academicYear;
    const userProfile = this.commonService.getUserProfile();
    this.userId = userProfile?.userId;
    this.schoolId = userProfile?.school;
    if(userProfile.loginUserTypeId == 2){
      this.getSchoolClasses(this.schoolId);
      this.spinner.hide();
    }else{
     
      this.isInitAdmin = true;
      this.spinner.hide();
    }
  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  getSchoolClasses(schoolEncId: string) {
    if (schoolEncId !== "") {
      this.schoolService
        .getSchoolClasses(schoolEncId)
        .subscribe((res: any = []) => {
          this.classAnnextureData = res.data;
        });
    }
  }
  getSchoolWiseClasses(schoolId: any) {
    this.classAnnextureData = [];
    this.classId = "";
    if (schoolId !== "") {
      this.schoolService
        .getSchoolWiseClasses(schoolId)
        .subscribe((res: any = []) => {
          this.classAnnextureData = res.data;
        });
    }
  }
  classChange(val: any) {
    this.classId = val;
    this.streamId = "";
    this.sectionId = "";
    if (this.classId !== "") {
      this.getSection(this.classId, this.schoolId, this.academicYear);
      if (this.classId == 11 || this.classId == 12) {
         this.getStream();
      }
    } else {

    }
  }
  examTypeChange(val: any) {
    this.classId = "";
    this.streamId = "";
    this.groupId = "";
    this.sectionId = "";
    this.classData = [];
    this.streamData = [];
    this.groupData = [];
    this.sectionData = [];
    this.examType = val;
    if (this.examType !== "") {
      this.getClassName(this.examType);
    }
  }
  getClassName(examinationTypeId: any) {
    this.streamData = [];
    this.groupData = [];
    this.sectionData = [];
    this.classLoad = true;
    this.commonService
      .getClassByTermId(examinationTypeId)
      .subscribe((data: any = []) => {
        this.classData = data?.data[0]?.classId;
        const classArr = this.classAnnextureData.filter((item: any) =>
          this.classData.includes(item?.classId)
        );
        this.classData = classArr;
       
      });
      this.classLoad = false;
  }
  getSection(classId: any, schoolId: any, academicYear: any) {
    this.sectionLoad = true;
    this.commonService
      .getSection(classId, schoolId, academicYear)
      .subscribe((data: any = []) => {
        this.sectionData = data;
        this.sectionData = this.sectionData.data["sections"];
       
      });
      this.sectionLoad = false;
  }
  getStream() {
    this.streamLoad = true;
    this.commonService
      .getCommonAnnexture(["STREAM_TYPE"])
      .subscribe((data: any = []) => {
        this.streamData = data?.data?.STREAM_TYPE;
     
      });
      this.streamLoad = false;
  }
  streamChange(val: any) {
    this.groupId = ""
    this.streamId = val;
    if (this.streamId == 3) {
      this.getGroup();
    } else {
      this.groupId = "";
    }
  }
  getGroup() {
    this.groupLoad = true;
    this.commonService
      .getCommonAnnexture(["STREAM_GROUP_TYPE"])
      .subscribe((data: any = []) => {
        this.groupData = data?.data?.STREAM_GROUP_TYPE;
       
      });
      this.groupLoad = false;
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
    this.viewStudentMarkList(this.getSearchParams());
  }
  onsearch(){
    this.pageIndex = 0;
    this.previousSize = 0;
    this.offset = 0;
    this.resultListData.splice(0, this.resultListData.length); // empty current data
    this.dataSource.paginator = this.paginator; // update paginator
    if (this.validateForm() === true) {
      this.noFilter=false;
      this.spinner.show();
      this.viewStudentMarkList(this.getSearchParams());
      this.isInitAdmin = false;
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
      searchSchoolId: this.searchSchoolId, 
      classId: this.classId, 
      streamId: this.streamId,  
      groupId: this.groupId,  
      examType: this.examType,  
      studentCode: this.studentCode,  
      studentName: this.studentName,  
      sectionId: this.sectionId,  
    };
  }
  viewStudentMarkList(...params: any) {
    
    this.spinner.show();
    const {
      previousSize,
      offset,
      pageSize,
      searchDistrictId,
      searchBlockId,
      searchClusterId,
      searchSchoolId,
      searchAcademicYear,
      classId,
      streamId,
      groupId,
      examType,
      studentCode,
      studentName,
      sectionId,
    } = params[0];
    this.paramObj = {
      offset: offset,
      limit: pageSize,
      searchDistrictId:searchDistrictId,
      searchBlockId:searchBlockId,
      searchClusterId:searchClusterId,
      searchSchoolId:searchSchoolId,
      searchAcademicYear:searchAcademicYear,
      classId: classId,
      streamId: streamId,
      groupId: groupId,
      examType: examType,
      studentCode: studentCode,
      studentName: studentName,
      sectionId: sectionId,
      userId: this.userId,
      serviceType: this.serviceType, 
    };
    this.isLoading = true;
    this.studentMarkService.viewStudentMarkListReport(this.paramObj).subscribe({
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
  validateForm() :Boolean{
    if (this.searchDistrictId === "") {
      this.alertHelper.successAlert(
        "Invalid",
        "District is required",
        "error"
      );
      return false;
    }
    if (this.searchBlockId === "") {
      this.alertHelper.successAlert(
        "Invalid",
        "Block is required",
        "error"
      );
      return false;
    }
    if (this.searchClusterId === "") {
      this.alertHelper.successAlert(
        "Invalid",
        "Cluster is required",
        "error"
      );
      return false;
    }
    if (this.searchSchoolId === "") {
      this.alertHelper.successAlert(
        "Invalid",
        "School is required",
        "error"
      );
      return false;
    }
    if (this.examType === "") {
      this.alertHelper.successAlert(
        "Invalid",
        "Exam type is required",
        "error"
      );
      return false;
    }
    if ((this.examType!="") && this.classId === "") {
      this.alertHelper.successAlert(
        "Invalid",
        "Class is required",
        "error"
      );
      return false;
    }
    if ((this.classId == 11 || this.classId == 12) && this.streamId === "") {
      this.alertHelper.successAlert(
        "Invalid",
        "Stream is required",
        "error"
      );
      return false;
    }
    if (this.streamId == 3 && this.groupId == 3) {
      this.alertHelper.successAlert(
        "Invalid",
        "Group is required",
        "error"
      );
      return false;
    }
    return true;
    
  }
  printPage() {
    let cloneTable 	= document.getElementById("viewTable")?.innerHTML;
    const pageTitle = document.querySelector(".pageName")?.innerHTML;
    this.commonService.printPage(cloneTable, pageTitle);
  }
  printModalReportCard() {
    let cloneTable 	= document.getElementById("viewModal")?.innerHTML;
    const pageTitle = document.querySelector(".modal-title")?.innerHTML;
    this.commonService.printPage(cloneTable, pageTitle);
  }
  downLoadStudentMarkReportList()
  {
    this.spinner.show();   
    this.paramObj.serviceType = "Download";
    this.studentMarkService.viewStudentMarkListReport(this.paramObj).subscribe({
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
  toggle() {
    this.show = !this.show;
    if (this.show) this.buttonName = "Hide";
    else this.buttonName = "Show";
  }
  viewReportCard(schoolName:any,academicYear:any,studentName:any,examType:any,className:any,stdMarkId:any,grade:any,percentage:any,secMark:any,totMark:any,sectionName:any){
    this.schoolName=schoolName;
    this.acaYear=academicYear;
    this.stdName=studentName;
    this.examTypeName=examType;
    this.className=className;
    this.stdMarkId=stdMarkId;
    this.grade=grade;
    this.percentage=percentage;
    this.secMark=secMark;
    this.totMark=totMark;
    this.sectionName=sectionName;
    this.studentMarkService
      .viewReportCard(this.stdMarkId)
      .subscribe((res: any) => {
        this.indivisualReportData = res;
        this.indivisualReportData = this.indivisualReportData.data;
        this.spinner.hide();
    
      });
  }
  getExamTypeData() {
    this.commonService
      .getCommonAnnexture(["EXAM_TERM_TYPE"])
      .subscribe((data: any = []) => {
        this.examTypeData = data?.data?.EXAM_TERM_TYPE
      });
  }
}

