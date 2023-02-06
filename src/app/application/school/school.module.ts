import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CustomValidators } from 'src/app/shared/validations/custom-validators';
import { AutoFocusDirective } from 'src/app/shared/directives/auto-focus.directive';
import { SchoolRoutingModule } from './school-routing.module';
import { SchoolComponent } from './school.component';
import { ViewSchoolComponent } from './schoolRegistration/view-school.component';
import { AddSchoolComponent } from './schoolRegistration/add-school/add-school.component';
import { EditSchoolComponent } from './schoolRegistration/edit-school/edit-school.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { DataTablesModule } from 'angular-datatables';
import { AddCategoryComponent } from './SchoolCategory/add-category/add-category.component';
import { EditCategoryComponent } from './SchoolCategory/edit-category/edit-category.component';
import { ViewCategoryComponent } from './SchoolCategory/view-category.component';
import { EditclasstaggingComponent } from './classTagging/editclasstagging/editclasstagging.component';
import { ViewclasstaggingComponent } from './classTagging/viewclasstagging.component';
import { BasicInfoComponent } from './schoolInfo/basic-info.component';
import { OtherInfoComponent } from './schoolInfo/other-info/other-info.component';
import { PhysicalFacilitiesInfoComponent } from './schoolInfo/physical-facilities-info/physical-facilities-info.component';
import { PhysicalEquipmentsInfoComponent } from './schoolInfo/physical-equipments-info/physical-equipments-info.component';
import { ComputersAndDigitalInitiativesComponent } from './schoolInfo/computers-and-digital-initiatives/computers-and-digital-initiatives.component';
import { AngularMaterialModule } from "src/app/shared/modules/angular-material.module";
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { ViewLibraryattendanceComponent } from './libraryAttendance/view-libraryattendance.component';
import { AddLibraryattendanceComponent } from './libraryAttendance/add-libraryattendance/add-libraryattendance.component';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { ViewReportListComponent } from './schoolMis/view-report-list.component';
import { ViewCadComponent } from './schoolInfo/computers-and-digital-initiatives/view-cad/view-cad.component';
import { UpdateCadComponent } from './schoolInfo/computers-and-digital-initiatives/update-cad/update-cad.component';
import { UpdatePfiComponent } from './schoolInfo/physical-facilities-info/update-pfi/update-pfi.component';
import { ViewPfiComponent } from './schoolInfo/physical-facilities-info/view-pfi/view-pfi.component';
import { UpdatePeiComponent } from './schoolInfo/physical-equipments-info/update-pei/update-pei.component';
import { ViewPeiComponent } from './schoolInfo/physical-equipments-info/view-pei/view-pei.component';
import { UpdateOtherInfoComponent } from './schoolInfo/other-info/update-other-info/update-other-info.component';
import { ViewOtherInfoComponent } from './schoolInfo/other-info/view-other-info/view-other-info.component';
import { SchoolCountReportComponent } from './schoolMis/school-count-report/school-count-report.component';
import { SchoolRawReportComponent } from './schoolMis/school-raw-report/school-raw-report.component';
import { SchoolVerificationReportComponent } from './schoolMis/school-verification-report/school-verification-report.component';
import { SchoolInspectionReportComponent } from './schoolMis/school-inspection-report/school-inspection-report.component';

@NgModule({
  declarations: [
    SchoolComponent,
    ViewSchoolComponent,
    AddSchoolComponent,
    EditSchoolComponent,
    AddCategoryComponent,
    EditCategoryComponent,
    ViewCategoryComponent,
    EditclasstaggingComponent,
    ViewclasstaggingComponent,
    BasicInfoComponent,
    OtherInfoComponent,
    PhysicalFacilitiesInfoComponent,
    PhysicalEquipmentsInfoComponent,
    ComputersAndDigitalInitiativesComponent,
    ViewLibraryattendanceComponent,
    AddLibraryattendanceComponent,
    ViewReportListComponent,
    ViewCadComponent,
    UpdateCadComponent,
    UpdatePfiComponent,
    ViewPfiComponent,
    UpdatePeiComponent,
    ViewPeiComponent,
    UpdateOtherInfoComponent,
    ViewOtherInfoComponent,
    SchoolCountReportComponent,
    SchoolRawReportComponent,
    SchoolVerificationReportComponent,
    SchoolInspectionReportComponent
  ],
  imports: [
    CommonModule,
    SchoolRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgxPaginationModule,
    DataTablesModule,
    AngularMaterialModule,
    NgMultiSelectDropDownModule.forRoot(), 
    BsDatepickerModule.forRoot(),
  ],
  providers:[
    CustomValidators,
    AutoFocusDirective
  ]
})
export class SchoolModule { }
