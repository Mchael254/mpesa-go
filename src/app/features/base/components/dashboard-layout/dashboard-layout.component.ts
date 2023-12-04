import { Component, ViewEncapsulation } from '@angular/core';
import { Logger } from 'src/app/shared/services';
const log = new Logger('DashboardLayoutComponent');

@Component({
  selector: 'app-dashboard-layout',
  templateUrl: './dashboard-layout.component.html',
  styleUrls: ['./dashboard-layout.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class DashboardLayoutComponent {

  shouldShowSideBar: boolean = false;

  toggleSideBar(showSideBar: boolean) {
    this.shouldShowSideBar =  showSideBar;
    log.info(`toggle side bar clicked`, showSideBar);
  }
}
