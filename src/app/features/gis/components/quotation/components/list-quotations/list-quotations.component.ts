import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {LazyLoadEvent} from "primeng/api";
import {FormBuilder, FormGroup} from "@angular/forms";
import { untilDestroyed } from 'src/app/shared/shared.module';
import { QuotationsService } from 'src/app/features/gis/services/quotations/quotations.service';
import {tap} from "rxjs/operators";
import { Pagination } from 'src/app/shared/data/common/pagination';
import { QuotationsDTO } from 'src/app/features/gis/data/quotations-dto';
import { Logger } from 'src/app/shared/shared.module';
import {ActivatedRoute} from "@angular/router";

const log = new Logger('QuotationsComponent');
@Component({
  selector: 'app-list-quotations',
  templateUrl: './list-quotations.component.html',
  styleUrls: ['./list-quotations.component.css']
})
export class ListQuotationsComponent {
  quotations: Pagination<QuotationsDTO> = <Pagination<QuotationsDTO>>{};
  page = 0;

  pageSize = 5;
  event: LazyLoadEvent;
  totalRecords: number;
  accountCode:number;

  today = new Date();
  year = this.today.getFullYear(); // Get the current year
  month = (this.today.getMonth() + 1).toString().padStart(2, '0'); // Get the current month and pad with leading zero if necessary
  day = this.today.getDate().toString().padStart(2, '0'); // Get the current day and pad with leading zero if necessary

  dateToday = `${this.year}-${this.month}-${this.day}`;
  dateFrom = `${this.year-4}-${this.month}-${this.day}`;

  private _listFilter: string;

  get listFilter(): string {
    return this._listFilter;
  }

  set listFilter(value: string) {
    this._listFilter = value;
    this.searchQuotations(value);
  }
  public sortingForm: FormGroup;
  constructor(
    private fb: FormBuilder,
    private quotationsService: QuotationsService,
    private cdr: ChangeDetectorRef,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.accountCode = this.activatedRoute.snapshot.params['id'];
    this.createSortForm();
    this.getQuotationsByClientId(this.page, this.dateFrom, this.dateToday,  this.accountCode)
  }

  ngOnDestroy(): void {
  }
  createSortForm() {
    this.sortingForm = this.fb.group({
      dateCreated: true,
      sortOrder: ''
    });
  }

  searchQuotations(name:string){

  }
  lazyLoadQuotations(event:LazyLoadEvent) {

  }
  getQuotationsByClientId(pageIndex: number,
                dateFrom: string,
                dateTo: string,
                          accountCode: number) {
    return this.quotationsService
      .getQuotations(pageIndex, dateFrom, dateTo, accountCode)
      .pipe(
        untilDestroyed(this),
        tap((data) => log.info(`Fetching Quotations>>>`, data))
      )
      .subscribe(
        (data: Pagination<QuotationsDTO>) => {
          this.quotations = data;
          this.cdr.detectChanges();
        }
      );
  }
}
