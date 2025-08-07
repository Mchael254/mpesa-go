import { Component, ViewEncapsulation } from '@angular/core';
import { MenuService } from '../../services/menu.service';
import { SidebarMenu } from '../../model/sidebar.menu';
import { Router } from '@angular/router';
import { AutoUnsubscribe } from '../../../../shared/services/AutoUnsubscribe';
import {UtilService} from "../../../../shared/services";

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

  constructor(private menuService: MenuService, private router: Router, private utilService: UtilService) {
    this.menuService.sidebarMainMenuRead.subscribe((data) => {
      this.sidebarMainMenuList = data;
    });
  }

  clickURL(url: string) {
    if (url === '/home/gis/quotation/quick-quote'){
     this.utilService.clearSessionStorageData()
    }
    if (url?.length > 0) this.router.navigate([url]);
  }
 
//   toggleMenuItem(item: SidebarMenu | any) {
//     // Toggle the expanded state
//     if (item.nameSlug) {
//       this.expandedItems[item.nameSlug] = !this.expandedItems[item.nameSlug];
//     }

//     // If there's a URL, navigate to it
//     if (item.link) {
//       this.clickURL(item.link);
//     }
//   }

//   isExpanded(nameSlug: string): boolean {
//     return this.expandedItems[nameSlug] || false;
//   }

//   isCurrentRoute(url: string): boolean {
//     return this.router.url === url;
//   }
// }
 /**
   * Toggles the visibility of a sidebar menu item, creating an accordion effect
   * at every level of the menu. When an item is opened, its siblings at the
   * same level are automatically closed.
   * @param {SidebarMenu | any} clickedItem The menu item that was clicked.
   * @param {Array<SidebarMenu | any>} siblingGroup The array of items that are siblings to the clicked item.
   */
   toggleMenuItem(
    clickedItem: SidebarMenu | any,
    siblingGroup: Array<SidebarMenu | any>
  ) {
    const slug = clickedItem.nameSlug;
    if (!slug) {
      if (clickedItem.link) {
        this.clickURL(clickedItem.link);
      }
      return;
    }

    // Determine the intended state of the clicked item.
    const willBeOpen = !this.expandedItems[slug];

    // --- Core Accordion Logic ---
    // 1. Close all siblings of the clicked item.
    siblingGroup.forEach((sibling) => {
      // Don't close the item we are about to open.
      if (sibling.nameSlug !== slug && sibling.nameSlug) {
        this.expandedItems[sibling.nameSlug] = false;
      }
    });

    // 2. Toggle the state of the item that was actually clicked.
    this.expandedItems[slug] = willBeOpen;

    // 3. Navigate if the item has a direct link.
    if (clickedItem.link) {
      this.clickURL(clickedItem.link);
    }
  }

  isExpanded(nameSlug: string): boolean {
    return !!this.expandedItems[nameSlug];
  }

  isCurrentRoute(url: string): boolean {
    return this.router.url === url;
  }
}
