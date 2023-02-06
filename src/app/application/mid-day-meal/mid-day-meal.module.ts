import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MidDayMealRoutingModule } from './mid-day-meal-routing.module';
import { MidDayMealComponent } from './mid-day-meal.component';
import { ViewMdmItemsComponent } from './manageItems/view-mdm-items.component';
import { AddMdmItemsComponent } from './manageItems/add-mdm-items/add-mdm-items.component';
import { EditMdmItemsComponent } from './manageItems/edit-mdm-items/edit-mdm-items.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DataTablesModule } from 'angular-datatables';
import { NgxPaginationModule } from 'ngx-pagination';
import { ViewMdmDailyMenuComponent } from './manageDailyMenu/view-mdm-daily-menu.component';
import { AddMdmDailyMenuComponent } from './manageDailyMenu/add-mdm-daily-menu/add-mdm-daily-menu.component';
import { EditMdmDailyMenuComponent } from './manageDailyMenu/edit-mdm-daily-menu/edit-mdm-daily-menu.component';
import { ViewStudentExpensesComponent } from './manageStudentExpenses/view-student-expenses.component';
import { AddStudentExpensesComponent } from './manageStudentExpenses/add-student-expenses/add-student-expenses.component';
import { EditStudentExpensesComponent } from './manageStudentExpenses/edit-student-expenses/edit-student-expenses.component';
import { AngularMaterialModule } from 'src/app/shared/modules/angular-material.module';
import { ViewStockComponent } from './manageStock/view-stock.component';
import { UpdateOpeningStockComponent } from './manageStock/update-opening-stock/update-opening-stock.component';
import { UpdateStockComponent } from './manageStock/update-stock/update-stock.component';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { AddMdmAttendanceComponent } from './manageAttendance/add-mdm-attendance/add-mdm-attendance.component';
import { ViewMdmAttendanceComponent } from './manageAttendance/view-mdm-attendance.component';
import { StockReportComponent } from './manageStockReport/stock-report.component';
import { DailyConsumptionReportComponent } from './manageDailyConsReport/daily-consumption-report.component';


@NgModule({
  declarations: [
    MidDayMealComponent,
    ViewMdmItemsComponent,
    AddMdmItemsComponent,
    EditMdmItemsComponent,
    ViewMdmDailyMenuComponent,
    AddMdmDailyMenuComponent,
    EditMdmDailyMenuComponent,
    ViewStudentExpensesComponent,
    AddStudentExpensesComponent,
    EditStudentExpensesComponent,
    ViewStockComponent,
    UpdateOpeningStockComponent,
    UpdateStockComponent,
    AddMdmAttendanceComponent,
    ViewMdmAttendanceComponent,
    StockReportComponent,
    DailyConsumptionReportComponent,
    
  ],
  imports: [
    CommonModule,
    MidDayMealRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    FormsModule,
    NgxPaginationModule,
    DataTablesModule,
    AngularMaterialModule,
    BsDatepickerModule.forRoot()
  ]
})
export class MidDayMealModule { }
