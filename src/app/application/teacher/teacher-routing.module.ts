import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { PageNotFoundComponent } from "src/app/shared/components/page-not-found/page-not-found.component";
import { AddIndustrialTrainingComponent } from "./industrialTraining/add-industrial-training/add-industrial-training.component";
import { AddTrainingAgencyComponent } from "./industrialTraining/add-training-agency/add-training-agency.component";
import { AddTrainingCategoryComponent } from "./industrialTraining/add-training-category/add-training-category.component";
import { EditIndustrialTrainingComponent } from "./industrialTraining/edit-industrial-training/edit-industrial-training.component";
import { EditTrainingAgencyComponent } from "./industrialTraining/edit-training-agency/edit-training-agency.component";
import { EditTrainingCategoryComponent } from "./industrialTraining/edit-training-category/edit-training-category.component";
import { ViewIndustrialTrainingComponent } from "./industrialTraining/view-industrial-training.component";
import { ViewTrainingAgencyComponent } from "./industrialTraining/view-training-agency/view-training-agency.component";
import { ViewTrainingCategoryComponent } from "./industrialTraining/view-training-category/view-training-category.component";
import { TeacherComponent } from "./teacher.component";
import { AddTeacherComponent } from "./teacherRegistration/add-teacher/add-teacher.component";
import { EditTeacherComponent } from "./teacherRegistration/edit-teacher/edit-teacher.component";
import { EducationalInfoComponent } from "./teacherRegistration/educational-info/educational-info.component";
import { OtherInfoComponent } from "./teacherRegistration/other-info/other-info.component";
import { ProfessionalInfoComponent } from "./teacherRegistration/professional-info/professional-info.component";
import { RegistrationInfoComponent } from "./teacherRegistration/registration-info/registration-info.component";
import { SalaryInfoComponent } from "./teacherRegistration/salary-info/salary-info.component";
import { ServiceInfoComponent } from "./teacherRegistration/service-info/service-info.component";
import { TrainingAndLanguageInfoComponent } from "./teacherRegistration/training-and-language-info/training-and-language-info.component";
import { ViewEducationInfoComponent } from "./teacherRegistration/view-education-info/view-education-info.component";
import { ViewOtherInfoComponent } from "./teacherRegistration/view-other-info/view-other-info.component";
import { ViewProfessionalInfoComponent } from "./teacherRegistration/view-professional-info/view-professional-info.component";
import { ViewRegistrationInfoComponent } from "./teacherRegistration/view-registration-info/view-registration-info.component";
import { ViewTeacherComponent } from "./teacherRegistration/view-teacher.component";
import { ViewTrainingAndLanguageInfoComponent } from "./teacherRegistration/view-training-and-language-info/view-training-and-language-info.component";
import { ViewServicesComponent } from "./teacherServices/view-services.component";
import { UpdateServicesComponent } from "./teacherServices/update-services/update-services.component";
import { ViewTeacherTransferRequestComponent } from "./transferRequest/view-teacher-transfer-request.component";
import { RaiseTransferRequestComponent } from "./transferRequest/raise-transfer-request/raise-transfer-request.component";
import { ViewTeacherTransferComponent } from "./teacherTransfer/view-teacher-transfer.component";
import { ViewTransferListComponent } from "./teacherTransferList/view-transfer-list.component";
import { ViewTransferRequestSchoolComponent } from "./teacherTransfer/transferRequestBySchool/view-transfer-request-school.component";
import { AddTransferRequestSchoolComponent } from "./teacherTransfer/transferRequestBySchool/add-transfer-request-school/add-transfer-request-school.component";
import { ViewRelievingComponent } from "./teacherTransfer/relieving/view-relieving.component";
import { AddRelievingComponent } from "./teacherTransfer/relieving/add-relieving/add-relieving.component";
import { ViewJoiningSchoolComponent } from "./teacherTransfer/joiningSchool/view-joining-school.component";
import { AddJoiningSchoolComponent } from "./teacherTransfer/joiningSchool/add-joining-school/add-joining-school.component";
import { EditTransferRequestComponent } from "./transferRequest/edit-transfer-request/edit-transfer-request.component";
import { ViewChangeRequestApplicationComponent } from "./teacherRegistration/view-change-request-application/view-change-request-application.component";
import { ViewServiceInfoComponent } from "./teacherRegistration/view-service-info/view-service-info.component";
import { ViewSalaryInfoComponent } from "./teacherRegistration/view-salary-info/view-salary-info.component";
import { RoleGuard } from "src/app/core/guards/role.guard";
import { ViewClassTeacherTaggingComponent } from "./classTeacherTagging/view-class-teacher-tagging.component";
import { AddClassTeacherTaggingComponent } from "./classTeacherTagging/add-class-teacher-tagging/add-class-teacher-tagging.component";
import { EditClassTeacherTaggingComponent } from "./classTeacherTagging/edit-class-teacher-tagging/edit-class-teacher-tagging.component";
import { ViewTeacherMisComponent } from "./teacherMis/view-teacher-mis.component";
import { TeacherRawReportComponent } from "./teacherMis/teacher-raw-report/teacher-raw-report.component";
import { SchoolCategoryWiseTeacherReportComponent } from "./teacherMis/school-category-wise-teacher-report/school-category-wise-teacher-report.component";
import { AppointmentTypeWiseTeacherReportComponent } from "./teacherMis/appointment-type-wise-teacher-report/appointment-type-wise-teacher-report.component";

import { UpdateDeputationStatusComponent } from "./teacherDeputation/update-deputation-status/update-deputation-status.component";
import { TeacherDeputeComponent } from "./teacherDeputation/teacher-depute/teacher-depute.component";
import { ViewPromotionComponent } from "./promotion/generatePromotion/view-promotion.component";
import { AddPromotionComponent } from "./promotion/generatePromotion/add-promotion/add-promotion.component";
import { NatureAppointmentWiseTeacherReportComponent } from "./teacherMis/nature-appointment-wise-teacher-report/nature-appointment-wise-teacher-report.component";
import { TeacherTittleWiseReportComponent } from "./teacherMis/teacher-tittle-wise-report/teacher-tittle-wise-report.component";
import { SocialCategoryWiseReportComponent } from "./teacherMis/social-category-wise-report/social-category-wise-report.component";
import { GenderWiseReportComponent } from "./teacherMis/gender-wise-report/gender-wise-report.component";
import { EducationalQualiWiseReportComponent } from "./teacherMis/educational-quali-wise-report/educational-quali-wise-report.component";
import { ProfessionalQualiWiseReportComponent } from "./teacherMis/professional-quali-wise-report/professional-quali-wise-report.component";
import { SetApprovalAuthorityComponent } from "./setApprovalAuthority/set-approval-authority.component";
import { ViewApprovalAuthorityComponent } from "./setApprovalAuthority/viewApprovalAuthority/view-approval-authority.component";
import { TeacherAttendanceReportComponent } from "./teacherMis/teacher-attendance-report/teacher-attendance-report.component";
import { SchoolViewComponent } from "./promotion/school-view/school-view.component";
import { ApproveComponent } from "./promotion/approvePromotion/approve/approve.component";
import { ViewApprovedListComponent } from "./promotion/approvePromotion/view-approved-list.component";
import { ViewTransferRequestBlockComponent } from "./teacherTransferByBlock/view-transfer-request-block.component";
import { PromotionComponent } from "./promotion/promotion.component";
import { ViewNotificationComponent } from "./departmentNotification/view-notification.component";
import { AddNotificationComponent } from "./departmentNotification/add-notification/add-notification.component";

const routes: Routes = [
  {
    path: "",
    component: TeacherComponent,
    pathMatch: "full",
    canActivate: [RoleGuard],
    data: { role: "admin" },
  },
  {
    path: "registration",
    component: TeacherComponent,
    children: [
      { path: "", redirectTo: "viewTeacher" },
      {
        path: "addTeacher",
        component: AddTeacherComponent,
        canActivate: [RoleGuard],
        data: { role: "admin" },
      },
      {
        path: "editTeacher/:encId",
        component: EditTeacherComponent,
        canActivate: [RoleGuard],
        data: { role: "admin" },
      },
      {
        path: "viewTeacher",
        component: ViewTeacherComponent,
        canActivate: [RoleGuard],
        data: { role: "view" },
      },
      {
        path: "viewChangeRequestApplication",
        component: ViewChangeRequestApplicationComponent,
        canActivate: [RoleGuard],
        data: { role: "view" },
      },
      {
        path: "viewTeacher/educationalInfo/:id",
        component: EducationalInfoComponent,
      },
      {
        path: "viewTeacher/professionalInfo/:id",
        component: ProfessionalInfoComponent,
      },
      {
        path: "viewTeacher/trainingAndLanguageInfo/:id",
        component: TrainingAndLanguageInfoComponent,
      },
      { path: "viewTeacher/otherInfo/:id", component: OtherInfoComponent },
      {
        path: "viewTeacher/registrationInfo/:id",
        component: RegistrationInfoComponent,
      },
      // { path: 'viewTeacher/salaryInfo/:id', component: SalaryInfoComponent},
      { path: "viewTeacher/addSalaryInfo/:id", component: SalaryInfoComponent },
      {
        path: "viewTeacher/viewSalaryInfo/:id",
        component: ViewSalaryInfoComponent,
      },
      {
        path: "viewTeacher/viewRegistrationInfo/:id",
        component: ViewRegistrationInfoComponent,
      },
      {
        path: "viewTeacher/viewEducationalInfo/:id",
        component: ViewEducationInfoComponent,
      },
      {
        path: "viewTeacher/viewProfessionalInfo/:id",
        component: ViewProfessionalInfoComponent,
      },
      {
        path: "viewTeacher/viewOtherInfo/:id",
        component: ViewOtherInfoComponent,
      },
      {
        path: "viewTeacher/viewTrainingAndLanguageInfo/:id",
        component: ViewTrainingAndLanguageInfoComponent,
      },
      // { path: 'viewTeacher/serviceInfo/:id', component: ServiceInfoComponent},
      {
        path: "viewTeacher/viewServiceInfo/:id",
        component: ViewServiceInfoComponent,
      },
      {
        path: "viewTeacher/addServiceInfo/:id",
        component: ServiceInfoComponent,
      },
    ],
  },
  {
    path: "industrialTraining",
    component: TeacherComponent,
    children: [
      { path: "", redirectTo: "viewIndustrialTraining" },
      {
        path: "addIndustrialTraining",
        component: AddIndustrialTrainingComponent,
        canActivate: [RoleGuard],
        data: { role: "admin" },
      },
      {
        path: "editIndustrialTraining/:encId",
        component: EditIndustrialTrainingComponent,
        canActivate: [RoleGuard],
        data: { role: "admin" },
      },
      {
        path: "viewIndustrialTraining",
        component: ViewIndustrialTrainingComponent,
        canActivate: [RoleGuard],
        data: { role: "view" },
      },
      {
        path: "addTrainingAgency",
        component: AddTrainingAgencyComponent,
        canActivate: [RoleGuard],
        data: { role: "admin" },
      },
      {
        path: "editTrainingAgency/:encId",
        component: EditTrainingAgencyComponent,
        canActivate: [RoleGuard],
        data: { role: "admin" },
      },
      {
        path: "viewTrainingAgency",
        component: ViewTrainingAgencyComponent,
        canActivate: [RoleGuard],
        data: { role: "view" },
      },
      {
        path: "addTrainingCategory",
        component: AddTrainingCategoryComponent,
        canActivate: [RoleGuard],
        data: { role: "admin" },
      },
      {
        path: "editTrainingCategory/:encId",
        component: EditTrainingCategoryComponent,
        canActivate: [RoleGuard],
        data: { role: "admin" },
      },
      {
        path: "viewTrainingCategory",
        component: ViewTrainingCategoryComponent,
        canActivate: [RoleGuard],
        data: { role: "view" },
      },
    ],
  },
  {
    path: "deputation",
    component: TeacherComponent,
    children: [
      { path: "", redirectTo: "updateStatus" },
      { path: "updateStatus", component: UpdateDeputationStatusComponent },
      { path: "add/:techId", component: TeacherDeputeComponent },
    ],
  },
  /* for teacher services */
  {
    path: "services",
    component: TeacherComponent,
    children: [
      { path: "", redirectTo: "viewServices" },
      {
        path: "viewServices",
        component: ViewServicesComponent,
        canActivate: [RoleGuard],
        data: { role: "view" },
      },
      {
        path: "viewServices/updateService/:techId",
        component: UpdateServicesComponent,
      },
    ],
  },
  {
    path: "transferRequest",
    component: TeacherComponent,
    children: [
      { path: "", redirectTo: "viewTransferRequest" },
      {
        path: "raiseTransferRequest",
        component: RaiseTransferRequestComponent,
        canActivate: [RoleGuard],
        data: { role: "admin" },
      },
      {
        path: "viewTransferRequest",
        component: ViewTeacherTransferRequestComponent,
      },
      {
        path: "editTransferRequest/:encId",
        component: EditTransferRequestComponent,
      },
    ],
  },
  {
    path: "teacherTransfer",
    component: TeacherComponent,
    children: [
      { path: "", redirectTo: "viewTeacherTransfer" },
      {
        path: "viewTeacherTransfer",
        component: ViewTeacherTransferComponent,
        canActivate: [RoleGuard],
        data: { role: "view" },
      },
    ],
  },
  {
    path: "teacherTransfer/transferRequestSchool",
    component: TeacherComponent,
    children: [
      { path: "", redirectTo: "viewTransferRequestSchool" },
      {
        path: "viewTransferRequestSchool",
        component: ViewTransferRequestSchoolComponent,
      },
      {
        path: "addTransferRequestSchool",
        component: AddTransferRequestSchoolComponent,
      },
    ],
  },
  {
    path: "teacherTransfer/relieving",
    component: TeacherComponent,
    children: [
      { path: "", redirectTo: "viewRelieving" },
      { path: "viewRelieving", component: ViewRelievingComponent },
      { path: "addRelieving", component: AddRelievingComponent },
    ],
  },
  {
    path: "teacherTransfer/joiningSchool",
    component: TeacherComponent,
    children: [
      { path: "", redirectTo: "viewJoiningSchool" },
      { path: "viewJoiningSchool", component: ViewJoiningSchoolComponent },
      { path: "addJoiningSchool", component: AddJoiningSchoolComponent },
    ],
  },
  {
    path: "transferList",
    component: TeacherComponent,
    children: [
      { path: "", redirectTo: "viewTransferList" },
      { path: "viewTransferList", component: ViewTransferListComponent },
    ],
  },
  {
    path: "classTeacherTagging",
    component: TeacherComponent,
    children: [
      { path: "", redirectTo: "viewclassTeacherTagging" },
      {
        path: "viewclassTeacherTagging",
        component: ViewClassTeacherTaggingComponent,
      },
      {
        path: "addclassTeacherTagging",
        component: AddClassTeacherTaggingComponent,
      },
      {
        path: "editclassTeacherTagging/:encId",
        component: EditClassTeacherTaggingComponent,
      },
    ],
  },
  {
    path: "mis",
    component: TeacherComponent,
    children: [
      { path: "", component: ViewTeacherMisComponent },
      { path: "teacherRawReport", component: TeacherRawReportComponent },
      {
        path: "schoolCategoryWise",
        component: SchoolCategoryWiseTeacherReportComponent,
      },
      {
        path: "appointmentTypeWise",
        component: AppointmentTypeWiseTeacherReportComponent,
      },
      {
        path: "natureAppointmentTypeWise",
        component: NatureAppointmentWiseTeacherReportComponent,
      },
      {
        path: "teacherTittleWise",
        component: TeacherTittleWiseReportComponent,
      },
      {
        path: "socialCategoryWiseReport",
        component: SocialCategoryWiseReportComponent,
      },
      { path: "genderWiseReport", component: GenderWiseReportComponent },
      {
        path: "educationalQualiWiseReport",
        component: EducationalQualiWiseReportComponent,
      },
      {
        path: "professionalQualiWiseReport",
        component: ProfessionalQualiWiseReportComponent,
      },
      {
        path: "teacherAttendanceReport",
        component: TeacherAttendanceReportComponent,
      },
    ],
  },
  {
    path: "promotion",
    component: TeacherComponent,
    children: [
      {
        path: "",
        component: PromotionComponent,
      },
      {
        path: "generate/view",
        component: ViewPromotionComponent,
        canActivate: [RoleGuard],
        data: { role: "view", linkType: "TB" },
      },
      {
        path: "generate",
        component: AddPromotionComponent,
        canActivate: [RoleGuard],
        data: { role: "admin", linkType: "TB" },
      },
      {
        path: "schoolView",
        component: SchoolViewComponent,
        canActivate: [RoleGuard],
        data: { role: "view", linkType: "TB" },
      },
      {
        path: "approve",
        component: ApproveComponent,
        canActivate: [RoleGuard],
        data: { role: "admin", linkType: "TB" },
      },
      {
        path: "approve/view",
        component: ViewApprovedListComponent,
        canActivate: [RoleGuard],
        data: { role: "view", linkType: "TB" },
      },
    ],
  },
  {
    path: "",
    component: TeacherComponent,
    children: [
      { path: "", redirectTo: "setApprovalAuthority" },
      {
        path: "setApprovalAuthority",
        component: SetApprovalAuthorityComponent,
        canActivate: [RoleGuard],
        data: { role: "admin" },
      },
      {
        path: "setApprovalAuthority/viewApprovalAuthority",
        component: ViewApprovalAuthorityComponent,
        canActivate: [RoleGuard],
        data: { role: "view" },
      },
    ],
  },
  {
    path: "teacherTransferByBlock",
    component: TeacherComponent,
    children: [
      { path: "", redirectTo: "viewTransferRequestBlock" },
      {
        path: "viewTransferRequestBlock",
        component: ViewTransferRequestBlockComponent,
      },
    ],
  },
  {
    path: "departmentNotification",
    component: TeacherComponent,
    children: [
      { path: "", redirectTo: "viewNotification" },
      { path: "viewNotification", component: ViewNotificationComponent },
      {
        path: "addNotification",
        component: AddNotificationComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TeacherRoutingModule {}
