import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { Table, TableLazyLoadEvent } from 'primeng/table';
import { LazyLoadEvent } from 'primeng/api';
import { Observable, tap } from 'rxjs';

import { BreadCrumbItem } from '../../../../../shared/data/common/BreadCrumbItem';
import { ProspectService } from '../../../../../features/entities/services/prospect/prospect.service';
import { untilDestroyed } from '../../../../../shared/services/until-destroyed';
import { Pagination } from '../../../../../shared/data/common/pagination';
import { ProspectDto } from '../../../../../features/entities/data/prospectDto';
import { Logger } from '../../../../../shared/services/logger/logger.service';
import { ReusableInputComponent } from '../../../../../shared/components/reusable-input/reusable-input.component';
import { GlobalMessagingService } from '../../../../../shared/services/messaging/global-messaging.service';

const log = new Logger('ProspectsComponent');

@Component({
  selector: 'app-prospects',
  templateUrl: './prospects.component.html',
  styleUrls: ['./prospects.component.css'],
})
export class ProspectsComponent implements OnInit {
  @ViewChild('prospectTable') prospectTable: Table;
  @ViewChild('prospectConfirmationModal')
  prospectConfirmationModal!: ReusableInputComponent;

  public prospectsData: Pagination<ProspectDto> = <Pagination<ProspectDto>>{};
  public selectedProspect: ProspectDto;
  public pageSize: 10;
  prospectsBreadCrumbItems: BreadCrumbItem[] = [
    {
      label: 'Administration',
      url: '/home/dashboard',
    },
    {
      label: 'CRM Setups',
      url: '/home/dashboard',
    },
    {
      label: 'Activity Management',
      url: 'home/crm/activities',
    },

    {
      label: 'Prospects',
      url: 'home/crm/prospects',
    },
  ];

  public errorOccurred = false;
  public errorMessage: string = '';

  constructor(
    private prospectService: ProspectService,
    private globalMessagingService: GlobalMessagingService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {}

  ngOnDestroy(): void {}

  lazyLoadProspects(event: LazyLoadEvent | TableLazyLoadEvent) {
    const pageIndex = event.first / event.rows;
    const sortField = event.sortField;
    const sortOrder = event?.sortOrder == 1 ? 'desc' : 'asc';
    const pageSize = event.rows;

    this.getPropspects(pageIndex, pageSize, sortField, sortOrder)
      .pipe(
        untilDestroyed(this),
        tap((data) => log.info(`Fetching Prospects>>>`, data))
      )
      .subscribe(
        (data: Pagination<ProspectDto>) => {
          this.prospectsData = data;
          this.cdr.detectChanges();
        },
        (error) => {}
      );
  }

  getPropspects(
    pageIndex: number,
    pageSize: number,
    sortField: any = 'type',
    sortOrder: string = 'desc'
  ): Observable<Pagination<ProspectDto>> {
    return this.prospectService
      .getAllProspects(pageIndex, pageSize, sortField, sortOrder)
      .pipe(untilDestroyed(this));
  }

  filterProspects(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.prospectTable.filterGlobal(filterValue, 'contains');
  }

  onProspectRowSelect(prospect: ProspectDto) {
    this.selectedProspect = prospect;
  }

  createProspect() {}

  editProspect() {}

  deleteProspect() {
    this.prospectConfirmationModal.show();
  }

  confirmProspectDelete() {
    if (this.selectedProspect) {
      const prospectId = this.selectedProspect.id;
      this.prospectService.deleteProspect(prospectId).subscribe({
        next: (data) => {
          if (data) {
            this.globalMessagingService.displaySuccessMessage(
              'success',
              'Successfully deleted a prospect'
            );
            this.selectedProspect = null;
            // Refresh the data using lazy loading
            this.lazyLoadProspects({
              first: this.prospectTable.first,
              rows: this.pageSize,
              sortField: this.prospectTable.sortField,
              sortOrder: this.prospectTable.sortOrder,
            } as TableLazyLoadEvent);
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
          this.globalMessagingService.displayErrorMessage(
            'Error',
            err?.error?.errors[0]
          );
          log.info(`error >>>`, err);
        },
      });
    } else {
      this.globalMessagingService.displayErrorMessage(
        'Error',
        'No Prospect is selected!.'
      );
    }
  }
}
