import {Component, EventEmitter, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-campaign-analytics',
  templateUrl: './campaign-analytics.component.html',
  styleUrls: ['./campaign-analytics.component.css']
})
export class CampaignAnalyticsComponent implements OnInit{
  pageSize: 5;
  campaignTargetData: any[];
  basicData: any;

  @Output() onClickBack: EventEmitter<any> = new EventEmitter<any>();

  constructor() {
  }

  ngOnInit(): void {
    this.basicData = {
      labels: ['Jun 12', 'Jun 13', 'Jun 14', 'Jun 15', 'Jun 16', 'Jun 17', 'Jun 18', 'Jun 19', 'Jun 20'],
      datasets: [
        {
          label: 'Engagements',
          data: [550, 570, 600, 760, 800, 255, 250, 990, 50]
        },
        {
          label: 'My Second dataset',
          data: [450, 370, 200, 560, 500, 855, 750, 690, 100,]
        }
      ]
    };
  }

  goToCampaigns() {
    this.onClickBack.emit();
  }
}
