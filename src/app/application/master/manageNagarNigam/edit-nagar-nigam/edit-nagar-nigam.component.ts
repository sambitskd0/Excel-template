import { Component, ElementRef, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { AlertHelper } from 'src/app/core/helpers/alert-helper';
import { PrivilegeHelper } from 'src/app/core/helpers/privilege-helper';
import { CommonserviceService } from 'src/app/core/services/commonservice.service';
import { Constant } from 'src/app/shared/constants/constant';
import { CustomValidators } from 'src/app/shared/validations/custom-validators';
import { ManagenagarnigamService } from '../../services/managenagarnigam.service';

@Component({
  selector: 'app-edit-nagar-nigam',
  templateUrl: './edit-nagar-nigam.component.html',
  styleUrls: ['./edit-nagar-nigam.component.css']
})
export class EditNagarNigamComponent implements OnInit {

  nagarNigamform!: FormGroup;
  id: number = 0;
  optionValue: any;
  submitted = false;
  posts: any;
  allDistrict: any;
  showSpinnerBlock: boolean = false;
  filterChanged: boolean = false;
  blockData: any = [];
  nagarNigamData: any;
  districtId: any;
  blockId: any = "";
  panchayatName: any = "";
  panchayatCode: any = "";
  municipalityName: any = "";
  municipalityCode: any = "";
  nagarType: any;
  encId: any;
  plPrivilege: string = "view"; //For menu privilege
  config = new Constant();
  adminPrivilege: boolean = false;
  allErrorMessages: string[] = [];
  allLabel: string[] = ["","", "Type", "District", "Block", "Panchayat name", "Panchayat code", "Municipality name", "Municipality code", ""];
  userId: any;
  profileId: any;
  districtLoading: boolean = false;
  blockLoading: boolean = false;
  constructor(private formBuilder: FormBuilder,
    private commonserviceService: CommonserviceService,
    private route: Router, private router: ActivatedRoute,
    private alertHelper: AlertHelper,
    private privilegeHelper: PrivilegeHelper,   //For menu privilege
    private managenagarnigamService: ManagenagarnigamService,
    private el: ElementRef,
    public customValidators: CustomValidators, private spinner: NgxSpinnerService) {
    const pageUrl: any = this.route.url;
    this.plPrivilege = this.privilegeHelper.PrimaryLinkPrivilege(pageUrl);  //For menu privilege    
    this.commonserviceService.verifyLinkPermission(pageUrl, this.config.linkType[2], this.config.privilege[4]);  // For authorization

  }

  ngOnInit(): void {
    this.spinner.show();
    if (this.plPrivilege == 'admin') {
      this.adminPrivilege = true;
    }
    const users = this.commonserviceService.getUserProfile();
    this.userId = users?.userId;
    this.profileId = users?.profileId;
    this.districtLoading = true;
    this.commonserviceService.getAllDistrict().subscribe((data: []) => {
      this.posts = data;
      this.allDistrict = this.posts.data;
      this.districtLoading = false;
    });
    this.id = this.router.snapshot.params['encId'];
    this.getDistrict();
    this.getNagarnigam(this.id);
    this.initializeForm();
    this.el.nativeElement.querySelector("[formControlName=nagarType]").focus();
  }

  //GET DISTRICT FUNCTION
  getDistrict() {
    this.commonserviceService.getAllDistrict().subscribe((data: []) => {
      this.posts = data;
      this.allDistrict = this.posts.data;
      this.districtLoading = false;
    });
  }

  //CHANGE NAGAR TYPE
  changeNagarType(nagarType: any) {
    if (nagarType == 1) {
      this.nagarNigamform.patchValue({ districtId: '' });
      this.nagarNigamform.patchValue({ municipalityName: '' });
      this.nagarNigamform.patchValue({ municipalityCode: '' });
    }
    if (nagarType == 2) {
      this.nagarNigamform.patchValue({ districtId: '' });
      this.nagarNigamform.patchValue({ blockId: '' });
      this.nagarNigamform.patchValue({ panchayatName: '' });
      this.nagarNigamform.patchValue({ panchayatCode: '' });
      this.blockData = [];
    }

  }

  // CONDITIONAL VALIDATION
  conditionalValidator(
    predicate: any,
    validator: ValidatorFn,
    errorNamespace: string,
    validationType: string
  ): ValidatorFn {
    return (formControl: any) => {
      let conditionStatus = false;
      let parentValue = parseInt(predicate());

      // 1) if parent empty
      if (!formControl.parent) {
        return null;
      }

      let error = null;

      // validation logic for blockContent
      if (validationType === "blockContent" && parentValue == 2) {
        conditionStatus = true;
      }
      // validation logic for panchayatName
      if (validationType === "panchayatName" && parentValue == 2) {
        conditionStatus = true;
      }
      // validation logic for panchayatCode
      if (validationType === "panchayatCode" && parentValue == 2) {
        conditionStatus = true;
      }
      // validation logic for municipalityName
      if (validationType === "municipalityName" && parentValue == 1) {
        conditionStatus = true;
      }
      // validation logic for municipalityCode
      if (validationType === "municipalityCode" && parentValue == 1) {
        conditionStatus = true;
      }

      // 2) check childs direct parent field
      if (conditionStatus) {
        error = validator(formControl); // validate
      } else {
        error = null;
      }

      // 3) set conditional validation
      if (errorNamespace && error) {
        const customError: any = {}; // custom error property
        customError[errorNamespace] = error;
        error = customError;
      }
      return error;
    };
  }

  initializeForm() {
    this.nagarNigamform = this.formBuilder.group({
      userId: [this.userId],
      profileId: [this.profileId],
      nagarType: [this.nagarType, Validators.required],
      districtId: [this.districtId, Validators.required],
      blockId: [this.blockId,
      [
        this.conditionalValidator(
          () => this.nagarNigamform?.get("nagarType")?.value,
          Validators.required,
          "conditionalValidation",
          "blockContent"
        ),
        Validators.pattern('^[0-9]*$'),
      ],
      ],
      panchayatName: [this.panchayatName,
      [
        this.conditionalValidator(
          () => this.nagarNigamform?.get("nagarType")?.value,
          Validators.required,
          "conditionalValidation",
          "panchayatName"
        ),
        // Validators.pattern(/^[a-zA-Z0-9.',-/ ]*$/), Validators.maxLength(40), Validators.minLength(2), this.customValidators.firstCharValidatorRF
        Validators.pattern('^[a-zA-Z0-9,. ()-]+'), Validators.maxLength(40), Validators.minLength(2), this.customValidators.firstCharValidatorRF
      ],
      ],
      panchayatCode: [this.panchayatCode,
      [
        this.conditionalValidator(
          () => this.nagarNigamform?.get("nagarType")?.value,
          Validators.required,
          "conditionalValidation",
          "panchayatCode"
        ),
        Validators.pattern('^[0-9]*$'), Validators.maxLength(9), Validators.min(1), this.customValidators.firstCharValidatorRF
      ],
      ],
      municipalityName: [this.municipalityName,
      [
        this.conditionalValidator(
          () => this.nagarNigamform?.get("nagarType")?.value,
          Validators.required,
          "conditionalValidation",
          "municipalityName"
        ),
        // Validators.pattern(/^[a-zA-Z0-9.',-/ ]*$/), Validators.maxLength(40), Validators.minLength(2), this.customValidators.firstCharValidatorRF
        Validators.pattern('^[a-zA-Z0-9,. ()-]+'), Validators.maxLength(40), Validators.minLength(2), this.customValidators.firstCharValidatorRF
      ],
      ],
      municipalityCode: [this.municipalityCode,
      [
        this.conditionalValidator(
          () => this.nagarNigamform?.get("nagarType")?.value,
          Validators.required,
          "conditionalValidation",
          "municipalityCode"
        ),
        Validators.pattern('^[0-9]*$'), Validators.maxLength(9), Validators.min(1), this.customValidators.firstCharValidatorRF
      ],
      ],
      encId: [this.encId,]
    });
  }

  //GET NAGAR NIGAM DATA
  getNagarnigam(id: Number) {
    this.managenagarnigamService.getNagarnigam(this.id).subscribe((data: any) => {
      this.nagarNigamData = data;
      this.nagarNigamData = this.nagarNigamData.data;

      this.districtId = this.nagarNigamData.districtId;
      this.encId = this.nagarNigamData.encId;
      this.blockId = this.nagarNigamData.blockId;
      this.nagarType = this.nagarNigamData.nagarType;
      this.optionValue = this.nagarNigamData.nagarType;
      if (this.nagarNigamData.nagarType == 1) {
        this.municipalityName = this.nagarNigamData.panchayatName;
        this.municipalityCode = this.nagarNigamData.panchayatCode;
      }
      else {
        this.panchayatName = this.nagarNigamData.panchayatName;
        this.panchayatCode = this.nagarNigamData.panchayatCode;
      }
      this.getBlock(this.districtId);
      this.initializeForm();
      this.spinner.hide();
    });
  }

  // GET BLOCK ACCORDING TO DISTRICT
  getBlock(id: any) {
    this.filterChanged = true;
    this.showSpinnerBlock = true;
    const districtId = id;

    this.blockData = [];
    this.blockLoading = true;
    if (districtId !== "") {
      this.commonserviceService
        .getBlockByDistrictid(districtId)
        .subscribe((res) => {
          let data: any = res;
          for (let key of Object.keys(data["data"])) {
            this.blockData.push(data["data"][key]);
          }
          this.showSpinnerBlock = false;
          this.filterChanged = false;
          this.blockLoading = false;
        });
    } else {
      this.filterChanged = false;
    }
  }

  // FORM SUBMIT
  onSubmit() {
    this.submitted = true;
    // if ("INVALID" === this.nagarNigamform.status) {
    //   for (const key of Object.keys(this.nagarNigamform.controls)) {
    //     if (this.nagarNigamform.controls[key].status === "INVALID") {
    //       const invalidControl = this.el.nativeElement.querySelector(
    //         '[formControlName="' + key + '"]'
    //       );
    //       invalidControl.focus();
    //       this.customValidators.formValidationHandler(this.nagarNigamform, this.allLabel);
    //       break;
    //     }
    //   }
    // }

    if (this.nagarNigamform.invalid) {
      this.customValidators.formValidationHandler(this.nagarNigamform, this.allLabel, this.el);
    }
    if (this.nagarNigamform.invalid) {
      return;
    }
    if (this.nagarNigamform.valid === true) {
      this.alertHelper
        .updateAlert(
          "Do you want to update?",
          "question",
          "Yes, update it!",
          "No, keep it"
        )
        .then((result) => {
          if (result.value) {
            this.spinner.show(); // ==== show spinner
            this.managenagarnigamService
              .updateNagarNigam(this.nagarNigamform.value)
              .subscribe({
                next: (res: any) => {
                  this.spinner.hide(); //==== hide spinner
                  this.alertHelper
                    .successAlert(
                      "Saved!",
                      "Nagar nigam updated successfully.",
                      "success"
                    )
                    .then(() => {
                      this.route.navigate(["../../viewNagarNigam"], {
                        relativeTo: this.router,
                      });
                    });
                },
                error: (error: any) => {
                  this.spinner.hide(); //==== hide spinner
                },
              });
          }
        });
    }
  }
  onCancel()
  {
    this.route.navigate(["../../viewNagarNigam"], {
      relativeTo: this.router,
    }); 
  }
}
