import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonserviceService } from "src/app/core/services/commonservice.service";
import { NgxSpinnerService } from "ngx-spinner";
import { TeacherTransferService } from '../../../services/teacher-transfer.service';
import { NgForm, FormGroup, FormBuilder, FormArray, FormControl, Validators } from '@angular/forms';
import { AlertHelper } from 'src/app/core/helpers/alert-helper';
import { CustomValidators } from 'src/app/shared/validations/custom-validators';
import { ProgressBarMode } from "@angular/material/progress-bar";
import { MatSort } from "@angular/material/sort";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableExporterDirective } from "mat-table-exporter";
import { MatTableDataSource } from "@angular/material/table";
import { SelectionModel } from "@angular/cdk/collections";

@Component({
  selector: 'app-add-transfer-request-school',
  templateUrl: './add-transfer-request-school.component.html',
  styleUrls: ['./add-transfer-request-school.component.css']
})
export class AddTransferRequestSchoolComponent implements OnInit {
  filterData: any = {
    teacherList: [],
  };
  userInput: any = {
    districtId: "",
    blockId: "",
    promotionListForm: FormGroup,
    checkAll: false,
  };
  viewTableForm!: FormGroup;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  scDisrtictSelect: boolean = true;
  scDisrtictLoading: boolean = false;
  scBlockSelect: boolean = true;
  scBlockLoading: boolean = false;
  scClusterSelect: boolean = true;
  scClusterLoading: boolean = false;
  scSchoolSelect: boolean = true;
  scSchoolLoading: boolean = false;
  districtData: any = "";
  searchDistrictData: any = [];
  searchBlockData: any = [];
  clusterData: any = "";
  getSchoolData: any = "";
  public userProfile = this.commonService.getUserProfile();
  teacherAppointmentChanged: boolean = false;
  teacherAppointment: any = "";
  teacherTitles: any = "";
  teacherTitleChanged: boolean = false;
  pageSize = 10;
  offset = 0;
  currentPage = 0;
  totalRows = 0;
  pageSizeOptions: number[] = [10, 25, 100];
  previousSize: any = 0;
  pageIndex: any = 0;
  transferRequestData: any = [];
  dataSource = new MatTableDataSource(this.transferRequestData);
  paramObj: any;
  serviceType: string = "Search";
  isLoading = false;
  searchTeacherTitle:any  = "";
  schoolId: any = "";
  searchNatureOfAppointmt:any  = "";
  searchClusterId:any   = "";
  searchBlockId:any  = "";
  searchSchoolId:any    = "";
  descFullText:string   = "";
  submitted = false;
  addRemark: any = "";
  orgData: any = [];

  displayedColumns = [
    "chkAll", 
    "slNo",
    "teacherName",
    "designation", 
    "dateOfJoining",
    "addRemark"
  ];  
  checkAll: boolean = false;
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
  isNorecordFound: boolean = false;
  isInitAdmin: boolean = false;
  constructor(private commonService: CommonserviceService,private spinner: NgxSpinnerService,private transferService: TeacherTransferService,private alertHelper: AlertHelper,private formBuilder: FormBuilder,public customValidators: CustomValidators) { }
  ngOnInit(): void {
    // console.log(this.userProfile);    
    this.getDistrict();
    this.getAnnextureDataBySeq();
    this.initializeForm();
    this.permissionHandler();
    this.isInitAdmin = true;
  }
  permissionHandler() {
      this.matTable.displayedColumns = [
        "select",
        "slNo",
        "teacherName",
        "teacherTitle",
        "doj",
        "remark"
      ];
  }

  onSubmit() {
    // console.log(this.matTable.selection.selected); return
    
    if (this.validationHandler()) {
      this.alertHelper.submitAlert().then((result: any) => {
        if (result.value) {
          this.spinner.show();
          this.submitData({
            uerInput: this.userInput,
            selectedTeachers: this.matTable.selection.selected,
            userProfile: this.userProfile,
          });
        }
      });
    }
  }
  validationHandler() {
    if (!this.matTable.selection?.selected?.length) {
      this.alertHelper.viewAlert(
        "error",
        "",
        "Please select atleast one teacher."
      );
      return false;
    }
    return true;
  }
  submitData(params: any) {
    this.transferService
      .TransferRequestByHeadMaster(params)
      .subscribe({
        next: (response: any) => {
          if (response.success === true) {
            this.alertHelper.successAlert("Saved!", response?.msg, "success").then(() => {
              window.location.reload();
            });
          } else {
            this.alertHelper.viewAlert("error", "Invalid", response?.msg);
          }

          this.spinner.hide();
        },
        error: (error: any) => {
          this.matTable.isLoading = false;
          this.spinner.hide();
        },
      });
  }
  teacherReqInfo(): FormArray {
    return this.viewTableForm.get("checkRecordArr") as FormArray;
  }
  // getSearchParams() {
  //   return {
  //     previousSize: this.previousSize,
  //     offset: this.offset.toString(),
  //     pageSize: this.pageSize.toString(), 
  //     searchTeacherTitle: this.searchTeacherTitle,
  //     searchNatureOfAppointmt: this.searchNatureOfAppointmt,
  //     searchSchoolId: this.userProfile.school,      
  //   };
  // }

  getSearchParams() {
    return {
      searchTeacherTitle: this.searchTeacherTitle,
      searchNatureOfAppointmt: this.searchNatureOfAppointmt,
      searchSchoolId: this.userProfile.school,
      searchDistrictId: this.userProfile.district,
      searchBlockId: this.userProfile.block,
      searchClusterId: this.userProfile.cluster,
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
  onCheckboxChange(e:any) {
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
  resetFormArray(){
    this.transferRequestData.forEach((eachdata: any) => {
      eachdata.isChecked = false;
    });
    (this.viewTableForm.get('checkRecordArr') as FormArray).clear();
  }
  checkUncheckAll(){
    this.resetFormArray();
    if(this.viewTableForm.get("checkAll")?.value !== true){
      const checkRecordArr: FormArray = this.viewTableForm.get('checkRecordArr') as FormArray;
      this.transferRequestData.forEach((eachdata: any) => {
        // if(eachdata.transferStatus == 1){
          checkRecordArr.push(new FormControl(eachdata.encId));
          eachdata.isChecked = true;
        // }
      });
    }
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
    this.transferService.viewTeacherByHeadMaster(params).subscribe({
      next: (response: any) => {
        this.filterData.teacherList.length = this.matTable.previousSize; // set current size
        response?.success === true &&
        this.filterData.teacherList.push(...response?.data); // merge with existing data
        this.filterData.teacherList.length = response?.totalRecord; // update length
        //console.log(   this.matTable.dataSource,"teacher list length")
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
      // console.log(this.searchDistrictData,"===========");
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
            // this.teacherSearchForm.controls["searchBlockId"]?.patchValue(
            //   this.userProfile.block
            // );
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
    // console.log(this.getSchoolData);
  }
  initializeForm() {
    this.viewTableForm = this.formBuilder.group({
      checkAll:[this.checkAll],
      checkRecordArr: this.formBuilder.array([], [Validators.required]), 
      addRemark:[this.addRemark]
    });
  }
  resetRemark(){
    this.viewTableForm.get("addRemark")?.setValue("");
  }
  
  isAllSelected() {
    const numSelected = this.matTable.selection.selected.length;   
    const numRows = this.matTable.dataSource._renderData._value.length;   
    return numSelected === numRows;
  }
  masterToggle() {
    this.isAllSelected()
      ? this.matTable.selection.clear()
      : this.matTable.dataSource.data.forEach((row: any) =>
          this.matTable.selection.select(row)
        );

      console.log(this.matTable.selection);
      console.log(this.matTable.dataSource.data.length);
  }  
  get getPageSizeOptions(): number[] {
    return this.matTable.dataSource?.paginator &&
      this.matTable.dataSource?.paginator?.length > 200
      ? [10, 30, 50, 100, this.matTable.dataSource.paginator.length]
      : [10, 30, 50, 100, 200];
  }
  onChange(teacherId:number,remark:string){
      this.matTable.selection?.selected?.map((item:any)=>{
        if(item?.tId === teacherId) {
          item.remark = remark;
        }
      })
  }
}
