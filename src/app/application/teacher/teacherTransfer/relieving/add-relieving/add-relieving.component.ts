import { Component, OnInit } from '@angular/core';
import { CommonserviceService } from "src/app/core/services/commonservice.service";
import { SchoolService } from '../../../../school/services/school.service';
import { NgxSpinnerService } from "ngx-spinner";
import{ TeacherTransferService } from '../../../services/teacher-transfer.service';

@Component({
  selector: 'app-add-relieving',
  templateUrl: './add-relieving.component.html',
  styleUrls: ['./add-relieving.component.css']
})
export class AddRelievingComponent implements OnInit {

  scDisrtictSelect: boolean = true;
  scDisrtictLoading: boolean = false;
  districtData: any = "";
  public userProfile = this.commonService.getUserProfile();
  searchDistrictData: any = [];
  searchBlockId:any  = "";
  scBlockSelect: boolean = true;
  scBlockLoading: boolean = false;
  searchBlockData: any = [];
  clusterData: any = "";
  getSchoolData: any = "";
  scClusterSelect: boolean = true;
  scClusterLoading: boolean = false;
  scSchoolSelect: boolean = true;
  scSchoolLoading: boolean = false;
  schoolCatData:any = [];
  schoolCatagoryChanged:boolean = false;
  posts: any;
  teacherTitles: any = "";
  teacherTitleChanged: boolean = false;
  searchTeacherTitle:any  = "";
  teacherList: any = "";
  teacherId: any = "";
  userSchoolid: string = "";
  hmType: number = 0;
  teacherChanged:boolean = false;
  constructor(private commonService: CommonserviceService,private schoolService:SchoolService,private spinner: NgxSpinnerService,
		private transferService: TeacherTransferService) { }

  ngOnInit(): void {
    this.getDistrict();
    this.getBlock(this.userProfile.district);
    this.getCluster(this.userProfile.block);
    this.getSchool(this.userProfile.cluster);
    this.getSchoolCategory();
    this.getAnnextureDataBySeq();
    this.getTeachersList(this.userProfile.school);
    this.userSchoolid = this.userProfile.school;
  }

  getDistrict() {
    this.scDisrtictSelect = false;
    this.scDisrtictLoading = true;
    this.commonService.getAllDistrict().subscribe((data: any) => {
      this.districtData = data;
      this.districtData = this.districtData.data;

      if (this.userProfile.district != 0 || this.userProfile.district != "") {
        this.searchDistrictData = this.districtData.filter((dis: any) => {
          return dis.districtId == this.userProfile.district;
        });
        
        this.getBlock(this.userProfile.district);
      } else {
        this.searchDistrictData = this.districtData;
        this.scDisrtictSelect = true;
      }
      // console.log(this.searchDistrictData,"===========");
      this.searchBlockId = "";
      this.scDisrtictLoading = false;
    });
  }
  getBlock(districtId: any) {
    this.scBlockSelect = false;
    this.scBlockLoading = true;

    this.searchBlockData = [];
    this.clusterData = [];
    

    this.getSchoolData = [];
    

    if (districtId !== "") {
      this.commonService
        .getBlockByDistrictid(districtId)
        .subscribe((res: any) => {
          this.searchBlockData = res;
          this.searchBlockData = this.searchBlockData.data;

          if (this.userProfile.block != 0 || this.userProfile.block != "") {
            this.searchBlockData = this.searchBlockData.filter((blo: any) => {
              return blo.blockId == this.userProfile.block;
            });
            // this.teacherSearchForm.controls["searchBlockId"]?.patchValue(
            //   this.userProfile.block
            // );
            this.getCluster(this.userProfile.block);
          } else {
            this.scBlockSelect = true;
          }
          this.scBlockLoading = false;
        });
    } else {
      this.scBlockSelect = true;
      this.scBlockLoading = false;
    }

    
  }

  getCluster(blockId: any) {
    this.scClusterSelect = false;
    this.scClusterLoading = true;

    this.clusterData = [];
    

    this.getSchoolData = [];
    

    if (blockId !== "") {
      this.commonService.getClusterByBlockId(blockId).subscribe((res: any) => {
        this.clusterData = res;
        this.clusterData = this.clusterData.data;

        if (this.userProfile.cluster != 0 || this.userProfile.cluster != "") {
          this.clusterData = this.clusterData.filter((clu: any) => {
            return clu.clusterId == this.userProfile.cluster;
          });
          
          this.getSchool(this.userProfile.cluster);
        } else {
          this.scClusterSelect = true;
        }
        this.scClusterLoading = false;
      });
    } else {
      this.scClusterSelect = true;
      this.scClusterLoading = false;
    }
  }

  getSchoolCategory(){
    this.schoolCatagoryChanged = true;
    this.schoolCatData = [];  
    this.schoolService.getSchoolCategory().subscribe((res)=>{
      this.posts = res;
      let data: any = res;
      for (let key of Object.keys(data['data'])) {
        this.schoolCatData.push(data['data'][key]);
      } 
      this.schoolCatagoryChanged = false;
     });  
  }

  getSchool(clusterId: any) {
    this.scSchoolSelect = false;
    this.scSchoolLoading = true;

    this.getSchoolData = [];
    
    if (clusterId !== "") {
      this.commonService.getSchoolList(clusterId).subscribe((res: any) => {
        this.getSchoolData = res;
        this.getSchoolData = this.getSchoolData.data;

        if (
          this.userProfile.udiseCode != 0 ||
          this.userProfile.udiseCode != ""
        ) {
          this.getSchoolData = this.getSchoolData.filter((sch: any) => {
            return sch.schoolUdiseCode == this.userProfile.udiseCode;
          });
        } else {
          this.scSchoolSelect = true;
        }
        this.scSchoolLoading = false;
      });
    } else {
      this.scSchoolSelect = true;
      this.scSchoolLoading = false;
    }
    // console.log(this.getSchoolData);
  }



  getAnnextureDataBySeq() {
    this.commonService
      .getCommonAnnexture([
        "TEACHER_TITLE",
        "NATURE_OF_APPOINTMENT",
               
      ],true)
      .subscribe({
        next: (res: any) => {
          this.spinner.hide();
          this.teacherTitles = res?.data?.TEACHER_TITLE;
        },
      });
  }
  getTeachersList(schoolId: any) {
		this.teacherId = "";
		this.teacherChanged = true;
		this.teacherList = [];
		if (this.userSchoolid != "0") {
			this.hmType = 0; //Teacher only
		} else {
			this.hmType = 2; //HM only
		}
		this.transferService.getTeachersList(
			schoolId,
			this.hmType
		).subscribe((res: any) => {
			let data: any = res;
			for (let key of Object.keys(data["data"])) {
				this.teacherList.push(data["data"][key]);
			}
			this.teacherChanged = false;
		});
	}
}
