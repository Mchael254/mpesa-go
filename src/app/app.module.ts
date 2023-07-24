import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ConfigurationLoader } from './core/config/app-config-loader';
import { AppConfigService } from './core/config/app-config-service';
import { HomeComponent } from './features/auth/home/home.component';

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
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
