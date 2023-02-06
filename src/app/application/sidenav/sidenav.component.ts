import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonserviceService } from 'src/app/core/services/commonservice.service';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.css'],
})
export class SidenavComponent implements OnInit {
  pageNamepm: any = '';
  menus: any = [];

  constructor(
    private commonserviceService: CommonserviceService, 
    private router: Router
  ) {
  }

  ngOnInit(): void {
    
    this.pageNamepm = this.router.url.split('/')[2];
    // // window.alert(this.pageNamepm);
    this.menus = JSON.parse(sessionStorage.getItem("userMenus") || '[]');
    this.checkNavNotification();
  }

  checkNavNotification(){
    this.commonserviceService.routeNotification.subscribe((res: any) => {
      console.log(res);
      
      this.pageNamepm = res;
      this.menus = JSON.parse(sessionStorage.getItem("userMenus") || '[]');
    });
  }
}
