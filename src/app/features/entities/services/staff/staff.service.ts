import {Injectable, signal} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {UtilService} from "../../../../shared/services";
import {Observable} from "rxjs";
import {Pagination} from "../../../../shared/data/common/pagination";
import {AssignAppsDto, AssignAppsRequest, CreateStaffDto, StaffDto, StaffResDto} from "../../data/StaffDto";
import {CreateAccountDTO, NewAccountCreatedResponse} from "../../data/accountDTO";
import {AuthService} from "../../../../shared/services/auth.service";
import {AppConfigService} from "../../../../core/config/app-config-service";

@Injectable({
  providedIn: 'root'
})
export class StaffService {
  baseStaffUrl = this.appConfig.config.contextPath.users_services;
  baseAccountsUrl = this.appConfig.config.contextPath.accounts_services;
  currentStaff = signal(0);

  newlyCreatedStaff = signal<CreateStaffDto>({
    activatedBy: "",
    departmentCode: 0,
    emailAddress: "",
    granterUserId: 0,
    id: 0,
    organizationGroupId: 0,
    otherPhone: 0,
    personelRank: "",
    profilePicture: "",
    supervisorId: 0,
    updateBy: "",
    userType: "",
    username: ""
  })

  constructor(private appConfig: AppConfigService, private http: HttpClient,
              private utilService: UtilService,private authService: AuthService) { }

  /**
   * Method to fetch staff data
   * @param {number} [page="0"] - page number
   * @param {number} [size="10"] - page size
   * @param {string} userType - user type
   * @param {string} [sortList="dateCreated"] - sort list
   * @param {string} [order="desc"] - sort order asc or desc
   * @param {number} supervisor - supervisor id
   * @return {Observable<Pagination<StaffDto>>} - staff data
   */
  getStaff(
    page: number = 0,
    size: number = 10,
    userType: string,
    sortList: string = 'dateCreated',
    order: string = 'desc',
    supervisor: number
  ): Observable<Pagination<StaffDto>> {
    const header = new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    });
    const params = new HttpParams()
      .set('page', `${page}`)
      .set('size', `${size}`)
      .set('userType', `${userType}`)
      .set('groupId', 1) /*TODO: Find proper way to fetch groupId*/
      .set('sortList', `${sortList}`)
      .set('order', `${order}`)
      .set('supervisor', `${supervisor}`);

    let paramObject = this.utilService.removeNullValuesFromQueryParams(params);

    return this.http.get<Pagination<StaffDto>>(`/${this.baseStaffUrl}/administration/users`, {
      headers: header,
      params: paramObject,
    });
  }

  /**
   * Fetch staff by id
   * @param {number} id
   * @returns {Observable<StaffDto>}
   */
  getStaffById(id: number): Observable<StaffDto> {
    return this.http.get<StaffDto>(`/${this.baseStaffUrl}/administration/users/` + id);
  }

  /**
   * Create a new staff entity
   * @param {CreateAccountDTO} staffAccount - staff account data
   * @returns {Observable<NewAccountCreatedResponse>} - newly created staff account data
   */
  createUserAccount(staffAccount: CreateAccountDTO): Observable<NewAccountCreatedResponse> {
    const userData = JSON.stringify(staffAccount);
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: 'application/json',
    });
    return this.http.post<NewAccountCreatedResponse>(`/${this.baseAccountsUrl}/accounts/accounts`, userData, {headers});
  }

  /**
   * Assign apps to a user
   * @param userId - staff/user id
   * @param assignedSystems - assigned apps
   * @returns {Observable<AssignAppsDto[]>} - assigned apps
   */
  assignUserSystemApps(userId: number, assignedSystems: AssignAppsRequest): Observable<AssignAppsDto[]>{
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });
    // let assignedSystems = JSON.stringify(assignedSystems);
    return this.http.post<AssignAppsDto[]>(`/${this.baseStaffUrl}/administration/users/${userId}/systems`, JSON.stringify(assignedSystems), {headers});
  }

  /**
   * Search staff
   * @param {number} page page number
   * @param {number} size size of page
   * @param {string} userType user type
   * @param {string} name name of staff
   * @param {number} groupId group id
   * @param {string} username username
   * @returns {Observable<Pagination<StaffDto>>} staff data
   */
  searchStaff(
    page: number = 0,
    size: number = 5,
    userType: string,
    name: string,
    groupId: number = 1,
    username: string = null,
  ): Observable<Pagination<StaffDto>> {
    const header = new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    });

    const params = new HttpParams()
      .set('page', `${page}`)
      .set('size', `${size}`)
      .set('userType', `${userType}`)
      .set('name', `${name}`)
      .set('username', `${username}`)
      .set('groupId', `${groupId}`);

    let paramObject = this.utilService.removeNullValuesFromQueryParams(params);

    return this.http.get<Pagination<StaffDto>>(`/${this.baseStaffUrl}/administration/users`, {
      headers: header,
      params: paramObject,
    });
  }

  /**
   * Fetch staff with supervisor
   * @param page
   * @param size
   * @param userType
   * @param sortList
   * @param order
   * @returns {Observable<Pagination<StaffResDto>>} - staff data
   */
  getStaffWithSupervisor(
    page: number = 0,
    size: number,
    userType: string,
    sortList: string = 'dateCreated',
    order: string = 'desc',
  ): Observable<Pagination<StaffResDto>> {
    const header = new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    });
    const loggedInUser = this.authService.getCurrentUser();
    let id:number;
    if (this.utilService.isUserAdmin(loggedInUser)) {
      id = loggedInUser.id;

    }
    const supervisor = id;
    const params = new HttpParams()
      .set('page', `${page}`)
      .set('size', `${size}`)
      .set('userType', `${userType}`)
      .set('groupId', 1) /*TODO: Find proper way to fetch groupId*/
      .set('sortList', `${sortList}`)
      .set('order', `${order}`)
      .set('supervisor', `${supervisor}`);

    let paramObject = this.utilService.removeNullValuesFromQueryParams(params);
    // log.info('Page selected: ', page);
    // log.info('Staff Params object', paramObject);

    return this.http.get<Pagination<StaffDto>>(`/${this.baseStaffUrl}/administration/users`, {
      headers: header,
      params: paramObject,
    });
  }

  /**
   * Fetch staff by staff group
   * @param staffGroupId - staff group id
   * @returns {Observable<StaffDto[]>} - staff data
   */
  getStaffByGroup(staffGroupId: number): Observable<StaffDto[]>{
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });
    return this.http.get<StaffDto[]>(`/${this.baseStaffUrl}/administration/user-groups/${staffGroupId}/users`);
  }
}
