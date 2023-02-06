import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
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
import { CustomValidators } from 'src/app/shared/validations/custom-validators';
import { environment } from 'src/environments/environment';
import { SchoolService } from '../../school/services/school.service';
import { SmartClassService } from '../services/smart-class.service';
import { StudentMarkService } from '../services/student-mark.service';

@Component({
  selector: 'app-view-student-mark',
  templateUrl: './view-student-mark.component.html',
  styleUrls: ['./view-student-mark.component.css']
})

export class ViewStudentMarkComponent implements OnInit {
  paramObj: any;
  serviceType: string = "Search";
  public fileUrl = environment.filePath;
  public show:boolean = true;
  public buttonName:any = 'Show';
  emptyResult: boolean = false;
  noFilter: boolean = true;

  config = new Constant();
  loginUserType: any = "";
  clusterName: any = "";
  schoolName: any = "";
  blockName: any = "";
  districtName: any = "";
  villageName: any = "";
  schoolUdiseCode: any = "";
  schoolInfoData: any;
  academicYear: any = this.config.getAcademicCurrentYear();
  userId: any = "";
  schoolId: any;
  
  streamLoad: boolean = false;
  groupLoad: boolean = false;
  classLoad: boolean = false;
  sectionLoad: boolean = false;

  classData: any;
  streamData: any;
  groupData: any;
  sectionData: any;
  studentData: any;
  subListingData: any;

  public userProfile = JSON.parse(
    sessionStorage.getItem("userProfile") || "{}"
  );

    /* Search form control default value set :: start */
    studentMarkSearchForm!: FormGroup;
    classId: any = "";
    sectionId: any = "";
    streamId: any = "";
    groupId: any = "";
    examType: any = "";
    /* Search form control default value set :: end */
  
    /* Data binding controls :: start */
    anxData: any = [];
    classAnnextureData: any = [];
  
    classChanged: boolean = false;
    classList: any = [];
    streamChanged: boolean = false;
    streamList: any = [];
    groupChanged: boolean = false;
    groupList: any = [];
    sectionChanged: boolean = false;
    sectionList: any = [];
    examTypeData: any = [];
    /* Data binding controls :: end */

    searchAcademicYear: any = this.academicYear;
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
    
    studentId:any="";
    academicYearStudent:any="";
    streamListModal :any=[];
    groupListModal:any=[];
    subSelected:any=[];
    tagStatusSubject:any="";

    allLabelForSearchForm: string[] = [
      "Academic year",
      "District",
      "Block",
      "Cluster",
      "School",
      "Exam type",
      "Class",
      "Section",
      "Stream",
      "Group",
    ];
  

  
  isStudentData: boolean = false;
  submitted: boolean = false;


  viewTableForm!: FormGroup;

  pageIndex: any = 0;
  previousSize: any = 0;

  isLoading = false;

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
   displayedColumns: string[] = []; // define mat table columns
 
   resultListData: any = [];
   questionDetailsData!: any;
   dataSource = new MatTableDataSource(this.resultListData);
   //end
   plPrivilege:string="view"; //For menu privilege
   adminPrivilege: boolean = false;
  constructor(
    private commonService: CommonserviceService,
    private privilegeHelper: PrivilegeHelper,   //For menu privilege
    private router:Router,
    private spinner: NgxSpinnerService,
    private schoolService: SchoolService,
    private formBuilder: FormBuilder,
    public customValidators: CustomValidators,
    private alertHelper: AlertHelper,
    private smartClassService: SmartClassService,
    private studentMarkService: StudentMarkService
  ) {const pageUrl:any = this.router.url;  
    this.plPrivilege = this.privilegeHelper.PrimaryLinkPrivilege(pageUrl);  //For menu privilege    
    this.commonService.verifyLinkPermission(pageUrl, this.config.linkType[2], this.config.privilege[1]);  // For authorization
   }

  ngOnInit(): void {
    if(this.plPrivilege=='admin'){
      this.adminPrivilege = true;
      this.displayedColumns = [
        "chkAll",
        "slNo",
        "Student Code",
        "Student Name",
        "Father Name",
        "Mother Name",
        "Class",
        "Total Mark",
        "Secured Mark",
        "Action",
      ]; 
    } else {
      this.displayedColumns = [
        "chkAll",
          "slNo",
          "Student Code",
          "Student Name",
          "Father Name",
          "Mother Name",
          "Class",
          "Total Mark",
          "Secured Mark",
      ]; 
    }
    const userProfile = this.commonService.getUserProfile();
    this.schoolId = userProfile?.school;
    this.userId = userProfile?.userId;
    this.loginUserType = userProfile?.loginUserType;
    this.getDistrict();
    if (this.loginUserType == "SCHOOL") {
      this.getSchoolInfo();
      this.getClass(this.schoolId);
    } else {
    }
    if (this.schoolId !== 0 && this.schoolId !== "") {
      // this.getSchoolInfo(this.schoolId, this.academicYear);
      // this.getClass();
    }
    this.getExamTypeData();
    this.initializeFormForSearch();
   // this.loadData(this.getSearchParams());
  }

  initializeFormForSearch() {
    this.studentMarkSearchForm = this.formBuilder.group({
      searchAcademicYear:[this.searchAcademicYear],
      searchDistrictId:[this.searchDistrictId,Validators.required],
      searchBlockId:[this.searchBlockId,Validators.required],
      searchClusterId:[this.searchClusterId,Validators.required],
      searchSchoolId:[this.searchSchoolId,Validators.required],
      examType: [this.examType, Validators.required],
      classId: [this.classId, Validators.required], 
      sectionId : [this.sectionId],
      streamId: [this.streamId],
      groupId: [this.groupId],
      userId: [this.userId],
      //schoolId: [this.schoolId],
      academicYear: [this.academicYear],
    });
  }

  getSchoolInfo(){
    this.spinner.show();
    this.commonService
    .getSchoolBasicInfo(
      {encId:this.userProfile.school,academicYear:this.academicYear}
    ).subscribe((res:any=[])=>{
    this.schoolInfoData = res.data;
    this.districtName = this.schoolInfoData?.districtName;
    this.blockName = this.schoolInfoData?.blockName;
    this.clusterName = this.schoolInfoData?.clusterName;
    this.villageName = this.schoolInfoData?.villageName;
    this.schoolName = this.schoolInfoData?.schoolName;
    this.schoolUdiseCode = this.schoolInfoData?.schoolUdiseCode;
    this.spinner.hide();
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
        this.studentMarkSearchForm.controls["searchDistrictId"]?.patchValue(this.userProfile.district);
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
    this.studentMarkSearchForm.controls["searchBlockId"]?.patchValue("");

    this.clusterData = [];
    this.studentMarkSearchForm.controls["searchClusterId"]?.patchValue("");

    this.getSchoolData = [];
    this.studentMarkSearchForm.controls["searchSchoolId"]?.patchValue("");

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
            this.studentMarkSearchForm.controls["searchBlockId"]?.patchValue(
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
    this.studentMarkSearchForm.controls["searchClusterId"]?.patchValue("");

    this.getSchoolData = [];
    this.studentMarkSearchForm.controls["searchSchoolId"]?.patchValue("");

    if (blockId !== "") {
      this.commonService.getClusterByBlockId(blockId).subscribe((res: any) => {
        this.scClusterLoading = false;
        this.clusterData = res;
        this.clusterData = this.clusterData.data;

        if (this.userProfile.cluster != 0 || this.userProfile.cluster != "") {
          this.clusterData = this.clusterData.filter((clu: any) => {
            return clu.clusterId == this.userProfile.cluster;
          });
          this.studentMarkSearchForm.controls["searchClusterId"]?.patchValue(
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
    this.studentMarkSearchForm.controls["searchSchoolId"]?.patchValue("");

    if (clusterId !== "") {
      this.commonService.getSchoolList(clusterId).subscribe((res: any) => {
        this.getSchoolData = res;
        this.getSchoolData = this.getSchoolData.data;

        if (this.userProfile.udiseCode != 0 || this.userProfile.udiseCode != "") {
          this.getSchoolData = this.getSchoolData.filter((sch: any) => {
            return sch.schoolUdiseCode == this.userProfile.udiseCode;
          });
          this.studentMarkSearchForm.controls["searchSchoolId"]?.patchValue(
            this.getSchoolData[0]?.schoolId
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
    this.classLoad = true;
    if (schoolId !== "") {
      this.schoolService
        .getSchoolWiseClasses(schoolId)
        .subscribe((res: any = []) => {
          this.classData = res.data;
          
        });
    }
    this.classLoad = false;
  }

  examTypeChange(val: any) {
    this.studentMarkSearchForm.patchValue({
      streamId: "",
    });
    this.studentMarkSearchForm.patchValue({
      groupId: "",
    });
    this.studentMarkSearchForm.patchValue({
      classId: "",
    });
    this.studentMarkSearchForm.patchValue({
      sectionId: "",
    });
    this.classId = "";
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
    this.studentMarkSearchForm.patchValue({
      streamId: "",
    });
    this.studentMarkSearchForm.patchValue({
      groupId: "",
    });
    this.studentMarkSearchForm.patchValue({
      sectionId: "",
    });
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
  getClass(schoolEncId: string) {
    if (schoolEncId !== "") {
      this.schoolService
        .getSchoolClasses(schoolEncId)
        .subscribe((res: any = []) => {
          this.classAnnextureData = res.data;    
        });
    }

  }

  classChange(val: any) {
    this.studentMarkSearchForm.patchValue({streamId: "",});
    this.studentMarkSearchForm.patchValue({groupId: "",});
    this.studentMarkSearchForm.patchValue({sectionId: "",});
    this.classId = val;

    if (this.classId !== "") {
      this.getSection(this.classId, this.schoolId, this.academicYear);
      if (this.classId == 11 || this.classId == 12) {
        this.getStream();
      }
    } else {
      this.studentMarkSearchForm.patchValue({classId: "",});
      this.studentMarkSearchForm.patchValue({streamId: "",});
      this.studentMarkSearchForm.patchValue({sectionId: "",});
    }
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

  getSection(classId: any, schoolId: any, academicYear: any) {
    this.sectionLoad = true;
    this.smartClassService
      .getSection(classId, schoolId, academicYear)
      .subscribe((data: any = []) => {
        this.sectionData = data;
        this.sectionData = this.sectionData.data["sections"];
      });
      this.sectionLoad = false;
  }

  streamChange(val: any) {
    this.studentMarkSearchForm.patchValue({
      groupId: "",
    });
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

  searchStudentMark(){
    this.submitted = true;
    this.customValidators.formValidationHandler(this.studentMarkSearchForm,this.allLabelForSearchForm);
    if(this.studentMarkSearchForm.valid === true){
      this.spinner.show();
      this.studentMarkService
        .viewStudentMark(this.studentMarkSearchForm.value)
        .subscribe((data: any = []) => {
          this.studentData = data?.data;
          var result = Object.keys(this.studentData).map(
            (key) => this.studentData[key]
          );
          if (result?.length) {
            //this.isStudentData = true;
            this.spinner.hide();
          } else {
            //this.isStudentData = false;
            //this.initializeForm();
          }
        });
    }
  }

  toggle() {
    this.show = !this.show;
    if(this.show)  
      this.buttonName = "Hide";
    else
      this.buttonName = "Show";
  }

  onSearch() {
    this.submitted = true;
    this.customValidators.formValidationHandler(this.studentMarkSearchForm,this.allLabelForSearchForm);
    if(this.studentMarkSearchForm.valid === true){
      this.noFilter=false;
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
      userId,
      schoolId,
      academicYear,
      classId,
      streamId,
      groupId,
      examType,
      sectionId,
    } = params[0];

    this.paramObj = {
      offset: offset,
      limit: pageSize,
      userId: userId,
      schoolId: schoolId,
      academicYear: academicYear,
      classId: classId,
      streamId: streamId,
      groupId: groupId,
      examType: examType,
      sectionId: sectionId,
      serviceType:this.serviceType
    };

    this.isLoading = true;
    this.spinner.show();
    this.studentMarkService.viewStudentMark(this.paramObj).subscribe({
      next: (res: any) => {
        this.spinner.hide();
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
      userId: this.userId,
      schoolId: this.schoolId,
      academicYear: this.academicYear,
      classId: this.studentMarkSearchForm?.controls["classId"].value, 
      streamId: this.studentMarkSearchForm?.controls["streamId"].value,
      groupId: this.studentMarkSearchForm?.controls["groupId"].value,
      examType: this.studentMarkSearchForm?.controls["examType"].value,
      sectionId : this.studentMarkSearchForm?.controls["sectionId"].value,
    };
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

  checkUncheckAll() {
    this.resetFormArray();
    if (this.viewTableForm.get("checkAll")?.value !== true) {
      const checkRecordArr: FormArray = this.viewTableForm.get(
        "checkRecordArr"
      ) as FormArray;
      this.resultListData.forEach((eachdata: any) => {
        checkRecordArr.push(new FormControl(eachdata.studentId));
        eachdata.isChecked = true;
      });
    }
  }

  onCheckboxChange(e: any) {
    const checkRecordArr: FormArray = this.viewTableForm.get(
      "checkRecordArr"
    ) as FormArray;
    if (e.target.checked) {
      checkRecordArr.push(new FormControl(e.target.value));
    } else {
      this.viewTableForm.get("checkAll")?.setValue(false);
      let i: number = 0;
      checkRecordArr.controls.forEach((item: any) => {
        if (item.value == e.target.value) {
          checkRecordArr.removeAt(i);
          return;
        }
        i++;
      });
    }
  }

  resetFormArray() {
    this.resultListData.forEach((eachdata: any) => {
      eachdata.isChecked = false;
    });
    (this.viewTableForm.get("checkRecordArr") as FormArray).clear();
  }

  deleteMultipleStudents() {
    this.submitted = true;
    const checkRecordArr: FormArray = this.viewTableForm.get(
      "checkRecordArr"
    ) as FormArray;
    if (checkRecordArr.controls.length < 1) {
      this.alertHelper.viewAlertHtml(
        "error",
        "Invalid",
        "Select atleast one record"
      );
      return;
    }
    // if (this.viewTableForm.valid == true) {
    //   this.alertHelper.submitAlert().then((result) => {
    //     if (result.value) {
    //       this.spinner.show();
    //       this.studentServices
    //         .deleteMultipleStudent(this.viewTableForm.value)
    //         .subscribe({
    //           next: (res: any) => {
    //             this.spinner.hide();
    //             this.alertHelper
    //               .successAlert(
    //                 "Deleted!",
    //                 "Student records deleted successfully.",
    //                 "success"
    //               )
    //               .then(() => {
    //                 this.resetFormArray();
    //                 this.initializeviewTableForm();
    //                 this.loadData(this.getSearchParams());
    //               });
    //           },
    //           error: (error: any) => {
    //             this.spinner.hide(); //==== hide spinner
    //             let errorMessage: string = "";
    //             if (typeof error.error.msg === "string") {
    //               errorMessage +=
    //                 '<i class="bi bi-arrow-right text-danger"></i> ' +
    //                 error.error.msg +
    //                 `<br>`;
    //             } else {
    //               error.error.msg.map(
    //                 (message: string) =>
    //                   (errorMessage +=
    //                     '<i class="bi bi-arrow-right text-danger"></i> ' +
    //                     message +
    //                     `<br>`)
    //               );
    //             }
    //             this.alertHelper.viewAlertHtml(
    //               "error",
    //               "Invalid inputs",
    //               errorMessage
    //             );
    //           },
    //         });
    //     }
    //   });
    // }
  }
  printPage() {
    let cloneTable = document.getElementById("viewTable")?.innerHTML;
    const pageTitle = document.querySelector(".pageName")?.innerHTML;
    this.commonService.printPage(cloneTable, pageTitle);
  }
  downLoadMarkList() {
    this.spinner.show();
    this.paramObj.serviceType = "Download";
    this.studentMarkService.viewStudentMark(this.paramObj).subscribe({
      next: (res: any) => {
        console.log(res);        
        let filepath = this.fileUrl + "/" + res.data.replace(".", "~");
        window.open(filepath);
        this.spinner.hide();
      },
      error: (error: any) => {
        this.spinner.hide();
      },
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
