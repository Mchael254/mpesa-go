import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Logger} from "../../../shared/services";
import {Criteria} from "../../../shared/data/reports/criteria";

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

  /**
   * Emits the selected criteria to the parent component
   * @returns void
   */
  selectCriteria(criteria: Criteria) {
    this.deleteCriteriaDetails.emit(criteria);
  }

}
