// import { Injectable } from '@angular/core';
// import {
//   HttpRequest,
//   HttpHandler,
//   HttpEvent,
//   HttpInterceptor,
// } from '@angular/common/http';
// import { Observable } from 'rxjs';
// import { environment } from '../../../../environments/environment';
// import { SessionStorageService } from '../session-storage/session-storage.service';
// import { SESSION_KEY } from '../../../features/lms/util/session_storage_enum';
// import { StringManipulation } from '../../../features/lms/util/string_manipulation';
// import { ToastService } from '../toast/toast.service';

// @Injectable()
// export class TenantIdInterceptor implements HttpInterceptor {
//   constructor(
//     private session_service: SessionStorageService,
//     private toast: ToastService
//   ) {}

//   intercept(
//     request: HttpRequest<unknown>,
//     next: HttpHandler
//   ): Observable<HttpEvent<unknown>> {
//     if (request.url.includes('/auth/otp')) {
//       this.toast.info('Incorrect OTP, Try again!!', 'Incorrect OTP');
//       // If it's for "/auth/otp", don't modify the request and return it directly.
//       return next.handle(request);
//     }
//     // You can retrieve the tenantId from wherever it is stored in your application.
//     let tenantId = StringManipulation.returnNullIfEmpty(
//       this.session_service.get(SESSION_KEY.API_TENANT_ID)
//     );
//     if (tenantId === null || tenantId === undefined) {
//       tenantId = environment.TENANT_ID;
//     }
//     // Clone the request and add the 'X-TenantId' header.
//     const modifiedRequest = request.clone({
//       setHeaders: {
//         'X-Tenantid': tenantId,
//       },
//     });
//     // Pass the modified request to the next handler.
//     return next.handle(modifiedRequest);
//   }
// }
