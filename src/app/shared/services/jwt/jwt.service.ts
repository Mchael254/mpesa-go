/****************************************************************************
 **
 ** Author: Justus Muoka
 **
 ****************************************************************************/

import {Inject, Injectable} from '@angular/core';
import {UtilService} from '../util.service';
import {APP_BASE_HREF} from '@angular/common';
import {Logger} from '../logger.service';
import {BrowserStorage} from "../storage";
// import {CookieService} from "ngx-cookie-service";
import {OauthToken} from "../../data/auth";

const log = new Logger('JwtService');

const SESSION_TOKEN = 'SESSION_TOKEN';
const REFRESH_TOKEN = 'REFRESH_TOKEN';
const SESSION_TOKEN_EXPIRES_AT = 'SESSION_TOKEN_EXPIRES_AT';

@Injectable({
    providedIn: 'root',
})
export class JwtService {
        constructor(
        private browserStorage: BrowserStorage,
        // private cookieService: CookieService,
        private utilService: UtilService,
        @Inject(APP_BASE_HREF) private baseHref: string
    ) {
    }

    getRefreshToken(): string | null {
        let refreshToken = null;
        // if (this.cookieService.check(REFRESH_TOKEN)) {
        //     refreshToken = this.cookieService.get(REFRESH_TOKEN);
        // }
        return refreshToken;
    }

    getTokenExpiry(): string | null {
        let expiry!: string;
        // if (this.cookieService.check(SESSION_TOKEN_EXPIRES_AT)) {
        //     expiry = this.cookieService.get(SESSION_TOKEN_EXPIRES_AT);
        // }
        return expiry;
    }

    getToken(): string | null {
        let myToken = null;
        // if (this.cookieService.check(SESSION_TOKEN)) {
        //     myToken = this.cookieService.get(SESSION_TOKEN);
        // }
        return myToken;
    }
/*TODO: Work on this later*/
    saveToken(token: OauthToken) {
        if (this.utilService.isEmpty(token)) {
            this.destroyToken();
        } else {
            const path = this.tokenPath;

            const expiryInDays = token.expires_in / 60;
            log.info(
                `EXPIRES IN ${token.expires_in}, EXXPIRY ${expiryInDays}`
            );
            const domain = this.utilService.isIE() ? null : location.hostname;
            const isHttps = location?.protocol?.startsWith("https") || false
            // this.cookieService.set(
            //     SESSION_TOKEN,
            //     token.access_token,
            //     expiryInDays,
            //     path,
            //     domain,
            //     isHttps,
            //     'Strict'
            // );

            const refreshTokenExpiry = token.refresh_expires_in ? token.refresh_expires_in / 60 : 30; // 30 days
            // this.cookieService.set(
            //     REFRESH_TOKEN,
            //     token.refresh_token,
            //     refreshTokenExpiry,
            //     path,
            //     domain,
            //     isHttps,
            //     'Strict'
            // );

            const dateExpires: Date = new Date(
                new Date().getTime() + token.expires_in * 1000
            );

            // this.cookieService.set(
            //     SESSION_TOKEN_EXPIRES_AT,
            //     dateExpires.toISOString(),
            //     expiryInDays,
            //     path,
            //     domain,
            //     isHttps,
            //     'Strict'
            // );
            // log.info('SET token session expiry cookie', format(parseISO(this.getTokenExpiry()), "dd-MM-yyyy HH:mm:ss"));
        }
    }

    destroyToken() {
        this.browserStorage.clearObj('SESSION_TOKEN');

        const path = this.tokenPath;

        const domain = this.utilService.isIE() ? null : location.hostname;
        // this.cookieService.delete(SESSION_TOKEN, path, domain);
        // this.cookieService.delete(SESSION_TOKEN_EXPIRES_AT, path, domain);
    }

    destroyRefreshToken() {
        const domain = this.utilService.isIE() ? null : location.hostname;
        const path = this.tokenPath;
        // this.cookieService.delete(REFRESH_TOKEN, path, domain);
    }

    get tokenPath(): string {
        let path = this.baseHref.length < 1 ? '/' : '/';
        if (this.baseHref.length === 1 && this.baseHref.startsWith('/')) {
            path = this.baseHref;
        } else if (this.baseHref.startsWith('/') && this.baseHref.endsWith('/')) {
            path = this.baseHref;
        } else if (this.baseHref.startsWith('/') && !this.baseHref.endsWith('/')) {
            path = this.baseHref + '/';
        } else if (!this.baseHref.startsWith('/') && this.baseHref.endsWith('/')) {
            path = '/' + this.baseHref;
        } else {
            path = '/' + this.baseHref + '/';
        }

        return path;
    }
}
