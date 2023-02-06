import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Data, Router } from "@angular/router";

@Component({
  selector: "app-page-not-found",
  templateUrl: "./page-not-found.component.html",
  styleUrls: ["./page-not-found.component.css"],
})
export class PageNotFoundComponent implements OnInit {
  constructor(private route: ActivatedRoute, private router: Router) {
    localStorage.clear();
    sessionStorage.clear();
  }

  ngOnInit(): void {
    // clear queryparams
    this.router.navigate(["."], { relativeTo: this.route, queryParams: {} });
  }
}
