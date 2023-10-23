/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */
// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.
import { API_CONFIG } from './api_service_config';

export const environment = {
  production: false,
  dmsDefaultUrl: 'http://10.176.18.101:9080/alfrescoServices',
  API_URLS: new Map<API_CONFIG, string>([
    [API_CONFIG.SETUPS_SERVICE_BASE_URL, 'http://localhost:5000'],
    [API_CONFIG.MARKETING_SERVICE_BASE_URL, 'http://localhost:5001'],
    [API_CONFIG.QUOTATIONS_SERVICE_BASE_URL, 'http://localhost:5002'],


    // [API_CONFIG.SETUPS_SERVICE_BASE_URL, '/lms/setups'],
    // [API_CONFIG.MARKETING_SERVICE_BASE_URL, '/lms/marketing'],
  ]),

};
