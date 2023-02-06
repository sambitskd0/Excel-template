import { Component, OnInit } from '@angular/core';
import { Constant } from 'src/app/shared/constants/constant';
import { Router } from '@angular/router';
import { CommonserviceService } from 'src/app/core/services/commonservice.service';
import { PrivilegeHelper } from 'src/app/core/helpers/privilege-helper';

@Component({
  selector: 'app-incentive',
  templateUrl: './incentive.component.html',
  styleUrls: ['./incentive.component.css']
})
export class IncentiveComponent implements OnInit {

  primaryLink:any;
  config = new Constant();
  
  constructor(
    private router:Router,
    private commonService: CommonserviceService, 
    private privilegeHelper: PrivilegeHelper, 
  ) { 
    const pageUrl:any = this.router.url;  
    if(this.privilegeHelper.checkPLNotExists(pageUrl)){
      this.commonService.verifyLinkPermission(pageUrl, this.config.linkType[1], this.config.privilege[4]);
      
      // Start Redirect to first primary link
      this.primaryLink = this.privilegeHelper.navigateToFirstPrimaryLink(pageUrl); 
      if(this.primaryLink != null){
        this.router.navigateByUrl("/Application/"+this.primaryLink);
      }
      // End Redirect to first primary link      
    }
  }

  ngOnInit(): void {
  }

}
