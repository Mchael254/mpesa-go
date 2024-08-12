import {
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { MenuService } from '../../services/menu.service';
import { SidebarMenu } from '../../model/sidebar.menu';
import { Router } from '@angular/router';
import { EntityService } from '../../../entities/services/entity/entity.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Logger } from '../../../../shared/services';
import { AutoUnsubscribe } from '../../../../shared/services/AutoUnsubscribe';
import { SESSION_KEY } from '../../../lms/util/session_storage_enum';
import { SessionStorageService } from '../../../../shared/services/session-storage/session-storage.service';

const log = new Logger('HeaderSubMenuComponent');
@Component({
  selector: 'app-header-sub-menu',
  templateUrl: './header-sub-menu.component.html',
  styleUrls: ['./header-sub-menu.component.css'],
  encapsulation: ViewEncapsulation.None,
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
  fmsSubMenuList: SidebarMenu[];
  searchTerm: any;
  nameSearchTerm: any;
  idSearchTerm: any;
  close_modal: boolean = false;
  policySubMenuList: SidebarMenu[];
  reinsuranceSubMenuList: SidebarMenu[];

  searchAccountForm: FormGroup;
  entityType: string;

  constructor(
    private menuService: MenuService,
    private router: Router,
    private entityService: EntityService,
    private fb: FormBuilder,
    private session_storage: SessionStorageService
  ) {
    this.defaultSidebar = {
      name: 'Summary',
      value: 'DEFAULT',
      link: '/home/dashboard',
    };
  }

  ngOnInit(): void {
    this.administationSubMenuList = this.menuService.administationSubMenuList();
    this.teamSubMenuList = this.menuService.teamSubMenuList();
    this.policySubMenuList = this.menuService.policySubMenuList();
    this.reinsuranceSubMenuList = this.menuService.reinsuranceSubMenuList();
    this.claimSubMenuList = this.menuService.teamSubMenuList();
    this.reinsuranceubMenuList = this.menuService.teamSubMenuList();
    this.accountSubMenuList = this.menuService.accountSubMenuList();
    this.quotationSubMenuList = this.menuService.quotationSubMenuList();
    this.analyticsSubMenuList = this.menuService.analyticsSubMenuList();
    this.fmsSubMenuList = this.menuService.fmsSubMenuList();
    this.createSearchAccountForm();
    this.getEntityType();
  }

  getEntityType(): void {
    const entityType = this.session_storage.get(SESSION_KEY.ENTITY_TYPE);

    switch (entityType) {
      case 'ADMIN':
        this.entityType = 'ADMIN';
        break;
      case 'AGENT':
        this.entityType = 'AGENT';
        break;
      case 'MEMBER':
        this.entityType = 'MEMBER';
        break;
      default:
        this.entityType = 'USR';
    }
  }

  createSearchAccountForm(): void {
    this.searchAccountForm = this.fb.group({
      searchIdInput: [''],
      searchNameInput: [''],
    });
  }

  navLink(menuLink: string) {
    this.router.navigate([menuLink]);
  }

  // openModal() {
  //   const modal = document.getElementById('NewQuoteModal');
  //   if (modal) {
  //     modal.classList.add('show');
  //     modal.style.display = 'block';
  //   }
  // }
}
