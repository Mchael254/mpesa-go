import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { GlobalMessagingService } from 'src/app/shared/services/messaging/global-messaging.service';

@Injectable({
  providedIn: 'root'
})
export class CommonMethodsService {

  constructor(
  private translate:TranslateService,
    private globalMessagingService:GlobalMessagingService
  ) { }
   /**
   * @description A centralized helper method to handle and display API errors.
   * @param err The error object returned from an HttpClient call.
   */
  handleApiError(err: any): void {
    const customMessage = this.translate.instant('fms.errorMessage');
    const backendError =
      err.error?.msg || err.error?.error || err.error?.status || err.statusText;
    this.globalMessagingService.displayErrorMessage(
      customMessage,
      backendError
    );
  }
}
