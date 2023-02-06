import { Component, ElementRef, OnInit } from '@angular/core';
import { CommonserviceService } from 'src/app/core/services/commonservice.service';
import { FormGroup, FormBuilder } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { ClasstaggingService } from '../services/classtagging.service';
import { Constant } from 'src/app/shared/constants/constant';
import { PrivilegeHelper } from 'src/app/core/helpers/privilege-helper';
import { Router } from '@angular/router';


@Component({
  selector: 'app-viewclasstagging',
  templateUrl: './viewclasstagging.component.html',
  styleUrls: ['./viewclasstagging.component.css']
})
export class ViewclasstaggingComponent implements OnInit {
  public show:boolean = true;
  public buttonName:any = 'Show';
  anexType:any; 
  schlTypeId:any=""; 
  anextureTypedata:any;
  isEmpty: boolean = false;
  classTaggingdata:any;
  classTaggingSearchform!:FormGroup;
  plPrivilege:string="view"; //For menu privilege
  config = new Constant();
  adminPrivilege: boolean = false;
  constructor(public commonserviceService: CommonserviceService, 
    private formBuilder: FormBuilder,
    private spinner: NgxSpinnerService,
    private privilegeHelper: PrivilegeHelper,   //For menu privilege
    private router:Router,
    private el:ElementRef,
    private classtaggingService :ClasstaggingService) { 
      const pageUrl:any = this.router.url;  
    this.plPrivilege = this.privilegeHelper.PrimaryLinkPrivilege(pageUrl);  //For menu privilege    
    this.commonserviceService.verifyLinkPermission(pageUrl, this.config.linkType[2], this.config.privilege[1]);  // For authorization
    }

  ngOnInit(): void {
    if(this.plPrivilege=='admin'){
      this.adminPrivilege = true;
    }
    this.anexType="SCHOOL_CATEGORY_TYPE";
    this.commonserviceService.getAnextureType(this.anexType).subscribe((data:any=[]) => {
      this.anextureTypedata = data;
      this.anextureTypedata = this.anextureTypedata.data;
    });
    // this.el.nativeElement.querySelector("[formControlName=schlTypeId]").focus();
    this.initializeForm();
    this.loadClassTagging(); 
  }
  initializeForm(){
    this.classTaggingSearchform = this.formBuilder.group({
      schlTypeId: [this.schlTypeId],
    });
  }
  loadClassTagging(){
    this.spinner.show(); // ==== show spinner
    this.classtaggingService.viewClassTagging(this.classTaggingSearchform.value).subscribe((data:[])=>{
      this.classTaggingdata = data;
      this.classTaggingdata = this.classTaggingdata.data;      
      this.isEmpty = this.classTaggingdata.length > 0 ? false : true; 
      this.spinner.hide(); //==== hide spinner
    }) ;
}


  toggle() {
    this.show = !this.show;
    if(this.show)  
      this.buttonName = "Hide";
    else
      this.buttonName = "Show";
  }
}
