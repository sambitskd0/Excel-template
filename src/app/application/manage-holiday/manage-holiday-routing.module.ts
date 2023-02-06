import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HolidayComponent } from './holiday.component';
import { RoleGuard } from 'src/app/core/guards/role.guard';
import { ViewHolidayComponent } from './setHoliday/view-holiday.component';
import { AddHolidayComponent } from './setHoliday/add-holiday/add-holiday.component';
import { HolidayCalenderComponent } from './holidayCalender/holiday-calender.component';
import { EditHolidayComponent } from './setHoliday/edit-holiday/edit-holiday.component';

const routes: Routes = [
  {path:"", component:HolidayComponent, canActivate: [RoleGuard], data: {role: 'admin'} }, 
  {
    path: 'setHoliday',
    component: HolidayComponent,
    children: [
      { path: '', redirectTo: 'viewHoliday'},
      { path: 'addHoliday', component: AddHolidayComponent, canActivate: [RoleGuard], data: {role: 'admin'} },
      { path: 'editHoliday/:encId', component: EditHolidayComponent, canActivate: [RoleGuard], data: {role: 'view'} },
      { path: 'viewHoliday', component: ViewHolidayComponent, canActivate: [RoleGuard], data: {role: 'view'} },
    ],
  },
  {
    path: 'calender',
    component: HolidayComponent,
    children: [
      { path: '', component:HolidayCalenderComponent, canActivate: [RoleGuard], data: {role: 'view'} },
    ],
  },
  //{ path:"calender", component:HolidayCalenderComponent, canActivate: [RoleGuard], data: {role: 'view'} },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManageHolidayRoutingModule { }
