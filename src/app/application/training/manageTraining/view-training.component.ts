
import { AfterViewInit, Component, OnInit, ViewChild, ElementRef, Input } from "@angular/core";
import { FormGroup, FormBuilder, Validators, NgForm, FormArray, FormControl, } from "@angular/forms";
import { CommonserviceService } from "src/app/core/services/commonservice.service";
import { NgxSpinnerService } from "ngx-spinner";
import { DataTableDirective } from "angular-datatables";
import { Subject } from "rxjs";
import { AlertHelper } from 'src/app/core/helpers/alert-helper';
import { HttpClient } from "@angular/common/http";
import { ActivatedRoute, Router } from "@angular/router";
import { ProgressBarMode } from "@angular/material/progress-bar";
import { MatSort } from "@angular/material/sort";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableExporterDirective } from "mat-table-exporter";
import { MatTableDataSource } from "@angular/material/table";
import { TrainingTypeService } from "../services/training-type.service";
import { Constant } from 'src/app/shared/constants/constant';
import { ErrorHandler } from "src/app/core/helpers/error-handler";
import { ngxCsv } from "ngx-csv/ngx-csv";
import { DatePipe } from "@angular/common";
@Component({
  selector: 'app-view-training',
  templateUrl: './view-training.component.html',
  styleUrls: ['./view-training.component.css']
})
export class ViewTrainingComponent implements OnInit {

  config = new Constant();
	academicYear: any = this.config.getAcademicCurrentYear();
	preAndPastYear:any = [];
	displayTable: boolean = false;
	// questSearchform!: FormGroup;

	viewTableForm!: FormGroup;
	isLoading = false;
	isNorecordFound: boolean = false;
	pageIndex: any = 0;
	previousSize: any = 0;
	// mat table
	@ViewChild("searchForm") searchForm!: NgForm;
	@Input() mode!: ProgressBarMode;
	@ViewChild(MatSort) sort!: MatSort;
	@ViewChild(MatPaginator) paginator!: MatPaginator;
	@ViewChild(MatTableExporterDirective, { static: true })

	exporter!: MatTableExporterDirective;
	pageSize = 10;
	offset = 0;
	currentPage = 0;
	totalRows = 0;
	pageSizeOptions: number[] = [10, 25, 100];
	displayedColumns: string[] = [
		"chkAll",
		"slNo",
		"Academic_Year",
		"Training_Subject",
		"Training_Name",
		"District_Training_date",
		"Block_Training_date",
		"Notification_Status",
		 "Training_Status", 
		"Action",
	]; // define mat table columns

	resultListData: any = [];
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

	userLevel : any;
	emptyCheck: boolean = false;
	isInitAdmin: boolean = false;
	tev: boolean = false;
	maxDate: any = Date;
	trainingName: any;
	checkAll: boolean = false;
	isChecked: boolean = false;
	submitted = false;

  txtNotificationMsg : string = '';
	csvData: any;
	csvoptions: any;
	status: any;
	latest_date: any;
	tStatus:any;
	BlockList: any;
	districtId:any;
	blockId:any;
	constructor(
		private formBuilder: FormBuilder,
		public commonService: CommonserviceService,
		private alertHelper: AlertHelper,
		private spinner: NgxSpinnerService,
		private http: HttpClient,
		private route: Router,
		private router: ActivatedRoute,
		//private registrationService: RegistrationService,
		private el: ElementRef,
		private errorHandler: ErrorHandler,
		public datepipe: DatePipe,
		private trainingTypeServices: TrainingTypeService,
	) {
		this.maxDate = new Date();
    	this.latest_date = this.datepipe.transform(this.maxDate, "yyyy-MM-dd");
	}

	ngOnInit(): void {
		this.getPresentAndPastAcademicYear();
		//this.loadData(this.getSearchParams());
		this.initializeviewTableForm();
    	this.userLevel =  this.userProfile.userLevel;
		this.isInitAdmin = true;

    if(this.userLevel == 3){ //block
        this.txtNotificationMsg = 'Send Notification to Schools to add Trainee List';
    }else if(this.userLevel == 4){ // dist
        this.txtNotificationMsg = 'Send Notification to Block office to add Trainee List'; 
    }
    
	}
	ngAfterViewInit() {
		this.dataSource.paginator = this.paginator;
		this.dataSource.sort = this.sort;
	}
	getPresentAndPastAcademicYear(){
		var splitted = this.academicYear.split("-", 2);
		var y1 = splitted[0] - 1;
		var y2 = splitted[1] - 1;
		var y3 = y1+"-"+y2;
		const spilit = this.academicYear+","+y3;
		this.preAndPastYear = spilit.split(",");
	  }
	  
	getSearchParams() {
		return {
			previousSize: this.previousSize,
			offset: this.offset.toString(),
			pageSize: this.pageSize.toString(),
			userType: this.userProfile.userType,
			userId: this.userProfile.userId,
			academicYear: this.viewTableForm?.get("academicYear")?.value,
			trainingName: this.viewTableForm?.get("trainingName")?.value,

		};
	}

	onPageChange(event: any) {
		this.spinner.show();
		this.isLoading = true;
		// event: PageEvent
		this.pageSize = event.pageSize; // current page size ex: 10

		this.offset = event.pageIndex * event.pageSize;
		this.previousSize = this.pageSize * event.pageIndex; // set previous size
		this.pageIndex = event.pageIndex;
		this.loadData(this.getSearchParams());
	}
	onSearch() {

		this.pageIndex = 0;
		this.previousSize = 0;
		this.offset = 0;
		this.previousSize = 0;
		this.resultListData.splice(0, this.resultListData.length); // empty current data
		this.dataSource.paginator = this.paginator; // update paginator
		this.loadData(this.getSearchParams());
	}
	loadData(...params: any) {
		this.spinner.show();
		const {
			previousSize,
			offset,
			pageSize,
			academicYear,
			trainingName,
			userType,
			userId,

		} = params[0];

		const paramObj = {
			offset: offset,
			limit: pageSize,
			academicYear: this.academicYear,
			trainingName: this.trainingName,
			districtId: this.userProfile.district,
			blockId: this.userProfile.block ? this.userProfile.block : "",
			userLevel: this.userLevel,
			userType: this.userProfile.userType,
			userId: this.userProfile.userId,

		};
		this.isLoading = true;
		if(this.userLevel == 4 ){
			this.trainingTypeServices.viewTrainings(paramObj).subscribe({
				next: (res: any) => {
					//console.log(res);
					this.resultListData.length = previousSize; // set current size
					this.resultListData.push(...res?.data); // merge with existing data
					this.resultListData.length = res?.totalRecord; // update length
					this.dataSource.paginator = this.paginator; // update paginator
					this.dataSource._updateChangeSubscription(); // update table
					this.isLoading = false;
					this.isNorecordFound = this.resultListData.length ? false : true;
					this.isInitAdmin = false;
					this.spinner.hide();
	
				}, error: (error: any) => {
					this.isLoading = false;
					this.spinner.hide();
				}
	
			});

		}else if(this.userLevel == 3 || this.userLevel == 1){
			this.trainingTypeServices.viewTrainingsblock(paramObj).subscribe({
				next: (res: any) => {
					//console.log(res);
					this.resultListData.length = previousSize; // set current size
					this.resultListData.push(...res?.data); // merge with existing data
					this.resultListData.length = res?.totalRecord; // update length
					this.dataSource.paginator = this.paginator; // update paginator
					this.dataSource._updateChangeSubscription(); // update table
					this.isLoading = false;
					this.isNorecordFound = this.resultListData.length ? false : true;
					this.isInitAdmin = false;
					this.spinner.hide();
	
				}, error: (error: any) => {
					this.isLoading = false;
					this.spinner.hide();
				}
	
			});

		}
		

	}

	deleteTraining(id: any): void {
		this.alertHelper
			.deleteAlert("Are you sure to delete?", "", "question", "Yes, delete it!")
			.then((result) => {
				if (result.value) {

					let paramList: any = { teacherTraningid: id, updatedBy: this.userProfile.userId };
					//console.log(paramList);
					this.trainingTypeServices.deleteTrainingData(paramList).subscribe((res: any) => {
						//this.ngOnInit();
						this.alertHelper.successAlert(
							"Deleted!",
							"Deleted Successfully",
							"success"
						).then(() => {
							this.ngOnInit();
						});

					});
				}
			});

	}

	initializeviewTableForm() {
		this.viewTableForm = this.formBuilder.group({
			checkAll: [this.checkAll],
			districtId: [this.userProfile.district],
			blockId: [this.userProfile.block ? this.userProfile.block:""],
			trainingLevel: [this.userProfile.userLevel],
			checkRecordArr: this.formBuilder.array([], [Validators.required]),
		});
	}

	resetFormArray() {
		this.resultListData.forEach((eachdata: any) => {
			eachdata.isChecked = false;
		});
		(this.viewTableForm.get("checkRecordArr") as FormArray).clear();
	}


	checkUncheckAll() {
		this.resetFormArray();
		if (this.viewTableForm.get("checkAll")?.value !== true) {
			const checkRecordArr: FormArray = this.viewTableForm.get(
				"checkRecordArr"
			) as FormArray;
			this.resultListData.forEach((eachdata: any) => {
				// console.log('eachdata::::',eachdata);
				checkRecordArr.push(new FormControl(eachdata.studentId));
				eachdata.isChecked = true;
			});
			console.log(this.viewTableForm);
		}
	}

	onCheckboxChange(e: any) {
		const checkRecordArr: FormArray = this.viewTableForm.get(
			"checkRecordArr"
		) as FormArray;
		if (e.target.checked) {
			checkRecordArr.push(new FormControl(e.target.value));
		} else {
			this.viewTableForm.get("checkAll")?.setValue(false);
			let i: number = 0;
			checkRecordArr.controls.forEach((item: any) => {
				if (item.value == e.target.value) {
					checkRecordArr.removeAt(i);
					return;
				}
				i++;
			});
		}
	}

	viewBlockNotification(e:any){
		this.spinner.show();
		e['districtId'] = this.userProfile.district;
		this.trainingTypeServices.BlockNotification(e).subscribe((res:any)=>{
		  this.BlockList = res.data;
		  this.spinner.hide();
		})
	  }

	downloadTrainingType(e:any){
		this.spinner.show();
		this.csvData = {academicYear:e.academicYear,trainingName:e.trainingName,userLevel: this.userProfile.userLevel};
		
		this.trainingTypeServices.downloadTrainingData(
		  this.csvData
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
				"Academic Year",
				"Training Subject",
				"Training Name",
				"Notification Status",
				"Training Status"
			  ],
			};
		  
		  new ngxCsv(data, "viewTrainingType", this.csvoptions);
		  this.spinner.hide();
		});
	  }
	
	  printPage() {
		let cloneTable 	= document.getElementById("viewTable")?.innerHTML;
		const pageTitle = document.querySelector(".pageName")?.innerHTML;
		this.commonService.printPage(cloneTable, pageTitle);
	  }

	  statusChange(id: any): void {
		if(this.userProfile.userLevel == 4){
			this.status = 2;
			this.tStatus = 1;
			this.districtId = this.userProfile.district;
			this.blockId = "";
		}else if(this.userProfile.userLevel == 3){
			this.status = 3;
			this.tStatus = 2;
			this.districtId = this.userProfile.district;
			this.blockId = this.userProfile.block;
		}
		console.log(this.tStatus);
		this.alertHelper
		  .submitAlert().then((result) => {
			if (result.value) {
			  this.spinner.show();
			  this.trainingTypeServices
				.trainingStatus({encId: id,updatedBy: this.userProfile.userId,status:this.status,tStatus:this.tStatus,districtId:this.districtId,blockId:this.blockId})
				.subscribe((res: any) => {
				  this.spinner.hide();
					this.alertHelper
					  .successAlert(
						"Submitted!",
						"Training completed successfully.",
						"success"
					  )
					  .then(() => {
						this.loadData(this.getSearchParams());
					  });
				});
			}
		  });
	  }

	sendNotification(){
		this.submitted = true;
		const checkRecordArr: FormArray = this.viewTableForm.get(
		"checkRecordArr"
		) as FormArray;
		if (checkRecordArr.controls.length < 1) {
			this.alertHelper.viewAlertHtml(
				"error",
				"Invalid",
				"Select at least one record"
			);
			return;
		}
		if (this.viewTableForm.valid == true) {
			this.alertHelper.submitAlert().then((result) => {
			  	if (result.value) {
					this.spinner.show();
					this.trainingTypeServices
					.sendNotificationByDisAndBlock(this.viewTableForm.value)
					.subscribe({
						next: (res: any) => {
						this.spinner.hide();
						this.alertHelper
							.successAlert(
							"Submitted!",
							"Notification sent successfully.",
							"success"
							)
							.then(() => {
							this.resetFormArray();
							this.initializeviewTableForm();
							this.loadData(this.getSearchParams());
							});
						},
						error: (error: any) => {
							this.spinner.hide(); //==== hide spinner
							//this.resetFormArray();
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
					});
			  	}
			});
		}
	}




}

