import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup ,NgForm} from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { ProgressBarMode } from '@angular/material/progress-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { MatTableExporterDirective } from 'mat-table-exporter';
import { NgxSpinnerService } from 'ngx-spinner';
import { AlertHelper } from 'src/app/core/helpers/alert-helper';
import { PrivilegeHelper } from 'src/app/core/helpers/privilege-helper';
import { CommonserviceService } from 'src/app/core/services/commonservice.service';
import { Constant } from 'src/app/shared/constants/constant';
import { environment } from 'src/environments/environment';
import { SchoolService } from '../../school/services/school.service';
import { DocterDetailsService } from '../services/doctor-details.service';

@Component({
  selector: 'app-view-doctor-details',
  templateUrl: './view-doctor-details.component.html',
  styleUrls: ['./view-doctor-details.component.css']
})
export class ViewDoctorDetailsComponent implements OnInit {
  paramObj: any;
  serviceType: string = "Search";
  public fileUrl = environment.filePath;
  public show:boolean = true;
  public buttonName:any = 'Show';
  @ViewChild("searchForm") searchForm!: NgForm;
  public userProfile = JSON.parse(sessionStorage.getItem("userProfile") || '{}');
  descFullText: any = "";
  clusterName: any = "";
  schoolName: any = "";
  blockName: any = "";
  districtName: any = "";
  villageName: any = "";
  schoolUdiseCode: any = "";
  schoolId:any="";
  userId:any="";
  profileId:any="";
  schoolInfoData: any;
  doctorDetailsData: any;
  config = new Constant();
  academicYear: any = this.config.getAcademicCurrentYear();
  isEmpty: boolean = false;
  isResData: boolean = false;
  doctorDetailsSearchform!: FormGroup;
  doctorName:any="";
  maskMobilePan: boolean = false;
  isInitAdmin: boolean = false;
  adminPrivilege: boolean = false;
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
  plPrivilege:string="view"; //For menu privilege
  tabs: any = [];  //For shwoing tabs
  constructor(
    private schoolService: SchoolService,
    private privilegeHelper: PrivilegeHelper,   //For menu privilege
    private router:Router,
    private docterDetailsService : DocterDetailsService,
    private commonService: CommonserviceService,
    private spinner: NgxSpinnerService,
    private formBuilder: FormBuilder,
    private alertHelper: AlertHelper,
  ) {
    const pageUrl:any = this.router.url;  
    this.plPrivilege = this.privilegeHelper.PrimaryLinkPrivilege(pageUrl);  //For menu privilege    
    this.commonService.verifyLinkPermission(pageUrl, this.config.linkType[2], this.config.privilege[1]);  // For authorization
    this.tabs = this.privilegeHelper.PrimaryLinkTabNames(pageUrl);  //For shwoing tabs 
   }
  ngOnInit(): void {
    if(this.plPrivilege=='admin'){
      this.adminPrivilege = true;
      this.displayedColumns = [
        "slNo",
        "doctorName",
        "contactNumber",
        "purposeOfVisit",
        "visitDetails",
        "action",
      ]; 
    } else {
      this.displayedColumns = [
        "slNo",
        "doctorName",
        "contactNumber",
        "purposeOfVisit",
        "visitDetails",
      ]; 
    }
    this.getDistrict();
    this.searchAcademicYear=this.academicYear;
    const userProfile = this.commonService.getUserProfile();
    this.schoolId = userProfile?.school;
    this.userId = userProfile?.userId;
    this.initializeForm();
    if(userProfile.loginUserTypeId ==2){
      this.getSchoolInfo(this.schoolId, this.academicYear);
      this.viewDoctorDetails(this.getSearchParams());
    }else{
      this.isInitAdmin = true;
      this.spinner.hide();
    }
  }
  initializeForm(){
    this.doctorDetailsSearchform = this.formBuilder.group({
      doctorName: [""],
    });
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
      //doctorName: this.doctorDetailsSearchform?.get("doctorName")?.value,
      schoolId: this.schoolId,
      doctorName:this.doctorName,
      searchAcademicYear: this.searchAcademicYear,
      searchDistrictId: this.searchDistrictId,
      searchBlockId: this.searchBlockId,
      searchClusterId: this.searchClusterId,
      searchSchoolId: this.searchSchoolId,
    };
  }
  onPageChange(event: any) {
    this.spinner.show();
    this.isLoading = true;
    this.pageSize = event.pageSize; // current page size ex: 10
    this.offset = event.pageIndex * event.pageSize;
    this.previousSize = this.pageSize * event.pageIndex; // set previous size
    this.pageIndex = event.pageIndex;
    this.viewDoctorDetails(this.getSearchParams());
  }
  onsearch() {
    this.pageIndex = 0;
    this.previousSize = 0;
    this.offset = 0;
    this.resultListData.splice(0, this.resultListData.length); // empty current data
    this.dataSource.paginator = this.paginator; // update paginator
    if (this.validateForm() === true) {
      this.spinner.show();
      this.viewDoctorDetails(this.getSearchParams());
      this.isInitAdmin = false;
    }
  }
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
  getSchoolInfo(schoolId: any, academicYear: any) {
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
        this.spinner.hide();
      });
  } 
  viewDoctorDetails(...params: any){
   
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
        doctorName,
        schoolId,
      } = params[0];
      this.paramObj = {
        offset: offset,
        limit: pageSize,
        searchAcademicYear:searchAcademicYear,
        searchDistrictId:searchDistrictId,
        searchBlockId:searchBlockId,
        searchClusterId:searchClusterId,
        searchSchoolId:searchSchoolId,
        doctorName: doctorName,
        schoolId: schoolId,
        serviceType:this.serviceType,
        userId:this.userId
      };
      this.isLoading = true;
      this.docterDetailsService.viewDoctorDetails(this.paramObj).subscribe({
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
  printPage() {
    let cloneTable = document.getElementById("viewTable")?.innerHTML;
    const pageTitle = document.querySelector(".pageName")?.innerHTML;
    this.commonService.printPage(cloneTable, pageTitle);
  }
  downLoadDoctorDeatilsList() {
    this.spinner.show();
    this.paramObj.serviceType = "Download";
    this.docterDetailsService.viewDoctorDetails(this.paramObj).subscribe({
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
  showDescription(descText: string){
    this.descFullText = descText;
  }
  deleteDoctorDetails(id: any) {  
    const users = this.commonService.getUserProfile();
    this.userId = users?.userId;
    this.profileId = users?.profileId;
    this.alertHelper.deleteAlert(
      "Are you sure to delete?",
      "",
      "question",
      "Yes, delete it!"
    ).then((result) => {
      if (result.value){
        this.isLoading = true;
        this.spinner.show();
        this.docterDetailsService
          .deleteDoctorDetails(id, this.userId,this.profileId)
          .subscribe({
            next: (res: any) => {
              if (res?.success === true) {
                this.alertHelper.successAlert(
                  "Deleted!",
                  "Deleted Successfully",
                  "success"
                );
                this.viewDoctorDetails(this.getSearchParams());
              } else {
                this.alertHelper.viewAlert("info", res?.msg, "");
              }
              this.isLoading = false;
            },
            error: (error: any) => {
              this.isLoading = false;
            },
          });
          this.spinner.hide();
      }
    })
    
  }
  toggle() {
    this.show = !this.show;
    if(this.show)  
      this.buttonName = "Hide";
    else
      this.buttonName = "Show";
  }
}
