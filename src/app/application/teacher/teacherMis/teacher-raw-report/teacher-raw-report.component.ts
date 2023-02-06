import { Component, OnInit, ViewChild, Input, ViewEncapsulation } from "@angular/core";
import { FormGroup, FormBuilder, NgForm } from "@angular/forms";
import { CommonserviceService } from "src/app/core/services/commonservice.service";
import { TeacherMisService } from "../../services/teacher-mis.service";
import { NgxSpinnerService } from "ngx-spinner";
import { ProgressBarMode } from "@angular/material/progress-bar";
import { MatSort } from "@angular/material/sort";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableExporterDirective } from "mat-table-exporter";
import { MatTableDataSource } from "@angular/material/table";
import { AlertHelper } from "src/app/core/helpers/alert-helper";
import { environment } from "src/environments/environment";

@Component({
    selector: 'app-teacher-raw-report',
    templateUrl: './teacher-raw-report.component.html',
    styleUrls: ['./teacher-raw-report.component.css']
})
export class TeacherRawReportComponent implements OnInit {
    public fileUrl1 = environment.filePath;
    userProfile = this.commonService.getUserProfile();
    @ViewChild("searchForm") searchForm!: NgForm;
    @Input() mode!: ProgressBarMode;
    @ViewChild(MatSort) sort!: MatSort;
    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatTableExporterDirective, { static: true })
    exporter!: MatTableExporterDirective;
    scDisrtictSelect: boolean = false;
    scDisrtictLoading: boolean = false;
    scBlockSelect: boolean = false;
    scBlockLoading: boolean = false;
    scClusterSelect: boolean = false;
    scClusterLoading: boolean = false
    scSchoolSelect: boolean = false;
    teacherAppointmentChanged: boolean = false;
    teacherAppointmentTypeChanged: boolean = false;
    scSchoolLoading: boolean = false;
    isNorecordFound: boolean = false;
    districtData: any = [];
    blockData: any = [];
    clusterData: any = [];
    schoolData: any = [];
    teacherAppointment: any = [];
    teacherAppointmentType: any = [];
    scDistrictId: any = "";
    scBlockId: any = "";
    scClusterId: any = "";
    scSchoolId: any = "";
    searchNatureOfAppointmt: any = "";
    appointmtType: any = "";
    paramVal: any

    pageSize = 10;
    offset = 0;
    currentPage = 0;
    totalRows = 0;
    previousSize: any = 0;
    pageIndex: any = 0;

    displayedColumns: string[] = [
        "slNo",
        "TeacherCode",
        "TeacherName",
        "Gender",
        "DOB",
        "MobileNo",
        "AadharNo",
        "District",
        "Block",
        "Cluster",
        "SchoolName",
        "NatureOfAppointment",
        "DOJinService",
        "DOJinCurrentSchool",
        "TeacherTitle",
        "AppointmentType",
        "AppointedSubject",
        "BloodGroup",
        "Email",
        "SocialCategory",
        "CasteRecruitment",
        "Disability",
        "DisabilityPer",
        "ComputerTraining"
    ]; // define mat table columns

    resultListData: any = [];
    dataSource = new MatTableDataSource(this.resultListData);

    isInitAdmin: boolean = false;
    isLoading = false;


    constructor(
        private commonService: CommonserviceService,
        private teacherMisService: TeacherMisService,
        private spinner: NgxSpinnerService,
        private alertHelper: AlertHelper
    ) { }

    ngOnInit(): void {
        this.getDistrict();
        this.getAnnextureDataBySeq();
    }


    getDistrict() {
        this.scDisrtictSelect = true;
        this.scDisrtictLoading = true;
        this.commonService.getAllDistrict().subscribe((data: any) => {
            this.districtData = data;
            this.districtData = this.districtData.data;

            if (this.userProfile.district != 0 || this.userProfile.district != "") {
                this.districtData = this.districtData.filter((dis: any) => {
                    return dis.districtId == this.userProfile.district;
                });
                this.scDistrictId=this.userProfile.district;
                this.getBlock(this.userProfile.district);
            } else {
                this.districtData = this.districtData;
                this.scDisrtictSelect = false;
            }

            this.scBlockId = "";
            this.scDisrtictLoading = false;
        });
    }


    getBlock(districtId: any) {
        this.scBlockSelect = true;
        this.scBlockLoading = true;

        this.blockData = [];
        this.scBlockId = "";
        this.clusterData = [];
        this.scClusterId = "";
        this.schoolData = [];
        this.scSchoolId = "";

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
                        this.scBlockId=this.userProfile.block;
                        this.getCluster(this.userProfile.block);
                    } else {
                        this.scBlockSelect = false;
                    }
                    this.scBlockLoading = false;
                });
        } else {
            this.scBlockSelect = false;
            this.scBlockLoading = false;
        }
    }

    getCluster(blockId: any) {
        this.scClusterSelect = true;
        this.scClusterLoading = true;
        this.clusterData = [];
        this.scClusterId = "";
        this.schoolData = [];
        this.scSchoolId = "";
        if (blockId !== "") {
            this.commonService.getClusterByBlockId(blockId).subscribe((res: any) => {
                this.clusterData = res;
                this.clusterData = this.clusterData.data;

                if (this.userProfile.cluster != 0 || this.userProfile.cluster != "") {
                    this.clusterData = this.clusterData.filter((clu: any) => {
                        return clu.clusterId == this.userProfile.cluster;
                    });
                    this.scClusterId = this.userProfile.cluster
                    this.getSchool(this.userProfile.cluster);
                } else {
                    this.scClusterSelect = false;
                }
                this.scClusterLoading = false;
            });
        } else {
            this.scClusterSelect = false;
            this.scClusterLoading = false;
        }
    }

    getSchool(clusterId: any) {

        this.scSchoolSelect = true;
        this.scSchoolLoading = true;

        this.schoolData = [];
        this.scSchoolId = "";
        if (clusterId !== "") {
            var cluster = {
                clusterId:clusterId
            }
            this.teacherMisService.getschool(cluster).subscribe((res: any) => {
                this.schoolData = res;
                this.schoolData = this.schoolData.data;

                if (this.userProfile.udiseCode != 0 || this.userProfile.udiseCode != "") {
                    this.schoolData = this.schoolData.filter((sch: any) => {

                        return sch.schoolUdiseCode == this.userProfile.udiseCode;
                    });
                    this.scSchoolId = this.schoolData[0]['schoolId'];
                } else {
                    this.scSchoolSelect = false;
                }
                this.scSchoolLoading = false;
            });
        } else {
            this.scSchoolSelect = false;
            this.scSchoolLoading = false;
        }
    }
    getAnnextureDataBySeq() {
        this.teacherAppointmentChanged = true;
        this.teacherAppointmentTypeChanged = true;
        this.spinner.show();
        this.commonService
            .getCommonAnnexture([
                "NATURE_OF_APPOINTMENT", "APPOINTMENT_TYPE","SCHOOL_MANAGEMENT"
            ], true)
            .subscribe({
                next: (res: any) => {
                    this.spinner.hide();
                    this.teacherAppointment = res?.data?.NATURE_OF_APPOINTMENT;
                    this.teacherAppointmentType = res?.data?.APPOINTMENT_TYPE;
                    this.teacherAppointmentChanged = false;
                    this.teacherAppointmentTypeChanged = false;
                },
            });
    }
    onSearch() {

        this.pageIndex = 0;
        this.previousSize = 0;
        this.offset = 0;
        this.resultListData.splice(0, this.resultListData.length); // empty current data
        this.dataSource.paginator = this.paginator; // update paginator
        if (this.scDistrictId === "") {
            this.alertHelper.viewAlert(
                "error",
                "Required",
                "Please select district."
            );
            return;
        }
        this.loadTeacherData();
    }

    loadTeacherData(...params: any) {
        this.spinner.show();
        this.paramVal = {
            previousSize: this.previousSize,
            offset: this.offset.toString(),
            pageSize: this.pageSize.toString(),
            limit: this.pageSize,
            scDistrictId: this.scDistrictId,
            scBlockId: this.scBlockId,
            scClusterId: this.scClusterId,
            scSchoolId: this.scSchoolId,
            searchNatureOfAppointmt:this.searchNatureOfAppointmt,
            appointmtType:this.appointmtType,
            serviceType: "report"
        }
        this.teacherMisService.loadTeacherData(this.paramVal).subscribe({
            next: (res: any) => {
                this.resultListData.length = this.previousSize; // set current size
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

    get getPageSizeOptions(): number[] {
        return this.dataSource?.paginator &&
            this.dataSource?.paginator?.length > 200
            ? [10, 30, 50, 100, this.dataSource.paginator.length]
            : [10, 30, 50, 100, 200];
    }

    onPageChange(event: any) {
        this.spinner.show();
        this.isLoading = true;
        // event: PageEvent
        this.pageSize = event.pageSize; // current page size ex: 10

        this.offset = event.pageIndex * event.pageSize;
        this.previousSize = this.pageSize * event.pageIndex; // set previous size
        this.pageIndex = event.pageIndex;
        this.loadTeacherData();
    }

    printPage() {
        let cloneTable = document.getElementById("viewTable")?.innerHTML;
        const pageTitle = document.querySelector(".pageName")?.innerHTML;
        this.commonService.printPage(cloneTable, pageTitle);
    }
    exportTeacherReport() {
        this.spinner.show();
        this.paramVal = {
            scDistrictId: this.scDistrictId,
            scBlockId: this.scBlockId,
            scClusterId: this.scClusterId,
            scSchoolId: this.scSchoolId,
            searchNatureOfAppointmt:this.searchNatureOfAppointmt,
            appointmtType:this.appointmtType,
            serviceType: "excel"
        };
        
        this.teacherMisService.exportTeacherReport(this.paramVal).subscribe({
            next: (res: any) => {
                let filepath = this.fileUrl1 + '/' + res.data.replace('.', '~');
                window.open(filepath);
                this.spinner.hide();
            },
            error: (error: any) => {
                this.isLoading = false;
                this.spinner.hide();
            },
        });
    }
   
}
