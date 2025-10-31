import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EntityUtilService {

  constructor() { }

  /**
   * Checks for fieldType as tel
   * @param mainStr
   * @Return True|False
   */
  checkTelNumber(mainStr: string): boolean {
    const subStrs: string[] = ['mobile_no', 'tel_no', 'sms_number', 'telephone_number', 'landline_number', 'mobile_money_number'];
    return subStrs.some(subStr => mainStr.includes(subStr));
  }

}
