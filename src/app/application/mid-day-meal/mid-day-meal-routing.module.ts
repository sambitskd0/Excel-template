import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RoleGuard } from 'src/app/core/guards/role.guard';
import { AddMdmAttendanceComponent } from './manageAttendance/add-mdm-attendance/add-mdm-attendance.component';
import { ViewMdmAttendanceComponent } from './manageAttendance/view-mdm-attendance.component';
import { AddMdmDailyMenuComponent } from './manageDailyMenu/add-mdm-daily-menu/add-mdm-daily-menu.component';
import { EditMdmDailyMenuComponent } from './manageDailyMenu/edit-mdm-daily-menu/edit-mdm-daily-menu.component';
import { ViewMdmDailyMenuComponent } from './manageDailyMenu/view-mdm-daily-menu.component';
import { AddMdmItemsComponent } from './manageItems/add-mdm-items/add-mdm-items.component';
import { EditMdmItemsComponent } from './manageItems/edit-mdm-items/edit-mdm-items.component';
import { ViewMdmItemsComponent } from './manageItems/view-mdm-items.component';
import { UpdateOpeningStockComponent } from './manageStock/update-opening-stock/update-opening-stock.component';
import { UpdateStockComponent } from './manageStock/update-stock/update-stock.component';
import { ViewStockComponent } from './manageStock/view-stock.component';
import { StockReportComponent } from './manageStockReport/stock-report.component';
import { AddStudentExpensesComponent } from './manageStudentExpenses/add-student-expenses/add-student-expenses.component';
import { EditStudentExpensesComponent } from './manageStudentExpenses/edit-student-expenses/edit-student-expenses.component';
import { ViewStudentExpensesComponent } from './manageStudentExpenses/view-student-expenses.component';
import { MidDayMealComponent } from './mid-day-meal.component';
import { DailyConsumptionReportComponent } from './manageDailyConsReport/daily-consumption-report.component';

const routes: Routes = [
  {path:"", component:MidDayMealComponent},
  {
    path: 'manageItems',
    component: MidDayMealComponent,
    children: [
      { path: '', redirectTo: 'viewMdmItems' },
      { path: 'addMdmItems', component: AddMdmItemsComponent,canActivate: [RoleGuard], data: {role: 'admin'} },
      { path: 'editMdmItems/:encId', component: EditMdmItemsComponent,canActivate: [RoleGuard], data: {role: 'admin'} },
      { path: 'viewMdmItems', component: ViewMdmItemsComponent,canActivate: [RoleGuard], data: {role: 'view'} },
    ],
  },
  {path:"", component:MidDayMealComponent},
  {
    path: 'manageDailyMenu',
    component: MidDayMealComponent,
    children: [
      { path: '', redirectTo: 'viewDailyMenu' },
      { path: 'addDailyMenu', component: AddMdmDailyMenuComponent,canActivate: [RoleGuard], data: {role: 'admin'} },
      { path: 'editDailyMenu/:encId', component: EditMdmDailyMenuComponent,canActivate: [RoleGuard], data: {role: 'admin'} },
      { path: 'viewDailyMenu', component: ViewMdmDailyMenuComponent,canActivate: [RoleGuard], data: {role: 'view'} },
    ],
  },
  {path:"", component:MidDayMealComponent},
  {
    path: 'manageStudentExpenses',
    component: MidDayMealComponent,
    children: [
      { path: '', redirectTo: 'viewStudentExpenses' },
      { path: 'addStudentExpenses', component: AddStudentExpensesComponent,canActivate: [RoleGuard], data: {role: 'admin'} },
      { path: 'editStudentExpenses/:encId', component: EditStudentExpensesComponent,canActivate: [RoleGuard], data: {role: 'admin'} },
      { path: 'viewStudentExpenses', component: ViewStudentExpensesComponent,canActivate: [RoleGuard], data: {role: 'view'} },
    ],
  },
  {path:"", component:MidDayMealComponent},
  {
    path: 'manageStock',
    component: MidDayMealComponent,
    children: [
      { path: '', redirectTo: 'updateOpeningStock' },
      { path: 'updateOpeningStock', component: UpdateOpeningStockComponent,canActivate: [RoleGuard], data: {role: 'admin'} },
      { path: 'updateStock', component: UpdateStockComponent,canActivate: [RoleGuard], data: {role: 'admin'} },
      { path: 'viewStock', component: ViewStockComponent,canActivate: [RoleGuard], data: {role: 'view'} },
    ],
  },
  {path:"", component:MidDayMealComponent},
  {
    path: 'manageMDMAttendance',
    component: MidDayMealComponent,
    children: [
      { path: '', redirectTo: 'viewMdmAttendance' },
      { path: 'addMdmAttendance', component: AddMdmAttendanceComponent,canActivate: [RoleGuard], data: {role: 'admin'} },
      { path: 'viewMdmAttendance', component: ViewMdmAttendanceComponent,canActivate: [RoleGuard], data: {role: 'view'} },
    ],
  },
  {path:"", component:MidDayMealComponent},
  {
    path: 'manageStockReport',
    component: MidDayMealComponent,
    children: [
      { path: '', redirectTo: 'viewStockReport' },
      { path: 'viewStockReport', component: StockReportComponent,canActivate: [RoleGuard], data: {role: 'view'}},
    ],
  },
  {path:"", component:MidDayMealComponent},
  {
    path: 'manageConsumptionReport',
    component: MidDayMealComponent,
    children: [
      { path: '', redirectTo: 'viewDailyConsumptionReport' },
      { path: 'viewDailyConsumptionReport', component: DailyConsumptionReportComponent,canActivate: [RoleGuard], data: {role: 'view'}},
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MidDayMealRoutingModule { }
