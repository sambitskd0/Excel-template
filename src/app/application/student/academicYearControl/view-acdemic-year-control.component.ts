import { Component, ElementRef, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { AlertHelper} from 'src/app/core/helpers/alert-helper';
import { PrivilegeHelper } from 'src/app/core/helpers/privilege-helper';
import { CommonserviceService } from 'src/app/core/services/commonservice.service';
import { Constant } from 'src/app/shared/constants/constant';
import { CustomValidators } from 'src/app/shared/validations/custom-validators';

@Component({
  selector: 'app-view-acdemic-year-control',
  templateUrl: './view-acdemic-year-control.component.html',
  styleUrls: ['./view-acdemic-year-control.component.css']
})
export class ViewAcdemicYearControlComponent implements OnInit {

  acdemicYearcheck!: FormGroup;
  plPrivilege: string = "view"; //For menu privilege
  config = new Constant();
  academicYear: any = this.config.getAcademicCurrentYear();
  adminPrivilege: boolean = false;

  currentAcademicYear :any = "";
  academicVal: any = 1;
  constructor(
    private formBuilder:FormBuilder,
    private alertHelper:AlertHelper,
    public customValidator:CustomValidators,
    public customValidators: CustomValidators,
    private spinner: NgxSpinnerService, 
    public commonserviceService:CommonserviceService,
    private router:Router,
    private privilegeHelper: PrivilegeHelper,   //For menu privilege  
    private el:ElementRef,
  ) { }

  ngOnInit(): void {
    this.currentAcademicYear = this.academicYear;
    this.initializeform();
  }
  initializeform() {
    this.acdemicYearcheck = this.formBuilder.group({
      academicVal: [this.academicVal, [Validators.required,Validators.pattern('^[0-9.]*$'), ]],
    
    });
  }

  onSubmit(){

  }

}
