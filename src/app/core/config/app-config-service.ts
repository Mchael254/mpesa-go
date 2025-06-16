/* eslint-disable no-shadow */
/* eslint-disable prefer-arrow/prefer-arrow-functions */
import { Injectable, InjectionToken } from '@angular/core';
import { from, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AppConfig } from './app-config';
import { ConfigurationLoader } from './app-config-loader';
import { PaymentMethodDTO } from 'src/app/features/gis/components/quotation/data/quotationsDTO';


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
  get organization() {
    return this.appConfig?.organization;
  }

  get paymentMethods():  PaymentMethodDTO[] {
    return this.appConfig?.organization?.paymentMethods || [];
  }

  get footerInfo(): any {
    return this.appConfig?.organization?.footerInfo || {};
  }
  loadConfigurations(configLoader: ConfigurationLoader): Promise<any>{
    return new Promise<void>((resolve, reject) => {
      from(configLoader.fetchConfiguration())
        .pipe(catchError((error: any) => throwError(error)))
        .subscribe(
          (data) => {
            // console.log('APP CONFIG>>>>>>>>');
            // console.log(data);

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
