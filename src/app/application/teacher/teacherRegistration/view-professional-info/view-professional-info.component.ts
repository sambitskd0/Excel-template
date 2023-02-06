import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { CommonFunctionHelper } from 'src/app/core/helpers/common-function-helper';
import { ViewdetailsService } from '../../services/viewdetails.service';

@Component({
  selector: 'app-view-professional-info',
  templateUrl: './view-professional-info.component.html',
  styleUrls: ['./view-professional-info.component.css']
})
export class ViewProfessionalInfoComponent implements OnInit {
  teacherId: any = "";
  professionInfoDatas: any = "";  
  professionalDataEmpty: boolean = false;  
  constructor(
    private spinner: NgxSpinnerService,
    private viewDetailsService: ViewdetailsService,
    private router: ActivatedRoute,   
    public commonFunctionHelper: CommonFunctionHelper) { }

  ngOnInit(): void {
    this.teacherId = this.router.snapshot.params["id"]; 
    this.viewTeacherProfessionalInfo(this.teacherId);
  }
  viewTeacherProfessionalInfo(encId :any){
    this.spinner.show();
    this.viewDetailsService
      .viewTeacherProfessionalInfo(encId)
      .subscribe((res: any) => {
        this.professionInfoDatas = res.data;  
        ( this.professionInfoDatas.length > 0)? this.professionalDataEmpty = false : this.professionalDataEmpty = true;         
        this.spinner.hide();
      });
  }

}
