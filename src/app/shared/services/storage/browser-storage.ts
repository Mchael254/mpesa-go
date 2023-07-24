/****************************************************************************
 **
 ** Author: Justus Muoka
 **
 ****************************************************************************/

import { Injectable } from '@angular/core';

export const DEFAULT_KEY = 'DEFAULT_KEY';

@Injectable()
export class BrowserStorage {
  /**
   * Store an object to a browser storage
   * @param {string} name
   * @param {T} obj
   */
  storeObj<T>(name: string, obj: T) {}

  /**
   * Gets a value stored on a browser storage
   * @param {string} name
   * @returns {T}
   */
  getObj<T>(name: string): T| null {
    return null;
  }

  /**
   * Clear a single object stored in a browser
   * @param {string} name
   */
  clearObj(name: string) {}

  /**
   * Clear the list of objects
   * @param {Array<String>} names
   */
  clearObjs(names: Array<string>) {}

  /**
   * Clear  all values
   */
  clearAll() {}
}
