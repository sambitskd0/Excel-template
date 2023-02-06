import { Component, Input, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { ProgressBarMode } from '@angular/material/progress-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { MatTableExporterDirective } from 'mat-table-exporter';
import { NgxSpinnerService } from 'ngx-spinner';
import { AlertHelper } from 'src/app/core/helpers/alert-helper';
import { PrivilegeHelper } from 'src/app/core/helpers/privilege-helper';
import { CommonserviceService } from 'src/app/core/services/commonservice.service';
import { UpdateLatLongService } from '../services/update-lat-long.service';
import { Constant } from 'src/app/shared/constants/constant';
import { formatDate } from "@angular/common";
declare let $: any;

@Component({
  selector: 'app-update-lat-long',
  templateUrl: './update-lat-long.component.html',
  styleUrls: ['./update-lat-long.component.css']
})
export class UpdateLatLongComponent implements OnInit {
  public userProfile = JSON.parse(sessionStorage.getItem("userProfile") || '{}');
  @ViewChild("searchForm") searchForm!: NgForm;
  @ViewChild("requestStatusform") requestStatusform!: NgForm;
  @Input() mode!: ProgressBarMode;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatTableExporterDirective, { static: true })
  exporter!: MatTableExporterDirective;
  pageIndex: any = 0;
  previousSize: any = 0;
  pageSize = 10;
  offset = 0;
  currentPage = 0;
  totalRows = 0;
  pageSizeOptions: number[] = [10, 25, 100];
  adminPrivilege: boolean = false;
  displayedColumns: string[] = [];
  displayedColumnsRej: string[] = [];
  public show: boolean = true;
  public buttonName: any = 'Show';
  disrtictChanged: boolean = false;
  posts: any;
  districtData: any;
  blockChanged: boolean = false;
  blockData: any;
  clusterChanged: boolean = false;
  clusterData: any;
  searchDistrictId: any = "";
  searchBlockId: any = "";
  pagelevel: any;
  searchClusterId: any = "";
  viewRequestData: any = [];
  dataSource = new MatTableDataSource(this.viewRequestData);
  paramObj: any;
  isLoading: boolean = false;
  isNorecordFound: boolean = false;
  plPrivilege: string = "view"; //For menu privilege
  config = new Constant();
  academicYear: any = this.config.getAcademicCurrentYear();
  userId: any = "";
  isInitAdmin: boolean = false;
  encId: any;
  requestStatus: any = "";
  requestRemark: any = "";
  filterSearched: boolean = false;
  isNorecordFoundNewReq: boolean = false;

  isNorecordFoundRejReq: boolean = false;
  paramMod: any;
  udiseCode: any = "";
  schoolName: any = "";
  requestedLat: any = "";
  requestedLong: any = "";
  startDate: any = "";
  endDate: any = "";
  maxDate: any = "";
  previousLat: any;
  previousLong: any;
  requestedDesg: any;
  requestedName: any;


  constructor(
    private commonService: CommonserviceService,
    private spinner: NgxSpinnerService,
    private route: Router,
    private UpdateLatLongService: UpdateLatLongService,
    private privilegeHelper: PrivilegeHelper,
    private alertHelper: AlertHelper,
  ) { 
    this.maxDate = new Date;
    const pageUrl: any = this.route.url;
    this.plPrivilege = this.privilegeHelper.PrimaryLinkPrivilege(pageUrl);  //For menu privilege    
    //this.commonService.verifyLinkPermission(pageUrl, this.config.linkType[2], this.config.privilege[1]);  // For authorization
    const users = this.commonService.getUserProfile();
    this.userId = users?.userId;
  }

  ngOnInit(): void {
    this.userProfile = this.commonService.getUserProfile();
    if (this.plPrivilege == 'admin') {
      this.adminPrivilege = true;
      this.displayedColumns = [
        "slNo",
        "requestToken",
        "requestedBy",
        "schoolName",
        "districtName",
        "blockName",
        "clusterName",
        "requestDates",
        "currentLat",
        "currentLong",
        "requestLat",
        "requestLong",
        "requestRemark",
        "action",
      ];

    } else {
      this.displayedColumns = [
        "slNo",
        "requestToken",
        "requestedBy",
        "schoolName",
        "districtName",
        "blockName",
        "clusterName",
        "requestDates",
        "currentLat",
        "currentLong",
        "requestLat",
        "requestLong",
        "requestRemark"
      ];

    }

    this.getDistrict();
  }

  getDistrict() {
    this.disrtictChanged = true;
    this.commonService.getAllDistrict().subscribe((res: []) => {
      this.posts = res;
      this.districtData = this.posts.data;
      if (this.userProfile.district != 0 || this.userProfile.district != "") {
        this.districtData = this.districtData.filter((dis: any) => {
          return dis.districtId == this.userProfile.district;
        });
        this.searchForm.controls['searchDistrictId'].patchValue(this.userProfile.district);
        this.getBlock(this.userProfile.district);
      }
      this.disrtictChanged = false;
    });
  }



  getBlock(id: any) {
    this.blockChanged = true;
    const districtId = id;
    this.blockData = [];
    if (districtId !== '') {
      this.commonService.getBlockByDistrictid(districtId).subscribe((res) => {
        let data: any = res;
        for (let key of Object.keys(data['data'])) {
          this.blockData.push(data['data'][key]);
        }
        if (this.userProfile.block != 0 || this.userProfile.block != "") {
          this.blockData = this.blockData.filter((blo: any) => {
            return blo.blockId == this.userProfile.block;
          });
          this.searchForm.controls['searchBlockId'].patchValue(this.userProfile.block);
          this.getCluster(this.userProfile.block);
        }
        this.blockChanged = false;
      });
    } else {
      this.blockChanged = false;
    }
  }


  getCluster(id: any) {
    this.clusterChanged = true;
    const blockId = id;
    this.clusterData = [];
    if (blockId !== '') {
      this.commonService.getClusterByBlockId(blockId).subscribe((res) => {
        let data: any = res;
        for (let key of Object.keys(data['data'])) {
          this.clusterData.push(data['data'][key]);
        }
        if (this.userProfile.cluster != 0 || this.userProfile.cluster != "") {
          this.clusterData = this.clusterData.filter((cls: any) => {
            return cls.clusterId == this.userProfile.cluster;
          });
          this.searchForm.controls['searchClusterId'].patchValue(this.userProfile.cluster);
        }
        this.clusterChanged = false;
      });
    } else {
      this.clusterChanged = false;
    }
  }

  getSearchParams() {
    return {
      previousSize: this.previousSize,
      offset: this.offset.toString(),
      pageSize: this.pageSize.toString(),
      searchDistrictId: this.searchDistrictId,
      searchBlockId: this.searchBlockId,
      searchClusterId: this.searchClusterId,
      startDate: this.startDate,
      endDate: this.endDate
    };
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  onSearch() {
    this.filterSearched = true
    this.pageIndex = 0;
    this.previousSize = 0;
    this.offset = 0;
    if (this.startDate === "") {
      this.alertHelper.viewAlert(
        "error",
        "Required",
        "Please select Start Date."
      );
      return ;
    }

    if (this.endDate === "") {
      this.alertHelper.viewAlert(
        "error",
        "Required",
        "Please select End Date."
      );
      return ;
    }

    if (this.startDate != "" && this.endDate != "") {
      if (
        formatDate(this.endDate, "yyyy-MM-dd", "en_US") <
        formatDate(this.startDate, "yyyy-MM-dd", "en_US")
      ) {
        this.alertHelper.viewAlert(
          "error",
          "Invalid",
          "End Date should not be smaller than Start Date"
        );
        this.endDate = undefined;
        return ;
      }
    }

    this.loadDataRequest(this.getSearchParams());

  }


  loadDataRequest(params: any) {
    this.spinner.show();
    this.paramObj = {
      offset: params.offset,
      limit: params.pageSize,
      searchDistrictId: params.searchDistrictId,
      searchBlockId: params.searchBlockId,
      searchClusterId: params.searchClusterId,
      startDate: params.startDate,
      endDate: params.endDate
    }
    this.UpdateLatLongService.getNewRequestUpdateLatLong(this.paramObj).subscribe({
      next: (res: any) => {
        this.viewRequestData.length = params.previousSize; // set current size
        this.viewRequestData.push(...res?.data); // merge with existing data
        this.viewRequestData.length = res?.totalRecord; // update length
        this.dataSource.paginator = this.paginator; // update paginator
        this.dataSource._updateChangeSubscription(); // update table
        this.isLoading = false;
        this.isNorecordFoundNewReq = this.viewRequestData.length ? false : true;
        this.spinner.hide();
      },
      error: (error: any) => {
        this.isLoading = false;
        this.spinner.hide();
      },

    });
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
    this.loadDataRequest(this.getSearchParams());
  }

  toggle() {
    this.show = !this.show;
    if (this.show)
      this.buttonName = "Hide";
    else
      this.buttonName = "Show";
  }

  getRequestDataValues(id: any, udise: any, schlName: any, requestedLat: any, requestedLong: any,previousLat: any, previousLong: any,requestedName:any , requestedDesg:any) {
    this.requestStatus = "";
    this.requestRemark = "";
    this.encId = id;
    this.udiseCode = udise;
    this.schoolName = schlName;
    this.requestedLat = requestedLat;
    this.requestedLong = requestedLong;
    this.previousLat = previousLat;
    this.previousLong = previousLong;
    this.requestedName = requestedName;
    this.requestedDesg = requestedDesg;
  }

  updateRequestStatus() {

    const validateActionModal = this.validateActionModal();
    if (validateActionModal === true) {
      this.paramMod = {
        encId: this.encId,
        requestStatus: this.requestStatus,
        requestRemark: this.requestRemark,
        userId: this.userId,
      }
      const sts = (this.requestStatus == 1) ? "reject" : "approve";
      const stsed = (this.requestStatus == 1) ? "rejected" : "approved";
      this.alertHelper.updateAlert(
        "Do you want to Update?",
            "question",
            "Yes, Update it!",
            "No, keep it")
        .then((result: any) => {
          if (result.value) {
            this.spinner.show();
            this.UpdateLatLongService
              .updateStatusLatLongRequest(this.paramMod)
              .subscribe({
                next: (res: any) => {
                  this.spinner.hide();
                  this.alertHelper
                    .successAlert(
                      "Saved!",
                      'Latitude & longitude '+stsed +' successfully.',
                      "success"
                    )
                    .then(() => {
                      this.requestStatus = "";
                      this.requestRemark = "";
                      $('#exampleModal').modal('hide');
                      this.loadDataRequest(this.getSearchParams());
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
                complete: () => console.log("done"),
              });
          }
        });
    }
  }

  validateActionModal() {
    if (this.requestStatus === "") {
      this.alertHelper.viewAlert(
        "error",
        "Required",
        "Please select Status"
      );
      return false;
    }

    if (this.requestRemark === "") {
      this.alertHelper.viewAlert(
        "error",
        "Required",
        "Remarks field cannot be blank"
      );
      return false;
    }
    return true;
  }

}
