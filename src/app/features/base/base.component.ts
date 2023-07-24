import {Component, OnInit, ViewEncapsulation} from '@angular/core';
// import {NbMenuItem, NbMenuService} from "@nebular/theme";
import {MenuService} from "./services/menu.service";
import { MENU_ITEMS } from './util/base-menu';

@Component({
  selector: 'app-base',
  styleUrls: ['base.component.scss'],
  templateUrl: 'base.component.html',
  encapsulation: ViewEncapsulation.None

})
export class BaseComponent implements OnInit {
  menu: [] = [];
  // NbMenuItem[] =[];
  constructor(
    private menuService: MenuService,
  ) {
  }

  ngOnInit(): void {
    // this.baseService.castMenu.subscribe(menu => this.menu = menu);
    // this.menu = MENU_ITEMS;
  }
}
/*export class PagesComponent {
  menu = MENU_ITEMS;
}*/
