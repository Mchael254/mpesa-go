import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Criteria} from "../../../shared/data/reports/criteria";
import {Logger} from "../../../shared/services";

const log = new Logger('CriteriaPillComponent')
@Component({
  selector: 'app-criteria-pill',
  templateUrl: './criteria-pill.component.html',
  styleUrls: ['./criteria-pill.component.css']
})
export class CriteriaPillComponent implements OnInit {

  @Input() public queryObject: Criteria;

  @Output() public deleteCriteriaDetails: EventEmitter<any> = new EventEmitter<any>();

  constructor() { }
  ngOnInit(): void {
  }

  selectCriteria(criteria: Criteria) {
    this.deleteCriteriaDetails.emit(criteria);
  }

}
