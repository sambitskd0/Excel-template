import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ApplicationRoutingModule } from "./application-routing.module";
import { ApplicationComponent } from "./application.component";
import { HeaderComponent } from "./header/header.component";
import { FooterComponent } from "./footer/footer.component";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { SidenavComponent } from "./sidenav/sidenav.component";
import { RouterModule } from "@angular/router";
import { DashboardlandingComponent } from "./dashboard/dashboardlanding/dashboardlanding.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { LogoutComponent } from "./header/logout/logout.component";
import { BsDatepickerModule } from "ngx-bootstrap/datepicker";
import { ChangePasswordComponent } from "./change-password/change-password.component";
import { MyprofileComponent } from "./myprofile/myprofile.component";

import { DashboardDetailsComponent } from "./dashboard/dashboard-details/dashboard-details.component";
import { ClasswiseDetailsComponent } from "./dashboard/dashboard-details/highchart/classwise-details/classwise-details.component";
import { GenderwiseDetailsComponent } from "./dashboard/dashboard-details/highchart/genderwise-details/genderwise-details.component";
import { MdmServedComponent } from "./dashboard/dashboard-details/highchart/mdm-served/mdm-served.component";
import { MdmStudentAttendanceComponent } from "./dashboard/dashboard-details/highchart/mdm-student-attendance/mdm-student-attendance.component";
import { SchoolCategoryWiseDetailsComponent } from "./dashboard/dashboard-details/highchart/school-category-wise-details/school-category-wise-details.component";
import { SchoolManagementWiseDetailsComponent } from "./dashboard/dashboard-details/highchart/school-management-wise-details/school-management-wise-details.component";
import { SocialCategoryWiseStudentComponent } from "./dashboard/dashboard-details/highchart/social-category-wise-student/social-category-wise-student.component";
import { TeacherAppointmentTypeComponent } from "./dashboard/dashboard-details/highchart/teacher-appointment-type/teacher-appointment-type.component";
import { TeacherNatureAppointmentComponent } from "./dashboard/dashboard-details/highchart/teacher-nature-appointment/teacher-nature-appointment.component";
import { StudentMdmComponent } from './dashboard/dashboard-details/highchart/student-mdm/student-mdm.component';
import { TeacherMdmComponent } from './dashboard/dashboard-details/highchart/teacher-mdm/teacher-mdm.component';
import { PublicGrievanceComponent } from './public-grievance/public-grievance.component'; 

@NgModule({
  declarations: [
    ApplicationComponent,
    HeaderComponent,
    FooterComponent,
    DashboardComponent,
    SidenavComponent,
    DashboardlandingComponent,
    LogoutComponent,
    ChangePasswordComponent,
    MyprofileComponent,
    DashboardDetailsComponent,
    ClasswiseDetailsComponent,
    GenderwiseDetailsComponent,
    MdmServedComponent,
    MdmStudentAttendanceComponent,
    SchoolCategoryWiseDetailsComponent,
    SchoolManagementWiseDetailsComponent,
    SocialCategoryWiseStudentComponent,
    TeacherAppointmentTypeComponent,
    TeacherNatureAppointmentComponent,
    StudentMdmComponent,
    TeacherMdmComponent,
    PublicGrievanceComponent, 
  ],
  imports: [
    CommonModule,
    ApplicationRoutingModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    BsDatepickerModule.forRoot(),
  ],
  providers: [],
})
export class ApplicationModule {}
