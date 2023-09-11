import { isPlatformBrowser } from '@angular/common';
import { BrowserStorage, DEFAULT_KEY } from './browser-storage';
import { Logger } from '../logger/logger.service';

const log = new Logger('BrowserStorage');

export abstract class AbstractBrowserStorage extends BrowserStorage {
  protected constructor(private platformId: Object) {
    super();
  }

  abstract storage(): Storage;

  override storeObj<T>(name: string = DEFAULT_KEY, obj: T) {
    if (isPlatformBrowser(this.platformId)) {
      log.info(`Storing the object: ${Object.prototype.toString.call(obj)} for key: ${name}`);
      log.info(`Storing the object: ${JSON.stringify(obj)}`);
      this.storage().setItem(name, JSON.stringify(obj));
    }
  }

  override getObj<T>(name: string) {
    if (isPlatformBrowser(this.platformId)) {
      const value = this.storage().getItem(name || DEFAULT_KEY);

      return value && JSON.parse(value);
    } else {
      return null;
    }
  }

  override clearObj(name: string) {
    log.info(`Preparing to clear ${name}`);
    if (isPlatformBrowser(this.platformId)) {
      this.storage().removeItem(name || DEFAULT_KEY);
    }
  }

  override clearObjs(names: Array<string>) {
    log.info(`Preparing to clear ${JSON.stringify(names)}`);
    for (let idx = 0; idx < names.length; idx++) {
      this.clearObj(names[idx]);
    }
  }

  override clearAll() {
  }
}
