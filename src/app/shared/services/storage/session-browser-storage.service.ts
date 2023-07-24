import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { AbstractBrowserStorage } from './abstract-browser-storage';

@Injectable()
export class SessionBrowserStorageService extends AbstractBrowserStorage {
  constructor(@Inject(PLATFORM_ID) platformId: Object) {
    super(platformId);
  }

  storage(): Storage {
    return window.sessionStorage;
  }
}
