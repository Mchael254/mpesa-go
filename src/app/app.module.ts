import { APP_INITIALIZER, NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ConfigurationLoader } from './core/config/app-config-loader';
import { APP_CONFIG, AppConfigService } from './core/config/app-config-service';
import { HomeComponent } from './features/auth/home/home.component';
import { SharedModule } from './shared/shared.module';
import {ConfirmDialogModule} from "primeng/confirmdialog";
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {ChartModule} from "primeng/chart";
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {HttpClient} from '@angular/common/http';
import { HttpLoaderFactory } from './shared/utils/httpLoaderFactory';
import { CommonModule } from '@angular/common';
import { NgxAwesomePopupModule, ToastNotificationConfigModule, ToastPositionEnum, ToastProgressBarEnum, ToastUserViewTypeEnum } from '@costlydeveloper/ngx-awesome-popup';
import {NgbModule, NgbTooltipModule} from '@ng-bootstrap/ng-bootstrap';

export function loadConfig(
  config: AppConfigService,
  configLoader: ConfigurationLoader,
): Function {
  return () => config.loadConfigurations(configLoader);
}

// const cubejsOptions = {
//   token: '',
//   options: { apiUrl : 'https://ekwe.turnkeyafrica.com/cubejs-api/v1' }
// }

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    
  
  ],
  imports: [
    CommonModule,
    NgxAwesomePopupModule.forRoot(
      {
        colorList: {
          primary  : '#ff9e00', // optional
          secondary: '#989ea5', // optional
          info     : '#2f8ee5', // optional
          success  : '#3caea3', // optional
          warning  : '#ffc107', // optional
          danger   : '#fa8989', // optional
          light    : '#fbfbfb', // optional
          dark     : '#343a40', // optional
          customOne: '#34fa40', // optional
          customTwo: '#343f40'  // optional (up to custom five)
         }
      }
    ), // Essential, mandatory main module.
    ToastNotificationConfigModule.forRoot({
      toastCoreConfig: {
        toastPosition: ToastPositionEnum.TOP_FULL_WIDTH, // check API documentation ToastPositionEnum
        progressBar: ToastProgressBarEnum.INCREASE, // check API documentation ToastprogressBarEnum
        toastUserViewType: ToastUserViewTypeEnum.STANDARD, // check API documentation toastUserViewTypeEnum
        buttonPosition: 'right', // check API documentation VerticalPosition
        textPosition: 'right', // check API documentation VerticalPosition
        confirmLabel: 'Confirm', // default confirmation button label
        declineLabel: 'Decline', // default declination button label
        autoCloseDelay: 300, // Milliseconds it will be ignored if buttons are included.
        disableIcon: true, // Disable icon by default
        allowHtmlMessage: true, // Allow HTML content in message by default

        // Optional default dispatch object.
        dispatch: {  // Optional default dispatch object.
           title: 'Default title',
           message: 'Default message'
        },
     },
    }), // Essential, mandatory toast module.
    ToastNotificationConfigModule.forRoot( {
      globalSettings: { allowedNotificationsAtOnce: 2 }
    }),
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    SharedModule.forRoot(),
    ConfirmDialogModule,
    FontAwesomeModule,
    ChartModule,
    TranslateModule.forRoot({
      loader: {
          provide: TranslateLoader,
          useFactory: HttpLoaderFactory,
          deps: [HttpClient]
      }
  }),
    NgbModule,
    NgbTooltipModule
  ],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: loadConfig,
      deps: [AppConfigService, ConfigurationLoader],
      multi: true,
    },
    {
      provide: APP_CONFIG,
      useFactory: (config: AppConfigService) => config.config,
      deps: [AppConfigService],
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
