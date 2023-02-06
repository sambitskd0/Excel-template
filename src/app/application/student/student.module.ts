import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StudentRoutingModule } from './student-routing.module';
import { ViewSmartClassComponent } from './smartClass/view-smart-class.component';
import { AddSmartClassComponent } from './smartClass/add-smart-class/add-smart-class.component';
import { EditSmartClassComponent } from './smartClass/edit-smart-class/edit-smart-class.component';
import { StudentComponent } from './student.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { DataTablesModule } from 'angular-datatables';
import { CustomValidators } from 'src/app/shared/validations/custom-validators';
import { AutoFocusDirective } from 'src/app/shared/directives/auto-focus.directive';
import { HttpClientModule } from '@angular/common/http';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { ViewStudentAchievementComponent } from './studentAchievement/view-student-achievement.component';
import { EditStudentAchievementComponent } from './studentAchievement/edit-student-achievement/edit-student-achievement.component';
import { AddStudentAchievementComponent } from './studentAchievement/add-student-achievement/add-student-achievement.component';
import { ViewHealthCheckUpComponent } from './healthCheckUp/view-health-check-up.component';
import { AddHealthCheckUpComponent } from './healthCheckUp/add-health-check-up/add-health-check-up.component';
import { EditHealthCheckUpComponent } from './healthCheckUp/edit-health-check-up/edit-health-check-up.component';
import { AddDoctorDetailsComponent } from './healthCheckUp/add-doctor-details/add-doctor-details.component';
import { EditDoctorDetailsComponent } from './healthCheckUp/edit-doctor-details/edit-doctor-details.component';
import { ViewDoctorDetailsComponent } from './healthCheckUp/view-doctor-details.component';
import { ViewRemedialTrainingComponent } from './RemedialTraining/view-remedial-training.component';
import { AddRemedialTrainingComponent } from './RemedialTraining/add-remedial-training/add-remedial-training.component';
import { EditRemedialTrainingComponent } from './RemedialTraining/edit-remedial-training/edit-remedial-training.component';
import { ViewStudentMarkComponent } from './Student mark/view-student-mark.component';
import { AddStudentMarkComponent } from './Student mark/add-student-mark/add-student-mark.component';
import { EditStudentMarkComponent } from './Student mark/edit-student-mark/edit-student-mark.component';
import { ViewStudentComponent } from './studentInformation/view-student.component';
import { AddStudentComponent } from './studentInformation/add-student/add-student.component';
import { EditStudentComponent } from './studentInformation/edit-student/edit-student.component';
import { AngularMaterialModule } from 'src/app/shared/modules/angular-material.module';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { PreviewStudentComponent } from './studentInformation/preview-student/preview-student.component';
import { AdvanceSearchComponent } from './studentInformation/add-student/advance-search/advance-search.component';
import { StudentTransferComponent } from './studentTransfer/student-transfer.component';
import { DropoutComponent } from './studentTransfer/dropout/dropout.component';
import { ToSchoolComponent } from './studentTransfer/to-school/to-school.component';
import { MarkReportCardComponent } from './Student mark/mark-report-card/mark-report-card.component';
import { NewEnrollmentComponent } from './studentInformation/new-enrollment/new-enrollment.component';
import { ProgressionComponent } from './progression/progression.component';
import { TcComponent } from './tc/tc.component';
import { ViewChangeRequestComponent } from './view-change-request/view-change-request.component';
import { ViewVerificationRequestComponent } from './studentInformation/view-verification-request/view-verification-request.component';
import { ProgressionReportComponent } from './progression/progression-report/progression-report.component';
import { ProgressReportCardComponent } from './progress-report-card/progress-report-card.component';
import { ReportCardComponent } from './report-card/report-card.component';
import { ViewSubjectComponent } from './subjectTagging/view-subject.component';
import { AddSubjectComponent } from './subjectTagging/add-subject/add-subject.component';
import { EditSubjectComponent } from './subjectTagging/edit-subject/edit-subject.component';
import { ViewSubjectTaggingComponent } from './subjectTagging/manageSubjectTagging/view-subject-tagging.component';
import { AddSubjectTaggingComponent } from './subjectTagging/manageSubjectTagging/add-subject-tagging/add-subject-tagging.component';
import { EditSubjectTaggingComponent } from './subjectTagging/manageSubjectTagging/edit-subject-tagging/edit-subject-tagging.component';
import { ViewIndicatorComponent } from './manageIndicator/view-indicator.component';
import { AddIndicatorComponent } from './manageIndicator/add-indicator/add-indicator.component';
import { EditIndicatorComponent } from './manageIndicator/edit-indicator/edit-indicator.component';
import { ViewContextComponent } from './manageContext/view-context.component';
import { EditContextComponent } from './manageContext/edit-context/edit-context.component';
import { AddContextComponent } from './manageContext/add-context/add-context.component';
import { AddContextTaggingComponent } from './manageContext/contextTagging/add-context-tagging/add-context-tagging.component';
import { ViewContextTaggingComponent } from './manageContext/contextTagging/view-context-tagging.component';
import { EditContextTaggingComponent } from './manageContext/contextTagging/edit-context-tagging/edit-context-tagging.component';
import { LastSessionComponent } from './studentTransfer/last-session/last-session.component';
import { RatingComponent } from './report-card/rating/rating.component';
import { ViewStudentMisComponent } from './studentMis/view-student-mis.component';
import { GenderWiseEnrollmentReportComponent } from './studentMis/gender-wise-enrollment-report/gender-wise-enrollment-report.component';
import { CasteWiseEnrollmentReportComponent } from './studentMis/caste-wise-enrollment-report/caste-wise-enrollment-report.component';
import { ReligionWiseEnrollmentReportComponent } from './studentMis/religion-wise-enrollment-report/religion-wise-enrollment-report.component';
import { DisabilityWiseEnrollmentReportComponent } from './studentMis/disability-wise-enrollment-report/disability-wise-enrollment-report.component';
import { RemedialTranningReportComponent } from './studentMis/remedial-tranning-report/remedial-tranning-report.component';
import { GradeWiseStudentComponent } from './studentMis/grade-wise-student/grade-wise-student.component';
import { ViewAcdemicYearControlComponent } from './academicYearControl/view-acdemic-year-control.component';
import { CommonTabComponent } from './reportCardMaster/common-tab/common-tab.component';
import { HealthWiseReportComponent } from './studentMis/health-wise-report/health-wise-report.component';
// import { MobilePanPipe } from 'src/app/shared/pipes/mobile-pan.pipe';

@NgModule({
  declarations: [
    ViewSmartClassComponent,
    AddSmartClassComponent,
    EditSmartClassComponent,
    StudentComponent,
    ViewStudentAchievementComponent,
    EditStudentAchievementComponent,
    AddStudentAchievementComponent,
    ViewHealthCheckUpComponent,
    AddHealthCheckUpComponent,
    EditHealthCheckUpComponent,
    AddDoctorDetailsComponent,
    EditDoctorDetailsComponent,
    ViewDoctorDetailsComponent,
    ViewRemedialTrainingComponent,
    AddRemedialTrainingComponent,
    EditRemedialTrainingComponent,
    ViewStudentMarkComponent,
    AddStudentMarkComponent,
    EditStudentMarkComponent,
    ViewStudentComponent,
    AddStudentComponent,
    EditStudentComponent,
    PreviewStudentComponent,
    AdvanceSearchComponent,
    StudentTransferComponent,
    DropoutComponent,
    ToSchoolComponent,
    MarkReportCardComponent,
    NewEnrollmentComponent,
    ProgressionComponent,
    TcComponent,
    ViewChangeRequestComponent,
    ViewVerificationRequestComponent,
    ProgressionReportComponent,
    ProgressReportCardComponent,
    ReportCardComponent,
    ViewSubjectComponent,
    AddSubjectComponent,
    EditSubjectComponent,
    ViewSubjectTaggingComponent,
    AddSubjectTaggingComponent,
    EditSubjectTaggingComponent,
    ViewIndicatorComponent,
    AddIndicatorComponent,
    EditIndicatorComponent,
    ViewContextComponent,
    EditContextComponent,
    AddContextComponent,
    AddContextTaggingComponent,
    ViewContextTaggingComponent,
    EditContextTaggingComponent,
    LastSessionComponent,
    RatingComponent,
    ViewStudentMisComponent,
    GenderWiseEnrollmentReportComponent,
    CasteWiseEnrollmentReportComponent,
    ReligionWiseEnrollmentReportComponent,
    DisabilityWiseEnrollmentReportComponent,
    RemedialTranningReportComponent,
    GradeWiseStudentComponent,
    ViewAcdemicYearControlComponent,
    CommonTabComponent,
    HealthWiseReportComponent
    // MobilePanPipe
  ],
  imports: [
    CommonModule,
    StudentRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgxPaginationModule,
    DataTablesModule,
    HttpClientModule,
    BsDatepickerModule.forRoot(),
    AngularMaterialModule,
    NgMultiSelectDropDownModule
  ],
  providers:[
    CustomValidators, 
    AutoFocusDirective
  ]
})
export class StudentModule { }
