import { Injectable } from '@angular/core';
import { EncryptionService } from '../encryption/encryption.service';
import { SESSION_KEY } from '../../../features/lms/util/session_storage_enum';

/**
 * This service is used to store data in the session storage
 */
@Injectable({
  providedIn: 'root'
})
export class SessionStorageService {
  constructor(private en: EncryptionService) { }

  /**
   * Set an item in the session storage
   * @param key - key to be used to store the item
   * @param value - value to be stored
   */
  setItem(key: string, value: any): void {
    const encryptedValue = this.en.encrypt(value);
    sessionStorage.setItem(key, encryptedValue);
  }

  /**
   * Get an item from the session storage
   * @param key - key to be used to retrieve the item
   * @returns - the item retrieved
   */
  getItem(key: string): any {
    const encryptedValue = sessionStorage.getItem(key);
    return encryptedValue ? this.en.decrypt(encryptedValue) : null;
  }

  /**
   * Remove an item from the session storage
   * @param key
   */
  removeItem(key: string): void {
    sessionStorage.removeItem(key);
  }

  /**
   * Clear the session storage
   */
  clear(): void {
    sessionStorage.clear();
  }









  /**
   * Set an item in the session storage
   * @param key - key to be used to store the item
   * @param value - value to be stored
   */
  set(key: string, value: any): void {
    // const encryptedValue = this.en.encrypt(value);
    // sessionStorage.setItem(key, encryptedValue);
    this.set_store(value, key)


  }

  /**
   * Get an item from the session storage
   * @param key - key to be used to retrieve the item
   * @returns - the item retrieved
   */
  get(key: string): any {
    // const encryptedValue = sessionStorage.getItem(key);
    // return encryptedValue ? this.en.decrypt(encryptedValue) : null;
    let store = this.get_store();
    return store[key] || '';
  }

  private get_store() {
    return JSON.parse(sessionStorage.getItem('store_')) || {};
  }

  private set_store(obj:any, key){
    let store = this.get_store();
    store[key] = obj;
    sessionStorage.setItem('store_', JSON.stringify(store))
  }

  /**
   * Remove an item from the session storage
   * @param key
   */
  remove(key: string): void {
    // sessionStorage.removeItem(key);
    let store = this.get_store();
    delete store[key];
    sessionStorage.setItem('store_', JSON.stringify(store))
  }

  /**
   * Clear the session storage
   */
  clear_store(): void {
    let tenant = this.get(SESSION_KEY.API_TENANT_ID);
    sessionStorage.setItem('store_', JSON.stringify(''))
    this.set(SESSION_KEY.API_TENANT_ID,tenant);
  }


}
