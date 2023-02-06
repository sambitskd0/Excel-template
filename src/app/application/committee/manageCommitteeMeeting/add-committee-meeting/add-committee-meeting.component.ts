import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { AlertHelper } from 'src/app/core/helpers/alert-helper';
import { CommonserviceService } from 'src/app/core/services/commonservice.service';
import { CustomValidators } from 'src/app/shared/validations/custom-validators';
import { CommitteeMeetingService } from '../../services/committee-meeting.service';
import { CommitteeMemberService } from '../../services/committee-member.service';
import { ErrorHandler } from "src/app/core/helpers/error-handler";
import { formatDate } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { ActivatedRoute, Router } from '@angular/router';
import { Constant } from 'src/app/shared/constants/constant';
import { PrivilegeHelper } from 'src/app/core/helpers/privilege-helper';
import { CommonFunctionHelper } from 'src/app/core/helpers/common-function-helper';

@Component({
  selector: 'app-add-committee-meeting',
  templateUrl: './add-committee-meeting.component.html',
  styleUrls: ['./add-committee-meeting.component.css']
})
export class AddCommitteeMeetingComponent implements OnInit,AfterViewInit {
  private apiURL = environment.committeeAPI;
  addCommitteeMeetingForm!:FormGroup;

  committeeTypeData: any    = "";
  memberTypeData: any       = "";
  committeeType:any         = "";
  meetingDate:any           = "";
  uploadProceeding:any      = "";
  meetingDiscussion:any     = "";
 
  membersData: any          = [];
  schoolTypeData: any       = "";

  schoolTypeCommitteArr: any    = [];
  schoolType: any               = [];
 
  allLabel: string[] = ["Committee type","Meeting date","Upload proceeding","Meeting discussion","Attending members"];
  userId: any               = "";
  profileId: any               = "";
  school: any               = "";
  loginId: any              = "";
  schoolCategory: any       = "";
  searchAcademicYear: any   = "";
  plPrivilege:string        = "view"; //For menu privilege
  config = new Constant();

  memberRecordArr: any      = [];

  permissionDiv: boolean    = false;
  adminPrivilege: boolean   = false;
  isChecked: boolean        = false;
  tableShow:boolean         = false;
  maxDate: any = Date;

  academicYear: any = this.config.getAcademicCurrentYear();

  constructor(
    private el: ElementRef ,
    private commonFunctionHelper: CommonFunctionHelper,
    private spinner: NgxSpinnerService, 
    private committeeMeetingService:CommitteeMeetingService, 
    private committeeMemberService:CommitteeMemberService, 
    private alertHelper: AlertHelper,
    private privilegeHelper: PrivilegeHelper,   //For menu privilege
    private formBuilder: FormBuilder,
    public commonserviceService: CommonserviceService,
    public customValidators: CustomValidators,
    private router: ActivatedRoute,
    private route: Router,
    
  ) {
    const pageUrl:any = this.route.url;  
    this.plPrivilege = this.privilegeHelper.PrimaryLinkPrivilege(pageUrl);  //For menu privilege    
    this.commonserviceService.verifyLinkPermission(pageUrl, this.config.linkType[2], this.config.privilege[4]); // For authorization
    this.maxDate = new Date();
   }

  ngOnInit(): void {
    if(this.plPrivilege=='admin'){
      this.adminPrivilege = true;
    }
    // this.el.nativeElement.querySelector("[formControlName=committeeType]").focus();

    // GIVING NO ACCESS TO ADMIN
    const users = this.commonserviceService.getUserProfile();
    this.userId = users?.userId;
    this.school = users?.school;
    this.loginId = users?.loginId;
    this.profileId = users?.profileId;
    this.schoolCategory = users?.schoolCategory;
    this.searchAcademicYear = this.academicYear;
    if (users.loginUserTypeId != 3) {
      this.permissionDiv = true;
    } else {
      this.permissionDiv = false;
    }
    //END OF GIVING NO ACCESS TO ADMIN
    this.commonserviceService.getCommonAnnexture(["COMMITTEE_TYPE", "MEMBER_TYPE"]).subscribe((data: any = []) => {
      this.committeeTypeData = data?.data?.COMMITTEE_TYPE;
      this.memberTypeData = data?.data?.MEMBER_TYPE;
    });
    if (users.loginUserTypeId == 2) {
      this.committeeMemberService.getSchoolTypeBySchoolCatId(this.school, this.schoolCategory).subscribe((data: any = []) => {
          this.schoolType = data?.data;
          /* let schoolTypeCheck = ["2"];
          if (this.schoolType.length == 1) {
            this.schoolTypeData = this.schoolType.filter((item: any) => {
              if (schoolTypeCheck.includes(item.schoolType)) {
                this.schoolTypeCommitteArr = [{'id': 1,'committeeType':'SMC'}];
              } else {
                this.schoolTypeCommitteArr = [{'id': 1,'committeeType':'SMC'},{'id': 2, 'committeeType': 'SMDC'}];
              }
            });
          } else {
            this.schoolTypeCommitteArr = [{'id': 1,'committeeType':'SMC'},{'id': 2, 'committeeType': 'SMDC'}];
          } */
          this.schoolTypeCommitteArr = [{ 'id': 1, 'committeeType': 'School Management Committee' }, { 'id': 2, 'committeeType': 'School Management Development Committee' }];
      });
    }
    this.initializationForm();
  }
  ngAfterViewInit(){
    this.el.nativeElement.querySelector("[formControlName=committeeType]").focus();
  }
  initializationForm(){
    this.addCommitteeMeetingForm = this.formBuilder.group({
      committeeType:[this.committeeType,[Validators.required]],
      meetingDate:[this.meetingDate,[Validators.required]],
      uploadProceeding:[this.uploadProceeding,[Validators.required]],
      meetingDiscussion:[this.meetingDiscussion,[Validators.required,Validators.maxLength(800),this.customValidators.firstCharValidatorRF]],
      memberRecordArr: this.formBuilder.array([], [Validators.required])
    })
  }
  committeeTypeChange(committeeType:any){
    if(committeeType > 0){
      this.committeeMemberService.viewMembers({'committeeType':committeeType,'schoolId':this.school,'academicYear':this.searchAcademicYear}).subscribe((res:any)=>{
        this.membersData = res?.data;
        this.tableShow=true;
      })
    }else{
      this.tableShow=false;
      this.membersData = [];

    }
   
  }
 /*  committeeTypeCheck(cntrlName:any,msg:any){
    let typeVal = this.addCommitteeMeetingForm?.get(cntrlName)?.value;
    if(typeVal == "" ){
            this.alertHelper.viewAlert("error","Invalid",msg)
            .then((res: any) => {
              const invalidControl = this.el.nativeElement.querySelector(
                '[formControlName="' + cntrlName + '"]'
              );
              invalidControl.focus();
            }); 
        }
  } */
  
  eventDateValidation(){ 
    
    let eventDate = this.commonFunctionHelper.formatDateHelper(this.addCommitteeMeetingForm.get('meetingDate')?.value);
    const newDate = new Date();     
    if (formatDate(eventDate,'yyyy-MM-dd','en_US') > formatDate(newDate,'yyyy-MM-dd','en_US')){
      this.alertHelper.viewAlert(
        "error",
        "Event date should not be greater than today's date"
      );
      this.addCommitteeMeetingForm.patchValue({
        eventDate: ''
    });
    }
  }
  //checkBox Check Uncheck 
  onCheckboxChange(event: any) {
    //  compulsory
    const memberRecordArr: FormArray = this.addCommitteeMeetingForm.get('memberRecordArr') as FormArray;
     const index = this.memberRecordArr.indexOf(parseInt(event.target.value),0)
          if(event.target.checked){
            memberRecordArr.push(new FormControl(event.target.value));
          }else{
          const index = memberRecordArr.controls.findIndex(x => x.value === event.target.value);
          memberRecordArr.removeAt(index);
          }  
  }

  // file upload validation
  fileUploadHandler(event: any) {
    const meetingDoc = event.target.files[0];
    if(meetingDoc != null){
      if (meetingDoc.type != 'image/png' && meetingDoc.type != 'image/jpg' && meetingDoc.type != 'image/jpeg' && meetingDoc.type != 'image/gif' && meetingDoc.type != 'application/pdf') {
        this.alertHelper.viewAlertHtml(
          "error",
          "Error",
          '<i class="bi bi-arrow-right text-danger"></i> File type should be png, jpg, jpeg or pdf file'
        );
        this.addCommitteeMeetingForm.patchValue({ uploadProceeding: '' });
        return;
      }

      if (meetingDoc.size >= (1024 * 1024 * 2)) {      
        this.alertHelper.viewAlertHtml(
          "error",
          "Error",
          '<i class="bi bi-arrow-right text-danger"></i> File size should not be greater than 2 MB'
        );
        this.addCommitteeMeetingForm.patchValue({ uploadProceeding: '' });
        return;
      }
      
      this.uploadProceeding = event.target.files[0];
    }
  }
  addCommitteeMeeting(){
    // this.customValidators.formValidationHandler(this.addCommitteeMeetingForm,this.allLabel);

    // if ("INVALID" === this.addCommitteeMeetingForm.status) {
    //   for (const key of Object.keys(this.addCommitteeMeetingForm.controls)) {
    //     if (this.addCommitteeMeetingForm.controls[key].status === "INVALID") {
    //       const invalidControl = this.el.nativeElement.querySelector(
    //         '[formControlName="' + key + '"]'
    //       );
    //       invalidControl.focus();
    //       this.customValidators.formValidationHandler(this.addCommitteeMeetingForm,this.allLabel);
    //       break;
    //     }
    //   }
    // }

    if (this.addCommitteeMeetingForm.invalid) {
      // this.customValidators.formValidationHandler(this.addCommitteeMeetingForm, this.allLabel, this.el);
      this.customValidators.formValidationHandler(
        this.addCommitteeMeetingForm,
        this.allLabel,
        this.el,
        {
          required: {
            committeeType:"Please select committee type",
            meetingDate: `Please enter meeting date`,
            uploadProceeding:`Please upload meeting proceeding`,
            meetingDiscussion: `Please enter meeting discussion points`,
            memberRecordArr: `Please select the members present in the meeting`,
          },
        }
      );
    }

    if (this.addCommitteeMeetingForm.invalid) {
      return;
    }
    const users = this.commonserviceService.getUserProfile();

    if (this.addCommitteeMeetingForm.valid === true) {
      this.alertHelper.submitAlert().then((result) => {
        if (result.value) {
        
          const formData = new FormData();
          formData.append('profileId',users?.profileId);
          formData.append('userId',users?.userId);
          formData.append('school',users?.school);
          formData.append('loginId',users?.loginId);
          formData.append('schoolCategory',users?.schoolCategory);
          formData.append('udiseCode',users?.udiseCode);
          formData.append('block',users?.block);
          formData.append('academicYear',this.academicYear);
          formData.append('committeeType',this.addCommitteeMeetingForm.get('committeeType')?.value);
          formData.append('meetingDate', this.commonFunctionHelper.formatDateHelper(this.addCommitteeMeetingForm.get('meetingDate')?.value));
          formData.append('meetingDiscussion',this.addCommitteeMeetingForm.get('meetingDiscussion')?.value);
          formData.append('memberAttendArr',this.addCommitteeMeetingForm.get('memberRecordArr')?.value);
          formData.append('uploadProceeding', this.uploadProceeding);
 
          this.committeeMeetingService.addMembersAttendMeeting(formData).subscribe({
            next: (res: any) => {
              this.spinner.hide();
              this.alertHelper.successAlert(
                "Saved!",
                "Committee meeting details saved successfully",
                "success"
              ).then(()=>{
                this.addCommitteeMeetingForm.patchValue({
                  uploadProceeding: ""
                });
                this.addCommitteeMeetingForm.patchValue({
                  meetingDiscussion: ""
                });
                this.route.navigate(["./../viewCommitteeMeeting"], {
                  relativeTo: this.router,
                });
                this.initializationForm();
                this.tableShow=false;
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
  resetTakeAction(){
    this.initializationForm();
    this.addCommitteeMeetingForm.patchValue({
      meetingDiscussion: ""
    });
    this.addCommitteeMeetingForm.patchValue({
      uploadProceeding: ""
    });
    this.tableShow=false;
  }
}
