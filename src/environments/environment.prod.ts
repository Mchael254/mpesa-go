/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */
import { API_CONFIG } from './api_service_config';

export const environment = {

  production: true,
  dmsDefaultUrl: 'http://192.0.1.140:9080/alfrescoServices',

  API_URLS: new Map<API_CONFIG, string>([
    [API_CONFIG.SETUPS_SERVICE_BASE_URL, 'http://10.176.18.211:1025/lms-setups-service'],
    [API_CONFIG.MARKETING_SERVICE_BASE_URL, 'http://10.176.18.211:1025/lms-marketing-service'],
  ]),
};
