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
    [API_CONFIG.GRP_QUOTATIONS_SERVICE_BASE_URL, '/lms/marketing'],
    [API_CONFIG.IND_MARKETING_SERVICE_BASE_URL, ''],
    [API_CONFIG.JSON_SERVICE_BASE_URL, ''],

  ]),
  TENANT_ID: API_TENANT_ID.MUTUAL,

};
