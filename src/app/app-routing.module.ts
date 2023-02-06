import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { LoginComponent } from "./login/login.component";
import { DashboardComponent } from "./application/dashboard/dashboard.component";
import { AuthGuardService } from "./core/guards/auth-guard.service";
import { PageNotFoundComponent } from "./shared/components/page-not-found/page-not-found.component";
import { ForgotpasswordComponent } from "./login/forgotpassword/forgotpassword.component";
import { ResetpasswordComponent } from "./login/resetpassword/resetpassword.component";
import { PublicGrievanceComponent } from "./application/public-grievance/public-grievance.component";

const routes: Routes = [
  { path: "", redirectTo: "login", pathMatch: "full" },
  { path: "login", component: LoginComponent },
  { path: "forgotPwd", component: ForgotpasswordComponent },
  { path: "publicgrivance", component: PublicGrievanceComponent },
  { path: "resetPwd/:id", component: ResetpasswordComponent },

  {
    path: "Application",
    loadChildren: () =>
      import("./application/application.module").then(
        (m) => m.ApplicationModule
      ),
    canActivate: [AuthGuardService],
  },

  {
    path: "MobileApp",
    loadChildren: () =>
      import("./mobileApp/mobile-app.module").then(
        (module) => module.MobileAppModule
      ),
  },

  { path: "**", component: PageNotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
