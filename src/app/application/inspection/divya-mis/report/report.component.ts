import {
  Component,
  OnInit,
  AfterViewInit,
  ViewChild,
  Input,
} from "@angular/core";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { MatPaginator, PageEvent } from "@angular/material/paginator";
import { ProgressBarMode } from "@angular/material/progress-bar";
import { CommonserviceService } from "src/app/core/services/commonservice.service";
import { MatTableExporterDirective } from "mat-table-exporter";
import { HttpParams } from "@angular/common/http";
import { NgxSpinnerService } from "ngx-spinner";
import { environment } from "src/environments/environment";
import { Constant } from "src/app/shared/constants/constant";
import { ManageQuestionService } from "../../services/manage-question.service";
import { InspectionMisService } from "../../services/inspection-mis.service";
import { ActivatedRoute } from "@angular/router";
import { AlertHelper } from "src/app/core/helpers/alert-helper";
import { NgForm } from "@angular/forms";
@Component({
  selector: "app-report",
  templateUrl: "./report.component.html",
  styleUrls: ["./report.component.css"],
})
export class ReportComponent implements OnInit {
  // mat table
  @Input() mode!: ProgressBarMode;
  @ViewChild(MatSort) sort!: MatSort;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild("searchForm") searchForm!: NgForm;
  @ViewChild(MatTableExporterDirective, { static: true })
  exporter!: MatTableExporterDirective;
  pageSize = 10;
  offset = 0;
  currentPage = 0;
  totalRows = 0;
  pageSizeOptions: number[] = [10, 25, 100];
  displayedColumns: any ;
  reportData: any = [];
  questionDetailsData!: any;
  dataSource = new MatTableDataSource(this.reportData);
  dateOfExam: any = new Date();
  config = new Constant();
  //end
  isLoading = false;
  isNorecordFound = false;
  pageIndex: any = 0;
  previousSize: any = 0;
  public show: boolean = true;
  public buttonName: any = "Show";
  maxDate: any = Date;
  districtLoading: boolean = false;
  blockLoading: boolean = false;
  districtData!: any;
  blockData!: any;
  fromDate!: any;
  toDate!: any;
  selectedDistrict = "";
  selectedBlock = "";
  showAll = "2";
  public typeOficcer: boolean = false;
  modalDetails: any = {
    userDesignationType: 1,
    activityTypeId: 7,
    activitySubTypeId: 8,
  };
  reportDetails: any;
  userProfile: any = 0;
  modalData!: any;
  params: any;
  actType :any =[5,6];
  actSubType :any =[9,10,11,12];
  scDisrtictSelect:boolean = true; 
  scDisrtictLoading:boolean = false; 
  scBlockSelect:boolean = true; 
  scBlockLoading:boolean = false; 
  scClusterSelect:boolean = true;
  scClusterLoading:boolean = false;
  scSchoolSelect:boolean = true;
  scSchoolLoading:boolean = false; 

  searchDistrictData: any = [];
  searchBlockData: any = [];
  clusterData:any="";
  getSchoolData: any="";
  sessionBlockId: any = this.userProfile.block != 0 ? this.userProfile.block : "";
  searchDistrictId:any = "";
  searchBlockId:any = "";
  
  blockChanged: boolean = false;
  
  constructor(
    private inspectionMisService: InspectionMisService,
    private commonService: CommonserviceService,
    private spinner: NgxSpinnerService,
    private commonserviceService: CommonserviceService,
    private router: ActivatedRoute,
    private alertHelper: AlertHelper
  ) {
    this.params = this.router.snapshot.params["params"];
    this.maxDate = new Date();
  }

  ngOnInit(): void {
    this.reportDetails = this.commonserviceService.decryptObject(
      this.params
    )[0]; // decrypt params


    if(this.actType.includes(this.reportDetails.activityType) || this.actSubType.includes(this.reportDetails.activitySubType)){
      this.displayedColumns = [
        "slNo",
        "inspectionDateTime",        
        "inspectorName",
        "designationName",
        "action",
      ];
    } else{
      this.displayedColumns = [
        "slNo",
        "inspectionDateTime",
        "districtName",
        "blockName",
        "CenterName",
        "inspectorName",
        "designationName",
        "action",
      ]; 
    }
    
    

    this.userProfile = this.commonserviceService.getUserProfile(); // get user profile
    if (this.reportDetails.reportType == 2) {
      this.typeOficcer = true;
    }
    this.getDistrict();
    this.onSearch();
  }

  toggle() {
    this.show = !this.show;
    if (this.show) this.buttonName = "Hide";
    else this.buttonName = "Show";
  }
  getDistrict(){   
    this.scDisrtictSelect = false;
    this.scDisrtictLoading = true;
    this.commonService.getAllDistrict().subscribe((data:any)=>{
      this.districtData = data;
      this.districtData = this.districtData.data; 
      
      if(this.userProfile.district != 0 || this.userProfile.district != ""){
        this.searchDistrictData = this.districtData.filter((dis: any) => {
          return dis.districtId == this.userProfile.district;
        });
        this.searchForm.controls['selectedDistrict'].patchValue(this.userProfile.district);
        this.getBlock(this.userProfile.district);
      }
      else{
        this.searchDistrictData = this.districtData;
        this.scDisrtictSelect = true;
      }

      this.searchBlockId='';      
      this.scDisrtictLoading = false;
    });
    
  }

  getBlock(districtId: any) { 
    this.scBlockSelect = false;
    this.scBlockLoading = true;

    this.searchBlockData = [];
    this.searchForm.controls['selectedBlock'].patchValue('');
    

    if(districtId !== ''){  
      this.commonService.getBlockByDistrictid(districtId).subscribe((res: any) => {      
        this.searchBlockData = res;
        this.searchBlockData = this.searchBlockData.data; 

        if(this.userProfile.block != 0 || this.userProfile.block != ""){
          this.searchBlockData = this.searchBlockData.filter((blo: any) => {
            return blo.blockId == this.userProfile.block;
          });
          this.searchForm.controls['selectedBlock'].patchValue(this.userProfile.block);
          // this.getCluster(this.userProfile.block);
        }
        else{
          this.scBlockSelect = true; 
        }   
        this.scBlockLoading = false;         
      });
    } else{      
      this.scBlockSelect = true; 
      this.scBlockLoading = false;         
    }       
  }

  getInspectionDetails(inspectionEncId: string) {

    //console.log(this.reportDetails,"this.reportDetails");
    

    this.spinner.show();
    const dataObj = {
      inspectionEncId: inspectionEncId,
      reportDetails: this.reportDetails,
    };

    this.inspectionMisService
      .getInspectionDetails(dataObj)
      .subscribe((data: any) => {
        if (data?.success === true) {
          this.modalData = data?.data;
          this.modalDetails.userDesignationType =
            +this.reportDetails.reportType;
          this.modalDetails.activityTypeId = +this.reportDetails.activityType;
          this.modalDetails.activitySubTypeId =
            +this.reportDetails.activitySubType;
        } else {
          this.modalData = null;
          this.alertHelper.viewAlert("info", data?.msg, "");
        }
        this.spinner.hide();

        //console.log(this.modalData);

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
    this.loadData(this.getSearchParams());
  }
  getSearchParams() {
    return {
      previousSize: this.previousSize,
      offset: this.offset.toString(),
      pageSize: this.pageSize.toString(),
      fromDate: this.fromDate,
      toDate: this.toDate,
      district: this.selectedDistrict,
      block: this.selectedBlock,
      showAll: this.showAll,
    };
  }
  onSearch() {
    // reset queryParams
    this.pageIndex = 0;
    this.previousSize = 0;
    this.offset = 0;
    this.previousSize = 0;
    // if (this.validateForm() === true) {
    this.spinner.show();
    this.loadData(this.getSearchParams());
    // }
  }
  loadData(...params: any) {
    const {
      previousSize,
      offset,
      pageSize,
      fromDate,
      toDate,
      district,
      block,
      showAll,
    } = params[0];

    const paramObj = {
      offset: offset,
      limit: pageSize,
      fromDate: fromDate,
      toDate: toDate,
      district: district,
      block: block,
      showAll: showAll,
      userDetails: {'userId': this.userProfile.userId,'officerType': this.userProfile.officerType,'district': this.userProfile.district,'block': this.userProfile.block},
      reportDetails: this.reportDetails,
    };
    this.isLoading = true;

    this.inspectionMisService.inspectionVisitData(paramObj).subscribe({
      next: (res: any) => {
        this.reportData.length = previousSize; // set current size

        res?.success === true && this.reportData.push(...res?.data); // merge with existing data
        this.reportData.length = res?.totalRecord; // update length
        this.dataSource.paginator = this.paginator; // update paginator
        this.dataSource._updateChangeSubscription(); // update table
        this.isLoading = false;
        this.isNorecordFound = this.reportData.length ? false : true;
        this.spinner.hide();
      },
      error: (error: any) => {
        this.isLoading = false;
        this.spinner.hide();
      },
    });
  }
}
