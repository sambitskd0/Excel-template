/**
* Created By  : Deepti Ranjan
* Created On  : 09-06-2022
* Module Name : common
* Description : To get menu authorization type and respective tabs or buttons
**/

import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})

export class PrivilegeHelper {
  
  menus: any;
  linkArr:any;
  currentPageName:any;
  tbPageName:any;
  btPageName:any;
  findGLMenu :any;
  findPLMenus :any;
  findTBMenus :any
  findBTMenus :any
  moduleName:any;

  constructor(
    public router: Router
  ){ }
  
  /* Created By : Deepti Ranjan || Created On : 08-06-2022 || Service method Name : PrimaryLinkPrivilege || Description: return link privilege */
  PrimaryLinkPrivilege(pageUrl:any, linkType: any =""){
    this.menus = JSON.parse(sessionStorage.getItem("userMenus") || '{}');

    this.linkArr = pageUrl.split('/');
    this.moduleName = this.linkArr[2];
    this.currentPageName = this.moduleName + "/" + this.linkArr[3];

    this.findGLMenu= this.menus.find((item: any) => {
      return item.gl_path===this.moduleName;
    });

    if(this.findGLMenu != null){
      this.findPLMenus= this.findGLMenu.pl_links.find((item: any) => {
        return item.pl_path===this.currentPageName;
      });

      if(this.findPLMenus != null)
      {
        if(linkType == "TB"){
          this.tbPageName = this.moduleName + "/" + this.linkArr[3] + "/" + this.linkArr[4];
          this.findTBMenus= this.findPLMenus.pl_tabs.find((item: any) => {
            return item.tb_path===this.tbPageName;
          });

          if(this.findTBMenus != null) {
            return this.findTBMenus.tb_privilege;
          } else {
            return false;
          }   

        } else if(linkType == "BT"){
          this.btPageName = this.moduleName + "/" + this.linkArr[3] + "/" + this.linkArr[4];
          this.findBTMenus= this.findPLMenus.pl_buttons.find((item: any) => {
            return item.bt_path===this.btPageName;
          });

          if(this.findBTMenus != null) {
            return this.findBTMenus.bt_privilege;
          } else {
            return false;
          }          
        } else{
          return this.findPLMenus.pl_privilege;
        }            
      }  
      else 
        return false;
    }
    return false;
  }

  /* Created By : Deepti Ranjan || Created On : 10-06-2022 || Service method Name : PrimaryLinkTabs || Description: return tabs of primary link */
  PrimaryLinkTabs(pageUrl:any){
    this.menus = JSON.parse(sessionStorage.getItem("userMenus") || '{}');
    this.moduleName = pageUrl.split('/')[2];
    this.currentPageName = this.moduleName + "/" + pageUrl.split('/')[3];

    this.findGLMenu= this.menus.find((item: any) => {
      return item.gl_path===this.moduleName;
    });

    if(this.findGLMenu != null){ 

      this.findPLMenus= this.findGLMenu.pl_links.find((item: any) => {
        return item.pl_path===this.currentPageName;
      });

      if(this.findPLMenus != null)
        return this.findPLMenus.pl_tabs;
      else 
        return false;
    }
    return false;
  }

  /* Created By : Deepti Ranjan || Created On : 10-06-2022 || Service method Name : PrimaryLinkTabs || Description: return tabs of primary link */
  PrimaryLinkTabNames(pageUrl:any){
    this.menus = JSON.parse(sessionStorage.getItem("userMenus") || '{}');
    this.moduleName = pageUrl.split('/')[2];
    this.currentPageName = this.moduleName + "/" + pageUrl.split('/')[3];

    this.findGLMenu= this.menus.find((item: any) => {
      return item.gl_path===this.moduleName;
    });

    if(this.findGLMenu != null){ 

      this.findPLMenus= this.findGLMenu.pl_links.find((item: any) => {
        return item.pl_path===this.currentPageName;
      });

      if(this.findPLMenus != null)
      {
        let tabNames: any = [];
        this.findPLMenus.pl_tabs.forEach((tabs: any) => {         
          tabNames.push(tabs.tb_name);
        });
        return tabNames;
      } else {
        return false;
      }         
    }
    return false;
  }

  /* Created By : Deepti Ranjan || Created On : 14-06-2022 || Service method Name : checkPLNotExists || Description: check if primary link exist in URL */
  checkPLNotExists(pageUrl:any){
    this.menus = JSON.parse(sessionStorage.getItem("userMenus") || '{}');
    this.linkArr = pageUrl.split('/');

    if(this.linkArr[3] == null){
      return true;
    }else{
      return false;
    }
  }

  /* Created By : Deepti Ranjan || Created On : 14-06-2022 || Service method Name : navigateToFirstPrimaryLink || Description: return first primary link of global link */
  navigateToFirstPrimaryLink(pageUrl:any){
    this.menus = JSON.parse(sessionStorage.getItem("userMenus") || '{}');
    this.linkArr = pageUrl.split('/');

    if(this.linkArr[3] == null){

      this.findGLMenu= this.menus.find((item: any) => {
        return item.gl_path===this.linkArr[2];
      });
    
      if(this.findGLMenu != null && this.findGLMenu.pl_links.length>0){  
        return this.findGLMenu.pl_links[0].pl_path;      
      }

    }

  }
}
