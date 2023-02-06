import { Component, OnInit, ViewChild } from "@angular/core";
import { CommonserviceService } from "src/app/core/services/commonservice.service";
import { SchoolDashboardMisService } from "../services/school-dashboard-mis.service";
import { TeacherDashboardMisService } from "../services/teacher-dashboard-mis.service";
import { StudentDashboardService } from "../services/student-dashboard.service";
import { NgxSpinnerService } from "ngx-spinner";
import { TeacherNatureAppointmentComponent } from "./highchart/teacher-nature-appointment/teacher-nature-appointment.component";
@Component({
  selector: "app-dashboard-details",
  templateUrl: "./dashboard-details.component.html",
  styleUrls: ["./dashboard-details.component.css"],
})
export class DashboardDetailsComponent implements OnInit {
  constructor(
    private commonserviceService: CommonserviceService,
    private schoolDashboardMisService: SchoolDashboardMisService,
    private teacherDashboardMisService: TeacherDashboardMisService,
    private studentDashboardService: StudentDashboardService,
    private spinner: NgxSpinnerService
  ) {
    this.commonserviceService.dashboardPageSetup(true); // remove side nav
  }
  interval: any;
  schoolCnt: number = 0;
  teacherCnt: number = 0;
  studentCount: number = 0;
  schCt: any = 0;
  userProfile: any;
  studentcountstop: any;
  schoolcountstop: any;
  teachercountstop: any;
  pageLevel: any;
  appointmentWiseTeachersData: any;
  appointmentTypeWiseTeachersData: any;
  categoryWiseSchoolData: any = [];
  countSchoolCat: any = [];
  schoolCategory: any = [];
  countCat: any = [];
  countCatAppointment: any = [];
  category: any = [];
  categoryAppointment: any = [];

  //Social category wise Students
  showfullOne: boolean = true;
  showexitOne: boolean = false;
  showTableIconOne: boolean = false;
  showGraphIconOne: boolean = false;
  showTableDataOne: boolean = true;
  showGraphDataOne: boolean = true;
  FullScreenStatusOne: number = 0;
  studentSocialCatData!: any;
  studentClasswiseCountData!: any;
  ngOnInit(): void {
    this.spinner.show();
    this.getUserProfile();
    this.pageLevelHandel();
    this.getSchoolCount();
    this.getTeacherCount();
    this.getStudentCount();
    this.getAppointmentwiseTeachers();
    this.appointmentNatureTypeWise();
    this.loadGraphAppointmentTypeData();
    this.getAppointmentTypeWiseTeachers();
    this.getSchoolCategoryWiseForTableView();
    this.getSchoolCategoryData();
    this.getStudentSocialCategoryData();
    this.getClassWiseStudentsCount();

    setTimeout(() => {
      this.spinner.hide();
    }, 4000);
  }
  getUserProfile() {
    const user = this.commonserviceService.getUserProfile();
    this.userProfile = {
      loginUserType: +user?.loginUserTypeId,
      userDesignation: +user?.designationId,
      userDistrictId: +user?.district,
      userBlockId: +user?.block,
      userClusterId: +user?.cluster,
      userSchoolId: user?.school,
    };
  }
  pageLevelHandel() {
    if (this.userProfile.userSchoolId != 0) {
      this.pageLevel = 4;
    } else if (this.userProfile.userClusterId != 0) {
      this.pageLevel = 3;
    } else if (this.userProfile.userBlockId != 0) {
      this.pageLevel = 2;
    } else if (this.userProfile.userDistrictId != 0) {
      this.pageLevel = 1;
    } else {
      this.pageLevel = 0;
    }
  }

  getAppointmentwiseTeachers() {
    this.teacherDashboardMisService
      .getAppointmentwiseTeachers(this.userProfile)
      .subscribe((res: any) => {
        this.appointmentWiseTeachersData = res.data;
        //this.schoolCnt = this.schoolCnt.data;
      });
  }

  appointmentNatureTypeWise() {
    this.teacherDashboardMisService
      .appointmentNatureTypeWise(this.userProfile)
      .subscribe((res: any) => {
        this.countCat = res.appointmentNatureType?.length;
        this.countCat = new Array(this.countCat);
        res.appointmentNatureType.forEach((val: any) => {
          this.category.push(val.appointmentType);
        });
      });
  }
  loadGraphAppointmentTypeData() {
    this.teacherDashboardMisService
      .getGraphAppointmentType(this.userProfile)
      .subscribe((res: any) => {
        this.countCatAppointment = res.data?.length;
        this.countCatAppointment = new Array(this.countCatAppointment);
        res.data.forEach((val: any) => {
          this.categoryAppointment.push(val.appointmentType);
        });
      });
  }

  getAppointmentTypeWiseTeachers() {
    this.teacherDashboardMisService
      .getAppointmentTypeWiseTeachers(this.userProfile)
      .subscribe((res: any) => {
        this.appointmentTypeWiseTeachersData = res.data;
      });
  }
  getSchoolCategoryData() {
    this.schoolDashboardMisService
      .getSchoolCategoryData(this.userProfile)
      .subscribe((res: any) => {
        this.countSchoolCat = res.schoolCategoryWiseType?.length;
        this.countSchoolCat = new Array(this.countSchoolCat);
        res.schoolCategoryWiseType.forEach((val: any) => {
          this.schoolCategory.push(val.categoryName);
        });
      });
  }
  getSchoolCategoryWiseForTableView() {
    this.schoolDashboardMisService
      .getSchoolCategoryWiseForTableView(this.userProfile)
      .subscribe((res: any) => {
        this.categoryWiseSchoolData = res.data;
      });
  }
  getSchoolCount() {
    this.schoolDashboardMisService
      .schoolCount(this.userProfile)
      .subscribe((data: any) => {
        // this.schoolCnt = data.schoolCount;
        const schlCount = data.schoolCount.schCount
          ? data.schoolCount.schCount
          : 0;
        this.setSchoolCount(schlCount);
      });
  }
  setSchoolCount(schlCount: number) {
    if (schlCount > 500) this.schoolCnt = schlCount - 500;

    this.schoolcountstop = setInterval(() => {
      this.schoolCnt++;
      if (this.schoolCnt >= schlCount) {
        clearInterval(this.schoolcountstop);
      }
    }, 10);
  }
  getTeacherCount() {
    this.teacherDashboardMisService
      .teacherCount(this.userProfile)
      .subscribe((data: any) => {
        // this.teacherCnt = data.teacherCount;
        const techCount = data.teacherCount ? data.teacherCount : 0;
        this.setTeacherCount(techCount);
      });
  }
  setTeacherCount(techCount: number) {
    if (techCount > 500) this.teacherCnt = techCount - 500;
    this.teachercountstop = setInterval(() => {
      this.teacherCnt++;
      if (this.teacherCnt >= techCount) {
        clearInterval(this.teachercountstop);
      }
    }, 10);
  }
  getStudentCount() {
    this.studentDashboardService
      .studentCount(this.userProfile)
      .subscribe((data: any) => {
        const count = data?.success ? data.studentCount : 0;
        this.setStudentCount(count);
      });
  }

  setStudentCount(count: number) {
    if (count > 500) this.studentCount = count - 500;
    if (this.studentCount > 100) {
      this.studentCount -= 100;
    }
    this.studentcountstop = setInterval(() => {
      this.studentCount++;
      if (this.studentCount >= count) {
        clearInterval(this.studentcountstop);
      }
    }, 10);
  }

  mdmcount: number = 1;
  mdmcountstop: any = setInterval(() => {
    this.mdmcount++;
    if (this.mdmcount == 85) {
      clearInterval(this.mdmcountstop);
    }
  }, 50);

  // Social category wise Students
  GraphFullScreenOne() {
    if (this.FullScreenStatusOne == 0) {
      this.showexitOne = true;
      this.showfullOne = false;
      this.showTableIconOne = true;
      this.showGraphIconOne = true;
      this.FullScreenStatusOne = 1;
    } else if (this.FullScreenStatusOne == 1) {
      this.showexitOne = false;
      this.showfullOne = true;
      this.showTableIconOne = true;
      this.showGraphIconOne = true;
      this.showTableDataOne = true;
      this.showGraphDataOne = true;
      //this.chart.chart.update();
      this.FullScreenStatusOne = 2;
      this.interval = setInterval(() => {
        $(".scws-portlet").removeClass("Graph-exitscreen");
        clearInterval(this.interval);
      });
    } else {
      this.showexitOne = true;
      this.showfullOne = false;
      this.showTableIconOne = true;
      this.showGraphIconOne = true;
      this.FullScreenStatusOne = 1;
    }
  }

  getStudentSocialCategoryData() {
    this.studentDashboardService
      .getStudentSocialCategoryData(this.userProfile)
      .subscribe({
        next: (response: any) => {
          this.studentSocialCatData = response?.success
            ? response.socialCatData
            : [];
        },
      });
  }
  getClassWiseStudentsCount() {
    this.studentDashboardService
      .getClassWiseStudentsCount(this.userProfile)
      .subscribe({
        next: (response: any) => {
          this.studentClasswiseCountData = response?.success
            ? response.allClassCount
            : [];
        },
      });
  }

 //Gender wise Students
 showfullTwo: boolean = true;
 showexitTwo: boolean = false;
 FullScreenStatusTwo: number = 0;
 GraphFullScreenTwo() {
   if (this.FullScreenStatusTwo == 0) {
     this.showexitTwo = true;
     this.showfullTwo = false;
     this.FullScreenStatusTwo = 1;
   } else if (this.FullScreenStatusTwo == 1) {
     this.showexitTwo = false;
     this.showfullTwo = true;
     this.FullScreenStatusTwo = 2;
     this.interval = setInterval(() => {
       $(".gws-portlet").removeClass("Graph-exitscreen");
       clearInterval(this.interval);
     });
   } else {
     this.showexitTwo = true;
     this.showfullTwo = false;
     this.FullScreenStatusTwo = 1;
   }
 }

 //Class wise  Students
 showfullThree: boolean = true;
 showexitThree: boolean = false;
 showTableIcon: boolean = false;
 showGraphIcon: boolean = false;
 showTableData: boolean = true;
 showGraphData: boolean = true;
 FullScreenStatusThree: number = 0;
 GraphFullScreenThree() {
   if (this.FullScreenStatusThree == 0) {
     this.showexitThree = true;
     this.showfullThree = false;
     this.showTableIcon = true;
     this.showGraphIcon = true;
     this.FullScreenStatusThree = 1;
   } else if (this.FullScreenStatusThree == 1) {
     this.showexitThree = false;
     this.showfullThree = true;
     this.showTableIcon = true;
     this.showGraphIcon = true;
     this.showTableData = true;
     this.showGraphData = true;
     //this.chart.chart.update();
     this.FullScreenStatusThree = 2;
     this.interval = setInterval(() => {
       $(".cws-portlet").removeClass("Graph-exitscreen");
       clearInterval(this.interval);
     });
   } else {
     this.showexitThree = true;
     this.showfullThree = false;
     this.showTableIcon = true;
     this.showGraphIcon = true;
     this.FullScreenStatusThree = 1;
   }
 }

 //Nature of Appointment wise Teachers
 showfullFour: boolean = true;
 showexitFour: boolean = false;
 FullScreenStatusFour: number = 0;
 showTableIconFour: boolean = false;
 showGraphIconFour: boolean = false;
 showTableDataFour: boolean = true;
 showGraphDataFour: boolean = true;
 GraphFullScreenFour() {
   if (this.FullScreenStatusFour == 0) {
     this.showexitFour = true;
     this.showfullFour = false;
     this.showTableIconFour = true;
     this.showGraphIconFour = true;
     this.FullScreenStatusFour = 1;
   } else if (this.FullScreenStatusFour == 1) {
     this.showexitFour = false;
     this.showfullFour = true;
     this.showTableIconFour = true;
     this.showGraphIconFour = true;
     this.showTableDataFour = true;
     this.showGraphDataFour = true;
     this.FullScreenStatusFour = 2;
     this.interval = setInterval(() => {
       $(".nawt-portlet").removeClass("Graph-exitscreen");
       clearInterval(this.interval);
     });
   } else {
     this.showexitFour = true;
     this.showfullFour = false;
     this.showTableIconFour = true;
     this.showGraphIconFour = true;
     this.FullScreenStatusFour = 1;
   }
 }

 showfullFive: boolean = true;
 showexitFive: boolean = false;
 FullScreenStatusFive: number = 0;
 showTableIconFive: boolean = false;
 showGraphIconFive: boolean = false;
 showTableDataFive: boolean = true;
 showGraphDataFive: boolean = true;
 GraphFullScreenFive() {
   if (this.FullScreenStatusFive == 0) {
     this.showexitFive = true;
     this.showfullFive = false;
     this.showTableIconFive = true;
     this.showGraphIconFive = true;
     this.FullScreenStatusFive = 1;
   } else if (this.FullScreenStatusFive == 1) {
     this.showexitFive = false;
     this.showfullFive = true;
     this.showTableIconFive = true;
     this.showGraphIconFive = true;
     this.showTableDataFive = true;
     this.showGraphDataFive = true;
     this.FullScreenStatusFive = 2;
     this.interval = setInterval(() => {
       $(".atwt-portlet").removeClass("Graph-exitscreen");
       clearInterval(this.interval);
     });
   } else {
     this.showexitFive = true;
     this.showfullFive = false;
     this.showTableIconFive = true;
     this.showGraphIconFive = true;
     this.FullScreenStatusFive = 1;
   }
 }
 //Appointment Type wise Teachers
 // showfullFive: boolean = true;
 // showexitFive: boolean = false;
 // FullScreenStatusFive: number = 0;
 // showTableIconFive: boolean = false;
 // showGraphIconFive: boolean = false;
 // showTableDataFive: boolean = true;
 // showGraphDataFive: boolean = true;
 // GraphFullScreenFive() {
 //   if (this.FullScreenStatusFive == 0) {
 //     this.showexitFive = true;
 //     this.showfullFive = false;
 //     this.showTableIconFive = true;
 //     this.showGraphIconFive = true;
 //     this.FullScreenStatusFive = 1;
 //   } else if (this.FullScreenStatusFive == 1) {
 //     this.showexitFive = false;
 //     this.showfullFive = true;
 //     this.showTableIconFive = true;
 //     this.showGraphIconFive = true;
 //     this.showTableDataFive = true;
 //     this.showGraphDataFive = true;
 //     this.FullScreenStatusFive = 2;
 //     this.interval = setInterval(() => {
 //       $(".atwt-portlet").removeClass("Graph-exitscreen");
 //       clearInterval(this.interval);
 //     });
 //   } else {
 //     this.showexitFive = true;
 //     this.showfullFive = false;
 //     this.showTableIconFive = true;
 //     this.showGraphIconFive = true;
 //     this.FullScreenStatusFive = 1;
 //   }
 // }

 //Category wise Schools
 showfullSix: boolean = true;
 showexitSix: boolean = false;
 FullScreenStatusSix: number = 0;
 showTableIconSix: boolean = false;
 showGraphIconSix: boolean = false;
 showTableDataSix: boolean = true;
 showGraphDataSix: boolean = true;
 GraphFullScreenSix() {
   if (this.FullScreenStatusSix == 0) {
     this.showexitSix = true;
     this.showfullSix = false;
     this.FullScreenStatusSix = 1;
     this.showTableIconSix = true;
     this.showGraphIconSix = true;
   } else if (this.FullScreenStatusSix == 1) {
     this.showexitSix = false;
     this.showfullSix = true;
     this.FullScreenStatusSix = 2;
     this.showTableIconSix = true;
     this.showGraphIconSix = true;
     this.showTableDataSix = true;
     this.showGraphDataSix = true;
     this.interval = setInterval(() => {
       $(".categoryws-portlet").removeClass("Graph-exitscreen");
       clearInterval(this.interval);
     });
   } else {
     this.showexitSix = true;
     this.showfullSix = false;
     this.showTableIconSix = true;
     this.showGraphIconSix = true;
     this.FullScreenStatusSix = 1;
   }
 }

 //Management wise Schools
 showfullSeven: boolean = true;
 showexitSeven: boolean = false;
 FullScreenStatusSeven: number = 0;
 GraphFullScreenSeven() {
   if (this.FullScreenStatusSeven == 0) {
     this.showexitSeven = true;
     this.showfullSeven = false;
     this.FullScreenStatusSeven = 1;
   } else if (this.FullScreenStatusSeven == 1) {
     this.showexitSeven = false;
     this.showfullSeven = true;
     this.FullScreenStatusSeven = 2;
     this.interval = setInterval(() => {
       $(".mws-portlet").removeClass("Graph-exitscreen");
       clearInterval(this.interval);
     });
   } else {
     this.showexitSeven = true;
     this.showfullSeven = false;
     this.FullScreenStatusSeven = 1;
   }
 }

 //MDM Student Attendance
 showfullEight: boolean = true;
 showexitEight: boolean = false;
 FullScreenStatusEight: number = 0;
 GraphFullScreenEight() {
   if (this.FullScreenStatusEight == 0) {
     this.showexitEight = true;
     this.showfullEight = false;
     this.FullScreenStatusEight = 1;
   } else if (this.FullScreenStatusEight == 1) {
     this.showexitEight = false;
     this.showfullEight = true;
     this.FullScreenStatusEight = 2;
     this.interval = setInterval(() => {
       $(".mdm-portlet").removeClass("Graph-exitscreen");
       clearInterval(this.interval);
     });
   } else {
     this.showexitEight = true;
     this.showfullEight = false;
     this.FullScreenStatusEight = 1;
   }
 }

 //Teacher Attendance Last 7 days
 showfullEightone: boolean = true;
 showexitEightone: boolean = false;
 FullScreenStatusEightone: number = 0;
 GraphFullScreenEightone() {
   if (this.FullScreenStatusEightone == 0) {
     this.showexitEightone = true;
     this.showfullEightone = false;
     this.FullScreenStatusEightone = 1;
   } else if (this.FullScreenStatusEightone == 1) {
     this.showexitEightone = false;
     this.showfullEightone = true;
     this.FullScreenStatusEightone = 2;
     this.interval = setInterval(() => {
       $(".mdm-portlet").removeClass("Graph-exitscreen");
       clearInterval(this.interval);
     });
   } else {
     this.showexitEightone = true;
     this.showfullEightone = false;
     this.FullScreenStatusEightone = 1;
   }
 }

 //MDM Served
 showfullNine: boolean = true;
 showexitNine: boolean = false;
 FullScreenStatusNine: number = 0;
 GraphFullScreenNine() {
   if (this.FullScreenStatusNine == 0) {
     this.showexitNine = true;
     this.showfullNine = false;
     this.FullScreenStatusNine = 1;
   } else if (this.FullScreenStatusNine == 1) {
     this.showexitNine = false;
     this.showfullNine = true;
     this.FullScreenStatusNine = 2;
     this.interval = setInterval(() => {
       $(".mdmser-portlet").removeClass("Graph-exitscreen");
       clearInterval(this.interval);
     });
   } else {
     this.showexitNine = true;
     this.showfullNine = false;
     this.FullScreenStatusNine = 1;
   }
 }

 //Student Attendance Last 7 days
 showfullNineone: boolean = true;
 showexitNineone: boolean = false;
 FullScreenStatusNineone: number = 0;
 GraphFullScreenNineone() {
   if (this.FullScreenStatusNineone == 0) {
     this.showexitNineone = true;
     this.showfullNineone = false;
     this.FullScreenStatusNineone = 1;
   } else if (this.FullScreenStatusNineone == 1) {
     this.showexitNineone = false;
     this.showfullNineone = true;
     this.FullScreenStatusNineone = 2;
     this.interval = setInterval(() => {
       $(".mdmser-portlet").removeClass("Graph-exitscreen");
       clearInterval(this.interval);
     });
   } else {
     this.showexitNineone = true;
     this.showfullNineone = false;
     this.FullScreenStatusNineone = 1;
   }
 }

  ngOnDestroy(): void {
    clearInterval(this.studentcountstop);
    clearInterval(this.schoolcountstop);
    clearInterval(this.teachercountstop);
  }
}
