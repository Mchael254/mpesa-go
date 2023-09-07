import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {LazyLoadEvent} from "primeng/api";
import {FormBuilder, FormGroup} from "@angular/forms";
import {untilDestroyed} from "../../../../../../shared/shared.module";

import {tap} from "rxjs/operators";
import {Pagination} from '../../../../../../shared/data/common/pagination'
import {Logger} from '../../../../../../shared/services'
import {PoliciesService} from '../../../../../../features/gis/services/policies/policies.service'
import {PoliciesDTO} from '../../../../../../features/gis/data/policies-dto'
import {ActivatedRoute} from "@angular/router";
import {BreadCrumbItem} from '../../../../../../shared/data/common/BreadCrumbItem'

const log = new Logger('QuotationsComponent');
@Component({
  selector: 'app-list-policies',
  templateUrl: './list-policies.component.html',
  styleUrls: ['./list-policies.component.css']
})
export class ListPoliciesComponent {
  policiesBreadCrumbItems: BreadCrumbItem[] = [
    {
      label: 'Home',
      url: '/home/dashboard'
    },
    {
      label: 'CRM',
      url: '/home/dashboard',
    },
    {
      label: 'Policies',
      url: '/home/gis/policy/list'
    }
  ];
  policies: Pagination<PoliciesDTO> = <Pagination<PoliciesDTO>>{};
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
    this.searchPolicies(value);
  }
  public sortingForm: FormGroup;
  constructor(
    private fb: FormBuilder,
    private policiesServices: PoliciesService,
    private cdr: ChangeDetectorRef,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.accountCode = this.activatedRoute.snapshot.params['id'];
    this.createSortForm();
    this.getPoliciesByClientId(this.page, this.dateFrom, this.dateToday,  this.accountCode);
  }
  ngOnDestroy(): void {
  }

  createSortForm() {
    this.sortingForm = this.fb.group({
      dateCreated: true,
      sortOrder: ''
    });
  }

  searchPolicies(name:string){

  }
  lazyLoadPolicies(event:LazyLoadEvent) {

  }
 getPoliciesByClientId(pageIndex: number,
                          dateFrom: string,
                          dateTo: string,
                       accountCode: number) {
    return this.policiesServices
      .getPolicies(pageIndex, dateFrom, dateTo, accountCode)
      .pipe(
        untilDestroyed(this),
        tap((data) => log.info(`Fetching Policies>>>`, data))
      )
      .subscribe(
        (data: Pagination<PoliciesDTO>) => {
          this.policies = data;
          this.cdr.detectChanges();
        }
      );
  }
}
