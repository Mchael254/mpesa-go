/* eslint-disable no-shadow */
/* eslint-disable prefer-arrow/prefer-arrow-functions */
import { Injectable, InjectionToken } from '@angular/core';
import { from, Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AppConfig } from './app-config';
import { ConfigurationLoader } from './app-config-loader';


export const APP_CONFIG = new InjectionToken<AppConfig>('app.configuration');

@Injectable(
  {providedIn: 'root'},
)
export class AppConfigService{
  private appConfig!: AppConfig;
  constructor(){}

  get config(): AppConfig{
    return this.appConfig;
  }
  loadConfigurations(configLoader: ConfigurationLoader): Promise<any>{
    return new Promise<void>((resolve, reject) => {
      from(configLoader.fetchConfiguration())
        .pipe(catchError((error: any) => throwError(error)))
        .subscribe(
          (data) => {
            this.appConfig = data;
            resolve();
          },
          (error) => {
            reject();
          },
          () => resolve(),
        );
    });
  }

}

function providedIn(providedIn: any, arg1: string) {
  throw new Error('Function not implemented.');
}
