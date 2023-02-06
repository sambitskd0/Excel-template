import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { TeacherRoutingModule } from "./teacher-routing.module";
import { TeacherComponent } from "./teacher.component";
import { ViewTeacherComponent } from "./teacherRegistration/view-teacher.component";
import { AddTeacherComponent } from "./teacherRegistration/add-teacher/add-teacher.component";
import { EditTeacherComponent } from "./teacherRegistration/edit-teacher/edit-teacher.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { DataTablesModule } from "angular-datatables";
import { EducationalInfoComponent } from "./teacherRegistration/educational-info/educational-info.component";
import { PreServiceComponent } from "./teacherRegistration/educational-info/pre-service/pre-service.component";
import { InServiceComponent } from "./teacherRegistration/educational-info/in-service/in-service.component";
import { ProfessionalInfoComponent } from "./teacherRegistration/professional-info/professional-info.component";
import { RegistrationInfoComponent } from "./teacherRegistration/registration-info/registration-info.component";
import { MaskPipe } from "src/app/shared/pipes/mask.pipe";
import { OtherInfoComponent } from "./teacherRegistration/other-info/other-info.component";

import { TrainingAndLanguageInfoComponent } from "./teacherRegistration/training-and-language-info/training-and-language-info.component";
import { HeaderComponent } from "./teacherRegistration/header/header.component";
import { MobilePanPipe } from "src/app/shared/pipes/mobile-pan.pipe";
import { SalaryInfoComponent } from "./teacherRegistration/salary-info/salary-info.component";
import { AppointedComponent } from "./teacherRegistration/salary-info/appointed/appointed.component";
import { ViewRegistrationInfoComponent } from "./teacherRegistration/view-registration-info/view-registration-info.component";
import { ViewEducationInfoComponent } from "./teacherRegistration/view-education-info/view-education-info.component";
import { ViewProfessionalInfoComponent } from "./teacherRegistration/view-professional-info/view-professional-info.component";
import { ViewOtherInfoComponent } from "./teacherRegistration/view-other-info/view-other-info.component";
import { ViewTrainingAndLanguageInfoComponent } from "./teacherRegistration/view-training-and-language-info/view-training-and-language-info.component";
import { NotAppointedComponent } from "./teacherRegistration/salary-info/not-appointed/not-appointed.component";
import { ViewIndustrialTrainingComponent } from "./industrialTraining/view-industrial-training.component";
import { AddIndustrialTrainingComponent } from "./industrialTraining/add-industrial-training/add-industrial-training.component";
import { EditIndustrialTrainingComponent } from "./industrialTraining/edit-industrial-training/edit-industrial-training.component";
import { ViewTrainingAgencyComponent } from "./industrialTraining/view-training-agency/view-training-agency.component";
import { AddTrainingAgencyComponent } from "./industrialTraining/add-training-agency/add-training-agency.component";
import { EditTrainingAgencyComponent } from "./industrialTraining/edit-training-agency/edit-training-agency.component";
import { ViewTrainingCategoryComponent } from "./industrialTraining/view-training-category/view-training-category.component";
import { AddTrainingCategoryComponent } from "./industrialTraining/add-training-category/add-training-category.component";
import { EditTrainingCategoryComponent } from "./industrialTraining/edit-training-category/edit-training-category.component";

import { ServiceInfoComponent } from "./teacherRegistration/service-info/service-info.component";
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

import { NgMultiSelectDropDownModule } from "ng-multiselect-dropdown";
import { AngularMaterialModule } from "src/app/shared/modules/angular-material.module";
import { EditTransferRequestComponent } from "./transferRequest/edit-transfer-request/edit-transfer-request.component";
import { NgxPaginationModule } from "ngx-pagination";

// import { MatDatepickerModule } from '@angular/material/datepicker';
// import { MatNativeDateModule } from '@angular/material/core';
// import { MatFormFieldModule } from '@angular/material/form-field';
// import { MatInputModule } from '@angular/material/input';

import { BsDatepickerModule } from "ngx-bootstrap/datepicker";
import { ViewChangeRequestApplicationComponent } from "./teacherRegistration/view-change-request-application/view-change-request-application.component";
import { ViewServiceInfoComponent } from "./teacherRegistration/view-service-info/view-service-info.component";
import { ViewSalaryInfoComponent } from "./teacherRegistration/view-salary-info/view-salary-info.component";
import { ViewClassTeacherTaggingComponent } from "./classTeacherTagging/view-class-teacher-tagging.component";
import { AddClassTeacherTaggingComponent } from "./classTeacherTagging/add-class-teacher-tagging/add-class-teacher-tagging.component";
import { EditClassTeacherTaggingComponent } from "./classTeacherTagging/edit-class-teacher-tagging/edit-class-teacher-tagging.component";
import { ViewTeacherMisComponent } from "./teacherMis/view-teacher-mis.component";
import { TeacherRawReportComponent } from "./teacherMis/teacher-raw-report/teacher-raw-report.component";
import { SchoolCategoryWiseTeacherReportComponent } from "./teacherMis/school-category-wise-teacher-report/school-category-wise-teacher-report.component";
import { AppointmentTypeWiseTeacherReportComponent } from "./teacherMis/appointment-type-wise-teacher-report/appointment-type-wise-teacher-report.component";

import { UpdateDeputationStatusComponent } from "./teacherDeputation/update-deputation-status/update-deputation-status.component";
import { TeacherDeputeComponent } from "./teacherDeputation/teacher-depute/teacher-depute.component";
import { AddPromotionComponent } from "./promotion/generatePromotion/add-promotion/add-promotion.component";
import { ViewPromotionComponent } from "./promotion/generatePromotion/view-promotion.component";
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
import { ViewApprovedListComponent } from './promotion/approvePromotion/view-approved-list.component';
import { ApproveComponent } from './promotion/approvePromotion/approve/approve.component';
import { PromotionDetailsModalComponent } from './promotion/generatePromotion/promotion-details-modal/promotion-details-modal.component';
import { ViewTransferRequestBlockComponent } from "./teacherTransferByBlock/view-transfer-request-block.component";
import { PromotionComponent } from './promotion/promotion.component';
import { ViewNotificationComponent } from "./departmentNotification/view-notification.component";
import { AddNotificationComponent } from "./departmentNotification/add-notification/add-notification.component";

@NgModule({
  declarations: [
    ViewTeacherComponent,
    TeacherComponent,
    AddTeacherComponent,
    EditTeacherComponent,
    EducationalInfoComponent,
    PreServiceComponent,
    InServiceComponent,
    ProfessionalInfoComponent,
    RegistrationInfoComponent,
    MaskPipe,
    OtherInfoComponent,
    TrainingAndLanguageInfoComponent,
    HeaderComponent,
    MobilePanPipe,
    SalaryInfoComponent,
    AppointedComponent,
    ViewRegistrationInfoComponent,
    ViewEducationInfoComponent,
    ViewProfessionalInfoComponent,
    ViewOtherInfoComponent,
    ViewTrainingAndLanguageInfoComponent,
    NotAppointedComponent,
    ViewIndustrialTrainingComponent,
    AddIndustrialTrainingComponent,
    EditIndustrialTrainingComponent,
    ViewTrainingAgencyComponent,
    AddTrainingAgencyComponent,
    EditTrainingAgencyComponent,
    ViewTrainingCategoryComponent,
    AddTrainingCategoryComponent,
    EditTrainingCategoryComponent,
    ViewTrainingAndLanguageInfoComponent,
    NotAppointedComponent,
    ServiceInfoComponent,
    ViewServicesComponent,
    UpdateServicesComponent,
    ViewTeacherTransferRequestComponent,
    RaiseTransferRequestComponent,
    ViewTeacherTransferComponent,
    ViewTransferListComponent,
    ViewTransferRequestSchoolComponent,
    AddTransferRequestSchoolComponent,
    ViewRelievingComponent,
    AddRelievingComponent,
    ViewJoiningSchoolComponent,
    AddJoiningSchoolComponent,
    EditTransferRequestComponent,
    ViewChangeRequestApplicationComponent,
    ViewServiceInfoComponent,
    ViewSalaryInfoComponent,
    ViewClassTeacherTaggingComponent,
    AddClassTeacherTaggingComponent,
    EditClassTeacherTaggingComponent,
    ViewTeacherMisComponent,
    TeacherRawReportComponent,
    SchoolCategoryWiseTeacherReportComponent,
    AppointmentTypeWiseTeacherReportComponent,

    UpdateDeputationStatusComponent,
    TeacherDeputeComponent,
    AddPromotionComponent,
    ViewPromotionComponent,
    NatureAppointmentWiseTeacherReportComponent,
    TeacherTittleWiseReportComponent,
    SocialCategoryWiseReportComponent,
    GenderWiseReportComponent,
    EducationalQualiWiseReportComponent,
    ProfessionalQualiWiseReportComponent,
    SetApprovalAuthorityComponent,
    ViewApprovalAuthorityComponent,
    TeacherAttendanceReportComponent,
    SchoolViewComponent,
    ViewApprovedListComponent,
    ApproveComponent,
    PromotionDetailsModalComponent,
    ViewTransferRequestBlockComponent,
    PromotionComponent,
    ViewNotificationComponent,
    AddNotificationComponent
  ],
  imports: [
    CommonModule,
    TeacherRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    DataTablesModule,
    NgMultiSelectDropDownModule.forRoot(),
    AngularMaterialModule,
    NgxPaginationModule,
    BsDatepickerModule.forRoot(), 
  ],
})
export class TeacherModule {}
