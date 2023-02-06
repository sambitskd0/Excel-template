import { ThisReceiver } from '@angular/compiler';
import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { ProgressBarMode } from '@angular/material/progress-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatTableExporterDirective } from 'mat-table-exporter';
import { NgxSpinnerService } from 'ngx-spinner';
import { CommonserviceService } from 'src/app/core/services/commonservice.service';
import { Constant } from 'src/app/shared/constants/constant';
import { CustomValidators } from 'src/app/shared/validations/custom-validators';
import { SchoolService } from '../../school/services/school.service';
import { StudentInformationService } from '../services/student-information.service';
// declare var $:any;
@Component({
  selector: 'app-progress-report-card',
  templateUrl: './progress-report-card.component.html',
  styleUrls: ['./progress-report-card.component.css']
})
export class ProgressReportCardComponent implements OnInit {
  paramObj: any;
  serviceType: string = "Search";
  public show:boolean = true;
  public buttonName:any = 'Show';
  /** Search Form Controls Intialization :: Start */

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
  schoolId: any = "";
  userId: any = "";
  allLabel: string[] = [
    "District",
    "Block",
    "Cluster",
    "School",
    "Class",
    "Stream",
    "Group",
    "Section",
    "StudentCode",
    "AdmissionNo",
  ]

/** Search Form Controls Intialization :: End */
public userProfile = JSON.parse(
  sessionStorage.getItem("userProfile") || "{}"
);
classChanged: boolean = false;
  classList: any = [];
  streamChanged: boolean = false;
  streamList: any = [];
  groupChanged: boolean = false;
  groupList: any = [];
  sectionChanged: boolean = false;
  sectionList: any = [];
  studentCode: any = "";
  admissionNo: any = "";
  classId: any = "";
  stream: any = "";
  group: any = "";
  section: any = "";
  config = new Constant();
  academicYear: any = this.config.getAcademicCurrentYear();
  schlInfo: any = [];
  stdSearchForm!: FormGroup;
  pageIndex: any = 0;
  previousSize: any = 0;

  isLoading = false;
  emptyResult: boolean = false;
  noFilter: boolean = true;
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
  displayedColumns: string[] = [    
    "slNo",
    "Student Name",
    "Class",
    "Section",
    "Student Code",
    "Admission No",
    "Status",
    
  ]; // define mat table columns

  resultListData: any = [];
  questionDetailsData!: any;
  dataSource = new MatTableDataSource(this.resultListData)

  modalReportCardData!: any;
  constructor(private formBuilder: FormBuilder,
    private commonService: CommonserviceService,    
    public  customValidators: CustomValidators,
    private schoolService: SchoolService,
    private spinner: NgxSpinnerService,
    private el:ElementRef,
    private studentServices: StudentInformationService,
   ) { }

  ngOnInit(): void {
    // $("#fiveclassprint").modal({backdrop: false});
    // $("#eightclassprint").modal({backdrop: false});
    this.getDistrict();
    this.userProfile = this.commonService.getUserProfile();
    this.schoolId = this.userProfile.school;
    this.userId   =this.userProfile?.userId;
    this.loadAnnexturesData();
    this.getSchoolInfo();
    if(this.userProfile.school){
      this.getSchoolClasses(this.userProfile.school);
    }
    this.initializeForm();
  }
  initializeForm() {
    this.stdSearchForm = this.formBuilder.group({
      searchDistrictId:[this.searchDistrictId,Validators.required],
      searchBlockId:[this.searchBlockId,Validators.required],
      searchClusterId:[this.searchClusterId,Validators.required],
      searchSchoolId:[this.searchSchoolId,Validators.required],
      classId: [this.classId,Validators.required],
      stream: [this.stream],
      group: [this.group],
      section: [this.section],
      studentCode: [this.studentCode,[Validators.pattern(/^[0-9]+$/),Validators.maxLength(15)]],
      admissionNo: [this.admissionNo],
      createdBy: [this.userProfile.userId],
      sessionValue: [this.userProfile],
    });
  }
  onSearch(){
    
    if ("INVALID" === this.stdSearchForm.status) {
      for (const key of Object.keys(this.stdSearchForm.controls)) {
        if (this.stdSearchForm.controls[key].status === "INVALID") {
          const invalidControl = this.el.nativeElement.querySelector(
            '[formControlName="' + key + '"]'
          );
          invalidControl?.focus();
          this.customValidators.formValidationHandler(this.stdSearchForm,this.allLabel);
          break;
        }
      }
    }
    if (this.stdSearchForm.valid === true) {
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
      admissionNo,
      studentCode,
      classId,
      stream,
      group,
      section,
    } = params[0];

    this.paramObj = {
      offset: offset,
      limit: pageSize,
      searchDistrictId: searchDistrictId,
      searchBlockId: searchBlockId,
      searchClusterId: searchClusterId,
      searchSchoolId: searchSchoolId,
      studentCode: studentCode,
      admissionNo: admissionNo,
      classId: classId,
      stream: stream,
      group: group,
      section: section,
      schoolEncId:this.schoolId,
      serviceType:this.serviceType,
      userId: this.userId,
      academicYear:this.academicYear
    };

    this.isLoading = true;
    this.spinner.show(); 
    this.studentServices.viewStudentListReoprtCard(this.paramObj).subscribe({
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
      searchDistrictId: this.stdSearchForm?.get("searchDistrictId")?.value,
      searchBlockId: this.stdSearchForm?.get("searchBlockId")?.value,
      searchClusterId:this.stdSearchForm?.get("searchClusterId")?.value,
      searchSchoolId:this.stdSearchForm?.get("searchSchoolId")?.value,
      studentCode: this.stdSearchForm?.get("studentCode")?.value,
      admissionNo: this.stdSearchForm?.get("admissionNo")?.value,
      classId: this.stdSearchForm?.get("classId")?.value,
      stream: this.stdSearchForm?.get("stream")?.value,
      group: this.stdSearchForm?.get("group")?.value,
      section: this.stdSearchForm?.get("section")?.value,
    };
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
        this.stdSearchForm.controls["searchDistrictId"].patchValue(
          this.userProfile.district
        );
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
    this.stdSearchForm.controls["searchBlockId"].patchValue("");

    this.clusterData = [];
    this.stdSearchForm.controls["searchClusterId"].patchValue("");

    this.getSchoolData = [];
    this.stdSearchForm.controls["searchSchoolId"].patchValue("");

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
            this.stdSearchForm.controls["searchBlockId"].patchValue(
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
    this.stdSearchForm.controls["searchClusterId"].patchValue("");

    this.getSchoolData = [];
    this.stdSearchForm.controls["searchSchoolId"].patchValue("");

    if (blockId !== "") {
      this.commonService.getClusterByBlockId(blockId).subscribe((res: any) => {
        this.scClusterLoading = false;
        this.clusterData = res;
        this.clusterData = this.clusterData.data;

        if (this.userProfile.cluster != 0 || this.userProfile.cluster != "") {
          this.clusterData = this.clusterData.filter((clu: any) => {
            return clu.clusterId == this.userProfile.cluster;
          });
          this.stdSearchForm.controls["searchClusterId"].patchValue(
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
    this.stdSearchForm.controls["searchSchoolId"].patchValue("");

    if (clusterId !== "") {
      this.commonService.getSchoolList(clusterId).subscribe((res: any) => {
        this.getSchoolData = res;
        this.getSchoolData = this.getSchoolData.data;

        if (this.userProfile.udiseCode != 0 || this.userProfile.udiseCode != "") {
          this.getSchoolData = this.getSchoolData.filter((sch: any) => {
            return sch.schoolUdiseCode == this.userProfile.udiseCode;
          });
          this.stdSearchForm.controls["searchSchoolId"].patchValue(
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
  getSchoolInfo() {
    this.spinner.show();
    this.commonService
      .getSchoolBasicInfo({
        encId: this.userProfile.school,
        academicYear: this.academicYear,
      })
      .subscribe((res: any = []) => {
        this.spinner.hide();
        this.schlInfo = res.data;
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

  reportCard(stdEncId:any){
    this.spinner.show();
    const paramObj = {
      stdEncId: stdEncId,
      schoolEncId:this.schoolId,
      schoolId:this.stdSearchForm?.get("searchSchoolId")?.value,
      stdClassId: this.stdSearchForm?.get("classId")?.value,
      academicYear:this.academicYear
    };
    this.studentServices.getReportCard(paramObj).subscribe({
      next: (res: any) => {
        this.modalReportCardData = res?.data;  
        this.modalReportCardData['school'] = this.userProfile?.school;    
        this.spinner.hide();
      },
      error: (error: any) => {
        this.isLoading = false;
        this.spinner.hide();
      },
    });
  }
}
