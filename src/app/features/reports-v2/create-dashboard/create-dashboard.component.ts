import {Component, OnInit} from '@angular/core';
import {GlobalMessagingService} from "../../../shared/services/messaging/global-messaging.service";
import {MenuItem} from "primeng/api";

@Component({
  selector: 'app-create-dashboard',
  templateUrl: './create-dashboard.component.html',
  styleUrls: ['./create-dashboard.component.css']
})
export class CreateDashboardComponent implements OnInit {

  public reports: any[];
  basicData: any;
  items: MenuItem[];

  constructor(
  private globalMessagingService: GlobalMessagingService
  ) {}


  ngOnInit(): void {
    this.reports = [
      {name: 'July reports'},
      {name: 'Finance'},
      {name: 'Health records'},
      {name: 'Report A'},
    ];

    this.basicData = {
      labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
      datasets: [
        {
          label: 'My First dataset',
          data: [65, 59, 80, 81, 56, 55, 40]
        },
        {
          label: 'My Second dataset',
          data: [28, 48, 40, 19, 86, 27, 90]
        }
      ]
    };

    this.items = [
      {
        items: [
          {
            label: 'Delete',
            command: () => {
              this.delete();
            }
          },
          {
            label: 'Add report',
            command: () => {
              this.addReport();
            }
          },
        ]
      },
    ];
  }

  onCreateDashboard() {
    this.globalMessagingService.displaySuccessMessage('Success', 'Successfully Created Dashboard');
  }

  addReport() {
    this.globalMessagingService.displaySuccessMessage('Success',  'Report Added' );
  }

  delete() {
    this.globalMessagingService.displaySuccessMessage('Success', 'Report Deleted' );
  }
}
