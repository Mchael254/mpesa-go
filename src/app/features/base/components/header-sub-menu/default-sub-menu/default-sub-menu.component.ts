import { Component, OnInit } from '@angular/core';
import { SidebarMenu } from "../../../model/sidebar.menu";
import { Router } from "@angular/router";
import { MenuService } from "../../../services/menu.service";
import { FormBuilder, FormGroup } from "@angular/forms";
import { EntityService } from "../../../../entities/services/entity/entity.service";
import { Logger, UtilService } from "../../../../../shared/services";
import { QuotationsService } from 'src/app/features/gis/components/quotation/services/quotations/quotations.service';

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
  idSearchTermPolicy: string = '';
  searchTerm: string;
  searchResults: any[] = [];
  showResults: boolean = false;
  recentSearches: any[] = [];
  showRecents: boolean = false;


  constructor(
    private router: Router,
    private menuService: MenuService,
    private fb: FormBuilder,
    private entityService: EntityService,
    private utilService: UtilService,
    private quotationService: QuotationsService
  ) {
    this.defaultSidebar = { name: 'Summary', value: "DEFAULT", link: '/home/dashboard' }
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
    const stored = JSON.parse(sessionStorage.getItem('recentQuotations') || '[]');
    this.recentSearches = stored;
  }

  dynamicSideBarMenu(sidebarMenu: SidebarMenu) {
    if (sidebarMenu.link.length > 0) { this.router.navigate([sidebarMenu.link]) }
    this.menuService.updateSidebarMainMenu(sidebarMenu.value)
  }

  navLink(menuLink: string): void {
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

    this.entityService.searchTermObject.set({ ...searchFormValue, fromSearchScreen: true });
    this.navLink('/home/entity/list');
  }
onSearch(): void {
  if (!this.idSearchTerm || this.idSearchTerm.trim() === '') {
    return;
  }

  this.quotationService.searchQuotation(this.idSearchTerm).subscribe({
    next: (res: any) => {
      log.debug('[QuotationDetailsComponent] Search response:', res);
      const results = res?._embedded || []; 
      this.searchResults= results.slice(0,2);
      this.showResults = true;
      this.idSearchTerm = '';
      this.saveRecentSearches(this.searchResults);
    },
    error: (err) => {
      console.error('[QuotationDetailsComponent] Quotation search error:', err);
      this.searchResults = [];
      this.showResults = true;
    }
  });
}

saveRecentSearches(results: any[]): void {
  const stored = JSON.parse(sessionStorage.getItem('recentQuotations') || '[]');

  // Merge new + old, but avoid duplicates by quotationNumber
  const merged = [...results, ...stored].reduce((acc: any[], curr: any) => {
    if (!acc.find(q => q.quotationNumber === curr.quotationNumber)) {
      acc.push(curr);
    }
    return acc;
  }, []);

  // Limit stored recent searches (optional: top 5)
  sessionStorage.setItem('recentQuotations', JSON.stringify(merged.slice(0, 5)));

  this.recentSearches = merged.slice(0, 5); // update local variable for UI
}

showRecentSearches(): void {
  const stored = JSON.parse(sessionStorage.getItem('recentQuotations') || '[]');
  this.recentSearches = stored.slice(0, 2); // ✅ show only top 2
  this.showResults = false; // hide live search results
  this.showRecents = true;
}

onSelectQuotation(item: any): void {
  this.idSearchTerm = '';
  this.searchResults = [];
  this.showResults = false;
  this.showRecents = false;

  sessionStorage.setItem('selectedQuotation', JSON.stringify(item));

  
  this.router.navigate(['/home/gis/quotation/quotation-summary']);
}




  closeModal(): void {
    const modal = document.getElementById('NewQuoteModal');
    if (modal) {
      modal.classList.remove('show')
      modal.style.display = 'none';
    }
    this.utilService.clearSessionStorageData()
  }

}
