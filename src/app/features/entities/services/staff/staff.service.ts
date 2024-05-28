import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

import { UtilService } from '../../../../shared/services';
import { Pagination } from '../../../../shared/data/common/pagination';
import {
  AssignAppsDto,
  AssignAppsRequest,
  CreateStaffDto,
  StaffDto,
  StaffResDto,
} from '../../data/StaffDto';
import {
  CreateAccountDTO,
  NewAccountCreatedResponse,
} from '../../data/accountDTO';
import { AuthService } from '../../../../shared/services/auth.service';
import { ApiService } from '../../../../shared/services/api/api.service';
import { API_CONFIG } from '../../../../../environments/api_service_config';
import {SystemsDto} from "../../../../shared/data/common/systemsDto";

@Injectable({
  providedIn: 'root',
})
export class StaffService {
  private newStaffAccount = new BehaviorSubject<CreateStaffDto>({
    granterUserId: 0,
    organizationGroupId: 0,
    otherPhone: 0,
    userType: '',
    username: '',
  });
  newStaffObservable = this.newStaffAccount.asObservable();

  constructor(
    private utilService: UtilService,
    private authService: AuthService,
    private api: ApiService
  ) {}

  /**
   * Set new staff account observable
   * @param newStaffAccount
   */
  setNewStaffAccount(newStaffAccount: CreateStaffDto) {
    this.newStaffAccount.next(newStaffAccount);
  }

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
    page: number | null = 0,
    size: number | null = 10,
    userType: string,
    sortList: string = 'dateCreated',
    order: string = 'desc',
    supervisor: number
  ): Observable<Pagination<StaffDto>> {
    const params = new HttpParams()
      .set('page', `${page}`)
      .set('size', `${size}`)
      .set('userType', `${userType}`)
      .set('groupId', 1) /*TODO: Find proper way to fetch groupId*/
      .set('sortList', `${sortList}`)
      .set('order', `${order}`)
      .set('supervisor', `${supervisor}`);

    let paramObject = this.utilService.removeNullValuesFromQueryParams(params);

    return this.api.GET<Pagination<StaffDto>>(
      `users`,
      API_CONFIG.USER_ADMINISTRATION_SERVICE_BASE_URL,
      paramObject
    );
  }

  /**
   * Fetch staff by id
   * @param {number} id
   * @returns {Observable<StaffDto>}
   */
  getStaffById(id: number): Observable<StaffDto> {
    return this.api.GET<StaffDto>(
      `users/${id}`,
      API_CONFIG.USER_ADMINISTRATION_SERVICE_BASE_URL
    );
  }

  /**
   * Create a new staff entity
   * @param {CreateAccountDTO} staffAccount - staff account data
   * @returns {Observable<NewAccountCreatedResponse>} - newly created staff account data
   */
  createUserAccount(
    staffAccount: CreateAccountDTO
  ): Observable<NewAccountCreatedResponse> {
    const userData = JSON.stringify(staffAccount);
    return this.api.POST<NewAccountCreatedResponse>(
      `accounts`,
      userData,
      API_CONFIG.CRM_ACCOUNTS_SERVICE_BASE_URL
    );
  }

  /**
   * Assign apps to a user
   * @param userId - staff/user id
   * @param assignedSystems - assigned apps
   * @returns {Observable<AssignAppsDto[]>} - assigned apps
   */
  assignUserSystemApps(
    userId: number,
    assignedSystems: AssignAppsRequest
  ): Observable<AssignAppsDto[]> {
    return this.api.POST<AssignAppsDto[]>(
      `users/${userId}/systems`,
      JSON.stringify(assignedSystems),
      API_CONFIG.USER_ADMINISTRATION_SERVICE_BASE_URL
    );
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
    username: string = null
  ): Observable<Pagination<StaffDto>> {
    const params = new HttpParams()
      .set('page', `${page}`)
      .set('size', `${size}`)
      .set('userType', `${userType}`)
      .set('name', `${name}`)
      .set('username', `${username}`)
      .set('groupId', `${groupId}`);

    let paramObject = this.utilService.removeNullValuesFromQueryParams(params);

    return this.api.GET<Pagination<StaffDto>>(
      `users`,
      API_CONFIG.USER_ADMINISTRATION_SERVICE_BASE_URL,
      paramObject
    );
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
    size: number | null = 5,
    userType: string,
    sortList: string = 'dateCreated',
    order: string = 'desc'
  ): Observable<Pagination<StaffResDto>> {
    const loggedInUser = this.authService.getCurrentUser();
    let id: number;
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

    return this.api.GET<Pagination<StaffDto>>(
      `users`,
      API_CONFIG.USER_ADMINISTRATION_SERVICE_BASE_URL,
      paramObject
    );
  }

  /**
   * Fetch staff by staff group
   * @param staffGroupId - staff group id
   * @returns {Observable<StaffDto[]>} - staff data
   */
  getStaffByGroup(staffGroupId: number): Observable<StaffDto[]> {
    return this.api.GET<StaffDto[]>(
      `user-groups/${staffGroupId}/users`,
      API_CONFIG.USER_ADMINISTRATION_SERVICE_BASE_URL
    );
  }

  getUserSystems(
    userId: number,
  ): Observable<SystemsDto[]> {
    return this.api.GET<SystemsDto[]>(
      `users/${userId}/systems`,
      API_CONFIG.USER_ADMINISTRATION_SERVICE_BASE_URL
    );
  }

  getUserOrganizations(
    userId: number,
  ): Observable<any[]> {
    return this.api.GET<any[]>(
      `user-organizations?userId=${userId}`,
      API_CONFIG.USER_ADMINISTRATION_SERVICE_BASE_URL
    );
  }
}
