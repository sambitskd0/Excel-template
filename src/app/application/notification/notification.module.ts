import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NotificationRoutingModule } from './notification-routing.module';
import { NotificationComponent } from './notification.component';

import { AddOfficerNotificationComponent } from './officerNotification/add-officer-notification/add-officer-notification.component';
import { AngularMaterialModule } from 'src/app/shared/modules/angular-material.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ViewOfficerNotificationComponent } from './officerNotification/view-officer-notification.component';
import { ViewSchoolTeacherNotificationComponent } from './schoolTeacherNotification/view-school-teacher-notification.component';
import { AddSchoolTeacherNotificationComponent } from './schoolTeacherNotification/add-school-teacher-notification/add-school-teacher-notification.component';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { EditOfficerNotificationComponent } from './officerNotification/edit-officer-notification/edit-officer-notification.component';
import { EditSchoolTeacherNotificationComponent } from './schoolTeacherNotification/edit-school-teacher-notification/edit-school-teacher-notification.component';
import { ViewPortalNotificationComponent } from './portalInbox/view-portal-notification.component';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';



@NgModule({
  declarations: [
    NotificationComponent,
    AddOfficerNotificationComponent,
    ViewOfficerNotificationComponent,
    ViewSchoolTeacherNotificationComponent,
    AddSchoolTeacherNotificationComponent,
    EditOfficerNotificationComponent,
    EditSchoolTeacherNotificationComponent,
    ViewPortalNotificationComponent
  ],
  imports: [
    CommonModule,
    NotificationRoutingModule,
    ReactiveFormsModule, 
    AngularMaterialModule,
    HttpClientModule,
    FormsModule, 
    NgMultiSelectDropDownModule.forRoot(), 
    BsDatepickerModule.forRoot(),
  ]
})
export class NotificationModule { }
