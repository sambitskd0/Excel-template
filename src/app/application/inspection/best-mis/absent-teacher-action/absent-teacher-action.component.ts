import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild, ElementRef, Input } from "@angular/core";
import { FormGroup, FormBuilder, Validators, NgForm } from "@angular/forms";
import { CommonserviceService } from "src/app/core/services/commonservice.service";

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
import { CustomValidators } from "src/app/shared/validations/custom-validators";
import { formatDate } from '@angular/common';


@Component({
  selector: 'app-absent-teacher-action',
  templateUrl: './absent-teacher-action.component.html',
  styleUrls: ['./absent-teacher-action.component.css']
})
export class AbsentTeacherActionComponent implements OnInit {

  public show:boolean = true;
  public buttonName:any = 'Show';

  displayTable: boolean = false;
  questSearchform!: FormGroup;
  SearchformId!: FormGroup;
  EditTeacherAction!: FormGroup;
  isLoading = false;
  isNorecordFound: boolean = false;
  tattenlength: boolean = false;
  pageIndex: any = 0;
  previousSize: any = 0;
  // mat table
  @Input() mode!: ProgressBarMode;
  @ViewChild('closeModal') private closeModal: ElementRef | any;
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
  allLabel: string[] = ["","", "Action Type", "Comment"];

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
  label: any;
  totalAbsentTeacher: any;
  noActionTaken: any;
  eskAsk: any;
  eskSatis: any;
  salaryDed: any;
  eskNoRec: any;
  leng: any;
  recordId: any;
  inspectionId: any;
  action: any;
  comment: any;
  pageLevel:any;
  scDisrtictSelect:boolean = true; 
	scDisrtictLoading:boolean = false; 
	scBlockSelect:boolean = true; 
	scBlockLoading:boolean = false; 
	scClusterSelect:boolean = true;
	scClusterLoading:boolean = false;
	scSchoolSelect:boolean = true;
	scSchoolLoading:boolean = false; 
  csvData: any;
  csvoptions: any;
  parVal: any;

  constructor(
    private formBuilder: FormBuilder,
    public commonService: CommonserviceService,
    private alertHelper: AlertHelper,
    private spinner: NgxSpinnerService,
    private http: HttpClient,
    private route: Router,
    private router: ActivatedRoute,
    private registrationService: RegistrationService,
    private InspectionMis: InspectionMisService,
    private el: ElementRef,
    public customValidators: CustomValidators,
  ) {
    this.maxDate = new Date();
  }

  ngOnInit(): void {
    this.getDistrict();
    this.initializeForm()
    
  }


  getSearchParams() {
    return {
      previousSize: this.previousSize,
      offset: this.offset.toString(),
      pageSize: this.pageSize.toString(),
      userType : this.userProfile.userType,
      userId : this.userProfile.userId,
      scDistrictId: this.questSearchform?.get("scDistrictId")?.value,
      //scDistrictId: this.sessionDistrictId,
      scBlockId: this.questSearchform?.get("scBlockId")?.value,
      scClusterId: this.questSearchform?.get("scClusterId")?.value,
      desgName: this.questSearchform?.get("desgName")?.value,
      startDate: this.questSearchform?.get("startDate")?.value,
      endDate: this.questSearchform?.get("endDate")?.value,
    };
  }

  onSearch()
  {
    if (this.validateForm() === true) {
      this.loadData(this.getSearchParams());
    }
  }

  validateForm() {
    if (this.scDistrictId === "") {
			this.alertHelper.viewAlert(
				"error",
				"Required",
				"Please select District."
			);
			return false;
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
      this.ngOnInit();
      return false;
    }			
  }
		return true;

	}

  
  loadData(...params: any) {
    this.spinner.show();
    const {
      previousSize,
      offset,
      pageSize,
      scDistrictId,
      scBlockId,
      scClusterId,
      desgName,
      userType,
      userId,
      
      startDate,
      endDate,
    } = params[0];

    const paramObj = {
      offset: offset,
      limit: pageSize,
      //scDistrictId: this.scDistrictId,
      scDistrictId: (this.sessionDistrictId != "")?this.sessionDistrictId : this.scDistrictId,
      scBlockId: this.scBlockId,
      scClusterId: this.scClusterId,
      desgName: this.schoolId,
      userType : this.userProfile.userType,
      userId : this.userProfile.userId,
      startDate: this.startDate,
      endDate: this.endDate,
     
    };

    if (paramObj.scClusterId != '') {
      this.pageLevel = 3;
    } else if (paramObj.scBlockId != '') {
      this.pageLevel = 2;
    } else if (paramObj.scDistrictId != '') {
      this.pageLevel = 1;
    } else {
      this.pageLevel = 0;
    }
    this.isLoading = true;
    //console.log(paramObj);
    this.InspectionMis.absentTeacherAction(paramObj).subscribe({
      next: (res: any) => {
        //console.log(res);
        this.resultListData.length = previousSize; // set current size
        this.resultListData.push(...res?.data); // merge with existing data
        this.absentTeacherList = res?.absentTeacherList;
        this.leng = this.absentTeacherList.length;
        this.resultListDatas = res?.totalSchool;
        this.numOfVisetedSchool = res?.numOfVisetedSchool;
        this.numOfVisit = res?.numOfVisit;
        this.totalAbsentTeacher = res?.totalAbsentTeacher;
        this.noActionTaken = res?.noActionTaken;
        this.eskAsk = res?.eskAsk;
        this.eskSatis = res?.eskSatis;
        this.salaryDed = res?.salaryDed;
        this.eskNoRec = res?.eskNoRec;
        this.label = res?.label;
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
        //console.log(e);
      }   
       
    });
      
  }

  
  getDistrict(){   
		this.scDisrtictSelect = false;
		this.scDisrtictLoading = true;
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
			this.scDisrtictSelect = true;
		  }
	
		  this.scBlockId='';      
		  this.scDisrtictLoading = false;
		});
		
	  }

  getBlock(id: any) {
    //alert(id);
    this.scBlockId = "";
    this.blockData = [];
    //this.questSearchform?.get("scBlockId")?.patchValue('');
    this.clusterData = [];
    this.scClusterId = "";
    //this.clusterData = [];
    this.scBlockChanged = true;
    const districtId = id;
   
    if (districtId !== "") {
      this.commonService
        .getBlockByDistrictid(districtId)
        .subscribe((res: any) => {
          let data: any = res;
          for (let key of Object.keys(data["data"])) {
            this.blockData.push(data["data"][key]);
          }
          if (this.sessionBlockId != '') {
            $(".scBlockId").prop("disabled", "disabled");
           

          } else {
            //this.blockData = [];
            this.scBlockChanged = false;
          }
          
          this.scBlockChanged = false;
        });
    } else {
      
      this.scBlockChanged = false;
      
    }
    //console.log(this.blockData);
  }

  getCluster(id: any) {
    this.scClusterChanged = true;
    this.scClusterId = "";
    this.clusterData = [];
    if (id != "") {
      this.commonService.getClusterByBlockId(id).subscribe((res: any) => {
        let data: any = res;
        for (let key of Object.keys(data["data"])) {
          this.clusterData.push(data["data"][key]);
        }

        
        this.scClusterChanged = false;
      });
    } else {
      this.scClusterChanged = false;
    }

  }

  desginationList(){
    this.InspectionMis.DesignationList().subscribe((res:any)=>{
      this.desList = res.data;
      //console.log(this.desList);
    })
  }

  takeAction(task:any)
  {
    //console.log(task.recordId);
    this.recordId = task.recordId;
    this.inspectionId = task.inspectionId;
    this.action = task.actionStatus;
    this.comment=task.comment,
    this.initializeForm();
   
  }
  initializeForm() {   
    this.EditTeacherAction = this.formBuilder.group({
      recordId:this.recordId,
      inspectionId:this.inspectionId,
      action:[this.action, [Validators.required]],
      comment:[this.comment, [Validators.required]],
     
      //createdBy:[this.userProfile.userId],
      updatedBy:[this.userProfile.userId]
      
    });
    
  }

  onAction()
  {
    if ("INVALID" === this.EditTeacherAction.status) {
      for (const key of Object.keys(this.EditTeacherAction.controls)) {
        if (this.EditTeacherAction.controls[key].status === "INVALID") {
          const invalidControl = this.el.nativeElement.querySelector(
            '[formControlName="' + key + '"]'
          );
          invalidControl.focus();
          this.customValidators.formValidationHandler(
            this.EditTeacherAction,
            this.allLabel
          );
          break;
        }
      }
    }

    if (this.EditTeacherAction.valid === true) {
      this.alertHelper.updateAlert().then((result) => {
        if (result.value) {
          this.spinner.show(); // ==== show spinner
          this.InspectionMis.takeAction(this.EditTeacherAction.value)
            .subscribe({
              next: (res: any) => {
                this.spinner.hide(); //==== hide spinner
                this.alertHelper
                  .successAlert(
                    "Updated!",
                    "Action taken successfully.",
                    "success"
                  )
                  .then(() => {
                    this.closeModal.nativeElement.click();
                    this.loadData(this.getSearchParams());
                  });
              },
              error: (error: any) => {
                this.spinner.hide(); //==== hide spinner
                let errorMessage: string = "";
                if (typeof error.error.msg === "string") {
                  errorMessage +=
                    '<i class="bi bi-arrow-right text-danger"></i> ' +
                    error.error.msg +
                    `<br>`;
                } else {
                  error.error.msg.map(
                    (message: string) =>
                      (errorMessage +=
                        '<i class="bi bi-arrow-right text-danger"></i> ' +
                        message +
                        `<br>`)
                  );
                }
                this.alertHelper.viewAlertHtml(
                  "error",
                  "Invalid inputs",
                  errorMessage
                );
              },
              complete: () => console.log('done'),
            });
        }
      });
    }
    
  }

  printPage() {
    let cloneTable = document.getElementById("viewTable")?.innerHTML;
    const pageTitle = document.querySelector(".pageName")?.innerHTML;
    this.commonService.printPage(cloneTable, pageTitle);
  }

  getData(code:any,label:number){
    console.log(code);
    if(label == 1){
      this.scDistrictId = code;
      this.scBlockId = "";
      this.scClusterId = "";
      this.loadData(this.getSearchParams());
      this.getBlock(code);
    }
    if(label == 2){
      //alert(label);
      this.scBlockId = code;
      
      this.scClusterId = "";
      this.loadData(this.getSearchParams());
     this.getCluster(code);
      
    }
    if(label == 3){
      this.scClusterId = code;
      this.loadData(this.getSearchParams());
    }
    
  }

  goBack(level: any)
  {
    
    if (level == 1) {
      this.parVal = {
        scDistrictId: this.scDistrictId,
        scBlockId: "",
        scClusterId: "",
        startDate: this.startDate,
        endDate: this.endDate
      }

      this.searchForm.controls['scDistrictId'].patchValue(this.scDistrictId);
      this.getBlock(this.scDistrictId);
      this.searchForm.controls['scBlockId'].patchValue('');
      this.loadData(this.getSearchParams());

    }

    if (level == 2) {
      this.parVal = {
        scDistrictId: this.scDistrictId,
        scBlockId: this.scBlockId,
        scClusterId: "",
        schoolId: "",
        startDate: this.startDate,
        endDate: this.endDate
      }

      this.getCluster(this.scBlockId);
      this.searchForm.controls['scDistrictId'].patchValue(this.scDistrictId);
      this.searchForm.controls['scBlockId'].patchValue(this.scBlockId);
      this.searchForm.controls['scClusterId'].patchValue('');

      this.loadData(this.getSearchParams());
    }

    if (level == 3) {
      this.parVal = {
        scDistrictId: this.scDistrictId,
        scBlockId: this.scBlockId,
        scClusterId: this.scClusterId,
        schoolId: "",
        startDate: this.startDate,
        endDate: this.endDate
      }

      
      this.searchForm.controls['scDistrictId'].patchValue(this.scDistrictId);
      this.searchForm.controls['scBlockId'].patchValue(this.scBlockId);
      this.searchForm.controls['scClusterId'].patchValue(this.scClusterId);
      this.searchForm.controls['schoolId'].patchValue('');
      this.loadData(this.getSearchParams());
    }
  }

  excel(e: any) {
    this.spinner.show();
    this.InspectionMis.downloadAbTeacherAction(
      e
    ).subscribe((res: any) => {
      const data = res["data"];
     
        this.csvoptions = {
          fieldSeparator: ",",
          quoteStrings: '"',
          decimalseparator: ".",
          showLabels: true,
          useBom: true,
          headers: [
            "SLN#",
            "School Name",
            "Teacher Name",
            "Monitored On",
            "Monitored By",
            "Status",
            "Modified Date",
            "Comment",
          ],
        };
    
      


      new ngxCsv(data, "absentTeacherAction", this.csvoptions);
      this.spinner.hide();
    });
  }


  toggle() {
    this.show = !this.show;
    if(this.show)  
      this.buttonName = "Hide";
    else
      this.buttonName = "Show";
  }

}