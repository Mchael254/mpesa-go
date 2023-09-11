import { Injectable } from '@angular/core';
import { EncryptionService } from '../encryption/encryption.service';

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
}
