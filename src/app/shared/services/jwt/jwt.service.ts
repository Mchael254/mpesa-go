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
import {OauthToken} from "../../data/auth";
import {SessionStorageService} from "../session-storage/session-storage.service";

const log = new Logger('JwtService');

const SESSION_TOKEN = 'SESSION_TOKEN';
const REFRESH_TOKEN = 'REFRESH_TOKEN';
const SESSION_TOKEN_EXPIRES_AT = 'SESSION_TOKEN_EXPIRES_AT';
const REFRESH_TOKEN_EXPIRY = 'REFRESH_TOKEN_EXPIRY';
const SESSION_IS_HTTPS_SECURED = 'SESSION_IS_HTTPS_SECURED';
const SESSION_DOMAIN = 'SESSION_DOMAIN';

@Injectable({
    providedIn: 'root',
})
export class JwtService {
        constructor(
        private browserStorage: BrowserStorage,
        // private cookieService: CookieService,
        private utilService: UtilService,
        private sessionStorage: SessionStorageService,
        @Inject(APP_BASE_HREF) private baseHref: string
    ) {
    }

    getRefreshToken(): string | null {
        let refreshToken = null;
        // if (this.cookieService.check(REFRESH_TOKEN)) {
        //     refreshToken = this.cookieService.get(REFRESH_TOKEN);
        // }

        refreshToken = this.sessionStorage.getItem(REFRESH_TOKEN);
        return refreshToken;
    }

    getTokenExpiry(): string | null {
        let expiry!: string;
        // if (this.cookieService.check(SESSION_TOKEN_EXPIRES_AT)) {
        //     expiry = this.cookieService.get(SESSION_TOKEN_EXPIRES_AT);
        // }
        return this.sessionStorage.getItem(SESSION_TOKEN_EXPIRES_AT);
    }

    getToken(): string | null {
        let myToken = null;
        // if (this.cookieService.check(SESSION_TOKEN)) {
        //     myToken = this.cookieService.get(SESSION_TOKEN);
        // }
        return this.sessionStorage.getItem(SESSION_TOKEN);
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
            const refreshTokenExpiry = token.refresh_expires_in ? token.refresh_expires_in / 60 : 30; // 30 days

            const dateExpires: Date = new Date(
            new Date().getTime() + token.expires_in * 1000
            );

            this.sessionStorage.setItem(SESSION_TOKEN,token.access_token );
            this.sessionStorage.setItem(REFRESH_TOKEN, token.refresh_token);
            this.sessionStorage.setItem(SESSION_TOKEN_EXPIRES_AT, dateExpires.toISOString());
            this.sessionStorage.setItem(REFRESH_TOKEN_EXPIRY, refreshTokenExpiry);
            this.sessionStorage.setItem(SESSION_IS_HTTPS_SECURED, isHttps);
            this.sessionStorage.setItem(SESSION_DOMAIN, domain);


            // this.cookieService.set(
            //     SESSION_TOKEN,
            //     token.access_token,
            //     expiryInDays,
            //     path,
            //     domain,
            //     isHttps,
            //     'Strict'
            // );

            // this.cookieService.set(
            //     REFRESH_TOKEN,
            //     token.refresh_token,
            //     refreshTokenExpiry,
            //     path,
            //     domain,
            //     isHttps,
            //     'Strict'
            // );



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
        this.sessionStorage.removeItem(SESSION_TOKEN);

        const path = this.tokenPath;

        const domain = this.utilService.isIE() ? null : location.hostname;
        // this.cookieService.delete(SESSION_TOKEN, path, domain);
        // this.cookieService.delete(SESSION_TOKEN_EXPIRES_AT, path, domain);
    }

    destroyRefreshToken() {
        const domain = this.utilService.isIE() ? null : location.hostname;
        const path = this.tokenPath;

        this.sessionStorage.removeItem(REFRESH_TOKEN);
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
