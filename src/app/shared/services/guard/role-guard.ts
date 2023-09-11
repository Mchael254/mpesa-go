/****************************************************************************
 **
 ** Author: Justus Muoka
 **
 ****************************************************************************/

import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  CanActivateChild,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { combineLatest, forkJoin, Observable, of } from 'rxjs';
import { map, mergeMap, take } from 'rxjs/operators';
import { AuthService } from '../auth.service';
import { Logger } from '../logger/logger.service';
import { UtilService } from '../util/util.service';
import { retryIfLoadingUser } from '../../utils';

const log  = new Logger('RoleGuard');

/**
 * Checks if expected roles are in the authorities provided.
 * @param {string[]} authorities the roles to match against.
 * @param {string[]} expectedRoles the expected roles. One must be available
 * @returns {boolean} returns true if a single role exist
 */
export function checkAuthorities(
  authorities: string[],
  expectedRoles: string[]
): boolean {
  if (!authorities || !expectedRoles) {
    return false;
  }

  let found = 0;
  for (let i = 0; i < authorities.length; i++) {
    if (expectedRoles.indexOf(authorities[i]) !== -1) {
      found += 1;
    }
  }

  return found !== 0;
}

@Injectable({
  providedIn: 'root',
})
export class RoleGuard implements CanActivate, CanActivateChild {
  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {

    return this.authService.isAuthenticated.pipe(
      retryIfLoadingUser(this.authService.isLoading$),
      take(1),
      mergeMap((isAuth) =>
        combineLatest([of(isAuth), this.authService.currentUser$])
      ),
      map(([isAuth, currentUser]) => {
        const authorities = (
          currentUser.authorities || []
        ).map((value, index, array) => value.authority.toLocaleLowerCase());
        // const expectedRole = (route.data['expectedRoles'][0] || '').toLocaleLowerCase();
        const expectedRoles = (route.data['expectedRoles'] || []).map((value:any) =>
          value.toLocaleLowerCase()
        );

        log.info(
          `User authenticated => ${isAuth} and has authority => ${checkAuthorities(
            authorities,
            expectedRoles
          )}`
        );
        if (isAuth && !checkAuthorities(authorities, expectedRoles)) {
          log.info(`Navigating to products page`);
          return this.router.createUrlTree(['/home/dashboard']);
        }

        if (!isAuth || !checkAuthorities(authorities, expectedRoles)) {
          this.authService.redirectUrl = state.url || this.authService.redirectUrl || '/home/dashboard';
          return this.router.createUrlTree(['/auth']);
        }

        return isAuth;
      })
    );
  }

  canActivateChild(
    childRoute: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    return this.canActivate(childRoute, state);
  }
}
