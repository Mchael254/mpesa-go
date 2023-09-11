import { Injectable } from '@angular/core';
import { EncryptionService } from '../encryption/encryption.service';

/**
 * This service provides methods to access the local storage.
 */
@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {
  constructor(private en: EncryptionService) { }

  /**
   * Set item in local storage
   * @param key - The key
   * @param value - The value
   */
  setItem(key: string, value: any): void {
    const encryptedValue = this.en.encrypt(value);
    localStorage.setItem(key, encryptedValue);
  }

  /**
   * Get item from local storage
   * @param key - The key
   * @returns The value
   */
  getItem(key: string): any {
    const encryptedValue = localStorage.getItem(key);
    return encryptedValue ? this.en.decrypt(encryptedValue) : null;
  }

  /**
   * Remove item from local storage
   * @param key
   */
  removeItem(key: string): void {
    localStorage.removeItem(key);
  }

  /**
   * Clear local storage
   */
  clear(): void {
    localStorage.clear();
  }
}
