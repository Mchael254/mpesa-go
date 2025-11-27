import {ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {Pagination} from "../../../../../shared/data/common/pagination";
import {AgentDTO} from "../../../data/AgentDTO";
import {Observable} from "rxjs";
import {Logger, untilDestroyed, UtilService} from "../../../../../shared/shared.module";
import {LazyLoadEvent} from "primeng/api";
import {TableLazyLoadEvent} from "primeng/table";
import {tap} from "rxjs/operators";
import {IntermediaryService} from "../../../services/intermediary/intermediary.service";
import {Router} from "@angular/router";
import {BreadCrumbItem} from "../../../../../shared/data/common/BreadCrumbItem";
import {TableDetail, TableFieldConfig} from "../../../../../shared/data/table-detail";
import { NgxSpinnerService } from 'ngx-spinner';
import {
  DynamicScreensSetupService
} from "../../../../../shared/services/setups/dynamic-screen-config/dynamic-screens-setup.service";
import {DynamicScreenSetupDto} from "../../../../../shared/data/common/dynamic-screens-dto";
import {GlobalMessagingService} from "../../../../../shared/services/messaging/global-messaging.service";

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
  isSearching = false;
  searchTerm = '';

  columns: TableFieldConfig[];
  actionLabel: {} = {};
  columnLabel: {} = {};
  viewLabel: {} = {};

  columnDialogVisible: boolean = false;

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

  filterObject: {
    name:string, agentIdNo:string, modeOfIdentity:string, primaryType:string, accountType:string
  } = {
    name:'', agentIdNo:'', modeOfIdentity:'', primaryType:'' , accountType:''
  };

  language: string;
  dynamicSetupData: DynamicScreenSetupDto;

  constructor(
    private router: Router,
    private intermediaryService: IntermediaryService,
    private cdr: ChangeDetectorRef,
    private spinner: NgxSpinnerService,
    private utilService: UtilService,
    private dynamicScreenSetupService: DynamicScreensSetupService,
    private globalMessagingService: GlobalMessagingService,
  ) {
    this.tableDetails = {
      // cols: this.cols,
      rows: this.intermediaries?.content,
      globalFilterFields: this.globalFilterFields,
      isLazyLoaded: true,
      paginator: false,
      showFilter: false,
      showSorting: false
    }

    this.utilService.currentLanguage.subscribe(lang => {
      this.language = lang;
    });
  }

  /**
   * The ngOnInit function initializes the tableDetails object and shows a spinner.
   */
  ngOnInit(): void {
    this.fetchTableConfig();
    this.tableDetails = {
      // cols: this.cols,
      rows: this.intermediaries?.content,
      globalFilterFields: this.globalFilterFields,
      showFilter: false,
      showSorting: true,
      paginator: true,
      // url: '/home/entity/view',
      urlIdentifier: 'id',
      isLazyLoaded: true,
      viewDetailsOnView: true,
      viewMethod: this.viewDetailsWithId.bind(this),
    }
    this.spinner.show();
  }

  fetchTableConfig(): void {
    this.columns = [];
    const screenId = 'entities_records_intermediaries';

    this.dynamicScreenSetupService.fetchDynamicSetupByScreen(
      null,
      screenId,
      null,
      null,
      null
      ).subscribe({
      next: data => {
        this.dynamicSetupData = data;

        data.fields.forEach(field => {
          const header = (field.fieldId.split('_'))[2];

          if (field.fieldId.includes('columnLabel')) {
            this.columnLabel = field.label;
            return;
          }

          if (field.fieldId.includes('actionLabel')) {
            this.actionLabel = field.label;
            return;
          }

          if (field.fieldId.includes('viewLabel')) {
            this.viewLabel = field.label;
            return;
          }

          this.columns.push({
            field: field.fieldId,
            header,
            label: field.label,
            visible: field.visible,
          });

        });
        log.info('dynamic setup data', data, this.columns);
      },
      error: err => {
        this.globalMessagingService.displayErrorMessage('Error', err.error.message)
      }
    })

  }

  viewDetailsWithId(rowId: number, category?: string): void {
    const partyType = 'intermediary';

    this.router.navigate([ `/home/entity/view/${rowId}`], { queryParams: { category, partyType } });

    /*this.router.navigate(
      [ `/home/entity/intermediary/view/${rowId}`],
      { queryParams: { category, partyType } },
    );*/
  }

  /**
   * The function `getAgents` retrieves a paginated list of agents, with optional sorting parameters, from an intermediary
   * service.
   * @param {number} pageIndex - The pageIndex parameter is used to specify the index of the page to retrieve. It is a
   * number that represents the page number.
   * @param pageSize
   * @param {any} [sortField=createdDate] - The `sortField` parameter is used to specify the field by which the agents
   * should be sorted. It can be any value, but it is typically a string representing the name of a field in the `AgentDTO`
   * object.
   * @param {string} [sortOrder=desc] - The `sortOrder` parameter is a string that specifies the order in which the agents
   * should be sorted. It can have two possible values: "asc" for ascending order and "desc" for descending order. By
   * default, the sort order is set to "desc".
   * @returns an Observable of type Pagination<AgentDTO>.
   */
  getAgents(pageIndex: number,
            pageSize: number,
            sortField: any = 'createdDate',
            sortOrder: string = 'desc'): Observable<Pagination<AgentDTO>> {
    return this.intermediaryService
      .getAgents(pageIndex, pageSize, sortField, sortOrder)
      .pipe(untilDestroyed(this));
  }

  /**
   * The function "lazyLoadAgents" is used to fetch agents with pagination and sorting, and update the UI with the fetched
   * data.
   * @param {LazyLoadEvent | TableLazyLoadEvent} event - The `event` parameter is of type `LazyLoadEvent` or
   * `TableLazyLoadEvent`. It is an object that contains information about the lazy loading event triggered by the user.
   */
  lazyLoadAgents(event:LazyLoadEvent | TableLazyLoadEvent){
    const pageIndex = event.first / event.rows;
    const sortField = event.sortField;
    const sortOrder = event?.sortOrder == 1 ? 'desc' : 'asc';
    const pageSize = event.rows;

    if (this.isSearching) {
      const searchEvent = {
        target: {value: this.searchTerm}
      };
      this.filter(searchEvent,pageIndex, pageSize, null);
    }
    else {
      this.getAgents(pageIndex, pageSize, sortField, sortOrder)
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
            this.spinner.hide();
          },
          error => { this.spinner.hide(); }
        );
    }

  }

  gotoEntityPage() {
    this.router.navigate(['/home/entity/new'],
      {queryParams: {entityType: 'Agent'}}).then(r => {
    })
  }

  ngOnDestroy(): void {
  }

  filter(event, pageIndex: number = 0, pageSize: number = event.rows, keyData: string) {

   this.intermediaries = null;

    const key = keyData.split('_')[2];
    let data = this.filterObject[key];

    this.isSearching = true;
    this.spinner.show();

    if (data.trim().length > 0 || data === undefined || data === null) {
      this.intermediaryService
        .searchAgent(pageIndex, pageSize, key, data).subscribe({
        next: data => {
          this.intermediaries = data;
          this.spinner.hide();
        },
        error: err => {
          this.spinner.hide();
        }
      });
    }
    else {
      this.getAgents(pageIndex, pageSize)
        .pipe(
          untilDestroyed(this),
          tap((data) => log.info(`Fetching Agents>>>`, data))
        ).subscribe({
        next: (data: Pagination<AgentDTO>) => {
          data.content.forEach( intermediary => {
            intermediary.primaryType = 'I' ? 'Individual' : 'Corporate';
          });
          this.intermediaries = data;
          this.tableDetails.rows = this.intermediaries?.content;
          this.tableDetails.totalElements = this.intermediaries?.totalElements;
          this.cdr.detectChanges();
          this.spinner.hide();
        },
        error: err => {
          this.spinner.hide();
        }
      });
    }

  }

  /**
   * Filter records beased on column filter
   * @param event
   * @param field
   */
  processInput(event: Event, field: string) {
    const columnName: string = field.split('_')[2];
    this.filterObject[columnName] = (event.target as HTMLInputElement).value;
  }

}
