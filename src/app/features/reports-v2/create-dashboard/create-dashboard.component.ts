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


  /**
   * The `ngOnInit` function initializes data and adds event listeners to clickable icons.
   */
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

    const clickableIcons = document.querySelectorAll('.clickable');

    // Add click event listener to the document
    document.addEventListener('click', (event) => {
      const clickedElement = event.target as HTMLElement;

      // Check if the clicked element is not within a clickable icon or its container
      if (
        clickedElement &&
        !clickedElement.classList.contains('clickable') &&
        !clickedElement.closest('.icon-container')
      ) {
        // Remove the "active" class from all clickable icons
        clickableIcons.forEach(icon => {
          icon.closest('.icon-container')?.classList.remove('active');
        });
      }
    });

    clickableIcons.forEach(icon => {
      icon.addEventListener('click', () => {
        icon.closest('.icon-container').classList.toggle('active');
      });
    });
  }

  /**
   * The function onCreateDashboard displays a success message when a dashboard is successfully created.
   */
  onCreateDashboard() {
    this.globalMessagingService.displaySuccessMessage('Success', 'Successfully Created Dashboard');
  }

  /**
   * The addReport function displays a success message indicating that a report has been added.
   */
  addReport() {
    this.globalMessagingService.displaySuccessMessage('Success',  'Report Added' );
  }

  /**
   * The delete function displays a success message indicating that a report has been deleted.
   */
  delete() {
    this.globalMessagingService.displaySuccessMessage('Success', 'Report Deleted' );
  }
}
