import { Component, ViewEncapsulation } from '@angular/core';
import { MenuService } from '../../services/menu.service';
import { SidebarMenu } from '../../model/sidebar.menu';
import { Router } from '@angular/router';
import { AutoUnsubscribe } from '../../../../shared/services/AutoUnsubscribe';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
  encapsulation: ViewEncapsulation.None,
})
@AutoUnsubscribe
export class SidebarComponent {
  sidebarMainMenuList: SidebarMenu[];
  lastVisitedMenuKey = 'lastVisitedMenu';
  expandedItems: { [key: string]: boolean } = {};

  constructor(private menuService: MenuService, private router: Router) {
    this.menuService.sidebarMainMenuRead.subscribe((data) => {
      this.sidebarMainMenuList = data;
    });
  }

  clickURL(url: string) {
    if (url?.length > 0) this.router.navigate([url]);
  }

  toggleMenuItem(item: SidebarMenu | any) {
    // Toggle the expanded state
    if (item.nameSlug) {
      this.expandedItems[item.nameSlug] = !this.expandedItems[item.nameSlug];
    }

    // If there's a URL, navigate to it
    if (item.link) {
      this.clickURL(item.link);
    }
  }

  isExpanded(nameSlug: string): boolean {
    return this.expandedItems[nameSlug] || false;
  }

  isCurrentRoute(url: string): boolean {
    return this.router.url === url;
  }
}
