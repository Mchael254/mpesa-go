import {Component, EventEmitter, Input, Output, ViewChild} from '@angular/core';
import {Table, TableLazyLoadEvent} from "primeng/table";
import {Router} from "@angular/router";
import {Logger} from "../../services";
import {TableDetail} from "../../data/table-detail";
import {LazyLoadEvent} from "primeng/api";


const log = new Logger('DynamicTableComponent');

@Component({
  selector: 'app-dynamic-table',
  templateUrl: './dynamic-table.component.html',
  styleUrls: ['./dynamic-table.component.css']
})
export class DynamicTableComponent {

  constructor(private router: Router) {
  }

  @ViewChild('dt1') dt1: Table | undefined;
  @Input() public tableDetails: TableDetail;
  @Output() onLazyLoad = new EventEmitter<LazyLoadEvent|TableLazyLoadEvent> ();

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
    console.log('Lazy load event: ', JSON.stringify(event));
    this.onLazyLoad.emit(event);
  }
}
