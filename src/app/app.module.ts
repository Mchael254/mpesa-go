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
