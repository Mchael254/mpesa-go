import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { Table } from 'primeng/table';

import { BreadCrumbItem } from '../../../../shared/data/common/BreadCrumbItem';
import { untilDestroyed } from '../../../../shared/services/until-destroyed';
import { GlobalMessagingService } from '../../../../shared/services/messaging/global-messaging.service';
import { Logger } from '../../../../shared/services/logger/logger.service';
import { MessagesService } from '../../services/messages.service';
import { Pagination } from '../../../../shared/data/common/pagination';
import { EmailHistoryDto, SmsHistoryDto } from '../../data/messages';
import { SystemsService } from '../../../../shared/services/setups/systems/systems.service';
import {
  SystemModule,
  SystemsDto,
} from '../../../../shared/data/common/systemsDto';

const log = new Logger('MessagesComponent');

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css'],
})
export class MessagesComponent implements OnInit {
  @ViewChild('smsHistoryTable') smsHistoryTable: Table;
  @ViewChild('emailHistoryTable') emailHistoryTable: Table;

  public smsHistoryData: Pagination<SmsHistoryDto> = <
    Pagination<SmsHistoryDto>
  >{};
  public emailHistoryData: Pagination<EmailHistoryDto> = <
    Pagination<EmailHistoryDto>
  >{};
  public selectedSmsHistory: SmsHistoryDto;
  public selectedEmailHistory: EmailHistoryDto;
  public response: any;
  public submitted = false;
  public visibleStatus: any = {};
  public errorOccurred = false;
  public errorMessage: string = '';
  public systems: SystemsDto[] = [];
  public systemModules: SystemModule[] = [];
  public selectedLevel;
  public dateFrom: Date;
  public dateTo: Date;
  public selectedTransactionLevel: any;
  public selectedStatus: any;
  public selectedSystem: number;

  organizationBreadCrumbItems: BreadCrumbItem[] = [
    {
      label: 'Administration',
      url: '/home/dashboard',
    },
    {
      label: 'CRM Setups',
      url: '/home/crm',
    },
    {
      label: 'Messaging',
      url: '/home/crm',
    },

    {
      label: 'SMS History',
      url: '/home/crm/messages',
    },
  ];

  constructor(
    private messageService: MessagesService,
    private globalMessagingService: GlobalMessagingService,
    private cdr: ChangeDetectorRef,
    private systemsService: SystemsService
  ) {}

  ngOnInit(): void {
    this.fetchSystemApps();
    this.fetchSystemModules();
  }

  ngOnDestroy(): void {}

  fetchSystemApps(organizationId?: number) {
    this.systemsService
      .getSystems(organizationId)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (data) => {
          if (data) {
            this.systems = data;
            log.info('Systems Data:', this.systems);
          } else {
            this.errorOccurred = true;
            this.errorMessage = 'Something went wrong. Please try Again';
            this.globalMessagingService.displayErrorMessage(
              'Error',
              'Something went wrong. Please try Again'
            );
          }
        },
        error: (err) => {
          this.errorOccurred = true;
          this.errorMessage = err?.error?.error;
          this.globalMessagingService.displayErrorMessage(
            'Error',
            this.errorMessage
          );
          log.info(`error >>>`, err);
        },
      });
  }

  fetchSystemModules(): void {
    this.systemsService.getSystemModules().subscribe({
      next: (res: SystemModule[]) => {
        this.systemModules = res;
        log.info('Systems Modules Data:', this.systemModules);
      },
      error: (err) => {
        log.info(err);
      },
    });
  }

  fetchSmsHistory(
    systemId: number,
    agentName?: string,
    clientName?: string,
    fromDate?: Date,
    page?: number,
    referenceNo?: string,
    size?: number,
    status?: string,
    toDate?: Date,
    transactionalLevel?: string
  ) {
    this.messageService
      .getSmsHistroy(
        systemId,
        agentName,
        clientName,
        fromDate,
        page,
        referenceNo,
        size,
        status,
        toDate,
        transactionalLevel
      )
      .subscribe((data) => {
        this.smsHistoryData = data;
        log.info('Fetched SMS History:', this.smsHistoryData);
      });
  }

  fetchEmailHistory(
    systemId: number,
    claimNo?: string,
    agentName?: string,
    clientName?: string,
    emailTo?: string,
    fromDate?: Date,
    page?: number,
    policyNo?: string,
    size?: number,
    status?: string,
    toDate?: Date,
    transactionalLevel?: string
  ) {
    this.messageService
      .getEmailHistroy(
        systemId,
        claimNo,
        agentName,
        clientName,
        emailTo,
        fromDate,
        page,
        policyNo,
        size,
        status,
        toDate,
        transactionalLevel
      )
      .subscribe((data) => {
        this.emailHistoryData = data;
        log.info('Fetched Email History Data:', this.emailHistoryData);
      });
  }

  onSystemChange() {
    this.checkFiltersAndFetch();
  }

  onDateChange() {
    this.checkFiltersAndFetch();
  }

  checkFiltersAndFetch() {
    const systemId = this.selectedSystem;
    const fromDate = this.dateFrom;
    const toDate = this.dateTo;
    const transactionalLevel = this.selectedTransactionLevel;

    log.info('Selected System and System Module', systemId, transactionalLevel);

    if (systemId !== null && systemId !== undefined && fromDate && toDate) {
      this.fetchSmsHistory(
        systemId,
        null,
        null,
        fromDate,
        null,
        null,
        null,
        null,
        toDate,
        transactionalLevel
      );
      this.fetchEmailHistory(
        systemId,
        null,
        null,
        null,
        null,
        fromDate,
        null,
        null,
        null,
        null,
        toDate,
        transactionalLevel
      );
    }
  }

  filterSmsHistory(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.smsHistoryTable.filterGlobal(filterValue, 'contains');
  }

  filterEmailHistory(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.emailHistoryTable.filterGlobal(filterValue, 'contains');
  }

  onSmsHistoryRowSelect(sms: SmsHistoryDto) {
    this.selectedSmsHistory = sms;
  }

  onEmailHistoryRowSelect(email: EmailHistoryDto) {
    this.selectedEmailHistory = email;
  }

  openSmsHistoryModal() {}

  editSmsHistory() {}

  deleteSmsHistory() {}
}
