import {Injectable} from '@angular/core';
import {Observable} from "rxjs";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import { AccountStatus } from '../../data/AccountStatus';
import { AppConfigService } from 'src/app/core/config/app-config-service';
import { Status } from '../../data/enums/Status';
import { AccountTypeStatusList } from '../../data/AccountTypeStatusList';
import { AccountType } from '../../data/enums/AccountType';
import { UpdateAccountStatusDto } from '../../data/UpdateAccountStatusDto';

/****
 * @author Idah Gakii
 *  */

@Injectable({
  providedIn: 'root'
})
export class AccountStatusService {

  // create an array of objects from Status enum
  private statusList: AccountStatus[] = [];
  constructor(
      private http: HttpClient,
      private appConfig: AppConfigService
  ) {
      this.statusList = Object.keys(Status).map((name) => {
        return {
          name,
          value: Status[name as keyof typeof Status],
        };
      });
  }

  // get by Name from main list, statusList
  // private fetchByStatusName = (statusNames : string[]): AccountStatus[] => this.statusList.filter(status => {
  //   return Object.keys(statusNames).every(statusName => status.name === statusName);
  // });

  private fetchByStatusName (statusNames: string[]): AccountStatus[] {
    const filteredStatuses: AccountStatus[] = [];
    statusNames.forEach((filterValue: string) => {
      filteredStatuses.push(...this.statusList.filter(status => status.name === filterValue ));
    });
    return filteredStatuses;
  }

  private fetchClientStatuses(): AccountTypeStatusList {
    let clientStatusList: AccountStatus[] = this.fetchByStatusName(['ACTIVE','INACTIVE']);
    return {accountType: AccountType.C, statusTypes: clientStatusList};
  }

  private  fetchServiceProviderStatuses(): AccountTypeStatusList {
    let serviceProviderStatusList: AccountStatus[] = this.fetchByStatusName( ['ACTIVE', 'INACTIVE']);
    return {accountType: AccountType.SP, statusTypes: serviceProviderStatusList};
  }

  private fetchIntermediariesStatuses(): AccountTypeStatusList { // has all statuses
    let intermediariesStatusList: AccountStatus[] = this.statusList;
    return {accountType: AccountType.A, statusTypes: intermediariesStatusList};
  }

  private fetchStaffStatuses(): AccountTypeStatusList {
    let staffStatusList: AccountStatus[] = this.fetchByStatusName( ['ACTIVE', 'INACTIVE']);
    return {accountType: AccountType.S, statusTypes: staffStatusList};
  }

  fetchAllStatuses(): AccountStatus[] {
    return this.statusList;
  }

  fetchStatusList(accountType: string): AccountStatus[]{
    console.log('Account type: ', accountType);

    let type: string | undefined = accountType ? accountType.toUpperCase() : undefined;
    // console.log(this.statusList);
    switch (type) {
      case AccountType.S:
        return this.fetchStaffStatuses().statusTypes;
      case AccountType.SP:
        return this.fetchServiceProviderStatuses().statusTypes;
      case AccountType.C:
        return this.fetchClientStatuses().statusTypes;
      case AccountType.A:
        return this.fetchIntermediariesStatuses().statusTypes;
      default:
        return this.fetchAllStatuses();
    }
  }

  updateAccountStatus(id:number, statusUpdate: UpdateAccountStatusDto): Observable<boolean>{
    const baseUrl = this.appConfig.config.contextPath.accounts_services;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: 'application/json',
    });
    return this.http.patch<boolean>(`/${baseUrl}/${id}/status`, JSON.stringify(statusUpdate), {headers:headers})
  }

}
