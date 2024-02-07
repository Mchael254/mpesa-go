import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-risk-details',
  templateUrl: './risk-details.component.html',
  styleUrls: ['./risk-details.component.css']
})
export class RiskDetailsComponent {
  @Input() risk:any[] = [];

  public pageSize: 5;
  @Input() sectionDetails: any[] = [];
  public shouldShowViewMoreDialog: boolean = false;

  showViewMoreDialog(risk:any) {
    this.sectionDetails = risk?.sectionsDetails;
    this.shouldShowViewMoreDialog = true;
  }
}
