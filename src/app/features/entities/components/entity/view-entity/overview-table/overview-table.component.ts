import {Component, EventEmitter, Input, Output} from '@angular/core';
import {FormSubGroupsDto} from "../../../../../../shared/data/common/dynamic-screens-dto";

@Component({
  selector: 'app-overview-table',
  templateUrl: './overview-table.component.html',
  styleUrls: ['./overview-table.component.css']
})
export class OverviewTableComponent {

  @Input() subGroup: FormSubGroupsDto;
  @Input() table;
  @Input() language: string;

  @Output() rowClicked = new EventEmitter<any>();

  columnDialogVisible: boolean = false;

  onRowClick(row: any) {
    this.rowClicked.emit(row);
  }

}
