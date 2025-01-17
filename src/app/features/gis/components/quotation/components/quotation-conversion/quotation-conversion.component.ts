import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SidebarMenu } from 'src/app/features/base/model/sidebar.menu';
import { MenuService } from 'src/app/features/base/services/menu.service';

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
  searchCriteriaArray: any = [
    { value: 'option 1' },
    { value: 'option 2' },
    { value: 'option 3' },
    { value: 'option 4' },
    { value: 'option 5' },
  ];
   quotationSubMenuList: SidebarMenu[];

  constructor(
    private menuService: MenuService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.quotationSubMenuList = this.menuService.quotationSubMenuList();

    this.dynamicSideBarMenu(this.quotationSubMenuList[3]);
  }


  dynamicSideBarMenu(sidebarMenu: SidebarMenu): void {
    if (sidebarMenu.link.length > 0) {
      this.router.navigate([sidebarMenu.link]); // Navigate to the specified link
    }
    this.menuService.updateSidebarMainMenu(sidebarMenu.value); // Update the sidebar menu
  }
}
