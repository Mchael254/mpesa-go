import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { UtilService } from "../../services";
import {LANGUAGES, LanguagesDto} from "../../data/common/languages-dto";

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

  languages: LanguagesDto[] = LANGUAGES;


}
