import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatSnackBar } from "@angular/material/snack-bar";
import { NgxSpinnerService } from 'ngx-spinner';
import { AlertHelper } from 'src/app/core/helpers/alert-helper';
import { CommonserviceService } from 'src/app/core/services/commonservice.service';
import { StudentInformationService } from '../services/student-information.service';

@Component({
  selector: 'app-report-card',
  templateUrl: './report-card.component.html',
  styleUrls: ['./report-card.component.css']
})
export class ReportCardComponent implements OnInit {

  public userProfile = JSON.parse(
    sessionStorage.getItem("userProfile") || "{}"
  );

  @Output("parentSrchFun") parentSrchFun: EventEmitter<any> = new EventEmitter();
  @ViewChild("context1") context1 ! : any;
  @Input() modalReportCard: any = "";
  rportCardData: any = {};
  today = new Date();

  model: any = {};

  rcls : any = {1:'I',2:'II',3:'III',4:'IV',5:'V',6:'VI',7:'VII',8:'VIII',9:'IX',10:'X',11:'XI',12:'XII'}
  subjects : any = [];
  markSubjects : any = [];
  totSecoured : any = [];
  stdConInfoData : any = [];

  scholarshipStatus : any = "";

  formData: Object = {};

  ratingArr: any = [];
  starCount: number = 3;
  snackBarDuration: number = 2000;
  ratingUpdated = new EventEmitter();
  rating: number = 0;
  @ViewChild('reportCardClose') reportCardClose!:any;
  constructor(
    private snackBar: MatSnackBar,
    private alertHelper:AlertHelper,
    private spinner: NgxSpinnerService, 
    private studentServices: StudentInformationService,
    private commonService: CommonserviceService,
  ) { }

  ngOnInit(): void {
    this.userProfile = this.commonService.getUserProfile();
    this.model = [];
    this.ratingArr = [];
    for (let index = 0; index < this.starCount; index++) {
      this.ratingArr.push(index);
    }

    this.formData = {
      stdId: '',
      indicator: [],
      context: []
    }
  }

  ngOnChanges(changes: SimpleChanges): void {    
    // console.log("userProfile::::",this.userProfile);    
    if (changes["modalReportCard"]?.firstChange === false) {
      this.modalReportCard = changes["modalReportCard"]?.currentValue;
      console.log('modalReportCard',this.modalReportCard);
      this.subjects = Object.keys(this.modalReportCard.subjects);
      this.markSubjects = Object.keys(this.modalReportCard.markSubjects);
      this.totSecoured = Object.keys(this.modalReportCard.totSecoured); 
      if(this.modalReportCard.scholarshipStatus){
        this.scholarshipStatus = this.modalReportCard.scholarshipStatus;
      }
      if(this.modalReportCard?.stdConInfoData?.length>0){
        this.stdConInfoData = Object.keys(this.modalReportCard.stdConInfoData);   
      }     
      if(this.subjects?.length>0){
        this.subjects.forEach((subId:any) => {
          this.modalReportCard?.indicators[subId]['indIds'].forEach((item:any) => {
            this.model[item] = this.modalReportCard?.stdIndInfoData?.[item]; 
          });  
        });
        // console.log("Item::::",this.model);        
      }   
    }
  }

  // star icon
  starIconHandler(index: number) {
    if (this.rating >= index + 1) {
      return "star";
    } else {
      return "star_border";
    }
  }
  // star count
  starCountHandler(rating: number) {
    this.rating = rating;
  }

  ratingComponentClick($event:any){
    this.model[$event.itemId] = $event.rating;   
  }

  submitReportCard(progressReportCardForm: NgForm ) : void {
    // console.log(progressReportCardForm.value.context);
    // console.log(this.model);
    // console.log(this.modalReportCard,"MODAL REPORT CARD");
    // console.log(this.modalReportCard.stdEncId,"STUDENT ID");

    const param = {
      'scholarshipStatus':progressReportCardForm.value.scholarshipStatus,
      'indicators' : this.model,
      'context': progressReportCardForm.value.context,
      'stdEncId':this.modalReportCard.stdEncId,
      'class':this.modalReportCard.class,
      'school':this.modalReportCard.school,
      'academicYear' : this.modalReportCard.academicYear,
      'sessionValue'  : this.userProfile,
    }

    if(progressReportCardForm.valid == true){
      this.alertHelper.submitAlert().then((result) => {
        if(result.value){
          this.spinner.show();
          this.studentServices.saveStudentListReoprtCard(param).subscribe({
            next: (res: any) => {
              this.spinner.hide();
              this.alertHelper.successAlert(
                "Saved!",
                "Student report card data saved successfully.",
                "success"
              ).then(()=>{
                this.reportCardClose.nativeElement.click();
                // this.initializeForm();
                this.parentSrchFun.emit();
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

  

}
