/**
 * Created By  : Sambit Kumar Dalai
 * Created On  : 15-05-2022
 * Description : Interceptor for handling authentication.
 **/

import { Injectable } from "@angular/core";
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from "@angular/common/http";
import { Observable } from "rxjs";

import { AlertHelper } from "../helpers/alert-helper";

@Injectable()
export class AuthInterceptor extends AlertHelper implements HttpInterceptor {
  constructor() {
    super();
  }

  customHandler: any;
  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    // 1) Bypass interceptor
    if (request.headers.get("skipInterCept") === "true") {
      const newHeaders = request.headers.delete("skipInterCept");
      const newRequest = request.clone({ headers: newHeaders });
      return next.handle(newRequest);
    } //end

    // 2) Decide header type
    if (sessionStorage.getItem("jwtToken")?.length) {
      this.customHandler = this.addAuthTokenWeb(request); // if jwttoken exist then add it to header
    } else if (sessionStorage.getItem("mobileAuthToken")?.length) {
      this.customHandler = this.addAuthTokenMob(request); // if mobile auth token present
    } else {
      this.customHandler = this.customHeader(request); // else use default header
    }

    // 3) finally make request
    return next.handle(this.customHandler);
  }

  /**
   * Created By  : Sambit Kumar Dalai
   * Created On  : 15-05-2022
   * Description : 2.a) add token to header for web
   **/
  addAuthTokenWeb(request: HttpRequest<any>) {
    let headerObj: any;
    // if content type is multipart/form-data
    if (
      request.headers.has("contentType") &&
      request.headers.get("contentType") === "formData"
    ) {
      headerObj = {
        authorization: `Bearer ${sessionStorage.getItem("jwtToken")}`,
        authAccess: `Bearer ${sessionStorage.getItem("access_token")}`,
        authToken: `Bearer ${sessionStorage.getItem("jwtToken")}`,
        accessToken: `Bearer ${sessionStorage.getItem("access_token")}`,
      };
    } else {
      // else for rest use application/json
      headerObj = {
        authorization: `Bearer ${sessionStorage.getItem("jwtToken")}`,
        authToken: `Bearer ${sessionStorage.getItem("jwtToken")}`,
        authAccess: `Bearer ${sessionStorage.getItem("access_token")}`,
        accessToken: `Bearer ${sessionStorage.getItem("access_token")}`,
        "Content-Type": "application/json",
      };
    }
    return request.clone({
      setHeaders: headerObj,
    });
  }

  /**
   * Created By  : Sambit Kumar Dalai
   * Created On  : 15-05-2022
   * Description : 2.c) add token to header for mobile
   **/
  addAuthTokenMob(request: HttpRequest<any>) {
    return request.clone({
      setHeaders: {
        authorization: `Bearer ${sessionStorage.getItem("mobileAuthToken")}`,
        authToken: `Bearer ${sessionStorage.getItem("mobileAuthToken")}`,
        "Content-Type": "application/json",
      },
    });
  }

  /**
   * Created By  : Sambit Kumar Dalai
   * Created On  : 15-05-2022
   * Description : 2.b) use default header
   **/
  customHeader(request: HttpRequest<any>) {
    if (request.body.jwtToken) {
      return request.clone({
        setHeaders: {
          "Content-Type": "application/json",
          authorization: `Bearer ${request.body.jwtToken}`,
        },
      });
    } else {
      return request.clone({
        setHeaders: {
          "Content-Type": "application/json",
        },
      });
    }
  }
}
