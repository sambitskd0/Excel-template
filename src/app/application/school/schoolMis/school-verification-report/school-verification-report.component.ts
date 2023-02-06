import { Component, OnInit, ViewChild } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { AlertHelper } from 'src/app/core/helpers/alert-helper';
import { CommonserviceService } from 'src/app/core/services/commonservice.service';
import { SchoolMisService } from '../../services/school-mis.service';
import { SchoolService } from '../../services/school.service';
import { environment } from 'src/environments/environment';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-school-verification-report',
  templateUrl: './school-verification-report.component.html',
  styleUrls: ['./school-verification-report.component.css']
})
export class SchoolVerificationReportComponent implements OnInit {

  public show:boolean         = true;
  public buttonName:any       = 'Show';
  isNorecordFound: boolean    = false;
  isInitAdmin: boolean        = false;

  public fileUrl1 = environment.filePath;
  userProfile = this.commonService.getUserProfile();
  @ViewChild("searchForm") searchForm!: NgForm;

  districtData: any         = [];
  blockData: any            = [];
  clusterData: any          = [];
  schoolData: any           = [];
  socialCategoryList: any   = [];
  schoolManagement: any     = [];
  resultListData: any       = [];
  getBackData: any          = [];
  paramBack: any            = [];
  
  scDisrtictSelect: boolean               = true;
  scDisrtictLoading: boolean              = false;
  scBlockSelect: boolean                  = true;
  scBlockLoading: boolean                 = false;
  scClusterSelect: boolean                = true;
  scClusterLoading: boolean               = false;
  scSchoolSelect: boolean                 = true;
  scSchoolLoading: boolean                = false;
  schoolManagementChanged: boolean        = false;
  isLoading: boolean                      = false;

  pageLevel: any                  = 0;
  colSpanTotal:any                = 0;
  sumTotalSchool:any              = 0;
  totalNotVerifiedSchool: any     = 0;
  totalVerifiedSchool: any        = 0;
  totalPendingAtDPO: any          = 0;
  totalPendingAtBEO: any          = 0;
  resultListDataLength: any       = "";

  paramVal: any                   = "";
  sessionPageLvl: any             = "";
  loadDataParam: any              = "";
  paramDrillDown: any             = "";

  pageSize                        = 10;
  offset                          = 0;
  currentPage                     = 0;
  totalRows                       = 0;
  previousSize: any               = 0;
  pageIndex: any                  = 0;

  scDistrictId: any               = "";
  scBlockId: any                  = "";
  scClusterId: any                = "";
  scSchoolId: any                 = "";
  selManagement: any              = "";
 
  constructor(
    private commonService: CommonserviceService,
    private spinner: NgxSpinnerService,
    private alertHelper: AlertHelper,
    private schoolMisService:SchoolMisService,
    private schoolService : SchoolService
  ) { }

  ngOnInit(): void {
    this.getDistrict();
    this. getAnnextureDataBySeq();
    this.getsessionPageLvl();
  }

  //CODE FOR GO BACK BUTTON 
  goBack(pglvl: any){
    // console.log(pglvl);
    if (pglvl == 4) {
      this.paramBack = {
        scDistrictId: this.scDistrictId,
        scBlockId: this.scBlockId,
        scClusterId: this.scClusterId,
        scSchoolId: "",
        selManagement: this.selManagement,
        schoolCategory: this.userProfile.schoolCategory,
        serviceType: "report"
      }
      this.scSchoolId = '';
      this.loadData(this.paramBack);
    } else if (pglvl == 3) {
      this.paramBack = {
        scDistrictId: this.scDistrictId,
        scBlockId: this.scBlockId,
        scClusterId: '',
        scSchoolId: '',
        selManagement: this.selManagement,
        schoolCategory: this.userProfile.schoolCategory,
        serviceType: "report"
      }
      this.scClusterId = ''
      this.schoolData = [];
      this.loadData(this.paramBack);
    } else if (pglvl == 2) {
      this.paramBack = {
        scDistrictId: this.scDistrictId,
        scBlockId: '',
        scClusterId: '',
        scSchoolId: '',
        selManagement: this.selManagement,
        schoolCategory: this.userProfile.schoolCategory,
        serviceType: "report"
      }
      this.clusterData = [];
      this.scBlockId = '';
      this.loadData(this.paramBack);
    } else if (pglvl == 1) {
      this.paramBack = {
        scDistrictId: '',
        scBlockId: '',
        scClusterId: '',
        scSchoolId: '',
        selManagement: this.selManagement,
        schoolCategory: this.userProfile.schoolCategory,
        serviceType: "report"
      }
      this.blockData = []
      this.scDistrictId = '';
      this.loadData(this.paramBack);
    }
    
  }
  //DRILL DOWN REPORT DATA
  drillDown(scDistrictId: any, scBlockId: any, scClusterId: any, scSchoolId: any, selManagement: any) {
    this.paramDrillDown = {
      scDistrictId: scDistrictId,
      scBlockId: scBlockId,
      scClusterId: scClusterId,
      scSchoolId: scSchoolId,
      selManagement: selManagement,
      schoolCategory: this.userProfile.schoolCategory,
      serviceType: "report"
    }
    if (scDistrictId != '') {
      this.scDistrictId = scDistrictId;
      this.getBlock(scDistrictId);
    }
    if (scBlockId != '') {
      this.scBlockId = scBlockId;
      this.getCluster(scBlockId);
    }
    if (scClusterId != '') {
      this.scClusterId = scClusterId;
      // this.getSchool(scClusterId);
    }
    if (scSchoolId != '') {
      this.scSchoolId = scSchoolId;
    }
    this.loadData(this.paramDrillDown);
  }

  // GET SEARCHED DATA
  onSearch(){
    this.paramVal = {
      scDistrictId: this.scDistrictId,
      scBlockId: this.scBlockId,
      scClusterId: this.scClusterId,
      scSchoolId: this.scSchoolId,
      selManagement: this.selManagement,
      schoolCategory: this.userProfile.schoolCategory,
      serviceType: "report"
    }
    this.loadData(this.paramVal);
  }
  
  //GET TABLE DATA
  loadData(params: any) {
    this.loadDataParam = {
      scDistrictId: params.scDistrictId,
      scBlockId: params.scBlockId,
      scClusterId: params.scClusterId,
      scSchoolId: params.scSchoolId,
      selManagement: params.selManagement,
      schoolCategory: params.schoolCategory,
      serviceType: "report"
    }
    this.spinner.show();
    this.schoolMisService.loadSchoolVerificationReportData(this.loadDataParam).subscribe({
      next: (res: any) => {
        this.resultListDataLength = res?.length; // set current size
        this.resultListData = res?.data; // merge with existing data
        this.pageLevel = res?.pageLevel
        this.getBackData = res?.getBackData
        this.colSpanTotal = res?.pageLevel + 2;
        this.sumTotalSchool = res?.sumTotalSchool;
        this.totalNotVerifiedSchool = res?.sumNotVerifiedSchool;
        this.totalVerifiedSchool = res?.sumVerifiedSchool;
        this.totalPendingAtDPO = res?.sumPendingAtDPO;
        this.totalPendingAtBEO = res?.sumPendingAtBEO;
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

  // GET SESSION DEMOGRAPHY DATA
  getsessionPageLvl() {
    if (this.userProfile.school != '' || this.userProfile.school != 0) { //school level
      this.sessionPageLvl = 4;
    } else if (this.userProfile.cluster != '' || this.userProfile.cluster != 0) { //cluster level
      this.sessionPageLvl = 3;
    } else if (this.userProfile.block != '' || this.userProfile.block != 0) { //block level
      this.sessionPageLvl = 2;
    } else if (this.userProfile.district != '' || this.userProfile.district != 0) { //district level
      this.sessionPageLvl = 1;
    } else {
      this.sessionPageLvl = 0; //state level
    }
  }

   // GET DISTRICT
  getDistrict() {
    this.scDisrtictSelect = false;
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
        this.scDisrtictSelect = true;
      }

      this.scBlockId = "";
      this.scDisrtictLoading = false;
    });
  }

  // GET BLOCK
  getBlock(districtId: any) {
    this.scBlockSelect = false;
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
            this.scBlockSelect = true;
          }
          this.scBlockLoading = false;
        });
    } else {
      this.scBlockSelect = true;
      this.scBlockLoading = false;
    }
  }

  // GET CLUSTER
  getCluster(blockId: any) {
    this.scClusterSelect = false;
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
          // this.getSchool(this.userProfile.cluster);
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
          this.schoolManagementChanged = false;
        },
      });
  }
  // SHOW HIDE SEARCH PANEL
  toggle() {
    this.show = !this.show;
    if(this.show)  
      this.buttonName = "Hide";
    else
      this.buttonName = "Show";
  }
  printPage() {
    let cloneTable = document.getElementById("viewTable")?.innerHTML;
    const pageTitle = document.querySelector(".pageName")?.innerHTML;
    this.commonService.printPage(cloneTable, pageTitle);
  }

  exportSchoolVerifyDetailReport(){
    if(this.scDistrictId == ''){
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
      selManagement: this.selManagement,
      schoolCategory: this.userProfile.schoolCategory,
      serviceType: "excel"
    };

    this.schoolMisService.exportSchoolVerifyDetailReport(this.paramVal).subscribe({
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

  excelDownload(){
    this.spinner.show();
    this.paramVal = {
      scDistrictId: this.scDistrictId,
      scBlockId: this.scBlockId,
      scClusterId: this.scClusterId,
      scSchoolId: this.scSchoolId,
      selManagement: this.selManagement,
      schoolCategory: this.userProfile.schoolCategory,
      serviceType: "excel"
    }
    this.schoolMisService.exportSchoolVerifyCountReport(this.paramVal).subscribe({
      next: (res: any) => {
        console.log(res,"res");
        console.log(this.paramVal,"input");
        
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
