import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";

@Component({
  selector: "app-dashboardlanding",
  templateUrl: "./dashboardlanding.component.html",
  styleUrls: ["./dashboardlanding.component.css"],
})
export class DashboardlandingComponent implements OnInit {
  constructor(public router: Router, public route: ActivatedRoute) {
    this.router.navigate(["../dashboard"], {
      relativeTo: this.route,
    });
  }

  ngOnInit(): void {}
}
