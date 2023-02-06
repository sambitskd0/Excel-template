import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { SchoolService } from '../services/school.service';
import { Constant } from "src/app/shared/constants/constant";

@Component({
  selector: 'app-basic-info',
  templateUrl: './basic-info.component.html',
  styleUrls: ['./basic-info.component.css']
})
export class BasicInfoComponent implements OnInit {

  encId:string='';
  config = new Constant();
  academicYear:any = this.config.getAcademicCurrentYear();
  schoolInfo : any = [];

  constructor(
    private router : ActivatedRoute,
    private spinner : NgxSpinnerService,
    private schoolService : SchoolService,
  ) { }

  ngOnInit(): void {
    this.encId = this.router.snapshot.params["encId"];
    this.getSchoolInfo(this.encId,this.academicYear);
  }

  getSchoolInfo(encId: any,academicYear:any){
    this.spinner.show();
    this.schoolService.getSchoolInfo(encId,academicYear).subscribe((res:any)=>{
      this.schoolInfo = res.data[0];
        //console.log(encId);
       // console.log(this.schoolInfo.encId);
       // console.log(this.schoolInfo.schoolId);
      this.spinner.hide();
    })      
    
  }

}
