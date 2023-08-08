import { ChangeDetectorRef, Component, OnInit, SecurityContext, ViewEncapsulation } from '@angular/core';
import { MenuService } from '../../services/menu.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { SidebarMenu } from '../../model/sidebar.menu';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
  encapsulation: ViewEncapsulation.None

})
export class SidebarComponent {
  sidebarMainMenuList: SidebarMenu[];
  openedSublistIndex: number = -1;
  constructor(private menuService:MenuService, private router: Router){
    this.menuService.sidebarMainMenuRead.subscribe(data => {this.sidebarMainMenuList = data;}
    );
  }


clickURL(url:string){
  if(url.length > 0 ) this.router.navigate([url]);
}

}
