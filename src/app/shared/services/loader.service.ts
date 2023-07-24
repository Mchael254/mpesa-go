/****************************************************************************
 **
 ** Author: Justus Muoka
 **
 ****************************************************************************/

import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, ReplaySubject } from 'rxjs';
import { distinctUntilChanged, share } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class LoaderService {
  private _isShowingSubject = new BehaviorSubject<boolean>(this.counter > 0);
  public isShowing: Observable<
    boolean
  > = this._isShowingSubject
    .asObservable()
    .pipe(share(), distinctUntilChanged());

  private _isBlockingSubject = new BehaviorSubject<boolean>(true);
  public isBlocking: Observable<
    boolean
  > = this._isBlockingSubject
    .asObservable()
    .pipe(share(), distinctUntilChanged());

  private _xhrStatusSubject = new ReplaySubject<boolean>(1);
  public xhrStatus = this._xhrStatusSubject.asObservable();

  private _xhrCounter = 0;

  private get xhrCounter(): number {
    return this._xhrCounter;
  }

  private set xhrCounter(value: number) {
    this._xhrCounter = value;
  }

  constructor() {}

  private _counter = 0;

  private get counter(): number {
    return this._counter;
  }

  private set counter(value: number) {
    this._counter = value;
  }

  startXhr() {
    if (this.xhrCounter < 0) {
      this.xhrCounter = 0;
    }
    this.xhrCounter += 1;

    this._xhrStatusSubject.next(this.xhrCounter > 0);
  }

  completeXhr() {
    if (this.xhrCounter > 1) {
      this.xhrCounter -= 1;
    } else {
      this.xhrCounter = 0;
    }

    this._xhrStatusSubject.next(this.xhrCounter > 0);
  }

  start() {
    if (this.counter < 0) {
      this.counter = 0;
    }
    this.counter += 1;

    this._isShowingSubject.next(this.counter > 0);
  }

  complete() {
    if (this.counter > 1) {
      this.counter -= 1;
    } else {
      this.counter = 0;
      this.blockingLoader(); // this is the default for the application
    }

    this._isShowingSubject.next(this.counter > 0);
  }

  blockingLoader() {
    this._isBlockingSubject.next(true);
  }

  nonBlockingLoader() {
    this._isBlockingSubject.next(false);
  }

  forceStop() {
    this.counter = 0;
    this.xhrCounter = 0;

    this.complete();
    this.completeXhr();
  }
}
