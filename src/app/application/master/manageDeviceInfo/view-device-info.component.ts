import { Component, ElementRef, Input, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { AlertHelper } from "src/app/core/helpers/alert-helper";
import { CustomValidators } from "src/app/shared/validations/custom-validators";
import { DeviceInfoServicesService } from "../services/device-info.service";
import { NgxSpinnerService } from "ngx-spinner";
import { CommonserviceService } from "src/app/core/services/commonservice.service";
import { MatTableExporterDirective } from "mat-table-exporter";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { ProgressBarMode } from "@angular/material/progress-bar";
import { MatTableDataSource } from "@angular/material/table";
import { environment } from "src/environments/environment";
import { Constant } from "src/app/shared/constants/constant";
import { PrivilegeHelper } from "src/app/core/helpers/privilege-helper";
import { Router } from "@angular/router";

@Component({
  selector: "app-view-device-info",
  templateUrl: "./view-device-info.component.html",
  styleUrls: ["./view-device-info.component.css"],
})
export class ViewDeviceInfoComponent implements OnInit {
  public fileUrl = environment.filePath;
  DeviceSearchForm!: FormGroup;
  // categoryName: any ="";
  allDistrict: any;
  blockData: any;
  resData: any;
  clusterData: any;
  schoolData: any;
  teacherData: any;
  districtId: any = "";
  blockId: any = "";
  clusterId: any = "";
  schoolId: any = "";
  teacherId: any = "";
  deviceType: any = "";
  uuidImei: any = "";
  userId: any = "";
  profileId: any = "";
  deviceInfoData: any;
  filterChanged: boolean = false;
  filterChangedCluster: boolean = false;
  filterChangedSchool: boolean = false;
  filterChangedTeacher: boolean = false;
  post: any;
  select_all = false;
  isEmpty: boolean = false;
  isNorecordFound: boolean = false;
  plPrivilege:string="view"; //For menu privilege
  config = new Constant();
  // mat table
  pageIndex: any = 0;
  previousSize: any = 0;
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
  displayedColumns: string[] = []; // define mat table columns
  resultListData: any = [];
  questionDetailsData!: any;
  dataSource = new MatTableDataSource(this.resultListData);
  isLoading = false;
  //end
  paramObj: any; 
  serviceType: string = "Search";
  constructor(
    private formBuilder: FormBuilder,
    private deviceinfoServicesservice: DeviceInfoServicesService,
    private commonService: CommonserviceService,
    private privilegeHelper: PrivilegeHelper,   //For menu privilege
    private alertHelper: AlertHelper,
    private router:Router,
    private el:ElementRef,
    public customValidator: CustomValidators,
    private spinner: NgxSpinnerService
  ) {const pageUrl:any = this.router.url;  
    this.plPrivilege = this.privilegeHelper.PrimaryLinkPrivilege(pageUrl);  //For menu privilege    
    this.commonService.verifyLinkPermission(pageUrl, this.config.linkType[2], this.config.privilege[1]);  // For authorization
    const users = this.commonService.getUserProfile();
    this.userId = users?.userId;}

  ngOnInit(): void {
    //this.spinner.show();
    if(this.plPrivilege=='admin'){
      this.adminPrivilege = true;
      this.displayedColumns = [
        "slNo",
        "District",
        "Block",
        "Cluster",
        "School",
        "Teacher",
        "Received_Date",
        "deviceType",
        "UUID_IMEI",
        "Action",
      ]; 
    } else {
      this.displayedColumns = [
        "slNo",
        "District",
        "Block",
        "Cluster",
        "School",
        "Teacher",
        "Received_Date",
        "deviceType",
        "UUID_IMEI",
      ]; 
    }
    const userProfile = this.commonService.getUserProfile();
    this.userId = userProfile?.userId;
    this.getAllDist();
    this.searchDeviceInfo(this.getSearchParams());
    this.initializeForm();
    this.el.nativeElement.querySelector("[formControlName=districtId]").focus();
    
  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  getAllDist() {
    this.commonService.getAllDistrict().subscribe((data: []) => {
      this.allDistrict = data;
      this.allDistrict = this.allDistrict.data;
    });
  }
  initializeForm() {
    this.DeviceSearchForm = this.formBuilder.group({
      districtId: [this.districtId],
      blockId: [this.blockId],
      clusterId: [this.clusterId],
      schoolId: [this.schoolId],
      teacherId: [this.teacherId],
      deviceType: [this.deviceType],
      uuidImei: [this.uuidImei,[Validators.maxLength(30),Validators.minLength(1)]],
    });
  }
  getBlock(id: any) {
    this.filterChanged = true;

    this.DeviceSearchForm.patchValue({
      blockId: "",
    });
    this.DeviceSearchForm.patchValue({
      clusterId: "",
    });
    this.DeviceSearchForm.patchValue({
      schoolId: "",
    });
    this.DeviceSearchForm.patchValue({
      teacherId: "",
    });
    const districtId = id;
    this.blockData = [];
    this.clusterData = [];
    this.schoolData = [];
    this.teacherData = [];
    if (districtId !== "") {
      this.commonService
        .getBlockByDistrictid(districtId)
        .subscribe((res: any) => {
          let data: any = res;
          for (let key of Object.keys(data["data"])) {
            this.blockData.push(data["data"][key]);
          }

          this.filterChanged = false;
        });
    } else {
      this.DeviceSearchForm.patchValue({
        districtId: "",
      });
      this.DeviceSearchForm.patchValue({
        blockId: "",
      });
      this.DeviceSearchForm.patchValue({
        clusterId: "",
      });
      this.DeviceSearchForm.patchValue({
        schoolId: "",
      });
      this.DeviceSearchForm.patchValue({
        teacherId: "",
      });
      this.filterChanged = false;
    }
  }
  getCluster(id: any) {
    this.filterChangedCluster = true;

    this.DeviceSearchForm.patchValue({
      clusterId: "",
    });
    this.DeviceSearchForm.patchValue({
      schoolId: "",
    });
    this.DeviceSearchForm.patchValue({
      teacherId: "",
    });
    const blockId = id;
    this.clusterData = [];
    if (blockId !== "") {
      this.commonService.getClusterByBlockId(blockId).subscribe((res: any) => {
        let data: any = res;
        for (let key of Object.keys(data["data"])) {
          this.clusterData.push(data["data"][key]);
        }

        this.filterChangedCluster = false;
      });
    } else {
      this.DeviceSearchForm.patchValue({
        blockId: "",
      });
      this.DeviceSearchForm.patchValue({
        clusterId: "",
      });
      this.DeviceSearchForm.patchValue({
        schoolId: "",
      });
      this.DeviceSearchForm.patchValue({
        teacherId: "",
      });
      this.filterChangedCluster = false;
    }
  }
  clusterChange(val: any) {
    this.DeviceSearchForm.patchValue({
      schoolId: "",
    });
    this.DeviceSearchForm.patchValue({
      teacherId: "",
    });
    this.clusterId = val;

    if (this.clusterId !== "") {
      this.getSchool(this.clusterId);
    } else {
      this.DeviceSearchForm.patchValue({
        schoolId: "",
      });
      this.DeviceSearchForm.patchValue({
        teacherId: "",
      });
    }
  }
  schoolChange(val: any) {
    this.DeviceSearchForm.patchValue({
      teacherId: "",
    });
    this.schoolId = val;
    if (this.schoolId !== "") {
      this.getTeacher(this.schoolId);
    } else {
      this.DeviceSearchForm.patchValue({
        teacherId: "",
      });
    }
  }
  getSchool(id: number) {
    this.filterChangedSchool = true;

    const clusterId = id;
    this.schoolData = [];
    this.commonService.getSchoolList(clusterId).subscribe((res: any) => {
      this.schoolData = res;
      this.schoolData = this.schoolData.data;
    });
    this.filterChangedSchool = false;
  }
  getTeacher(id: number) {
    this.filterChangedTeacher = true;
    const schoolId = id;
    this.teacherData = [];
    this.commonService
      .getTeacherAccordingToSchool(schoolId)
      .subscribe((res: any) => {
        this.teacherData = res;
        this.teacherData = this.teacherData.data;
      });
    this.filterChangedTeacher = false;
  }
 
  searchDeviceInfo(...params: any) {
    this.spinner.show();
    const {
      previousSize,
      offset,
      pageSize,
      districtId,
      blockId,
      clusterId,
      schoolId,
      teacherId,
      deviceType,
      uuidImei,
    } = params[0];

    this.paramObj = {
      offset: offset,
      limit: pageSize,
      districtId: districtId,
      blockId: blockId,
      clusterId: clusterId,
      schoolId: schoolId,
      teacherId: teacherId,
      deviceType: deviceType,
      uuidImei: uuidImei,
      serviceType: this.serviceType, 
      userId: this.userId
    };
    this.isLoading = true;
    this.deviceinfoServicesservice.viewDeviceInfo(this.paramObj).subscribe({
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
  getSearchParams() {
    return {
      previousSize: this.previousSize,
      offset: this.offset.toString(),
      pageSize: this.pageSize.toString(),
      districtId: this.DeviceSearchForm?.get("districtId")?.value,
      blockId: this.DeviceSearchForm?.get("blockId")?.value,
      clusterId: this.DeviceSearchForm?.get("clusterId")?.value,
      schoolId: this.DeviceSearchForm?.get("schoolId")?.value,
      teacherId: this.DeviceSearchForm?.get("teacherId")?.value,
      deviceType: this.DeviceSearchForm?.get("deviceType")?.value,
      uuidImei: this.DeviceSearchForm?.get("uuidImei")?.value,
    };
  }
  onPageChange(event: any) {
    this.spinner.show();
    this.isLoading = true;
    //event: PageEvent
    this.pageSize = event.pageSize; // current page size ex: 10
    /**
     * pageIndex starts from 0
     * ex: if pageIndex = 0 then offset = 0 * 10 = 0 and if pageIndex =1 then 1*10 = 10
     */
    this.offset = event.pageIndex * event.pageSize;
    this.previousSize = this.pageSize * event.pageIndex; // set previous size
    this.pageIndex = event.pageIndex;
    this.searchDeviceInfo(this.getSearchParams());
  }
  onSearch() {
    // reset queryParams
    this.pageIndex = 0;
    this.previousSize = 0;
    this.offset = 0;
    this.previousSize = 0;
    this.resultListData.splice(0, this.resultListData.length); // empty current data
    this.dataSource.paginator = this.paginator; // update paginator
    this.searchDeviceInfo(this.getSearchParams());
  }
  deleteDevice(id: any) {
    const users = this.commonService.getUserProfile();
    this.userId = users?.userId;
    this.profileId = users?.profileId;
    this.alertHelper
      .deleteAlert("Are you sure to delete?", "", "question", "Yes, delete it!")
      .then((result) => {
        this.spinner.show();
        if (result.value) {
          this.spinner.show();
          this.spinner.show();
          this.isLoading = true;
          this.deviceinfoServicesservice
            .deleteDeviceInfo(id,this.userId,this.profileId)
            .subscribe({
              next: (res: any) => {
                if (res?.success === true) {
                  this.alertHelper.successAlert(
                    "Deleted!",
                    "Deviceinformation deleted successfully",
                    "success"
                  );
                  this.searchDeviceInfo(this.getSearchParams());
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
                 else{
                  this.spinner.hide();
                 }
      });
  }
  downloadDeviceInfoList()
  {
    this.spinner.show();   
    this.paramObj.serviceType = "Download";

    this.deviceinfoServicesservice.viewDeviceInfo(this.paramObj).subscribe({
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
    this.commonService.printPage(cloneTable, pageTitle);
  }
}
