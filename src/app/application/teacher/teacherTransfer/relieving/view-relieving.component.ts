import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonserviceService } from "src/app/core/services/commonservice.service";
import { NgxSpinnerService } from "ngx-spinner";
import{ TeacherTransferService } from '../../services/teacher-transfer.service';
import { MatTableDataSource } from "@angular/material/table";
import { SelectionModel } from "@angular/cdk/collections";
import { MatPaginator } from "@angular/material/paginator";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { CustomValidators } from "src/app/shared/validations/custom-validators";
import { AlertHelper } from "src/app/core/helpers/alert-helper";
import { CommonFunctionHelper } from "src/app/core/helpers/common-function-helper";
declare const $: any;
@Component({
  selector: 'app-view-relieving',
  templateUrl: './view-relieving.component.html',
  styleUrls: ['./view-relieving.component.css']
})
export class ViewRelievingComponent implements OnInit {
  public show:boolean = true;
  public buttonName:any = 'Show';
  
  scDisrtictSelect: boolean = true;
  scDisrtictLoading: boolean = false;
  districtData: any = "";
  public userProfile = this.commonService.getUserProfile();
  searchDistrictId: any = "";
  searchDistrictData: any = [];
  searchBlockId:any  = "";
  scBlockSelect: boolean = true;
  scBlockLoading: boolean = false;
  searchBlockData: any = [];
  clusterData: any = "";
  getSchoolData: any = "";
  searchClusterId: any  = "";
  searchTeacherId: number  = 0;
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
  searchSchoolId:any    = "";
  scSchoolCategorySelect:boolean=true;
  scSchoolCategoryLoading:boolean=false;
  searchSchoolCategoryId:any="";
  scSchoolCatagorySelect:boolean=true;
  scSchoolCatagoryLoading:boolean=false;
  resultListData: any = [];
  filterData: any = {
    teacherList: [],
  };
  teacherdropdownList:any = "";
  userInput: any = {
    districtId: "",
    blockId: "",
    promotionListForm: FormGroup,
    checkAll: false,
  };
  searchNatureOfAppointmt:any  = "";
  transnferRequestId: any = "";
  dataSource = new MatTableDataSource(this.resultListData);
  serviceModalCurrentData :any =[];
  isNoCurrentrecordFoundModal: boolean = false;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  displayedColumns = [
      "slNo",
      "teacherCode",
      "teacherName",
      "teacherTitle",
      "natureOfAppointment",
      "doj",
      "relievingDate",
      "action"
  ];
  matTable: any = {
    offset: 0,
    displayedColumns: [], // define mat table columns
    previousSize: 0,
    pageIndex: 0,
    isLoading: false,
    isSearched: false,
    totalRows: 0,
    currentPage: 0,
    pageSize: 10,
    dataSource: new MatTableDataSource(this.filterData.teacherList),
    selection: new SelectionModel(true, []),
  };
  viewTableForm!: FormGroup;  
  takeActionForm!: FormGroup;
  relievingDate:any = "";
  submitted = false;
  allLabel: string[] = ["Relieving Date"];
  maxDate: any = Date;
  hdnteacherId: number = 0;
  hdntransnferRequestId: number = 0;
  isLoading = false;
  isNorecordFound: boolean = false;
  isInitAdmin: boolean = false;
  constructor(private commonService: CommonserviceService ,private spinner: NgxSpinnerService,
		private transferService: TeacherTransferService,public customValidators: CustomValidators,private alertHelper: AlertHelper,private formBuilder: FormBuilder,private commonFunctionHelper: CommonFunctionHelper) { }
  

  ngOnInit(): void {
    this.permissionHandler();
    this.getDistrict();
    this.getBlock(this.userProfile.district);
    this.getCluster(this.userProfile.block);
    this.getSchool(this.userProfile.cluster);
    this.getTeachersList(this.userProfile.school);
    this.getAnnextureDataBySeq();
    this.initializeTakeActionForm();
    this.userSchoolid = this.userProfile.school;
    this.isInitAdmin = true;
    $("#searchbox").show();
    $(".bi-caret-down-fill").hide();
  }

  
  permissionHandler() {
    this.matTable.displayedColumns = [
      "slNo",
      "teacherCode",
      "teacherName",
      "teacherTitle",
      "natureOfAppointment",
      "doj",
      "relievingDate",
      "action"
    ];
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
		this.teacherdropdownList = [];
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
				this.teacherdropdownList.push(data["data"][key]);
			}
			this.teacherChanged = false;
		});
	}

  onSearch() {
    // if (this.validateFilter()) {
      this.spinner.show();
      // reset queryParams
      this.matTable.pageIndex = 0;
      this.matTable.previousSize = 0;
      this.matTable.offset = 0;
      this.matTable.previousSize = 0;
      this.matTable.isSearched = true;
      this.loadData(this.getSearchParams());
      this.isInitAdmin = false;
    // }
  }
  getSearchParams() {
    return {
      searchTeacherTitle: this.searchTeacherTitle,
      searchNatureOfAppointmt: this.searchNatureOfAppointmt,
      searchSchoolId: this.userProfile.school,
      searchDistrictId: this.userProfile.district,
      searchBlockId: this.userProfile.block,
      searchClusterId: this.userProfile.cluster,
      searchTeacherId: this.searchTeacherId,
      previousSize: this.matTable.previousSize,
      offset: this.matTable.offset.toString(),
      limit: this.matTable.pageSize.toString(),
      ...this.userInput,
      userId:this.userProfile?.userId
    };
  }
  loadData(params: Object) {
    this.matTable.selection.clear(); // reset check box
    this.matTable.isLoading = true;
    this.transferService.viewTeacherForRelieve(params).subscribe({
      next: (response: any) => {
        this.filterData.teacherList.length = this.matTable.previousSize; // set current size
        this.filterData.teacherList.push(...response?.data); // merge with existing data
        this.filterData.teacherList.length = response?.totalRecord; // update length
        // this.teacherList.length =  response?.totalRecord;
        this.matTable.dataSource.paginator = this.paginator; // update paginator
        this.matTable.dataSource._updateChangeSubscription(); // update table
        this.matTable.isLoading = false;
        this.isNorecordFound = this.filterData.teacherList.length ? false : true;
        console.log(this.isNorecordFound);
        this.spinner.hide();
      },
      error: (error: any) => {
        this.matTable.isLoading = false;
        this.spinner.hide();
      },
    });
    console.log(this.isNorecordFound);
  }




  onPageChange(event: any) {
    this.spinner.show();
    this.matTable.isLoading = true;
    // event: PageEvent
    this.matTable.pageSize = event.pageSize; // current page size ex: 10
    /**
     * pageIndex starts from 0
     * ex: if pageIndex = 0 then offset = 0 * 10 = 0 and if pageIndex =1 then 1*10 = 10
     */
    this.matTable.offset = event.pageIndex * event.pageSize;
    this.matTable.previousSize = this.matTable.pageSize * event.pageIndex; // set previous size
    this.matTable.pageIndex = event.pageIndex;
    this.loadData(this.getSearchParams());
  }

  get getPageSizeOptions(): number[] {
    return this.matTable.dataSource?.paginator &&
      this.matTable.dataSource?.paginator?.length > 200
      ? [10, 30, 50, 100, this.matTable.dataSource.paginator.length]
      : [10, 30, 50, 100, 200];
  }

  showDetails(    
		teacherId: any,
		transnferRequestId: any
	) {
    // this.relievingDate.setValue('');
    // this.takeActionForm.controls["relievingDate"]?.value = '';
    // this.relievingDate = '';
    //console.log(this.takeActionForm.controls["relievingDate"]?.value);
    this.relievingDate = '';
		this.teacherId = teacherId;
    this.transnferRequestId = transnferRequestId;
		this.takeActionForm.patchValue({ hdnteacherId: teacherId });
		this.takeActionForm.patchValue({ hdntransnferRequestId: transnferRequestId });
    this.takeActionForm.patchValue({ relievingDate: this.relievingDate });    
	}

  initializeTakeActionForm() {
    
		this.takeActionForm = this.formBuilder.group({
			// relievingDate: [
			// 	this.relievingDate,
			// 	[Validators.required, Validators.maxLength(250)],
			// ],
      relievingDate: [(this.relievingDate) ? this.commonFunctionHelper.formatDateHelper(this.relievingDate):this.relievingDate],
			hdnteacherId: [this.hdnteacherId],
			hdntransnferRequestId: [this.hdntransnferRequestId]
		});
	}
  
  submitTakeAction() {
		this.submitted = true;
		this.customValidators.formValidationHandler(
			this.takeActionForm,
			this.allLabel
		);

		if (this.takeActionForm.controls["relievingDate"]?.value == "") {
			this.alertHelper.viewAlertHtml("error", "Invalid", "Relieving Date Required");
			return;
		}
    
		if (this.takeActionForm.valid == true) {
			this.alertHelper.submitAlert().then((result: any) => {
				if (result.value) {
					this.spinner.show();
					this.transferService.updateRelieveDate(
						this.takeActionForm.getRawValue()
					).subscribe({
						next: (res: any) => {
							this.spinner.hide();
							this.alertHelper
								.successAlert("Saved!", "Relieving date updated successfuly", "success")
								.then(() => {
									window.location.reload();
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
					});
				}
			});
		}
	}

  viewDetails(techId:any,techRId:any){
    this.spinner.show();
    const obj ={techId : techId,techRId : techRId}
    this.transferService.viewTeacherDetails(obj).subscribe({
      next: (res: any) => {        
        this.serviceModalCurrentData = res?.data;  
        console.log(this.serviceModalCurrentData);
        this.isNoCurrentrecordFoundModal = this.serviceModalCurrentData.length ? false : true;                 
        this.spinner.hide();
      },
      error: (error: any) => {
        this.isLoading = false;
        this.spinner.hide();
      },
    });
  

  }
  printPage() {
		let cloneTable = document.getElementById("viewTable")?.innerHTML;
		const pageTitle = document.querySelector(".pageName")?.innerHTML;
		this.commonService.printPage(cloneTable, pageTitle);
	}
  toggle() {
    const visible = $("#searchbox").css("display");
    if (visible == "none") {
      $("#searchbox").show(1000);
      $(".bi-caret-up-fill").show();
      $(".bi-caret-down-fill").hide();
    } else {
      $("#searchbox").hide(400);
      $(".bi-caret-up-fill").hide();
      $(".bi-caret-down-fill").show();
    }
  }
}
