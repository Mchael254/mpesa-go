import {
  Component,
  ElementRef, OnInit,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import { MenuService } from '../../services/menu.service';
import { SidebarMenu } from '../../model/sidebar.menu';
import { Logger } from 'src/app/shared/services';
import { Router } from '@angular/router';
import { AutoUnsubscribe } from 'src/app/shared/services/AutoUnsubscribe';
import {EntityService} from "../../../entities/services/entity/entity.service";
import {FormBuilder, FormGroup} from "@angular/forms";

const log = new Logger("HeaderSubMenuComponent")
@Component({
  selector: 'app-header-sub-menu',
  templateUrl: './header-sub-menu.component.html',
  styleUrls: ['./header-sub-menu.component.css'],
  encapsulation: ViewEncapsulation.None

})
@AutoUnsubscribe
export class HeaderSubMenuComponent implements OnInit {
  @ViewChild('NewQuoteModal') modalElement: ElementRef;

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
  close_modal: boolean = false;
  policySubMenuList: SidebarMenu[];

  searchAccountForm: FormGroup;

  constructor(private menuService: MenuService, private router:Router,private entityService: EntityService,
              private fb: FormBuilder,){
    this.defaultSidebar = {name: 'Summary', value: "DEFAULT", link: '/home/dashboard'}
  }



  ngOnInit(): void {
    this.administationSubMenuList = this.menuService.administationSubMenuList();
    this.teamSubMenuList = this.menuService.teamSubMenuList();
    this.policySubMenuList = this.menuService.policySubMenuList();
    this.claimSubMenuList = this.menuService.teamSubMenuList();
    this.reinsuranceubMenuList = this.menuService.teamSubMenuList();
    this.accountSubMenuList = this.menuService.accountSubMenuList();
    this.quotationSubMenuList = this.menuService.quotationSubMenuList();
    this.analyticsSubMenuList = this.menuService.analyticsSubMenuList();
    this.createSearchAccountForm();
  }

  createSearchAccountForm(): void {
    this.searchAccountForm = this.fb.group({
      searchIdInput: [''],
      searchNameInput: ['']
    });
  }

  displaySearchValues() {
    const searchFormValue = this.searchAccountForm.getRawValue();
    log.info('search value', searchFormValue);

    this.entityService.searchTermObject.set({...searchFormValue, fromSearchScreen: true});
    this.navLink('/home/entity/list');
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
    const modal = document.getElementById('NewQuoteModal');
    if (modal) {
      modal.classList.add('show');
      modal.style.display = 'block';
    }
  }
  closeModal() {
    const modal = document.getElementById('NewQuoteModal');
    if (modal) {
      modal.classList.remove('show')
      modal.style.display = 'none';
    }
  }
}
