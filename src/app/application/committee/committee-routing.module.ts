import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RoleGuard } from 'src/app/core/guards/role.guard';
import { CommitteeComponent } from './committee.component';
import { AddCommitteeBankDetailsComponent } from './manageCommitteeBankDetails/add-committee-bank-details/add-committee-bank-details.component';
import { EditCommitteeBankDetailsComponent } from './manageCommitteeBankDetails/edit-committee-bank-details/edit-committee-bank-details.component';
import { ViewCommitteeBankDetailsComponent } from './manageCommitteeBankDetails/view-committee-bank-details.component';
import { AddCommitteeMeetingComponent } from './manageCommitteeMeeting/add-committee-meeting/add-committee-meeting.component';
import { ViewCommitteeMeetingComponent } from './manageCommitteeMeeting/view-committee-meeting.component';
import { AddSmcMemberComponent } from './manageCommitteeMember/add-smc-member/add-smc-member.component';
import { ViewSmcMemberComponent } from './manageCommitteeMember/view-smc-member.component';

const routes: Routes = [
  {path:"", component:CommitteeComponent, canActivate: [RoleGuard], data: {role: 'admin'} },
  {
    path: 'manageCommitteeMember',
    component: CommitteeComponent,
    children: [
      { path: '', redirectTo: 'viewSmcMember' },
      { path: 'addSmcMember', component: AddSmcMemberComponent,canActivate: [RoleGuard], data: {role: 'admin'} },
      { path: 'viewSmcMember', component: ViewSmcMemberComponent,canActivate: [RoleGuard], data: {role: 'view'} },
    ],
  },{
    path: 'manageCommitteeMeeting',
    component: CommitteeComponent,
    children: [
      { path: '', redirectTo: 'viewCommitteeMeeting' },
      { path: 'addCommitteeMeeting', component: AddCommitteeMeetingComponent,canActivate: [RoleGuard], data: {role: 'admin'} },
      { path: 'viewCommitteeMeeting', component: ViewCommitteeMeetingComponent,canActivate: [RoleGuard], data: {role: 'view'} },
    ],
  },{
    path: 'manageCommitteeBankDetails',
    component: CommitteeComponent,
    children: [
      { path: '', redirectTo: 'viewCommitteeBankDetails' },
      { path: 'addCommitteeBankDetails', component: AddCommitteeBankDetailsComponent,canActivate: [RoleGuard], data: {role: 'admin'} },
      { path: 'editCommitteeBankDetails/:encId', component: EditCommitteeBankDetailsComponent,canActivate: [RoleGuard], data: {role: 'admin'} },
      { path: 'viewCommitteeBankDetails', component: ViewCommitteeBankDetailsComponent,canActivate: [RoleGuard], data: {role: 'view'} },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CommitteeRoutingModule { }
