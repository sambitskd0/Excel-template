import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CustomValidators } from 'src/app/shared/validations/custom-validators';
import { AutoFocusDirective } from 'src/app/shared/directives/auto-focus.directive';

import { UserRoutingModule } from './user-routing.module';
import { AddUserComponent } from './manageUser/add-user/add-user.component';
import { UserComponent } from './user.component';
import { ViewUserComponent } from './manageUser/view-user.component';
import { AddProfileComponent } from './manageProfile/add-profile/add-profile.component';
import { EditProfileComponent } from './manageProfile/edit-profile/edit-profile.component';
import { ViewProfileComponent } from './manageProfile/view-profile.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { DataTablesModule } from 'angular-datatables';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { AngularMaterialModule } from "src/app/shared/modules/angular-material.module";
import { ViewDesignationComponent } from './view-designation/view-designation.component';
import { ViewDesignationlistComponent } from './manageDesignation/view-designationlist.component';
import { AddDesignationlistComponent } from './manageDesignation/add-designationlist/add-designationlist.component';
import { EditDesignationlistComponent } from './manageDesignation/edit-designationlist/edit-designationlist.component';
import { ViewSubdesignationComponent } from './manageSubDesignation/view-subdesignation.component';
import { AddSubdesignationComponent } from './manageSubDesignation/add-subdesignation/add-subdesignation.component';
import { EditSubdesignationComponent } from './manageSubDesignation/edit-subdesignation/edit-subdesignation.component';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { ViewUserMisComponent } from './user-mis/view-user-mis.component';



// import { NoRecordFoundComponent } from 'src/app/shared/components/no-record-found/no-record-found.component';
// import { NoRecordFoundComponent } from '../../shared/components/no-record-found/no-record-found.component';





@NgModule({
  declarations: [
    AddUserComponent,
   
    UserComponent,
    ViewUserComponent,
    AddProfileComponent,
    EditProfileComponent,
    ViewProfileComponent,
    ViewDesignationComponent,
    ViewDesignationlistComponent,
    AddDesignationlistComponent,
    EditDesignationlistComponent,
    ViewSubdesignationComponent,
    AddSubdesignationComponent,
    EditSubdesignationComponent,
    ViewUserMisComponent
   
   
    //  NoRecordFoundComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    UserRoutingModule,
    NgxPaginationModule,
    DataTablesModule,
    NgMultiSelectDropDownModule,
    AngularMaterialModule,
    BsDatepickerModule.forRoot(),
    

  ],
  providers:[
    CustomValidators,
    AutoFocusDirective
  ]
})
export class UserModule { }
