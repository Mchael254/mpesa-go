import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { UtilService } from "../../services";

@Component({
  selector: 'app-language-selector',
  templateUrl: './language-selector.component.html',
  styleUrls: ['./language-selector.component.css'],
  standalone : false
})
export class LanguageSelectorComponent {

  defaultLanguage: string = 'fi fi-gb fis';

  constructor(private translate: TranslateService,
              private utilService: UtilService) {

  }

  selectLanguage(value){
    this.translate.use(value.code)
    this.defaultLanguage = value.class

    this.utilService.setLanguage(value.code);
  }

  languages = [
    { code: 'de', class: 'fi fi-de fis', lang:"German"},
    { code: 'ke', class: 'fi fi-ke fis', lang:"Swahili"},
    { code: 'en', class: 'fi fi-gb fis', lang:"English"},
    { code: 'fr', class: 'fi fi-fr fis', lang:"French"},
    { code: 'cn', class: 'fi fi-cn fis', lang:"Mandarin"},
    { code: 'es', class: 'fi fi-es fis', lang:"Espanyol"}
  ];


}
