import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { SessionStorageService } from '../session-storage/session-storage.service';
import { ToastService } from '../toast/toast.service';
import { StringManipulation } from '../../../features/lms/util/string_manipulation';
import { SESSION_KEY } from '../../../features/lms/util/session_storage_enum';

@Injectable()
export class Error401Interceptor implements HttpInterceptor {
  constructor(
    private router: Router,
    private session_storage: SessionStorageService,
    private toast_service: ToastService
  ) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      tap(
        () => {},
        (err: any) => {
          let session = StringManipulation.returnNullIfEmpty(
            this.session_storage.getItem('SESSION_TOKEN')
          );
          let tenantId = StringManipulation.returnNullIfEmpty(
            this.session_storage.get(SESSION_KEY.API_TENANT_ID)
          );
          if (err instanceof HttpErrorResponse) {
            if (err.status !== 401) {
              return;
            }
            if (session && tenantId) {
              this.toast_service.info('Logging Out!!', 'Bad Credential');
            }
            this.session_storage.clear();
            this.session_storage.clear_store();
            this.router.navigate(['/auth']);
          }
        }
      )
    );
  }
}
