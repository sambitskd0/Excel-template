import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CustomValidators } from 'src/app/shared/validations/custom-validators';
import { CommonserviceService } from 'src/app/core/services/commonservice.service';
import { ManageQuestionService } from '../../services/manage-question.service';
import { ActivatedRoute, Router } from "@angular/router";
import { AlertHelper } from "src/app/core/helpers/alert-helper";
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: 'app-add-question',
  templateUrl: './add-question.component.html',
  styleUrls: ['./add-question.component.css']
})
export class AddQuestionComponent implements OnInit {

  questionForm!: FormGroup;
  allErrorMessages: string[] = [];
  submitted = false;
  posts: any; 
 
  allLabel: string[] = ["Question Category", "School Category", "Question", "Is mandatory ?", "Input Type", "Length limit", "Unit (If Any)", "Question Serial Number"];
  questionCategory : number = 0;
  schoolCategory : number  = 0;
  inspQuestion : string = '';
  schoolCatagoryChanged:boolean = false;
  schoolCatData:any = [];
  isMandatory : number = 0;
  inputType: number = 0;
  inputUnit:string = '';
  inputLength:number = 0;
  serialNumber : number = 0;
  ifOptionInput:boolean = false;
  ifNormalInput:boolean = false;
  ifmandatory : boolean = false;
  sectionList2: Array<any> = [
    {sectionName: "",sectionNameOdia: ""}
  ];  newAttribute2: any = {};
  constructor(
    private formBuilder : FormBuilder,
    private alertHelper: AlertHelper,
    public  customValidators: CustomValidators,
    private spinner: NgxSpinnerService,
    private commonService:CommonserviceService,
    private ManageQuestionService:ManageQuestionService,
    private route: Router,
    private router: ActivatedRoute,
    private el:ElementRef

  ) { }

  ngOnInit(): void {
    this.initializeForm();
    this.getSchoolCategory();
  }
  ngAfterViewInit(){
    this.el.nativeElement.querySelector("[formControlName=questionCategory]").focus();
  }

  showHideMandtory(){
    let questionCategoryVal = this.questionForm.controls["questionCategory"]?.value;
    if(questionCategoryVal== 1){
      this.ifmandatory = true;
    }else{
      this.ifmandatory = false;
    }
  }


  onSubmit(){
    this.submitted = true;
    if(this.questionForm.invalid){
      this.customValidators.formValidationHandler(
        this.questionForm,
        this.allLabel,
        this.el
      );
    }
    
    if(this.questionForm.controls["questionCategory"]?.value == 0) {
      this.alertHelper.successAlert("Question Category is Required", "", "error");
      return;
    } 
    if(this.questionForm.controls["questionCategory"]?.value == 1){
      if(this.questionForm.controls["schoolCategory"]?.value == 0) {
        this.alertHelper.successAlert("School Category is Required", "", "error");
        return;
      } 
    }    

    if(this.questionForm.controls["inspQuestion"]?.value == 0) {
      this.alertHelper.successAlert("Question is Required", "", "error");
      return;
    } 
    if(this.questionForm.controls["inputType"]?.value == 0) {
      this.alertHelper.successAlert("Input Type is Required", "", "error");
      return;
    } 
    if(this.questionForm.controls["inputType"]?.value == 3 || this.questionForm.controls["inputType"]?.value == 4){
      if(this.questionForm.controls["inputLength"]?.value == 0) {
        this.alertHelper.successAlert("Length limit is Required", "", "error");
        return;
      } 
    }

    if(this.questionForm.controls["serialNumber"]?.value == 0) {
      this.alertHelper.successAlert("Question Serial Number is Required", "", "error");
      return;
    } 
    if (this.questionForm.valid === true) {
      this.alertHelper.submitAlert().then((result: any) => {
        if (result.value) {
          this.spinner.show(); // ==== show spinner
          this.ManageQuestionService
            .addQuestion(this.questionForm.value)
            .subscribe({
              next: (res: any) => {
                this.spinner.hide(); //==== hide spinner
                this.alertHelper
                  .successAlert(
                    "Saved!",
                    "Question created successfully.",
                    "success"
                  )
                  .then(() => {
                    this.route.navigate(["./../viewQuestion"], {
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
              complete: () => console.log('done'),
            });
        }
      });
    }

  }

  initializeForm(){
    this.questionForm = this.formBuilder.group({
       questionCategory: [this.questionCategory, Validators.required],
       schoolCategory: [this.schoolCategory, ""],
       inspQuestion:[this.inspQuestion,[Validators.required, Validators.maxLength(400)]],
       isMandatory: [this.isMandatory, ""],
       inputType: [this.inputType, Validators.required],
       inputUnit: [this.inputUnit, ""],
       inputLength: [this.inputLength, ""],
       serialNumber: [this.serialNumber, Validators.required],

    });    
  }

  getSchoolCategory(){
    this.schoolCatagoryChanged = true;
    this.schoolCatData = [];  
    this.ManageQuestionService.getSchoolCategory().subscribe((res)=>{
      this.posts = res;
      let data: any = res;
      for (let key of Object.keys(data['data'])) {
        this.schoolCatData.push(data['data'][key]);
      } 
      this.schoolCatagoryChanged = false;
     });  
  }

  showHide(){
    let inputTypeVal = this.questionForm.controls["inputType"]?.value;
    if( inputTypeVal== 1 || inputTypeVal == 2){
      this.ifNormalInput = false;
      this.ifOptionInput = true;
    }else if( inputTypeVal== 3 || inputTypeVal == 4) {
      this.ifNormalInput = true;
      this.ifOptionInput = false;
    }else{
      this.ifNormalInput = false;
      this.ifOptionInput = false;
    }
  }

  addRow2() {
      this.sectionList2.push(this.newAttribute2); 
  } 
  removeRow2(index:any) {
      this.sectionList2.splice(index, 1);
  }

}
