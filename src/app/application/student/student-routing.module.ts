import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StudentComponent } from './student.component';
import { AddSmartClassComponent } from './smartClass/add-smart-class/add-smart-class.component';
import { EditSmartClassComponent } from './smartClass/edit-smart-class/edit-smart-class.component';
import { ViewSmartClassComponent } from './smartClass/view-smart-class.component';
import { AddStudentAchievementComponent } from './studentAchievement/add-student-achievement/add-student-achievement.component';
import { EditStudentAchievementComponent } from './studentAchievement/edit-student-achievement/edit-student-achievement.component';
import { ViewStudentAchievementComponent } from './studentAchievement/view-student-achievement.component';
import { ViewDoctorDetailsComponent } from './healthCheckUp/view-doctor-details.component';
import { EditDoctorDetailsComponent } from './healthCheckUp/edit-doctor-details/edit-doctor-details.component';
import { AddDoctorDetailsComponent } from './healthCheckUp/add-doctor-details/add-doctor-details.component';
import { ViewHealthCheckUpComponent } from './healthCheckUp/view-health-check-up.component';
import { AddHealthCheckUpComponent } from './healthCheckUp/add-health-check-up/add-health-check-up.component';
import { EditHealthCheckUpComponent } from './healthCheckUp/edit-health-check-up/edit-health-check-up.component';
import { ViewRemedialTrainingComponent } from './RemedialTraining/view-remedial-training.component';
import { AddRemedialTrainingComponent } from './RemedialTraining/add-remedial-training/add-remedial-training.component';
import { EditRemedialTrainingComponent } from './RemedialTraining/edit-remedial-training/edit-remedial-training.component';
import { AddStudentMarkComponent } from './Student mark/add-student-mark/add-student-mark.component';
import { EditStudentMarkComponent } from './Student mark/edit-student-mark/edit-student-mark.component';
import { ViewStudentMarkComponent } from './Student mark/view-student-mark.component';
import { ViewStudentComponent } from './studentInformation/view-student.component';
import { EditStudentComponent } from './studentInformation/edit-student/edit-student.component';
import { AddStudentComponent } from './studentInformation/add-student/add-student.component';
import { RoleGuard } from 'src/app/core/guards/role.guard';
import { PreviewStudentComponent } from './studentInformation/preview-student/preview-student.component';
import { StudentTransferComponent } from './studentTransfer/student-transfer.component';
import { MarkReportCardComponent } from './Student mark/mark-report-card/mark-report-card.component';
import { ToSchoolComponent } from './studentTransfer/to-school/to-school.component';
import { DropoutComponent } from './studentTransfer/dropout/dropout.component';
import { NewEnrollmentComponent } from './studentInformation/new-enrollment/new-enrollment.component';
import { ProgressionComponent } from './progression/progression.component';
import { ViewChangeRequestComponent } from './view-change-request/view-change-request.component';
import { ViewVerificationRequestComponent } from './studentInformation/view-verification-request/view-verification-request.component';
import { ProgressionReportComponent } from './progression/progression-report/progression-report.component';

import { ProgressReportCardComponent } from './progress-report-card/progress-report-card.component';
import { AddSubjectComponent } from './subjectTagging/add-subject/add-subject.component';
import { EditSubjectComponent } from './subjectTagging/edit-subject/edit-subject.component';
import { ViewSubjectComponent } from './subjectTagging/view-subject.component';
import { AddSubjectTaggingComponent } from './subjectTagging/manageSubjectTagging/add-subject-tagging/add-subject-tagging.component';
import { EditSubjectTaggingComponent } from './subjectTagging/manageSubjectTagging/edit-subject-tagging/edit-subject-tagging.component';
import { ViewSubjectTaggingComponent } from './subjectTagging/manageSubjectTagging/view-subject-tagging.component';
import { AddIndicatorComponent } from './manageIndicator/add-indicator/add-indicator.component';
import { EditIndicatorComponent } from './manageIndicator/edit-indicator/edit-indicator.component';
import { ViewIndicatorComponent } from './manageIndicator/view-indicator.component';
import { AddContextComponent } from './manageContext/add-context/add-context.component';
import { EditContextComponent } from './manageContext/edit-context/edit-context.component';
import { ViewContextComponent } from './manageContext/view-context.component';
import { AddContextTaggingComponent } from './manageContext/contextTagging/add-context-tagging/add-context-tagging.component';
import { EditContextTaggingComponent } from './manageContext/contextTagging/edit-context-tagging/edit-context-tagging.component';
import { ViewContextTaggingComponent } from './manageContext/contextTagging/view-context-tagging.component';
import { LastSessionComponent } from './studentTransfer/last-session/last-session.component';
import { ViewStudentMisComponent } from './studentMis/view-student-mis.component';
import { GenderWiseEnrollmentReportComponent } from './studentMis/gender-wise-enrollment-report/gender-wise-enrollment-report.component';
import { CasteWiseEnrollmentReportComponent } from './studentMis/caste-wise-enrollment-report/caste-wise-enrollment-report.component';
import { ReligionWiseEnrollmentReportComponent } from './studentMis/religion-wise-enrollment-report/religion-wise-enrollment-report.component';
import { DisabilityWiseEnrollmentReportComponent } from './studentMis/disability-wise-enrollment-report/disability-wise-enrollment-report.component';
import { RemedialTranningReportComponent } from './studentMis/remedial-tranning-report/remedial-tranning-report.component';
import { GradeWiseStudentComponent } from './studentMis/grade-wise-student/grade-wise-student.component';
import { ViewAcdemicYearControlComponent } from './academicYearControl/view-acdemic-year-control.component';
import { HealthWiseReportComponent } from './studentMis/health-wise-report/health-wise-report.component';

//import { RoleGuard } from 'src/app/core/guards/role.guard';
const routes: Routes = [
  // {path:"", component:StudentComponent, canActivate: [RoleGuard], data: {role: 'admin'} },
  {
    path: 'info',
    component: StudentComponent,
    children: [
      { path: '', redirectTo: 'view' },
      { path: 'add', component: AddStudentComponent, canActivate: [RoleGuard], data: { role: 'admin' } },
      { path: 'edit/:encId', component: EditStudentComponent, canActivate: [RoleGuard], data: { role: 'admin' } },
      { path: 'view', component: ViewStudentComponent, canActivate: [RoleGuard], data: { role: 'view' } },
      { path: 'preview/:encId', component: PreviewStudentComponent, canActivate: [RoleGuard], data: { role: 'view' } },
      { path: 'newEnrollment/:encId', component: NewEnrollmentComponent, canActivate: [RoleGuard], data: { role: 'admin' } },
      { path: 'cr', component: ViewChangeRequestComponent, canActivate: [RoleGuard], data: { role: 'view' } },
      { path: 'verifyreq', component: ViewVerificationRequestComponent, canActivate: [RoleGuard], data: { role: 'view' } },
    ],
  },
  {
    path: 'transfer',
    component: StudentComponent,
    children: [
      { path: '', redirectTo: 'midSession' },
      { path: 'midSession', component: StudentTransferComponent, canActivate: [RoleGuard], data: { role: 'view' } },
      { path: 'toSchool', component: ToSchoolComponent, canActivate: [RoleGuard], data: { role: 'view' } },
      { path: 'dropOut', component: DropoutComponent, canActivate: [RoleGuard], data: { role: 'view' } },
      { path: 'lastSession', component: LastSessionComponent, canActivate: [RoleGuard], data: { role: 'view' } }
    ]
  },
  {
    path: 'smartClass',
    component: StudentComponent,
    children: [
      { path: '', redirectTo: 'viewSmartClass' },
      { path: 'addSmartClass', component: AddSmartClassComponent, canActivate: [RoleGuard], data: { role: 'admin' } },
      { path: 'editSmartClass/:encId', component: EditSmartClassComponent, canActivate: [RoleGuard], data: { role: 'admin' } },
      { path: 'viewSmartClass', component: ViewSmartClassComponent, canActivate: [RoleGuard], data: { role: 'view' } }
    ]
  },
  {
    path: 'studentAchievement',
    component: StudentComponent,
    children: [
      { path: '', redirectTo: 'viewStudentAchievement' },
      { path: 'addStudentAchievement', component: AddStudentAchievementComponent, canActivate: [RoleGuard], data: { role: 'admin' } },
      { path: 'editStudentAchievement/:encId', component: EditStudentAchievementComponent, canActivate: [RoleGuard], data: { role: 'admin' } },
      { path: 'viewStudentAchievement', component: ViewStudentAchievementComponent, canActivate: [RoleGuard], data: { role: 'view' } }
    ]
  },
  {
    path: 'healthCheckUp',
    component: StudentComponent,
    children: [
      { path: '', redirectTo: 'viewDocterDetails' },
      { path: 'addDocterDetails', component: AddDoctorDetailsComponent, canActivate: [RoleGuard], data: { role: 'admin' } },
      { path: 'editDocterDetails/:encId', component: EditDoctorDetailsComponent, canActivate: [RoleGuard], data: { role: 'admin' } },
      { path: 'viewDocterDetails', component: ViewDoctorDetailsComponent, canActivate: [RoleGuard], data: { role: 'view' } },
      { path: 'addHealthCheckUp', component: AddHealthCheckUpComponent, canActivate: [RoleGuard], data: { role: 'admin' } },
      { path: 'editHealthCheckUp/:encId', component: EditHealthCheckUpComponent, canActivate: [RoleGuard], data: { role: 'admin' } },
      { path: 'viewHealthCheckUp', component: ViewHealthCheckUpComponent, canActivate: [RoleGuard], data: { role: 'view' } }
    ]
  },
  {
    path: 'remedialTraining',
    component: StudentComponent,
    children: [
      { path: '', redirectTo: 'viewRemedialTraining' },
      { path: 'addRemedialTraining', component: AddRemedialTrainingComponent, canActivate: [RoleGuard], data: { role: 'admin' } },
      { path: 'editRemedialTraining/:encId', component: EditRemedialTrainingComponent, canActivate: [RoleGuard], data: { role: 'admin' } },
      { path: 'viewRemedialTraining', component: ViewRemedialTrainingComponent, canActivate: [RoleGuard], data: { role: 'view' } },
    ]
  },
  {
    path: 'studentMark',
    component: StudentComponent,
    children: [
      { path: '', redirectTo: 'viewStudentMark' },
      { path: 'addStudentMark', component: AddStudentMarkComponent, canActivate: [RoleGuard], data: { role: 'admin' } },
      { path: 'editStudentMark/:encId', component: EditStudentMarkComponent, canActivate: [RoleGuard], data: { role: 'admin' } },
      { path: 'viewStudentMark', component: ViewStudentMarkComponent, canActivate: [RoleGuard], data: { role: 'admin' } },
      { path: 'markReportCard', component: MarkReportCardComponent, canActivate: [RoleGuard], data: { role: 'view' } },
    ]
  },
  {
    path: 'progression',
    component: StudentComponent,
    children: [
      { path: '', redirectTo: 'report' },
      { path: 'update', component: ProgressionComponent, canActivate: [RoleGuard], data: { role: 'admin' } },
      { path: 'report', component: ProgressionReportComponent, canActivate: [RoleGuard], data: { role: 'view' } },
    ]
  },
  {
    path: 'progressReportCard',
    component: StudentComponent,
    children: [
      { path: '', redirectTo: 'view' },
      { path: 'view', component: ProgressReportCardComponent, canActivate: [RoleGuard], data: { role: 'view' } },
    ]
  },
  {
    path: 'reportCard/subject',
    component: StudentComponent,
    children: [
      { path: '', redirectTo: 'view' },
      { path: 'add', component: AddSubjectComponent },
      { path: 'edit/:encId', component: EditSubjectComponent },
      { path: 'view', component: ViewSubjectComponent },
    ]
  }, {
    path: 'reportCard/subjectTagging',
    component: StudentComponent,
    children: [
      { path: '', redirectTo: 'view' },
      { path: 'add', component: AddSubjectTaggingComponent },
      { path: 'edit/:encId', component: EditSubjectTaggingComponent },
      { path: 'view', component: ViewSubjectTaggingComponent },
    ]
  },
  {
    path: 'reportCard/indicator',
    component: StudentComponent,
    children: [
      { path: '', redirectTo: 'view' },
      { path: 'add', component: AddIndicatorComponent },
      { path: 'edit/:encId', component: EditIndicatorComponent },
      { path: 'view', component: ViewIndicatorComponent },
    ]
  },
  {
    path: 'reportCard/context',
    component: StudentComponent,
    children: [
      { path: '', redirectTo: 'view' },
      { path: 'add', component: AddContextComponent },
      { path: 'edit/:encId', component: EditContextComponent },
      { path: 'view', component: ViewContextComponent },
    ]
  },
  {
    path: 'reportCard/contextTagging',
    component: StudentComponent,
    children: [
      { path: '', redirectTo: 'view' },
      { path: 'add', component: AddContextTaggingComponent },
      { path: 'edit/:encId', component: EditContextTaggingComponent },
      { path: 'view', component: ViewContextTaggingComponent },
    ]
  },
  {
    path: "mis", component: StudentComponent,
    children: [
      { path: "", component: ViewStudentMisComponent },
      { path: 'genderWiseEnrollemntReport', component: GenderWiseEnrollmentReportComponent},      
      { path: 'casteWiseEnrollemntReport', component: CasteWiseEnrollmentReportComponent},
      { path: 'religionWiseEnrollemntReport', component: ReligionWiseEnrollmentReportComponent},
      { path: 'disabilityWiseEnrollemntReport', component: DisabilityWiseEnrollmentReportComponent},       
      { path: 'remidialTranningReport', component: RemedialTranningReportComponent},       
      { path: 'gradeWiseStudentReport', component: GradeWiseStudentComponent },
      { path: 'healthWiseReport', component: HealthWiseReportComponent }

    ]
  },
  {
    path: 'academicYear',
    component: StudentComponent,
    children: [
      { path: '', redirectTo: 'view' },
      { path: 'view', component: ViewAcdemicYearControlComponent },
      
    ]
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StudentRoutingModule { }
