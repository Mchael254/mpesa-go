import { Component, ViewEncapsulation } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { AutoUnsubscribe } from 'src/app/shared/services/AutoUnsubscribe';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  encapsulation: ViewEncapsulation.None

})
@AutoUnsubscribe
export class HeaderComponent {
  defaultLanguage: string = 'fi fi-ng fis';
  constructor(private translate:TranslateService){}

  selectLanguage(value){
    this.translate.use(value.code)
    this.defaultLanguage = value.class

  }

  languages = [
    { code: 'ng', class: 'fi fi-ng fis'},
    { code: 'ke', class: 'fi fi-ke fis'},
    { code: 'en', class: 'fi fi-gb fis'},
    { code: 'fr', class: 'fi fi-fr fis'},
    { code: 'cn', class: 'fi fi-cn fis'}
  ];

}
