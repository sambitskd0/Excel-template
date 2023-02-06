import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CustomValidators } from 'src/app/shared/validations/custom-validators';
import { AutoFocusDirective } from 'src/app/shared/directives/auto-focus.directive';
import { NgxPaginationModule } from 'ngx-pagination';
// import { NgxPaginationModule } from 'ngx-pagination';
import { DataTablesModule } from 'angular-datatables';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { InspectionRoutingModule } from './inspection-routing.module';
import { AddQuestionComponent } from './manageQuestion/add-question/add-question.component';
import { EditQuestionComponent } from './manageQuestion/edit-question/edit-question.component';
import { ViewQuestionComponent } from './manageQuestion/view-question.component';
import { InspectionComponent } from './inspection.component';

import { InspectionMisComponent } from './inspection-mis/inspection-mis.component';
import { SchoolMonitoringReportComponent } from './inspection-mis/schoolReport/school-monitoring-report/school-monitoring-report.component';

import { BestMisComponent } from "./best-mis/best-mis.component";
import { DivyaMisComponent } from "./divya-mis/divya-mis.component";
import { AngularMaterialModule } from 'src/app/shared/modules/angular-material.module';
// import { AngularMaterialModule } from 'src/app/shared/modules/angular-material.module';

import { ReportComponent } from './divya-mis/report/report.component';
import { SurveyWorkModalComponent } from './divya-mis/report/survey-work-modal/survey-work-modal.component';
import { SchoolSurveyModalComponent } from './divya-mis/report/school-survey-modal/school-survey-modal.component';
import { ArtificialLimbCenterModalComponent } from './divya-mis/report/artificial-limb-center-modal/artificial-limb-center-modal.component';
import { ArtificialLimbCenterTeacherModalComponent } from './divya-mis/report/artificial-limb-center-teacher-modal/artificial-limb-center-teacher-modal.component';
import { ResourceCenterTeacherModalComponent } from './divya-mis/report/resource-center-teacher-modal/resource-center-teacher-modal.component';
import { ResourceCenterModalComponent } from './divya-mis/report/resource-center-modal/resource-center-modal.component';
import { TrainingTeacherModalComponent } from './divya-mis/report/training-teacher-modal/training-teacher-modal.component';
import { TrainingModalComponent } from './divya-mis/report/training-modal/training-modal.component';
import { KgbvModalComponent } from './divya-mis/report/kgbv-modal/kgbv-modal.component';
import { KgbvTeacherModalComponent } from './divya-mis/report/kgbv-teacher-modal/kgbv-teacher-modal.component';
import { AnyOtherModalComponent } from './divya-mis/report/any-other-modal/any-other-modal.component';
import { SchoolSurveyTeacherModalComponent } from './divya-mis/report/school-survey-teacher-modal/school-survey-teacher-modal.component';
import { CampModalComponent } from './divya-mis/report/camp-modal/camp-modal.component';
import { SchoolInspectionComponent } from './best-mis/school-inspection/school-inspection.component';
import { HomeEducationModalComponent } from './divya-mis/report/home-education-modal/home-education-modal.component';
import { HomeEducationTeacherModalComponent } from './divya-mis/report/home-education-teacher-modal/home-education-teacher-modal.component';
import { SchoolStatusReportComponent } from './best-mis/school-status-report/school-status-report.component';
import { TeacherAbsentReportComponent } from './best-mis/teacher-absent-report/teacher-absent-report.component';
import { TeacherAttendanceComponent } from './best-mis/teacher-attendance/teacher-attendance.component';
import { StudentAttendenceReportComponent } from './best-mis/student-attendence-report/student-attendence-report.component';
import { AbsentTeacherActionComponent } from './best-mis/absent-teacher-action/absent-teacher-action.component';
import { InspectionReportComponent } from './best-mis/inspection-report/inspection-report.component';
import { UpdateLatLongComponent } from './updateLatLong/update-lat-long.component';
import { ApprovedRequestComponent } from './updateLatLong/approved-request/approved-request.component';
import { RejectedRequestComponent } from './updateLatLong/rejected-request/rejected-request.component';
import { SchoolStatusNagarWiseReportComponent } from './best-mis/school-status-nagar-wise-report/school-status-nagar-wise-report.component';
import { TeacherAbsentReportNagarWiseComponent } from './best-mis/teacher-absent-report-nagar-wise/teacher-absent-report-nagar-wise.component';
import { TeacherAbsentReportPanchayatWiseComponent } from './best-mis/teacher-absent-report-panchayat-wise/teacher-absent-report-panchayat-wise.component';
import { StudentAttendanceReportPanchayatWiseComponent } from './best-mis/student-attendance-report-panchayat-wise/student-attendance-report-panchayat-wise.component';
import { StudentAttendanceReportNagarWiseComponent } from './best-mis/student-attendance-report-nagar-wise/student-attendance-report-nagar-wise.component';
import { TeacherAttendanceNagarWiseComponent } from './best-mis/teacher-attendance-nagar-wise/teacher-attendance-nagar-wise.component';
import { SchoolStatusPanchayatWiseReportComponent } from './best-mis/school-status-panchayat-wise-report/school-status-panchayat-wise-report.component';
import { TeacherAttendancePanchayatWiseComponent } from './best-mis/teacher-attendance-panchayat-wise/teacher-attendance-panchayat-wise.component';
import { AutoUpdateRequestComponent } from './updateLatLong/auto-update-request/auto-update-request.component';
import { SchoolMdmDoneNotDoneReportComponent } from './best-mis/school-mdm-done-not-done-report/school-mdm-done-not-done-report.component';
import { DesignationWiseSchoolReportComponent } from './best-mis/designation-wise-school-report/designation-wise-school-report.component';
import { ActiveSchoolListComponent } from './best-mis/active-school-list/active-school-list.component';
import { UserMonitoringReportComponent } from './best-mis/user-monitoring-report/user-monitoring-report.component';
import { SchoolMdmNagarWiseReportComponent } from './best-mis/school-mdm-nagar-wise-report/school-mdm-nagar-wise-report.component';
import { SchoolMdmPanchayatWiseReportComponent } from './best-mis/school-mdm-panchayat-wise-report/school-mdm-panchayat-wise-report.component';
import { TeacherAbsentCountReportComponent } from './best-mis/teacher-absent-count-report/teacher-absent-count-report.component';
import { IndicatorWiseInspectionReportComponent } from './best-mis/indicator-wise-inspection-report/indicator-wise-inspection-report.component';
import { UserActiveInactiveListComponent } from './best-mis/user-active-inactive-list/user-active-inactive-list.component';


@NgModule({
  declarations: [
    AddQuestionComponent,
    EditQuestionComponent,
    ViewQuestionComponent,
    InspectionComponent,

    InspectionMisComponent,
    SchoolMonitoringReportComponent,

    DivyaMisComponent,
    BestMisComponent,
    ReportComponent,
    SurveyWorkModalComponent,
    SchoolSurveyModalComponent,
    ArtificialLimbCenterModalComponent,
    ArtificialLimbCenterTeacherModalComponent,
    ResourceCenterTeacherModalComponent,
    ResourceCenterModalComponent,
    TrainingTeacherModalComponent,
    TrainingModalComponent,
    KgbvModalComponent,
    KgbvTeacherModalComponent,
    AnyOtherModalComponent,
    SchoolSurveyTeacherModalComponent,
    CampModalComponent,
    SchoolInspectionComponent,
    HomeEducationModalComponent,
    HomeEducationTeacherModalComponent,
    SchoolStatusReportComponent,
    TeacherAbsentReportComponent,
    TeacherAttendanceComponent,
    StudentAttendenceReportComponent,
    AbsentTeacherActionComponent,
    InspectionReportComponent,
    UpdateLatLongComponent,
    ApprovedRequestComponent,
    RejectedRequestComponent,
    SchoolStatusNagarWiseReportComponent,
    TeacherAbsentReportNagarWiseComponent,
    TeacherAbsentReportPanchayatWiseComponent,
    StudentAttendanceReportPanchayatWiseComponent,
    StudentAttendanceReportNagarWiseComponent,
    TeacherAttendanceNagarWiseComponent,
    SchoolStatusPanchayatWiseReportComponent,
    TeacherAttendancePanchayatWiseComponent,
    AutoUpdateRequestComponent,
    SchoolMdmDoneNotDoneReportComponent,
    DesignationWiseSchoolReportComponent,
    ActiveSchoolListComponent,
    UserMonitoringReportComponent,
    SchoolMdmNagarWiseReportComponent,
    SchoolMdmPanchayatWiseReportComponent,
    TeacherAbsentCountReportComponent,
    IndicatorWiseInspectionReportComponent,
    UserActiveInactiveListComponent,
  ],
  imports: [
    CommonModule,
    InspectionRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgxPaginationModule,
    DataTablesModule,
    BsDatepickerModule.forRoot(),
    AngularMaterialModule
  ],
  providers: [CustomValidators, AutoFocusDirective],
})
export class InspectionModule {}
