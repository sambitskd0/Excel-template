import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { RoleGuard } from "src/app/core/guards/role.guard";
import { GrantFundComponent } from "./grant-fund.component";
import { AddExpenditureTypeComponent } from "./manageExpenditureType/add-expenditure-type/add-expenditure-type.component";
import { EditExpenditureTypeComponent } from "./manageExpenditureType/edit-expenditure-type/edit-expenditure-type.component";
import { ViewExpenditureTypeComponent } from "./manageExpenditureType/view-expenditure-type.component";
import { AddGrantConfigurationComponent } from "./manageGrantConfiguration/add-grant-configuration/add-grant-configuration.component";
import { EditGrantConfigurationComponent } from "./manageGrantConfiguration/edit-grant-configuration/edit-grant-configuration.component";
import { ViewGrantConfigurationComponent } from "./manageGrantConfiguration/view-grant-configuration.component";
import { AddGrantExpenditureComponent } from "./manageGrantExpenditure/add-grant-expenditure/add-grant-expenditure.component";
import { CheckBalanceComponent } from "./manageGrantExpenditure/check-balance/check-balance.component";
import { EditGrantExpenditureComponent } from "./manageGrantExpenditure/edit-grant-expenditure/edit-grant-expenditure.component";
import { ViewGrantExpenditureComponent } from "./manageGrantExpenditure/view-grant-expenditure.component";
import { AddGrantInfoComponent } from "./manageGrantInfo/add-grant-info/add-grant-info.component";
import { EditGrantInfoComponent } from "./manageGrantInfo/edit-grant-info/edit-grant-info.component";
import { ViewGrantInfoComponent } from "./manageGrantInfo/view-grant-info.component";
import { AddGrantReceiveComponent } from "./manageGrantReceive/add-grant-receive/add-grant-receive.component";
import { EditGrantReceiveComponent } from "./manageGrantReceive/edit-grant-receive/edit-grant-receive.component";
import { ViewGrantReceiveComponent } from "./manageGrantReceive/view-grant-receive.component";
import { AddGrantTypeComponent } from "./manageGrantType/add-grant-type/add-grant-type.component";
import { EditGrantTypeComponent } from "./manageGrantType/edit-grant-type/edit-grant-type.component";
import { ViewGrantTypeComponent } from "./manageGrantType/view-grant-type.component";
import { TemplateComponent } from "./template/template.component";

const routes: Routes = [
  {
    path: "",
    component: GrantFundComponent,
    canActivate: [RoleGuard],
    data: { role: "admin" },
  },
  {
    path: "manageGrantType",
    component: GrantFundComponent,
    children: [
      { path: "", redirectTo: "viewGrantType" },
      {
        path: "addGrantType",
        component: AddGrantTypeComponent,
        canActivate: [RoleGuard],
        data: { role: "admin" },
      },
      {
        path: "editGrantType/:encId",
        component: EditGrantTypeComponent,
        canActivate: [RoleGuard],
        data: { role: "admin" },
      },
      {
        path: "viewGrantType",
        component: ViewGrantTypeComponent,
        canActivate: [RoleGuard],
        data: { role: "view" },
      },
    ],
  },
  {
    path: "manageExpenditureType",
    component: GrantFundComponent,
    children: [
      { path: "", redirectTo: "viewExpenditureType" },
      {
        path: "addExpenditureType",
        component: AddExpenditureTypeComponent,
        canActivate: [RoleGuard],
        data: { role: "admin" },
      },
      {
        path: "editExpenditureType/:encId",
        component: EditExpenditureTypeComponent,
        canActivate: [RoleGuard],
        data: { role: "admin" },
      },
      {
        path: "viewExpenditureType",
        component: ViewExpenditureTypeComponent,
        canActivate: [RoleGuard],
        data: { role: "view" },
      },
    ],
  },
  {
    path: "manageGrantConfiguration",
    component: GrantFundComponent,
    children: [
      { path: "", redirectTo: "viewGrantConfiguration" },
      {
        path: "addGrantConfiguration",
        component: AddGrantConfigurationComponent,
        canActivate: [RoleGuard],
        data: { role: "admin" },
      },
      {
        path: "editGrantConfiguration/:encId",
        component: EditGrantConfigurationComponent,
        canActivate: [RoleGuard],
        data: { role: "admin" },
      },
      {
        path: "viewGrantConfiguration",
        component: ViewGrantConfigurationComponent,
        canActivate: [RoleGuard],
        data: { role: "view" },
      },
    ],
  },
  {
    path: "manageGrantInfo",
    component: GrantFundComponent,
    children: [
      { path: "", redirectTo: "viewGrantInfo" },
      {
        path: "addGrantInfo",
        component: AddGrantInfoComponent,
        canActivate: [RoleGuard],
        data: { role: "admin" },
      },
      {
        path: "editGrantInfo/:encId",
        component: EditGrantInfoComponent,
        canActivate: [RoleGuard],
        data: { role: "admin" },
      },
      {
        path: "viewGrantInfo",
        component: ViewGrantInfoComponent,
        canActivate: [RoleGuard],
        data: { role: "view" },
      },
    ],
  },
  {
    path: "manageGrantReceive",
    component: GrantFundComponent,
    children: [
      { path: "", redirectTo: "viewGrantReceive" },
      {
        path: "addGrantReceive",
        component: AddGrantReceiveComponent,
        canActivate: [RoleGuard],
        data: { role: "admin" },
      },
      {
        path: "editGrantReceive/:encId",
        component: EditGrantReceiveComponent,
        canActivate: [RoleGuard],
        data: { role: "admin" },
      },
      {
        path: "viewGrantReceive",
        component: ViewGrantReceiveComponent,
        canActivate: [RoleGuard],
        data: { role: "view" },
      },
    ],
  },
  {
    path: "manageGrantExpenditure",
    component: GrantFundComponent,
    children: [
      { path: "", redirectTo: "viewGrantExpenditure" },
      {
        path: "addGrantExpenditure",
        component: AddGrantExpenditureComponent,
        canActivate: [RoleGuard],
        data: { role: "admin" },
      },
      {
        path: "editGrantExpenditure/:encId",
        component: EditGrantExpenditureComponent,
        canActivate: [RoleGuard],
        data: { role: "admin" },
      },
      {
        path: "viewGrantExpenditure",
        component: ViewGrantExpenditureComponent,
        canActivate: [RoleGuard],
        data: { role: "view" },
      },
      {
        path: "checkBalance",
        component: CheckBalanceComponent,
        canActivate: [RoleGuard],
        data: { role: "view" },
      },
    ],
  },
  {
    path: "template",
    component: GrantFundComponent,
    children: [
      { path: "", redirectTo: "generate" },
      {
        path: "generate",
        component: TemplateComponent,
        canActivate: [RoleGuard],
        data: { role: "admin" },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GrantFundRoutingModule {}
