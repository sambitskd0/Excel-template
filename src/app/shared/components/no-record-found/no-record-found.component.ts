/**
 * Created By  : Sambit Kumar Dalai
 * Created On  : 20-05-2022
 * Description : common no record found component.
 **/

import { Component, OnInit, Input } from "@angular/core";

@Component({
  selector: "app-no-record-found",
  templateUrl: "./no-record-found.component.html",
  styleUrls: ["./no-record-found.component.css"],
})
export class NoRecordFoundComponent implements OnInit {
  @Input() noRecordFoundMessage!: string;
  constructor() {}

  ngOnInit(): void {}
}
