import { Component, ElementRef, OnInit } from '@angular/core';
import { CommonserviceService } from 'src/app/core/services/commonservice.service';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ClasstaggingService } from '../../services/classtagging.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { CustomValidators } from 'src/app/shared/validations/custom-validators';
import { AlertHelper } from 'src/app/core/helpers/alert-helper';
import { Constant } from 'src/app/shared/constants/constant';
import { PrivilegeHelper } from 'src/app/core/helpers/privilege-helper';

@Component({
  selector: 'app-editclasstagging',
  templateUrl: './editclasstagging.component.html',
  styleUrls: ['./editclasstagging.component.css']
})
export class EditclasstaggingComponent implements OnInit {
  classTaggingForm!:FormGroup;
  anexType:any;
  anextureSchlTypedata:any;
  anextureClassTypedata:any;
  schlTypeId:any;
  classTaggingArray:any=[];
  encId:any;
  id:any;
  anxtValue:any;
  anxtType:any;
  submitted = false;
  classTaggingData:any;
  schoolTypeName:any;
  allErrorMessages: string[] = [];
  allLabel: string[] = ["School Type", "Class Tagging"];
  plPrivilege:string="view"; //For menu privilege
  config = new Constant();
  adminPrivilege: boolean = false;

  constructor(public commonserviceService: CommonserviceService,
    private formBuilder: FormBuilder, 
    private route: Router,
    private router: ActivatedRoute, 
    public classtaggingService:ClasstaggingService,
    private spinner: NgxSpinnerService,
    private privilegeHelper: PrivilegeHelper,   //For menu privilege
    public customValidators: CustomValidators,
    private el:ElementRef,
    private alertHelper: AlertHelper,) {
      const pageUrl:any = this.route.url;  
    this.plPrivilege = this.privilegeHelper.PrimaryLinkPrivilege(pageUrl);  //For menu privilege    
    this.commonserviceService.verifyLinkPermission(pageUrl, this.config.linkType[2], this.config.privilege[4]);  // For authorization  
     }

  ngOnInit(): void {
    if(this.plPrivilege=='admin'){
      this.adminPrivilege = true;
    }

    this.anexType="SCHOOL_CATEGORY_TYPE";
    this.commonserviceService.getAnextureType(this.anexType).subscribe((data:any=[]) => {
    this.anextureSchlTypedata = data;
    this.anextureSchlTypedata = this.anextureSchlTypedata.data;
   });
   
    this.id = this.router.snapshot.params["encId"];
    this.editClassTagging(this.id);
    this.getClass();
    this.initializeForm();
  }
  getClass(){
    this.commonserviceService.getCommonAnnexture(["CLASS_TYPE"],true).subscribe((data:any=[]) => {
      this.anextureClassTypedata = data;
      this.anextureClassTypedata = this.anextureClassTypedata.data['CLASS_TYPE'];
    });
  }
  initializeForm() {
    this.classTaggingForm = this.formBuilder.group({
      schlTypeId: [this.schlTypeId],
      classTaggingArray: this.formBuilder.array(this.classTaggingArray, Validators.required),
      encId: [this.encId],
    });
  
  }
  formReset(){
    (this.classTaggingForm.get("classTaggingArray") as FormArray).clear();
    this.route.navigate(["../../viewClassTagging"], {
      relativeTo: this.router,
    });
  }
  editClassTagging(id: any){
    this.classtaggingService
    .getClassTagging(this.id) 
    .subscribe((data: any) => {
      this.classTaggingData = data;
      this.classTaggingData = this.classTaggingData.data;
      this.classTaggingArray=this.classTaggingData.allClassTypeId;
      this.schlTypeId = this.classTaggingData.schlTypeId;
      this.encId = this.classTaggingData.encId;
      this.initializeForm();
      this.spinner.hide(); 
          this.anxtValue=this.schlTypeId;
          this.anxtType = "SCHOOL_CATEGORY_TYPE";
          this.commonserviceService.getschoolTypeName(this.anxtValue,this.anxtType).subscribe((data:any=[]) => {
          this.anextureSchlTypedata = data;
          this.anextureSchlTypedata = this.anextureSchlTypedata.data[0];
          this.schoolTypeName= this.anextureSchlTypedata.anxtName;
        });
   
});
  }
  onCheckboxChange(event: any) {
    const classTaggingArray: FormArray = this.classTaggingForm.get(
      "classTaggingArray"
    ) as FormArray;

    if (this.classTaggingArray.includes(parseInt(event.target.value))) {
      const index = this.classTaggingArray.indexOf(
        parseInt(event.target.value),
        0
      );
      if (index > -1) {
        this.classTaggingArray.splice(index, 1);
      }
    } else {
      this.classTaggingArray.push(parseInt(event.target.value));
    }
    this.initializeForm();
  }
onSubmit(){
    this.submitted = true;
    if(this.classTaggingForm.invalid){
      this.customValidators.formValidationHandler(
        this.classTaggingForm,
        this.allLabel,
        this.el
      );
    }
    
    if (this.classTaggingForm.valid === true) {
      this.alertHelper
        .updateAlert(
          "Do you want to Update?",
          "question",
          "Yes, Update it!",
          "No, keep it"
        )
        .then((result) => {
          if (result.value) {
            if (result.value) {
              this.spinner.show(); // ==== show spinner
              this.classtaggingService
                .updateClassTagging(this.classTaggingForm.value)
                .subscribe({
                  next: (res: any) => {
                    this.spinner.hide(); //==== hide spinner
                    this.alertHelper
                      .successAlert(
                        "Saved!",
                        "Class tagging updated successfully",
                        "success"
                      )
                      .then(() => {
                        this.route.navigate(["../../viewClassTagging"], {
                          relativeTo: this.router,
                        });
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
          }
        });
    }
}
}
