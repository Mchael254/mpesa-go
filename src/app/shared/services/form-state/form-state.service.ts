import { Injectable } from '@angular/core';
import {LocalStorageService} from "../local-storage/local-storage.service";
import {FormState} from "../../data/form-state";
import {SessionStorageService} from "../session-storage/session-storage.service";

/**
 * This service is used to save the state of a form in session storage
 */

@Injectable({
  providedIn: 'root'
})
export class FormStateService {

  constructor(private localStorageService: LocalStorageService,
              private sessionStorageService: SessionStorageService) { }

  /**
   * Saves the form state to session storage
   * @param formStateKey
   * @param formValues
   */
  saveFormState(formStateKey, formValues: FormState){
    this.sessionStorageService.setItem(formStateKey, formValues);
  }

  /**
   * Gets the form state from session storage
   * @param formStateKey - the key to the form state of type string
   */
  getFormState(formStateKey: string){
    return this.sessionStorageService.getItem(formStateKey);
  }

  /**
   * Destroys the form state from session storage
   * @param formStateKey - the key to the form state of type string
   */
  destroyFormState(formStateKey: string) {
    this.sessionStorageService.removeItem(formStateKey);
  }

  /**
   * Checks if the form state exists in session storage and returns true if it does
   * @param formStateKey
   */
  formStateExists(formStateKey): boolean {
    return (!!this.getFormState(formStateKey));
  }
}
