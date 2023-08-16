import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-risk-details',
  templateUrl: './risk-details.component.html',
  styleUrls: ['./risk-details.component.css']
})
export class RiskDetailsComponent {
  @Input() risk;
}
