import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LeaveComponent } from './leave.component';

import { ViewLeaveTypeComponent } from './manageLeaveType/view-leave-type.component';
import { AddLeaveTypeComponent } from './manageLeaveType/add-leave-type/add-leave-type.component';
import { EditLeaveTypeComponent } from './manageLeaveType/edit-leave-type/edit-leave-type.component';

import { ViewLeaveEntitlementComponent } from './manageLeaveEntitlement/view-leave-entitlement.component';
import { AddLeaveEntitlementComponent } from './manageLeaveEntitlement/add-leave-entitlement/add-leave-entitlement.component';
import { EditLeaveEntitlementComponent } from './manageLeaveEntitlement/edit-leave-entitlement/edit-leave-entitlement.component';

import { ViewLeaveApplyComponent } from './manageLeaveApplication/view-leave-apply.component';
import { AddLeaveApplyComponent } from './manageLeaveApplication/add-leave-apply/add-leave-apply.component';

import { RoleGuard } from 'src/app/core/guards/role.guard';
import { ApproveLeaveComponent } from './approve-leave/approve-leave.component';

import { ViewOpeningBalanceComponent } from './manageOpeningBalance/view-opening-balance.component';
import { AddOpeningBalanceComponent } from './manageOpeningBalance/add-opening-balance/add-opening-balance.component';
import { EditOpeningBalanceComponent } from './manageOpeningBalance/edit-opening-balance/edit-opening-balance.component';




const routes: Routes = [
  { path: "", component: LeaveComponent, pathMatch: "full" ,canActivate: [RoleGuard], data: {role: 'admin'} },
  {
    path: 'manageLeaveType',
    component: LeaveComponent,
    children: [
      {
        path: '',
        children: [
          { path: '', redirectTo: 'viewLeaveType' },
          { path: 'addLeaveType', component: AddLeaveTypeComponent,canActivate: [RoleGuard], data: {role: 'admin'} },
          { path: 'viewLeaveType', component: ViewLeaveTypeComponent,canActivate: [RoleGuard], data: {role: 'view'} },
          { path: 'editLeaveType/:encId', component: EditLeaveTypeComponent,canActivate: [RoleGuard], data: {role: 'admin'} },
         
        ],
      },
    ],
  },
  {
    path: 'manageLeaveEntitlement',
    component: LeaveComponent,
    children: [
      {
        path: '',
        children: [
          { path: '', redirectTo: 'viewLeaveEntitlement' },
          { path: 'addLeaveEntitlement', component: AddLeaveEntitlementComponent,canActivate: [RoleGuard], data: {role: 'admin'} },
          { path: 'viewLeaveEntitlement', component: ViewLeaveEntitlementComponent,canActivate: [RoleGuard], data: {role: 'view'} },
          { path: 'editLeaveEntitlement/:encId', component: EditLeaveEntitlementComponent,canActivate: [RoleGuard], data: {role: 'admin'} },
         
        ],
      },
    ],
  },
  {
    path: 'manageLeaveApply',
    component: LeaveComponent,
    children: [
      {
        path: '',
        children: [
          { path: '', redirectTo: 'viewLeaveApply' },
          { path: 'addLeaveApply', component: AddLeaveApplyComponent,canActivate: [RoleGuard], data: {role: 'admin'} },
          { path: 'viewLeaveApply', component: ViewLeaveApplyComponent,canActivate: [RoleGuard], data: {role: 'view'} },         
        ],
      },
    ],
  },
  {
    path: 'manageOpeningBalance',
    component: LeaveComponent,
    children: [
      {
        path: '',
        children: [
          { path: '', redirectTo: 'viewOpeningBalance' },
          { path: 'addOpeningBalance', component: AddOpeningBalanceComponent,canActivate: [RoleGuard], data: {role: 'admin'} },
          { path: 'viewOpeningBalance', component: ViewOpeningBalanceComponent,canActivate: [RoleGuard], data: {role: 'view'} },  
          { path: 'editOpeningBalance/:encId', component: EditOpeningBalanceComponent,canActivate: [RoleGuard], data: {role: 'admin'} },       
        ],
      },
    ],
  },
  {
    path: 'ApproveLeave',
    component: LeaveComponent,
    children: [
      {
        path: '',
        children: [
          { path: '', redirectTo: 'viewLeaves' },
          { path: 'viewLeaves', component: ApproveLeaveComponent,canActivate: [RoleGuard], data: {role: 'view'} },         
        ],
      },
    ],
  }


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LeaveRoutingModule { }
