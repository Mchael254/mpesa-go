import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';
import { finalize } from 'rxjs/operators';

@Injectable()
// export class ApiSpinnerInterceptor implements HttpInterceptor {

//   constructor(private spinner: NgxSpinnerService) {}

//   intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
//     // Show the spinner when the request starts
//     this.spinner.show('download_view');

//     return next.handle(req).pipe(
//       // Hide the spinner when the request completes
//       finalize(() => this.spinner.hide('download_view'))
//     );
//   }
// }
export class ApiSpinnerInterceptor implements HttpInterceptor {

  constructor(private spinner: NgxSpinnerService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const skipSpinnerFor = 'aireader/ai-helper/document-extract';

    const shouldSkip = req.url.includes(skipSpinnerFor);

    if (!shouldSkip) {
      this.spinner.show('download_view');
    }

    return next.handle(req).pipe(
      finalize(() => {
        if (!shouldSkip) {
          this.spinner.hide('download_view');
        }
      })
    );
  }
}
