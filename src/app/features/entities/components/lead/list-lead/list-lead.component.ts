import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Observable, map, tap } from 'rxjs';
import { LazyLoadEvent } from 'primeng/api';
import { TableLazyLoadEvent } from 'primeng/table';

import { BreadCrumbItem } from '../../../../../shared/data/common/BreadCrumbItem';
import { AccountService } from '../../../services/account/account.service';
import { PartyAccountsDetails } from '../../../data/accountDTO';
import { untilDestroyed } from '../../../../../shared/services/until-destroyed';
import { LeadsService } from '../../../../../features/crm/services/leads.service';
import { Pagination } from '../../../../../shared/data/common/pagination';
import { Leads } from '../../../../../features/crm/data/leads';
import { Logger } from '../../../../../shared/services/logger/logger.service';

const log = new Logger('ListLeadComponent');

@Component({
  selector: 'app-list-lead',
  templateUrl: './list-lead.component.html',
  styleUrls: ['./list-lead.component.css'],
})
export class ListLeadComponent implements OnInit {
  public leadsData: Pagination<Leads> = <Pagination<Leads>>{};
  public pageSize: 5;
  public isSearching = false;
  public searchTerm = '';
  leadBreadCrumbItems: BreadCrumbItem[] = [
    {
      label: 'Home',
      url: '/home/dashboard',
    },
    {
      label: 'CRM',
      url: '/home/dashboard',
    },
    {
      label: 'Lead',
      url: '/home/entity/lead/list',
    },
  ];

  globalFilterFields = [
    'firstName',
    'modeOfIdentity',
    'idNumber',
    'clientTypeName',
  ];

  filterObject: {
    name: string;
    modeOfIdentity: string;
    idNumber: string;
    clientTypeName: string;
  } = {
    name: '',
    modeOfIdentity: '',
    idNumber: '',
    clientTypeName: '',
  };

  constructor(
    private router: Router,
    private leadService: LeadsService,
    private accountService: AccountService,
    private cdr: ChangeDetectorRef,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit(): void {
    this.spinner.show();
  }

  ngOnDestroy(): void {}

  lazyLoadLeads(event: LazyLoadEvent | TableLazyLoadEvent) {
    const pageIndex = event.first / event.rows;
    const sortField = event.sortField;
    const sortOrder = event?.sortOrder == 1 ? 'desc' : 'asc';
    const pageSize = event.rows;

    if (this.isSearching) {
      const searchEvent = {
        target: { value: this.searchTerm },
      };
      this.filter(searchEvent, pageIndex, pageSize);
    } else {
      this.getLeads(pageIndex, pageSize, sortField, sortOrder)
        .pipe(
          untilDestroyed(this),
          tap((data) => log.info(`Fetching Leads>>>`, data))
        )
        .subscribe(
          (data: Pagination<Leads>) => {
            this.leadsData = data;
            this.cdr.detectChanges();
            this.spinner.hide();
          },
          (error) => {
            this.spinner.hide();
          }
        );
    }
  }

  getLeads(
    pageIndex: number,
    pageSize: number,
    sortField: any = 'leadDate',
    sortOrder: string = 'desc'
  ): Observable<Pagination<Leads>> {
    return this.leadService
      .getAllLeads(pageIndex, pageSize, sortField, sortOrder)
      .pipe(untilDestroyed(this));
  }

  gotoEntityPage() {
    this.router
      .navigate(['/home/entity/new'], { queryParams: { entityType: 'Lead' } })
      .then((r) => {});
  }

  viewDetailsWithId(rowId: number) {
    let partyId: number;

    // fetch account details to fetch party id before routing to 360 view
    this.accountService
      .getAccountDetailsByAccountCode(rowId)
      .pipe(
        map((data: PartyAccountsDetails) => {
          this.accountService.setCurrentAccounts(data);
          return data?.partyId;
        }, untilDestroyed(this))
      )
      .subscribe((_x) => {
        partyId = _x;
        this.router.navigate([`/home/entity/view/${partyId}`]);
      });
  }

  filter(event, pageIndex: number = 0, pageSize: number = event.rows) {
    this.leadsData = null;

    this.isSearching = true;
    this.spinner.show();
    this.leadService
      .searchLeads(
        pageIndex,
        pageSize,
        this.filterObject?.name,
        this.filterObject?.modeOfIdentity,
        this.filterObject?.idNumber,
        this.filterObject?.clientTypeName
      )
      .subscribe(
        (data) => {
          // this.leadsData = data;
          this.spinner.hide();
        },
        (error) => {
          this.spinner.hide();
        }
      );
  }

  inputName(event) {
    const value = (event.target as HTMLInputElement).value;
    this.filterObject['name'] = value;
  }

  inputModeOfIdentity(event) {
    const value = (event.target as HTMLInputElement).value;
    this.filterObject['modeOfIdentity'] = value;
  }

  inputIdNumber(event) {
    const value = (event.target as HTMLInputElement).value;
    this.filterObject['idNumber'] = value;
  }

  inputClientTypeName(event) {
    const value = (event.target as HTMLInputElement).value;
    this.filterObject['clientTypeName'] = value;
  }
}
