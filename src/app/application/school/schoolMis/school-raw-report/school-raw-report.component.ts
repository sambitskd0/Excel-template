import { Component, OnInit, ViewChild, Input, ViewEncapsulation } from "@angular/core";
import { FormGroup, FormBuilder, NgForm } from "@angular/forms";
import { CommonserviceService } from "src/app/core/services/commonservice.service";
import { NgxSpinnerService } from "ngx-spinner";
import { AlertHelper } from "src/app/core/helpers/alert-helper";
import { environment } from "src/environments/environment";
import { SchoolMisService } from "../../services/school-mis.service";
import { SchoolService } from "../../services/school.service";
import { ProgressBarMode } from "@angular/material/progress-bar";
import { MatSort } from "@angular/material/sort";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableExporterDirective } from "mat-table-exporter";
import { MatTableDataSource } from "@angular/material/table";
import { Constant } from 'src/app/shared/constants/constant';

@Component({
  selector: 'app-school-raw-report',
  templateUrl: './school-raw-report.component.html',
  styleUrls: ['./school-raw-report.component.css']
})
export class SchoolRawReportComponent implements OnInit {


  public fileUrl1 = environment.filePath;
  userProfile = this.commonService.getUserProfile();
  @ViewChild("searchForm") searchForm!: NgForm;
  @Input() mode!: ProgressBarMode;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatTableExporterDirective, { static: true })
  exporter!: MatTableExporterDirective;
  sps: any = /[^a-zA-Z0-9]/g
  scDisrtictSelect: boolean = false;
  scDisrtictLoading: boolean = false;
  scBlockSelect: boolean = false;
  scBlockLoading: boolean = false;
  scClusterSelect: boolean = false;
  scClusterLoading: boolean = false
  scSchoolSelect: boolean = false;
  schoolCategorySelect: boolean = false;
  schoolCategoryLoading: boolean = false;
  mandatory: boolean = true;
  config = new Constant();
  academicYear: any = this.config.getAcademicCurrentYear();

  schoolManagementChanged: boolean = false;
  scSchoolLoading: boolean = false;
  isLoading: boolean = false;
  isNorecordFound: boolean = false;
  isInitAdmin: boolean = false;
  operationalStatusSelect: boolean = false;
  districtData: any = [];
  blockData: any = [];
  clusterData: any = [];
  schoolData: any = [];

  genderData: any = [];
  schoolManagement: any = [];
  schoolCatData: any = [];
  sumData: any = [];
  getBackData: any = [];
  paramBack: any = [];
  scDistrictId: any = "";
  udiseCode: any = "";
  scBlockId: any = "";
  selManagement: any = "";
  scClusterId: any = "";
  scSchoolId: any = "";
  schoolCategory: any = "";
  searchNatureOfAppointmt: any = "";
  appointmtType: any = "";
  resultListDataLength: any = 0;
  schoolCatDataLegth: any = 0;
  colSpanTotal: any = 0;
  pageLevel: any = 0;
  paramVal: any
  sessionPageLvl: any
  loadDataParam: any
  paramDrillDown: any
  sumTotalTeacher: any
  searchAcademicYear: any = "";
  operationalStatus: any = "";

  pageSize = 10;
  offset = 0;
  currentPage = 0;
  totalRows = 0;
  previousSize: any = 0;
  pageIndex: any = 0;
  displayedColumns: string[] = [
    "slNo",
    "AcademicYear",
    "SchoolName",
    "SchoolUdiseCode",
    "SchoolUschcdCode",
    "Latitude",
    "Longitude",
    "Pincode",
    "City",
    "LocationType",
    "HeadOfSchool",
    "AdmistrationType",
    "SchoolType",
    "DistrictName",
    "BlockName",
    "EducationBlockName",
    "ClusterName",
    "PanchayatName",
    "VillageName",
    "ManagementName",
    "SchoolCategoryName",
    "SchoolTypeName",
    "RespodentTypeName",
    "InchargeTypeName",
    "ParliamentaryName",
    "AssemblyName",
    "MediumofInstructionNames",
    "LanguageNames"
  ]; // define mat table columns

  resultListData: any = [];
  dataSource = new MatTableDataSource(this.resultListData);
  constructor(
    private commonService: CommonserviceService,
    private spinner: NgxSpinnerService,
    private alertHelper: AlertHelper,
    private schoolMisService: SchoolMisService,
    private schoolService: SchoolService
  ) { }

  ngOnInit(): void {
    this.searchAcademicYear = this.academicYear;
    if(this.userProfile.udiseCode != "" || this.userProfile.udiseCode != 0 ){
      this.udiseCode =  this.userProfile.udiseCode;
    }
    this.getDistrict();
    this.getAnnextureDataBySeq();
    this.getsessionPageLvl();
    this.getSchoolCategories();
  }
  getsessionPageLvl() {
    if (this.userProfile.school != '' || this.userProfile.school != 0) {
      this.sessionPageLvl = 4;
    } else if (this.userProfile.cluster != '' || this.userProfile.cluster != 0) {
      this.sessionPageLvl = 3;
    } else if (this.userProfile.block != '' || this.userProfile.block != 0) {
      this.sessionPageLvl = 2;
    } else if (this.userProfile.district != '' || this.userProfile.district != 0) {
      this.sessionPageLvl = 1;
    } else {
      this.sessionPageLvl = 0;
    }
  }
  getDistrict() {
    this.scDisrtictSelect = true;
    this.scDisrtictLoading = true;
    this.commonService.getAllDistrict().subscribe((data: any) => {
      this.districtData = data;
      this.districtData = this.districtData.data;

      if (this.userProfile.district != 0 || this.userProfile.district != "") {
        this.districtData = this.districtData.filter((dis: any) => {
          return dis.districtId == this.userProfile.district;
        });
        this.scDistrictId = this.userProfile.district;
        this.getBlock(this.userProfile.district);
      } else {
        this.districtData = this.districtData;
        this.scDisrtictSelect = false;
      }

      this.scBlockId = "";
      this.scDisrtictLoading = false;
    });
  }


  getBlock(districtId: any) {
    this.scBlockSelect = true;
    this.scBlockLoading = true;

    this.blockData = [];
    this.scBlockId = "";
    this.clusterData = [];
    this.scClusterId = "";
    this.schoolData = [];
    this.scSchoolId = "";

    if (districtId !== "") {
      this.commonService
        .getBlockByDistrictid(districtId)
        .subscribe((res: any) => {
          this.blockData = res;
          this.blockData = this.blockData.data;

          if (this.userProfile.block != 0 || this.userProfile.block != "") {
            this.blockData = this.blockData.filter((blo: any) => {
              return blo.blockId == this.userProfile.block;
            });
            this.scBlockId = this.userProfile.block;
            this.getCluster(this.userProfile.block);
          } else {
            this.scBlockSelect = false;
          }
          this.scBlockLoading = false;
        });
    } else {
      this.scBlockSelect = false;
      this.scBlockLoading = false;
    }
  }

  getCluster(blockId: any) {
    this.scClusterSelect = true;
    this.scClusterLoading = true;
    this.clusterData = [];
    this.scClusterId = "";
    this.schoolData = [];
    this.scSchoolId = "";
    if (blockId !== "") {
      this.commonService.getClusterByBlockId(blockId).subscribe((res: any) => {
        this.clusterData = res;
        this.clusterData = this.clusterData.data;

        if (this.userProfile.cluster != 0 || this.userProfile.cluster != "") {
          this.clusterData = this.clusterData.filter((clu: any) => {
            return clu.clusterId == this.userProfile.cluster;
          });
          this.scClusterId = this.userProfile.cluster
          this.getSchool(this.userProfile.cluster);
        } else {
          this.scClusterSelect = false;
        }
        this.scClusterLoading = false;
      });
    } else {
      this.scClusterSelect = false;
      this.scClusterLoading = false;
    }
  }

  getSchool(clusterId: any) {

    this.scSchoolSelect = true;
    this.scSchoolLoading = true;

    this.schoolData = [];
    this.scSchoolId = "";
    if (clusterId !== "") {
      var cluster = {
        clusterId: clusterId
      }
      this.schoolMisService.getschoolMis(cluster).subscribe((res: any) => {
        this.schoolData = res;
        this.schoolData = this.schoolData.data;

        if (this.userProfile.udiseCode != 0 || this.userProfile.udiseCode != "") {
          this.schoolData = this.schoolData.filter((sch: any) => {

            return sch.schoolUdiseCode == this.userProfile.udiseCode;
          });
          this.scSchoolId = this.schoolData[0]['schoolId'];
        } else {
          this.scSchoolSelect = false;
        }
        this.scSchoolLoading = false;
      });
    } else {
      this.scSchoolSelect = false;
      this.scSchoolLoading = false;
    }
  }
  getAnnextureDataBySeq() {

    this.schoolManagementChanged = true;
    this.spinner.show();
    this.commonService
      .getCommonAnnexture([
        "SCHOOL_MANAGEMENT"
      ], true)
      .subscribe({
        next: (res: any) => {
          this.spinner.hide();


          this.schoolManagement = res?.data?.SCHOOL_MANAGEMENT;
          this.genderData = res?.data?.GENDER;

          this.schoolManagementChanged = false;
        },
      });
  }

  getSchoolCategories() {
    this.schoolCategorySelect = true;
    this.schoolCategoryLoading = true;
    const sessionSchoolCate = {
      serviceType: "",
      schoolCategory: this.userProfile.schoolCategory
    }
    this.schoolMisService
      .getSchoolCategories(sessionSchoolCate)
      .subscribe((res: any) => {
        this.schoolCatData = res.data;
        this.schoolCatDataLegth = this.schoolCatData.length;
        if(this.userProfile.schoolCategory != '' || this.userProfile.schoolCategory != 0  ){
          this.schoolCategory=this.userProfile.schoolCategory;
          this.schoolCategorySelect = true;
        }else{

          this.schoolCategorySelect = false;
        }
        this.schoolCategoryLoading = false;
      });

  }

  printPage() {
    let cloneTable = document.getElementById("viewTable")?.innerHTML;
    const pageTitle = document.querySelector(".pageName")?.innerHTML;
    this.commonService.printPage(cloneTable, pageTitle);
  }
  onSearch() {

    this.pageIndex = 0;
    this.previousSize = 0;
    this.offset = 0;
    this.resultListData.splice(0, this.resultListData.length); // empty current data
    this.dataSource.paginator = this.paginator; // update paginator
    if(this.udiseCode == ""){
      if (this.scDistrictId === "") {
        this.alertHelper.viewAlert(
          "error",
          "Required",
          "Please select district."
        );
        return;
      }
    }
    
    this.loadSchoolData();
  }
  loadSchoolData(...params: any) {
    this.spinner.show();
    this.paramVal = {
      previousSize: this.previousSize,
      offset: this.offset.toString(),
      pageSize: this.pageSize.toString(),
      limit: this.pageSize,
      scDistrictId: this.scDistrictId,
      scBlockId: this.scBlockId,
      scClusterId: this.scClusterId,
      scSchoolId: this.scSchoolId,
      searchAcademicYear:this.searchAcademicYear,
      udiseCode:this.udiseCode,
      operationalStatus:this.operationalStatus,
      selManagement: this.selManagement,
      schoolCategory: this.schoolCategory,
      serviceType: "report"
    }
    this.schoolMisService.loadSchoolRawReportData(this.paramVal).subscribe({
      next: (res: any) => {
        this.resultListData.length = this.previousSize; // set current size
        this.resultListData.push(...res?.data); // merge with existing data
        this.resultListData.length = res?.totalRecord; // update length
        this.dataSource.paginator = this.paginator; // update paginator
        this.dataSource._updateChangeSubscription(); // update table
        this.isLoading = false;
        this.isNorecordFound = this.resultListData.length ? false : true;
        this.isInitAdmin = true;
        this.spinner.hide();
      },
      error: (error: any) => {
        this.isLoading = false;
        this.spinner.hide();
      },

    });

  }
  get getPageSizeOptions(): number[] {
    return this.dataSource?.paginator &&
      this.dataSource?.paginator?.length > 200
      ? [10, 30, 50, 100, this.dataSource.paginator.length]
      : [10, 30, 50, 100, 200];
  }

  onPageChange(event: any) {
    this.spinner.show();
    this.isLoading = true;
    // event: PageEvent
    this.pageSize = event.pageSize; // current page size ex: 10

    this.offset = event.pageIndex * event.pageSize;
    this.previousSize = this.pageSize * event.pageIndex; // set previous size
    this.pageIndex = event.pageIndex;
    this.loadSchoolData();
  }

  exportSchoolReport() {
    if (this.scDistrictId == '') {
      this.alertHelper.viewAlert(
        "error",
        "Required",
        "Please select district."
      );
      return;
    }
    this.spinner.show();
    this.paramVal = {
      scDistrictId: this.scDistrictId,
      scBlockId: this.scBlockId,
      scClusterId: this.scClusterId,
      scSchoolId: this.scSchoolId,
      searchAcademicYear: this.searchAcademicYear,
      udiseCode: this.udiseCode,
      operationalStatus: this.operationalStatus,
      selManagement: this.selManagement,
      schoolCategory: this.schoolCategory,
      serviceType: "Download"
    };

    this.schoolMisService.exportSchoolRawDetailsReport(this.paramVal).subscribe({
      next: (res: any) => {
        let filepath = this.fileUrl1 + '/' + res.data.replace('.', '~');
        window.open(filepath);
        this.spinner.hide();
      },
      error: (error: any) => {
        this.isLoading = false;
        this.spinner.hide();
      },
    });
  }

}
