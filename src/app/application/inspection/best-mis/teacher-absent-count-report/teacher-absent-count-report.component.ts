import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild, ElementRef, Input } from "@angular/core";
import { FormGroup, FormBuilder, Validators, NgForm } from "@angular/forms";
import { CommonserviceService } from "src/app/core/services/commonservice.service";
import { Location } from '@angular/common'
import { NgxSpinnerService } from "ngx-spinner";
import { DataTableDirective } from "angular-datatables";
import { Subject } from "rxjs";
import { AlertHelper } from 'src/app/core/helpers/alert-helper';
import { ngxCsv } from "ngx-csv/ngx-csv";
import { InspectionMisService } from "../../services/inspection-mis.service";
import { RegistrationService } from "src/app/application/teacher/services/registration.service";
import { HttpClient } from "@angular/common/http";
import { ActivatedRoute, Router } from "@angular/router";
import { ProgressBarMode } from "@angular/material/progress-bar";
import { MatSort } from "@angular/material/sort";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableExporterDirective } from "mat-table-exporter";
import { MatTableDataSource } from "@angular/material/table";
import { formatDate } from '@angular/common';
import { environment } from "src/environments/environment";
import { ManageUserService } from "src/app/application/user/services/manage-user.service";

@Component({
  selector: 'app-teacher-absent-count-report',
  templateUrl: './teacher-absent-count-report.component.html',
  styleUrls: ['./teacher-absent-count-report.component.css']
})
export class TeacherAbsentCountReportComponent implements OnInit {
  public fileUrl1 = environment.filePath;
  public show:boolean = true;
  public buttonName:any = 'Show';

  displayTable: boolean = false;
  questSearchform!: FormGroup;
  SearchformId!: FormGroup;
  isLoading = false;
  isNorecordFound: boolean = false;
  tattenlength: boolean = false;
  pageIndex: any = 0;
  previousSize: any = 0;
  // mat table
  @Input() mode!: ProgressBarMode;
  @ViewChild("searchForm") searchForm!: NgForm;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatTableExporterDirective, { static: true })
  exporter!: MatTableExporterDirective;
  pageSize = 10;
  offset = 0;
  currentPage = 0;
  totalRows = 0;
  pageSizeOptions: number[] = [10, 25, 100];
  

  resultListData: any = [];
  resultListDatas: any = [];
  questionDetailsData!: any;
  dataSource = new MatTableDataSource(this.resultListData);
  //end
  bodyData: any; @ViewChild(DataTableDirective, { static: false })
  datatableElement!: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  scDisrtictChanged: boolean = false;
  districtData: any;
  userProfile = this.commonService.getUserProfile();
  userType = this.userProfile.userType;
  userId = this.userProfile.userId;
  sessionDistrictId: any =
    this.userProfile.district != 0 ? this.userProfile.district : "";
  sessionBlockId: any =
    this.userProfile.block != 0 ? this.userProfile.block : "";
  sessionClusterId: any =
    this.userProfile.cluster != 0 ? this.userProfile.cluster : "";
  sessionSchoolId: any =
    this.userProfile.school != 0 ? this.userProfile.school : "";
  scBlockChanged: boolean = false;
  blockData: any = [];
  scClusterChanged: boolean = false;
  desgNameChanged: boolean = false;
  scDesgChanged: boolean = false;
  clusterData: any;
  scSchoolChanged: boolean = false;
  getSchoolData: any;
  inspectionListData: any;
  emptyCheck: boolean = false;
  isInitAdmin: boolean = false;
  tev: boolean = false;
  scDistrictId: any = "";
  scBlockId: any = "";
  scClusterId: any = "";
  schoolId: any = "";
  schoolUdiseCode: any = "";
  desList: any = "";
  datas: any;
  tatten: any;
  absentTeacherList: any;
  studentAttendence: any;
  questionList: any;
  answerList: any;
  datasd: any;
  startDate: any;
  desgName: any;
  endDate: any;
  maxDate: any = Date;
  numOfVisetedSchool: any;
  numOfVisit: any;
  openPer: any;
  pageLevel: any;
  totalAbsentTeacher: any;
  noActionTaken: any;
  eskAsk: any;
  eskSatis: any;
  salaryDed: any;
  eskNoRec: any;
  scDisrtictSelect:boolean = true; 
	scDisrtictLoading:boolean = false; 
	scBlockSelect:boolean = true; 
	scBlockLoading:boolean = false; 
	scClusterSelect:boolean = true;
	scClusterLoading:boolean = false;
	scSchoolSelect:boolean = true;
	scSchoolLoading:boolean = false; 
  absentTeacherLists: any;
  getDistrictBackId: any;
  getBlockBackId: any;
  getClusterBackId: any;
  getSchoolBackId: any;
  parVal: any;
  getEndDate: any;
  getStartDate: any;
  csvoptions: any;
  csvData: any;
  loginLevel :any;
  backLevel:any;
  designationData: any;
  scDesignationId: any = "";
  scDesignationChanged: boolean = false;
  sessionDegId: any = this.userProfile.designationId;
  degLevel: any;
  schoolType:any = "";
  userLevelId: any = "0";
  stateUser: boolean = false;
	distUser: boolean = false;
	blkUser: boolean = false;

	distLvl: boolean = false;
	blkLvl: boolean = false;
	clusterLvl: boolean = false;
  posts:any;
	desGrpSelect: boolean = true;
	desGrpLoading: boolean = true;
	DesignationGroupData: any = "";
  designationGroupId: any = "0";
  intDesignationId: any = "0";
  designationSelect: boolean = true;
	designationLoading: boolean = false;
  distLvl2: boolean = false;
  designationChanged: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    public commonService: CommonserviceService,
    private alertHelper: AlertHelper,
    private spinner: NgxSpinnerService,
    private http: HttpClient,
    private route: Router,
    private router: ActivatedRoute,
    private registrationService: RegistrationService,
    public ManageUserService: ManageUserService,
    private InspectionMis: InspectionMisService,
    private el: ElementRef,
    private location: Location,
  ) {
    this.maxDate = new Date();
  }

  ngOnInit(): void {
    if (this.userProfile.userLevel == 5) {
			this.userLevelId = 5;
			this.loadSubDesignation(5);
		} else if (this.userProfile.userLevel == 4) {
			this.userLevelId = 4;
			this.stateUser = true;
			this.distUser = false;
			this.blkUser = false;
			this.loadSubDesignation(4);
		} else if (this.userProfile.userLevel == 3) {
			this.loadSubDesignation(2);
			this.stateUser = true;
			this.distUser = true;
			this.blkUser = true;
		} else if (this.userProfile.userLevel == "") {
			this.userLevelId = 0;
		}
    this.getDistrict();
    //this.desginationList();
    //this.loadDistrict(this.getSearchParams());
  }

  loadSubDesignation(levelId: any) {
		if (levelId > 0) {
			this.getDesignationGroup(levelId);
		}
		if (levelId == 5) {
			this.distLvl = false;
			this.blkLvl = false;
			this.clusterLvl = false;
			this.distLvl2 = false;
		} else if (levelId == 4) {
			this.distLvl = true;
			this.distLvl2 = true;
			this.blkLvl = false;
			this.clusterLvl = false;
		} else if (levelId == 3) {
			this.distLvl = true;
			this.blkLvl = true;
			this.clusterLvl = false;
			this.distLvl2 = false;
		} else if (levelId == 2) {
			this.distLvl = true;
			this.blkLvl = true;
			this.clusterLvl = true;
			this.distLvl2 = false;
		}
	}

	getDesignationGroup(levelId: any) {
		this.desGrpSelect = false;
		this.desGrpLoading = false;
		this.DesignationGroupData = [];
		this.ManageUserService.getDesignationGroup(levelId).subscribe((res) => {
			this.posts = res;
			let data: any = res;
			for (let key of Object.keys(data["data"])) {
				this.DesignationGroupData.push(data["data"][key]);
			}
			this.desGrpSelect = true;
			this.desGrpLoading = true;
		});
	}

	getSubDesignation(designtionId: any) {
		if (designtionId > 0) {
			this.designationChanged = true;
      this.designationSelect = false;
			this.designationData = [];
      this.scDesignationId = "";
			this.designationLoading = true;
			this.ManageUserService.getSubDesignation(designtionId).subscribe(
				(res) => {
					this.posts = res;
					let data: any = res;
					for (let key of Object.keys(data["data"])) {
						this.designationData.push(data["data"][key]);
					}
					this.designationChanged = false;
					this.designationLoading = false;
          this.designationSelect = true;
				}
			);
		}else{
      this.scDesignationId = "";
    }
	}

  getSearchParams() {
    return {
      
      scDistrictId: this.searchForm.controls['scDistrictId'].value,
      scBlockId: this.searchForm.controls['scBlockId'].value,
      scClusterId: this.searchForm.controls['scClusterId'].value,
      schoolId: this.searchForm.controls['schoolId'].value,
      designationGroupId: this.searchForm.controls["designationGroupId"].value,
      scDesignationId: this.searchForm.controls['scDesignationId'].value,
      startDate: this.searchForm.controls['startDate'].value,
      endDate: this.searchForm.controls['endDate'].value,
      schoolType: this.searchForm.controls["schoolType"].value,
    };
  }

  onSearch()
  {
    if(this.validateForm() === true){
      this.loadDistrict(this.getSearchParams());
    }
  }
  validateForm() {

    if (this.designationGroupId != 0) {
      if (this.scDesignationId === "") {
        this.alertHelper.viewAlert(
          "error",
          "Required",
          "Please select sub designation"
        );
        return false;
      }
  }
    
		if (this.startDate === undefined) {
			this.alertHelper.viewAlert(
				"error",
				"Required",
				"Please select Start Date."
			);
			return false;
		}

		if (this.endDate === undefined) {
			this.alertHelper.viewAlert(
				"error",
				"Required",
				"Please select End Date."
			);
			return false;
		}

    	   
		if(this.startDate != undefined && this.endDate != undefined){
      if (formatDate(this.endDate,'yyyy-MM-dd','en_US') < formatDate(this.startDate,'yyyy-MM-dd','en_US')){
      this.alertHelper.viewAlert(
        "error",
        "Invalid",
        "End Date should not be smaller than Start Date"
      );
      this.endDate = undefined;
      return false;
    }			
  }




		return true;

	}

  

  
  loadDistrict(params: any) {
    this.spinner.show();
    const paramObj = {
      scDistrictId: params.scDistrictId,
      scBlockId: params.scBlockId,
      scClusterId: params.scClusterId,
      schoolId: params.schoolId,
      scDesignationId:this.scDesignationId,
      startDate: params.startDate,
      endDate: params.endDate,
      schoolType : this.schoolType
      
    };
    if (paramObj.schoolId != '') {
      this.pageLevel = 4;
    } else if (paramObj.scClusterId != '') {
      this.pageLevel = 3;
    } else if (paramObj.scBlockId != '') {
      this.pageLevel = 2;
    } else if (paramObj.scDistrictId != '') {
      this.pageLevel = 1;
    } else {
      this.pageLevel = 0;
    }
    this.isLoading = true;
    this.InspectionMis.teacherAbsentCount(paramObj).subscribe({
      next: (res: any) => {
        // this.resultListData.length = previousSize; // set current size
        this.resultListData=res?.data; // merge with existing data
        this.resultListDatas = res?.totalSchool;
        this.numOfVisetedSchool = res?.numOfVisetedSchool;
        this.numOfVisit = res?.numOfVisit;
        this.totalAbsentTeacher = res?.totalAbsentTeacher;
        this.noActionTaken = res?.noActionTaken;
        this.eskAsk = res?.eskAsk;
        this.eskSatis = res?.eskSatis;
        this.salaryDed = res?.salaryDed;
        this.eskNoRec = res?.eskNoRec;
        this.getDistrictBackId = res?.getDistrictBackId;
        this.getBlockBackId = res?.getBlockBackId;
        this.getClusterBackId = res?.getClusterBackId;
        this.getSchoolBackId = res?.getSchoolBackId;
        this.getStartDate = res?.startDate;
        this.getEndDate= res?.endDate;
        this.dataSource.paginator = this.paginator; // update paginator
        this.dataSource._updateChangeSubscription(); // update table
        this.isLoading = false;
        this.isNorecordFound = this.resultListData.length ? false : true;
        this.isInitAdmin = true;
        this.spinner.hide();
        
        
      },error: (error: any) => 
      {
        this.isLoading = false;
        this.spinner.hide();
      }   
       
    });
      
  }

  excel(level:any){

    this.spinner.show();
    this.csvData = this.getSearchParams();
    this.InspectionMis.downloadAbsentTeacherCountCsv(
      this.csvData
    ).subscribe({
      next: (res: any) => {
        let filepath = this.fileUrl1 + '/' + res.data.replace('.', '~');
        window.open(filepath);
        this.spinner.hide();
      },
      error: (error: any) => {
        this.isLoading = false;
        this.spinner.hide();
      },
    });
  }

  exportExcel(){
    this.spinner.show();
    this.csvData = this.getSearchParams();
    this.InspectionMis.downloadAbsentTeacherDetailCsv(
      this.csvData
    ).subscribe({
      next: (res: any) => {
        let filepath = this.fileUrl1 + '/' + res.data.replace('.', '~');
        window.open(filepath);
        this.spinner.hide();
      },
      error: (error: any) => {
        this.isLoading = false;
        this.spinner.hide();
      },
    });
  }
  

  goBack(distId: any, blkId: any, cluId: any, sclId: any, level: any,startDate:any,endDate:any)
  {

    if (cluId != "") {
      this.backLevel = 2;
    } else if (blkId != "") {
      this.backLevel = 3;
    } else if (distId != "") {
      this.backLevel = 4;
    } else {
      this.backLevel = 5;
    }
    if (this.backLevel != this.loginLevel) {
    if(level == 1){
      this.parVal = {
        scDistrictId: "",
        scBlockId: "",
        scClusterId: "",
        schoolId: "",
        startDate:startDate,
        endDate:endDate,
        scDesignationId : this.scDesignationId
      }
      this.getDistrict();
      this.searchForm.controls['scDistrictId'].patchValue('');
      this.loadDistrict(this.parVal);
    }
    if (level == 2) {
      this.parVal = {
        scDistrictId: distId,
        scBlockId: "",
        scClusterId: "",
        schoolId: "",
        startDate: startDate,
        endDate: endDate,
        scDesignationId : this.scDesignationId
      }

      this.searchForm.controls['scDistrictId'].patchValue(distId);
      this.getBlock(distId);
      this.searchForm.controls['scBlockId'].patchValue('');
      this.loadDistrict(this.parVal);

    }

    if (level == 3) {
      this.parVal = {
        scDistrictId: distId,
        scBlockId: blkId,
        scClusterId: "",
        schoolId: "",
        startDate: startDate,
        endDate: endDate,
        scDesignationId : this.scDesignationId
      }

      this.getCluster(blkId);
      this.searchForm.controls['scDistrictId'].patchValue(distId);
      this.searchForm.controls['scBlockId'].patchValue(blkId);
      this.searchForm.controls['scClusterId'].patchValue('');

      this.loadDistrict(this.parVal);
    }

    if (level == 4) {
      this.parVal = {
        scDistrictId: distId,
        scBlockId: blkId,
        scClusterId: cluId,
        schoolId: "",
        startDate: startDate,
        endDate: endDate,
        scDesignationId : this.scDesignationId
      }

      this.getSchool(cluId);
      this.searchForm.controls['scDistrictId'].patchValue(distId);
      this.searchForm.controls['scBlockId'].patchValue(blkId);
      this.searchForm.controls['scClusterId'].patchValue(cluId);
      this.searchForm.controls['schoolId'].patchValue('');
      this.loadDistrict(this.parVal);
    }
  }
  }

  getData(distId: any, blkId: any, cluId: any, sclId: any, startDate:any,endDate:any,deg:any,level: any){
    
 
    if(level == 1){
      this.scDistrictId = distId;
      this.getBlock(distId);
      this.parVal = {
        scDistrictId: distId,
        scBlockId: "",
        scClusterId: "",
        schoolId: "",
        startDate:startDate,
        endDate:endDate,
        scDesignationId  :deg
      }
    }

    if (level == 2) {
      this.scDistrictId = distId;
      this.scBlockId = blkId;
      this.getCluster(blkId);
      this.parVal = {
        scDistrictId: distId,
        scBlockId: blkId,
        scClusterId: "",
        schoolId: "",
        startDate:startDate,
        endDate:endDate,scDesignationId  :deg
      }
    }

    if (level == 3) {
      this.scDistrictId = distId;
      this.scBlockId = blkId;
      this.scClusterId = cluId;
      this.getSchool(cluId);
      this.parVal = {
        scDistrictId: distId,
        scBlockId: blkId,
        scClusterId: cluId,
        schoolId: "",
        startDate:startDate,
        endDate:endDate,scDesignationId  :deg
      }
    }
    if (level == 4) {
      this.scDistrictId = distId;
      this.scBlockId = blkId;
      this.scClusterId = cluId;
      this.schoolId=sclId;
      this.parVal = {
        scDistrictId: distId,
        scBlockId: blkId,
        scClusterId: cluId,
        schoolId: sclId,
        startDate:startDate,
        endDate:endDate,scDesignationId  :deg
      }
    }

    this.loadDistrict(this.parVal);
  
    
  }

 
  getDistrict(){   
		this.scDisrtictSelect = true;
		this.commonService.getAllDistrict().subscribe((data:any)=>{
		  this.districtData = data;
		  this.districtData = this.districtData.data; 
		  
		  if(this.userProfile.district != 0 || this.userProfile.district != ""){
			this.districtData = this.districtData.filter((dis: any) => {
			  return dis.districtId == this.userProfile.district;
			});
			this.searchForm.controls['scDistrictId'].patchValue(this.userProfile.district);
			this.getBlock(this.userProfile.district);
		  }
		  else{
			this.districtData = this.districtData;
			this.scDisrtictSelect = false;
		  }
	
		  this.scBlockId='';      
		  this.scDisrtictSelect = false;
		});
		
	  }

    getBlock(districtId: any) {
      this.scBlockId = "";
      this.scClusterId = "";
      this.schoolId = "";
      this.blockData = [];
      this.clusterData = [];
      this.getSchoolData = [];
      this.scBlockChanged = true;
      if (districtId !== '') {
        this.commonService.getBlockByDistrictid(districtId).subscribe((res: any) => {
          this.blockData = res;
          this.blockData = this.blockData.data;
  
          if (this.userProfile.block != 0 || this.userProfile.block != "") {
            this.blockData = this.blockData.filter((blo: any) => {
              return blo.blockId == this.userProfile.block;
            });
  
            this.scBlockId = this.userProfile.block;
            this.getCluster(this.userProfile.block);
            this.scBlockChanged = false;
          }
          else {
            this.scBlockChanged = false;
          }
          this.scBlockChanged = false;
        });
      } else {
        this.scBlockChanged = false;
      }
    }
  

  getCluster(blockId: any) {      
		this.scClusterChanged = true;
    this.scClusterId = "";
    this.schoolId = "";
		this.clusterData = [];
		
		this.getSchoolData = [];    
		
		if(blockId !== ''){  
		  this.commonService.getClusterByBlockId(blockId).subscribe((res: any) => {      
			this.clusterData = res;
			this.clusterData = this.clusterData.data;
			
			if(this.userProfile.cluster != 0 || this.userProfile.cluster != ""){
			  this.clusterData = this.clusterData.filter((clu: any) => {
				return clu.clusterId == this.userProfile.cluster;
			  });
			  this.searchForm.controls['scClusterId'].patchValue(this.userProfile.cluster);
			  this.getSchool(this.userProfile.cluster);
			}
			else{
			  this.scClusterChanged = false; 
			}  
			this.scClusterChanged = false;
		  });      
		}else{
		  this.scClusterChanged = false; 
		}   
	  }

  getSchool(clusterId: any) {
    this.scSchoolChanged = true;
    this.schoolId = "";

    this.getSchoolData = [];

    if (clusterId !== '') {
      this.InspectionMis.getSchoolList(clusterId).subscribe((res: any) => {
        this.getSchoolData = res;
        this.getSchoolData = this.getSchoolData.data;

        if (this.sessionSchoolId != '') {

          this.searchForm.controls['schoolId'].patchValue(this.sessionSchoolId);
        }

        this.scSchoolChanged = false;
      });
    } else {

      this.scSchoolChanged = false;
    }
  }

  desginationList(){
    this.InspectionMis.DesignationList().subscribe((res:any)=>{
      this.desList = res.data;
    })
  }

  noOfAbsente(inspectionId:any){
    this.spinner.show();
    let paramList = {encId:inspectionId};
    this.InspectionMis.noOfAbsentee(paramList).subscribe((res:any)=>{
      this.absentTeacherLists = res.data;
      this.spinner.hide();
    })
  }

  printPage() {
    let cloneTable = document.getElementById("viewTable")?.innerHTML;
    const pageTitle = document.querySelector(".pageName")?.innerHTML;
    this.commonService.printPage(cloneTable, pageTitle);
  }

  toggle() {
    this.show = !this.show;
    if(this.show)  
      this.buttonName = "Hide";
    else
      this.buttonName = "Show";
  }

  

}

