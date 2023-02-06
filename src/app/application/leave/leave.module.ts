import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CustomValidators } from 'src/app/shared/validations/custom-validators';
import { AutoFocusDirective } from 'src/app/shared/directives/auto-focus.directive';
import { NgxPaginationModule } from 'ngx-pagination';
import { DataTablesModule } from 'angular-datatables';
import { LeaveRoutingModule } from './leave-routing.module';
import { AddLeaveTypeComponent } from './manageLeaveType/add-leave-type/add-leave-type.component';
import { EditLeaveTypeComponent } from './manageLeaveType/edit-leave-type/edit-leave-type.component';
import { ViewLeaveTypeComponent } from './manageLeaveType/view-leave-type.component';
import { LeaveComponent } from './leave.component';
import { AddLeaveEntitlementComponent } from './manageLeaveEntitlement/add-leave-entitlement/add-leave-entitlement.component';
import { EditLeaveEntitlementComponent } from './manageLeaveEntitlement/edit-leave-entitlement/edit-leave-entitlement.component';
import { ViewLeaveEntitlementComponent } from './manageLeaveEntitlement/view-leave-entitlement.component';
import { AddLeaveApplyComponent } from './manageLeaveApplication/add-leave-apply/add-leave-apply.component';
import { ViewLeaveApplyComponent } from './manageLeaveApplication/view-leave-apply.component';
import { ApproveLeaveComponent } from './approve-leave/approve-leave.component';
import { AngularMaterialModule } from 'src/app/shared/modules/angular-material.module';
import { AddOpeningBalanceComponent } from './manageOpeningBalance/add-opening-balance/add-opening-balance.component';
import { EditOpeningBalanceComponent } from './manageOpeningBalance/edit-opening-balance/edit-opening-balance.component';
import { ViewOpeningBalanceComponent } from './manageOpeningBalance/view-opening-balance.component';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';


@NgModule({
  declarations: [
    AddLeaveTypeComponent,
    EditLeaveTypeComponent,
    ViewLeaveTypeComponent,
    LeaveComponent,
    AddLeaveEntitlementComponent,
    EditLeaveEntitlementComponent,
    ViewLeaveEntitlementComponent,
    AddLeaveApplyComponent,
    ViewLeaveApplyComponent,
    ApproveLeaveComponent,
    AddOpeningBalanceComponent,
    EditOpeningBalanceComponent,
    ViewOpeningBalanceComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    LeaveRoutingModule,
    NgxPaginationModule,
    DataTablesModule,
    AngularMaterialModule,
    BsDatepickerModule.forRoot(),
  ],
  providers:[
    CustomValidators,
    AutoFocusDirective
  ]
})
export class LeaveModule { }
