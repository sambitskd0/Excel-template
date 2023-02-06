import {
  AfterViewInit,
  Component,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
} from "@angular/core";
import { FormBuilder, FormGroup, NgForm } from "@angular/forms";
import { MatPaginator } from "@angular/material/paginator";
import { ProgressBarMode } from "@angular/material/progress-bar";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { Router } from "@angular/router";
import { DataTableDirective } from "angular-datatables";
import { MatTableExporterDirective } from "mat-table-exporter";
import { NgxSpinnerService } from "ngx-spinner";
import { Subject } from "rxjs";
import { AlertHelper } from "src/app/core/helpers/alert-helper";
import { PrivilegeHelper } from "src/app/core/helpers/privilege-helper";
import { CommonserviceService } from "src/app/core/services/commonservice.service";
import { Constant } from "src/app/shared/constants/constant";
import { environment } from "src/environments/environment";
import { SchoolService } from "../../school/services/school.service";
import { IndustrialTrainingService } from "../services/industrial-training.service";

@Component({
  selector: "app-view-industrial-training",
  templateUrl: "./view-industrial-training.component.html",
  styleUrls: ["./view-industrial-training.component.css"],
})
export class ViewIndustrialTrainingComponent implements OnInit {
  public fileUrl = environment.filePath;
  public show: boolean = true;
  public buttonName: any = "Show";
  @ViewChild("searchForm") searchForm!: NgForm;
  public userProfile = JSON.parse(
    sessionStorage.getItem("userProfile") || "{}"
  );
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
  displayedColumns: string[] = [];
  viewIndustrialData: any = [];
  dataSource = new MatTableDataSource(this.viewIndustrialData);
  //end
  userId:any="";
  paramObj: any; 
  serviceType: string = "Search";
  isLoading = false;
  pageIndex: any = 0;
  previousSize: any = 0;

  academicYearwise: any = "";
  districtId: any = "";
  blockId: any = "";
  clusterId: any = "";
  searchSchoolId: any = "";

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
  clusterData: any = "";
  getSchoolData: any = "";
  sessionBlockId: any =
    this.userProfile.block != 0 ? this.userProfile.block : "";

  districtData: any = [];
  blockChanged: boolean = false;
  blockData: any = [];
  adminPrivilege: boolean = false;
  plPrivilege: string = "admin"; //For menu privilege
  config = new Constant();
  isNorecordFound: boolean = false;
  isInitAdmin: boolean = false;
  industrialTrainingListData: any = [];
  emptyCheck: boolean = false;
  allTeacherName: any = "";
  teacherListModal: any = "";
  teacherListCode: any = "";

  descFullText: string = "";
  loginUserType: any = "";
  userDesignation: any = "";
  teacherListPrint: boolean = false;
  teacherListPrintS:any="";
  
  constructor(
    private commonService: CommonserviceService,
    private industrialTraining: IndustrialTrainingService,
    private alertHelper: AlertHelper,
    private privilegeHelper: PrivilegeHelper,   //For menu privilege
  	private router:Router,
    private formBuilder: FormBuilder,
    private spinner: NgxSpinnerService,
    private schoolService: SchoolService
  ) {const users = this.commonService.getUserProfile();
    this.userId = users?.userId;
    this.loginUserType = this.userProfile.loginUserTypeId;
    this.userDesignation = this.userProfile.designationId;}
  ngOnInit(): void {
    if(this.plPrivilege=='admin'){
      this.adminPrivilege = true;
      this.displayedColumns = [
        "slNo",
        "agencyName",
        "dateOfVisit",
        "trainingName",
        "industrialTrainingList",
        "description",
        "status",
      ]; 
    } else {
      this.displayedColumns = [
        "slNo",
        "agencyName",
        "dateOfVisit",
        "trainingName",
        "industrialTrainingList",
        "description",
      ]; 
    }
    if(this.loginUserType == 2){
      this.isInitAdmin = true;
    }
    else if ((this.loginUserType != 3)) {
      this.loadIndustrialData(this.getSearchParams());      
    } else{
      this.isInitAdmin = true;
    }

    this.getDistrict();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  getDistrict() {
    this.scDisrtictSelect = false;
    this.scDisrtictLoading = true;
    this.commonService.getAllDistrict().subscribe((data: any) => {
      this.districtData = data;
      this.districtData = this.districtData.data;

      if (this.userProfile.district != 0 || this.userProfile.district != "") {
        this.searchDistrictData = this.districtData.filter((dis: any) => {
          return dis.districtId == this.userProfile.district;
        });
        this.searchForm.controls["districtId"].patchValue(
          this.userProfile.district
        );
        this.getBlock(this.userProfile.district);
      } else {
        this.searchDistrictData = this.districtData;
        this.scDisrtictSelect = true;
      }

      this.blockId = "";
      this.scDisrtictLoading = false;
    });
  }

  getBlock(districtId: any) {
    this.scBlockSelect = false;
    this.scBlockLoading = true;

    this.searchBlockData = [];
    this.searchForm.controls["blockId"].patchValue("");

    this.clusterData = [];
    // this.searchForm.controls["clusterId"].patchValue("");

    this.getSchoolData = [];
    this.searchForm.controls["searchSchoolId"].patchValue("");

    if (districtId !== "") {
      this.commonService
        .getBlockByDistrictid(districtId)
        .subscribe((res: any) => {
          this.searchBlockData = res;
          this.searchBlockData = this.searchBlockData.data;

          if (this.userProfile.block != 0 || this.userProfile.block != "") {
            this.searchBlockData = this.searchBlockData.filter((blo: any) => {
              return blo.blockId == this.userProfile.block;
            });
            this.searchForm.controls["blockId"].patchValue(
              this.userProfile.block
            );
            // this.getCluster(this.userProfile.block);
            this.getSchool(this.userProfile.block);
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

  getCluster(blockId: any) {
    this.scClusterSelect = false;
    this.scClusterLoading = true;

    this.clusterData = [];
    // this.searchForm.controls["clusterId"].patchValue("");

    this.getSchoolData = [];
    this.searchForm.controls["searchSchoolId"].patchValue("");

    if (blockId !== "") {
      this.commonService.getClusterByBlockId(blockId).subscribe((res: any) => {
        this.clusterData = res;
        this.clusterData = this.clusterData.data;

        if (this.userProfile.cluster != 0 || this.userProfile.cluster != "") {
          this.clusterData = this.clusterData.filter((clu: any) => {
            return clu.clusterId == this.userProfile.cluster;
          });
          // this.searchForm.controls["clusterId"].patchValue(
          //   this.userProfile.cluster
          // );
          this.getSchool(this.userProfile.cluster);
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

  getSchool(blockId: any) {
    
    this.scSchoolSelect = false;
    this.scSchoolLoading = true;

    this.getSchoolData = [];
    this.searchForm.controls["searchSchoolId"].patchValue("");
    let paramList: any = {blockId: this.blockId};
    if (blockId !== "") {
      this.schoolService.getSchoolList(paramList).subscribe((res: any) => {
        this.getSchoolData = res;
        this.getSchoolData = this.getSchoolData.data;

        if (
          this.userProfile.udiseCode != 0 ||
          this.userProfile.udiseCode != ""
        ) {
          this.getSchoolData = this.getSchoolData.filter((sch: any) => {
            return sch.schoolUdiseCode == this.userProfile.udiseCode;
          });
          this.searchForm.controls["searchSchoolId"].patchValue(
            this.getSchoolData[0].schoolId
          );
        } else {
          this.scSchoolSelect = true;
        }
        this.scSchoolLoading = false;
      });
    } else {
      this.scSchoolSelect = true;
      this.scSchoolLoading = false;
    }
  }
  getSearchParams() {
    return {
      previousSize: this.previousSize,
      offset: this.offset.toString(),
      pageSize: this.pageSize.toString(),
      academicYearwise: this.academicYearwise,
      districtId: this.districtId,
      blockId: this.blockId,
      clusterId: this.clusterId,
      searchSchoolId: this.searchSchoolId,
    };
  }
  loadIndustrialData(...params: any) {
    this.spinner.show();
    const {
      previousSize,
      offset,
      pageSize,
      districtId,
      blockId,
      clusterId,
      searchSchoolId,
      academicYearwise,
    } = params[0];
    this.paramObj = {
      offset: offset,
      limit: pageSize,
      //userId: this.userProfile.userId,
      loginUserType: this.userProfile.loginUserType,
      schoolId: this.userProfile.school,
      districtId: districtId,
      blockId: blockId,
      clusterId: clusterId,
      searchSchoolId: searchSchoolId,
      academicYearwise: academicYearwise,
      serviceType: this.serviceType, 
      userId: this.userId
    };

    this.isLoading = true;

    this.industrialTraining.viewIndustrialTraining(this.paramObj).subscribe({
      next: (res: any) => {
        this.viewIndustrialData.length = previousSize; // set current size
        this.viewIndustrialData.push(...res?.data); // merge with existing data
        this.viewIndustrialData.length = res?.totalRecord; // update length
        this.dataSource.paginator = this.paginator; // update paginator
        this.dataSource._updateChangeSubscription(); // update table
        this.isLoading = false;
        this.isNorecordFound = this.viewIndustrialData.length ? false : true;
        this.teacherListPrint = true;
        this.spinner.hide();
      },
      error: (error: any) => {
        this.isLoading = false;
        this.spinner.hide();
      },
    });
  }
  showTeacherList(teacherName: any) {
    this.allTeacherName = teacherName;
    this.teacherListModal = this.allTeacherName?.split(",");
    
  }
  onDelete(encId: string) {
    this.alertHelper
      .deleteAlert("Are you sure to delete?", "", "question", "Yes, delete it!")
      .then((result) => {
        if (result.value) {
          this.spinner.show(); // ==== show spinner
          let paramList: any = {
            encId: encId,
            updatedBy: this.userProfile.userId,
          };
          this.industrialTraining
            .deleteIndustrialTraining(paramList)
            .subscribe((res: any) => {
             
              this.spinner.hide(); //==== hide spinner
              this.alertHelper.successAlert(
                "Deleted!",
                "Industrial training deleted successfully",
                "success"
              );
              this.loadIndustrialData(this.getSearchParams());
            });
        }
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
    this.loadIndustrialData(this.getSearchParams());
  }
  onSearch() {
    this.pageIndex = 0;
    this.previousSize = 0;
    this.offset = 0;
    // this.previousSize = 0;
    if (this.validateForm() === true) {
      this.spinner.show();
      this.loadIndustrialData(this.getSearchParams());
      this.isInitAdmin = false;
    }
  }
  validateForm(): Boolean {
    if (this.districtId === "") {
      this.alertHelper.successAlert("", "Please select district", "error");
      return false;
    }
    if (this.blockId === "") {
      this.alertHelper.successAlert("", "Please select block", "error");
      return false;
    }
    // if (this.clusterId === "") {
    //   this.alertHelper.successAlert("", "Please select cluster", "info");
    //   return false;
    // }
    if (this.searchSchoolId === "") {
      this.alertHelper.successAlert("", "Please select school", "error");
      return false;
    }
    return true;
  }
  toggle() {
    this.show = !this.show;
    if (this.show) this.buttonName = "Hide";
    else this.buttonName = "Show";
  }
  viewDescription(descText: string) {
    this.descFullText = descText;
  }
  downloadIndTrainingList()
  {
    this.spinner.show();   
    this.paramObj.serviceType = "Download";

    this.industrialTraining.viewIndustrialTraining(this.paramObj).subscribe({
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
  printPage() {
    let cloneTable 	= document.getElementById("viewTable")?.innerHTML;
    const pageTitle = document.querySelector(".pageName")?.innerHTML;    
    
    this.teacherListPrint = true; 
    this.commonService.printPage(cloneTable, pageTitle);
  }
}
