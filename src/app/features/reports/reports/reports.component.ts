import { Component } from '@angular/core';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css']
})
export class ReportsComponent {

  basicData = {
    labels: ['', '', '', '', '', '', ''],
    datasets: [
      {
        label: 'Series 1',
        data: [65, 59, 80, 81, 56, 55, 40]
      },
      {
        label: 'Series 2',
        data: [28, 48, 40, 19, 86, 27, 90]
      }
    ]
  };

}
