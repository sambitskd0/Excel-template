import { Component, ElementRef, OnInit } from "@angular/core";
import {
  FormArray,
  FormBuilder,
  FormGroup,
  Validators,
} from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { NgxSpinnerService } from "ngx-spinner";
import { AlertHelper } from "src/app/core/helpers/alert-helper";
import { PrivilegeHelper } from "src/app/core/helpers/privilege-helper";
import { CommonserviceService } from "src/app/core/services/commonservice.service";
import { Constant } from "src/app/shared/constants/constant";
import { CustomValidators } from "src/app/shared/validations/custom-validators";
import { SchoolCategoryService } from "../../services/school-category.service";

@Component({
  selector: "app-edit-category",
  templateUrl: "./edit-category.component.html",
  styleUrls: ["./edit-category.component.css"],
})
export class EditCategoryComponent implements OnInit {
  schoolCategoryForm!: FormGroup; 
  anextureType: any;
  posts: any; 
  anexType: any;
  schoolCategoryName: any;
  submitted = false;
  id: any;
  encId: any;
  userId: any;
  profileId: any;
  schoolTaggingArray: any = [];
  schoolCategoryData: any;
  allErrorMessages: string[] = [];
  allLabel: string[] = ["School category", "School type tagging"];
  plPrivilege:string="view"; //For menu privilege
  config = new Constant();
  adminPrivilege: boolean = false;
  constructor(
    public commonserviceService: CommonserviceService,
    private formBuilder: FormBuilder,
    private route: Router,
    private privilegeHelper: PrivilegeHelper,   //For menu privilege
    private router: ActivatedRoute,
    private schoolCategoryService: SchoolCategoryService,
    private spinner: NgxSpinnerService,
    private alertHelper: AlertHelper,
    public customValidators: CustomValidators,
    private el:ElementRef,
  ) {
    const pageUrl:any = this.route.url;  
    this.plPrivilege = this.privilegeHelper.PrimaryLinkPrivilege(pageUrl);  //For menu privilege    
    this.commonserviceService.verifyLinkPermission(pageUrl, this.config.linkType[2], this.config.privilege[4]);  // For authorization  
  }

  ngOnInit(): void {
    if(this.plPrivilege=='admin'){
      this.adminPrivilege = true;
    }
    const users = this.commonserviceService.getUserProfile();
    this.userId = users?.userId;
    this.profileId = users?.profileId;
    this.anexType = "SCHOOL_TAGGING_TYPE";
    this.commonserviceService
      .getAnextureType(this.anexType)
      .subscribe((data: any = []) => {
        this.posts = data;
        this.anextureType = this.posts.data;
      });
    this.spinner.show();
    this.id = this.router.snapshot.params["encId"];
    this.editschoolCategory(this.id);
    this.el.nativeElement.querySelector("[formControlName=schoolCategoryName]").focus();
    this.initializeForm();
  }
  ngAfterViewInit(){
    this.el.nativeElement.querySelector("[formControlName=schoolCategoryName]").focus();
  }
  initializeForm() {
    this.schoolCategoryForm = this.formBuilder.group({
      schoolCategoryName: [this.schoolCategoryName, [Validators.required,Validators.maxLength(50),Validators.minLength(1),Validators.pattern(/^[a-zA-Z0-9 -./]*$/)]],
      schoolTaggingArray: this.formBuilder.array(this.schoolTaggingArray, Validators.required),
      encId: [this.encId],
      userId:[this.userId],
      profileId:[this.profileId],
    });
  }
  editschoolCategory(id: any) {

    this.schoolCategoryService
      .getSchoolCategory(this.id)
      .subscribe((data: any) => {
        this.schoolCategoryData = data;
        this.schoolCategoryData = this.schoolCategoryData.data;
        this.schoolCategoryData.schooltagging.map((item: any) => {
          this.schoolTaggingArray.push(item.schlTagTypeId);
        });
  
        this.schoolCategoryName = this.schoolCategoryData.schlCatName;
        this.encId = this.schoolCategoryData.encId;
        this.initializeForm();
        this.spinner.hide();
      });
  }
  onCheckboxChange(event: any) {
    
    const schoolTaggingArray: FormArray = this.schoolCategoryForm.get(
      "schoolTaggingArray"
    ) as FormArray;
   
    if (this.schoolTaggingArray.includes(parseInt(event.target.value))) {
      const index = this.schoolTaggingArray.indexOf(
        parseInt(event.target.value),
        0
      );
      if (index > -1) {
        this.schoolTaggingArray.splice(index, 1);
      }

    } else {
      this.schoolTaggingArray.push(parseInt(event.target.value));

    }
    this.initializeForm();
  }
  formCancel(){
    (this.schoolCategoryForm.get("schoolTaggingArray") as FormArray).clear();
    this.route.navigate(["../../viewCategory"], {
      relativeTo: this.router,
    });
  }
  onSubmit() {
    this.submitted = true;
    if (this.schoolCategoryForm.get("schoolCategoryName")?.value =="") {
      this.el.nativeElement.querySelector("[formControlName=schoolCategoryName]").focus();
    }
    if(this.schoolCategoryForm.invalid){
      this.customValidators.formValidationHandler(
        this.schoolCategoryForm,
        this.allLabel,
        this.el
      );
    }
    if (this.schoolCategoryForm.valid === true) {
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
              this.schoolCategoryService
                .updateSchoolCategory(this.schoolCategoryForm.value)
                .subscribe({
                  next: (res: any) => {
                    this.spinner.hide(); //==== hide spinner
                    this.alertHelper
                      .successAlert(
                        "Saved!",
                        "School category updated successfully",
                        "success"
                      )
                      .then(() => {
                        this.route.navigate(["../../viewCategory"], {
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
