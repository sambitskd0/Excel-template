import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserComponent } from './user.component';
import { AddUserComponent } from './manageUser/add-user/add-user.component';
// import { EditUserComponent } from './manageUser/edit-user/edit-user.component';
import { ViewUserComponent } from './manageUser/view-user.component';

import { AddProfileComponent } from './manageProfile/add-profile/add-profile.component';
import { EditProfileComponent } from './manageProfile/edit-profile/edit-profile.component';
import { ViewProfileComponent } from './manageProfile/view-profile.component';
import { RoleGuard } from 'src/app/core/guards/role.guard';
import { ViewDesignationComponent } from './view-designation/view-designation.component';
import { AddDesignationlistComponent } from './manageDesignation/add-designationlist/add-designationlist.component';
import { ViewDesignationlistComponent } from './manageDesignation/view-designationlist.component';
import { EditDesignationlistComponent } from './manageDesignation/edit-designationlist/edit-designationlist.component';
import { AddSubdesignationComponent } from './manageSubDesignation/add-subdesignation/add-subdesignation.component';
import { ViewSubdesignationComponent } from './manageSubDesignation/view-subdesignation.component';
import { EditSubdesignationComponent } from './manageSubDesignation/edit-subdesignation/edit-subdesignation.component';
import { ViewUserMisComponent } from './user-mis/view-user-mis.component';



const routes: Routes = [
  {path:"", component:UserComponent, canActivate: [RoleGuard], data: {role: 'admin'} },
  {
    
    path: 'manageUser',
    component: UserComponent,
    children: [
      {
        path: '',
        children: [
          { path: '', redirectTo: 'viewUser' },
          { path: 'addUser', component: AddUserComponent,canActivate: [RoleGuard], data: {role: 'admin'} },
          { path: 'viewUser', component: ViewUserComponent,canActivate: [RoleGuard], data: {role: 'view'} },
        ],
      },
    ],
  },
  {
    path: 'manageProfile',
    component: UserComponent,
    children: [
      {
        path: '',
        children: [
          { path: '', redirectTo: 'viewProfile' },
          { path: 'addProfile', component: AddProfileComponent,canActivate: [RoleGuard], data: {role: 'admin'} },
          { path: 'viewProfile', component: ViewProfileComponent,canActivate: [RoleGuard], data: {role: 'view'} },
          { path: 'editProfile/:encId', component: EditProfileComponent,canActivate: [RoleGuard], data: {role: 'admin'} },
          { path: 'viewDesignation', component: ViewDesignationComponent,canActivate: [RoleGuard], data: {role: 'view'} },
        ],
      },
    ],
  },
  {
    path: 'manageDesignation',
    component: UserComponent,
    children: [
      {
        path: '',
        children: [
          { path: '', redirectTo: 'viewDesignationList' },
          { path: 'addDesignation', component: AddDesignationlistComponent,canActivate: [RoleGuard], data: {role: 'admin'} },
          { path: 'viewDesignationList', component: ViewDesignationlistComponent,canActivate: [RoleGuard], data: {role: 'view'} },
          { path: 'editDesignation/:encId', component: EditDesignationlistComponent,canActivate: [RoleGuard], data: {role: 'admin'} },
          
        ],
      },
    ],
  },
  {
    path: 'manageSubDesignation',
    component: UserComponent,
    children: [
      {
        path: '',
        children: [
          { path: '', redirectTo: 'viewSubDesignation' },
          { path: 'addSubDesignation', component: AddSubdesignationComponent,canActivate: [RoleGuard], data: {role: 'admin'} },
          { path: 'viewSubDesignation', component: ViewSubdesignationComponent,canActivate: [RoleGuard], data: {role: 'view'} },
          { path: 'editSubDesignation/:encId', component: EditSubdesignationComponent,canActivate: [RoleGuard], data: {role: 'admin'} },
          
        ],
      },
    ],
  },
  {
    path: 'userMis',
    component: UserComponent,
    children: [
      {
        path: '',
        children: [
          { path: '', redirectTo: 'viewUserMis' },
          { path: 'viewUserMis', component: ViewUserMisComponent,canActivate: [RoleGuard], data: {role: 'view'} },
          
        ],
      },
    ],
  },
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
