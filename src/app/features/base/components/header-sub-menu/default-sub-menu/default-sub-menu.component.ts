import {Component, OnInit} from '@angular/core';
import {SidebarMenu} from "../../../model/sidebar.menu";
import {Router} from "@angular/router";
import {MenuService} from "../../../services/menu.service";
import {FormBuilder, FormGroup} from "@angular/forms";
import {EntityService} from "../../../../entities/services/entity/entity.service";
import {Logger} from "../../../../../shared/services";

const log = new Logger("HeaderSubMenuComponent")


@Component({
  selector: 'app-default-sub-menu',
  templateUrl: './default-sub-menu.component.html',
  styleUrls: ['./default-sub-menu.component.css']
})
export class DefaultSubMenuComponent implements OnInit {

  defaultSidebar: SidebarMenu | undefined;
  accountSubMenuList: SidebarMenu[];
  quotationSubMenuList: SidebarMenu[];
  reinsuranceSubMenuList: SidebarMenu[];
  administationSubMenuList: SidebarMenu[];
  analyticsSubMenuList: SidebarMenu[];
  fmsSubMenuList: SidebarMenu[];
  teamSubMenuList: SidebarMenu[];
  policySubMenuList: SidebarMenu[];
  claimSubMenuList: SidebarMenu[];

  searchAccountForm: FormGroup;
  nameSearchTerm: string;
  idSearchTerm: string;
  searchTerm: string;

  constructor(
    private router:Router,
    private menuService: MenuService,
    private fb: FormBuilder,
    private entityService: EntityService,
  ) {
    this.defaultSidebar = {name: 'Summary', value: "DEFAULT", link: '/home/dashboard'}
  }


  ngOnInit(): void {
    this.accountSubMenuList = this.menuService.accountSubMenuList();
    this.quotationSubMenuList = this.menuService.quotationSubMenuList();
    this.reinsuranceSubMenuList = this.menuService.reinsuranceSubMenuList();
    this.administationSubMenuList = this.menuService.administationSubMenuList();
    this.analyticsSubMenuList = this.menuService.analyticsSubMenuList();
    this.fmsSubMenuList = this.menuService.fmsSubMenuList();
    this.teamSubMenuList = this.menuService.teamSubMenuList();
    this.policySubMenuList = this.menuService.policySubMenuList();
    this.claimSubMenuList = this.menuService.teamSubMenuList();
    this.createSearchAccountForm();
  }

  dynamicSideBarMenu(sidebarMenu: SidebarMenu) {
    if(sidebarMenu.link.length > 0){this.router.navigate([sidebarMenu.link])}
    this.menuService.updateSidebarMainMenu(sidebarMenu.value)
  }

  navLink(menuLink:string): void {
    this.router.navigate([menuLink])
  }

  createSearchAccountForm(): void {
    this.searchAccountForm = this.fb.group({
      searchIdInput: [''],
      searchNameInput: ['']
    });
  }

  displaySearchValues(): void {
    const searchFormValue = this.searchAccountForm.getRawValue();
    log.info('search value', searchFormValue);

    this.entityService.searchTermObject.set({...searchFormValue, fromSearchScreen: true});
    this.navLink('/home/entity/list');
  }

  onSearch(): void{
    this.searchTerm = this.nameSearchTerm || this.idSearchTerm;
    localStorage.setItem('searchTerm', this.searchTerm)
    this.nameSearchTerm = '';
    this.idSearchTerm = '';
    this.navLink('/home/entity/list');
  }

  closeModal(): void {
    const modal = document.getElementById('NewQuoteModal');
    if (modal) {
      modal.classList.remove('show')
      modal.style.display = 'none';
    }
  }

}
