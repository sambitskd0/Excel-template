import { Component, ElementRef, ErrorHandler, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { AlertHelper } from 'src/app/core/helpers/alert-helper';
import { PrivilegeHelper } from 'src/app/core/helpers/privilege-helper';
import { CommonserviceService } from 'src/app/core/services/commonservice.service';
import { Constant } from 'src/app/shared/constants/constant';
import { CustomValidators } from 'src/app/shared/validations/custom-validators';
import { SchoolService } from '../../school/services/school.service';
import { StudentInformationService } from '../services/student-information.service';

@Component({
  selector: 'app-progression',
  templateUrl: './progression.component.html',
  styleUrls: ['./progression.component.css']
})
export class ProgressionComponent implements OnInit {

  constructor( 
    private formBuilder: FormBuilder,
    private commonService: CommonserviceService,
    private schoolService: SchoolService,
    private spinner: NgxSpinnerService,
    private alertHelper: AlertHelper,
    private errorHandler: ErrorHandler,
    public customValidators: CustomValidators,
    private el:ElementRef,
    private privilegeHelper: PrivilegeHelper,   //For menu privilege
    private router:Router,
    private activatedRoute:ActivatedRoute,
    private studentServices: StudentInformationService) { }

  optionVal:any;
  optionstream:any;

  public userProfile = JSON.parse(
    sessionStorage.getItem("userProfile") || "{}"
  );

  schoolId: any = "";
  config = new Constant();
  academicYear: any = this.config.getAcademicCurrentYear();

  /** Search Form Controls Intialization :: Start */

  searchForm!: FormGroup;

  /* Search form control default value set :: start */
  studentCodeName: any = "";
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
    "Academic Year",
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

  clsPS :any = "";
  studentData:any = [];
  emptyResult   = false;
  isStudentData = false;
  noFilter: boolean = true;
  progressionStatus : any = {1:"Promoted", 4:"Promoted, moved to other school", 6:"Passout", 3:"Repeater"};
  markData:any = [];
  secData:any  = [];

   /** Student Progression Form Controls Intialization :: Start */
   stdProgressionForm!: FormGroup;
   checkAll: boolean = false;
   selectedStudentData: any = [];
   submitted: boolean = false;
   markLabels: any[] = this.getCustomizedLabelName("");
   progressionBtnEnable : boolean = true;

   pgOptions: any = [];
   /** Student Progression Form Controls Intialization :: End */


  ngOnInit(): void {
    let curMonth = (new Date().getMonth() + 1);
    if(curMonth>=3 && curMonth<=5){
      this.progressionBtnEnable = true;
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
      academicYear: [this.academicYear],
      searchDistrictId:[this.searchDistrictId,Validators.required],
      searchBlockId:[this.searchBlockId,Validators.required],
      searchClusterId:[this.searchClusterId,Validators.required],
      searchSchoolId:[this.searchSchoolId,Validators.required],
      classId: [this.classId,Validators.required],
      stream: [this.stream],
      group: [this.group],
      section: [this.section],
      studentCodeName: [this.studentCodeName],
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
      //console.log(this.section);
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
        //console.log(res);
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
    this.noFilter = false;
    // if ("INVALID" === this.searchForm.status) {
    //   for (const key of Object.keys(this.searchForm.controls)) {
    //     if (this.searchForm.controls[key].status === "INVALID") {
    //       const invalidControl = this.el.nativeElement.querySelector(
    //         '[formControlName="' + key + '"]'
    //       );
    //       invalidControl.focus();
    //       this.customValidators.formValidationHandler(this.searchForm,this.allLabel);
    //       break;
    //     }
    //   }
    // }
    if(this.searchForm.invalid){
      this.customValidators.formValidationHandler(
        this.searchForm,
        this.allLabel,
        this.el
      );
    } 
    if (this.searchForm.valid === true) {
      this.spinner.show();
      this.studentServices.getStudentsProgressionList(this.searchForm.value)
        .subscribe((data: any = []) => {
          this.spinner.hide();
          this.initializeForm();  
          this.studentData = data?.data;
          var result = Object.keys(this.studentData).map(
            (key) => this.studentData[key]
          );
          if (result?.length) {
            this.clsPS = this.classId;
            this.isStudentData = true;
            this.emptyResult = false;            
            result.map((item: any, stdIndex: number) => {
              // console.log(item);
              let selectedStatus:any = '';

              if(this.clsPS<8){
                selectedStatus = 2;
              }/*else if(this.classList[this.classList.length-1].classId <= 8 && this.classList[this.classList.length-1].classId == this.clsPS){
                selectedStatus = 4;
              }*/else if(this.classList[this.classList.length-1].classId == this.clsPS){
                selectedStatus = 4;
              }

              let newCls = '';
              if(selectedStatus == 2 || selectedStatus == 4){ // incase of promoted and promoted to other school
                newCls = 'Class '+(parseInt(this.clsPS)+1);
              }

              if(item.progressionStatus>1){
                selectedStatus = item.progressionStatus;
              }

              this.studentInfo().push(
                this.formBuilder.group({
                  checkItem: [false],
                  studentId : [item.stdEncId],
                  progressionStatus : [selectedStatus,Validators.required],
                  newClass : [
                    {
                      value: newCls,
                      disabled: true,
                    },
                  ],
                  promotedSection : [item.section],
                })
              );
            });

            console.log(this.studentInfo());
            

          } else {
            this.emptyResult = true;
            this.isStudentData = false;
          }

          
        });
    }
  }

  markDetails(stdEncId:any){
    this.spinner.show();
    const paramObj = {
      stdEncId:stdEncId,
      academicYear:this.academicYear,
      classId: this.classId
    };
    this.studentServices.markDetails(paramObj)
        .subscribe((data: any = []) => {
          this.section = this.searchForm.controls["searchBlockId"].value;
          this.spinner.hide();
          this.sectionList.forEach((value:any) => {
            if(value.anxtValue>0){
              this.secData[value.anxtValue] = value.anxtName; 
            }               
          });
          this.markData = data?.data;
        });
  }

  initializeForm() {
    this.stdProgressionForm = this.formBuilder.group({
      stdProgressionArray: this.formBuilder.array([]),
      checkAll: [this.checkAll],
    });
  }

  studentInfo(): FormArray {
    return this.stdProgressionForm.get("stdProgressionArray") as FormArray;
  }

  checkUncheckAll() {
    //this.resetFormArray();
    const stdControls: FormArray = this.stdProgressionForm.get(
      "stdProgressionArray"
    ) as FormArray;
    if (this.stdProgressionForm.get("checkAll")?.value !== true) {
      let checkItem = true;
      stdControls.controls?.map((item: any, stdIndex: any) => {
        item.get("checkItem")?.patchValue(checkItem);
      });
    } else {
      let checkItem = false;
      stdControls.controls?.map((item: any, stdIndex: any) => {
        item.get("checkItem")?.patchValue(checkItem);
      });
    }
  }


  validateStdProgression(): any {
    let allErrors: any = [];
    const stdControls = this.stdProgressionForm.get("stdProgressionArray") as FormArray;
    stdControls.controls?.map((item: any, stdIndex: any) => {
      if (item?.controls?.checkItem.value == true) {
          this.markLabels = this.getCustomizedLabelName(
            "SlNo. " +
              (parseInt(stdIndex) + 1) 
          );
          // console.log(this.markLabels);   
          // console.log(item);          
          let errors = this.customValidators.formArrayValidationHandler(
            item,
            this.markLabels
          );
          if (errors.length > 0) {
            for (const indMsg of errors) {
              allErrors.push(indMsg);
            }
          }
      }
    });
    if (allErrors.length > 0) {
      for (const emsg of allErrors) {
        this.alertHelper.viewAlert("error", "Invalid", emsg);
        return false;
      }
    } else {
      return true;
    }
  }

  getCustomizedLabelName(levelName: string) {
    return [
      ``,
      ``,
      `${levelName}  :- Progression Status`,
      `${levelName}  :- Promoted Section`,
    ];
  }

  checkNewClass(stdIndex:number){
    const stdControls = this.stdProgressionForm.get(
      "stdProgressionArray"
    ) as FormArray;

    let newCls = "";
    if(stdControls.at(stdIndex).get("progressionStatus")?.value == 2 || stdControls.at(stdIndex).get("progressionStatus")?.value == 4){
      newCls = 'Class '+(parseInt(this.clsPS)+1);
    }
    stdControls.at(stdIndex).get("newClass")?.patchValue(newCls);
  }

  submitStdProgression(){
    this.selectedStudentData=[];
    const stdControls: FormArray = this.stdProgressionForm.get(
      "stdProgressionArray"
    ) as FormArray;
    this.submitted = true; 
    if (this.validateStdProgression()) {
      //the below method is for check weather there is atleast one record checked
      if (this.stdProgressionForm.get("checkAll")?.value !== '') {
        stdControls.controls?.map((item: any, stdIndex: any) => {
          if( item.get("checkItem").value==true){
            this.selectedStudentData.push(item.get("studentId").value)
          }    
        });
      }
      if(this.selectedStudentData.length>0){
        const stdProgressionFinalData : any = [];
        stdControls.controls?.map((item: any, stdIndex: any) => {
          if( item.get("checkItem").value==true){
            stdProgressionFinalData.push(this.stdProgressionForm.getRawValue()['stdProgressionArray'][stdIndex]);  
          }    
        });

        this.alertHelper.submitAlert().then((result: any) => {
          if (result.value) {
            // console.log(this.selectedStudentData);   
            const paramObj = {
              stdProgressionData:stdProgressionFinalData,
              schoolId: this.userProfile.school,
              classId: this.classId,
              academicYear: this.academicYear,
              userId:this.userProfile.userId,
            };
            this.spinner.show(); // ==== show spinner
            this.studentServices
             // .saveStudentProgression(this.stdProgressionForm.getRawValue())
              .saveStudentProgression(paramObj)
              .subscribe({
                next: (res: any) => {
                  this.spinner.hide(); //==== hide spinner
                  this.alertHelper
                    .successAlert(
                      "Saved!",
                      "Student(s) progression details saved successfully.",
                      "success"
                    )
                    .then(() => {
                      this.initializeForm();
                      this.isStudentData = false;
                      this.onSearch();
                    });
                },
                error: (error: any) => {
                  this.spinner.hide(); //==== hide spinner
                  let errorMessage: string = "";
                  if (typeof error.error.msg === "string") {
                    errorMessage +=
                      '<i class="bi bi-arrow-right text-danger"></i> ' +
                      error.error.msg +
                      `<br>`;
                  } else {
                    error.error.msg.map(
                      (message: string) =>
                        (errorMessage +=
                          '<i class="bi bi-arrow-right text-danger"></i> ' +
                          message +
                          `<br>`)
                    );
                  }
                  this.alertHelper.viewAlertHtml(
                    "error",
                    "Invalid inputs",
                    errorMessage
                  );
                },
              });
          }
        });
      }else{
        this.alertHelper.successAlert(
          "Invalid",
          "Please select atleast one record.",
          "error"
        );
      }      
    }
  }

}
