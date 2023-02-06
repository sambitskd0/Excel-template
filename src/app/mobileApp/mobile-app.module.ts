import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MobileAppRoutingModule } from './mobile-app-routing.module';
import { MobileAppComponent } from './mobile-app.component';
import { SuccessComponent } from './success/success.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';


@NgModule({
  declarations: [
    MobileAppComponent,
    SuccessComponent,
    PageNotFoundComponent
  ],
  imports: [
    CommonModule,
    MobileAppRoutingModule
  ]
})
export class MobileAppModule { }
