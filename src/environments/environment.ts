/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */
// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.
import { API_CONFIG, API_TENANT_ID } from './api_service_config';

export const environment = {

  production: false,
  dmsDefaultUrl: 'http://10.176.18.101:9080/alfrescoServices',
  API_URLS: new Map<API_CONFIG, string>([
    // [API_CONFIG.GRP_QUOTATIONS_SERVICE_BASE_URL, '/lms/grp/quotation'],
    // [API_CONFIG.IND_MARKETING_SERVICE_BASE_URL, '/lms/ind/marketing'],
    // [API_CONFIG.UNDERWRITING_SERVICE_BASE_URL, '/lms/underwriting'],
    // [API_CONFIG.SETUPS_SERVICE_BASE_URL, '/lms/setups'],
    [API_CONFIG.SETUPS_SERVICE_BASE_URL, 'http://localhost:5000'],
    [API_CONFIG.IND_MARKETING_SERVICE_BASE_URL, 'http://localhost:5001'],
    [API_CONFIG.GRP_QUOTATIONS_SERVICE_BASE_URL, 'http://localhost:5002'],
    [API_CONFIG.UNDERWRITING_SERVICE_BASE_URL, 'http://localhost:5003'],
    [API_CONFIG.CRM_SETUPS_SERVICE_BASE_URL, '/crm/setups'],


    [API_CONFIG.CRM_ACCOUNTS_SERVICE_BASE_URL, '/crm/accounts'],
    // [API_CONFIG.JSON_SERVICE_BASE_URL, 'http://10.176.18.211:1020/json'],
    [API_CONFIG.JSON_SERVICE_BASE_URL, 'http://localhost:1020/json'],
    [API_CONFIG.NOTIFICATION_BASE_URL, 'http://10.176.18.211:1025/notification/api'],
    [API_CONFIG.PREMIUM_COMPUTATION, '/premium/computation'],
    [API_CONFIG.GIS_REINSURANCE_BASE_URL, '/gis/reinsurance'],
    [API_CONFIG.GIS_UNDERWRITING_BASE_URL, '/gis/underwriting'],
    [API_CONFIG.MNGT_WORKFLOW_BASE_URL, '/turnquest/workflow'],
    [API_CONFIG.GIS_SETUPS_BASE_URL, '/gis/setups'],
    [API_CONFIG.GIS_CLAIMS_BASE_URL, '/gis/claims'],
    [API_CONFIG.REPORT_SERVICE_BASE_URL, '/reports'],

  ]),

};
