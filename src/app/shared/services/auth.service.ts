import {Injectable, OnDestroy} from '@angular/core';
import {BehaviorSubject, Observable, ReplaySubject, throwError} from 'rxjs';
import {concatMap, distinctUntilChanged, take} from 'rxjs/operators';
import {untilDestroyed} from './until-destroyed';
import {BrowserStorage} from "./storage";
import { AccountContact } from '../data/account-contact';
import { ClientAccountContact } from '../data/client-account-contact';
import { WebAdmin } from '../data/web-admin';
import { JwtService } from './jwt/jwt.service';
import { AppConfigService } from '../../core/config/app-config-service';
import { Router } from '@angular/router';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Message } from 'primeng/api';
import { UserCredential, AuthenticationResponse } from 'src/app/features/base/util';
// import "./http/http.service";
import { OauthToken } from '../data/auth';
import {AccountVerifiedResponse} from "../../core/auth/auth-verification";
import {UserDetailsDTO} from 'src/app/features/administration/data/user-details';
import {LocalStorageService} from './local-storage/local-storage.service';
import {Logger} from "./logger/logger.service";
import {UtilService} from "./util/util.service";
import { SessionStorageService } from './session-storage/session-storage.service';
import {StringManipulation} from "../../features/lms/util/string_manipulation";
import { GlobalMessagingService } from './messaging/global-messaging.service';
import { ApiService } from './api/api.service';
import { Profile } from '../data/auth/profile';
import {SESSION_KEY} from "../../features/lms/util/session_storage_enum";


const log = new Logger('AuthService');

/**
 * Provides a base for authentication workflow.
 */

@Injectable({
  providedIn: 'root'
})
export class AuthService implements OnDestroy {
  private currentUserSubject = new BehaviorSubject<Profile>({} as Profile);
  public currentUser$: Observable<Profile> = this.currentUserSubject.asObservable();
  private isAuthenticatedSubject = new ReplaySubject<boolean>(1);
  public isAuthenticated = this.isAuthenticatedSubject.asObservable();
  public isLoadingUserSubject = new BehaviorSubject<boolean>(false);
  public isLoading$ = this.isLoadingUserSubject.asObservable();
  private defaultRedirectUrl = '/home/dashboard';
  private sessionExpiredSubject = new BehaviorSubject<boolean>(false);
  service: {};

  constructor(
    private http: HttpClient,
    private jwtService: JwtService,
    private utilService: UtilService,
    private appConfigService: AppConfigService,
    private router: Router,
    private browserStorage: BrowserStorage,
    private localStorageService: LocalStorageService,
    private session_storage: SessionStorageService,
    private globalMessagingService: GlobalMessagingService,
    private api: ApiService,
  ) {
    this.isAuthenticated.pipe(
      distinctUntilChanged(),
      untilDestroyed(this),
    ).subscribe(_ => {
      this.isLoadingUserSubject.next(false);
    });
  }

 private _redirectUrl: string;

  /**
   * Gets the redirect URL from the browser storage
   * @return {string} The redirect URL
   */
  get redirectUrl(): string {
    return this.browserStorage.getObj('auth_redirect_uri') || this._redirectUrl;
  }

  /**
   * Sets the redirect URL in the browser storage
   * @param value The redirect URL
   */
  set redirectUrl(value: string) {
    this._redirectUrl = value;

    const url: string = value ||  this.defaultRedirectUrl;
    this.browserStorage.storeObj('auth_redirect_uri', url);
  }

  /**
   * Verifies JWT in localstorage with server & load user's info.
   *
   * This runs once on the application
   */
  populate() {
    this.isLoadingUserSubject.next(true);
    // if JWT detected, attempt to get & store user's info
    if (this.jwtService.getToken()) {
      const token = this.jwtService.getToken();
      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      });

      const baseUrl = this.appConfigService.config.contextPath.users_services;
      this.http
        .get<Profile>(
          `/${baseUrl}/administration/users/entity-profile`,
          { headers: headers },
        )
        .subscribe(
          (data: Profile) =>
            this.setAuth(data),
          (err) => this.purgeAuth(),
        );
    } else {
      // remove any potential remnants of previous auth states
      this.purgeAuth();
    }
  }

  /**
   * Sets the authentication data and authenticated status
   * @param user {AccountContact | ClientAccountContact | WebAdmin} The user data
   */
  setAuth(user: Profile) {
    // set current user data into observable
    // if (this.utilService.isUserAdmin(user)) {
    //   this.browserStorage.storeObj('activeUser', 'ADMIN');
    // } else if (this.utilService.isUserAgent(user)) {
    //   this.browserStorage.storeObj('activeUser', 'AGENT');
    // } else if (this.utilService.isUserClient(user)) {
    //   this.browserStorage.storeObj('activeUser', 'CLIENT');
    // }
    this.localStorageService.setItem('loginUserProfile', user);
    this.currentUserSubject.next(user);
    // set isAuthenticated
    this.isAuthenticatedSubject.next(!!user);
  }

  /**
   * Purges the authentication data and authenticated status
   * @param expiredSession {boolean} Whether the session has expired
   */
  purgeAuth(expiredSession: boolean = false) {
    if (this.jwtService.getToken()) {
      const token = this.jwtService.getToken();
      const refreshToken = this.jwtService.getRefreshToken();
      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
        'refresh_token': refreshToken
      });

      // destroy user logged in
      this.destroyUser();
      const baseUrl = this.appConfigService.config.contextPath.auth_services;
      this.http
        .get(`/${baseUrl}/revoke-token`, { headers: headers })
        .subscribe(
          (_) => {
            this.jwtService.destroyRefreshToken();
            // localStorage.clear(); /** TODO: Find better way to handle local/session storage*/
            if (expiredSession) {
              this.sessionExpiredSubject.next(true);
              this.router.navigate(['/auth'],
              //   { queryParams: { 'userType': this.browserStorage.getObj('activeUser') } }).then(r => {
              // }
              );
              // location.reload();
            }
            // else {
            //   this.router
            //     .navigateByUrl('/')
            //     .then((onfulfilled) => {
            //       log.info(`Redirecting to home.`);
            //       location.reload();
            //     })
            //     .catch((error) => log.error(error));
            // }

          },
          (error) => this.destroyUser(),
        );
    } else {
      // destroy user logged in
      this.destroyUser();
    }
  }

  /**
   * Refreshes the authentication token
   */
  attemptRefreshToken() {
    this.isLoadingUserSubject.next(true);
    let headers: HttpHeaders;
      headers = new HttpHeaders({
        Accept: 'application/json',
        entityType: this.session_storage.get(SESSION_KEY.ENTITY_TYPE),
        'X-TenantId': this.session_storage.get(SESSION_KEY.API_TENANT_ID)
      });

    let refresh_token: string = this.jwtService.getRefreshToken();
    // formData.append('grant_type', 'refresh_token');
    // formData.append('refresh_token', `${this.jwtService.getRefreshToken()}`);
    log.info(`${JSON.stringify(this.jwtService.getRefreshToken())}`);

    // destroy user logged in
    this.destroyUser();
    this.refreshAuthToken(refresh_token, headers);
  }

  /**
   * Attempts to authenticate the user
   * @param credentials {UserCredential} The user credentials
   * @param errorCallback {Function} The error callback
   * @return {void}
   */
  attemptAuth(
    credentials: UserCredential,
    errorCallback?: (msg: Message) => void,
  ) {
    this.isLoadingUserSubject.next(true);
    let headers: HttpHeaders;
    headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: 'application/json',
      entityType: this.session_storage.get(SESSION_KEY.ENTITY_TYPE),
      'X-TenantId': this.session_storage.get(SESSION_KEY.API_TENANT_ID)
    });

    this.getAuthToken(credentials, headers, (errMsg) => {
      log.info(`Received Error Message: ${errMsg}`);

      const _msg = <Message>{
        severity: 'error',
        detail: errMsg,
      };

      if (errorCallback) {
        errorCallback(_msg);
      }
    });
  }

  // getAuthVerification

  /**
   * Attempts to authenticate the user
   * @param credentials {UserCredential} The user credentials
   * @param AuthenticationResponse {Function} The data response
   * @param errorCallback {Function} The error callback
   */
  authenticateUser(
    credentials: UserCredential,
    AuthenticationResponse?: (data)  =>void,
    errorCallback?: (msg: Message) => void,
  ) {
    let headers: HttpHeaders;
    headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: 'application/json',
      entityType: this.session_storage.get(SESSION_KEY.ENTITY_TYPE),
      'X-TenantId': this.session_storage.get(SESSION_KEY.API_TENANT_ID)
    });

    this.getAuthVerification(credentials, headers, (data) => {
      log.info(`User Authentication data: ${data}`);
      if (AuthenticationResponse) {
        AuthenticationResponse(data);
      }
    },(errMsg) => {
      log.info(`authenticateUser Error Message: ${errMsg}`);

      const _msg = <Message>{
        severity: 'error',
        detail: errMsg,
      };

      this.globalMessagingService.displayErrorMessage('User Authentication Failed', errMsg);

      if (errorCallback) {
        errorCallback(_msg);
      }
    });
  }


  /**
   * Fetches user tenants
   * @param credentials {UserCredential}, i.e. username & password
   * @param AuthenticationResponse {Function}, i.e. the data response
   */
  fetchUserTenants(
    userCredential: UserCredential,
    AuthenticationResponse?: (data) => void,
  ) {
    const baseUrl = this.appConfigService.config.contextPath.auth_services;
    let headers: HttpHeaders;
    headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: 'application/json',
    });

    this.http.post(`/${baseUrl}/fetch-user-tenants`, JSON.stringify(userCredential),{
      headers: headers,
      withCredentials: true
    })
    .pipe(take(1))
    .subscribe({
      next: (data: AuthenticationResponse) => {
        return AuthenticationResponse(data);
      },
      error: (err) => {
        log.info(`error >>>`, err)
      }
    })

  }


  // authenticateUser(authenticationData: UserCredential): Observable<AuthenticationResponse> {
  //   const headers = new HttpHeaders({
  //     Accept: 'application/json',
  //     'Content-Type': 'application/json;charset=utf8',
  //   });
  //   console.log('AUTHENTICATION DATA', authenticationData);
  //   const baseUrl = this.appConfigService.config.contextPath.auth_services;
  //   return this.http
  //     .post<AuthenticationResponse>(`/${baseUrl}/authenticate-user`,
  //       JSON.stringify(authenticationData), {
  //         headers: headers,
  //       });
  // }

  /**
   * Generates OTP for user verification
   * @param username {string} The user's username
   * @param channel {string} The channel to send the OTP to
   * @return {Observable<boolean>} The response
   */
  sentVerificationOtp(username: string, channel: string): Observable<boolean> {
    const headers = new HttpHeaders({
      Accept: 'application/json',
      'Content-Type': 'application/json;charset=utf8',
    });
    const baseUrl = this.appConfigService.config.contextPath.auth_services;
    return this.http
      .post<boolean>(`/${baseUrl}/generate-otp?username=${username}&channel=${channel}`, {
          headers: headers,
        });
  }

  /**
   * Verify user contact details
   * @param username {string} The user's username
   * @param phoneNo {string} The user's phone number
   * @return {Observable<AccountVerifiedResponse>} The response
   */
  verifyAccount(username:string, phoneNo:string): Observable<AccountVerifiedResponse>{
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    });
    const baseUrl = this.appConfigService.config.contextPath.auth_services;

    const body = {
      email: username,
      phoneNo: phoneNo
    }
    return this.http.post<AccountVerifiedResponse>(`/${(baseUrl)}/verify-account`, JSON.stringify(body),{headers:headers})
  }

  /**
   * Verify received OTP
   * @param username {string} The user's username
   * @param otp {number} The OTP
   * @param email {string} The user's email
   * @return {Observable<boolean>} The response
   */
  verifyResetOtp(username: string, otp: number, email: string = null): Observable<boolean> {
    let url: string = '';
    const headers = new HttpHeaders({
      Accept: 'application/json',
      'Content-Type': 'application/json;charset=utf8',
    });
    const baseUrl = this.appConfigService.config.contextPath.auth_services;

    // const params = new HttpParams()
    //   .set('username', `${username}`)
    //   .set('otp', `${otp}`)
    //   .set('email', `${email}`);
    //
    // let paramObject = this.utilService.removeNullValuesFromQueryParams(params);

    if(username)
      url = `/${baseUrl}/verify-reset-otp?username=${username}&otp=${otp}`;

    if(email)
      url = `/${baseUrl}/verify-reset-otp?email=${email}&otp=${otp}`;

    return this.http
      .post<boolean>(url, {
        headers: headers,
      });
  }

  // verifyOtp(username: string, otp: number ): Observable<string>{
  //   const headers = new HttpHeaders({
  //     'Content-Type': 'application/json',
  //     'Accept': 'application/json',
  //   });
  //   return this.http.post<string>(`/${(this.baseUrl)}/verify-reset-otp?username=${username}&otp=${otp}`,{headers:headers});
  // }
  /**
   * Gets details of the logged in user
   *
   * This has been deprecated because this will always give you different values depending on when
   * it has been accessed.
   *
   * ```
   * import { Component, OnInit } from '@angular/core';
   * import { AuthService } from '@tq-frontend/shared';
   *
   * @Component({
   *   template: '<h1>Example</h1>'
   * })
   * export class ExampleComponent implements OnInit {
   *   constructor(private authService: AuthService){}
   *
   *   ngOnInt() {
   *     this.authService.currentUser$.subscribe(user => {
   *       console.log(user);
   *     });
   *   }
   * }
   * ```
   *
   * @returns {AccountContact | ClientAccountContact | WebAdmin}
   * @deprecated
   */
  getCurrentUser(): Profile {
    let user = StringManipulation.returnNullIfEmpty(this.localStorageService.getItem('loginUserProfile'));
    if(null === user){
      this.session_storage.clear();
      this.router.navigate(['/auth']);
    }
    return user;
  }

  /**
   * Gets details of the logged in user name
   * @returns {string}
   */
  getCurrentUserName(): string {
    const user = this.getCurrentUser();
    // let user_name;
    // if (this.utilService.isUserAgent(user)) {
    //   user_name = user.acccUsername || '';
    // } else if (this.utilService.isUserClient(user)) {
    //   user_name = user.acwaUsername;
    // } else if (this.utilService.isUserAdmin(user)) {
    //   user_name = user.username;
    // }
    // return user_name;
    return user.userName
  }

  // Update the user on the server
  update(
    user: AccountContact | ClientAccountContact | WebAdmin,
  ): Observable<AccountContact | ClientAccountContact | WebAdmin> {
    return throwError('Not Implemented');
  }

  ngOnDestroy() {
  }

  /**
   * Attempts to login user to obtain and save JWT Token.
   * It also gets the user's profile details after successful login and route to the default dashboard page.
   *
   * @param userCredential {UserCredential} The user credentials
   * @param headers {HttpHeaders} The headers
   * @param errorCallback {Function} The error callback
   * @private
   */
  private getAuthToken(
    userCredential: UserCredential,
    headers: HttpHeaders,
    errorCallback?: (errMsg) => void,
  ) {
    const baseUrl = this.appConfigService.config.contextPath.auth_services;
    const userBaseUrl = this.appConfigService.config.contextPath.users_services;
    this.http
      .post(`/${baseUrl}/login`, JSON.stringify(userCredential),{
        headers: headers,
        withCredentials: true,
      })
      .pipe(
        concatMap((data: OauthToken) => {
          // save the token

          this.jwtService.saveToken(data);
          return this.http.get<Profile>(`/${userBaseUrl}/administration/users/entity-profile`, { headers });
        }),
      )
      .subscribe(
        (data: Profile) => {
          this.setAuth(data);
          log.info(`logged in user`, data);
          this.session_storage.set('memberProfile', data);
          
          const entityCode: number = data.code;
          const entityIdNo: string = data.idNo;
          const entityType = headers.get('entityType');

          this.gotToDashboard(entityType, entityCode, entityIdNo)
        },
        (error) => {
          this.destroyUser();
          log.debug('Login error response:', error)
          const errorMessage = error?.error?.message ?? error.message
          this.globalMessagingService.displayErrorMessage('Error', errorMessage);

          if (errorCallback && error instanceof HttpErrorResponse) {
            errorCallback(
              error.error['error_description'] || error.error['message'],
            );
          } else {
            errorCallback(error);
          }
        },
      );
  }

  gotToDashboard(entityType: string, entityCode?: number, entityIdNo?: string): void {
    switch(entityType) {
      case 'MEMBER':
        this.router.navigate(['/home/lms/grp/dashboard/dashboard-screen'], { queryParams: { entityCode }});
        break;
      case 'ADMIN':
        this.router.navigate(['/home/lms/grp/dashboard/admin'], { queryParams: {  }});
        break;
      case 'AGENT':
        this.router.navigate(['/home/lms/grp/dashboard/agent'], { queryParams: {  }});
        break;
      default:
        this.router
          .navigateByUrl(this.redirectUrl || this.defaultRedirectUrl)
          .then((_) => (this.redirectUrl = this.defaultRedirectUrl))
          .catch((error) => log.error(error));
    }
  }

  /**
   * User Authentication
  */
 private getAuthVerification(
    userCredential: UserCredential,
    headers: HttpHeaders,
    AuthenticationResponse?: (data)  =>void,
    errorCallback?: (errMsg) => void,
  ) {
    const baseUrl = this.appConfigService.config.contextPath.auth_services;
    this.http.post(`/${baseUrl}/authenticate-user`, JSON.stringify(userCredential),
      {
        headers: headers,
        withCredentials: true,
      })
      .pipe(untilDestroyed(this))
      .subscribe(
        (data: AuthenticationResponse) => {
          log.debug('Response Data->:', data)
          return AuthenticationResponse(data);
        },
        (error) => {
          if (errorCallback && error instanceof HttpErrorResponse) {
            errorCallback(
              error.error['error_description'] || error.error['message'],
            );
          } else {
            errorCallback(error);
          }
        },
      );
  }
  /**
   * Destroy the user logged in
   */
  private destroyUser() {
    // remove JWT from localstorage
    this.jwtService.destroyToken();
    // remove RefreshToken
    this.jwtService.destroyRefreshToken();
    // set current use to an empty object
    this.currentUserSubject.next(
      {} as Profile,
    );
    // set auth status to false
    this.isAuthenticatedSubject.next(false);
  }

  /**
   * VALIDATE ACCOUNT EXISTS
   */
  /*getAccountVerification(emailAddress: string): Observable<AccountVerification[]> {
    const baseUrl = this.appConfigService.config.context_path.uaa;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: 'application/json',
    });
    const params = new HttpParams()
      .append('emailAddress', `${emailAddress}`);
    return this.http.get<AccountVerification[]>(
      `/${baseUrl}/api/auth/get-verify-account`,
      { headers: headers, params },
    );
  }*/


  getUserDetails() {
    const baseUrl = this.appConfigService.config.contextPath.accounts_services;
    return this.http.get<Profile>(`/${baseUrl}/api/me`).pipe()
      .subscribe((data) => {
        this.setAuth(data);
      });
  }

  /**
   * Change user's password
   * @param username {string} The user's username
   * @param newPassword {string} The new password
   * @param validateOldPassword {string} check old password
   * @param email {string} The user's email
   * @return {Observable<boolean>} The response
   */
  resetPassword(username: string, newPassword: string, validateOldPassword: string, email: string = null){
    const baseUrl = this.appConfigService.config.contextPath.auth_services;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    });
    const body = {
      username: username,
      email: email,
      // password: currentPassword,
      newPassword: newPassword,
      validateOldPassword: validateOldPassword
    }
    return this.http.post<boolean>(`/${(baseUrl)}/new-password`, JSON.stringify(body), {headers:headers});
  }

  /**
   * Change user's password
   * @param username
   * @param validateOldPassword
   * @param newPassword
   * @param confirmPassword
   */
  changePassword(username: string, validateOldPassword: string, newPassword: string, confirmPassword: string){
    const baseUrl = this.appConfigService.config.contextPath.auth_services;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    });
    const body = {
      newPassword: newPassword,
      password: confirmPassword,
      username: username,
      validateOldPassword: validateOldPassword
    }
    return this.http.post<string>(`/${(baseUrl)}/new-password`, JSON.stringify(body), {headers:headers});
  }

  /**
   * Update user profile
   * @param userData {UserDetailsDTO} The user's profile data
   * @return {Observable<string>} The response
   */
  updateUserProfile(userData:UserDetailsDTO){
    const baseUrl = this.appConfigService.config.contextPath.users_services;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    });
    return this.http.post<string>(`/${(baseUrl)}/administration/users/entity-profile`, JSON.stringify(userData), {headers:headers});
  }

  /**
   * Refreshes the authentication token
   * @param refresh_token {string} The refresh token
   * @param headers {HttpHeaders} The headers
   * @param errorCallback {Function} The error callback
   * @private
   */
  private refreshAuthToken(
      refresh_token: string,
      headers: HttpHeaders,
      errorCallback?: (errMsg) => void,
  ) {
    const baseUrl = this.appConfigService.config.contextPath.auth_services;
    const userBaseUrl = this.appConfigService.config.contextPath.users_services;
    const refreshToken = {
      "refresh_token": refresh_token
    };

    this.http
        .post(`/${baseUrl}/refresh`, refreshToken, {
          headers: headers,
          withCredentials: true,
        })
        .pipe(
            concatMap((data: OauthToken) => {
              // save the token
              this.jwtService.saveToken(data);
              return this.http.get<Profile>(`/${userBaseUrl}/administration/users/entity-profile`, { headers });
            }),
        )
        .subscribe(
            (data: Profile) => {
              this.setAuth(data);

              this.router
                  .navigateByUrl(this.redirectUrl || this.defaultRedirectUrl)
                  .then((_) => (this.redirectUrl = this.defaultRedirectUrl))
                  .catch((error) => log.error(error));
            },
            (error) => {
              this.destroyUser();
              log.debug('Login error response:', error)

              if (errorCallback && error instanceof HttpErrorResponse) {
                errorCallback(
                    error.error['error_description'] || error.error['message'],
                );
              } else {
                errorCallback(error);
              }
            },
        );
  }

}
