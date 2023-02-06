import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { BalPanjiRoutingModule } from './bal-panji-routing.module';
import { DataTablesModule } from "angular-datatables";
import { BalPanjiComponent } from './bal-panji.component';
import { ViewBalpanjiComponent } from './balpanjiRegistration/view-balpanji.component';
import { AddBalpanjiComponent } from './balpanjiRegistration/add-balpanji/add-balpanji.component';
import { EditbalpanjiComponent } from './balpanjiRegistration/edit-balpanji/editbalpanji.component';
import { AngularMaterialModule } from "src/app/shared/modules/angular-material.module";
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';

// import { BalpanjiRegistrationComponent } from './balpanji-registration/balpanji-registration.component';



@NgModule({
  declarations: [
    BalPanjiComponent,
    ViewBalpanjiComponent,
    AddBalpanjiComponent,
    EditbalpanjiComponent
  ],
  imports: [
    CommonModule,
    BalPanjiRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    DataTablesModule,
    AngularMaterialModule,
    BsDatepickerModule.forRoot(),
  ]
})
export class BalPanjiModule { }
