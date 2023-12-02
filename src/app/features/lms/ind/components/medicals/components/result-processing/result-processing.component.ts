import { Component } from '@angular/core';
import { BreadCrumbItem } from 'src/app/shared/data/common/BreadCrumbItem';
import stepData from '../../data/steps.json';

@Component({
  selector: 'app-result-processing',
  templateUrl: './result-processing.component.html',
  styleUrls: ['./result-processing.component.css'],
})
export class ResultProcessingComponent {
  steps = stepData;
  breadCrumbItems: BreadCrumbItem[] = [
    {
      label: 'Home',
      url: '/home/dashboard',
    },
    {
      label: 'Quotation',
      url: '/home/lms/quotation/list',
    },
    {
      label: 'Medical Tests',
      url: '/home/lms/ind/quotation/lifestyle-details',
    },
  ];
  dynamicAccordionId: any;
  diseases: any[] = [
    { name: 'Fever' },
    { name: 'Typhoid' },
    { name: 'Malaria' },
  ];

  nextPage(){
    
  }
}
