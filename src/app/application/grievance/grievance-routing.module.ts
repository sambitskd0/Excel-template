import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GrievanceComponent } from './grievance.component';
import { AddCategoryComponent } from './manageCategory/add-category/add-category.component';
import { EditCategoryComponent } from './manageCategory/edit-category/edit-category.component';
import { ViewCategoryComponent } from './manageCategory/view-category.component';
import { ViewSubCategoryComponent } from './manageSubCategory/view-sub-category.component';
import { EditSubCategoryComponent } from './manageSubCategory/edit-sub-category/edit-sub-category.component';
import { AddSubCategoryComponent } from './manageSubCategory/add-sub-category/add-sub-category.component';
import { AddSubjectComponent } from './manageSubject/add-subject/add-subject.component';
import { EditSubjectComponent } from './manageSubject/edit-subject/edit-subject.component';
import { ViewSubjectComponent } from './manageSubject/view-subject.component';
import { AddSetAuthorityComponent } from './setAuthority/add-set-authority/add-set-authority.component';
import { ViewSetAuthorityComponent } from './setAuthority/view-set-authority.component';
import { RoleGuard } from 'src/app/core/guards/role.guard';
import { ViewGrievanceComponent } from './raiseGrievance/view-grievance.component';
import { AddGrievanceComponent } from './raiseGrievance/add-grievance/add-grievance.component';
import { GrievanceAtMyLabelComponent } from './attendGrievance/grievance-at-my-label.component';
import { ForwardedGrievanceComponent } from './attendGrievance/forwarded-grievance/forwarded-grievance.component';

const routes: Routes = [
  {path:"", component:GrievanceComponent, canActivate: [RoleGuard], data: {role: 'admin'} },
  {
    path: 'manageCategory',
    component: GrievanceComponent,
    children: [
      { path: '', redirectTo: 'viewCategory'},
      { path: 'addCategory', component: AddCategoryComponent, canActivate: [RoleGuard], data: {role: 'admin'} },
      { path: 'editCategory/:encId', component: EditCategoryComponent, canActivate: [RoleGuard], data: {role: 'admin'} },
      { path: 'viewCategory', component: ViewCategoryComponent, canActivate: [RoleGuard], data: {role: 'view'} },
    ],
  }, 
  {
    path: 'manageSubCategory',
    component: GrievanceComponent,
    children: [
      { path: '', redirectTo: 'viewSubCategory' },
      { path: 'addSubCategory', component: AddSubCategoryComponent, canActivate: [RoleGuard], data: {role: 'admin'} },
      { path: 'editSubCategory/:encId', component: EditSubCategoryComponent, canActivate: [RoleGuard], data: {role: 'admin'} },
      { path: 'viewSubCategory', component: ViewSubCategoryComponent, canActivate: [RoleGuard], data: {role: 'view'} },
    ],
  },
  {
    path: 'manageSubject',
    component: GrievanceComponent,
    children: [
      { path: '', redirectTo: 'viewSubject' },
      { path: 'addSubject', component: AddSubjectComponent, canActivate: [RoleGuard], data: {role: 'admin'} },
      { path: 'editSubject/:encId', component: EditSubjectComponent, canActivate: [RoleGuard], data: {role: 'admin'} },
      { path: 'viewSubject', component: ViewSubjectComponent, canActivate: [RoleGuard], data: {role: 'view'} },
    ],
  },
  {
    path: 'setAuthority',
    component: GrievanceComponent,
    children: [
      { path: '', redirectTo: 'viewSetAuthority' },
      { path: 'addSetAuthority', component: AddSetAuthorityComponent, canActivate: [RoleGuard], data: {role: 'admin'} },
      { path: 'viewSetAuthority', component: ViewSetAuthorityComponent, canActivate: [RoleGuard], data: {role: 'view'} },
    ],
  },
  {
    path: 'raiseGrievance',
    component: GrievanceComponent,
    children: [
      { path: '', redirectTo: 'viewGrievance' },
      { path: 'addGrievance', component: AddGrievanceComponent, canActivate: [RoleGuard], data: {role: 'admin'} },
      { path: 'viewGrievance', component: ViewGrievanceComponent, canActivate: [RoleGuard], data: {role: 'view'} },
    ],
  },
  {
    path: 'attendGrievance',
    component: GrievanceComponent,
    children: [
      { path: '', redirectTo: 'grievanceAtMylabel' },
      { path: 'grievanceAtMylabel', component: GrievanceAtMyLabelComponent, canActivate: [RoleGuard], data: {role: 'view', linkType: 'TB'}},
      { path: 'forwardedGrievance', component: ForwardedGrievanceComponent, canActivate: [RoleGuard], data: {role: 'view', linkType: 'TB'}},
    ],
  },
  


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GrievanceRoutingModule { }
