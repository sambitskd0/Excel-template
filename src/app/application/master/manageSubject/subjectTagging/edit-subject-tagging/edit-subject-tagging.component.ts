import { Component, ElementRef, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators,FormArray, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertHelper } from 'src/app/core/helpers/alert-helper';
import { CustomValidators } from 'src/app/shared/validations/custom-validators';
import {SubjecttaggingService} from '../../../services/subjecttagging.service';
import { NgxSpinnerService } from "ngx-spinner";
import { CommonserviceService } from 'src/app/core/services/commonservice.service';
import { Constant } from 'src/app/shared/constants/constant';
import { PrivilegeHelper } from 'src/app/core/helpers/privilege-helper';
@Component({
  selector: 'app-edit-subject-tagging',
  templateUrl: './edit-subject-tagging.component.html',
  styleUrls: ['./edit-subject-tagging.component.css']
})
export class EditSubjectTaggingComponent implements OnInit {
  editSubjectTaggingForm!:FormGroup;
  submitted = false;
  id: number = 0;
  classAnnextureData: any = '';
  classId:any;
  categoryData: any;
  classTaggingArray:any=[];
  subjectTaggingData:any;
  subjectTaggingArray:any=[];
  selectedCompSub:any=[];
  optsubjectTaggingArray:any=[];
  subjectData:any;
  sujectsData:any;
  anxtName: any = "";
  encId: any = "";
  class:any;
  anxtValue:any;
  anxtType:any;
  className:any;
  streamName:any;
  groupName:any;
  anextureClassdata:any;
  anextureStreamdata:any;
  anextureGroupdata:any;
  allErrorMessages: string[] = [];
  allLabel: any = ["Class","Subject"];
  streamId: any="";
  groupId: any="";
  groupData: any="";
  streamData:any="";
  optionalSubId: any="";
  compChecked:string="";
  optChecked:string="";
  plPrivilege:string="view"; //For menu privilege
  config = new Constant();
adminPrivilege: boolean = false;
tabs: any = [];  //For shwoing tabs

  constructor(public customValidators:CustomValidators,
    private fb:FormBuilder,
    private privilegeHelper: PrivilegeHelper,   //For menu privilege
    public subjecttaggingservice:SubjecttaggingService,
    private route: Router,
    private router: ActivatedRoute,
    private alertHelper: AlertHelper,private spinner: NgxSpinnerService,
    private commonserviceService: CommonserviceService,
    private el: ElementRef
    ) { 
      const pageUrl:any = this.route.url;  
      this.plPrivilege = this.privilegeHelper.PrimaryLinkPrivilege(pageUrl);  //For menu privilege    
      this.commonserviceService.verifyLinkPermission(pageUrl, this.config.linkType[3], this.config.privilege[4]);  // For authorization  
      this.tabs = this.privilegeHelper.PrimaryLinkTabNames(pageUrl);  //For shwoing tabs       
    }

  ngOnInit(): void {
    if(this.plPrivilege=='admin'){
      this.adminPrivilege = true;
    }
    this.loadAnnexturesDataBySeq();
    //this.getClassName();
    this.id = this.router.snapshot.params["encId"];
    this.streamId = this.router.snapshot.params["streamId"];
    this.groupId = this.router.snapshot.params["groupId"];
    this.getSubject();
    this.getSubjectTagging(this.id,this.streamId,this.groupId);
    this.getSubjectName(this.id);
    this.initializeForm();
    this.el.nativeElement.querySelector("[formControlName=classId]").focus();
  }
  initializeForm() {
    this.editSubjectTaggingForm = this.fb.group({
      classId: [
        this.classId,
        [Validators.required],
      ],
      streamId: [
        this.streamId,
      ],
      groupId: [
        this.groupId,
      ],
      subjectTaggingArray: this.fb.array(this.subjectTaggingArray),
      optsubjectTaggingArray: this.fb.array(this.optsubjectTaggingArray),
      encId: [this.id],
    });


}
getSubjectTagging(id:any,streamId:any,groupId:any){
  this.spinner.show();
  this.subjecttaggingservice.getSubjectTagging(id,streamId,groupId).subscribe((res: any) => {
     this.subjectTaggingData = res;
     
    this.subjectTaggingData = this.subjectTaggingData.data;
    this.classId = this.subjectTaggingData.classId;
    this.streamId = this.subjectTaggingData.streamId;
    this.groupId = this.subjectTaggingData.groupId;
    
    
    // if(this.classId == 11 || this.classId == 12){

    //   this.classChange(this.classId)
    //   //this.getStream(this.classId);
    //    // for getting stream name
    //   //this.streamChange(this.subjectTaggingData.streamId);
    //   this.anxtValue=this.streamId;
    //   this.anxtType = "STREAM_TYPE";
    //   this.commonserviceService.getschoolTypeName(this.anxtValue,this.anxtType).subscribe((data:any=[]) => {
    //   this.anextureStreamdata = data;
    //   this.anextureStreamdata = this.anextureStreamdata.data[0];
    //   this.streamName= this.anextureStreamdata.anxtName;
    //   }); 
    // }
  //   if(this.streamId !== '' && this.streamId == 3){
  //   // for getting group name
  //   this.streamChange(this.subjectTaggingData.streamId);
  //        this.anxtValue=this.groupId;
  //        this.anxtType = "STREAM_GROUP_TYPE";
  //        this.commonserviceService.getschoolTypeName(this.anxtValue,this.anxtType).subscribe((data:any=[]) => {
  //        this.anextureGroupdata = data;
  //        this.anextureGroupdata = this.anextureGroupdata.data[0];
  //        this.groupName= this.anextureGroupdata.anxtName;
  //         });
  //  }
    // for getting class name
    //  this.streamChange(this.subjectTaggingData.streamId);
    //      this.anxtValue=this.class;
    //      this.anxtType = "CLASS_TYPE";
    //      this.commonserviceService.getschoolTypeName(this.anxtValue,this.anxtType).subscribe((data:any=[]) => {
    //      this.anextureClassdata = data;
    //      this.anextureClassdata = this.anextureClassdata.data[0];
    //      this.className= this.anextureClassdata.anxtName;
    // }); 
    this.subjectTaggingArray=this.subjectTaggingData.allSubTypeId;
    this.optsubjectTaggingArray=this.subjectTaggingData.allOptTypeId;
    this.initializeForm();
    this.spinner.hide();
});

}
// getClassName() {
//   this.commonserviceService.getCommonAnnexture(['CLASS_TYPE'],true).subscribe((res: any) => {
//     this.classAnnextureData = res?.data.CLASS_TYPE;
//   })
// }
classChange(val: any) {
  this.editSubjectTaggingForm.patchValue({
    streamId: "",
  });
  this.editSubjectTaggingForm.patchValue({
    groupId: "",
  });
  this.classId = val;
  if (this.classId == 11 || this.classId == 12) {
    //this.getStream();
  } else {
    this.streamId = "";
  }
}
getSubjectName(id:any)
{
  this.subjecttaggingservice.getSubjectName(id).subscribe((res: any) => {
    this.subjectData = res;
    this.subjectData = this.subjectData.data;
    
     });
}
getSubject()
{
  this.subjecttaggingservice.getSubject().subscribe((res: any) => {
    this.sujectsData = res?.data;
});

}
// getGroup() {
//   this.commonserviceService
//     .getCommonAnnexture(["STREAM_GROUP_TYPE"])
//     .subscribe((data: any = []) => {
//       this.groupData = data;
//       this.groupData = this.groupData.data["STREAM_GROUP_TYPE"];

//     });
// }
// getStream()
// {
//   this.commonserviceService
//   .getCommonAnnexture(["STREAM_TYPE"])
//   .subscribe((data: any = []) => {
//     this.streamData = data; 
//     this.streamData = this.streamData.data["STREAM_TYPE"];
//   });
// }
loadAnnexturesDataBySeq() {
  const anxTypes = [
    "CLASS_TYPE",
    "STREAM_GROUP_TYPE",
    "STREAM_TYPE"
  ];
  this.commonserviceService.getCommonAnnexture(anxTypes, true).subscribe({
    next: (res: any) => {
      this.classAnnextureData = res?.data?.CLASS_TYPE;
      this.groupData = res?.data?.STREAM_GROUP_TYPE;
      this.streamData = res?.data?.STREAM_TYPE;
    },
  });
}
streamChange(val: any) {
  this.editSubjectTaggingForm.patchValue({
    groupId: "",
  });
  this.streamId = val;
  if (this.streamId == 3) {
    //this.getGroup();
    
  } else {
    this.groupId = "";
  }
  
}
comSubCheckboxChange(event: any) {
  //  compulsory
  const subjectTaggingArray: FormArray = this.editSubjectTaggingForm.get(
    "subjectTaggingArray"
  ) as FormArray;
  const index = this.subjectTaggingArray.indexOf(parseInt(event.target.value),0);
    //optional
    const optsubjectTaggingArray: FormArray = this.editSubjectTaggingForm.get(
      'optsubjectTaggingArray'
    ) as FormArray;
    const optindex = this.optsubjectTaggingArray.indexOf(parseInt(event.target.value),0)
     if(optsubjectTaggingArray.value.includes(parseInt(event.target.value))){
            event.target.checked=false;
            event.target.disabled=true;
    }else{
      //event.target.disabled=false;
        if(event.target.checked){
          event.target.disabled=false;
          event.target.checked=true;
          subjectTaggingArray.push(new FormControl(parseInt(event.target.value)));
        }else{
          event.target.disabled=false;
          event.target.checked=false;
        const index = subjectTaggingArray.controls.findIndex(x => x.value === event.target.value);
        subjectTaggingArray.removeAt(index);
        }
    }
   

}
opSubCheckboxChange(event: any) {
  const optsubjectTaggingArray: FormArray = this.editSubjectTaggingForm.get(
    "optsubjectTaggingArray"
  ) as FormArray;

 const optindex = this.optsubjectTaggingArray.indexOf(parseInt(event.target.value), 0);

 const subjectTaggingArray: FormArray = this.editSubjectTaggingForm.get(
  "subjectTaggingArray"
) as FormArray;

const index = this.subjectTaggingArray.indexOf(parseInt(event.target.value),0);
if(subjectTaggingArray.value.includes(parseInt(event.target.value))){
  event.target.checked=false;
  event.target.disabled=true;

}else{
  //event.target.disabled=false;

    if(event.target.checked){
      event.target.disabled=false;
      event.target.checked=true;
      optsubjectTaggingArray.push(new FormControl(parseInt(event.target.value)));
    }else{
      event.target.disabled=false;
      event.target.checked=false;
    const index = optsubjectTaggingArray.controls.findIndex(x => x.value === event.target.value);
    optsubjectTaggingArray.removeAt(optindex);
    }
}
 //this.initializeForm();
}
onSubmit()
{
  this.selectedCompSub=[];
  const subjectTaggingArray: FormArray = this.editSubjectTaggingForm.get(
    "subjectTaggingArray"
  ) as FormArray;
  subjectTaggingArray.controls?.map((item: any) => {
    console.log(item,":::sub check")
    this.selectedCompSub.push(item.value)
  });
  console.log(this.selectedCompSub.length);
  if (
    this.editSubjectTaggingForm.get("classId")?.value == 11 ||
    this.editSubjectTaggingForm.get("classId")?.value == 12
  ) {
    if (
      this.editSubjectTaggingForm.controls["streamId"]?.value == "" ||
      this.editSubjectTaggingForm.controls["streamId"]?.value == 0
    ) {
      this.alertHelper.successAlert("Stream Required", "", "error");
      return;
    }
  }
  if (this.editSubjectTaggingForm.get("streamId")?.value == 3) {
    if (
      this.editSubjectTaggingForm.controls["groupId"]?.value == "" ||
      this.editSubjectTaggingForm.controls["groupId"]?.value == 0
    ) {
      this.alertHelper.successAlert("Group Required", "", "error");
      return;
    }
  }
  if (this.editSubjectTaggingForm.invalid) {
    this.customValidators.formValidationHandler(
      this.editSubjectTaggingForm,
      this.allLabel,
      this.el
    );

    }
  if (this.editSubjectTaggingForm.valid === true) {
    if(this.selectedCompSub.length==0){
      this.alertHelper.successAlert(
        "Invalid",
        "Please mention at least one compulsory subject",
        "error"
      );
    }else{
        this.alertHelper.updateAlert().then((result) => {
          if (result.value) {
            this.spinner.show();
            this.subjecttaggingservice
              .updateSubjectTagging(this.editSubjectTaggingForm.value)
              .subscribe({
                next: (res: any) => {
                  this.spinner.hide();
                  this.alertHelper
                    .successAlert(
                      "Saved!",
                      "Subject tagging updated successfully.",
                      "success"
                    )
                    .then(() => {
                       this.route.navigate(["../../../../viewSubjectTagging"], {
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
onCancel()
  {
    this.route.navigate(["../../../../viewSubjectTagging"], {
      relativeTo: this.router,
    }); 
  }

}

