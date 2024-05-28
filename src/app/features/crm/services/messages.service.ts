import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpParams } from '@angular/common/http';

import { ApiService } from '../../../shared/services/api/api.service';
import { Pagination } from '../../../shared/data/common/pagination';
import { EmailHistoryDto, SmsHistoryDto } from '../data/messages';
import { API_CONFIG } from '../../../../environments/api_service_config';
import { UtilService } from '../../../shared/services/util/util.service';

@Injectable({
  providedIn: 'root',
})
export class MessagesService {
  constructor(private api: ApiService, private utilService: UtilService) {}

  getSmsHistroy(
    systemId: number,
    agentName?: string,
    clientName?: string,
    fromDate?: Date,
    page?: number,
    referenceNo?: string,
    size?: number,
    status?: string,
    toDate?: Date,
    transactionalLevel?: string
  ): Observable<Pagination<SmsHistoryDto>> {
    // Create an object to hold parameters only if they are provided
    const paramsObj: { [param: string]: string } = {};

    // Add optional parameters if provided
    if (agentName) {
      paramsObj['agentName'] = agentName;
    }
    if (clientName) {
      paramsObj['clientName'] = clientName;
    }
    if (fromDate) {
      paramsObj['fromDate'] = fromDate.toString();
    }
    if (page !== undefined && page !== null) {
      paramsObj['page'] = page.toString();
    }
    if (referenceNo) {
      paramsObj['referenceNo'] = referenceNo;
    }
    if (size !== undefined && size !== null) {
      paramsObj['size'] = size.toString();
    }
    if (status) {
      paramsObj['status'] = status;
    }
    if (toDate) {
      paramsObj['toDate'] = toDate.toString();
    }
    // Add the mandatory parameter
    paramsObj['systemId'] = systemId.toString();
    if (transactionalLevel) {
      paramsObj['transactionalLevel'] = transactionalLevel;
    }
    const params = new HttpParams({ fromObject: paramsObj });
    return this.api.GET<Pagination<SmsHistoryDto>>(
      'api/sms/history',
      API_CONFIG.NOTIFICATION_BASE_URL,
      params
    );
  }

  getEmailHistroy(
    systemId: number,
    claimNo?: string,
    agentName?: string,
    clientName?: string,
    emailTo?: string,
    fromDate?: Date,
    page?: number,
    policyNo?: string,
    size?: number,
    status?: string,
    toDate?: Date,
    transactionalLevel?: string
  ): Observable<Pagination<EmailHistoryDto>> {
    // Create an object to hold parameters only if they are provided
    const paramsObj: { [param: string]: string } = {};

    // Add optional parameters if provided
    if (claimNo) {
      paramsObj['claimNo'] = claimNo;
    }
    if (agentName) {
      paramsObj['agentName'] = agentName;
    }
    if (clientName) {
      paramsObj['clientName'] = clientName;
    }
    if (emailTo) {
      paramsObj['emailTo'] = emailTo;
    }
    if (fromDate) {
      paramsObj['fromDate'] = fromDate.toString();
    }
    if (page !== undefined && page !== null) {
      paramsObj['page'] = page.toString();
    }
    if (policyNo) {
      paramsObj['policyNo'] = policyNo;
    }
    if (size !== undefined && size !== null) {
      paramsObj['size'] = size.toString();
    }
    if (status) {
      paramsObj['status'] = status;
    }
    if (toDate) {
      paramsObj['toDate'] = toDate.toString();
    }
    // Add the mandatory parameter
    paramsObj['systemId'] = systemId.toString();

    if (transactionalLevel) {
      paramsObj['transactionalLevel'] = transactionalLevel;
    }
    const params = new HttpParams({ fromObject: paramsObj });
    return this.api.GET<Pagination<EmailHistoryDto>>(
      'email/history',
      API_CONFIG.NOTIFICATION_BASE_URL,
      params
    );
  }
}
