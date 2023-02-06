import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CommitteeRoutingModule } from './committee-routing.module';
import { CommitteeComponent } from './committee.component';
import { ViewSmcMemberComponent } from './manageCommitteeMember/view-smc-member.component';
import { AddSmcMemberComponent } from './manageCommitteeMember/add-smc-member/add-smc-member.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DataTablesModule } from 'angular-datatables';
import { ViewCommitteeMeetingComponent } from './manageCommitteeMeeting/view-committee-meeting.component';
import { AddCommitteeMeetingComponent } from './manageCommitteeMeeting/add-committee-meeting/add-committee-meeting.component';
import { HttpClientModule } from '@angular/common/http';
import { ViewCommitteeBankDetailsComponent } from './manageCommitteeBankDetails/view-committee-bank-details.component';
import { AddCommitteeBankDetailsComponent } from './manageCommitteeBankDetails/add-committee-bank-details/add-committee-bank-details.component';
import { EditCommitteeBankDetailsComponent } from './manageCommitteeBankDetails/edit-committee-bank-details/edit-committee-bank-details.component';
import { AngularMaterialModule } from 'src/app/shared/modules/angular-material.module';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';




@NgModule({
  declarations: [
    CommitteeComponent,
    ViewSmcMemberComponent,
    AddSmcMemberComponent,
    ViewCommitteeMeetingComponent,
    AddCommitteeMeetingComponent,
    ViewCommitteeBankDetailsComponent,
    AddCommitteeBankDetailsComponent,
    EditCommitteeBankDetailsComponent
  ],
  imports: [
    CommonModule,
    CommitteeRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    DataTablesModule,
    HttpClientModule,
    AngularMaterialModule,
    BsDatepickerModule.forRoot(),
  ]
})
export class CommitteeModule { }
