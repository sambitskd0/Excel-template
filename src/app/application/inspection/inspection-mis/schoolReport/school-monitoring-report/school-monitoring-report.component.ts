import { Component, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { AlertHelper } from "src/app/core/helpers/alert-helper";
import { CommonserviceService } from "src/app/core/services/commonservice.service";
import { NgxSpinnerService } from "ngx-spinner";
import { Subject } from "rxjs";
import { DataTableDirective } from "angular-datatables";
import { environment } from "src/environments/environment";
import { HttpClient } from "@angular/common/http";
import { ActivatedRoute, Router } from '@angular/router';
import { InspectionMisService } from '../../../services/inspection-mis.service';
import { RegistrationService } from "src/app/application/teacher/services/registration.service";

declare var $:any;

@Component({
  selector: 'app-school-monitoring-report',
  templateUrl: './school-monitoring-report.component.html',
  styleUrls: ['./school-monitoring-report.component.css']
})
export class SchoolMonitoringReportComponent implements OnInit {
  @ViewChild(DataTableDirective, { static: false })

  datatableElement: any = DataTableDirective;
  dtOptions: any = {};
  dtTrigger: Subject<any> = new Subject<any>();
  public show:boolean = true;
  public buttonName:any = 'Show';
  questSearchform!: FormGroup;
  SearchformId!: FormGroup;
  loginformId!: FormGroup;
  allErrorMessages: string[] = [];
  submitted = false;
  resData: any = "";
  isResData: boolean = false;
  isEmpty: boolean = false;
  id: any;
  resp: any;
  data:any = [];
  t:any;
  datas:any=[];
  tatten:any=[];
  finalAbsent:any;
  absentTeacherList:any;
  studentAttendence:any =[];
  questionList:any = [];
  answerList:any = [];
  questrue = false;
  warn = false;
  userProfile = this.commonService.getUserProfile();
  userType = this.userProfile.userType;
  userId = this.userProfile.userId;
  admin:any;
  user:any;
  posts:any;
  scSchoolChanged:boolean = false;
  scSchool: any = "";
  schoolDatas: any = "";
  getSchoolData: any = "";
  insp:any;
  districtData: any= [];
  blockData: any = [];
  clusterData: any =[];
  //clusterId:any;

  showSpinnerBlock: boolean = false;
  disrtictChanged:boolean = false; 
  clusterChanged:boolean = false; 
  blockChanged:boolean = false; 
  disrtictSelect:boolean = true; 
  clusterSelect:boolean = true; 
  blockSelect:boolean = true; 
  inspectioList:any;
  
  districtId:any = "";
  blockId:any = "";
  clusterId:any="";
  locateId:any = "1";
  nagarnigamId:any = "";
  villageId:any = "";
  SchoolId: any;
  cls: any;
  scDistrictId:any;
  scBlockId:any;
  scClusterId:any;
  schoolId:any;
  startDate:any;
  endDate:any;
  res: any;

  constructor(
    private formBuilder: FormBuilder,
    public commonService: CommonserviceService,
    private alertHelper: AlertHelper,
    private spinner: NgxSpinnerService,
    private http: HttpClient,
    private route:Router,
    private router:ActivatedRoute,
    private registrationService: RegistrationService,
    private InspectionMisService : InspectionMisService
    ) { }
  
  
  ngOnInit(): void {
    this.spinner.show();
    if(this.userProfile.district != 0 || this.userProfile.district != ""){
      this.districtId = this.userProfile.district;
      this.disrtictSelect = false;
    }
    if(this.userProfile.block != 0 || this.userProfile.block != ""){
      this.blockId = this.userProfile.block; 
      this.blockSelect = false;
    }    
    if(this.userProfile.cluster != 0 || this.userProfile.cluster != ""){
      this.clusterId = this.userProfile.cluster; 
      this.clusterSelect = false;
      //console.log(this.userProfile.cluster);
    }
    this.getDistrict();
    this.questSearchform = this.formBuilder.group({
      district : "0"
    });
    
    if(this.userType == "admin"){
      this.loadProfile();
    }
    if(this.userType == "user"){
      this.loadProfile1();
    }
    

    this.dtOptions = {
      pagingType: "full_numbers",
      processing: false,
      ordering: true,
      dom: 'Blfrtip',
      buttons: [
        
      ]
  
    };
    this.initializeForm();
    
  }
  ngOnDestroy(): void {
    $.fn['dataTable'].ext.search.pop();
  }
  initializeForm(){    
    //alert(this.sessionBlockId)
    this.questSearchform = this.formBuilder.group({
      userType: [this.userType],
      scDistrictId: [this.scDistrictId],
      scBlockId: [this.scBlockId],
      scClusterId: [this.scClusterId],
      schoolId: [this.schoolId],
      startDate: [this.startDate],
      endDate: [this.endDate],
      userId:[this.userProfile.userId],
      sessionValue:[this.userProfile],     
    });
  }

  loadProfile(){
    this.data = [];
    this.InspectionMisService
      .viewInspection(this.questSearchform.value)
      .subscribe((resp: any)=>{
        console.log(resp);
        this.inspectioList = resp.data;
        this.isEmpty = this.inspectioList.length > 0 ? false : true;
        if(this.isEmpty == null){
          this.spinner.hide();
        }
        console.log(this.isEmpty);
        this.isResData = true;
        this.spinner.hide();
        if (this.datatableElement && this.inspectioList.length > 0) {
          this.datatableElement.dtInstance.then(
              (dtInstance: DataTables.Api) => {
                  if ($(".dataTables_empty").length > 0) {
                      $(".dataTables_empty").remove();
                  }

              }
          );
        }
      })
      /*({
        next: (resp: any) => {
          //this.data = resp;
        this.insp = this.resp.data;
        
        this.resData = true;
        this.isEmpty = this.insp.length > 0 ? false : true;
        console.log(this.insp);
        
        this.spinner.hide();
        this.isResData = true;
        if(this.datatableElement && this.resData.length > 0) {
          this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {               
            if ($('.dataTables_empty').length > 0) {
              $('.dataTables_empty').remove();
            }    
                      
          });
          
        }else{
          this.spinner.hide();
        }

        }
        
        
      });*/
      /*.subscribe((resp: []) => {
        this.data = resp;
        this.data = this.data.data;
        
        this.resData = true;
        this.isEmpty = this.data.length > 0 ? false : true;
        
        
        this.spinner.hide();
        this.isResData = true;
        if(this.datatableElement && this.resData.length > 0) {
          this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {               
            if ($('.dataTables_empty').length > 0) {
              $('.dataTables_empty').remove();
            }    
                      
          });
          
        }
        
      });*/
  }

  loadProfile1(){
    this.loginformId = this.formBuilder.group({
      encId : this.userId
    });
    this.InspectionMisService
      .userGetInspection(this.loginformId.value)
      .subscribe((resp: []) => {
        this.data = resp;
        this.insp = this.data.data;
        //console.log(this.loginformId.value);
        //console.log(this.insp);
        this.resData = true;
        this.isEmpty = this.insp.length > 0 ? false : true;
        
        
        this.spinner.hide();
        this.isResData = true;
        if(this.datatableElement && this.resData.length > 0) {
          this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {               
            if ($('.dataTables_empty').length > 0) {
              $('.dataTables_empty').remove();
            }    
                      
          });
          
        }
        
      });
  }

  filterRecord(){
    console.log(this.questSearchform.value);
    this.spinner.show();
    this.insp = [];
    this.InspectionMisService.inspectionDataSearch(this.questSearchform.value).subscribe({
      next: (resp: any) => 
      {
        
       this.insp = resp.data;
        this.spinner.hide();
        console.log(this.insp);
        this.resData = true;
        this.isEmpty = this.insp.length > 0 ? false : true;
        //console.log(this.isEmpty);
        
        this.spinner.hide();
        this.isResData = true;
        if(this.datatableElement && this.resData.length > 0) {
          this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {               
            if ($('.dataTables_empty').length > 0) {
              $('.dataTables_empty').remove();
            }    
                      
          });
          
        }

      }
    })
    
    
  }

  TakeAction(id:any)
  {
    this.SearchformId = this.formBuilder.group({
      encId : id
    });
    this.spinner.show();
    //console.log(this.SearchformId.value);
    this.InspectionMisService
      .getInspectionById(this.SearchformId.value)
      .subscribe((res:any) => {
        this.datas = res.data[0];
        this.tatten = res.teacheratten;
        this.absentTeacherList = res.absentTeacherList;
        this.studentAttendence = res.studentAttendence;
        this.questionList = res.questionList;
        this.answerList = res.answerList;
        this.spinner.hide();
        //console.log(this.studentAttendence);
      });
  }

  toggle() {
    this.show = !this.show;
    if(this.show)  
      this.buttonName = "Hide";
    else
      this.buttonName = "Show";
  }

  getDistrict(){
    this.disrtictChanged = true;
    this.commonService.getAllDistrict().subscribe((res:[])=>{
      this.posts = res;
      //console.log(res);
      this.districtData = this.posts.data;   
      if(this.userProfile.district != 0 || this.userProfile.district != ""){
        this.districtData = this.districtData.filter((dis: any) => {
          return dis.districtId == this.userProfile.district;
        });
        this.getBlock(this.userProfile.district);
      }    
      this.disrtictChanged = false;
     });
  }
  getBlock(districtId: any) {  
    this.blockChanged = true;
    this.districtId = districtId;
    this.blockData = [];  
    this.blockId = null;
    this.clusterData = []; 
     
    if(districtId !== ''){        
      this.commonService.getBlockByDistrictid(districtId).subscribe((res) => {      
        let data: any = res;
        this.blockId = null;
        for (let key of Object.keys(data['data'])) {
          this.blockData.push(data['data'][key]);
        }
        if(this.userProfile.block != 0 || this.userProfile.block != ""){
          this.blockData = this.blockData.filter((blo: any) => {
            return blo.blockId == this.userProfile.block;
          });
          this.getCluster(this.userProfile.block);
          
        }
        this.blockChanged = false;
      });
    }else{
      this.blockChanged = false;
    }  
    this.blockId =  null;
    this.clusterId = '';
    this.villageId = '';
  }


  getCluster(clusterId: any) { 
    
    this.clusterChanged = true;
    this.clusterId = clusterId;
    this.clusterData = [];  this.clusterId = '';
    
    
    if(clusterId !== ''){    
      this.commonService.getClusterByBlockId(clusterId).subscribe((res) => {      
        let data: any = res;
        //console.log(data.data.clusterId);
        
        for (let key of Object.keys(data['data'])) {
          this.clusterData.push(data['data'][key]);
        }
        if(this.userProfile.cluster != 0 || this.userProfile.cluster != ""){
          this.clusterData = this.clusterData.filter((cls: any) => {
            return cls.clusterId == this.userProfile.cluster;
          });
          //this.getSchool(this.userProfile.cluster);
        }
        
        
        this.clusterChanged = false;
      });
    }else{
      this.clusterChanged = false;
    }
    

  }

  getSchool(post:any){ 
    //console.log(post);
    this.showSpinnerBlock = true;
    this.scSchoolChanged = true;
    const clusterId = post;
    this.getSchoolData = [];    
    if(clusterId !== ''){  
      this.InspectionMisService.getSchoolList(post).subscribe((res:any) => {      
        let data: any = res;
        //console.log(data);
        for (let key of Object.keys(data['data'])) {
          this.getSchoolData.push(data['data'][key]);
        }
        this.questSearchform.patchValue({
          schoolId: ''
       });
        this.showSpinnerBlock = false;
        this.scSchoolChanged = false;
      });
     }else{
      this.scSchoolChanged = false;
    }
  }

  
}
