import { Component, ElementRef, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertHelper } from 'src/app/core/helpers/alert-helper';
import { CustomValidators } from 'src/app/shared/validations/custom-validators';
import { GeofencingService } from '../services/geofencing.service';
import { NgxSpinnerService } from "ngx-spinner";
import { Constant } from 'src/app/shared/constants/constant';
import { PrivilegeHelper } from 'src/app/core/helpers/privilege-helper';
import { CommonserviceService } from 'src/app/core/services/commonservice.service';
@Component({
  selector: 'app-edit-configure-geofencing',
  templateUrl: './edit-configure-geofencing.component.html',
  styleUrls: ['./edit-configure-geofencing.component.css']
})
export class EditConfigureGeofencingComponent implements OnInit {
  editGeoFencingForm!: FormGroup;
  submitted = false;
  id: number = 0;
  categoryData: any;
  GeoFencingValue: any = "";
  encId: any = "";
  annexType: any = "";
  allErrorMessages: string[] = [];
  allLabel: any = ["Update geo fencing distance","",""];
  anxtGeoType: any;
  anextureTypeData: any;
  plPrivilege:string="view"; //For menu privilege
  config = new Constant();
  adminPrivilege: boolean = false;

  constructor(public customValidators: CustomValidators,
    private FormBuilder: FormBuilder,
    public geofencingservice: GeofencingService,
    private route: Router,
    private privilegeHelper: PrivilegeHelper,   //For menu privilege
    private router: ActivatedRoute,
    private alertHelper: AlertHelper, 
    private spinner: NgxSpinnerService,
    private el:ElementRef,
    public commonserviceService: CommonserviceService, 
   ) {const pageUrl:any = this.route.url;  
    this.plPrivilege = this.privilegeHelper.PrimaryLinkPrivilege(pageUrl);  //For menu privilege    
    this.commonserviceService.verifyLinkPermission(pageUrl, this.config.linkType[2], this.config.privilege[4]);  // For authorization   
  }

    
  ngOnInit(): void {
    if(this.plPrivilege=='admin'){
      this.adminPrivilege = true;
    }
    this.initializeForm();
    this.anxtGeoType = "Geo Fencing Distance";
    this.geofencingservice.getGeoFencingData(this.id).subscribe((data: any = []) => {
      this.anextureTypeData = data.data;
      this.GeoFencingValue = this.anextureTypeData.anxtValue;
    
      this.initializeForm();
      this.el.nativeElement.querySelector("[formControlName=GeoFencingValue]").focus();

      
    });
  }
  initializeForm() {
    this.editGeoFencingForm = this.FormBuilder.group({
      GeoFencingValue: [
        this.GeoFencingValue,
        [Validators.required,Validators.maxLength(9),Validators.minLength(1)]
      ],
      encId: [this.encId],
      annexType: [this.annexType],
    });
  }
  getGeoFencingControl(){
    return this.editGeoFencingForm.controls;
  }
  onSubmit() {
    // if ("INVALID" === this.editGeoFencingForm.status) {
    //   for (const key of Object.keys(this.editGeoFencingForm.controls)) {
    //     if (this.editGeoFencingForm.controls[key].status === "INVALID") {
    //       const invalidControl = this.el.nativeElement.querySelector(
    //         '[formControlName="' + key + '"]'
    //       );
    //       invalidControl.focus();
    //       this.customValidators.formValidationHandler(this.editGeoFencingForm,this.allLabel);
    //       break;
    //     }
    //   }
    // }

    if (this.editGeoFencingForm.invalid) {
      this.customValidators.formValidationHandler(this.editGeoFencingForm, this.allLabel, this.el);
    }

    if (this.editGeoFencingForm.invalid) {
      return;
    }

    if (this.editGeoFencingForm.valid === true) {
      this.alertHelper.updateAlert().then((result) => {
        if (result.value) {
          this.spinner.show();
          this.geofencingservice
            .updateGeoFencingData(this.editGeoFencingForm.value)
            .subscribe({
              next: (res: any) => {
                this.spinner.hide();
                this.alertHelper
                  .successAlert(
                    "Saved!",
                    "Geofencing value updated successfully",
                    "success"
                  )
                  .then(() => {
                   
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

 

