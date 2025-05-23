import { Component } from '@angular/core';
import {TranslateService} from "@ngx-translate/core";
import {Logger} from "./shared/services";
import {AuthService} from "./shared/services/auth.service";

const log = new Logger('AppComponent');
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {

  constructor(private translate: TranslateService, private authService: AuthService) {
    this.authService.getUserAssignedRoles()
    translate.setDefaultLang('en');
    translate.use('en');
  }}
