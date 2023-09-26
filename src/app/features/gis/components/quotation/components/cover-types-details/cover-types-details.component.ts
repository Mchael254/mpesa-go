import { Component } from '@angular/core';
import stepData from '../../data/steps.json'

@Component({
  selector: 'app-cover-types-details',
  templateUrl: './cover-types-details.component.html',
  styleUrls: ['./cover-types-details.component.css']
})
export class CoverTypesDetailsComponent {
  isCollapsibleOpen = false;
  isModalOpen = false;
  selectedOption: string = 'email';
  clientName: string = '';
  contactValue: string = '';
  steps = stepData;

  coverTypes:any[];

  toggleCollapsible() {
    this.isCollapsibleOpen = !this.isCollapsibleOpen;
  }
  openModal() {
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }
  // compute() {
  //   // Make an API request to fetch cover types for the selected product
  //   this.myService.get('your-api-endpoint').subscribe((data: any[]) => {
  //     this.coverTypes = data; // Update the component's data
  //   });
  // }
}
