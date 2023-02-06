import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { BestMisComponent } from './best-mis/best-mis.component';
import { SchoolInspectionComponent } from "./best-mis/school-inspection/school-inspection.component";
import { SchoolStatusReportComponent } from "./best-mis/school-status-report/school-status-report.component";
import { TeacherAbsentReportComponent } from "./best-mis/teacher-absent-report/teacher-absent-report.component";
import { DivyaMisComponent } from "./divya-mis/divya-mis.component";
import { ReportComponent } from "./divya-mis/report/report.component";
import { InspectionMisComponent } from "./inspection-mis/inspection-mis.component";
import { SchoolMonitoringReportComponent } from "./inspection-mis/schoolReport/school-monitoring-report/school-monitoring-report.component";
import { InspectionComponent } from "./inspection.component";
import { RoleGuard } from 'src/app/core/guards/role.guard';
import { AddQuestionComponent } from "./manageQuestion/add-question/add-question.component";
import { EditQuestionComponent } from "./manageQuestion/edit-question/edit-question.component";
import { ViewQuestionComponent } from "./manageQuestion/view-question.component";
import { TeacherAttendanceComponent } from "./best-mis/teacher-attendance/teacher-attendance.component";
import { StudentAttendenceReportComponent } from "./best-mis/student-attendence-report/student-attendence-report.component";
import { AbsentTeacherActionComponent } from "./best-mis/absent-teacher-action/absent-teacher-action.component";
import { InspectionReportComponent } from "./best-mis/inspection-report/inspection-report.component";
import { UpdateLatLongComponent } from "./updateLatLong/update-lat-long.component";
import { RejectedRequestComponent } from "./updateLatLong/rejected-request/rejected-request.component";
import { ApprovedRequestComponent } from "./updateLatLong/approved-request/approved-request.component";
import { SchoolStatusNagarWiseReportComponent } from "./best-mis/school-status-nagar-wise-report/school-status-nagar-wise-report.component";
import { TeacherAbsentReportNagarWiseComponent } from "./best-mis/teacher-absent-report-nagar-wise/teacher-absent-report-nagar-wise.component";
import { TeacherAbsentReportPanchayatWiseComponent } from "./best-mis/teacher-absent-report-panchayat-wise/teacher-absent-report-panchayat-wise.component";
import { StudentAttendanceReportNagarWiseComponent } from "./best-mis/student-attendance-report-nagar-wise/student-attendance-report-nagar-wise.component";
import { StudentAttendanceReportPanchayatWiseComponent } from "./best-mis/student-attendance-report-panchayat-wise/student-attendance-report-panchayat-wise.component";
import { TeacherAttendanceNagarWiseComponent } from "./best-mis/teacher-attendance-nagar-wise/teacher-attendance-nagar-wise.component";
import { SchoolStatusPanchayatWiseReportComponent } from "./best-mis/school-status-panchayat-wise-report/school-status-panchayat-wise-report.component";
import { TeacherAttendancePanchayatWiseComponent } from "./best-mis/teacher-attendance-panchayat-wise/teacher-attendance-panchayat-wise.component";
import { AutoUpdateRequestComponent } from "./updateLatLong/auto-update-request/auto-update-request.component";
import { SchoolMdmDoneNotDoneReportComponent } from "./best-mis/school-mdm-done-not-done-report/school-mdm-done-not-done-report.component";
import { DesignationWiseSchoolReportComponent } from "./best-mis/designation-wise-school-report/designation-wise-school-report.component";
import { ActiveSchoolListComponent } from "./best-mis/active-school-list/active-school-list.component";
import { SchoolMdmNagarWiseReportComponent } from "./best-mis/school-mdm-nagar-wise-report/school-mdm-nagar-wise-report.component";
import { SchoolMdmPanchayatWiseReportComponent } from "./best-mis/school-mdm-panchayat-wise-report/school-mdm-panchayat-wise-report.component";
import { UserMonitoringReportComponent } from "./best-mis/user-monitoring-report/user-monitoring-report.component";
import { TeacherAbsentCountReportComponent } from "./best-mis/teacher-absent-count-report/teacher-absent-count-report.component";
import { IndicatorWiseInspectionReportComponent } from "./best-mis/indicator-wise-inspection-report/indicator-wise-inspection-report.component";
import { UserActiveInactiveListComponent } from "./best-mis/user-active-inactive-list/user-active-inactive-list.component";


const routes: Routes = [
  { path: "", component: InspectionComponent, pathMatch: "full" },
  {
    path: "manageQuestion",
    component: InspectionComponent,

    children: [
      { path: "", redirectTo: "viewQuestion" },
      { path: "addQuestion", component: AddQuestionComponent },
      { path: "viewQuestion", component: ViewQuestionComponent },
      { path: "editQuestion/:encId", component: EditQuestionComponent },
    ],
  },

  {
    path: "bestMis",
    component: InspectionComponent,

    children: [
      { path: "", redirectTo: "mis" },
      { path: "mis", component: BestMisComponent },
      {
        path: "mis/schoolInspection",
        component: SchoolInspectionComponent,
      },
      {
        path: "mis/indicatorWiseReport",
        component: IndicatorWiseInspectionReportComponent,
      },
      {
        path: "mis/schoolStatusReport",
        component: SchoolStatusReportComponent,
      },
      {
        path: "mis/userMonitoringReport",
        component: UserMonitoringReportComponent,
      },
      
      {
        path: "mis/designationWiseInspectionReport",
        component: DesignationWiseSchoolReportComponent,
      },
      {
        path: "mis/schoolMdmReport",
        component: SchoolMdmDoneNotDoneReportComponent,
      },
      {
        path: "mis/teacherAttendanceInspection",
        component: TeacherAttendanceComponent,
      },
      {
        path: "mis/teacherAbsentCountReport",
        component: TeacherAbsentCountReportComponent,
      },

      {
        path: "mis/teacherAbsentReport",
        component: TeacherAbsentReportComponent,
      },

      {
        path: "mis/studentAttendenceReport",
        component: StudentAttendenceReportComponent,
      },
      {
        path: "mis/absentTeacherAction",
        component: AbsentTeacherActionComponent,
      },
      {
        path: "mis/inspectionReport",
        component: InspectionReportComponent,
      },
      {
        path: "mis/teacherAbsentStatusNagarWiseReport",
        component: TeacherAbsentReportNagarWiseComponent,
      },
      {
        path: "mis/teacherAbsentStatusPanchayatWiseReport",
        component: TeacherAbsentReportPanchayatWiseComponent,
      },
      {
        path: "mis/studentAttendenceStatusNagarWiseReport",
        component: StudentAttendanceReportNagarWiseComponent,
      },
      {
        path: "mis/studentAttendenceStatusPanchayatWiseReport",
        component: StudentAttendanceReportPanchayatWiseComponent,
      },
      {
        path: "mis/schoolStatusNagarWiseReport",
        component: SchoolStatusNagarWiseReportComponent,
      },
      {
        path: "mis/teacherAttendandeNagarWiseReport",
        component: TeacherAttendanceNagarWiseComponent,
      },
      {
        path: "mis/schoolMdmNagarWiseReport",
        component: SchoolMdmNagarWiseReportComponent,
      },
      {
        path: "mis/schoolMdmPanchayatWiseReport",
        component: SchoolMdmPanchayatWiseReportComponent,
      },
      {
        path: "mis/schoolStatusPanchayatWiseReport",
        component: SchoolStatusPanchayatWiseReportComponent,
      },
      {
      
        path: "mis/teacherAttendandePanchayatWiseReport",
        component: TeacherAttendancePanchayatWiseComponent,
      }
    ],
  },
  {
    path:'updateLatLong',
    component: InspectionComponent,
    children: [
      { path: '', redirectTo:'viewNewRequest' },
      // { path: 'autoUpdateRequest', component: AutoUpdateRequestComponent,canActivate: [RoleGuard], data: {role: 'admin'}},
      { path: 'viewNewRequest', component: UpdateLatLongComponent,canActivate: [RoleGuard], data: {role: 'admin'}},
      { path: 'viewRejectRequest', component: RejectedRequestComponent,canActivate: [RoleGuard], data: {role: 'admin'}},
      { path: 'viewApprovedRequest', component: ApprovedRequestComponent,canActivate: [RoleGuard], data: {role: 'admin'}}
    ]
  },
  {
    path:'schoolList',
    component: InspectionComponent,
    children: [
      { path: "", redirectTo: 'viewSchoolList' },
      { path: "viewSchoolList", component: ActiveSchoolListComponent }
    ],
  },
  {
    path:'inActiveUserList',
    component: InspectionComponent,
    children: [
      { path: "", redirectTo: 'activeUserCountReport' },
      { path: "activeUserCountReport", component: UserActiveInactiveListComponent }
    ],
  }
,

  // ======= all route related to divys mis
  {
    path: "divya",
    component: InspectionComponent,
    children: [
      { path: "", redirectTo: 'reports' },
      { path: "reports", component: DivyaMisComponent },
      { path: "viewReports/:params", component: ReportComponent },
    ],
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InspectionRoutingModule { }
