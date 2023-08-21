import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
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
export function loadConfig(
  config: AppConfigService,
  configLoader: ConfigurationLoader,
): Function {
  return () => config.loadConfigurations(configLoader);
}

const cubejsOptions = {
  token: '',
  options: { apiUrl : 'https://ekwe.turnkeyafrica.com/cubejs-api/v1' }
}

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
  ],
  imports: [
    BrowserModule,
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
  })
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
