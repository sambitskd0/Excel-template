/**
 * Created By  : Sambit Kumar Dalai
 * Created On  : 15-05-2022
 * Description : Interceptor for handling server side error.
 **/

import { Injectable } from "@angular/core";
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from "@angular/common/http";
import { NgxSpinnerService } from "ngx-spinner";
import { ActivatedRoute, Router } from "@angular/router";
import { catchError, Observable, throwError } from "rxjs";
import { AuthenticationService } from "../services/authentication.service";
import { AlertHelper } from "../helpers/alert-helper";
import { isDevMode } from "@angular/core";

@Injectable()
export class ServerSideErrorInterceptor
  extends AlertHelper
  implements HttpInterceptor
{
  constructor(
    private authenticationService: AuthenticationService,
    private spinner: NgxSpinnerService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    super();
  }

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      catchError((err) => {
        this.spinner.hide(); // hide spinner
        // auto logout if in production
        if (
          (isDevMode() === false &&
            [401, 403, 500, 404, 502, 0].includes(err.status)) ||
          (isDevMode() === true && [401, 502, 0].includes(err.status))
        ) {
          this.viewAlertHtml(
            "error",
            "",
            this.serverSideErrorHandler(err)
          ).then(() => {
            // if mobile app redirect to page not found
            if (sessionStorage.getItem("mobileAuthToken")?.length) {
              this.router.navigate(["/MobileApp/divya/pageNotFound"], {
                relativeTo: this.route,
              });
            } else {
              // in rest of the cases redirect to login page
              this.authenticationService.logout();
            }
          });
        } else {
          // server side error handler
          this.viewAlertHtml("error", "", this.serverSideErrorHandler(err));
        }
        const error = (err && err.error && err.error.message) || err.statusText;
        return throwError(() => new Error(error));
      })
    );
  }

  /**
   * Created By  : Sambit Kumar Dalai
   * Created On  : 15-05-2022
   * Description : server side error handler.
   **/
  serverSideErrorHandler(error: any) {
    let errorMessage: string = "";

    if (+error?.status === 401) {
      errorMessage += `<i class="bi bi-arrow-right text-danger"></i> Your session has expired. Please log in. 
        <br>`;
    }
    if (error?.statusText === "Unknown Error") {
      errorMessage += `<i class="bi bi-arrow-right text-danger"></i>Something went wrong, Please try later or contact support. 
      <br>`;
    }

    // custom errors
    if (error.error?.msg) {
      // if error message is string format
      if (typeof error.error.msg === "string") {
        errorMessage +=
          '<i class="bi bi-arrow-right text-danger"></i> ' +
          error.error.msg +
          `<br>`;
      }
      // if object format
      if (typeof error.error?.msg === "object") {
        // ==== convert object to array
        const result: any = Object.keys(error.error.msg).map((key) => [
          error.error.msg[key],
        ]);
        // if error message is array format
        result.map(
          (message: string) =>
            (errorMessage +=
              '<i class="bi bi-arrow-right text-danger"></i> ' +
              message +
              `<br>`)
        );
      }
    }

    // default errors
    if (error.error?.message) {
      errorMessage +=
        '<i class="bi bi-arrow-right text-danger"></i> ' +
        error.error.message +
        `<br>`;
    }
    return errorMessage;
  }
}
