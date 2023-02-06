import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-common-tab',
  templateUrl: './common-tab.component.html',
  styleUrls: ['./common-tab.component.css']
})
export class CommonTabComponent implements OnInit {
  id: any = "";
  tab1: boolean = false;
  tab2: boolean = false;
  constructor(
    private route: Router,
    private router: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.id = this.router.snapshot.params["encId"];
    if(!this.id){
      this.tab1 = true;
      this.tab2 = false;
    }
    else{
      this.tab2 = true;
      this.tab1 = false;
    }
  }

}
