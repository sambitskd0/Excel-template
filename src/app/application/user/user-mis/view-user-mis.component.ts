import { Component, Input, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { Router } from "@angular/router";
import { ManageUserService } from "../services/manage-user.service";
import { AlertHelper } from "src/app/core/helpers/alert-helper";
import { NgxSpinnerService } from "ngx-spinner";
import { ProgressBarMode } from "@angular/material/progress-bar";
import { MatSort } from "@angular/material/sort";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableExporterDirective } from "mat-table-exporter";
import { MatTableDataSource } from "@angular/material/table";
import { CommonserviceService } from "src/app/core/services/commonservice.service";
import { PrivilegeHelper } from "src/app/core/helpers/privilege-helper";
import { Constant } from "src/app/shared/constants/constant";
import { HttpClient } from "@angular/common/http";
import { ActivatedRoute } from "@angular/router";
import { ManageProfileService } from "../services/manage-profile.service";
import { ManageUsermisService } from "../services/manage-usermis.service";
import { environment } from "src/environments/environment";
import { CustomValidators } from "src/app/shared/validations/custom-validators";

@Component({
  selector: 'app-view-user-mis',
  templateUrl: './view-user-mis.component.html',
  styleUrls: ['./view-user-mis.component.css']
})
export class ViewUserMisComponent implements OnInit {
  public fileUrl = environment.filePath;
  // mat table
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
		"slNo",
		"User Name",
		"User Id",
		"District",
		"Block",
		"Cluster",
		"Designation",
		"Assigned Employee",
		"MultiUser",
		"MultiOfficer",
	];
	paramObj: any;
	serviceType: string = "Search";
	// define mat table columns

	resultListData: any = [];
	questionDetailsData!: any;
	dataSource = new MatTableDataSource(this.resultListData);

	//end
  userSearchform!: FormGroup;
  userProfile = this.commonService.getUserProfile();
  userId: any = "";
  plPrivilege: string = "view"; //For menu privilege
	config = new Constant();
	adminPrivilege: boolean = false;
  userLevelId: any = "0";
  userTypeId: any = "0";
	designationGroupId: any = "0"
  designationData: any = [];
  multiUserAndOfficerData:any="";
  designationChanged: boolean = false;
  stateUser: boolean = false;
	distUser: boolean = false;
	blkUser: boolean = false;

  districtId: any = "0";
	blockId: any = "0";
	clusterId: any = "0";
  intDesignationId: any = "0";
	vchUserId: any = "";
  distLvl2: boolean = false;
  isNorecordFound: boolean = false;
	isLoading = false;
	previousSize: any = 0;
	pageIndex: any = 0;
  isInitAdmin: boolean = false;

  scDisrtictSelect: boolean = true;
	scDisrtictLoading: boolean = false;
	scBlockSelect: boolean = true;
	scBlockLoading: boolean = false;
	scClusterSelect: boolean = true;
	scClusterLoading: boolean = false;
  designationSelect: boolean = true;
	designationLoading: boolean =false;


  posts: any;
	districtData: any = [];
	blockData: any = [];
	clusterData: any = [];
	showSpinnerBlock: boolean = false;
	disrtictChanged: boolean = false;
	clusterChanged: boolean = false;
	blockChanged: boolean = false;
  
  distLvl: boolean = false;
	blkLvl: boolean = false;
	clusterLvl: boolean = false;
  constructor(
    private formBuilder: FormBuilder,
		public commonService: CommonserviceService,
		public ManageUserService: ManageUserService,
		public manageUsermisService: ManageUsermisService,
		private alertHelper: AlertHelper,
		private spinner: NgxSpinnerService,
		private http: HttpClient,
		private privilegeHelper: PrivilegeHelper, //For menu privilege
		private route: Router,
		private router: ActivatedRoute,
		public customValidators: CustomValidators,

		private profileService: ManageProfileService
  ) {
    const pageUrl: any = this.route.url;
		this.plPrivilege = this.privilegeHelper.PrimaryLinkPrivilege(pageUrl); //For menu privilege
		this.commonService.verifyLinkPermission(
			pageUrl,
			this.config.linkType[2],
			this.config.privilege[1]
		); // For authorization
		const users = this.commonService.getUserProfile();
		this.userId = users?.userId;
   }

  ngOnInit(): void {
    // this.spinner.show();
		if (this.plPrivilege == "admin") {
			this.adminPrivilege = true;
		}
		this.getDistrict();
		if (this.userProfile.userLevel == 5) {
			this.userLevelId = 5;
		} else if (this.userProfile.userLevel == 4) {
			this.userLevelId = 4;
			this.stateUser = true;
			this.distUser = false;
			this.blkUser = false;
		} else if (this.userProfile.userLevel == 3) {
			this.stateUser = true;
			this.distUser = true;
			this.blkUser = true;
		} else if (this.userProfile.userLevel == "") {
			this.userLevelId = 0;
		}
    if(this.userProfile.loginUserTypeId == 3 && this.userProfile.userRoleId == 1){     
      this.isInitAdmin = true;      
    }else{
      this.loadMutltiUserAndOfficerList(this.getSearchParams());      
    }

		this.userSearchform = this.formBuilder.group({
			districtId: "0",
			blockId: "0",
			clusterId: "0",
			vchUserId: "",
			intDesignationId: "0",
			userLevelId: "0",
			designationGroupId: "0",
		});

		
    
  }

  ngAfterViewInit() {
		this.dataSource.paginator = this.paginator;
		this.dataSource.sort = this.sort;
	}

	getSearchParams() {
		return {
			previousSize: this.previousSize,
			offset: this.offset.toString(),
			pageSize: this.pageSize.toString(),
			districtId:
				this.userProfile.district > 0
					? this.userProfile.district
					: this.districtId,
			blockId:
				this.userProfile.block > 0 ? this.userProfile.block : this.blockId,
			clusterId: this.clusterId,
			vchUserId: this.vchUserId,
			intDesignationId: this.intDesignationId,
			userLevelId: this.userLevelId,
			userTypeId: this.userTypeId,
			designationGroupId: this.designationGroupId,
		};
	}

	onPageChange(event: any) {
		this.spinner.show();
		this.isLoading = true;
		// event: PageEvent
		this.pageSize = event.pageSize; // current page size ex: 10
		/**
		 * pageIndex starts from 0
		 * ex: if pageIndex = 0 then offset = 0 * 10 = 0 and if pageIndex =1 then 1*10 = 10
		 */
		this.offset = event.pageIndex * event.pageSize;
		this.previousSize = this.pageSize * event.pageIndex; // set previous size
		this.pageIndex = event.pageIndex;
		this.loadMutltiUserAndOfficerList(this.getSearchParams());
	}

	onSearch() {
		// reset queryParams
		this.pageIndex = 0;
		this.offset = 0;
		this.previousSize = 0;
		this.resultListData.splice(0, this.resultListData.length); // empty current data
		this.dataSource.paginator = this.paginator; // update paginator
		if (this.validateForm() === true) {      
      this.spinner.show();
      this.loadMutltiUserAndOfficerList(this.getSearchParams());
      this.isInitAdmin = false;
    }
    else{
      this.isInitAdmin = true;
    }
	}

	loadMutltiUserAndOfficerList(...params: any) {
		this.spinner.show();

		const {
			previousSize,
			offset,
			pageSize,
			districtId,
			blockId,
			clusterId,
			vchUserId,
			intDesignationId,
			userLevelId,
      		userTypeId,
			designationGroupId,
		} = params[0];

		this.paramObj = {
			offset: offset,
			limit: pageSize,
			districtId: districtId,
			blockId: blockId,
			clusterId: clusterId,
			vchUserId: vchUserId,
			userLevelId: userLevelId,
			userTypeId: userTypeId,
			designationGroupId: designationGroupId,
			intDesignationId: intDesignationId,
			serviceType: this.serviceType,
			userId: this.userId,
		};

		this.isLoading = true;
		this.manageUsermisService.viewMultiUserAndOfficerList(this.paramObj).subscribe({
			next: (res: any) => {
				this.resultListData.length = previousSize; // set current size
				this.resultListData.push(...res?.data); // merge with existing data
				this.resultListData.length = res?.totalRecord; // update length
				this.dataSource.paginator = this.paginator; // update paginator
				this.dataSource._updateChangeSubscription(); // update table
				this.isLoading = false;
				this.isNorecordFound = this.resultListData.length ? false : true;
				this.spinner.hide();
			},
			error: (error: any) => {
				this.isLoading = false;
				this.spinner.hide();
			},
		});
	}
	filterRecord(): void {
		this.loadMutltiUserAndOfficerList();
	}

	getDistrict() {
		this.scDisrtictSelect = true;
		this.scDisrtictLoading = true;
		this.commonService.getAllDistrict().subscribe((res: []) => {
			this.posts = res;
			this.districtData = this.posts.data;

			if (this.userProfile.district != 0 || this.userProfile.district != "") {
				this.districtData = this.districtData.filter((dis: any) => {
					return dis.districtId == this.userProfile.district;
				});
				this.districtId = this.userProfile.district;
				this.getBlock(this.userProfile.district);
				this.scDisrtictSelect = false;
			} else {
				this.districtData = this.districtData;
				this.scDisrtictSelect = true;
			}
			this.scDisrtictLoading = false;
		});
	}

	getBlock(districtId: any) {
		this.scBlockSelect = false;
		this.blockChanged = true;
		this.userSearchform.patchValue({
			blockId: 0,
			clusterId: 0,
		});
		this.blockId = 0;
		this.clusterId = 0;
		this.blockData = [];
		this.scBlockLoading = true;
		if (districtId !== "") {
			this.commonService
				.getBlockByDistrictid(districtId)
				.subscribe((res: any) => {
					this.blockData = res;
					this.blockData = this.blockData.data;

					if (this.userProfile.block != 0 || this.userProfile.block != "") {
						this.blockData = this.blockData.filter((blo: any) => {
							return blo.blockId == this.userProfile.block;
						});

						this.blockId = this.userProfile.block;
						this.getCluster(this.userProfile.block);
						this.scBlockSelect = false;
					} else {
						this.scBlockSelect = true;
					}
					this.scBlockLoading = false;
				});
		} else {
			this.scBlockLoading = false;
		}
	}

	getCluster(id: any) {
		this.clusterChanged = true;
		const blockId = id;
		this.userSearchform.patchValue({
			clusterId: 0,
		});
		this.clusterId = 0;
		this.clusterData = [];
		this.scClusterLoading = true;
		if (blockId !== "") {
			this.commonService.getClusterByBlockId(blockId).subscribe((res) => {
				let data: any = res;
				for (let key of Object.keys(data["data"])) {
					this.clusterData.push(data["data"][key]);
				}
				this.clusterChanged = false;
				this.scClusterLoading = false;
			});
		} else {
			this.clusterChanged = false;
		}
	}
	
	downloadMultiUserAndOfficerList() {
		this.spinner.show();
		this.paramObj.serviceType = "Download";

		this.manageUsermisService.viewMultiUserAndOfficerList(this.paramObj).subscribe({
			next: (res: any) => {
				let filepath = this.fileUrl + "/" + res.data.replace(".", "~");
				window.open(filepath);
				this.spinner.hide();
			},
			error: (error: any) => {
				this.spinner.hide();
			},
		});
	}
	printPage() {
		let cloneTable = document.getElementById("viewTable")?.innerHTML;
		const pageTitle = document.querySelector(".pageName")?.innerHTML;
		this.commonService.printPage(cloneTable, pageTitle);
	}

	loadSubDesignation(levelId: any) {
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

  getMultiUserAndOfficer(id:any)
  {
	const typeOfUser = this.userTypeId;
	const levelOfUser = this.userLevelId;
	this.manageUsermisService.getMultiUserAndOfficer(typeOfUser,levelOfUser).subscribe((res: any) => {
    this.multiUserAndOfficerData = res.data;
      
      });
  }
  validateForm() :Boolean{
   
    if ((this.userTypeId === "" || this.userTypeId ==="0") && (this.vchUserId == "" || this.vchUserId == "0")) {
      this.alertHelper.successAlert(
        "",
        "Please select type of user.",
        "info"
      );
      return false;
    }
    return true;
    
  }

}

