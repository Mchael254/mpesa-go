import {ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {Pagination} from "../../../../../shared/data/common/pagination";
import {AgentDTO} from "../../../data/AgentDTO";
import {Observable} from "rxjs";
import {Logger, untilDestroyed} from "../../../../../shared/shared.module";
import {LazyLoadEvent} from "primeng/api";
import {TableLazyLoadEvent} from "primeng/table";
import {tap} from "rxjs/operators";
import {IntermediaryService} from "../../../services/intermediary/intermediary.service";
import {SortFilterService} from "../../../../../shared/services/sort-filter.service";
import {FormBuilder} from "@angular/forms";
import {Router} from "@angular/router";
import {BreadCrumbItem} from "../../../../../shared/data/common/BreadCrumbItem";
import {TableDetail} from "../../../../../shared/data/table-detail";

const log = new Logger('ListIntermediaryComponent');

@Component({
  selector: 'app-list-intermediary',
  templateUrl: './list-intermediary.component.html',
  styleUrls: ['./list-intermediary.component.css']
})
export class ListIntermediaryComponent implements OnInit, OnDestroy {

  public intermediaries: Pagination<AgentDTO> = <Pagination<AgentDTO>>{};
  tableDetails: TableDetail;

  pageSize = 5;

  cols = [
    { field: 'name', header: 'Name' },
    { field: 'modeOfIdentity', header: 'Primary ID Type' },
    { field: 'agentIdNo', header: 'ID Number' },
    { field: 'primaryType', header: 'Account Type' },
    { field: 'accountType', header: 'Business Unit' }
  ];

  globalFilterFields = ['name','modeOfIdentity', 'agentIdNo', 'accountType'];
  intermediaryBreadCrumbItems: BreadCrumbItem[] = [
    {
      label: 'Home',
      url: '/home/dashboard'
    },
    {
      label: 'CRM',
      url: '/home/dashboard',
    },
    {
      label: 'Business Accounts',
      url: '/home/entity/intermediary/list'
    }
  ];

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private intermediaryService: IntermediaryService,
    private sortFilterService: SortFilterService,
    // private accountService: AccountService,
    private cdr: ChangeDetectorRef
  ) {
    this.tableDetails = {
      cols: this.cols,
      rows: this.intermediaries?.content,
      globalFilterFields: this.globalFilterFields,
      isLazyLoaded: true,
      paginator: false,
      showFilter: false,
      showSorting: false
    }
  }

  ngOnInit(): void {
    this.tableDetails = {
      cols: this.cols,
      rows: this.intermediaries?.content,
      globalFilterFields: this.globalFilterFields,
      showFilter: false,
      showSorting: true,
      paginator: true,
      url: '/home/entity/edit',
      urlIdentifier: 'id',
      isLazyLoaded: true
    }
  }

  getAgents(pageIndex: number,
            sortField: any = 'createdDate',
            sortOrder: string = 'desc'): Observable<Pagination<AgentDTO>> {
    return this.intermediaryService
      .getAgents(pageIndex, this.pageSize, sortField, sortOrder)
      .pipe(untilDestroyed(this));
  }

  lazyLoadAgents(event:LazyLoadEvent | TableLazyLoadEvent){
    const pageIndex = event.first / event.rows;
    const sortField = event.sortField;
    const sortOrder = event?.sortOrder == 1 ? 'desc' : 'asc';

    this.getAgents(pageIndex, sortField, sortOrder)
      .pipe(
        untilDestroyed(this),
        tap((data) => log.info(`Fetching Agents>>>`, data))
      )
      .subscribe(
        (data: Pagination<AgentDTO>) => {
          data.content.forEach( intermediary => {
            intermediary.primaryType = 'I' ? 'Individual' : 'Corporate';
          });
          this.intermediaries = data;
          this.tableDetails.rows = this.intermediaries?.content;
          this.tableDetails.totalElements = this.intermediaries?.totalElements;
          this.cdr.detectChanges();
        }
      );
  }

  searchIntermediary(name: string) {
    this.intermediaryService.searchAgent(
      0,
      5,
      name
    )
      .pipe(untilDestroyed(this))
      .subscribe( (data) => {
        this.intermediaries =  data;
      });
  }

  gotoEntityPage() {
    this.router.navigate(['/home/entity/new'],
      {queryParams: {entityType: 'Agent'}}).then(r => {
    })
  }

  ngOnDestroy(): void {
  }

  /*sortIntermediary() {
    const sortValues = this.sortingForm.getRawValue();
    const payload: any = { // todo: create DTO for payload
      sortListFields: sortValues.dateCreated ? 'dateCreated' : null,
      order: sortValues.sortOrder
    }
    this.sortFilterService.dateSortIntermerdiary(payload.sortListFields, payload.order)
      .subscribe(data => {
        this.intermediaries = data;
        this.cdr.detectChanges();
      })
  }*/

  /*intermediarySummary(id: number){
    let partyId: number;

    // fetch account details to fetch party id before routing to 360 view
    this.accountService
      .getAccountDetailsByAccountCode(id)
      .pipe(
        map((data: PartyAccountsDetails) => {
            this.accountService.setCurrentAccounts(data); // set this current as current account.
            return data?.partyId;
          },
          untilDestroyed(this)
        ))
      .subscribe( (_x) => {
        partyId = _x;
        this.router.navigate([ `/home/view-entity/${partyId}`]);
      });
  }*/
}
