import { Injectable } from '@angular/core';
import { EncryptionService } from '../encryption/encryption.service';


@Injectable({
  providedIn: 'root'
})
export class SessionStorageService {
  constructor(private en: EncryptionService) { }

  setItem(key: string, value: any): void {
    const encryptedValue = this.en.encrypt(value);
    sessionStorage.setItem(key, encryptedValue);
  }

  getItem(key: string): any {
    const encryptedValue = sessionStorage.getItem(key);
    return encryptedValue ? this.en.decrypt(encryptedValue) : null;
  }

  removeItem(key: string): void {
    sessionStorage.removeItem(key);
  }

  clear(): void {
    sessionStorage.clear();
  }
}
