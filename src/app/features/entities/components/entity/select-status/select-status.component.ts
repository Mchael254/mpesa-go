import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AccountStatus } from '../../../data/AccountStatus';

@Component({
  selector: 'app-select-status',
  templateUrl: './select-status.component.html',
  styleUrls: ['./select-status.component.css']
})
export class SelectStatusComponent implements OnInit {

  @Input() id: any;
  @Input() currentValue: string;
  @Input() statusList: AccountStatus[] = [];
  @Output() output: EventEmitter<any> = new EventEmitter<any>();
  selectedStatus: any;


  constructor() { }
  
  ngOnInit() {
  }

  onChange(statusValue: string) {
    let o: any = { id: this.id, selectedStatus: statusValue };
    this.output.emit(o);
  }

}
