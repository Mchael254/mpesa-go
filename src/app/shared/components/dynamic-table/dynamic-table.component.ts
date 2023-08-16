import {Component, EventEmitter, Input, Output, ViewChild} from '@angular/core';
import {Table, TableLazyLoadEvent} from "primeng/table";
import {Router} from "@angular/router";
import {Logger, UtilService} from "../../services";
import {TableDetail} from "../../data/table-detail";
import {LazyLoadEvent} from "primeng/api";


const log = new Logger('DynamicTableComponent');

export interface DynamicTableModalData<T> {
  showModal: boolean,
  value: T
}

@Component({
  selector: 'app-dynamic-table',
  templateUrl: './dynamic-table.component.html',
  styleUrls: ['./dynamic-table.component.css']
})
export class DynamicTableComponent {

  constructor(
    private router: Router,
    private utilService: UtilService
    ) {
  }

  @ViewChild('dt1') dt1: Table | undefined;
  @Input() public tableDetails: TableDetail;
  @Output() onLazyLoad = new EventEmitter<LazyLoadEvent|TableLazyLoadEvent> ();
  @Output() showCustomModalEmitter: EventEmitter<DynamicTableModalData<any>> = new EventEmitter<DynamicTableModalData<any>>();

  clear(table: Table) {
    table.clear();
  }

  applyFilterGlobal($event, stringVal) {
    this.dt1.filterGlobal(($event.target as HTMLInputElement).value, stringVal);
  }


  viewDetails(row) {
    const urlPostfix = row[this.tableDetails.urlIdentifier];
    // this.router.navigate([`home/dashboard/${urlPostfix}`])
    log.info(row[this.tableDetails.urlIdentifier])
  }

  lazyLoad(event) {
    log.info('Lazy load event: ', JSON.stringify(event));
    this.onLazyLoad.emit(event);
  }

  isNumber(val): boolean {
    const dataValue = parseFloat(val);
    // log.info(`dataValue >>>`, dataValue, typeof dataValue);
    return !isNaN(dataValue);
  }

  showCustomModal(data: any) {
    this.showCustomModalEmitter.emit({showModal: true, value: data});
  }
}
