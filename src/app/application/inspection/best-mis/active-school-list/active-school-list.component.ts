import { Component, OnInit, ViewChild, Input, ViewEncapsulation } from "@angular/core";
import { FormGroup, FormBuilder, NgForm } from "@angular/forms";
import { CommonserviceService } from "src/app/core/services/commonservice.service";
import { NgxSpinnerService } from "ngx-spinner";
import { DataTableDirective } from "angular-datatables";
import { AlertHelper } from "src/app/core/helpers/alert-helper";
import { ngxCsv } from "ngx-csv/ngx-csv";
import { InspectionMisService } from "../../services/inspection-mis.service";
import { ProgressBarMode } from "@angular/material/progress-bar";
import { MatSort } from "@angular/material/sort";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableExporterDirective } from "mat-table-exporter";
import { MatTableDataSource } from "@angular/material/table";
import { formatDate } from "@angular/common";
import { environment } from "src/environments/environment";

@Component({
  selector: 'app-active-school-list',
  templateUrl: './active-school-list.component.html',
  styleUrls: ['./active-school-list.component.css']
})
export class ActiveSchoolListComponent implements OnInit {

  [x: string]: any;
  displayTable: boolean = false;
  questSearchform!: FormGroup;
  SearchformId!: FormGroup;
  isLoading = false;
  isNorecordFound: boolean = false;
  tattenlength: boolean = false;
  pageIndex: any = 0;
  previousSize: any = 0;
  // mat table
  @ViewChild("searchForm") searchForm!: NgForm;
  @Input() mode!: ProgressBarMode;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatTableExporterDirective, { static: true })
  isimageUrlTeacher: boolean = false;
  imageUrlTeacher: any = "";
  public fileUrl = environment.filePath;

  exporter!: MatTableExporterDirective;
  pageSize = 10;
  offset = 0;
  currentPage = 0;
  totalRows = 0;
  displayedColumns: string[] = [
    "slNo",
    "Udise",
    "school_name",
    "district_name",
    "block_name",
    "cluster_name",
    "panchayat",
    "lat",
    "long",
    "Managment",
    
  ]; // define mat table columns

  resultListData: any = [];
  questionDetailsData!: any;
  dataSource = new MatTableDataSource(this.resultListData);
  //end
  csvData: any;
  csvoptions: any;
  bodyData: any;
  @ViewChild(DataTableDirective, { static: false })
  datatableElement!: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  scDisrtictChanged: boolean = false;
  districtData: any;
  inspStatusId: number = 0;
  schoolStatusId: number = 0;
  userProfile = this.commonService.getUserProfile();
  userType = this.userProfile.userType;
  userLevel = this.userProfile.userLevel;
  userId = this.userProfile.userId;
  sessionDistrictId: any =
    this.userProfile.district != 0 ? this.userProfile.district : "";
  sessionBlockId: any =
    this.userProfile.block != 0 ? this.userProfile.block : "";
  sessionClusterId: any =
    this.userProfile.cluster != 0 ? this.userProfile.cluster : "";
  sessionSchoolId: any =
    this.userProfile.school != 0 ? this.userProfile.school : "";
  sessionDegId: any = this.userProfile.designationId;
  scBlockChanged: boolean = false;
  blockData: any;
  scClusterChanged: boolean = false;
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
  datas: any;
  tatten: any;
  absentTeacherList: any;
  studentAttendence: any;
  questionList: any;
  answerList: any;
  datasd: any;
  startDate: any;
  endDate: any;
  maxDate: any = Date;
  searchDistrictId: any = "";
  searchBlockId: any = "";
  searchClusterId: any = "";
  searchSchoolId: any = "";
  scDesignationId: any = "";
  schoolUdiseCode: any = "";
  schoolType:any = "";
  designationData: any;

  scDisrtictSelect: boolean = true;
  scDisrtictLoading: boolean = false;
  scBlockSelect: boolean = true;
  scBlockLoading: boolean = false;
  scClusterSelect: boolean = true;
  scClusterLoading: boolean = false;
  scSchoolSelect: boolean = true;
  scSchoolLoading: boolean = false;
  scDesignationChanged: boolean = false;

  searchDistrictData: any = [];
  searchBlockData: any = [];

  blockChanged: boolean = false;
  posts: any;
  searchDesignationData: any;
  degLevel: any;
  loginLevel: any;
  str: any;


  constructor(
    private formBuilder: FormBuilder,
    public commonService: CommonserviceService,
    private alertHelper: AlertHelper,
    private spinner: NgxSpinnerService,
    private InspectionMis: InspectionMisService
  ) {
    this.maxDate = new Date();
  }

  ngOnInit(): void {
    this.getDistrict();
    
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
      userType: this.userProfile.userType,
      userId: this.userProfile.userId,
      scDistrictId: this.searchForm.controls["scDistrictId"].value,
      scBlockId: this.searchForm.controls["scBlockId"].value,
      scClusterId: this.searchForm.controls["scClusterId"].value,
      schoolId: this.searchForm.controls["schoolId"].value,
      schoolUdiseCode: this.searchForm.controls["schoolUdiseCode"].value,
      schoolType: this.searchForm.controls["schoolType"].value,
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
    if (this.validateForm() === true) {
      this.loadData(this.getSearchParams());
    }
  }

  validateForm() {
    if(this.schoolUdiseCode === "")
    {
      if (this.scDistrictId === "") {
        this.alertHelper.viewAlert(
          "error",
          "Required",
          "Please select District."
        );
        return false;
      }
    }

    return true;
  }

  getDesignations(dist: any, blk: any, clus: any, level: any) {
    this.scDesignationChanged = true;
    this.scDesignationId = "";
    if (clus != "") {
      this.degLevel = 2;
    } else if (blk != "") {
      this.degLevel = 3;
    } else if (dist != "") {
      this.degLevel = 4;
    } else {
      this.degLevel = 5;
    }
    if (this.sessionClusterId != "") {
      this.loginLevel = 2;
    } else if ((this.sessionBlockId = "")) {
      this.loginLevel = 3;
    } else if (this.sessionDistrictId != "") {
      this.loginLevel = 4;
    } else {
      this.loginLevel = 5;
    }

    const levelPrm = {
      level: this.degLevel,
    };

    this.InspectionMis.getDesignation(levelPrm).subscribe((res: any) => {
      this.posts = res;
      if (this.posts == null) {
        this.designationData = [];
        this.scDesignationId = "";
        this.scDesignationChanged = false;
      } else {
        this.designationData = this.posts.data;

        if (this.sessionDegId != "") {
          this.scDesignationChanged = true;
          if (this.loginLevel == this.degLevel) {
            this.designationData = this.designationData.filter((deg: any) => {
              return deg.intDesignationId == this.userProfile.designationId;
            });

            this.searchForm.controls["scDesignationId"].patchValue(
              this.userProfile.designationId
            );
          }
          this.scDesignationChanged = false;
        }
      }

      this.scDesignationChanged = false;
    });
  }

  loadData(...params: any) {
    this.spinner.show();
    const { previousSize, offset, pageSize } = params[0];

    const paramObj = {
      offset: offset,
      limit: pageSize,
      scDistrictId: this.scDistrictId,
      scBlockId: this.scBlockId,
      scClusterId: this.scClusterId,
      schoolId: this.schoolId,
      level: 1,
      schoolUdiseCode: this.schoolUdiseCode,
      schoolType : this.schoolType,
      userType: this.userProfile.userType,
      userId: this.userProfile.userId,
      
    };
    this.isLoading = true;
    this.InspectionMis.getActiveSchoolLists(paramObj).subscribe({
      next: (res: any) => {
        this.resultListData.length = previousSize; // set current size
        this.resultListData.push(...res?.data); // merge with existing data
        this.resultListData.length = res?.totalRecord; // update length
        this.dataSource.paginator = this.paginator; // update paginator
        this.dataSource._updateChangeSubscription(); // update table
        this.isLoading = false;
        this.isNorecordFound = this.resultListData.length ? false : true;
        this.isInitAdmin = true;
        this.spinner.hide();
      },
      error: (error: any) => {
        this.isLoading = false;
        this.spinner.hide();
      },
    });
  }

  toggle() {
    const visible = $("#searchPanel").css("display");
    if (visible == "none") {
      $("#searchPanel").show(1000);
      $(".bi-caret-up-fill").show();
      $(".bi-caret-down-fill").hide();
    } else {
      $("#searchPanel").hide(400);
      $(".bi-caret-up-fill").hide();
      $(".bi-caret-down-fill").show();
    }
  }

  TakeAction(id: any) {
    this.SearchformId = this.formBuilder.group({
      encId: id,
    });
    this.spinner.show();

    this.InspectionMis.getInspectionById(this.SearchformId.value).subscribe(
      (res: any) => {
        this.datas = res?.data[0];
        this.tatten = res?.teacheratten;
        this.tattenlength = this.tatten.length ? false : true;
        this.absentTeacherList = res?.absentTeacherList;
        this.studentAttendence = res?.studentAttendence;
        this.questionList = res?.questionList;
        this.answerList = res?.answerList;
        this.spinner.hide();

        if (this.datas.inspectionPhoto !== "") {
          this.isimageUrlTeacher = true;
          this.str = this.datas.inspectionPhoto;
          const st = this.str;
          if (this.str) {
            var newstr = st?.replace(".", "~");
            this.imageUrlTeacher = this.fileUrl + newstr;
          } else {
            this.imageUrlTeacher = "";
          }
          // this.imageUrlTeacher= this.fileUrl+'uploads/inspection/bestApp/'+ newstr;
        }
      }
    );
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
        this.searchForm.controls["scDistrictId"].patchValue(
          this.userProfile.district
        );
        this.getBlock(this.userProfile.district);
      } else {
        this.searchDistrictData = this.districtData;
        this.scDisrtictSelect = true;
      }

      this.searchBlockId = "";
      this.scDisrtictLoading = false;
    });
  }

  printPage() {
    let cloneTable = document.getElementById("viewTable")?.innerHTML;
    const pageTitle = document.querySelector(".pageName")?.innerHTML;
    this.commonService.printPage(cloneTable, pageTitle);
  }

  excel(e:any) {
    this.spinner.show();
    this.csvData = this.getSearchParams();
    this.csvData['level'] = e.level;
    this.InspectionMis.downloadActiveSchoolList(this.csvData).subscribe(
      (res: any) => {
        const data = res["data"];
        this.csvoptions = {
          fieldSeparator: ",",
          quoteStrings: '"',
          decimalseparator: ".",
          showLabels: true,
          useBom: true,
          headers: [
            "SLN#",
            "UDISE Code",
            "School Name",
            "District Name",
            "Block Name",
            "Cluster Name",
            "Municipality / Panchayat Name",
            "Latitude",
            "Longitude",
            "Management Type",
          ],
        };
        new ngxCsv(data, "activeSchoolList", this.csvoptions);
        this.spinner.hide();
      }
    );
  }

  getBlock(districtId: any) {
    this.scBlockSelect = false;
    this.scBlockLoading = true;

    this.searchBlockData = [];
    this.searchForm.controls["scBlockId"].patchValue("");

    this.clusterData = [];
    this.searchForm.controls["scClusterId"].patchValue("");

    this.getSchoolData = [];
    this.searchForm.controls["schoolId"].patchValue("");

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
            this.searchForm.controls["scBlockId"].patchValue(
              this.userProfile.block
            );
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
    this.searchForm.controls["scClusterId"].patchValue("");

    this.getSchoolData = [];
    this.searchForm.controls["schoolId"].patchValue("");

    if (blockId !== "") {
      this.commonService.getClusterByBlockId(blockId).subscribe((res: any) => {
        this.clusterData = res;
        this.clusterData = this.clusterData.data;

        if (this.userProfile.cluster != 0 || this.userProfile.cluster != "") {
          this.clusterData = this.clusterData.filter((clu: any) => {
            return clu.clusterId == this.userProfile.cluster;
          });
          this.searchForm.controls["scClusterId"].patchValue(
            this.userProfile.cluster
          );
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
    this.searchForm.controls["schoolId"].patchValue("");

    if (clusterId !== "") {
      this.InspectionMis.getSchoolList(clusterId).subscribe((res: any) => {
        this.getSchoolData = res;
        this.getSchoolData = this.getSchoolData.data;

        if (
          this.userProfile.udiseCode != 0 ||
          this.userProfile.udiseCode != ""
        ) {
          this.getSchoolData = this.getSchoolData.filter((sch: any) => {
            return sch.schoolUdiseCode == this.userProfile.udiseCode;
          });
          this.searchForm.controls["schoolId"].patchValue(
            this.getSchoolData[0].schoolId
          );
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

  printModal() {
    let cloneTable = document.getElementById("printModal")?.innerHTML;
    const pageTitle = "School Monitoring Report Card";
    this.commonService.printPage(cloneTable, pageTitle);
  }

  // Material table pagination size options :: Sambit Kumar Dalai:: 10-11-2022
  get getPageSizeOptions(): number[] {
    return this.dataSource?.paginator &&
      this.dataSource?.paginator?.length > 200
      ? [10, 30, 50, 100, this.dataSource.paginator.length]
      : [10, 30, 50, 100,200 ];
  }
}

