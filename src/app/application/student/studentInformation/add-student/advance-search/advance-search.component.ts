import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { NgxSpinnerService } from "ngx-spinner";
import { SchoolService } from "src/app/application/school/services/school.service";
import { CommonserviceService } from "src/app/core/services/commonservice.service";
import { StudentInformationService } from "../../../services/student-information.service";
import { AlertHelper } from "src/app/core/helpers/alert-helper";
import { Constant } from "src/app/shared/constants/constant";
import { CustomValidators } from "src/app/shared/validations/custom-validators";
import { CommonFunctionHelper } from "src/app/core/helpers/common-function-helper";

@Component({
  selector: "app-advance-search",
  templateUrl: "./advance-search.component.html",
  styleUrls: ["./advance-search.component.css"],
})
export class AdvanceSearchComponent implements OnInit {
  @ViewChild("openModal") openModal!: ElementRef;

  public modalStatus: boolean = false;
  minDOB = new Date(new Date().setFullYear(new Date().getFullYear() - 5));
  searchedStudentDetails!: any;
  demographyData: any = {
    districtData: [],
    blockData: [],
    clusterData: [],
    schoolData: [],
    disrtictChanged: false,
    blockChanged: false,
    clusterChanged: false,
    schoolChanged: false,
  };

  userInput: any = {
    studentCode: "",
    studentAadhaar: "",
    tcCode: "",
    districtId: "",
    blockId: "",
    clusterId: "",
    schoolId: "",
    studentName: "",
    fatherName: "",
    motherName: "",
    dob: "",
    gender: "",
  };
  otherData: any = {
    genderData: [],
    genderChanged: false,
  };

  udiseCode : any = '';
  config = new Constant();
  academicYear: any = this.config.getAcademicCurrentYear();

  // end
  constructor(
    private spinner: NgxSpinnerService,
    private studentService: StudentInformationService,
    private commonService: CommonserviceService,
    private schoolService: SchoolService,
    private alertHelper: AlertHelper,
    public customValidators: CustomValidators,
    private commonFunctionHelper: CommonFunctionHelper, 
  ) {}

  ngOnInit(): void {
    this.udiseCode = this.commonService.getUserProfile()?.udiseCode;
  }

  getDistrict() {
    this.resetSelection(1);
    this.demographyData.disrtictChanged = true;
    this.commonService.getAllDistrict().subscribe((res: any) => {
      this.demographyData.districtData = res.data;
      this.demographyData.disrtictChanged = false;
    });
  }

  getBlock(districtId: number) {
    this.resetSelection(2);
    this.demographyData.blockChanged = true;
    if (districtId) {
      this.commonService
        .getBlockByDistrictid(districtId)
        .subscribe((res: any) => {
          this.demographyData.blockData = res.data;
          this.demographyData.blockChanged = false;
        });
    } else {
      this.demographyData.blockData = [];
      this.demographyData.clusterData = [];
      this.demographyData.schoolData = [];
      this.demographyData.blockChanged = false;
    }
  }
  getCluster(blockId: number) {
    this.resetSelection(3);
    this.demographyData.clusterChanged = true;
    if (blockId) {
      this.commonService
        .getClusterByBlockId(blockId)
        .subscribe((res: any = []) => {
          this.demographyData.clusterData = res.data;
          this.demographyData.clusterChanged = false;
        });
    } else {
      this.demographyData.clusterData = [];
      this.demographyData.schoolData = [];

      this.demographyData.clusterChanged = false;
    }
  }

  getSchool(clusterId: any) {
    this.demographyData.schoolChanged = true;
    if (clusterId) {
      this.schoolService
        .getSchoolList({ clusterId })
        .subscribe((res: any = []) => {
          this.demographyData.schoolData = res.data;
          this.demographyData.schoolChanged = false;
        });
    } else {
      this.demographyData.schoolData = [];
      this.demographyData.schoolChanged = false;
    }
  }
  toggle() {
    this.modalStatus = !this.modalStatus;
    if (this.modalStatus) {
      this.getDistrict();
      this.loadAnnexturesData();
      this.demographyData.disrtictChanged = false;
      this.demographyData.blockChanged = false;
      this.demographyData.clusterChanged = false;
      this.demographyData.schoolChanged = false;
    } else {
      this.resetSelection(1);
    }
  }

  resetSelection(type: number) {
    switch (type) {
      case 1:
        this.demographyData.districtData = [];
        this.demographyData.blockData = [];
        this.demographyData.clusterData = [];
        this.demographyData.schoolData = [];
        this.userInput.districtId = "";
        this.userInput.blockId = "";
        this.userInput.clusterId = "";
        this.userInput.schoolId = "";
        this.userInput.studentName = "";
        this.userInput.fatherName = "";
        this.userInput.motherName = "";
        this.userInput.dob = "";
        this.userInput.gender = "";
        break;
      case 2:
        this.demographyData.blockData = [];
        this.demographyData.clusterData = [];
        this.demographyData.schoolData = [];
        this.userInput.blockId = "";
        this.userInput.clusterId = "";
        this.userInput.schoolId = "";
        break;
      case 3:
        this.demographyData.clusterData = [];
        this.demographyData.schoolData = [];
        this.userInput.clusterId = "";
        this.userInput.schoolId = "";
        break;
      case 4:
        this.demographyData.schoolData = [];
        this.userInput.schoolId = "";
        break;
      default:
        break;
    }
  }

  /**
   * Created By   : Sambit Kumar Dalai
   * Created On   : 01-09-2022
   * Description  : Student Advance search functionality
   **/
  onSearch(searchType: number) {
    this.userInput.academicYear = this.academicYear;
    // if search by code/aadhaar
    if (searchType === 1) {
      if (
        +this.userInput.studentCode > 0 ||
        +this.userInput.studentAadhaar > 0 ||
        +this.userInput.tcCode > 0
      ) {
        this.searchStudent({ searchType, ...this.userInput });
      } else {
        this.alertHelper.viewAlert(
          "info",
          "",
          "Please search student by code/aadhaar/TC Code."
        );
      }
    } else if (searchType === 2) {
      
        
      // if search by student,father,mother name and student dob
      if (
        this.userInput.studentName?.length &&
        this.userInput.fatherName?.length &&
        this.userInput.motherName?.length &&
        this.userInput.dob != ""
      ) {
      let dobStr =  this.commonFunctionHelper.formatDateHelper(this.userInput.dob);
          this.userInput.dob = dobStr;
        this.searchStudent({ searchType, ...this.userInput });
      } else {
        this.alertHelper.viewAlert(
          "info",
          "",
          "Please search student by student name,father name,mother name,student DOB."
        );
      }
    }
  }

  searchStudent(params: Object) {
    this.spinner.show();
    this.searchedStudentDetails = undefined;
    this.studentService.searchStudent(params).subscribe((response: any) => {
      if (response?.success) {
        this.openModal.nativeElement.click();
        this.searchedStudentDetails = response?.data;
      } else {
        this.searchedStudentDetails = undefined;
        this.alertHelper.viewAlert("warning", "", response?.msg);
      }
      this.spinner.hide();
    });
  }

  loadAnnexturesData() {
    this.otherData.genderChanged = true;
    const anxTypes = ["GENDER"];
    this.commonService.getCommonAnnexture(anxTypes).subscribe({
      next: (res: any) => {
        this.otherData.genderChanged = false;
        this.otherData.genderData = res?.data?.GENDER;
      },
    });
  }
}
