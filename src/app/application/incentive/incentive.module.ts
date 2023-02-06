import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IncentiveRoutingModule } from './incentive-routing.module';
import { IncentiveComponent } from './incentive.component';
import { AddIncentiveMasterComponent } from './manageIncentiveMaster/add-incentive-master/add-incentive-master.component';
import { EditIncentiveMasterComponent } from './manageIncentiveMaster/edit-incentive-master/edit-incentive-master.component';
import { ViewIncentiveMasterComponent } from './manageIncentiveMaster/view-incentive-master.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DataTablesModule } from 'angular-datatables';
import { ViewIncentiveConfigurationComponent } from './manageIncentiveConfiguration/view-incentive-configuration.component';
import { AddIncentiveConfigurationComponent } from './manageIncentiveConfiguration/add-incentive-configuration/add-incentive-configuration.component';
import { EditIncentiveConfigurationComponent } from './manageIncentiveConfiguration/edit-incentive-configuration/edit-incentive-configuration.component';
import { AngularMaterialModule } from "src/app/shared/modules/angular-material.module";

@NgModule({
  declarations: [
    IncentiveComponent,
    AddIncentiveMasterComponent,
    EditIncentiveMasterComponent,
    ViewIncentiveMasterComponent,
    ViewIncentiveConfigurationComponent,
    AddIncentiveConfigurationComponent,
    EditIncentiveConfigurationComponent
  ],
  imports: [
    CommonModule,
    IncentiveRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    DataTablesModule,
    AngularMaterialModule,
  ]
})
export class IncentiveModule { }
