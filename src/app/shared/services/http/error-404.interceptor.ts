import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable } from 'rxjs';
import {tap} from 'rxjs/operators';
import {Router} from '@angular/router';
import { SessionStorageService } from '../session-storage/session-storage.service';
import { ToastService } from '../toast/toast.service';

@Injectable()
export class Error401Interceptor implements HttpInterceptor {
  constructor(private router: Router, private session_storage: SessionStorageService, private toast_service: ToastService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe( tap(() => {},
      (err: any) => {
      if (err instanceof HttpErrorResponse) {
        if (err.status !== 401) {return;}
        this.toast_service.info('Logging Out!!', 'Expired Login Token')
        this.session_storage.clear();
        this.session_storage.clear_x();
        this.router.navigate(['/auth']);
      }
    }));
  }
}