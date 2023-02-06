import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { TeacherTransferService } from '../services/teacher-transfer.service';
import { ProgressBarMode } from '@angular/material/progress-bar';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableExporterDirective } from 'mat-table-exporter';
import { MatTableDataSource } from '@angular/material/table';
import { HttpParams } from '@angular/common/http';
import { NgForm, FormGroup, FormBuilder, FormArray, FormControl, Validators } from '@angular/forms';
import { CommonserviceService } from 'src/app/core/services/commonservice.service';
import { SchoolService } from '../../school/services/school.service';
import { AlertHelper } from 'src/app/core/helpers/alert-helper';
import { ErrorHandler } from 'src/app/core/helpers/error-handler';
import { CustomValidators } from 'src/app/shared/validations/custom-validators';
import { environment } from 'src/environments/environment';
import { Constant } from 'src/app/shared/constants/constant';
import { PrivilegeHelper } from 'src/app/core/helpers/privilege-helper';
import { Router } from '@angular/router';

declare var $: any;

@Component({
  selector: 'app-view-teacher-transfer',
  templateUrl: './view-teacher-transfer.component.html',
  styleUrls: ['./view-teacher-transfer.component.css']
})
export class ViewTeacherTransferComponent implements OnInit {
  @ViewChild("searchForm") searchForm!: NgForm;
  @ViewChild('closeModal') closeModal!: ElementRef;
  public userProfile = JSON.parse(sessionStorage.getItem("userProfile") || '{}');
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
  displayedColumns = [
    "chkAll",
    "slNo",
    "teacherName",
    "designation",
    "transferRequestDate",
    "district",
    "block",
    "cluster",
    "school",
    "Remark",
    "Status",
    "actions",
  ];
  transferRequestData: any = [];
  dataSource = new MatTableDataSource(this.transferRequestData);
  //end
  paramObj: any;
  serviceType: string = "Search";
  isLoading = false;
  pageIndex: any = 0;
  previousSize: any = 0;

  searchDistrictId: any = "";
  searchBlockId: any = "";
  searchClusterId: any = "";
  searchSchoolId: any = "";
  descFullText: string = "";

  scDisrtictSelect: boolean = true;
  scDisrtictLoading: boolean = false;
  scBlockSelect: boolean = true;
  scBlockLoading: boolean = false;
  scClusterSelect: boolean = true;
  scClusterLoading: boolean = false;
  scSchoolCatSelect: boolean = true;
  scSchoolCatLoading: boolean = false;
  scSchoolSelect: boolean = true;
  scSchoolLoading: boolean = false;
  searchDistrictData: any = [];
  searchBlockData: any = [];
  clusterData: any = [];
  schoolCatData: any = [];
  getSchoolData: any = [];
  districtData: any = [];
  blockData: any = [];

  public showActionLoader: boolean = true;
  public showActionDetails: boolean = false;
  transferStatusDetails: any = [];
  transferLogDetails: any = [];

  public show: boolean = true;
  public buttonName: any = 'Show';

  viewTableForm!: FormGroup;
  submitted = false;
  allLabel: string[] = ["Records"];
  checkAll: boolean = false;
  isChecked: boolean = false;
  addRemark: any = "";
  userId: any = '';
  plPrivilege: string = "view"; //For menu privilege
  adminPrivilege: boolean = false;
  config = new Constant();
  constructor(
    private spinner: NgxSpinnerService,
    private transferService: TeacherTransferService,
    public commonService: CommonserviceService,
    private schoolService: SchoolService,
    private privilegeHelper: PrivilegeHelper,   //For menu privilege
    private router: Router,
    private alertHelper: AlertHelper,
    private errorHandler: ErrorHandler,
    private formBuilder: FormBuilder,
    public customValidators: CustomValidators
  ) {
    const pageUrl: any = this.router.url;
    this.plPrivilege = this.privilegeHelper.PrimaryLinkPrivilege(pageUrl);  //For menu privilege    
    this.commonService.verifyLinkPermission(pageUrl, this.config.linkType[2], this.config.privilege[1]);  // For authorization
    const users = this.commonService.getUserProfile();
    this.userId = users?.userId;
  }

  ngOnInit(): void {
    if (this.plPrivilege == 'admin') {
      this.adminPrivilege = true;
    }
    this.initializeForm();
    this.viewTeacherTransferRequest(this.getSearchParams());
    this.getDistrict();
    this.getSchoolCategory();

  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  toggle() {
    this.show = !this.show;
    if (this.show)
      this.buttonName = "Hide";
    else
      this.buttonName = "Show";
  }

  showDescription(descText: string) {
    this.descFullText = descText;
  }

  viewTeacherTransferRequest(...params: any) {
    this.spinner.show();

    const {
      previousSize,
      offset,
      pageSize,
      searchDistrictId,
      searchBlockId,
      searchClusterId,
      searchSchoolId
    } = params[0];

    this.paramObj = {
      offset: offset,
      limit: pageSize,
      serviceType: this.serviceType,
      viewType: 2,
      userId: this.userProfile.userId,
      loginUserType: this.userProfile.loginUserTypeId,
      searchDistrictId: searchDistrictId,
      searchBlockId: searchBlockId,
      searchClusterId: searchClusterId,
      searchSchoolId: searchSchoolId
    };

    this.isLoading = true;

    this.transferService.viewTransferRequest(this.paramObj).subscribe({
      next: (res: any) => {
        this.transferRequestData.length = previousSize; // set current size
        this.transferRequestData.push(...res?.data); // merge with existing data
        this.transferRequestData.length = res?.totalRecord; // update length
        this.dataSource.paginator = this.paginator; // update paginator
        this.dataSource._updateChangeSubscription(); // update table

        this.isLoading = false;
        this.spinner.hide();
      },
      error: (error: any) => {
        this.isLoading = false;
        this.spinner.hide();
      },
    });
  }

  getSearchParams() {
    return {
      previousSize: this.previousSize,
      offset: this.offset.toString(),
      pageSize: this.pageSize.toString(),
      searchDistrictId: this.searchDistrictId,
      searchBlockId: this.searchBlockId,
      searchClusterId: this.searchClusterId,
      searchSchoolId: this.searchSchoolId
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
    this.viewTeacherTransferRequest(this.getSearchParams());
  }

  onSearch() {
    this.offset = 0;
    this.previousSize = 0;
    this.pageIndex = 0;
    this.transferRequestData.splice(0, this.transferRequestData.length); // empty current data
    this.dataSource.paginator = this.paginator; // update paginator
    this.viewTeacherTransferRequest(this.getSearchParams());
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
        this.searchForm.controls['searchDistrictId'].patchValue(this.userProfile.district);
        this.getBlock(this.userProfile.district);
      }
      else {
        this.searchDistrictData = this.districtData;
        this.scDisrtictSelect = true;
      }

      this.searchBlockId = '';
      this.scDisrtictLoading = false;
    });

  }

  getBlock(districtId: any) {
    this.scBlockSelect = false;
    this.scBlockLoading = true;

    this.searchBlockData = [];
    this.searchForm.controls['searchBlockId'].patchValue('');

    this.clusterData = [];
    this.searchForm.controls['searchClusterId'].patchValue('');

    this.getSchoolData = [];
    this.searchForm.controls['searchSchoolId'].patchValue('');

    if (districtId !== '') {
      this.commonService.getBlockByDistrictid(districtId).subscribe((res: any) => {
        this.searchBlockData = res;
        this.searchBlockData = this.searchBlockData.data;

        if (this.userProfile.block != 0 || this.userProfile.block != "") {
          this.searchBlockData = this.searchBlockData.filter((blo: any) => {
            return blo.blockId == this.userProfile.block;
          });
          this.searchForm.controls['searchBlockId'].patchValue(this.userProfile.block);
          this.getCluster(this.userProfile.block);
        }
        else {
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
    this.searchForm.controls['searchClusterId'].patchValue('');

    this.getSchoolData = [];
    this.searchForm.controls['searchSchoolId'].patchValue('');

    if (blockId !== '') {
      this.commonService.getClusterByBlockId(blockId).subscribe((res: any) => {
        this.clusterData = res;
        this.clusterData = this.clusterData.data;

        if (this.userProfile.cluster != 0 || this.userProfile.cluster != "") {
          this.clusterData = this.clusterData.filter((clu: any) => {
            return clu.clusterId == this.userProfile.cluster;
          });
          this.searchForm.controls['searchClusterId'].patchValue(this.userProfile.cluster);
          this.getSchool();
        }
        else {
          this.scClusterSelect = true;
        }
        this.scClusterLoading = false;
      });
    } else {
      this.scClusterSelect = true;
      this.scClusterLoading = false;
    }
  }

  getSchoolCategory() {
    this.scSchoolCatSelect = false;
    this.scSchoolCatLoading = true;

    this.schoolService.getSchoolCategory().subscribe((res: any) => {
      this.schoolCatData = res;
      this.schoolCatData = this.schoolCatData.data;

      if (this.userProfile?.schoolCategory != 0 && this.userProfile?.schoolCategory != "" && this.userProfile?.schoolCategory != null) {
        this.schoolCatData = this.schoolCatData.filter((cat: any) => {
          return cat.schlCatId == this.userProfile.schoolCategory;
        });
        this.getSchool();
      }
      else {
        this.scSchoolCatSelect = true;
      }
      this.scSchoolCatLoading = false;
    });
  }

  getSchool() {
    let clusterId = this.searchForm.controls['searchClusterId'].value;

    this.scSchoolSelect = false;
    this.scSchoolLoading = true;

    this.getSchoolData = [];
    this.searchForm.controls['searchSchoolId'].patchValue('');

    if (clusterId !== '') {
      this.commonService.getSchoolList(clusterId, 0).subscribe((res: any) => {
        this.getSchoolData = res;
        this.getSchoolData = this.getSchoolData.data;

        if (this.userProfile.udiseCode != 0 || this.userProfile.udiseCode != "") {
          this.getSchoolData = this.getSchoolData.filter((sch: any) => {
            return sch.schoolUdiseCode == this.userProfile.udiseCode;
          });
          this.searchForm.controls['searchSchoolId'].patchValue(this.getSchoolData[0].schoolId);
        }
        else {
          this.scSchoolSelect = true;
        }
        this.scSchoolLoading = false;
      });
    } else {
      this.scSchoolSelect = true;
      this.scSchoolLoading = false;
    }
  }

  deleteRequest(id: string) {
    this.alertHelper
      .deleteAlert(
        "Are you sure to delete?",
        " ",
        "question",
        "Yes, delete it!"
      )
      .then((result) => {
        if (result.value) {
          this.spinner.show(); // show spinner
          this.isLoading = true;
          this.transferService.deleteTransferRequest(id).subscribe({
            next: (res: any) => {
              if (res?.status === 'SUCCESS') {
                this.alertHelper.successAlert(
                  "Deleted!",
                  "Transfer request deleted Successfully",
                  "success"
                )
                  .then(() => {
                    this.viewTeacherTransferRequest(this.getSearchParams());
                  });
              } else {
                this.alertHelper.viewAlert("info", res?.msg, "");
              }
              this.spinner.hide();
              this.isLoading = false;
            },
            error: (error: any) => {
              this.spinner.hide(); //==== hide spinner
              this.isLoading = false;
              this.errorHandler.serverSideErrorHandler(error); // server side error handler
            },

          });
        }
      });
  }

  viewTransferDetails(encId: any) {
    this.showActionLoader = true;
    this.showActionDetails = false;

    this.transferService.getTransferStatusDetails(encId).subscribe({
      next: (response: any) => {
        this.transferStatusDetails = response.data;
        this.transferLogDetails = response.logData;
        this.showActionDetails = true;
        this.showActionLoader = false;
      },
      error: (error: any) => {
        this.showActionDetails = false;
        this.showActionLoader = true;
      }
    });
  }

  initializeForm() {
    this.viewTableForm = this.formBuilder.group({
      checkAll: [this.checkAll],
      checkRecordArr: this.formBuilder.array([], [Validators.required]),
      addRemark: [this.addRemark]
    });
  }

  resetFormArray() {
    this.transferRequestData.forEach((eachdata: any) => {
      eachdata.isChecked = false;
    });
    (this.viewTableForm.get('checkRecordArr') as FormArray).clear();
  }

  resetRemark() {
    this.viewTableForm.get("addRemark")?.setValue("");
  }

  checkUncheckAll() {
    this.resetFormArray();
    if (this.viewTableForm.get("checkAll")?.value !== true) {
      const checkRecordArr: FormArray = this.viewTableForm.get('checkRecordArr') as FormArray;
      this.transferRequestData.forEach((eachdata: any) => {
        if (eachdata.transferStatus == 1) {
          checkRecordArr.push(new FormControl(eachdata.encId));
          eachdata.isChecked = true;
        }
      });
    }
  }

  onCheckboxChange(e: any) {
    const checkRecordArr: FormArray = this.viewTableForm.get('checkRecordArr') as FormArray;
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

  validateRejectForm() {
    const checkRecordArr: FormArray = this.viewTableForm.get('checkRecordArr') as FormArray;
    if (checkRecordArr.controls.length < 1) {
      this.alertHelper.viewAlertHtml("error", "Invalid", "Select at least one record");
      return;
    } else {
      $("#addRemark").modal('show');
    }
  }

  submitForwardData() {
    this.submitted = true;
    const checkRecordArr: FormArray = this.viewTableForm.get('checkRecordArr') as FormArray;
    if (checkRecordArr.controls.length < 1) {
      this.alertHelper.viewAlertHtml("error", "Invalid", "Select at least one record");
      return;
    }
    if (this.viewTableForm.valid == true) {
      this.alertHelper.submitAlert().then((result) => {
        if (result.value) {
          this.spinner.show();
          this.transferService.forwardTransferRequest(this.viewTableForm.value).subscribe({
            next: (res: any) => {
              this.spinner.hide();
              this.alertHelper.successAlert(
                "Saved!",
                "Transfer request forwarded successfully.",
                "success"
              ).then(() => {
                this.resetFormArray();
                this.initializeForm();
                this.resetRemark()
                this.viewTeacherTransferRequest(this.getSearchParams());
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

  //Csv Function
  downloadTeacherTransfer() {
    this.spinner.show();
    this.paramObj.serviceType = "Download";

    this.transferService.viewTransferRequest(this.paramObj).subscribe({
      next: (res: any) => {
        let filepath = this.fileUrl + '/' + res.data.replace('.', '~');
        window.open(filepath);
        this.spinner.hide();
      },
      error: (error: any) => {
        this.spinner.hide();
      },
    });
  }
  //End

  //print function
  printPage() {
    let cloneTable = document.getElementById("viewTable")?.innerHTML;
    const pageTitle = document.querySelector(".pageName")?.innerHTML;
    this.commonService.printPage(cloneTable, pageTitle);
  }
  //End
  submitRejectData() {
    const checkRecordArr: FormArray = this.viewTableForm.get('checkRecordArr') as FormArray;
    if (checkRecordArr.controls.length < 1) {
      this.alertHelper.viewAlertHtml("error", "Invalid", "Select atleast one record");
      return;
    }

    const remark: any = this.viewTableForm.get("addRemark")?.value.trim();
    if (remark == null || remark == "") {
      this.alertHelper.viewAlertHtml("error", "Invalid", "Enter remark for rejection.");
      return;
    }

    if (this.viewTableForm.valid == true) {
      this.alertHelper.submitAlert().then((result) => {
        if (result.value) {
          this.spinner.show();
          this.transferService.rejectTransferRequest(this.viewTableForm.value).subscribe({
            next: (res: any) => {
              this.spinner.hide();
              this.alertHelper.successAlert(
                "Saved!",
                "Transfer request rejected successfully.",
                "success"
              ).then(() => {
                this.resetFormArray();
                this.initializeForm();
                this.resetRemark();
                this.closeModal.nativeElement.click();
                this.viewTeacherTransferRequest(this.getSearchParams());
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


}
