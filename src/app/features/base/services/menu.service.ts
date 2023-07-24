
import { Injectable} from '@angular/core';
import {BehaviorSubject, Subject} from 'rxjs';
// import {NbMenuItem} from "@nebular/theme";
import {MENU_ITEMS} from "../util/base-menu";

@Injectable({
  providedIn: 'root'
})
export class MenuService{
  constructor(){}
  // private menu = new BehaviorSubject<NbMenuItem[]>(MENU_ITEMS);
  castMenu = new Subject().asObservable();
  // this.menu.asObservable();

  updateSideMenu(newMenu:any){
    // this.menu.next(newMenu);
  }
}
