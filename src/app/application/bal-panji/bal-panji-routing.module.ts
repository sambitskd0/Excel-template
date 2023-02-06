import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BalPanjiComponent } from './bal-panji.component';
import { ViewBalpanjiComponent } from './balpanjiRegistration/view-balpanji.component';
import { AddBalpanjiComponent } from './balpanjiRegistration/add-balpanji/add-balpanji.component';
import { EditbalpanjiComponent } from './balpanjiRegistration/edit-balpanji/editbalpanji.component';
import { RoleGuard } from 'src/app/core/guards/role.guard';

const routes: Routes = [
  { path: "", component: BalPanjiComponent, pathMatch: "full" ,canActivate: [RoleGuard], data: {role: 'admin'} },
 
  {
    path: 'registration',
    component: BalPanjiComponent,
    children: [
      { path: "", redirectTo: "viewBalpanji" },
      { path: "viewBalpanji", component: ViewBalpanjiComponent,canActivate: [RoleGuard], data: {role: 'view'} },
      { path: "addBalpanji", component: AddBalpanjiComponent,canActivate: [RoleGuard], data: {role: 'admin'} },
      { path: "editBalpanji/:bId", component: EditbalpanjiComponent,canActivate: [RoleGuard], data: {role: 'admin'} }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BalPanjiRoutingModule { }
