import {ChangeDetectorRef, Component, EventEmitter, Input, Output} from '@angular/core';
import {FormSubGroupsDto} from "../../../../../../shared/data/common/dynamic-screens-dto";
import {Logger} from "../../../../../../shared/services";

const log = new Logger('OverViewTableComponent');

@Component({
  selector: 'app-overview-table',
  templateUrl: './overview-table.component.html',
  styleUrls: ['./overview-table.component.css']
})
export class OverviewTableComponent {

  @Input() subGroup: FormSubGroupsDto;
  @Input() table;
  @Input() language: string;
  @Input() category: string
  @Output() rowClicked = new EventEmitter<any>();
  @Output() deleteBtnClicked = new EventEmitter<any>();
  @Output() editBtnClicked = new EventEmitter<any>();

  columnDialogVisible: boolean = false;
  selectedRow: any;

  visible: boolean = false;
  shouldShowTableLabel: boolean = true;

  constructor(
    private cdr: ChangeDetectorRef,
  ) {
    setTimeout(() => {
      if (this.category?.toLowerCase() === 'individual') this.shouldShowTableLabel = false
    }, 1000)
  }

  onRowClick(row: any) {
    this.rowClicked.emit(row);
  }

  onDeleteButtonClick() {
    this.deleteBtnClicked.emit(this.selectedRow);
    this.visible = false;
    this.cdr.detectChanges();
  }

  onEditButtonClick(row) {
    this.editBtnClicked.emit({row, subGroup: this.subGroup});
  }

  triggerDeleteConfirmation(rowData: any) {
    this.visible = true;
    this.selectedRow = rowData;
  }

  onDialogHide(): void {
    document.body.style.overflowY = 'auto';
  }

}
