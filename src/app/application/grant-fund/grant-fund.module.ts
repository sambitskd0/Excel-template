import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GrantFundRoutingModule } from './grant-fund-routing.module';
import { GrantFundComponent } from './grant-fund.component';
import { ViewGrantTypeComponent } from './manageGrantType/view-grant-type.component';
import { AddGrantTypeComponent } from './manageGrantType/add-grant-type/add-grant-type.component';
import { EditGrantTypeComponent } from './manageGrantType/edit-grant-type/edit-grant-type.component';
import { DataTablesModule } from 'angular-datatables';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ViewGrantConfigurationComponent } from './manageGrantConfiguration/view-grant-configuration.component';
import { AddGrantConfigurationComponent } from './manageGrantConfiguration/add-grant-configuration/add-grant-configuration.component';
import { EditGrantConfigurationComponent } from './manageGrantConfiguration/edit-grant-configuration/edit-grant-configuration.component';
import { ViewGrantInfoComponent } from './manageGrantInfo/view-grant-info.component';
import { AddGrantInfoComponent } from './manageGrantInfo/add-grant-info/add-grant-info.component';
import { EditGrantInfoComponent } from './manageGrantInfo/edit-grant-info/edit-grant-info.component';
import { AngularMaterialModule } from 'src/app/shared/modules/angular-material.module';
import { ViewGrantReceiveComponent } from './manageGrantReceive/view-grant-receive.component';
import { AddGrantReceiveComponent } from './manageGrantReceive/add-grant-receive/add-grant-receive.component';
import { EditGrantReceiveComponent } from './manageGrantReceive/edit-grant-receive/edit-grant-receive.component';
import { ViewGrantExpenditureComponent } from './manageGrantExpenditure/view-grant-expenditure.component';
import { AddGrantExpenditureComponent } from './manageGrantExpenditure/add-grant-expenditure/add-grant-expenditure.component';
import { EditGrantExpenditureComponent } from './manageGrantExpenditure/edit-grant-expenditure/edit-grant-expenditure.component';
import { CheckBalanceComponent } from './manageGrantExpenditure/check-balance/check-balance.component';
import { ViewExpenditureTypeComponent } from './manageExpenditureType/view-expenditure-type.component';
import { AddExpenditureTypeComponent } from './manageExpenditureType/add-expenditure-type/add-expenditure-type.component';
import { EditExpenditureTypeComponent } from './manageExpenditureType/edit-expenditure-type/edit-expenditure-type.component';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { ExcelService } from './excel.service';
import { TemplateComponent } from './template/template.component';




@NgModule({
  declarations: [
    GrantFundComponent,
    ViewGrantTypeComponent,
    AddGrantTypeComponent,
    EditGrantTypeComponent,
    ViewGrantConfigurationComponent,
    AddGrantConfigurationComponent,
    EditGrantConfigurationComponent,
    ViewGrantInfoComponent,
    AddGrantInfoComponent,
    EditGrantInfoComponent,
    ViewGrantReceiveComponent,
    AddGrantReceiveComponent,
    EditGrantReceiveComponent,
    ViewGrantExpenditureComponent,
    AddGrantExpenditureComponent,
    EditGrantExpenditureComponent,
    CheckBalanceComponent,
    ViewExpenditureTypeComponent,
    AddExpenditureTypeComponent,
    EditExpenditureTypeComponent,
    TemplateComponent,
    // AutoFocusDirective
  ],
  imports: [
    CommonModule,
    GrantFundRoutingModule,
    ReactiveFormsModule, 
    FormsModule, 
    DataTablesModule,
    AngularMaterialModule, 
    BsDatepickerModule.forRoot(),
  ],
  providers: [ExcelService],
})
export class GrantFundModule { }
