import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GrievanceRoutingModule } from './grievance-routing.module';
import { GrievanceComponent } from './grievance.component';
import { ViewCategoryComponent } from './manageCategory/view-category.component';
import { AddCategoryComponent } from './manageCategory/add-category/add-category.component';
import { EditCategoryComponent } from './manageCategory/edit-category/edit-category.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { DataTablesModule } from 'angular-datatables';
import { ViewSubCategoryComponent } from './manageSubCategory/view-sub-category.component';
import { AddSubCategoryComponent } from './manageSubCategory/add-sub-category/add-sub-category.component';
import { EditSubCategoryComponent } from './manageSubCategory/edit-sub-category/edit-sub-category.component';
import { ViewSubjectComponent } from './manageSubject/view-subject.component';
import { AddSubjectComponent } from './manageSubject/add-subject/add-subject.component';
import { EditSubjectComponent } from './manageSubject/edit-subject/edit-subject.component';
import { ViewSetAuthorityComponent } from './setAuthority/view-set-authority.component';
import { AddSetAuthorityComponent } from './setAuthority/add-set-authority/add-set-authority.component';
import { ViewGrievanceComponent } from './raiseGrievance/view-grievance.component';
import { AddGrievanceComponent } from './raiseGrievance/add-grievance/add-grievance.component';
import { GrievanceAtMyLabelComponent } from './attendGrievance/grievance-at-my-label.component';
import { ForwardedGrievanceComponent } from './attendGrievance/forwarded-grievance/forwarded-grievance.component';
import { AngularMaterialModule } from 'src/app/shared/modules/angular-material.module';
import { GrievanceDetailsModalComponent } from './commonModals/grievance-details-modal/grievance-details-modal.component';
import { GrievanceHistoryModalComponent } from './commonModals/grievance-history-modal/grievance-history-modal.component';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';


@NgModule({
  declarations: [
    GrievanceComponent,
    ViewCategoryComponent, 
    AddCategoryComponent,
    EditCategoryComponent,
    ViewSubCategoryComponent,
    AddSubCategoryComponent,
    EditSubCategoryComponent,
    ViewSubjectComponent,
    AddSubjectComponent,
    EditSubjectComponent,
    ViewSetAuthorityComponent,
    AddSetAuthorityComponent,
    ViewGrievanceComponent,
    AddGrievanceComponent,
    GrievanceAtMyLabelComponent,
    ForwardedGrievanceComponent,
    GrievanceDetailsModalComponent,
    GrievanceHistoryModalComponent,
  ],
  imports: [
    CommonModule,
    GrievanceRoutingModule,
    ReactiveFormsModule, 
    FormsModule, 
    HttpClientModule,
    DataTablesModule,
    AngularMaterialModule, 
    BsDatepickerModule.forRoot(),
  ]
})
export class GrievanceModule { }
