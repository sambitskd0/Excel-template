/**
 * Created By  : Sambit Kumar Dalai
 * Created On  : 01-08-2022
 * Description : Divya app dynamic route handle.
 **/

import { Component, OnInit } from "@angular/core";
import { JwtHelperService } from "@auth0/angular-jwt";
import { ActivatedRoute, Data, Router } from "@angular/router";
import { AlertHelper } from "src/app/core/helpers/alert-helper";

@Component({
  selector: "app-divya",
  templateUrl: "./divya.component.html",
  styleUrls: ["./divya.component.css"],
})
export class DivyaComponent implements OnInit {
  token!: any;

  constructor(
    private route: ActivatedRoute,
    private jwtHelper: JwtHelperService,
    private router: Router,
    private alertHelper: AlertHelper
  ) {
    this.getToken();
  }

  ngOnInit(): void {
    // clear token details on page load
    localStorage.clear();
    sessionStorage.clear();
    // end
  }

  // get token from url query params
  getToken() {
    this.route.queryParams.subscribe((params: Data) => {
      if (params["token"] && params["token"]?.length) {
        try {
          this.token = this.jwtHelper.decodeToken(params["token"]);
          // if jwt token not expired
          if (this.jwtHelper.isTokenExpired(params["token"]) === false) {
            sessionStorage.setItem("mobileAuthToken", params["token"]); // set token
            this.dynamicRouteHandler(params["token"]);
          } else {
            // if jwt token expired
            this.alertHelper
              .viewAlert("error", "", "Your session has expired.")
              .then(() => {
                this.router.navigate(["./pageNotFound"], {
                  relativeTo: this.route,
                });
              });
          }
        } catch (error) {
          if (error) {
            this.router.navigate(["./pageNotFound"], {
              relativeTo: this.route,
            });
          }
        }
      } else {
        this.router.navigate(["../pageNotFound"], {
          relativeTo: this.route,
        });
      }
    });
  }

  dynamicRouteHandler(token: string) {
    // if 1 then resource teacher
    if (+this.token["userDesignationType"] === 1) {
      const path = this.getRoutePath(+this.token["userDesignationType"]);

      this.router.navigate([`./${path}`], {
        queryParams: { token: token },
        relativeTo: this.route,
      });
    }
    // if 2 then officer
    if (+this.token["userDesignationType"] === 2) {
      const path = this.getRoutePath(+this.token["userDesignationType"]);

      this.router.navigate([`./${path}`], {
        queryParams: { token: token },
        relativeTo: this.route,
      });
    }
  }

  getRoutePath(userType: number): any {
    let routeObj!: any;
    switch (userType) {
      // Resource teacher (Special educator and it has official works)
      case 1:
        routeObj = {
          1: "schoolSurveyTeacher",
          2: "kgbvTeacher",
          3: "resourceCenterTeacher",
          4: "artificialLimbCenterTeacher",
          8: "surveyWork",
          9: "camp",
          10: "trainingTeacher",
          11: "homeBasedEducationTeacher",
          12: "anyOther",
        };

        // if category id is 7 then routing will be according to subcategory id (resource teacher)
        if (
          +this.token["activityTypeId"] &&
          +this.token["activityTypeId"] === 7 &&
          +this.token["activitySubTypeId"]
        ) {
          return routeObj[+this.token["activitySubTypeId"]];
        } else if (
          +this.token["activityTypeId"] &&
          +this.token["activityTypeId"] <= 6
        ) {
          return routeObj[+this.token["activityTypeId"]];
        } else {
          this.router.navigate(["../pageNotFound"], {
            relativeTo: this.route,
          });
        }
        break;

      //  officer
      case 2:
        routeObj = {
          1: "schoolSurvey",
          2: "kgbv",
          3: "resourceCenter",
          4: "artificialLimbCenter",
          5: "training",
          6: "homeBasedEducation",
        };

        if (
          +this.token["activityTypeId"] &&
          +this.token["activityTypeId"] <= 6
        ) {
          return routeObj[+this.token["activityTypeId"]];
        } else {
          this.router.navigate(["../pageNotFound"], {
            relativeTo: this.route,
          });
        }
        break;
      default:
        this.router.navigate(["../pageNotFound"], {
          relativeTo: this.route,
        });
        break;
    }
  }
}
