import { Component, ElementRef, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormArray,
  FormControl,
} from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { AlertHelper } from "src/app/core/helpers/alert-helper";
import { CustomValidators } from "src/app/shared/validations/custom-validators";
import { NgxSpinnerService } from "ngx-spinner";
import { CommonserviceService } from "src/app/core/services/commonservice.service";
import { ManageMarkconfigurationService } from "../../../services/manage-markconfiguration.service";
import { Constant } from "src/app/shared/constants/constant";
import { PrivilegeHelper } from "src/app/core/helpers/privilege-helper";
@Component({
  selector: "app-add-markconfiguration",
  templateUrl: "./add-markconfiguration.component.html",
  styleUrls: ["./add-markconfiguration.component.css"],
})
export class AddMarkconfigurationComponent implements OnInit {
  markConfigurationLabel: string[] = this.getCustomizedLabelName("");
  professionalQualificationTypes: Array<any> = [];
  addMarkConfigurationForm!: FormGroup;
  markConfigurationSearchForm!: FormGroup;
  submitted = false;
  markConfigureData: any = "";
  markConfigureDatas: any = "";
  examinationWiseClassData: any = "";
  classAnnextureData: any = "";
  streamData: any = "";
  examType: any = "";
  classId: any = "";
  streamId: any = "";
  groupId: any = "";
  groupData: any = "";
  theoryMark: any = "";
  praticalMark: any = "";
  minPassMark: any = "";
  fullMark: any = "";
  resSubject: any = "";
  anexType: any;
  anextureType: any;
  annexData: any;
  disableFields: boolean = false;
  emptyResult: boolean = false;
  isSubjectListData: boolean = false;
  classLoading: boolean = false;
  subData: any;
  isEditted: boolean = false;
  id: number = 0;
  encId: any = "";
  allErrorMessages: string[] = [];
  allLabel: any = ["Examination type", "Class"];
  subjectListData: any = "";
  markCfgData: any = "";
  plPrivilege:string="view"; //For menu privilege
  config = new Constant();
  adminPrivilege: boolean = false;
  tabs: any = [];  //For shwoing tabs

  constructor(
    public customValidators: CustomValidators,
    private fb: FormBuilder,
    private route: Router,
    private router: ActivatedRoute,
    private alertHelper: AlertHelper,
    private privilegeHelper: PrivilegeHelper,   //For menu privilege
    private spinner: NgxSpinnerService,
    private commonserviceService: CommonserviceService,
    private managemarkconfigurationservice: ManageMarkconfigurationService,
    private el:ElementRef
  ) {
    const pageUrl:any = this.route.url;  
    this.plPrivilege = this.privilegeHelper.PrimaryLinkPrivilege(pageUrl);  //For menu privilege    
    this.commonserviceService.verifyLinkPermission(pageUrl, this.config.linkType[3], this.config.privilege[4]); // For authorization
    this.tabs = this.privilegeHelper.PrimaryLinkTabNames(pageUrl);  //For shwoing tabs 
  }

  ngOnInit(): void {
    if(this.plPrivilege=='admin'){
      this.adminPrivilege = true;
    }
    this.getAnnextureData(); //get class annexture
    this.initializeFormForSearch();
    this.getExamTermType();
    this.initializeForm();
  }
  initializeFormForSearch() {
    this.markConfigurationSearchForm = this.fb.group({
      examType: [this.examType, Validators.required],
      classId: [this.classId, Validators.required],
      streamId: [this.streamId],
      groupId: [this.groupId],
    });
  }
  initializeForm() {
    this.addMarkConfigurationForm = this.fb.group({
      examType: [this.examType, Validators.required],
      classId: [this.classId, Validators.required],
      streamId: [this.streamId],
      groupId: [this.groupId],
      markConfigarray: this.fb.array([]), // store all data in this array
    });
  }
  enableFields() {
    this.isEditted = this.disableFields;
    this.disableFields = !this.disableFields;
    this.initializeForm(); // initialize form
    this.fillFieldsWithExistingData();
  }
  markConfigSubject(): FormArray {
    return this.addMarkConfigurationForm.get("markConfigarray") as FormArray;
  }
  getAnnextureData() {
    this.classId="";
    this.commonserviceService
      .getCommonAnnexture(["CLASS_TYPE"])
      .subscribe((res: any) => {
        this.classAnnextureData = res?.data.CLASS_TYPE;
      });
  } 
  getClassName(examinationTypeId: any) {
    this.classLoading=true;
    this.subjectListData=[];
    this.examinationWiseClassData= [];
    this.isSubjectListData = false;
    this.markConfigurationSearchForm.patchValue({
      classId: "",
    });
    this.markConfigurationSearchForm.patchValue({
      streamId: "",
    });
    this.markConfigurationSearchForm.patchValue({
      groupId: "",
    });
    this.streamId= "";
    this.groupId= "";
    this.streamData= [];
    this.groupData= [];
      this.managemarkconfigurationservice
      .getClassByTermId(examinationTypeId)
      .subscribe((data: any = []) => {
        this.examinationWiseClassData = data?.data[0]?.classId;
        let classArr = this.classAnnextureData.filter((item: any) =>
          this.examinationWiseClassData.includes(item?.anxtValue)
        );
        // classArr = classArr.sort((a: any, b: any) => (a.anxtValue.toLowerCase() < b.anxtValue.toLowerCase()) ? -1 : ((b.anxtValue.toLowerCase() > a.anxtValue.toLowerCase()) ? 1 : 0));
         classArr = classArr.sort((a: any, b: any) => a.anxtValue - b.anxtValue)
        this.examinationWiseClassData = classArr;
      });
      this.classLoading=false;

    //console.log(this.markConfigurationSearchForm.value);

  }
    // =============For ExamTermType
    getExamTermType() {
      this.anexType = "EXAM_TERM_TYPE";
      this.commonserviceService
        .getAnextureType(this.anexType)
        .subscribe((data: any = []) => {
          this.annexData = data;
        this.anextureType = this.annexData.data;
        });
    }
  getGroup() {
    this.commonserviceService
      .getCommonAnnexture(["STREAM_GROUP_TYPE"])
      .subscribe((data: any = []) => {
        this.groupData = data;
        this.groupData = this.groupData.data["STREAM_GROUP_TYPE"];
      });
  }
  getStream() {
    this.commonserviceService
      .getCommonAnnexture(["STREAM_TYPE"])
      .subscribe((data: any = []) => {
        this.streamData = data;
        this.streamData = this.streamData.data["STREAM_TYPE"];
      });
  }
  classChange(val: any) {
    this.markConfigurationSearchForm.patchValue({
      streamId: "",
    });
    this.markConfigurationSearchForm.patchValue({
      groupId: "",
    });
    this.classId = val;
    if (this.classId == 11 || this.classId == 12) {
      this.getStream();
    } else {
      this.streamId = "";
    }
  }
  streamChange(val: any) {
    this.markConfigurationSearchForm.patchValue({
      groupId: "",
    });
    this.streamId = val;
    if (this.streamId == 3) {
      this.getGroup();
    } else {
      this.groupId = "";
    }
  }
  getSubjectListForMarkEntry() {
    console.log(this.markConfigurationSearchForm.value);
    this.submitted = true;
    if (
      this.markConfigurationSearchForm.get("classId")?.value == 11 ||
      this.markConfigurationSearchForm.get("classId")?.value == 12
    ) {
      if (
        this.markConfigurationSearchForm.controls["streamId"]?.value == "" ||
        this.markConfigurationSearchForm.controls["streamId"]?.value == 0
      ) {
        this.alertHelper.viewAlert("error","Invalid","Stream Required");
        return;
      }
    }
    if (this.markConfigurationSearchForm.get("streamId")?.value == 3) {
      if (
        this.markConfigurationSearchForm.controls["groupId"]?.value == "" ||
        this.markConfigurationSearchForm.controls["groupId"]?.value == 0
      ) {
      this.alertHelper.viewAlert("error","Invalid","Group Required");
        return;
      }
    }

    if (this.markConfigurationSearchForm.invalid) {
      this.customValidators.formValidationHandler(
        this.markConfigurationSearchForm,
        this.allLabel,
        this.el
      );
    }

    if (this.markConfigurationSearchForm.valid === true) {
      this.spinner.show(); 
      this.initializeForm();
      this.managemarkconfigurationservice
        .getSubjectForMarkConfiguration(this.markConfigurationSearchForm.value)
        .subscribe((res: any) => {
          this.subjectListData = res.data;
          if (this.subjectListData?.length) {
            this.disableFields = true;
            this.emptyResult = false;
            this.isSubjectListData = true;
            this.fillFieldsWithExistingData();
            this.spinner.hide(); 
          } else {
            this.emptyResult = true;
            this.isSubjectListData = false;
            this.initializeForm();
            this.spinner.hide(); 
          }
        });
    }
  
  }
  fillFieldsWithExistingData() {
    this.subjectListData.map((item: any) => {
      this.markConfigSubject().push(
        this.fb.group({
          subjectId: [
            {
              value: item.subjectId,
              disabled: true,
            },
          ],
          subject: [
            {
              value: item.subject,
              disabled: true,
            },
          ],
          theoryMark: [
            {
             
              value: item.theoryMark,
              disabled: this.disableFields,
            },
            [Validators.required],
          ],
          practicalMark: [
            {
              value: item.practicalMark,
              disabled: this.disableFields,
            },
            [Validators.required],
          ],
          minPassMark: [
            {
              value: item.minPassMark,
              disabled: this.disableFields,
            },
            [Validators.required],
          ],
          fullMark: [
            {
              value: item.fullMark,
              disabled: true,
            },
          ],
        })
      );
    });
  
  }
  fullMarkCalculation(theoryMark: any, practicalMark: any,  formIndex: any) {
    let markConfig = <FormArray>(
      this.addMarkConfigurationForm.controls["markConfigarray"]
    );
    if ( parseInt(theoryMark.value) >= 0 && parseInt(practicalMark?.value) >= 0) {
      let fullMark: string | number =
        (parseInt(theoryMark.value) + parseInt(practicalMark?.value));
      markConfig?.controls?.map(
        (res: any, curIndex: number) => {
          if (formIndex === curIndex) {
            res.patchValue({
              fullMark: fullMark,
            });
          }
        }
      );
    }else {
      markConfig?.controls?.map(
        (res: any, curIndex: number) => {
          if (formIndex === curIndex) {
            res.patchValue({
              fullMark: "",
            });
          }
        }
      );
    }
  }
  minPassMarkValidation(minPassMark: any, fullMark: any,practicalMark: any,theoryMark: any,  formIndex: any) {
    let markConfig = <FormArray>(
      this.addMarkConfigurationForm.controls["markConfigarray"]
    );
      if(parseInt(theoryMark?.value)==0 || theoryMark?.value==''){
        this.alertHelper
        .successAlert(
          "Invalid",
          "Please enter Theory mark",
          "error"
        )
        .then((res: any) => {
          theoryMark.focus();
          markConfig?.controls?.map(
            (res: any, curIndex: number) => {
              if (formIndex === curIndex) {
                res.patchValue({
                  minPassMark: "",
                });
              }
            }
          );
        });
      }
      else if(practicalMark?.value==''){
        this.alertHelper
        .successAlert(
          "Invalid",
          "Please enter Pratical  mark",
          "error"
        )
        .then((res: any) => {
          practicalMark.focus();
          markConfig?.controls?.map(
            (res: any, curIndex: number) => {
              if (formIndex === curIndex) {
                res.patchValue({
                  minPassMark: "",
                });
              }
            }
          );
        });
      }
      else if(parseInt(minPassMark?.value)==0 || minPassMark?.value==''){
        this.alertHelper
        .successAlert(
          "Invalid",
          "Minimum mark can't be Zero or empty",
          "error"
        )
        .then((res: any) => {
          minPassMark.focus();
        });
      }
      else if(parseInt(minPassMark.value) > parseInt(fullMark?.value)) {
        this.alertHelper
          .successAlert(
            "Invalid",
            "minimum passmark can't be greater than full mark!!!",
            "error"
          )
          .then((res: any) => {
            minPassMark.focus();
          });
        }
  }
  getCustomizedLabelName(subject: string) {
    return [
      `${subject} :- ''`,
      `${subject} :- ''`,
      `${subject} :- Theory Mark`,
      `${subject} :- Practical Mark`,
      `${subject} :- Min. Pass Mark`,
    ];
  }
  validateSubmitMarkConfiguration() {
    Promise.all(this.validateMarkconfigurationData()).then(
      (value) => {
        
        const formErrors = value;

        
          let formInvalid: any = false;
          formErrors.map((item: any) => {
            if (item !== false) {
              formInvalid = true;
            }
          });
          formInvalid === false && this.submitMarkConfiguration();
        
      }
    );
  }
  validateMarkconfigurationData() {    
    let allErrors: any = [];
    let markConfig = <FormArray>(
      this.addMarkConfigurationForm.controls["markConfigarray"]
    );   
    markConfig?.controls?.map((item: any, index: number) => {
      
      this.markConfigurationLabel = this.getCustomizedLabelName(
        "SlNo. " + (index + 1)
      );
      let errors = this.customValidators.formValidationHandler(
        item,
        this.markConfigurationLabel
      );
      allErrors.push(errors);
    });    
    return allErrors;
  }
  submitMarkConfiguration() {
    console.log(this.addMarkConfigurationForm.getRawValue());
    this.submitted = true;
    this.addMarkConfigurationForm.patchValue({
      examType: this.subjectListData[0].examType,
    });
    this.addMarkConfigurationForm.patchValue({
      classId: this.subjectListData[0].classId,
    });
    this.addMarkConfigurationForm.patchValue({
      groupId: this.subjectListData[0].groupId,
    });
    this.addMarkConfigurationForm.patchValue({
      streamId: this.subjectListData[0].streamId,
    });
    this.customValidators.formValidationHandler(
      this.addMarkConfigurationForm,
      this.allLabel
    );
    if (this.addMarkConfigurationForm.valid === true) {
      this.alertHelper.submitAlert().then((result: any) => {
        if (result.value) {
          this.spinner.show(); // ==== show spinner
          this.managemarkconfigurationservice
            .addMarkConfiguration(this.addMarkConfigurationForm.getRawValue())
            .subscribe({
              next: (res: any) => {
                this.spinner.hide(); //==== hide spinner
                this.alertHelper
                  .successAlert(
                    "Saved!",
                    "Markconfiguration  created successfully.",
                    "success"
                  )
                  .then(() => {
                    this.initializeForm();
                    window.location.reload();
                  });
                  // .then(() => {
                  //  this.initializeForm();
                  //  this.initializeFormForSearch();
                  //   this.route.navigate(["./../addMarkConfiguration"], {
                  //     relativeTo: this.router,
                  //   });
                  // });
              },
              error: (error: any) => {
                this.spinner.hide(); //==== hide spinner
              },
             
            });
        }
      });
    }
  }
}
