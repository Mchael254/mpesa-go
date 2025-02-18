import { ChangeDetectorRef, Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { Logger } from '../../services';
import { AgentDTO } from 'src/app/features/entities/data/AgentDTO';
import { Pagination } from '../../data/common/pagination';
import { Router } from '@angular/router';
import { QuotationsService } from '../../../features/gis/components/quotation/services/quotations/quotations.service';
import { GlobalMessagingService } from '../../services/messaging/global-messaging.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { untilDestroyed } from '../../shared.module';
import { tap } from 'rxjs';
import { LazyLoadEvent } from 'primeng/api';
import { TableLazyLoadEvent } from 'primeng/table';
import { IntermediaryService } from '../../../features/entities/services/intermediary/intermediary.service';

const log = new Logger('agentSearchComponent');

@Component({
  selector: 'app-agent-search-modal',
  templateUrl: './agent-search-modal.component.html',
  styleUrls: ['./agent-search-modal.component.css'],
  standalone: false,
})

export class AgentSearchModalComponent {

  @ViewChild('closebutton') closebutton;
  @Output() agentSelected = new EventEmitter<{ agentName: string; agentId: number }>();

  tableDetails: any = {
    rows: [], // Initially empty array for rows
    totalElements: 0 // Default total count
  };
  pageSize: number = 19;
  isSearching = false;
  searchTerm = '';
  public agentsData: Pagination<AgentDTO> = <Pagination<AgentDTO>>{};
  filterObject: {
    name: string, id: string, shortDesc: string
  } = {
    name: '', id: '', shortDesc: ''
  };
  agentDetails: AgentDTO;
  globalFilterFields = ['id', 'name', 'shortDesc'];
  agentName: string;
  agentId: number;

  constructor(
    private router: Router,
    public quotationService: QuotationsService,
    public globalMessagingService: GlobalMessagingService,
    public cdr: ChangeDetectorRef,
    private intermediaryService: IntermediaryService,
    private spinner: NgxSpinnerService,
  ) {}

  ngOnDestroy(): void { }

  // SEARCHING AGENTS USING ID, NAME, AND SHORT DESCRIPTION
  getAgents(pageIndex: number,
      pageSize: number,
      sortField: any = 'createdDate',
      sortOrder: string = 'desc') {
      return this.intermediaryService
      .getAgents(pageIndex, pageSize, sortField, sortOrder)
      .pipe(
      untilDestroyed(this),
    );
  }

  lazyLoadAgents(event: LazyLoadEvent | TableLazyLoadEvent) {
    const pageIndex = event.first / event.rows;
    const sortField = event.sortField;
    const sortOrder = event?.sortOrder == 1 ? 'desc' : 'asc';
    const pageSize = event.rows;

    if (this.isSearching) {
      const searchEvent = {
        target: { value: this.searchTerm }
      };
      this.filter(searchEvent, pageIndex, pageSize);
    }
    else {
      this.getAgents(pageIndex, pageSize, sortField, sortOrder)
        .pipe(
          untilDestroyed(this),
          tap((data) => log.info(`Fetching Agents>>>`, data))
        )
        .subscribe(
          (data: Pagination<AgentDTO>) => {
            this.agentsData = data;
            this.tableDetails.rows = this.agentsData?.content;
            this.tableDetails.totalElements = this.agentsData?.totalElements;
            this.cdr.detectChanges();
            this.spinner.hide();
          },
          error => {
            this.spinner.hide();
          }
        );
    }
  }

  filter(event, pageIndex: number = 0, pageSize: number = event.rows) {
    this.agentsData = null; // Initialize with an empty array or appropriate structure
    let columnName;
    let columnValue;

    if (this.filterObject.id) {
      columnName = "id";
      columnValue = this.filterObject.id;
    } else if (this.filterObject.name) {
      columnName = "name";
      columnValue = this.filterObject.name;
    } else if (this.filterObject.shortDesc) {
      columnName = "shortDesc";
      columnValue = this.filterObject.shortDesc;
    }

    this.isSearching = true;
    this.spinner.show();
    this.intermediaryService.searchAgent(
      pageIndex, pageSize,
      columnName, columnValue
    ).subscribe((data) => {
      this.agentsData = data;
      this.spinner.hide();
    },
      error => {
        this.spinner.hide();
      }
    );
  }

  loadAgentDetails(id) {
    this.intermediaryService.getAgentById(id).subscribe((data) => {
      this.agentDetails = data;
      log.debug('Selected Agent Details:', this.agentDetails);
      const agentDetailsString = JSON.stringify(this.agentDetails);
      sessionStorage.setItem('agentDetails', agentDetailsString);
      this.saveAgent();
      this.closebutton.nativeElement.click();
    });
  }

  saveAgent() {
    this.agentId = Number(this.agentDetails.id);
    this.agentName = this.agentDetails.name;
    sessionStorage.setItem('agentId', JSON.stringify(this.agentId));

    this.agentSelected.emit({
      agentName: this.agentName,
      agentId: this.agentId,
    });
  }

  inputId(event) {
    const value = (event.target as HTMLInputElement).value;
    this.filterObject['id'] = value;
  }

  inputName(event) {
    const value = (event.target as HTMLInputElement).value;
    this.filterObject['name'] = value;
  }

  inputShortDesc(event) {
    const value = (event.target as HTMLInputElement).value;
    this.filterObject['shortDesc'] = value;
  }
}
