import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MenuService } from '../../services/menu.service';
import { SidebarMenu } from '../../model/sidebar.menu';
import { Logger } from 'src/app/shared/services';
import { Router } from '@angular/router';
import { AutoUnsubscribe } from 'src/app/shared/services/AutoUnsubscribe';

const log = new Logger("HeaderSubMenuComponent")
@Component({
  selector: 'app-header-sub-menu',
  templateUrl: './header-sub-menu.component.html',
  styleUrls: ['./header-sub-menu.component.css'],
  encapsulation: ViewEncapsulation.None

})
@AutoUnsubscribe
export class HeaderSubMenuComponent implements OnInit {
  defaultSidebar: SidebarMenu | undefined;
  administationSubMenuList: SidebarMenu[];
  teamSubMenuList: SidebarMenu[];
  claimSubMenuList: SidebarMenu[];
  reinsuranceubMenuList: SidebarMenu[];
  accountSubMenuList: SidebarMenu[];
  quotationSubMenuList: SidebarMenu[];
  analyticsSubMenuList: SidebarMenu[];
  searchTerm: any;
  nameSearchTerm:any;
  idSearchTerm:any;

  constructor(private menuService: MenuService, private router:Router){
    this.defaultSidebar = {name: 'Summary', value: "DEFAULT", link: '/home/dashboard'}
  }


  ngOnInit(): void {
    this.administationSubMenuList = this.menuService.administationSubMenuList();
    this.teamSubMenuList = this.menuService.teamSubMenuList();
    this.claimSubMenuList = this.menuService.teamSubMenuList();
    this.reinsuranceubMenuList = this.menuService.teamSubMenuList();
    this.accountSubMenuList = this.menuService.accountSubMenuList();
    this.quotationSubMenuList = this.menuService.quotationSubMenuList();
    this.analyticsSubMenuList = this.menuService.analyticsSubMenuList();
  }

  dynamicSideBarMenu(sidebarMenu: SidebarMenu) {
    if(sidebarMenu.link.length > 0){this.router.navigate([sidebarMenu.link])}
    this.menuService.updateSidebarMainMenu(sidebarMenu.value)
  }


  navLink(menuLink:string){
    this.router.navigate([menuLink])
  }

  onSearch(){
      this.searchTerm = this.nameSearchTerm || this.idSearchTerm;
      localStorage.setItem('searchTerm', this.searchTerm)
      this.nameSearchTerm = '';
      this.idSearchTerm = '';
      this.navLink('/home/entity/list');
  }

  openModal() {
    // Open the Bootstrap modal programmatically
    const modal = document.getElementById('NewQuoteModal');
    if (modal) {
      modal.classList.add('show');
    }
  }
  closeModal() {
    // Close the Bootstrap modal programmatically
    const modal = document.getElementById('NewQuoteModal');
    if (modal) {
      modal.classList.remove('show'); // Remove the 'show' class to hide the modal
      modal.setAttribute('aria-hidden', 'true');
    }
  }
}
