import { Injectable } from '@angular/core';
import { CanDeactivate } from '@angular/router';
import { Observable } from 'rxjs';

/**
 * An interface that components can implement to control whether they can be deactivated.
 * The guard will look for this method on the component.
 */
export interface CanComponentDeactivate {
  canDeactivate: () => Observable<boolean> | Promise<boolean> | boolean;
}

@Injectable({
  providedIn: 'root',
})
export class ReceiptPreviewGuard implements CanDeactivate<CanComponentDeactivate> {
  /**
   * This method is called by the Angular Router to determine if a route can be deactivated.
   * It checks if the component has a `canDeactivate` method and calls it.
   * @param component The component instance that is about to be deactivated.
   */
  canDeactivate(
    component: CanComponentDeactivate
  ): Observable<boolean> | Promise<boolean> | boolean {
    // If the component has the canDeactivate method, call it. Otherwise, allow navigation by default.
    return component.canDeactivate ? component.canDeactivate() : true;
  }
}