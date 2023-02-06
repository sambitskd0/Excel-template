import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker'

import { ManageHolidayRoutingModule } from './manage-holiday-routing.module';
import { HolidayCalenderComponent } from './holidayCalender/holiday-calender.component';
import { HolidayComponent } from './holiday.component';
import { ViewHolidayComponent } from './setHoliday/view-holiday.component';
import { AddHolidayComponent } from './setHoliday/add-holiday/add-holiday.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DataTablesModule } from 'angular-datatables';
import { EditHolidayComponent } from './setHoliday/edit-holiday/edit-holiday.component';
import { AngularHolidayPlannerModule } from 'angular-holiday-planner';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from '@angular/material/button';
import { AngularMaterialModule } from "src/app/shared/modules/angular-material.module";
import { NgxPaginationModule } from 'ngx-pagination';
@NgModule({
  declarations: [
    HolidayCalenderComponent,
    HolidayComponent,
    ViewHolidayComponent,
    AddHolidayComponent,
    EditHolidayComponent,
  ],
  imports: [
    CommonModule,
    ManageHolidayRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    DataTablesModule,
    BsDatepickerModule.forRoot(),
    AngularHolidayPlannerModule,
    MatIconModule,
    MatToolbarModule,
    MatButtonModule,
    AngularMaterialModule,
    NgxPaginationModule
  ]
})
export class ManageHolidayModule { }
