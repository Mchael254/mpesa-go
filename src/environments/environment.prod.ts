/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */
import { API_CONFIG, API_TENANT_ID } from './api_service_config';

export const environment = {
  production: true,
  dmsDefaultUrl: 'http://192.0.1.140:9080/alfrescoServices',

  API_URLS: new Map<API_CONFIG, string>([
    [API_CONFIG.SETUPS_SERVICE_BASE_URL, '/lms/setups'],
    [API_CONFIG.GRP_QUOTATIONS_SERVICE_BASE_URL, '/lms/grp/quotation'],
    [API_CONFIG.IND_MARKETING_SERVICE_BASE_URL, '/lms/ind/marketing'],
    [API_CONFIG.JSON_SERVICE_BASE_URL, 'http://10.176.18.211:1020/json'],
    [API_CONFIG.CRM_SETUPS_SERVICE_BASE_URL, '/crm/setups'],
    [API_CONFIG.CRM_ACCOUNTS_SERVICE_BASE_URL, '/crm/accounts'],
    [API_CONFIG.USER_ADMINISTRATION_SERVICE_BASE_URL, '/user/administration'],
    [API_CONFIG.UNDERWRITING_SERVICE_BASE_URL, '/lms/underwriting'],
    [API_CONFIG.GIS_REINSURANCE_BASE_URL, '/gis/reinsurance'],
    [API_CONFIG.GIS_UNDERWRITING_BASE_URL, '/gis/underwriting/api'],
    [API_CONFIG.MNGT_WORKFLOW_BASE_URL, '/turnquest/workflow'],
    [API_CONFIG.GIS_SETUPS_BASE_URL, '/gis/setups'],
    [API_CONFIG.GIS_CLAIMS_BASE_URL, '/gis/claims'],
    [API_CONFIG.GIS_QUOTATIONS_BASE_URL, '/gis/quotation/api'],
    [API_CONFIG.GIS_QUOTATION_BASE_URL, '/gis/quotation/api'],
    [API_CONFIG.NOTIFICATION_BASE_URL, '/turnquest/notification'],
    // [API_CONFIG.REPORT_SERVICE_BASE_URL, 'http://10.176.18.211:9991'],
    [API_CONFIG.REPORT_SERVICE_BASE_URL, '/turnquest/reports'],
    [API_CONFIG.DMS_SERVICE, '/alfrescoServices'],
    [API_CONFIG.FMS_PAYMENTS_SERVICE_BASE_URL, '/fms/payment/v1'], //before fms refactoring
    [API_CONFIG.FMS_PAYMENTS_SERVICE_BASE_URL2, '/fms/api/v1/payments'], //after fms refactoring
    [API_CONFIG.ETIMS_SERVICE_BASE_URL, '/etims'],
    [API_CONFIG.CRM_CAMPAIGNS_SERVICE_BASE_URL, '/crm/campaigns']
  ]),
  // PAYSTACK_BASE_URL: process.env['PAYSTACK_BASE_URL'],
  // PAYSTACK_SECRET_KEY: process.env['PAYSTACK_SECRET_KEY']
};
