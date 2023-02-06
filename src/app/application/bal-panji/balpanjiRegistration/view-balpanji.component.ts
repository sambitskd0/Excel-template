
import { Component, Input, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { ProgressBarMode } from '@angular/material/progress-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { MatTableExporterDirective } from 'mat-table-exporter';
import { CommonserviceService } from "src/app/core/services/commonservice.service";
import { BalpanjiService } from "../services/balpanji.service";
import { NgxSpinnerService } from "ngx-spinner";
import { AlertHelper } from 'src/app/core/helpers/alert-helper';
import { ngxCsv } from "ngx-csv/ngx-csv";
import { Constant } from 'src/app/shared/constants/constant';
import { PrivilegeHelper } from 'src/app/core/helpers/privilege-helper';
import { CommonFunctionHelper } from 'src/app/core/helpers/common-function-helper';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'app-view-balpanji',
    templateUrl: './view-balpanji.component.html',
    styleUrls: ['./view-balpanji.component.css']
})
export class ViewBalpanjiComponent implements OnInit {
    // @ViewChild("searchForm") searchForm!: NgForm;
    public fileUrl = environment.filePath;
    @ViewChild(MatSort) sort!: MatSort;
    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatTableExporterDirective, { static: true })
    exporter!: MatTableExporterDirective;
    @Input() mode!: ProgressBarMode;
    getSchoolData: any;
    searchForm!: FormGroup;
    pageIndex: any = 0;
    previousSize: any = 0;
    pageSize = 10;
    offset = 0;
    currentPage = 0;
    totalRows = 0;
    isNorecordFound: boolean = false;
    pageSizeOptions: number[] = [10, 25, 100];
    displayedColumns: string[] = []; // define mat table columns
    balpanjiListData: any = [];
    dataSource = new MatTableDataSource(this.balpanjiListData);
    scDisrtictChanged: boolean = false;
    districtData: any;
    scDistrictId: any = "";
    diseCode: any = "";
    scBlockId: any = "";
    scPanId: any = "";
    scVillageId: any = "";
    thanaNo: any = "";
    schoolId: any = "";
    fromSurveyDate: any = "";
    toSurveyDate: any = "";
    scBlockChanged: boolean = false;
    blockData: any;
    isInitAdmin: boolean = false;
    scVillageChanged: boolean = false;
    scPanChanged: boolean = false;
    panData: any;
    villageData: any;

    csvData: any;

    emptyCheck: boolean = false;
    dtInstance: any = "";
   public userProfile = this.commonService.getUserProfile();

    sessionDistrictId: any =
        this.userProfile.district != 0 ? this.userProfile.district : "";
    sessionBlockId: any =
        this.userProfile.block != 0 ? this.userProfile.block : "";
    sessionUdiseCode: any =
        this.userProfile.udiseCode != 0 ? this.userProfile.udiseCode : "";
    householdWard: any;
    studentName: any;
    mobileNumber: any;
    motherName: any;
    fatherName: any;
    guardianName: any;
    bussCode: any;
    codeOfReligion: any;
    studentDob: any;
    caste: any;
    socialCategory: any;
    isChildEnrollment: any;
    enrollmentBlock: any;
    nominatedSchool: any;
    classEnrolled: any;
    notEnrolledReason: any;
    studyLeaveReason: any;
    classLeft: any;
    schoolLeft: any;
    userId: any;
    doingClassLeave: any;
    ageOnApril: any;
    disablity: any;
    isLoading: boolean = false;
    plPrivilege: string = "view"; //For menu privilege
    config = new Constant();
    adminPrivilege: boolean = false;
    public show: boolean = true;
    public buttonName: any = 'Show';
    paramObj: any;
    serviceType: string = "Search";

    scDisrtictSelect: boolean       = false;
    scDisrtictLoading: boolean      = false;
    scBlockSelect: boolean          = true;
    scBlockLoading: boolean         = false;
    searchDistrictData: any         = [];
    searchBlockData: any            = [];
    // session Data
    udiseCode: any                  = "";
    readOnly:boolean                = true;

   
    constructor(
        private commonService: CommonserviceService,
        private formBuilder: FormBuilder,
        private privilegeHelper: PrivilegeHelper,   //For menu privilege
        private router: Router,
        private BalpanjiService: BalpanjiService,
        private spinner: NgxSpinnerService,
        private el: ElementRef,
        private alertHelper: AlertHelper,
        private commonFunctionHelper: CommonFunctionHelper
    ) {
        const pageUrl: any = this.router.url;
        this.plPrivilege = this.privilegeHelper.PrimaryLinkPrivilege(pageUrl);  //For menu privilege    
        this.commonService.verifyLinkPermission(pageUrl, this.config.linkType[2], this.config.privilege[1]);  // For authorization
        const users = this.commonService.getUserProfile();
        this.userId = users?.userId;
        this.schoolId = users?.school;
    }

    ngOnInit(): void {
        const userProfile = this.commonService.getUserProfile();

        this.diseCode = userProfile?.udiseCode;
        if(this.diseCode==0){
            this.diseCode="";
            this.readOnly=false;
        }else{
            this.readOnly=true;
        }
        
        if (this.plPrivilege == 'admin') {
            this.adminPrivilege = true;
            this.displayedColumns = [
                "slNo",
                "studentName",
                "mobileNo",
                "motherName",
                "fatherName",
                "ViewDetails",
                "action"
            ];
        } else {
            this.displayedColumns = [
                "slNo",
                "studentName",
                "mobileNo",
                "motherName",
                "fatherName",
                "ViewDetails",
              
            ];
        }
        this.isInitAdmin = true;
        $("#searchPanel").hide();
        $(".bi-caret-up-fill").hide();
        this.getDistrict();
        // if (this.sessionUdiseCode != '') {
        //     this.diseCode = this.sessionUdiseCode;
        // }
        this.initializeForm();
    }
    initializeForm() {
        this.searchForm = this.formBuilder.group({
            scDistrictId: [this.scDistrictId, []],
            scBlockId: [this.scBlockId, []],
            scPanId: [this.scPanId, []],
            scVillageId: [this.scVillageId, []],
            schoolId: [this.schoolId, []],
            thanaNo: [this.thanaNo, []],
            diseCode: [this.diseCode, []],
            fromSurveyDate: [this.fromSurveyDate, []],
            toSurveyDate: [this.toSurveyDate, []],
        });
    }


    ngAfterViewInit() {
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
    }
    /* getDistrict() {
        this.scDisrtictChanged = true;
        this.commonService.getAllDistrict().subscribe((res: []) => {
            this.districtData = res;
            this.districtData = this.districtData.data;
            if (this.sessionDistrictId != '') {
                this.scDistrictId = this.sessionDistrictId
                this.getBlock(this.sessionDistrictId);
            }

            this.scDisrtictChanged = false;
        });

    } */

    /* getBlock(id: any) {
        this.scBlockChanged = true;
        const districtId = id;
        this.blockData = [];
        this.panData = [];
        this.villageData = [];
        if (districtId !== "") {
            this.commonService
                .getBlockByDistrictid(districtId)
                .subscribe((res: any) => {
                    let data: any = res;
                    for (let key of Object.keys(data["data"])) {
                        this.blockData.push(data["data"][key]);
                    }
                    if (this.sessionBlockId != '') {
                        // this.scBlockId = this.sessionBlockId;
                        this.getPanchayat(this.sessionDistrictId, this.sessionBlockId)
                    }

                    this.scBlockChanged = false;
                });
        } else {
            this.scBlockChanged = false;
        }
    } */

    // getDistrict() {
    //     this.scDisrtictSelect = false;
    //     this.scDisrtictLoading = true;
    //     this.commonService.getAllDistrict().subscribe((data: any) => {
    //       this.districtData = data;
    //       this.districtData = this.districtData.data;
    
    //       if (this.userProfile.district != 0 || this.userProfile.district != "") {
    //         this.searchDistrictData = this.districtData.filter((dis: any) => {
    //           return dis.districtId == this.userProfile.district;
    //         });
    //         this.searchForm.controls["scDistrictId"]?.patchValue(
    //           this.userProfile.district
    //         );
    //         this.getBlock(this.userProfile.district);
    //       } else {
    //         this.scDistrictId = this.districtData;
    //         this.scDisrtictSelect = true;
    //       }
    
    //       this.scBlockId = "";
    //       this.scDisrtictLoading = false;
    //     });
    //   }
      getDistrict(){
        this.scDisrtictSelect = false;
        this.commonService.getAllDistrict().subscribe((res:[])=>{
          this.districtData = res;
          this.districtData = this.districtData.data; 
          if(this.userProfile.district != 0 || this.userProfile.district != ""){
            this.scDisrtictSelect = false;
            this.districtData = this.districtData.filter((dis: any) => {    
              return dis.districtId == this.userProfile.district;
            });
            this.searchForm.controls['scDistrictId']?.patchValue(this.userProfile.district);
            this.getBlock(this.userProfile.district);
          }else{
              this.scDisrtictSelect = true;
          }    
         });
      }
      getBlock(districtId: any) {
        this.scBlockSelect = false;
        this.scBlockLoading = true;
    
        this.searchBlockData = [];
        this.searchForm.controls["scBlockId"]?.patchValue("");
    
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
                this.searchForm.controls["scBlockId"]?.patchValue(
                  this.userProfile.block
                );
                this.getPanchayat(districtId,this.userProfile.block);
                this.getVillage(districtId,this.userProfile.block);
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


    getPanchayat(distId: any, blockId: any) {
        // this.scPanChanged = true;
        // this.panData = [];
        // this.villageData = [];
        // const districtData = distId;
        // const blockData = blockId;

        // if (blockData !== "") {
        //     this.BalpanjiService.getPanchayat(districtData, blockData).subscribe(
        //         (res: any) => {
        //             let data: any = res;
        //             for (let key of Object.keys(data["data"])) {
        //                 this.panData.push(data["data"][key]);
        //             }

        //             this.scPanChanged = false;
        //         }
        //     );
        // } else {
        //     this.scPanChanged = false;
        // }
        this.scPanChanged = true;
        this.panData = [];
        this.villageData = [];
        const districtData = distId;
        const blockData = blockId;
        if (blockId !== '') {
            this.commonService.getPanchayatByBlockId(blockId).subscribe((res) => {
                let data: any = res;
                for (let key of Object.keys(data['data'])) {
                    this.panData.push(data['data'][key]);
                }
                this.scPanChanged = false;
            });
        } else {
            this.scPanChanged = false;
        }


    }

    getVillage(distId: any, blockId: any) {


        this.scVillageChanged = true;
        this.villageData = [];
        const districtData = distId;
        const blockData = blockId;
        // const panData = panId;
        if (blockId != "") {
            this.BalpanjiService.getVillage(districtData, blockData).subscribe(
                (res: any) => {
                    let data: any = res;
                    for (let key of Object.keys(data["data"])) {
                        this.villageData.push(data["data"][key]);
                    }

                    this.scVillageChanged = false;
                }
            );
        }
        else {
            this.scVillageChanged = false;
        }

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

    getSearchParams() {
        return {
            previousSize: this.previousSize,
            offset: this.offset.toString(),
            pageSize: this.pageSize.toString(),
            userType: this.userProfile.userType,
            userId: this.userProfile.userId,
            scDistrictId: this.searchForm?.get("scDistrictId")?.value,
            scBlockId: this.searchForm?.get("scBlockId")?.value,
            scPanId: this.searchForm?.get("scPanId")?.value,
            scVillageId: this.searchForm?.get("scVillageId")?.value,
            thanaNo: this.searchForm?.get("thanaNo")?.value,
            schoolId: this.searchForm?.get("schoolId")?.value,
            diseCode: this.searchForm?.get("diseCode")?.value,
            fromSurveyDate: (this.searchForm?.get("fromSurveyDate")?.value) ? this.commonFunctionHelper.formatDateHelper(this.searchForm?.get("fromSurveyDate")?.value) : this.searchForm?.get("fromSurveyDate")?.value,
            toSurveyDate: (this.searchForm?.get("toSurveyDate")?.value) ? this.commonFunctionHelper.formatDateHelper(this.searchForm?.get("toSurveyDate")?.value) : this.searchForm?.get("toSurveyDate")?.value,

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
        this.loadBalpanjiData(this.getSearchParams());
    }
    onSearch() {
        this.pageIndex = 0;
        this.previousSize = 0;
        this.offset = 0;
        this.previousSize = 0;
        this.balpanjiListData.splice(0, this.balpanjiListData.length); // empty current data
        // this.dataSource.paginator = this.paginator; // update paginator
        this.loadBalpanjiData(this.getSearchParams());
        this.isInitAdmin = false;
    }


    getModalBalpanji(e: any) {
        this.spinner.show();
        this.BalpanjiService.getModalBalpanji(e).subscribe(
            (res: any) => {
                this.householdWard = res.data.balPanjiData.houseNoInWard;
                this.studentName = res.data.balPanjiData.studentName;
                this.mobileNumber = res.data.balPanjiData.mobileNumber;
                this.motherName = res.data.balPanjiData.motherName;
                this.fatherName = res.data.balPanjiData.fatherName;
                this.guardianName = res.data.balPanjiData.guardianName;
                this.bussCode = res.data.balPanjiData.businessCodeGuardian;
                this.studentDob = res.data.balPanjiData.dobOfStudent;
                this.ageOnApril = res.data.balPanjiData.ageOnApril;
                this.codeOfReligion = res.data.religion[0];
                // this.caste = res.data.caste[0];
                this.socialCategory = res.data.socialCategory[0];
                this.isChildEnrollment = res.data.isChildEnrollment;
                this.enrollmentBlock = res.data.enrolledBlock[0];
                this.nominatedSchool = res.data.nominatedSchool[0];
                this.classEnrolled = res.data.classEnrolled[0];
                this.notEnrolledReason = res.data.balPanjiData.notEnrolledReason;
                this.studyLeaveReason = res.data.balPanjiData.studyLeaveReason;
                this.classLeft = res.data.classLeft[0];
                this.schoolLeft = res.data.schoolLeft[0];
                this.disablity = res.data.disablity[0];
               

                this.doingClassLeave = res.data.balPanjiData.doingClassLeave;
                this.spinner.hide();
            });

    }

    loadBalpanjiData(...params: any) {
        this.spinner.show();
        const {
            previousSize,
            offset,
            pageSize,
            scDistrictId,
            scBlockId,
            scPanId,
            scVillageId,
            thanaNo,
            schoolId,
            diseCode,
            fromSurveyDate,
            toSurveyDate,
        } = params[0];

        this.paramObj = {
            offset: offset,
            limit: pageSize,
            scDistrictId: scDistrictId,
            scBlockId: scBlockId,
            scPanId: scPanId,
            scVillageId: scVillageId,
            thanaNo: thanaNo,
            schoolId: schoolId,
            diseCode: diseCode,
            fromSurveyDate: fromSurveyDate,
            toSurveyDate: toSurveyDate,
            serviceType: this.serviceType,
            userId: this.userId
            // offset: param.offset,
            // pageSize: param.pageSize,

            // scDistrictId: param.scDistrictId,
            // scBlockId: param.scBlockId,
            // scPanId: param.scPanId,
            //  scVillageId: param.scVillageId,
            // thanaNo: param.thanaNo,
            // schoolId: param.schoolId,
            // diseCode: param.diseCode,
            // fromSurveyDate: param.fromSurveyDate,
            // toSurveyDate: param.toSurveyDate
        }
        this.isLoading = true;

        this.BalpanjiService.viewBalpanjiApplication(this.paramObj).subscribe({
            next: (res: any) => {
                this.balpanjiListData.length = previousSize; // set current size
                this.balpanjiListData.push(...res?.data); // merge with existing data
                this.balpanjiListData.length = res?.totalRecord; // update length
                this.dataSource.paginator = this.paginator; // update paginator
                this.dataSource._updateChangeSubscription(); // update table
                this.isLoading = false;
                this.isNorecordFound = this.balpanjiListData.length ? false : true;
                this.spinner.hide();
            },
            error: (error: any) => {
                this.isLoading = false;
                this.spinner.hide();
            },

        });

    }
  


    printMe() {
        let cloneTable = document.getElementById("viewTable")?.innerHTML;
        const pageTitle = document.querySelector(".pageName")?.innerHTML;
        this.commonService.printPage(cloneTable, pageTitle);
    }

    delete(e: any) {
        this.alertHelper.deleteAlert(
            "Do you want to delete the selected record ?",
            "",
            "question",
            "Yes, delete it!"
        ).then((result) => {
            this.spinner.show();
            if (result.value) {
                this.spinner.show();
                this.isLoading = true;
                this.BalpanjiService.deleteBalpanjiApp(e)
                    .subscribe({
                        next: (res: any) => {
                            if (res?.success === true) {
                                this.alertHelper.successAlert(
                                    "Deleted!",
                                    "Balpanji record deleted successfully.",
                                    "success"
                                );
                                this.loadBalpanjiData(this.getSearchParams());
                            } else {
                                this.alertHelper.viewAlert("info", res?.msg, "");
                            }
                            this.isLoading = false;
                            this.spinner.hide();
                        },
                        error: (error: any) => {
                            this.isLoading = false;
                            this.spinner.hide();
                        },
                    });
            }
            this.spinner.hide();
        })

    }


    excel() {
        //     this.spinner.show();
        //     this.csvData = this.getSearchParams();
        //     const paramObj = {
        //         diseCode: this.csvData.diseCode,
        //         fromSurveyDate: this.csvData.fromSurveyDate,
        //         offset: this.csvData.offset,
        //         pageSize: this.csvData.pageSize,
        //         previousSize: this.csvData.previousSize,
        //         scBlockId: this.csvData.scBlockId,
        //         scClusterId: this.csvData.scClusterId,
        //         scDistrictId: this.csvData.scDistrictId,
        //         schoolId: this.csvData.schoolId,
        //         toSurveyDate: this.csvData.toSurveyDate
        //     }

        //     this.BalpanjiService.downloadBalpanjiServiceCsv(paramObj).subscribe((res: any) => {
        //         const data = res["data"];
        //         var options = {
        //             fieldSeparator: ",",
        //             quoteStrings: '"',
        //             decimalseparator: ".",
        //             showLabels: true,
        //             useBom: true,
        //             headers: [
        //                 "SLN#",
        //                 "Applicant No.",
        //                 "House Hold No. in Ward",
        //                 "Name of Boys/Girls",
        //                 "Mobile Number",
        //                 "Mother Name",
        //                 "Father Name"
        //             ],
        //         };

        //         new ngxCsv(data, "balPanjiReport", options);
        //         this.spinner.hide();
        //     });
        // }
        this.spinner.show();
        this.paramObj.serviceType = "Download";
        this.BalpanjiService.viewBalpanjiApplication(this.paramObj).subscribe({
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
}
