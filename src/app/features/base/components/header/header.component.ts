import { Component, ViewEncapsulation } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { AutoUnsubscribe } from 'src/app/shared/services/AutoUnsubscribe';
import {AuthService} from "../../../../shared/services/auth.service";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  encapsulation: ViewEncapsulation.None

})
@AutoUnsubscribe
export class HeaderComponent {
  defaultLanguage: string = 'fi fi-gb fis';
  constructor(
    private translate:TranslateService,
    private authService: AuthService
  ){}

  selectLanguage(value){
    this.translate.use(value.code)
    this.defaultLanguage = value.class

  }

  languages = [
    { code: 'de', class: 'fi fi-de fis', lang:"German"},
    { code: 'ke', class: 'fi fi-ke fis', lang:"Swahili"},
    { code: 'en', class: 'fi fi-gb fis', lang:"English"},
    { code: 'fr', class: 'fi fi-fr fis', lang:"French"},
    { code: 'cn', class: 'fi fi-cn fis', lang:"Mandarin"},
    { code: 'es', class: 'fi fi-es fis', lang:"Espanyol"}
  ];

  logout(): void {
    this.authService.purgeAuth();
  }
}
