import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {LazyLoadEvent} from "primeng/api";
import {untilDestroyed} from "../../../../../../shared/shared.module";
import {tap} from "rxjs/operators";
import {ViewClaimService} from '../../../../../../features/gis/services/claims/view-claim.service'
import {Pagination} from '../../../../../../shared/data/common/pagination'
import {Logger} from '../../../../../../shared/services'
import {ClaimsDTO} from '../../../../../../features/gis/data/claims-dto'
import {ActivatedRoute} from "@angular/router";

const log = new Logger('QuotationsComponent');
@Component({
  selector: 'app-list-claims',
  templateUrl: './list-claims.component.html',
  styleUrls: ['./list-claims.component.css']
})
export class ListClaimsComponent {

  claims: Pagination<ClaimsDTO> = <Pagination<ClaimsDTO>>{};
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
    this.searchClaim(value);
  }
  public sortingForm: FormGroup;
  constructor(
    private fb: FormBuilder,
    private claimsService: ViewClaimService,
    private cdr: ChangeDetectorRef,
    private activatedRoute: ActivatedRoute,
  ) {

  }

  ngOnInit(): void {
    this.accountCode = this.activatedRoute.snapshot.params['id'];
    this.createSortForm();
    this.getClaimsByClientId(this.page, this.dateFrom, this.dateToday, this.accountCode);
  }
  ngOnDestroy(): void {
  }

  createSortForm() {
    this.sortingForm = this.fb.group({
      dateCreated: true,
      sortOrder: ''
    });
  }

  searchClaim(name:string){

}
  lazyLoadClaims(event:LazyLoadEvent) {

  }

  getClaimsByClientId(pageIndex: number,
                        dateFrom: string,
                        dateTo: string,
                        accountCode: number) {
    return this.claimsService
      .getClaims(pageIndex, dateFrom, dateTo, accountCode)
      .pipe(
        untilDestroyed(this),
        tap((data) => log.info(`Fetching Claims>>>`, data))
      )
      .subscribe(
        (data: Pagination<ClaimsDTO>) => {
          this.claims = data;
          this.cdr.detectChanges();
        }
      );
  }
}
