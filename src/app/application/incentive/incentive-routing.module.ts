import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IncentiveComponent } from './incentive.component';
import { AddIncentiveConfigurationComponent } from './manageIncentiveConfiguration/add-incentive-configuration/add-incentive-configuration.component';
import { EditIncentiveConfigurationComponent } from './manageIncentiveConfiguration/edit-incentive-configuration/edit-incentive-configuration.component';
import { ViewIncentiveConfigurationComponent } from './manageIncentiveConfiguration/view-incentive-configuration.component';
import { AddIncentiveMasterComponent } from './manageIncentiveMaster/add-incentive-master/add-incentive-master.component';
import { EditIncentiveMasterComponent } from './manageIncentiveMaster/edit-incentive-master/edit-incentive-master.component';
import { ViewIncentiveMasterComponent } from './manageIncentiveMaster/view-incentive-master.component';
import { RoleGuard } from 'src/app/core/guards/role.guard';


const routes: Routes = [
  {path:"", component:IncentiveComponent, canActivate: [RoleGuard], data: {role: 'admin'} },
  {
    path: 'manageIncentiveMaster',
    component: IncentiveComponent,
    children: [
      { path: '', redirectTo: 'viewIncentive' },
      { path: 'addIncentive', component: AddIncentiveMasterComponent,canActivate: [RoleGuard], data: {role: 'admin'} },
      { path: 'editIncentive/:encId', component: EditIncentiveMasterComponent,canActivate: [RoleGuard], data: {role: 'admin'} },
      { path: 'viewIncentive', component: ViewIncentiveMasterComponent,canActivate: [RoleGuard], data: {role: 'view'} },
    ],
  },
  {
    path: 'manageIncentiveConfiguration',
    component: IncentiveComponent,
    children: [
      { path: '', redirectTo: 'viewIncentiveConfiguration'},
      { path: 'addIncentiveConfiguration', component: AddIncentiveConfigurationComponent,canActivate: [RoleGuard], data: {role: 'admin'} },
      { path: 'editIncentiveConfiguration/:encId', component: EditIncentiveConfigurationComponent,canActivate: [RoleGuard], data: {role: 'admin'} },
      { path: 'viewIncentiveConfiguration', component: ViewIncentiveConfigurationComponent,canActivate: [RoleGuard], data: {role: 'view'} },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class IncentiveRoutingModule { }
