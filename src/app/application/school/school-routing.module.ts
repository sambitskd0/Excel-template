import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EditAppointSubjectComponent } from '../master/manageAppointSubject/edit-appoint-subject/edit-appoint-subject.component';
import { SchoolComponent } from './school.component';
import { AddCategoryComponent } from './SchoolCategory/add-category/add-category.component';
import { EditCategoryComponent } from './SchoolCategory/edit-category/edit-category.component';
import { ViewCategoryComponent } from './SchoolCategory/view-category.component';
import { AddSchoolComponent } from './schoolRegistration/add-school/add-school.component';
import { EditSchoolComponent } from './schoolRegistration/edit-school/edit-school.component';
import { ViewSchoolComponent } from './schoolRegistration/view-school.component';
import { BasicInfoComponent } from './schoolInfo/basic-info.component';
import { RoleGuard } from 'src/app/core/guards/role.guard';
import { OtherInfoComponent } from './schoolInfo/other-info/other-info.component';
import { EditclasstaggingComponent } from './classTagging/editclasstagging/editclasstagging.component';
import { ViewclasstaggingComponent } from './classTagging/viewclasstagging.component';
import { PhysicalFacilitiesInfoComponent } from './schoolInfo/physical-facilities-info/physical-facilities-info.component';
import { PhysicalEquipmentsInfoComponent } from './schoolInfo/physical-equipments-info/physical-equipments-info.component';
import { ComputersAndDigitalInitiativesComponent } from './schoolInfo/computers-and-digital-initiatives/computers-and-digital-initiatives.component';
import { AddLibraryattendanceComponent } from './libraryAttendance/add-libraryattendance/add-libraryattendance.component';
import { ViewLibraryattendanceComponent } from './libraryAttendance/view-libraryattendance.component';
import { ViewReportListComponent } from './schoolMis/view-report-list.component';
import { SchoolCountReportComponent } from './schoolMis/school-count-report/school-count-report.component';
import { SchoolRawReportComponent } from './schoolMis/school-raw-report/school-raw-report.component';
import { SchoolVerificationReportComponent } from './schoolMis/school-verification-report/school-verification-report.component';
import { SchoolInspectionReportComponent } from './schoolMis/school-inspection-report/school-inspection-report.component'; 
const routes: Routes = [
  //{ path : 'basicInfo', component: BasicInfoComponent},
  {path:"", component:SchoolComponent, canActivate: [RoleGuard], data: {role: 'admin'} },
  { 
    path: 'schoolInfo',
    component: SchoolComponent,
    children: [ 
     // { path: '', redirectTo:'basicInfo' },
      { path: 'basicInfo/:encId', component: BasicInfoComponent},
      { path: 'otherInfo/:encId', component: OtherInfoComponent},
      { path: 'physicalInfo/:encId', component: PhysicalFacilitiesInfoComponent},
      { path: 'physicalequipmentinfo/:encId', component: PhysicalEquipmentsInfoComponent},
      { path: 'CADIniInfo/:encId', component: ComputersAndDigitalInitiativesComponent},
    ]
  },
  {
    path:'schoolRegistration',
    component: SchoolComponent,
    children: [
      { path: '', redirectTo:'viewSchool' },
      { path: 'addSchool',  component: AddSchoolComponent,canActivate: [RoleGuard], data: {role: 'admin'} },
      { path: 'editSchool/:encId', component: EditSchoolComponent,canActivate: [RoleGuard], data: {role: 'admin'}},
      { path: 'viewSchool', component: ViewSchoolComponent,canActivate: [RoleGuard], data: {role: 'view'}}
    ]
  },
  {
    path:'schoolCategory',
    component: SchoolComponent,
    children: [
      { path: '', redirectTo:'viewCategory' },
      { path: 'addCategory',  component: AddCategoryComponent,canActivate: [RoleGuard], data: {role: 'admin'} },
      { path: 'editCategory/:encId', component: EditCategoryComponent,canActivate: [RoleGuard], data: {role: 'admin'}},
      { path: 'viewCategory', component: ViewCategoryComponent,canActivate: [RoleGuard], data: {role: 'view'}}
    ]
  },
  {
    path:'classTagging',
    component: SchoolComponent,
    children: [
      { path: '', redirectTo:'viewClassTagging' },
      { path: 'editClassTagging/:encId', component: EditclasstaggingComponent,canActivate: [RoleGuard], data: {role: 'admin'}},
      { path: 'viewClassTagging', component: ViewclasstaggingComponent,canActivate: [RoleGuard], data: {role: 'view'}}
    ]
  },
  {
    path:'libraryAttendance',
    component: SchoolComponent,
    children: [
      { path: '', redirectTo:'viewLibraryAttendance' },
      { path: 'addLibraryAttendance', component: AddLibraryattendanceComponent,canActivate: [RoleGuard], data: {role: 'admin'}},
      { path: 'viewLibraryAttendance', component: ViewLibraryattendanceComponent,canActivate: [RoleGuard], data: {role: 'view'}}
    ]
  },
  {
    path:'MIS',
    component: SchoolComponent,
    children: [
      { path: '', component: ViewReportListComponent},
      { path: 'schoolCountReport', component: SchoolCountReportComponent},
      { path: 'schoolRawReport', component: SchoolRawReportComponent},
      { path: 'schoolVerificationReport', component: SchoolVerificationReportComponent},
      { path: 'SchoolWiseInspectionReport', component: SchoolInspectionReportComponent},

      // { path: 'viewAllReportList', component: ViewAllReportListComponent,canActivate: [RoleGuard], data: {role: 'admin'}}
    ]
  },
]; 

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SchoolRoutingModule { }
