import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RoleGuard } from 'src/app/core/guards/role.guard';
import { NotificationComponent } from './notification.component';
import { AddOfficerNotificationComponent } from './officerNotification/add-officer-notification/add-officer-notification.component';
import { EditOfficerNotificationComponent } from './officerNotification/edit-officer-notification/edit-officer-notification.component';
import { ViewOfficerNotificationComponent } from './officerNotification/view-officer-notification.component';
import { ViewPortalNotificationComponent } from './portalInbox/view-portal-notification.component';
import { AddSchoolTeacherNotificationComponent } from './schoolTeacherNotification/add-school-teacher-notification/add-school-teacher-notification.component';
import { EditSchoolTeacherNotificationComponent } from './schoolTeacherNotification/edit-school-teacher-notification/edit-school-teacher-notification.component';
import { ViewSchoolTeacherNotificationComponent } from './schoolTeacherNotification/view-school-teacher-notification.component';

const routes: Routes = [
  {path:"", component:NotificationComponent, canActivate: [RoleGuard], data: {role: 'admin'} },
  
  {
    path: 'officerNotification',
    component: NotificationComponent,
    children: [
      { path: '', redirectTo: 'viewOfficerNotification'},
      { path: 'addOfficerNotification', component: AddOfficerNotificationComponent, canActivate: [RoleGuard], data: {role: 'admin'} },
      { path: 'editOfficerNotification/:encId', component: EditOfficerNotificationComponent, canActivate: [RoleGuard], data: {role: 'admin'} },
      { path: 'viewOfficerNotification', component: ViewOfficerNotificationComponent, canActivate: [RoleGuard], data: {role: 'view'} },
    ],
  },
  {
    path: 'schoolTeacherNotification',
    component: NotificationComponent,
    children: [
      { path: '', redirectTo: 'viewSchoolTeacherNotification'},
      { path: 'addSchoolTeacherNotification', component: AddSchoolTeacherNotificationComponent, canActivate: [RoleGuard], data: {role: 'admin'} },
      { path: 'editSchoolTeacherNotification/:encId', component: EditSchoolTeacherNotificationComponent, canActivate: [RoleGuard], data: {role: 'admin'} },
      { path: 'viewSchoolTeacherNotification', component: ViewSchoolTeacherNotificationComponent, canActivate: [RoleGuard], data: {role: 'view'} },
    ],
  },
  {
    path: 'portalInbox',
    component: NotificationComponent,
    children: [
      { path: '', redirectTo: 'viewPortalNotification'},
      { path: 'viewPortalNotification', component: ViewPortalNotificationComponent, canActivate: [RoleGuard], data: {role: 'view'} },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NotificationRoutingModule { }
