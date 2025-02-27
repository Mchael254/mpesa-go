// /****************************************************************************
//  **
//  ** Author: Justus Muoka
//  **
//  ****************************************************************************/

import {Injectable} from '@angular/core';
import {AbstractControl, FormArray} from '@angular/forms';
import {ClientAccountContact} from "../../data/client-account-contact";
import {AccountContact} from "../../data/account-contact";
import {WebAdmin} from "../../data/web-admin";
import {HttpParams} from "@angular/common/http";
import {DatePipe} from "@angular/common";
import { ClientDTO } from 'src/app/features/entities/data/ClientDTO';

// import { format, subYears } from 'date-fns';

export interface FullName {
  clntName: string;
  clntSurname: string ;
  clntOtherNames: string;
}

/**
 * Utility service class to provide common utility methods
 */
@Injectable({
  providedIn: 'root'
})
export class UtilService {
  constructor() {
  }

  purgeFormArray(form: FormArray) {
    while (0 !== form.length) {
      form.removeAt(0);
    }
  }

  /**
   * Checks if logged in user is a client
   * @param obj
   * @returns {ClientAccountContact}
   */
  isUserClient(obj: any): obj is ClientAccountContact {
    return obj && 'acwaCode' in obj;
  }

  /**
   * Use this method to check if logged in user is an agent
   * @param obj
   * @returns {AccountContact}
   */
  isUserAgent(obj: any): obj is AccountContact {
    return obj && 'acccAccCode' in obj;
  }

  /**
   * Use this method to check if logged in user is an admin
   * @param obj
   * @returns {WebAdmin}
   */
  isUserAdmin(obj: any): obj is WebAdmin {
    return obj && 'id' in obj;
  }

  /**
   * Resolves the current user {UserType}
   * @param user the current logged in user
   * @returns {UserType}
   */
 /* resolveUserType(user: any): UserType | undefined | null {
    if (this.isUserClient(user)) {
      return UserType.CLIENT;
    } else if (this.isUserAdmin(user)) {
      return UserType.ADMIN;
    } else if (this.isUserAgent(user)) {
      return UserType.AGENT;
    }

    return null;
  }*/

  /**
   * Gets the logged in user code
   * @param user
   */
  resolveUserCode(user: any): number | undefined | null {
    if (this.isUserClient(user)) {
      return user.acwaClntCode;
    } else if (this.isUserAdmin(user)) {
      return user.id;
    } else if (this.isUserAgent(user)) {
      return user.acccAgnCode || user.acccAccCode || user.acccCode;
    }

    return null;
  }

  /**
   * Gets the logged in user code
   * @param user
   */
  resolveAgentCodeByAcccCode(user: any): number | undefined | null {
    if (this.isUserClient(user)) {
      return user.acwaClntCode;
    } else if (this.isUserAdmin(user)) {
      return user.id;
    } else if (this.isUserAgent(user)) {
      return user.acccCode;
    }

    return null;
  }

  /**
   * Gets the logged in userName
   * @param user
   */
  resolveUserName(user: any): string | undefined | null {
    if (this.isUserClient(user)) {
      return (user.acwaUsername);
    } else if (this.isUserAdmin(user)) {
      return (user.email);
    } else if (this.isUserAgent(user)) {
      return (user.acccUsername);
    }

    return null;
  }

  /**
   * Checks if an object is empty
   * @param obj
   * @returns {boolean}
   */
  isEmpty(obj: any): boolean {
    if (
      !obj ||
      ((typeof obj === 'string' || obj instanceof String) && !obj.trim())
    ) {
      return true;
    }

    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        return false;
      }
    }
    return true;
  }

  /**
   * Checks if an object is not empty
   * @param obj
   * @returns {boolean}
   */
  isNotEmpty(obj: any): boolean {
    return !this.isEmpty(obj);
  }

  /**
   * fetches an object from array given property name and property value
   * @param objs
   * @param propertyName
   * @param propertyValue
   * @returns {boolean}
   */

  getObject<T>(objs: T[], propertyName: string, propertyValue: any): T {
    let obj: T;
    if (this.isNotEmpty(objs)) {
      objs.forEach((v: any) => {
        // tslint:disable-next-line
        if (v[propertyName] == propertyValue) {
          obj = v;
        }
      });
    }
    return obj;
  }

  /**
   * Get full name from portal client
   * @param {PortalClient} portalClient
   * @returns {string}
   */
  getFullName(client?: ClientDTO): string {
    if (this.isEmpty(client)) {
      return '';
    }
    let fullName = '';
    const firstName = (client.firstName || '').trim();
    const lastName = (client.lastName || '').trim();
    if (firstName){
      fullName += firstName;
    }
    if (lastName){
      fullName += ' ' + lastName;
    }
    return fullName;
  }

  /**
   * Get full name from  client
   * @param client
   * @returns {string}
   */
  getClientFullName(client: {
    surname?: string;
    type?: string;
    name?: string;
    otherNames?: string;
  }): string {
    if (this.isEmpty(client)) {
      return '';
    }

    if (client.type !== 'I') {
      return client.name;
    }

    const surname = (client.surname || '').trim();
    const name = (client.name || '').trim();
    const otherNames = (client.otherNames || '').trim();

    return (
      name +
      (name ? ' ' : '') +
      surname +
      (surname ? ' ' : '') +
      otherNames +
      (otherNames ? ' ' : '')
    );
  }

  /**
   * Concatenates names
   * @param names {string[]} - names to be concatenated
   * @returns {string} - concatenated names
   */
  concatNames(...names: string[]): string {
    if (!names) {
      return '';
    }

    return names.filter((name) => this.isNotEmpty(name)).join(' ');
  }

  /**
   *
   * @param {string} fullName
   * @param clntType
   * @returns {FullName}
   */
  extractNames(
    fullName: string,
    clntType: 'I' | 'C' | 'T' | 'W' = 'I',
  ): FullName {
    if (!fullName) {
      return {clntName: '', clntOtherNames: '', clntSurname: ''};
    }

    const _fullName = fullName.trim();
    if (clntType === 'C') {
      return {clntName: _fullName, clntSurname: '', clntOtherNames: ''};
    }

    let name: any, surname: any, otherNames: any;
    [name, ...otherNames] = (_fullName || '').split(' ');
    if (otherNames) {
      otherNames = otherNames.join(' ');
      [surname, ...otherNames] = (otherNames || '').split(' ');
      otherNames = otherNames.join(' ');
    }

    return {
      clntName: name,
      clntSurname: otherNames,
      clntOtherNames: surname,
    };
  }

  /**
   * Use this method to generate a full Uri from an angular route
   *
   * for example if you have baseHref = 'TURNKEY', route= '/products' then the url built will be
   * http://localhost:4200/TURNKEY/products or
   * http://localhost:4200/TURNKEY/#/products
   * @param baseHref
   * @param route
   */
  generateFullUri(baseHref: string, route: string): string {
    let myUrl = '';
    if (route.startsWith('/')) {
      myUrl = route.replace('/', '');
    } else {
      myUrl = route;
    }

    if (window.location.hash.length > 1) {
      myUrl = `#/${myUrl}`;
    }

    return `${window.location.origin + baseHref + myUrl}`;
  }

  /**
   * Checks if  IE browser
   * @returns {boolean}
   */
  isIE(): boolean {
    if (/MSIE 10/i.test(navigator.userAgent)) {
      // This is internet explorer 10
      return true;
    } else if (
      /MSIE 9/i.test(navigator.userAgent) ||
      /rv:11.0/i.test(navigator.userAgent)
    ) {
      // This is internet explorer 9 or 11
      return true;
    } else if (/Edge\/\d./i.test(navigator.userAgent)) {
      // This is Microsoft Edge
      return true;
    }

    return false;
  }

  /**
   * Compute year range given the from date to to date.
   *
   * @param from
   * @param to
   */
 /* computeYearRange(from: Date, to: Date = new Date()): string {
    let _from = from;
    if (this.isEmpty(from)) {
      _from = subYears(new Date(), 100);
    }

    return format(_from, 'yyyy') + ':' + format(to, 'yyyy');
  }*/

  /**
   *
   * @param myArray
   * @param chunk_size
   */
  chunkArray<T>(myArray: T[], chunk_size: number): T[][] {
    const arrayLength = myArray.length;
    const tempArray: T[][] = [];

    for (let index = 0; index < arrayLength; index += chunk_size) {
      const myChunk = myArray.slice(index, index + chunk_size);
      // Do something if you want with the group
      tempArray.push(myChunk);
    }

    return tempArray;
  }

  /**
   * Converts a base64 string to a blob
   * @param base64String base64 string
   * @returns {Blob} generated blob
   */
  blobPdfFromBase64String(base64String: string) {
    const byteArray = Uint8Array.from(
      atob(base64String)
        .split('')
        .map((char) => char.charCodeAt(0)),
    );
    return new Blob([byteArray], {type: 'application/pdf'});
  }

  /**
   * Converts a blob to a base64 string
   * @param blob
   * @returns {string} base64 string
   */
  blobToString(blob: Blob): string {
    let url, xmlHttpRequest;
    url = URL.createObjectURL(blob);
    xmlHttpRequest = new XMLHttpRequest();
    xmlHttpRequest.open('GET', url, false); // although sync, you're not fetching over internet
    xmlHttpRequest.send();
    URL.revokeObjectURL(url);
    return xmlHttpRequest.responseText;
  }

  /**
   * Get's the control name.
   *
   * @param {AbstractControl | null} c the control to get name from
   * @return {string | null} the name of the control if found
   */
  getControlName(c: AbstractControl | null): string | null {
    const formGroup = c?.parent?.controls;
    return (
      (formGroup &&
        Object.keys(formGroup).find((name) => c === formGroup[name])) ||
      null
    );
  }

  /**
   * Checks if any of the inputs has a value
   * @param inputs {any[]} - inputs to check
   * @returns {boolean} - true if any of the inputs has a value
   */
  checkAnyHasValue(...inputs: any[]): boolean {
    for (const input in inputs) {
      if (this.isNotEmpty(input)) {
        return true;
      }
    }

    return false;
  }

  /**
   * Resolves the current user {UserType}
   * @param user the current logged in user
   * @returns {UserType}
   */
  // TODO: migrate it to lmsUtilService
  resolveStringUserType(user: any): string | undefined | null {
    if (this.isUserClient(user)) {
      return 'C';
    } else if (this.isUserAdmin(user)) {
      return 'ADMIN';
    } else if (this.isUserAgent(user)) {
      return 'A';
    }

    return null;
  }

  /**
   * Use the method to convert object values to UPPERCASE
   * @param webObject {any} - object to be converted
   * @returns {any} - converted object
   */
  objToUpperCase(webObject: { [x: string]: string; }) {
    let upperCaseObject = webObject;
    for (let key of Object.keys(webObject)) {
      if (webObject[key] !== null && webObject[key] !== undefined) {
        let upper = webObject[key];
        if (typeof upper === 'string') {
          webObject[key] = upper.toString().toUpperCase();
        }
      }
    }
    return upperCaseObject;
  }


  /**
   * Use the method to convert object values to titleCase
   * @param webObject {any} - object to be converted
   * @returns {any} - converted object
   */
  objToTitleCase(webObject: { [x: string]: any; }) {
    let titleCaseObject = webObject;
    for (let key of Object.keys(webObject)) {
      if (webObject[key] !== null && webObject[key] !== undefined) {
        let str = webObject[key];
        str = str.toString().toLowerCase();
        str = str.split(' ');
        for (let i = 0; i < str.length; i++) {
          str[i] = str[i].charAt(0).toUpperCase() + str[i].slice(1);
        }
        webObject[key] = str.join(' ');
      }
    }
    return titleCaseObject;
  }

  /**
   * Use the method to convert object values to lowercase
   * @param str {any} - object to be converted
   * @returns {string} - converted object
   */
  strToTitleCase(str: { toString: () => string; }): string {
    let titleStr = str.toString().toLowerCase();
    const words = titleStr.split(' ');
    for (let i = 0; i < words.length; i++) {
      words[i] = words[i].charAt(0).toUpperCase() + words[i].slice(1);
    }
    return words.join(' ');
  }


  // strToTitleCase(str: { toString: () => string; }) {
  //   let titleStr = str.toString().toLowerCase();
  //   titleStr = titleStr.split(' ');
  //   for (let i = 0; i < titleStr.length; i++) {
  //     titleStr[i] = titleStr[i].charAt(0).toUpperCase() + titleStr[i].slice(1);
  //   }
  //   return titleStr.join(' ');
  // }

  /**
   * Generates a random string
   * @param length {number} - length of the string to be generated
   * @returns {string} - generated string
   */
  getRandomString(length: number) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  /**
   * Get the current year
   * @returns {number} - current year
   */
  getCurrentYear() {
    const date = new Date();
    return date.getFullYear();
  }

  /**
   * Removes null values from query params
   * @param params {HttpParams} - query params
   * @returns {any} - query params without null values
   */
  removeNullValuesFromQueryParams(params: HttpParams) {
    return params ? params.keys().reduce((queryParams: any, key) => {
      // getting value from map
      let value: any = params.get(key);

      // extracting value if it's an array
      value = Array.isArray(value) ? value[0] : value;

      // adding only defined values to the params
      if (value !== undefined && value !== null && value !== 'null' && value !== '') {
        queryParams[key] = value;
      }

      return queryParams;
    }, {}) : {};
  }

  /**
   * Check if a document is an image
   * @param mimeType
   * @return boolean - true if document is an image
   */
  checkIfImage(mimeType: string) {
    return mimeType?.includes('jpg') || mimeType?.includes('png') || mimeType?.includes('jpeg');
  }

  /**
   * Check if a document is a pdf
   * @param mimeType
   * @return boolean - true if document is a pdf
   */
  checkIfPdf(mimeType: string) {
    return mimeType?.includes('pdf');
  }

  /**
   * Method to generate File URL from a base64 string value
   * @param mimeType in the format type/subtyepe e.g 'ímage/png' according to MIME types defined and standardized in IETF's RFC 6838.
   * @param base64String which is the file data represented as a base64 string
   * @returns {string} URL of the file
   */
  generateURLFromBase64String(mimeType: string,
                              base64String: string) {
    // extract base64string
    // if in format: "data:image/png;base64,iVBORw0KG... extract data after coma
    let base64FileData = !!base64String && base64String.includes(',') ?
      base64String.split(',')[1] :
      base64String;

    // Decode the base64 string into a binary buffer.
    const binaryData = atob(base64FileData); // 'atob' is a built-in function to decode base64 strings
    const byteArray = Uint8Array.from(
      atob(base64String)
        .split('')
        .map((char) => char.charCodeAt(0)),
    );

    // Create a Blob object from the array buffer.
    const blob = new Blob([byteArray], {type: mimeType});

    // Create a temporary URL for the Blob object using the URL.createObjectURL() method.
    return URL.createObjectURL(blob);
  }

  /**
   * Checks if a value is a number
   * @param val {any} - value to be checked
   * @returns {boolean} - true if value is a number
   */
  isNumber(val: any): boolean {
    return typeof val === 'number';
  }

  /*Method scrolls vertically to the section of a form where an input is required*/
  /**
   * Scrolls vertically to the section of a form where an input is required
   * @param element {HTMLElement} - element to be scrolled to
   */
  findScrollContainer(element: HTMLElement): HTMLElement | null {
    while (element.parentElement) {
      element = element.parentElement;
      const overflowY = window.getComputedStyle(element).overflowY;
      if (element.scrollHeight > element.clientHeight && (overflowY === 'scroll' || overflowY === 'auto')) {
        if (element.tagName.toLowerCase() === 'form') {
          const formScrollContainer = element.querySelector('.form-scroll-container') as HTMLElement;
          if (formScrollContainer) {
            return formScrollContainer;
          }
        } else {
          return element;
        }
      }
    }
    return null;
  }

  // format date in typescript
  /**
   * Formats a date
   * @param date  {Date} - date to be formatted
   * @param format {string} - format to be used
   * @returns {string} - formatted date
   */
  getFormattedDate(date: Date, format: string) {
    const datePipe = new DatePipe('en-US');
    return datePipe.transform(date, format);
  }

  clearSessionStorageData(){
    sessionStorage.removeItem('quickQuoteData')
    sessionStorage.removeItem('mandatorySections')
    sessionStorage.removeItem('passedQuotationDetails')
    sessionStorage.removeItem('passedQuotationNumber')
    sessionStorage.removeItem('premiumComputationRequest')
    sessionStorage.removeItem('quickQuotationNum')
    sessionStorage.removeItem('quickQuotationCode')
    sessionStorage.removeItem('quotationNumber')
    sessionStorage.removeItem('passedSelectedRiskDetails')
    sessionStorage.removeItem('product')
    sessionStorage.removeItem('quoteAction')
  }
}
