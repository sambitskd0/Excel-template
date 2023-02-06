import { Component, ElementRef, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertHelper } from 'src/app/core/helpers/alert-helper';
import { CustomValidators } from 'src/app/shared/validations/custom-validators';
import { NgxSpinnerService } from "ngx-spinner";
import { CommonserviceService } from 'src/app/core/services/commonservice.service';
import {SubjecttaggingService} from '../../../services/subjecttagging.service';
import { Constant } from 'src/app/shared/constants/constant';
import { PrivilegeHelper } from 'src/app/core/helpers/privilege-helper';

@Component({
  selector: 'app-add-subjecttagging',
  templateUrl: './add-subjecttagging.component.html',
  styleUrls: ['./add-subjecttagging.component.css']
})
export class AddSubjecttaggingComponent implements OnInit {
  isChecked:boolean   = false;
  addSubjectTaggingForm!: FormGroup;
  submitted = false;
   classAnnextureData: any = "";
   streamData: any = "";
   classId:any="";
   streamId: any = "";
   groupId:any="";
   groupData: any = "";
   sujectData:any="";
   comSuTaggingArray:any=[];
   optSuTaggingArray:any=[];
   selectedCompSub:any=[];
  id: number = 0;
  encId: any = "";
  optChecked:string="";
  compChecked:string="";
 allErrorMessages: string[] = [];
  allLabel: any = ["Class","Stream", "Group","Compulsory subject","Optional subject"];
  plPrivilege:string="view"; //For menu privilege
  config = new Constant();
 adminPrivilege: boolean = false;
  tabs: any = [];  //For shwoing tabs

  constructor(public customValidators: CustomValidators,
    private fb: FormBuilder,
    private privilegeHelper: PrivilegeHelper,   //For menu privilege
    private route: Router,
    private router: ActivatedRoute,
    private alertHelper: AlertHelper, private spinner: NgxSpinnerService,
    private commonserviceService: CommonserviceService,
    private subjecttaggingservice: SubjecttaggingService,
    private el:ElementRef,
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
    this.getClassName(); //get class annexture
    this.id = this.router.snapshot.params["encId"];
    this.initializeForm();
    this.el.nativeElement.querySelector("[formControlName=classId]").focus();
    this.getSubject();
  }
  initializeForm() {
    this.addSubjectTaggingForm = this.fb.group({
      classId:[this.classId,[Validators.required]],
      streamId:[this.streamId],
      groupId:[this.groupId],
      comSuTaggingArray: this.fb.array(this.comSuTaggingArray),
      // comSuTaggingArray: this.fb.array([], Validators.required),
      optSuTaggingArray: this.fb.array(this.optSuTaggingArray),

    });

  }
  getClassName() {
    this.commonserviceService.getCommonAnnexture(['CLASS_TYPE'],true).subscribe((res: any) => {
      this.classAnnextureData = res?.data.CLASS_TYPE;
    })
  }
  classChange(val: any) {
    this.addSubjectTaggingForm.patchValue({
      streamId: "",
    });
    this.addSubjectTaggingForm.patchValue({
      groupId: "",
    });
    this.classId = val;
    if (this.classId == 11 || this.classId == 12) {
      this.getStream();
    } else {
      this.streamId = "";
    }
}
getStream()
{
  this.commonserviceService
  .getCommonAnnexture(["STREAM_TYPE"])
  .subscribe((data: any = []) => {
    this.streamData = data;
    this.streamData = this.streamData.data["STREAM_TYPE"];
 
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
streamChange(val: any) {
  this.addSubjectTaggingForm.patchValue({
    groupId: "",
  });
  this.streamId = val;
  if (this.streamId == 3) {
    this.getGroup();
  } else {
    this.groupId = "";
  }
}
getSubject()
{
  this.subjecttaggingservice.getSubject().subscribe((res: any) => {
    this.sujectData = res?.data;
  
});

}
comSubCheckboxChange(event: any) {
  //  compulsory
  const comSuTaggingArray: FormArray = this.addSubjectTaggingForm.get(
    'comSuTaggingArray'
  ) as FormArray;
   const index = this.comSuTaggingArray.indexOf(parseInt(event.target.value),0)
   //optional
   const optSuTaggingArray: FormArray = this.addSubjectTaggingForm.get(
    'optSuTaggingArray'
  ) as FormArray;
  const optindex = this.optSuTaggingArray.indexOf(parseInt(event.target.value),0)
  
    if(optSuTaggingArray.value.includes(event.target.value)){
      event.target.checked=false;
      event.target.disabled=true;
    }else{
        if(event.target.checked){
          event.target.disabled=false;
          event.target.checked=true;
          comSuTaggingArray.push(new FormControl(event.target.value));
        }else{
          event.target.disabled=false;
          event.target.checked=false;
        const index = comSuTaggingArray.controls.findIndex(x => x.value === event.target.value);
        comSuTaggingArray.removeAt(index);
        }
    }
}
optSubCheckboxChange(event: any) {
   //  compulsory
   const comSuTaggingArray: FormArray = this.addSubjectTaggingForm.get(
    'comSuTaggingArray'
  ) as FormArray;
   const index = this.comSuTaggingArray.indexOf(parseInt(event.target.value),0)
  const optSuTaggingArray: FormArray = this.addSubjectTaggingForm.get(
    'optSuTaggingArray'
  ) as FormArray;
   const optindex = this.optSuTaggingArray.indexOf(parseInt(event.target.value),0)
   if(comSuTaggingArray.value.includes(event.target.value)){
    event.target.checked=false;
    event.target.disabled=true;
   
  }else{
      if(event.target.checked){
        event.target.disabled=false;
        event.target.checked=true;
        optSuTaggingArray.push(new FormControl(event.target.value));
      }else{
        event.target.disabled=false;
        event.target.checked=false;
      const index = optSuTaggingArray.controls.findIndex(x => x.value === event.target.value);
      optSuTaggingArray.removeAt(optindex);
      }
  }
}

onSubmit()
{
  this.selectedCompSub=[];
  const comSuTaggingArray: FormArray = this.addSubjectTaggingForm.get(
    "comSuTaggingArray"
  ) as FormArray;
  comSuTaggingArray.controls?.map((item: any) => {
    this.selectedCompSub.push(item.value)
  });
  console.log(this.selectedCompSub.length);
  this.submitted = true;
  if (
    this.addSubjectTaggingForm.get("classId")?.value == 11 ||
    this.addSubjectTaggingForm.get("classId")?.value == 12
  ) {
    if (
      this.addSubjectTaggingForm.controls["streamId"]?.value == "" ||
      this.addSubjectTaggingForm.controls["streamId"]?.value == 0
    ) {
      this.alertHelper.viewAlert("error", "", "Stream is required");
      return;
    }
  }
  if (this.addSubjectTaggingForm.get("streamId")?.value == 3) {
    if (
      this.addSubjectTaggingForm.controls["groupId"]?.value == "" ||
      this.addSubjectTaggingForm.controls["groupId"]?.value == 0
    ) {
       this.alertHelper.viewAlert("error", "", "Group is required");
      return;
    }
  }
 
  if (this.addSubjectTaggingForm.invalid) {
    this.customValidators.formValidationHandler(
      this.addSubjectTaggingForm,
      this.allLabel,
      this.el
    );
  }
      if (this.addSubjectTaggingForm.valid === true) {
        if(this.selectedCompSub.length==0){
          this.alertHelper.successAlert(
            "Invalid",
            "Please mention at least one compulsory subject",
            "error"
          );}else{
            this.alertHelper.submitAlert().then((result) => {
              if (result.value) {
                this.spinner.show(); 
                this.subjecttaggingservice
                  .addSubjectTagging(this.addSubjectTaggingForm.value)
                  .subscribe({
                    next: (res: any) => {
                      this.spinner.hide();
                    this.alertHelper
                        .successAlert(
                          "Saved!",
                          "SubjectTagging created successfully.",
                          "success"
                        )
                        .then(() => {
                          this.route.navigate(["./../viewSubjectTagging"], {
                            relativeTo: this.router,
                          });
                       });
                    },
                    error: (error: any) => {
                      this.spinner.hide(); 
                    },
                  });
              }
            });
          }
      }
}
}


