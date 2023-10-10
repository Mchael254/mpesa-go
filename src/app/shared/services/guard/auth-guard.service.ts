/****************************************************************************
 **
 ** Author: Justus Muoka
 **
 ****************************************************************************/

/**
 * AuthGuardService
 * @description Activates routes if user is authenticated
 * @export class AuthGuardService
 * @implements {CanActivate}
 * @implements {CanActivateChild}
 * @param {Router} router
 * @param {AuthService} authService
 * @param {JwtService} jwtService
 * @returns {boolean | UrlTree}
 */

import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  CanActivateChild, Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs/internal/Observable';
import { map, take } from 'rxjs/operators';
import { JwtService } from '../jwt/jwt.service';
import { AuthService } from '../auth.service';

@Injectable()
export class AuthGuard implements CanActivate, CanActivateChild {
  constructor(private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    return this.checkAuthentication();
  }

  canActivateChild(
    childRoute: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    return this.checkAuthentication();
  }

  private checkAuthentication(): boolean {
    // Check if the SESSION_TOKEN exists in session storage
    const sessionToken = sessionStorage.getItem('SESSION_TOKEN');
    if (sessionToken) {
      // User is authenticated
      return true;
    } else {
      // User is not authenticated, redirect to login or any other route
      this.router.navigate(['/auth']); // Change '/login' to your login page route
      return false;
    }
  }
}
// export class AuthGuard implements CanActivate, CanActivateChild {
//   constructor(private router: Router, private authService: AuthService, private jwtService: JwtService) {
//   }

//   canActivate(
//     route: ActivatedRouteSnapshot,
//     state: RouterStateSnapshot
//   ):
//     | Observable<boolean | UrlTree>
//     | Promise<boolean | UrlTree>
//     | boolean
//     | UrlTree {
//     return this.authService.isAuthenticated.pipe(
//       take(1),
//       map((isAuth) => {
//         const redirectUrl = route.data['redirectUrl'];
//         if (!isAuth) {
//           this.authService.redirectUrl = state.url || redirectUrl;
//           return this.router.createUrlTree(['/auth']);
//         }

//         return isAuth;
//       })
//     );
//   }

//   canActivateChild(
//     childRoute: ActivatedRouteSnapshot,
//     state: RouterStateSnapshot,
//   ):
//     | Observable<boolean | UrlTree>
//     | Promise<boolean | UrlTree>
//     | boolean
//     | UrlTree {
//     return this.canActivate(childRoute, state);
//   }
// }
