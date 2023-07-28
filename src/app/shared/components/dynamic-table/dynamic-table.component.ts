import {Component, Input, ViewChild} from '@angular/core';
import {Table} from "primeng/table";
import {TableDetail} from "../../../features/base/components/dashboard/dashboard.component";
import {Router} from "@angular/router";

@Component({
  selector: 'app-dynamic-table',
  templateUrl: './dynamic-table.component.html',
  styleUrls: ['./dynamic-table.component.css']
})
export class DynamicTableComponent {

  constructor(private router: Router) {
  }

  @ViewChild('dt1') dt1: Table | undefined;
  @Input() tableDetails: TableDetail;

  clear(table: Table) {
    table.clear();
  }

  applyFilterGlobal($event, stringVal) {
    this.dt1.filterGlobal(($event.target as HTMLInputElement).value, stringVal);
  }


  viewDetails(row) {
    const urlPostfix = row[this.tableDetails.urlIdentifier];
    // this.router.navigate([`home/dashboard/${urlPostfix}`])
    console.log(row[this.tableDetails.urlIdentifier])
  }
}
