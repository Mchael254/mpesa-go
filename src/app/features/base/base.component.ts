import {Component, OnInit} from '@angular/core';
// import {NbMenuItem, NbMenuService} from "@nebular/theme";
import {MenuService} from "./services/menu.service";
import { MENU_ITEMS } from './util/base-menu';

@Component({
  selector: 'ngx-pages',
  styleUrls: ['base.component.scss'],
  templateUrl: 'base.component.html',
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
