/****************************************************************************
 **
 ** Author: Justus Muoka
 **
 ****************************************************************************/

import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Logger } from '../logger.service';
import { AbstractBrowserStorage } from './abstract-browser-storage';

const log = new Logger('LocalBrowserStorageService');

@Injectable()
export class LocalBrowserStorageService extends AbstractBrowserStorage {
  constructor(@Inject(PLATFORM_ID) platformId: Object) {
    super(platformId);
  }

  storage(): Storage {
    return window.localStorage;
  }
}
