import { Component, OnInit, ElementRef, ViewChild, Input } from "@angular/core";
import { Constant } from "src/app/shared/constants/constant";
import { CommonserviceService } from "src/app/core/services/commonservice.service";
import { AlertHelper } from "src/app/core/helpers/alert-helper";
import { NgxSpinnerService } from "ngx-spinner";
import { FormBuilder, FormGroup,NgForm } from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";
import { ManageEventCategoryService } from "../../master/services/manage-event-category.service";
import { ManageEventMasterService } from "../../master/services/manage-event-master.service";
import { StudentAchievementService } from "../services/student-achievement.service";
import { SchoolService } from "../../school/services/school.service";
import { ProgressBarMode } from "@angular/material/progress-bar";
import { MatSort } from "@angular/material/sort";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableExporterDirective } from "mat-table-exporter";
import { MatTableDataSource } from "@angular/material/table";
import { environment } from "src/environments/environment";
import { PrivilegeHelper } from "src/app/core/helpers/privilege-helper";

@Component({
  selector: "app-view-student-achievement",
  templateUrl: "./view-student-achievement.component.html",
  styleUrls: ["./view-student-achievement.component.css"],
})
export class ViewStudentAchievementComponent implements OnInit {
  paramObj: any;
  serviceType: string = "Search";
  public show:boolean = true;
  public buttonName:any = 'Show';
  @ViewChild("searchForm") searchForm!: NgForm;
  public userProfile = JSON.parse(sessionStorage.getItem("userProfile") || '{}');
  public fileUrl = environment.filePath;
  config = new Constant();
  descFullText: any = "";
  clusterName: any = "";
  schoolName: any = "";
  blockName: any = "";
  districtName: any = "";
  villageName: any = "";
  schoolId: any = "";
  userId: any = "";
  profileId: any = "";
  schoolUdiseCode: any = "";
  schoolInfoData: any;
  academicYear: any = this.config.getAcademicCurrentYear();
  studentAchievementSearchform!: FormGroup;
  classId: any="";
  eventTypeId: any="";
  eventCategoryId: any="";
  classData: any;
  eventTypeData: any;
  eventCategoryData: any;
  studentAchievementData: any;
  achivementImage: any;
  imageUrlAchievement: any = "";
  isimageUrlAchievement: boolean = false;
  imageViewUrl: any = "";
  isEmpty: boolean = false;
  isResData: boolean = false;
  isInitAdmin: boolean = false;
  isPrint: boolean = false;

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
  allStudentName: any = "";
  studebtListModal: any = "";
  plPrivilege:string="view"; //For menu privilege
  adminPrivilege: boolean = false;
  eventCategoryLoading:boolean=false;
  constructor(
    private formBuilder: FormBuilder,
    private alertHelper: AlertHelper,
    private spinner: NgxSpinnerService,
    private privilegeHelper: PrivilegeHelper,   //For menu privilege
    private route: Router,
    private router: ActivatedRoute,
    private commonService: CommonserviceService,
    private manageEventCategoryService: ManageEventCategoryService, //eventtype
    private manageEventMasterService: ManageEventMasterService, //eventcategory
    private studentAchievementService: StudentAchievementService, //eventname
    private el: ElementRef,
    private schoolService: SchoolService
  ) {
    const pageUrl:any = this.route.url;  
    this.plPrivilege = this.privilegeHelper.PrimaryLinkPrivilege(pageUrl);  //For menu privilege    
    this.commonService.verifyLinkPermission(pageUrl, this.config.linkType[2], this.config.privilege[1]);  // For authorization
  }

  ngOnInit(): void {
    this.spinner.show();
    if(this.plPrivilege=='admin'){
      this.adminPrivilege = true;
      this.displayedColumns = [
        "slNo",
        "dateOfAward",
        "eventType",
        "eventCategory",
        "eventName",
        "levelOfEvent",
        "prize",
        "class",
        "description",
        "name",
        "image",
        "action",
      ]; 
    } else {
      this.displayedColumns = [
        "slNo",
        "dateOfAward",
        "eventType",
        "eventCategory",
        "eventName",
        "levelOfEvent",
        "prize",
        "class",
        "description",
        "name",
        "image",
      ]; 
    }
    this.searchAcademicYear=this.academicYear;
    this.getDistrict();
    const userProfile = this.commonService.getUserProfile();
    this.schoolId = userProfile?.school;
    this.userId = userProfile?.userId;
    this.getEventType();
    //this.getEventCategory();
 
    this.studentAchievementSearchform = this.formBuilder.group({
      classId: [""],
      eventTypeId: [""],
      eventCategoryId: [""],
    });

    if(userProfile.loginUserTypeId ==2){
      this.getSchoolClasses(this.schoolId);
      this.getSchoolInfo(this.schoolId, this.academicYear);
      this.viewStudentAchievement(this.getSearchParams());
    }else{
      this.isInitAdmin = true;
      this.spinner.hide();
    }
    
  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
 
  }

  getSearchParams() {
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
      eventTypeId: this.eventTypeId,
      eventCategoryId: this.eventCategoryId,
      classId: this.classId,

    };
  }
  onPageChange(event: any) {
    this.spinner.show();
    this.isLoading = true;
    this.pageSize = event.pageSize; // current page size ex: 10
    this.offset = event.pageIndex * event.pageSize;
    this.previousSize = this.pageSize * event.pageIndex; // set previous size
    this.pageIndex = event.pageIndex;
    this.viewStudentAchievement(this.getSearchParams());
  }

  onsearch() {
    this.pageIndex = 0;
    this.previousSize = 0;
    this.offset = 0;
    this.resultListData.splice(0, this.resultListData.length); // empty current data
    this.dataSource.paginator = this.paginator; // update paginator
    if (this.validateForm() === true) {
      this.spinner.show();
      this.viewStudentAchievement(this.getSearchParams());
      this.isInitAdmin = false;
    }
   
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
    return true;
    
  }
 
  getSchoolInfo(schoolId: any, academicYear: any) {
    //console.log( this.schoolId);
    this.spinner.show();
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
        // console.log(this.schoolInfoData);

        this.spinner.hide();
      });
  }
  getEventType() {
    this.manageEventCategoryService
      .getEventType()
      .subscribe((data: any = []) => {
        this.eventTypeData = data?.data;
        // console.log(data);
      });
  }
  getEventCategoryAccordingToEventType(eventType: any){
    this.eventCategoryId= "",
    this.eventCategoryData =[];
    this.eventCategoryLoading =true;
    const eventTypeId = eventType;
    if(eventTypeId!=''){
      this.studentAchievementService
    .getEventCategoryAccordingToEventType(eventTypeId)
    .subscribe((data: any = []) => {
      this.eventCategoryData = data?.data
      this.eventCategoryLoading =false;
    });
    }else{
      this.eventCategoryLoading =false;
      this.eventCategoryData =[];
    }
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
    this.classChanged = true;
    if (schoolId !== "") {
      this.schoolService
        .getSchoolWiseClasses(schoolId)
        .subscribe((res: any = []) => {
          this.classData = res.data;
         // console.log( this.classData);
          this.classChanged = false;
        });
    }
  }
  viewStudentAchievement(...params: any) {
    this.spinner.show(); // ==== show spinner
   
    const {
      previousSize,
      offset,
      pageSize,
      searchAcademicYear,
      searchDistrictId,
      searchBlockId,
      searchClusterId,
      searchSchoolId,
      eventTypeId,
      eventCategoryId,
      classId,
      schoolId,
    } = params[0];

    this.paramObj = {
      offset: offset,
      limit: pageSize,
      searchAcademicYear: searchAcademicYear,
      searchDistrictId:searchDistrictId,
      searchBlockId:searchBlockId,
      searchClusterId:searchClusterId,
      searchSchoolId:searchSchoolId,
      eventTypeId: eventTypeId,
      eventCategoryId: eventCategoryId,
      classId: classId,
      schoolId: schoolId,
      serviceType:this.serviceType,
      userId:this.userId
    };
    this.isLoading = true;
    this.studentAchievementService.viewStudentAchievement(this.paramObj).subscribe({
      next: (res: any) => {
        this.resultListData.length = previousSize; // set current size
        this.resultListData.push(...res?.data); // merge with existing data
        this.resultListData.length = res?.totalRecord; // update length
        this.dataSource.paginator = this.paginator; // update paginator
        this.dataSource._updateChangeSubscription(); // update table
        this.isLoading = false;
        this.resultListData?.map((item: any) => {
          if (item?.achivementImage !== "" && item?.achivementImage !== null) {
            this.isimageUrlAchievement = true;
            var str = item?.achivementImage;
            item.achivementImage = item?.achivementImage.replace(".", "~");
          }
        });
        this.isNorecordFound = this.resultListData.length ? false : true;
        this.spinner.hide();
      },
      error: (error: any) => {
        this.isLoading = false;
        this.spinner.hide();
      },
    });
  }
  printPage() {
    this.isPrint=true;
    let cloneTable = document.getElementById("viewTable")?.innerHTML;
    const pageTitle = document.querySelector(".pageName")?.innerHTML;
    this.commonService.printPage(cloneTable, pageTitle);
    this.isPrint=false;
  }
  downLoadDoctorDeatilsList() {
    this.spinner.show();
    this.paramObj.serviceType = "Download";
    this.studentAchievementService.viewStudentAchievement(this.paramObj).subscribe({
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
        //console.log( this.getSchoolData);
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
  deleteStudentAchievement(id: any) {
    const users = this.commonService.getUserProfile();
    this.userId = users?.userId;
    this.profileId = users?.profileId;
    this.alertHelper.deleteAlert(
      "Are you sure to delete?",
      "",
      "question",
      "Yes, delete it!"
    ).then((result) => {
      this.spinner.show();
      if (result.value) {
        
        this.isLoading = true;
        this.studentAchievementService
          .deleteStudentAchievement(id, this.userId,this.profileId)
          .subscribe({
            next: (res: any) => {
              if (res?.success === true) {
                this.alertHelper.successAlert(
                  "Deleted!",
                  "Deleted Successfully",
                  "success"
                );
                this.viewStudentAchievement(this.getSearchParams());
              } else {
                this.alertHelper.viewAlert("info", res?.msg, "");
              }
              this.isLoading = false;
             
            },
            error: (error: any) => {
              this.isLoading = false;
            },
          });
      }
      this.spinner.hide();
    })
  }
  showImage(imgUrl: string){
    this.imageViewUrl = imgUrl;
  }
  showStudentList(studentName: any) {
    this.allStudentName = studentName;
    this.studebtListModal = this.allStudentName.split(",");
  }
  toggle() {
    this.show = !this.show;
    if (this.show) this.buttonName = "Hide";
    else this.buttonName = "Show";
  }
  showDescription(descText: string){
    this.descFullText = descText;
  }
}
