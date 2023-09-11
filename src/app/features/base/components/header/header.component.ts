import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AutoUnsubscribe } from 'src/app/shared/services/AutoUnsubscribe';
import { AuthService } from 'src/app/shared/services/auth.service';
import { LocalStorageService } from 'src/app/shared/services/local-storage/local-storage.service';
import { Logger } from '../../../../shared/services/logger/logger.service';

const log = new Logger("HeaderComponent");

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  encapsulation: ViewEncapsulation.None

})
@AutoUnsubscribe
export class HeaderComponent implements OnInit {
  defaultLanguage: string = 'fi fi-gb fis';
  user: any;

  constructor(
    private translate: TranslateService,
    private router: Router,
    private route: ActivatedRoute,
    private localStorageService: LocalStorageService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.user = this.localStorageService.getItem("loginUserProfile")
    this.getUserImage();
  }

    getUserImage() {
    if (this.user?.image) {
      return this.user.image;
    } else {
      const initials = this.user.name.split(' ').map((name: string) => name.charAt(0)).join('');
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      canvas.width = 40;
      canvas.height = 40;
      if (context) {
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const radius = Math.min(centerX, centerY);

        context.fillStyle = '#00529b';
        context.arc(centerX, centerY, radius, 0, 2 * Math.PI);
        context.fill();

        context.font = '16px Roboto';
        context.fillStyle = '#000000';
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        context.fillText(initials, centerX, centerY);

        context.strokeStyle = '#FFFFFF'; // Set the border color to white
        context.lineWidth = 2; // Set the border width
        context.stroke();
      }
      return canvas.toDataURL();
    }
  }

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

  navigateAccount() {
    this.router.navigate(['/home/administration'], { relativeTo: this.route, queryParams: { showTabs: 'false' } })
  }


  logout() {
    log.info('Logging out..');
    this.authService.purgeAuth(true);
  }

}
