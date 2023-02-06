import { Component, OnInit,ElementRef,ViewChild } from '@angular/core';
import { FormBuilder,FormControl,FormGroup,Validators,NgForm } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { AlertHelper } from 'src/app/core/helpers/alert-helper';
import { CustomValidators } from 'src/app/shared/validations/custom-validators';
import { formatDate } from '@angular/common';
import { RouterLink,ActivatedRoute,Router,ActivatedRouteSnapshot,RouterStateSnapshot } from '@angular/router';
import { Constant } from 'src/app/shared/constants/constant';
import { StudentMisService } from '../../services/student-mis.service';
import { CommonserviceService } from 'src/app/core/services/commonservice.service';
import { TeacherMisService } from 'src/app/application/teacher/services/teacher-mis.service';
import { ngxCsv } from 'ngx-csv';

@Component({
  selector: 'app-health-wise-report',
  templateUrl: './health-wise-report.component.html',
  styleUrls: ['./health-wise-report.component.css']
})
export class HealthWiseReportComponent implements OnInit {

  optionVal:any;
  optionstream:any;
  @ViewChild("searchForm") searchForm!: NgForm;
  config = new Constant();
  academicYear: any = this.config.getAcademicCurrentYear();
  userProfile = this.commonService.getUserProfile();
  schoolCategoryList:any = [];
  schoolCategoryList1:any = [];
  scDisrtictSelect: boolean = false;
  scDisrtictLoading: boolean = false;
  schCategogyLoading: boolean = false;
  allClassLoading:boolean = false;
  scBlockSelect: boolean = false;
  scBlockLoading: boolean = false;
  scClusterSelect: boolean = false;
  scClusterLoading: boolean = false
  scSchoolSelect: boolean = false;
  scSchoolLoading: boolean = false;
  isLoading: boolean = false;
  isNorecordFound: boolean = false;
  isInitAdmin: boolean = false;
  districtData: any = [];
  blockData: any = [];
  clusterData: any = [];
  schoolData: any = [];
  
  resultListData: any = [];
  sumData: any = [];
  getBackData: any = [];
  paramBack: any = [];
  scDistrictId: any = "";
  scBlockId: any = "";
  scClusterId: any = "";
  scSchoolId: any = "";
  schoolId: any = "";
  schoolCategoryType:any = "";

  pageLevel: any = 0;
  paramVal: any
  sessionPageLvl: any
  loadDataParam: any
  paramDrillDown: any
  minClass:any="";
  maxClass:any="";
  allClass:any= [];
  alltotal:any = [];
  allSum:any = "";
  parVal: any;
  backLevel: any;
  loginLevel: any;
  csvoptions:any;
  csvData:any;
  className:any = "";
  allStuTotal: any;
  schCatHidden: boolean = false;
  totalPer:any;
  countHealtStudent:any;
  constructor(
    private formBuilder: FormBuilder,
    private alertHelper: AlertHelper,
    private route: Router,
    private router: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private el: ElementRef,
    public customValidators: CustomValidators,
    private studentMisService: StudentMisService,
    private commonService: CommonserviceService,
    private teacherMisService: TeacherMisService,
  ) { }

  ngOnInit(): void {
    this.getDistrict();
    this.getSchoolCategory();
  }

  getSearchParams() {
    return {
      scDistrictId: this.searchForm.controls["scDistrictId"].value,
      scBlockId: this.searchForm.controls["scBlockId"].value,
      scClusterId: this.searchForm.controls["scClusterId"].value,
      schoolId: this.searchForm.controls["scSchoolId"].value,
      academicYear: this.searchForm.controls["academicYear"].value,
      schoolCategoryType: this.searchForm.controls["schoolCategoryType"].value,
      className: this.searchForm.controls["className"].value,
    };
  }

  onSearch() {
      this.loadData(this.getSearchParams());
  }

  // validateForm() {
  //     if (this.schoolCategoryType === "") {
  //       this.alertHelper.viewAlert(
  //         "error",
  //         "Required",
  //         "Please select school category"
  //       );
  //       return false;
  //     }
  //   return true;
  // }

  loadData(params: any){
    this.spinner.show();
    const paramObj = {
      scDistrictId: params.scDistrictId,
      scBlockId: params.scBlockId,
      scClusterId: params.scClusterId,
      schoolId: params.schoolId,
      academicYear: params.academicYear,
      schoolCategoryType: params.schoolCategoryType,
      className: params.className,
    };
    if (paramObj.schoolId != "") {
      this.pageLevel = 4;
    } else if (paramObj.scClusterId != "") {
      this.pageLevel = 3;
    } else if (paramObj.scBlockId != "") {
      this.pageLevel = 2;
    } else if (paramObj.scDistrictId != "") {
      this.pageLevel = 1;
    } else {
      this.pageLevel = 0;
    }
    this.isLoading = true;
    this.studentMisService.getHealthWiseReport(paramObj).subscribe({
      next: (res: any) => {
        this.resultListData = res?.data; // merge with existing data
        this.allStuTotal = res?.allStuTotal;
        this.countHealtStudent = res?.countHealtStudent;
        this.totalPer = res?.totalPer;
        this.alltotal = res?.alltotal;
        this.isInitAdmin = true;
        this.isNorecordFound = this.resultListData.length ? false : true;
        //console.log(this.resultListData);
        this.spinner.hide();
      },
      error: (error: any) => {
        this.isLoading = false;
        this.spinner.hide();
      },
    });
    //console.log(paramObj)
  }
  getClass(schCatId:any){
    this.allClassLoading = true;
    if(schCatId==""){
      this.className = "";
      this.allClass = [];
      this.allClassLoading = false;
    }else{
      this.studentMisService.getClass({schoolCategoryId:schCatId}).subscribe((res:any)=>{
        this.allClass = res.data;
        this.allClassLoading = false;
      })
    }
    
  }

  getSchCat(schoolId:any) {
    this.schCategogyLoading = true;
    this.studentMisService.getSchoolCategoryBySchoolId({schoolId:schoolId}).subscribe({
      next: (res: any) => {
        this.schoolCategoryList = res?.data;
        this.schCategogyLoading = false;
        this.schoolCategoryType = this.schoolCategoryList[0].code;
        this.schCatHidden =true;
        this.getClass(this.schoolCategoryList[0].code);
      },
    });
  }

  getSchoolCategory() {
    this.schCategogyLoading = true;
    if(this.userProfile.userLevel == 1){
      this.studentMisService.getSchoolCategory().subscribe({
        next: (res: any) => {
          this.schoolCategoryList = res?.data;
          this.schoolCategoryType = this.userProfile.schoolCategory;
          this.schCategogyLoading = false;
        },
      });
      
    }else{
      this.studentMisService.getSchoolCategory().subscribe({
        next: (res: any) => {
          this.schoolCategoryList = res?.data;
          this.schCategogyLoading = false;
        },
      });
    }
    
  }

  getDrillDownData(
    distId: any,
    blkId: any,
    cluId: any,
    sclId: any,
    schCat: any,
    acd: any,
    level: any
  ) {
    if (level == 1) {
      this.scDistrictId = distId;
      this.getBlock(distId);
      this.parVal = {
        scDistrictId: distId,
        scBlockId: "",
        scClusterId: "",
        schoolId: "",
        schoolCategoryType:schCat,
        academicYear:acd
      };
    }

    if (level == 2) {
      this.scDistrictId = distId;
      this.scBlockId = blkId;
      this.getCluster(blkId);
      this.parVal = {
        scDistrictId: distId,
        scBlockId: blkId,
        scClusterId: "",
        schoolId: "",
        schoolCategoryType:schCat,
        academicYear:acd
      };
    }

    if (level == 3) {
      this.scDistrictId = distId;
      this.scBlockId = blkId;
      this.scClusterId = cluId;
      this.getSchool(cluId);
      this.parVal = {
        scDistrictId: distId,
        scBlockId: blkId,
        scClusterId: cluId,
        schoolId: "",
        schoolCategoryType:schCat,
        academicYear:acd
      };
    }

    if (level == 4) {
      this.scDistrictId = distId;
      this.scBlockId = blkId;
      this.scClusterId = cluId;
      this.scSchoolId = sclId;
      this.getSchCat(sclId);
      this.parVal = {
        scDistrictId: distId,
        scBlockId: blkId,
        scClusterId: cluId,
        schoolId: sclId,
        schoolCategoryType:schCat,
        academicYear:acd
      };
    }

    this.loadData(this.parVal);
  }

  goBack(
    distId: any,
    blkId: any,
    cluId: any,
    sclId: any,
    schCat: any,
    acd: any,
    level: any,
  ) {
    if (cluId != "") {
      this.backLevel = 2;
    } else if (blkId != "") {
      this.backLevel = 3;
    } else if (distId != "") {
      this.backLevel = 4;
    } else {
      this.backLevel = 5;
    }
    if (this.backLevel != this.loginLevel) {
      if (level == 1) {
        this.parVal = {
          scDistrictId: "",
          scBlockId: "",
          scClusterId: "",
          schoolId: "",
          schoolCategoryType:schCat,
          academicYear:acd
        };
        this.getDistrict();
        this.searchForm.controls["scDistrictId"].patchValue("");
        this.loadData(this.parVal);
      }

      if (level == 2) {
        this.parVal = {
          scDistrictId: distId,
          scBlockId: "",
          scClusterId: "",
          schoolId: "",
          schoolCategoryType:schCat,
          academicYear:acd
        };

        this.searchForm.controls["scDistrictId"].patchValue(distId);
        this.getBlock(distId);
        this.searchForm.controls["scBlockId"].patchValue("");
        this.loadData(this.parVal);
      }

      if (level == 3) {
        this.parVal = {
          scDistrictId: distId,
          scBlockId: blkId,
          scClusterId: "",
          schoolId: "",
          schoolCategoryType:schCat,
          academicYear:acd
        };

        this.getCluster(blkId);
        this.searchForm.controls["scDistrictId"].patchValue(distId);
        this.searchForm.controls["scBlockId"].patchValue(blkId);
        this.searchForm.controls["scClusterId"].patchValue("");

        this.loadData(this.parVal);
      }

      if (level == 4) {
        this.parVal = {
          scDistrictId: distId,
          scBlockId: blkId,
          scClusterId: cluId,
          schoolId: sclId,
          schoolCategoryType:schCat,
          academicYear:acd
        };

        this.getSchool(cluId);
        this.searchForm.controls["scDistrictId"].patchValue(distId);
        this.searchForm.controls["scBlockId"].patchValue(blkId);
        this.searchForm.controls["scClusterId"].patchValue(cluId);
        this.searchForm.controls["schoolId"].patchValue(sclId);
        this.loadData(this.parVal);
      }
    }
  }

  printPage() {
    let cloneTable = document.getElementById("viewTable")?.innerHTML;
    const pageTitle = document.querySelector(".pageName")?.innerHTML;
    this.commonService.printPage(cloneTable, pageTitle);
  }

  excel(level: any) {
    this.spinner.show();
    this.csvData = this.getSearchParams();
    this.studentMisService.downloadGenderWiseReportCsv(this.csvData).subscribe(
      (res: any) => {
        const data = res["data"];
        if (level == 0) {
          this.csvoptions = {
            fieldSeparator: ",",
            quoteStrings: '"',
            decimalseparator: ".",
            showLabels: true,
            useBom: true,
            headers: [
              "SLN#",
              "District",
              "Numbers Of Schools",
              "Number of visited schools",
              "Number of visits",
              "Open count",
              "Close count",
              "%Open",
              "%Close",
            ],
          };
        }
        if (level == 1) {
          this.csvoptions = {
            fieldSeparator: ",",
            quoteStrings: '"',
            decimalseparator: ".",
            showLabels: true,
            useBom: true,
            headers: [
              "SLN#",
              "District",
              "Block",
              "Numbers Of Schools",
              "Number of visited schools",
              "Number of visits",
              "Open count",
              "Close count",
              "%Open",
              "%Close",
            ],
          };
        }
        if (level == 2) {
          this.csvoptions = {
            fieldSeparator: ",",
            quoteStrings: '"',
            decimalseparator: ".",
            showLabels: true,
            useBom: true,
            headers: [
              "SLN#",
              "District",
              "Block",
              "Cluster",
              "Numbers Of Schools",
              "Number of visited schools",
              "Number of visits",
              "Open count",
              "Close count",
              "%Open",
              "%Close",
            ],
          };
        }
        if (level == 3 || level == 4) {
          this.csvoptions = {
            fieldSeparator: ",",
            quoteStrings: '"',
            decimalseparator: ".",
            showLabels: true,
            useBom: true,
            headers: [
              "SLN#",
              "District",
              "Block",
              "Cluster",
              "school",
              "Number of visits",
              "Open count",
              "Close count",
              "%Open",
              "%Close",
            ],
          };
        }

        new ngxCsv(data, "genderWiseEnrollmentReport", this.csvoptions);
        this.spinner.hide();
      }
    );
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
    this.schoolCategoryList = [];
    this.schCatHidden = false;
    this.schoolCategoryType = "";
    this.allClass = [];
    this.className = "";

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
    this.schoolCategoryList = [];
    this.schCatHidden = false;
    this.schoolCategoryType = "";
    this.allClass = [];
    this.className = "";
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
    this.schoolCategoryList = [];
    this.schCatHidden = false;
    this.schoolCategoryType = "";
    this.allClass = [];
    this.className = "";
    if (clusterId !== "") {
      var cluster = {
        clusterId: clusterId
      }
      this.studentMisService.getSchoolList(cluster).subscribe((res: any) => {
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

}



