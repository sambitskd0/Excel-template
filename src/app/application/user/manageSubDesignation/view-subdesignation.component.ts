import { Component, Input, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup,Validators,FormArray,FormControl } from "@angular/forms";
import {  Router } from "@angular/router";
import { ManageSubdesignationService } from '../services/manage-subdesignation.service';
import { AlertHelper } from "src/app/core/helpers/alert-helper";
import { NgxSpinnerService } from "ngx-spinner";
import { ProgressBarMode } from "@angular/material/progress-bar";
import { MatSort } from "@angular/material/sort";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableExporterDirective } from "mat-table-exporter";
import { MatTableDataSource } from "@angular/material/table";
import { CommonserviceService } from "src/app/core/services/commonservice.service";
import { environment } from "src/environments/environment";
import { Constant } from "src/app/shared/constants/constant";
import { PrivilegeHelper } from "src/app/core/helpers/privilege-helper";
import {CustomValidators} from 'src/app/shared/validations/custom-validators';
@Component({
  selector: 'app-view-subdesignation',
  templateUrl: './view-subdesignation.component.html',
  styleUrls: ['./view-subdesignation.component.css']
})
export class ViewSubdesignationComponent implements OnInit {
  public fileUrl = environment.filePath;
  public show:boolean = true;
  public buttonName:any = 'Show';
 SubDesignationSearchForm!: FormGroup;
  resData:any;
  descFullText:string = "";
  select_all = false;
  isEmpty: boolean = false;
  isLoading = false;
  userId: any="";
  previousSize: any = 0;
  pageIndex: any = 0;
  isNorecordFound: boolean = false;
  levelId: any = "";
  designationName: any = "";
  subDesignationName: any = "";
  checkAll: boolean = false;
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
  displayedColumns: string[] = []; // define mat table columns

  resultListData: any = [];
  questionDetailsData!: any;
  dataSource = new MatTableDataSource(this.resultListData);
  
  //end
  paramObj: any; 
  serviceType: string = "Search";
  DesignationNameData:any='';
  plPrivilege:string="view"; //For menu privilege
  config = new Constant();
  adminPrivilege: boolean = false;
  constructor(private managesubdesignationservice:ManageSubdesignationService,
    private formBuilder: FormBuilder,
    public commonserviceService: CommonserviceService,
    private privilegeHelper: PrivilegeHelper,   //For menu privilege
    private router:Router,
    public customValidators:CustomValidators,

    private alertHelper: AlertHelper,
    private spinner: NgxSpinnerService) {
      const pageUrl:any = this.router.url;  
    this.plPrivilege = this.privilegeHelper.PrimaryLinkPrivilege(pageUrl);  //For menu privilege    
    this.commonserviceService.verifyLinkPermission(pageUrl, this.config.linkType[2], this.config.privilege[1]);  // For authorization
    const users = this.commonserviceService.getUserProfile();
      this.userId = users?.userId;
     }

  ngOnInit(): void {
    this.spinner.show();
    if(this.plPrivilege=='admin'){
      this.adminPrivilege = true;
      this.displayedColumns = [
        "chkAll",
        "slNo",
        "Level of Users",
        "Designation Name",
        "SubDesignation Name",
        "Description",
        "Publish Status",
        "action",
      ]; 
    } else {
      this.displayedColumns = [
        "chkAll",
        "slNo",
        "Level of Users",
        "Designation Name",
        "SubDesignation Name",
        "Description",
        "Publish Status",
      ]; 
    }
    const users = this.commonserviceService.getUserProfile();
    this.userId = users?.userId;
    this.loadSubDesignation(this.getSearchParams());
    this.initializeForm();
  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  initializeForm(){
    this.SubDesignationSearchForm = this.formBuilder.group({
      userId:[this.userId],
      levelId: [this.levelId],
      designationName: [this.designationName],
      subDesignationName: [this.subDesignationName],
      checkAll: [this.checkAll],
      checkRecordArr: this.formBuilder.array([], [Validators.required]),
    });
  }
  checkUncheckAll() {
    this.resetFormArray();
    if (this.SubDesignationSearchForm.get("checkAll")?.value !== true) {
      const checkRecordArr: FormArray = this.SubDesignationSearchForm.get(
        "checkRecordArr"
      ) as FormArray;
      this.resultListData.forEach((eachdata: any) => {
        checkRecordArr.push(new FormControl(eachdata.intDesignationId));
        eachdata.isChecked = true;
      });
    }
  }
  onCheckboxChange(e: any) {
    const checkRecordArr: FormArray = this.SubDesignationSearchForm.get(
      "checkRecordArr"
    ) as FormArray;
    if (e.target.checked) {
      checkRecordArr.push(new FormControl(e.target.value));
    } else {
      this.SubDesignationSearchForm.get("checkAll")?.setValue(false);
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
  resetFormArray() {
    this.resultListData.forEach((eachdata: any) => {
      eachdata.isChecked = false;
    });
    (this.SubDesignationSearchForm.get("checkRecordArr") as FormArray).clear();
  }
  
  getSearchParams() {
    return {
      previousSize: this.previousSize,
      offset: this.offset.toString(),
      pageSize: this.pageSize.toString(),
      levelId: this.SubDesignationSearchForm?.get("levelId")?.value,
      designationName: this.SubDesignationSearchForm?.get("designationName")?.value,
      subDesignationName: this.SubDesignationSearchForm?.get("subDesignationName")?.value,
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
    this.loadSubDesignation(this.getSearchParams());
  }
  onSearch() {
    // reset queryParams
    this.pageIndex = 0;    
    this.offset = 0;
    this.previousSize = 0;
    this.resultListData.splice(0, this.resultListData.length); // empty current data
    this.dataSource.paginator = this.paginator; // update paginator
    this.loadSubDesignation(this.getSearchParams());
  }

  loadSubDesignation(...params: any)
  {
    this.spinner.show();
    const {
      previousSize,
      offset,
      pageSize,
      levelId,
      designationName,
      subDesignationName
    } = params[0];

    this.paramObj = {
      offset: offset,
      limit: pageSize,
      levelId:levelId,
      designationName:designationName,
      subDesignationName:subDesignationName,
      serviceType: this.serviceType, 
      userId: this.userId
    };
    this.isLoading = true;
    this.managesubdesignationservice.viewSubDesignation(this.paramObj).subscribe({
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
  getDesignation(val:any) {
    this.SubDesignationSearchForm.patchValue({
      designationName: "",
    });
    const levelId=val;
    this.spinner.show();
    let DesignationNameData2 : any = '';
    this.managesubdesignationservice.getDesignationName(levelId).subscribe((res: any) => {
    DesignationNameData2 = res;
    this.DesignationNameData = DesignationNameData2.data;
    this.spinner.hide();
    
    });
  }
  downloadDesignationList()
  {
    this.spinner.show();   
    this.paramObj.serviceType = "Download";

    this.managesubdesignationservice.viewSubDesignation(this.paramObj).subscribe({
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
  printPage() {
    let cloneTable 	= document.getElementById("viewTable")?.innerHTML;
    const pageTitle = document.querySelector(".pageName")?.innerHTML;
    this.commonserviceService.printPage(cloneTable, pageTitle);
  }
  PublishPage(){
    const checkRecordArr: FormArray = this.SubDesignationSearchForm.get(
      "checkRecordArr"
    ) as FormArray;
    if (checkRecordArr.controls.length < 1) {
      this.alertHelper.viewAlertHtml(
        "error",
        "Invalid",
        "Please select any sub designation to make it active/inactive"
      );
      return;
    } 
    if (this.SubDesignationSearchForm.valid == true) {
      this.alertHelper.deleteAlert(
        "Do you want to make the selected sub designation active ?",
        " ",
        "question",
        "Yes, activate it!"
      ).then((result) => {
        if (result.value) {
          this.spinner.show();
          this.managesubdesignationservice
            .publishStatus(this.SubDesignationSearchForm.value)
            .subscribe({
              next: (res: any) => {
                this.spinner.hide();
                this.alertHelper
                  .successAlert(
                    "Activated!",
                    "The selected sub designations are now active",
                    "success"
                  )
                  .then(() => {
                    this.resetFormArray();
                    this.initializeForm();
                    this.loadSubDesignation(this.getSearchParams());
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
    UnPublishPage(){
      const checkRecordArr: FormArray = this.SubDesignationSearchForm.get(
        "checkRecordArr"
      ) as FormArray;
      if (checkRecordArr.controls.length < 1) {
        this.alertHelper.viewAlertHtml(
          "error",
          "Invalid",
          "Please select any sub designation to make it active/inactive"
        );
        return;
      }
      if (this.SubDesignationSearchForm.valid == true) {
        this.alertHelper.deleteAlert(
          "Do you want to make the selected Sub Designation Inactive ?",
          " ",
          "question",
          "Yes, deactivate it!"
        ).then((result) => {
          if (result.value) {
            this.spinner.show();
            this.managesubdesignationservice
              .unPublishStatus(this.SubDesignationSearchForm.value)
              .subscribe({
                next: (res: any) => {
                  this.spinner.hide();
                  this.alertHelper
                    .successAlert(
                      "Deactivated!",
                      "The selected sub designations are now inactive",
                      "success"
                    )
                    .then(() => {
                      this.resetFormArray();
                      this.initializeForm();
                      this.loadSubDesignation(this.getSearchParams());
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
  
  toggle() {
    this.show = !this.show;
    if(this.show)  
      this.buttonName = "Hide";
    else
      this.buttonName = "Show";
  }



}
