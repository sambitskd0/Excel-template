import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
} from "@angular/core";
import { FormGroup, FormBuilder, Validators, NgForm, FormArray, FormControl } from "@angular/forms";
import { CommonserviceService } from "src/app/core/services/commonservice.service";
import{ TeacherTransferService } from '../../services/teacher-transfer.service';
import { MatTableDataSource } from "@angular/material/table";
import { MatPaginator } from "@angular/material/paginator";
import { NgxSpinnerService } from "ngx-spinner";
import { MatSort } from "@angular/material/sort";
import { MatTableExporterDirective } from "mat-table-exporter";
import { SelectionModel } from "@angular/cdk/collections";
import { SchoolService } from '../../../school/services/school.service';
import { AlertHelper } from "src/app/core/helpers/alert-helper";

@Component({
  selector: 'app-view-transfer-request-school',
  templateUrl: './view-transfer-request-school.component.html',
  styleUrls: ['./view-transfer-request-school.component.css']
})
export class ViewTransferRequestSchoolComponent implements OnInit {
  @ViewChild("searchForm") searchForm!: NgForm;
  filterData: any = {
    teacherList: [],
  };
  userInput: any = {
    districtId: "",
    blockId: "",
    promotionListForm: FormGroup,
    checkAll: false,
  };
  public show:boolean = true;
  public buttonName:any = 'Show';
  viewTableForm!: FormGroup;
  previousSize: any = 0;
  offset = 0;
  currentPage = 0;   
  public userProfile = this.commonService.getUserProfile();
  totalRows = 0;
  pageSize = 10;
  pageSizeOptions: number[] = [10, 25, 100];
  paramObj: any;
  userId: any = "";
  isLoading = false;
  resultListData: any = [];
  searchTeacherTitle:any  = "";
  searchNatureOfAppointmt:any  = "";
  dataSource = new MatTableDataSource(this.resultListData);
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  isNorecordFound: boolean = false;
  searchDistrictData: any = [];
  searchBlockData: any = [];
  clusterData: any = [];
  schoolCatData: any = [];
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
  districtData: any = [];
  blockData: any = [];
  searchBlockId: any = "";
  
  searchDistrictId: any = "";
  searchClusterId: any = "";
  searchSchoolId: any = "";
  getSchoolData: any = [];

  teacherTitles: any = "";
  teacherAppointment: any = "";
  teacherTitleChanged: boolean = false;
  teacherAppointmentChanged: boolean = false;
  isInitAdmin: boolean = false;
  
  
  displayedColumns = [
    "slNo",
      "teacherName",
      "teacherTitle",
      "natureOfAppointment",
      "remark",
      "district",
      "block",
      "cluster",
      "schlCat",
      "school",
      "action"
  ];
  matTable: any = {
    offset: 0,
    displayedColumns: [], // define mat table columns
    previousSize: 0,
    pageIndex: 0,
    isLoading: false,
    isNorecordFound: false,
    isSearched: false,
    totalRows: 0,
    currentPage: 0,
    pageSize: 10,
    dataSource: new MatTableDataSource(this.filterData.teacherList),
    selection: new SelectionModel(true, []),
  };
  constructor(private formBuilder: FormBuilder,private commonService: CommonserviceService,private transferService: TeacherTransferService,private spinner: NgxSpinnerService,private schoolService: SchoolService,private alertHelper: AlertHelper,) {
    const users = this.commonService.getUserProfile();
    this.userId = users?.userId;
  }

  ngOnInit(): void {
    this.permissionHandler();
    this.getDistrict();
    this.getAnnextureDataBySeq();
    this.isInitAdmin = true;
   }

   permissionHandler() {
    this.matTable.displayedColumns = [
      "slNo",
      "teacherName",
      "teacherTitle",
      "natureOfAppointment",
      "remark",
      "district",
      "block",
      "cluster",
      "schlCat",
      "school",
      "action"
    ];
}

  getSearchParams() {
    return {
      searchTeacherTitle: this.searchTeacherTitle,
      searchNatureOfAppointmt: this.searchNatureOfAppointmt,
      searchSchoolId: this.userProfile.school,
      searchDistrictId: this.searchDistrictId,
      searchBlockId: this.searchBlockId,
      searchClusterId: this.searchClusterId,
      previousSize: this.matTable.previousSize,
      offset: this.matTable.offset.toString(),
      limit: this.matTable.pageSize.toString(),
      ...this.userInput,
      userId:this.userProfile?.userId
    };
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
  loadData(params: Object) {
    this.matTable.selection.clear(); // reset check box
    this.matTable.isLoading = true;
    this.transferService.viewTeacherTransferByHeadMaster(params).subscribe({
      next: (response: any) => {
        this.filterData.teacherList.length = this.matTable.previousSize; // set current size
        this.filterData.teacherList.push(...response?.data); // merge with existing data
        this.filterData.teacherList.length = response?.totalRecord; // update length
        this.matTable.dataSource.paginator = this.paginator; // update paginator
        this.matTable.dataSource._updateChangeSubscription(); // update table
        this.matTable.isLoading = false;
        this.matTable.isNorecordFound = this.filterData.teacherList.length
          ? false
          : true;
        this.spinner.hide();
      },
      error: (error: any) => {
        this.matTable.isLoading = false;
        this.spinner.hide();
      },
    });
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
            // console.log(sch.schoolUdiseCode);
            // console.log(this.userProfile.udiseCode);
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
          this.teacherAppointment = res?.data?.NATURE_OF_APPOINTMENT;
        },
      });
  }

  onDelete(encId: string,teacherId: number) {
    this.alertHelper
      .deleteAlert("Are you sure to delete?", "", "question", "Yes, delete it!")
      .then((result) => {
        if (result.value) {
          this.spinner.show(); // ==== show spinner
          let paramList: any = {
            encId: encId,
            teacherId: teacherId,
            updatedBy: this.userProfile.userId,
          };
          this.transferService
            .deleteTeacherTransferByHeadMaster(paramList)
            .subscribe((res: any) => {
             
              this.spinner.hide(); //==== hide spinner
              this.alertHelper.successAlert(
                "Deleted!",
                "Teacher Transfer deleted successfully",
                "success"
              );
              this.loadData(this.getSearchParams());
            });
        }
      });
  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  get getPageSizeOptions(): number[] {
    return this.matTable.dataSource?.paginator &&
      this.matTable.dataSource?.paginator?.length > 200
      ? [10, 30, 50, 100, this.matTable.dataSource.paginator.length]
      : [10, 30, 50, 100, 200];
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

