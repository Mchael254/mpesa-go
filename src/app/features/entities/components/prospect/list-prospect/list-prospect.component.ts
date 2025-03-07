import { ChangeDetectorRef, Component } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, map, tap } from 'rxjs';
import { LazyLoadEvent } from 'primeng/api';
import { TableLazyLoadEvent } from 'primeng/table';

import { BreadCrumbItem } from '../../../../../shared/data/common/BreadCrumbItem';
import { Pagination } from '../../../../../shared/data/common/pagination';
import { AccountService } from '../../../services/account/account.service';
import { PartyAccountsDetails } from '../../../data/accountDTO';
import { untilDestroyed } from '../../../../../shared/services/until-destroyed';
import { ProspectService } from '../../../services/prospect/prospect.service';
import { ProspectDto } from '../../../data/prospectDto';
import { Logger } from '../../../../../shared/services/logger/logger.service';

const log = new Logger('ListProspectComponent');

@Component({
  selector: 'app-list-prospect',
  templateUrl: './list-prospect.component.html',
  styleUrls: ['./list-prospect.component.css'],
})
export class ListProspectComponent {
  public prospectData: Pagination<ProspectDto> = <Pagination<ProspectDto>>{};
  public pageSize: 5;
  public isSearching = false;
  public searchTerm = '';

  prospectBreadCrumbItems: BreadCrumbItem[] = [
    {
      label: 'Home',
      url: '/home/dashboard',
    },
    {
      label: 'Account',
      url: '/home/entity',
    },
    {
      label: 'New Prospect',
      url: '/home/entity/prospect/list',
    },
  ];

  globalFilterFields = [
    'firstName',
    'modeOfIdentity',
    'idNumber',
    'clientType',
    'converted'
  ];

  filterObject: {
    name: string;
    modeOfIdentity: string;
    idNumber: string;
    clientType: string;
    converted: string;
  } = {
    name: '',
    modeOfIdentity: '',
    idNumber: '',
    clientType: '',
    converted: ''
  };

  constructor(
    private router: Router,
    private prospectService: ProspectService,
    private accountService: AccountService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {}

  ngOnDestroy(): void {}

  lazyLoadProspects(event: LazyLoadEvent | TableLazyLoadEvent) {
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
      this.getProspects(pageIndex, pageSize, sortField, sortOrder)
        .pipe(
          untilDestroyed(this),
          tap((data) => log.info(`Fetching Prospects>>>`, data))
        )
        .subscribe(
          (data: Pagination<ProspectDto>) => {
            this.prospectData = data;
            this.cdr.detectChanges();
            // this.spinner.hide();
          },
          (error) => {
            // this.spinner.hide();
          }
        );
    }
  }

  getProspects(
    pageIndex: number,
    pageSize: number,
    sortField: any,
    sortOrder: string = 'desc'
  ): Observable<Pagination<ProspectDto>> {
    return this.prospectService
      .getAllProspects(pageIndex, pageSize, sortField, sortOrder)
      .pipe(untilDestroyed(this));
  }

  gotoEntityPage() {
    this.router
      .navigate(['/home/entity/new'], {
        queryParams: { entityType: 'Prospect' },
      })
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
    this.prospectData = null;

    this.isSearching = true;

    this.prospectService
      .searchProspects(
        pageIndex,
        pageSize,
        this.filterObject?.name,
        this.filterObject?.modeOfIdentity,
        this.filterObject?.idNumber,
        this.filterObject?.clientType
      )
      .subscribe(
        (data: Pagination<ProspectDto>) => {
          this.prospectData = data;
        },
        (error) => {}
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
    this.filterObject['clientType'] = value;
  }
}
