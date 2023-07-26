import { Component, OnDestroy, OnInit } from '@angular/core';
import { filter, tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import {LoaderService} from "../../services/loader.service";

@Component({
  selector: 'tq-frontend-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss'],
})
export class LoaderComponent implements OnInit, OnDestroy {
  showLoader$: Observable<boolean>;
  isBlocking = true;

  constructor(private readonly loaderService: LoaderService) {}

  ngOnInit(): void {
    this.loaderService.isBlocking
      .pipe(
        tap((isBlocking) => (this.isBlocking = isBlocking)),
        filter((isBlocking) => isBlocking)
      )
      .subscribe((_) => {
        this.showLoader$ = this.loaderService.isShowing;
      });
  }

  ngOnDestroy(): void {}
}
