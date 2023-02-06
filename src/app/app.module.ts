import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { LoginComponent } from "./login/login.component";
import { ApplicationRoutingModule } from "./application/application-routing.module";
import { RouterModule } from "@angular/router";

import {
  DatePipe,
  LocationStrategy,
  PathLocationStrategy,
} from "@angular/common";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { BsDatepickerModule } from "ngx-bootstrap/datepicker";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CustomValidators } from "./shared/validations/custom-validators";
import { NgxSpinnerModule } from "ngx-spinner";
import { LoadScreenComponent } from "./shared/components/load-screen/load-screen.component";
import { AlertHelper } from "./core/helpers/alert-helper";
import { AuthInterceptor } from "./core/interceptors/auth.interceptor";
import { NgxPaginationModule } from "ngx-pagination";
import { JwtHelperService, JWT_OPTIONS } from "@auth0/angular-jwt";
import { PageNotFoundComponent } from "./shared/components/page-not-found/page-not-found.component";
import { PrivilegeHelper } from "./core/helpers/privilege-helper";
import { CommonFunctionHelper } from "./core/helpers/common-function-helper";
import { ErrorHandler } from "./core/helpers/error-handler";
import { ServerSideErrorInterceptor } from "./core/interceptors/server-side-error.interceptor";
import { DataTablesModule } from "angular-datatables";
import { ForgotpasswordComponent } from './login/forgotpassword/forgotpassword.component';
import { ResetpasswordComponent } from './login/resetpassword/resetpassword.component';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    LoadScreenComponent,
    PageNotFoundComponent,
    ForgotpasswordComponent,
    ResetpasswordComponent,
   
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ApplicationRoutingModule,
    RouterModule,
    BrowserAnimationsModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    NgxSpinnerModule,
    BsDatepickerModule.forRoot(),
    NgxPaginationModule,
    DataTablesModule,

  ],
  providers: [
    { provide: LocationStrategy, useClass: PathLocationStrategy },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ServerSideErrorInterceptor,
      multi: true,
    },
    { provide: JWT_OPTIONS, useValue: JWT_OPTIONS },
    JwtHelperService,
    CustomValidators,
    AlertHelper,
    PrivilegeHelper,
    DatePipe,
    CommonFunctionHelper,
    ErrorHandler,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  bootstrap: [AppComponent],
})
export class AppModule {}
