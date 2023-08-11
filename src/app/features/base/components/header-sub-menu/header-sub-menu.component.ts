import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MenuService } from '../../services/menu.service';
import { SidebarMenu } from '../../model/sidebar.menu';
import { Logger } from 'src/app/shared/services';
import { Router } from '@angular/router';

const log = new Logger("HeaderSubMenuComponent")
@Component({
  selector: 'app-header-sub-menu',
  templateUrl: './header-sub-menu.component.html',
  styleUrls: ['./header-sub-menu.component.css'],
  encapsulation: ViewEncapsulation.None

})
export class HeaderSubMenuComponent implements OnInit {
  defaultSidebar: SidebarMenu | undefined;
  administationSubMenuList: SidebarMenu[];
  teamSubMenuList: SidebarMenu[];
  claimSubMenuList: SidebarMenu[];
  reinsuranceubMenuList: SidebarMenu[];
  accountSubMenuList: SidebarMenu[];

constructor(private menuService: MenuService, private router:Router){
  this.defaultSidebar = {name: 'Summary', value: "DEFAULT", link: './dashboard'}
}


ngOnInit(): void {


  this.administationSubMenuList = this.menuService.administationSubMenuList();
  this.teamSubMenuList = this.menuService.teamSubMenuList();
  this.claimSubMenuList = this.menuService.teamSubMenuList();
  this.reinsuranceubMenuList = this.menuService.teamSubMenuList();
  this.accountSubMenuList = this.menuService.accountSubMenuList();
}

dynamicSideBarMenu(sidebarMenu: SidebarMenu, isLink = false) {
  if(isLink){
    this.router.navigate([sidebarMenu.link])
  }else{
  this.menuService.updateSidebarMainMenu(sidebarMenu.value)
  }
}

}
