import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Criteria} from "../../../shared/data/reports/criteria";

@Component({
  selector: 'app-criteria-pill',
  templateUrl: './criteria-pill.component.html',
  styleUrls: ['./criteria-pill.component.css']
})
export class CriteriaPillComponent {

  @Input() public queryObject: Criteria;

  @Output() public deleteCriteriaDetails: EventEmitter<any> = new EventEmitter<any>();

  constructor() { }
  ngOnInit(): void {
  }

  selectCriteria(criteria: Criteria) {
    this.deleteCriteriaDetails.emit(criteria);
  }
}
