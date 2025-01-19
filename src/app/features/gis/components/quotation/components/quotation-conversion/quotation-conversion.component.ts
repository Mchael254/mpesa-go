import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SidebarMenu } from 'src/app/features/base/model/sidebar.menu';
import { MenuService } from 'src/app/features/base/services/menu.service';
import { DropdownFilterOptions } from 'primeng/dropdown';

interface Country {
  name: string;
  code: string;
}

interface Client {
  id: string;
  name: string;
  type: string;
}

interface Product {
  id: string;
  name: string;
}

interface Status {
  id: string;
  name: string;
}

@Component({
  selector: 'app-quotation-conversion',
  templateUrl: './quotation-conversion.component.html',
  styleUrls: ['./quotation-conversion.component.css']
})
export class QuotationConversionComponent {
  dateFormat: any;
  coverFrom: any;
  coverTo: any;
  todaysDate: string;
  minDate: Date | undefined;
  quotationSubMenuList: SidebarMenu[];

  selectedCountry: Country;
  selectedClient: Client;
  selectedProduct: Product;
  selectedStatus: Status;
  filterValue = '';

  countries: Country[];
  clients: Client[];
  products: Product[];
  status: Status[];

  constructor(
    private menuService: MenuService,
    private router: Router,
  ) {
    this.countries = [
      {name: 'Australia', code: 'AU'},
      {name: 'Brazil', code: 'BR'},
      {name: 'China', code: 'CN'},
      {name: 'Egypt', code: 'EG'},
      {name: 'France', code: 'FR'},
      {name: 'Germany', code: 'DE'},
      {name: 'India', code: 'IN'},
      {name: 'Japan', code: 'JP'},
      {name: 'Spain', code: 'ES'},
      {name: 'United States', code: 'US'}
    ];

    this.clients = [
      { id: 'C101', name: 'John Smith', type: 'Individual' },
      { id: 'C102', name: 'Acme Corporation', type: 'Corporate' },
      { id: 'C103', name: 'Jane Doe', type: 'Individual' },
      { id: 'C104', name: 'Universal Traders Ltd', type: 'Corporate' },
      { id: 'C105', name: 'Blue Ocean Logistics', type: 'Transportation' }
    ];

    this.products = [
      { id: 'P001', name: 'Comprehensive Car Insurance' },
      { id: 'P002', name: 'Homeowners Insurance' },
      { id: 'P003', name: 'Health Insurance' },
      { id: 'P004', name: 'Travel Insurance' },
      { id: 'P005', name: 'Professional Liability Insurance' }
    ];

    this.status = [
      { id: 'S001', name: 'Active' },
      { id: 'S002', name: 'Pending' },
      { id: 'S003', name: 'Expired' },
      { id: 'S004', name: 'Lapsed' },
      { id: 'S005', name: 'Cancelled' }
    ];
  }

  ngOnInit(): void {
    this.quotationSubMenuList = this.menuService.quotationSubMenuList();

    this.dynamicSideBarMenu(this.quotationSubMenuList[3]);

  }

  myResetFunction(options: DropdownFilterOptions) {
    options.reset();
    this.filterValue = '';
  }

  dynamicSideBarMenu(sidebarMenu: SidebarMenu): void {
    if (sidebarMenu.link.length > 0) {
      this.router.navigate([sidebarMenu.link]); // Navigate to the specified link
    }
    this.menuService.updateSidebarMainMenu(sidebarMenu.value); // Update the sidebar menu
  }
}
