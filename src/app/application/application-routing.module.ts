import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AuthGuardService } from "../core/guards/auth-guard.service";
import { ApplicationComponent } from "./application.component";
import { ChangePasswordComponent } from "./change-password/change-password.component";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { DashboardlandingComponent } from "./dashboard/dashboardlanding/dashboardlanding.component";
import { MyprofileComponent } from "./myprofile/myprofile.component";
import { DashboardDetailsComponent } from "./dashboard/dashboard-details/dashboard-details.component";
// import { StaffComponent } from './application/staff/staff.component';

const routes: Routes = [
  {
    path: "",
    component: ApplicationComponent,
    children: [
      {
        path: "",
        redirectTo: "dashboardlanding",
        pathMatch: "full",
      },
      {
        path: "dashboard",
        component: DashboardComponent,
        canActivate: [AuthGuardService],
      },
      {
        path: "dashboardlanding",
        component: DashboardlandingComponent,
        canActivate: [AuthGuardService],
      },
      {
        path: "dashboardDetails",
        component: DashboardDetailsComponent,
        canActivate: [AuthGuardService],
      },
      {
        path: "myProfile",
        component: MyprofileComponent,
        canActivate: [AuthGuardService],
      },
      {
        path: "changePassword",
        component: ChangePasswordComponent,
        canActivate: [AuthGuardService],
      },
      {
        path: "master",
        loadChildren: () =>
          import("./master/master.module").then((m) => m.MasterModule),
        canActivate: [AuthGuardService],
      },
      {
        path: "school",
        loadChildren: () =>
          import("./school/school.module").then((m) => m.SchoolModule),
        canActivate: [AuthGuardService],
      },
      {
        path: "teacher",
        loadChildren: () =>
          import("./teacher/teacher.module").then((m) => m.TeacherModule),
        canActivate: [AuthGuardService],
      },
      {
        path: "grievance",
        loadChildren: () =>
          import("./grievance/grievance.module").then((m) => m.GrievanceModule),
        canActivate: [AuthGuardService],
      },
      {
        path: "user",
        loadChildren: () =>
          import("./user/user.module").then((m) => m.UserModule),
        canActivate: [AuthGuardService],
      },
      {
        path: "training",
        loadChildren: () =>
          import("./training/training.module").then((m) => m.TrainingModule),
        canActivate: [AuthGuardService],
      },
      {
        path: "incentive",
        loadChildren: () =>
          import("./incentive/incentive.module").then((m) => m.IncentiveModule),
        canActivate: [AuthGuardService],
      },
      {
        path: "midDayMeal",
        loadChildren: () =>
          import("./mid-day-meal/mid-day-meal.module").then(
            (m) => m.MidDayMealModule
          ),
        canActivate: [AuthGuardService],
      },
      {
        path: "student",
        loadChildren: () =>
          import("./student/student.module").then((m) => m.StudentModule),
        canActivate: [AuthGuardService],
      },
      {
        path: "holiday",
        loadChildren: () =>
          import("./manage-holiday/manage-holiday.module").then(
            (m) => m.ManageHolidayModule
          ),
        canActivate: [AuthGuardService],
      },
      {
        path: "leave",
        loadChildren: () =>
          import("./leave/leave.module").then((m) => m.LeaveModule),
        canActivate: [AuthGuardService],
      },
      {
        path: "questionBank",
        loadChildren: () =>
          import("./question-bank/question-bank.module").then(
            (m) => m.QuestionBankModule
          ),
        canActivate: [AuthGuardService],
      },
      {
        path: "grantFund",
        loadChildren: () =>
          import("./grant-fund/grant-fund.module").then(
            (m) => m.GrantFundModule
          ),
        canActivate: [AuthGuardService],
      },
      {
        path: "balpanji",
        loadChildren: () =>
          import("./bal-panji/bal-panji.module").then((m) => m.BalPanjiModule),
        canActivate: [AuthGuardService],
      },
      {
        path: "inventory",
        loadChildren: () =>
          import("./inventory/inventory.module").then((m) => m.InventoryModule),
      },
      {
        path: "committee",
        loadChildren: () =>
          import("./committee/committee.module").then((m) => m.CommitteeModule),
        canActivate: [AuthGuardService],
      },
      {
        path: "inspection",
        loadChildren: () =>
          import("./inspection/inspection.module").then(
            (m) => m.InspectionModule
          ),
        canActivate: [AuthGuardService],
      },
      {
        path: "notification",
        loadChildren: () =>
          import("./notification/notification.module").then(
            (m) => m.NotificationModule
          ),
        canActivate: [AuthGuardService],
      },
      
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ApplicationRoutingModule {}
