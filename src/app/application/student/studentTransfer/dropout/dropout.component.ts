import { Component, ElementRef, ErrorHandler, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { ProgressBarMode } from '@angular/material/progress-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { MatTableExporterDirective } from 'mat-table-exporter';
import { NgxSpinnerService } from 'ngx-spinner';
import { SchoolService } from 'src/app/application/school/services/school.service';
import { AlertHelper } from 'src/app/core/helpers/alert-helper';
import { PrivilegeHelper } from 'src/app/core/helpers/privilege-helper';
import { CommonserviceService } from 'src/app/core/services/commonservice.service';
import { Constant } from 'src/app/shared/constants/constant';
import { CustomValidators } from 'src/app/shared/validations/custom-validators';
import { environment } from 'src/environments/environment';
import { StudentInformationService } from '../../services/student-information.service';

@Component({
  selector: 'app-dropout',
  templateUrl: './dropout.component.html',
  styleUrls: ['./dropout.component.css']
})
export class DropoutComponent implements OnInit {
  public fileUrl = environment.filePath;
  public show:boolean = true;
  public buttonName:any = 'Show';
  optionVal:any;
  optionstream:any;
  plPrivilege:string="view"; //For menu privilege
  paramObj: any; 
  serviceType: string = "Search";
  userId:any='';
  adminPrivilege: boolean = false;
  constructor( 
    private formBuilder: FormBuilder,
    private commonService: CommonserviceService,
    private spinner: NgxSpinnerService,
    private alertHelper: AlertHelper,
    private errorHandler: ErrorHandler,
    public customValidators: CustomValidators,
    private el:ElementRef,
    private privilegeHelper: PrivilegeHelper,   //For menu privilege
    private router:Router,
    private activatedRoute:ActivatedRoute,
    private schoolService: SchoolService,
    private studentServices: StudentInformationService) { 
      const users = this.commonService.getUserProfile();
      this.userId = users?.userId;
      const pageUrl:any = this.router.url;  
      this.plPrivilege = this.privilegeHelper.PrimaryLinkPrivilege(pageUrl);  //For menu privilege    
      this.commonService.verifyLinkPermission(pageUrl, this.config.linkType[2], this.config.privilege[1]);  // For authorization
    }

  public userProfile = JSON.parse(
    sessionStorage.getItem("userProfile") || "{}"
  );

  schoolId: any = "";
  config = new Constant();
  academicYear: any = this.config.getAcademicCurrentYear();

  viewTableForm!: FormGroup;
  submitted = false;
  checkAll: boolean = false;
  isChecked: boolean = false;

  /** Search Form Controls Intialization :: Start */

  searchForm!: FormGroup;

    /* Search form control default value set :: start */
    classId: any = "";
    stream: any = "";
    group: any = "";
    section: any = "";
    /* Search form control default value set :: end */
  
    /* Data binding controls :: start */
    anxData: any = [];
  
    classChanged: boolean = false;
    classList: any = [];
    streamChanged: boolean = false;
    streamList: any = [];
    groupChanged: boolean = false;
    groupList: any = [];
    sectionChanged: boolean = false;
    sectionList: any = [];
    /* Data binding controls :: end */

    searchAcademicYear: any = "";
    searchDistrictId: any = "";
    searchBlockId: any = "";
    searchClusterId: any = "";
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
    districtData: any = [];
    getSchoolData: any = [];
    clusterData: any = [];
    
    streamId:any="";
    groupId:any="";
    studentId:any="";
    academicYearStudent:any="";
    streamListModal :any=[];
    groupListModal:any=[];
    subSelected:any=[];
    tagStatusSubject:any="";

    allLabel: string[] = [
      "District",
      "Block",
      "Cluster",
      "School",
      "Class",
      "",
      "",
      ""
    ]

/** Search Form Controls Intialization :: End */

/**  mat table ::start */
pageIndex: any = 0;
previousSize: any = 0;

isLoading = false;
emptyResult: boolean = false;
noFilter: boolean = true;

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
displayedColumns: string[] = [
  "chkAll",
  "slNo",
  "Student Code",
  "Name",
  "Father Name",
  "Mother Name",
  "DOB",
  "Gender",
  "Class",
  "Section",
  "Dropout Date",
  "Transfer Type",
  "Action",
]; // define mat table columns

resultListData: any = [];
questionDetailsData!: any;
dataSource = new MatTableDataSource(this.resultListData);

/** mat table ::end */

  modalTCData!: any;

  ngOnInit(): void {
    if(this.plPrivilege=='admin'){
      this.adminPrivilege = true;
    }
    this.getDistrict();
    this.userProfile = this.commonService.getUserProfile();
    this.schoolId = this.userProfile.school;
    this.loadAnnexturesData();
    if(this.userProfile.school){
      this.getSchoolClasses(this.userProfile.school);
    }
    this.initializeSearchForm();
  }

  initializeSearchForm() {
    this.searchForm = this.formBuilder.group({
      searchDistrictId:[this.searchDistrictId,Validators.required],
      searchBlockId:[this.searchBlockId,Validators.required],
      searchClusterId:[this.searchClusterId,Validators.required],
      searchSchoolId:[this.searchSchoolId,Validators.required],
      classId: [this.classId,Validators.required],
      stream: [this.stream],
      group: [this.group],
      section: [this.section],
      createdBy: [this.userProfile.userId],
      sessionValue: [this.userProfile],
    });
  }

  getDistrict() {
    this.scDisrtictSelect = false;
    this.scDisrtictLoading = true;
    this.commonService.getAllDistrict().subscribe((data: any) => {
      this.scDisrtictLoading = false;
      this.districtData = data;
      this.districtData = this.districtData.data;
      this.getBlock(this.userProfile.district);
      if (this.userProfile.district != 0 || this.userProfile.district != "") {
        this.searchDistrictData = this.districtData.filter((dis: any) => {
          return dis.districtId == this.userProfile.district;
        });
        this.searchForm.controls["searchDistrictId"].patchValue(this.userProfile.district);
      } else {
        this.searchDistrictData = this.districtData;
        this.scDisrtictSelect = true;
      }
      this.searchBlockId = "";
    });
  }

  getBlock(districtId: any) {
    this.scBlockSelect = false;
    this.scBlockLoading = true;

    this.searchBlockData = [];
    this.searchForm.controls["searchBlockId"].patchValue("");

    this.clusterData = [];
    this.searchForm.controls["searchClusterId"].patchValue("");

    this.getSchoolData = [];
    this.searchForm.controls["searchSchoolId"].patchValue("");

    if (districtId !== "") {
      this.commonService
        .getBlockByDistrictid(districtId)
        .subscribe((res: any) => {
          this.scBlockLoading = false;
          this.searchBlockData = res;
          this.searchBlockData = this.searchBlockData.data;

          if (this.userProfile.block != 0 || this.userProfile.block != "") {
            this.searchBlockData = this.searchBlockData.filter((blo: any) => {
              return blo.blockId == this.userProfile.block;
            });
            this.searchForm.controls["searchBlockId"].patchValue(
              this.userProfile.block
            );
            this.getCluster(this.userProfile.block);
          } else {
            this.scBlockSelect = true;
          }
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
    this.searchForm.controls["searchClusterId"].patchValue("");

    this.getSchoolData = [];
    this.searchForm.controls["searchSchoolId"].patchValue("");

    if (blockId !== "") {
      this.commonService.getClusterByBlockId(blockId).subscribe((res: any) => {
        this.scClusterLoading = false;
        this.clusterData = res;
        this.clusterData = this.clusterData.data;

        if (this.userProfile.cluster != 0 || this.userProfile.cluster != "") {
          this.clusterData = this.clusterData.filter((clu: any) => {
            return clu.clusterId == this.userProfile.cluster;
          });
          this.searchForm.controls["searchClusterId"].patchValue(
            this.userProfile.cluster
          );
          this.getSchool(this.userProfile.cluster);
        } else {
          this.scClusterSelect = true;
        }
      });
    } else {
      this.scClusterSelect = true;
      this.scClusterLoading = false;
    }
  }

  getSchool(clusterId: any) {
    this.scSchoolSelect = false;
    this.scSchoolLoading = true;

    this.getSchoolData = [];
    this.searchForm.controls["searchSchoolId"].patchValue("");

    if (clusterId !== "") {
      this.commonService.getSchoolList(clusterId).subscribe((res: any) => {
        this.getSchoolData = res;
        this.getSchoolData = this.getSchoolData.data;

        if (this.userProfile.udiseCode != 0 || this.userProfile.udiseCode != "") {
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

  classControlChange(val: any) {
    this.classId = val;
    if (this.classId !== "") {
      let param = {
        schoolId: this.userProfile.school,
        classId: this.classId,
        academicYear: this.academicYear,
      };
      this.getSection(param);
    }
  }

  streamControlChange(val: any) {
    this.stream = val;
  }

  getSection(param: any) {
    this.sectionChanged = true;
    this.schoolService.getSection(param).subscribe((res: any) => {
      this.sectionList = res.data.sections;
      this.sectionChanged = false;
    });
  }

  loadAnnexturesData() {
    const anxTypes = ["STREAM_TYPE", "STREAM_GROUP_TYPE"];
    // this.anxData = this.commonFunction.getAnnextureData(anxTypes);
    let annextureData!: [];
    this.commonService.getCommonAnnexture(anxTypes).subscribe({
      next: (res: any) => {
        annextureData = res?.data;
        this.streamList = res?.data?.STREAM_TYPE;
        this.groupList = res?.data?.STREAM_GROUP_TYPE;
        this.streamList.forEach((value:any) => {
          this.streamListModal[value.anxtValue] = value.anxtName;                
        });
        this.groupList.forEach((value:any) => {
          this.groupListModal[value.anxtValue] = value.anxtName;                
        });
      },
    });
  }

  getSchoolClasses(schoolEncId: string) {
    this.classChanged = true;
    if (schoolEncId !== "") {
      this.schoolService
        .getSchoolClasses(schoolEncId)
        .subscribe((res: any = []) => {
          this.classList = res.data;
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
          this.classList = res.data;
          this.classChanged = false;
        });
    }
  }

  onSearch(){
    if ("INVALID" === this.searchForm.status) {
      for (const key of Object.keys(this.searchForm.controls)) {
        if (this.searchForm.controls[key].status === "INVALID") {
          const invalidControl = this.el.nativeElement.querySelector(
            '[formControlName="' + key + '"]'
          );
          invalidControl.focus();
          this.customValidators.formValidationHandler(this.searchForm,this.allLabel);
          break;
        }
      }
    }
    if (this.searchForm.valid === true) {
      this.noFilter = false;

      // reset queryParams
      this.pageIndex = 0;
      this.previousSize = 0;
      this.offset = 0;
      this.previousSize = 0;
      this.resultListData.splice(0, this.resultListData.length); // empty current data
      this.dataSource.paginator = this.paginator; // update paginator
      this.loadData(this.getSearchParams());
    }
  }

  loadData(...params: any) {
    const {
      previousSize,
      offset,
      pageSize,
      searchDistrictId,
      searchBlockId,
      searchClusterId,
      searchSchoolId,
      classId,
      stream,
      group,
      section,
    } = params[0];

    this.paramObj = {
      offset: offset,
      limit: pageSize,
      serviceType: this.serviceType, 
      userId: this.userId,
      searchDistrictId: searchDistrictId,
      searchBlockId: searchBlockId,
      searchClusterId: searchClusterId,
      searchSchoolId: searchSchoolId,
      classId: classId,
      stream: stream,
      group: group,
      section: section,
      schoolEncId:this.schoolId,
      academicYear:this.academicYear
    };

    this.isLoading = true;

    this.studentServices.dropoutList(this.paramObj).subscribe({
      next: (res: any) => {
        this.resultListData.length = previousSize; // set current size
        res?.success === true && this.resultListData.push(...res?.data); // merge with existing data
        this.resultListData.length = res?.totalRecord; // update length
        this.dataSource.paginator = this.paginator; // update paginator
        this.dataSource._updateChangeSubscription(); // update table
        this.isLoading = false;
        this.emptyResult = this.resultListData.length ? false : true;
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
      searchDistrictId: this.searchDistrictId,
      searchBlockId: this.searchBlockId,
      searchClusterId: this.searchClusterId,
      searchSchoolId: this.searchForm?.get("searchSchoolId")?.value,
      // classId: this.classId,
      // stream: this.stream,
      // group: this.group,
      // section: this.section,
      classId: this.searchForm?.get("classId")?.value,
      stream: this.searchForm?.get("stream")?.value,
      group: this.searchForm?.get("group")?.value,
      section: this.searchForm?.get("section")?.value,
    };
  }
  //Csv Function
  downloadDropOutList()
  {
    this.spinner.show();   
    this.paramObj.serviceType = "Download";

    this.studentServices.dropoutList(this.paramObj).subscribe({
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
  //End
   //print function
   printPage() {
    let cloneTable 	= document.getElementById("viewTable")?.innerHTML;
    const pageTitle = document.querySelector(".pageName")?.innerHTML;
    this.commonService.printPage(cloneTable, pageTitle);
  }
  //End

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
    this.loadData(this.getSearchParams());
  }

  toggle() {
    this.show = !this.show;
    if(this.show)  
      this.buttonName = "Hide";
    else
      this.buttonName = "Show";
  }

  TCInfo(stdEncId:any,transferId:any){
    this.spinner.show();
    const paramObj = {
      stdEncId: stdEncId,
      transferId: transferId,
      schoolEncId:this.schoolId,
      academicYear:this.academicYear
    };
    this.studentServices.getTCInfo(paramObj).subscribe({
      next: (res: any) => {
        this.modalTCData = res?.data;    
        this.spinner.hide();
      },
      error: (error: any) => {
        this.isLoading = false;
        this.spinner.hide();
      },
    });
  }

}
