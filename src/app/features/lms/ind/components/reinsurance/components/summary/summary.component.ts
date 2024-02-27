import { Component } from '@angular/core';
import { BreadCrumbItem } from 'src/app/shared/data/common/BreadCrumbItem';

@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.css']
})
export class SummaryComponent {
  breadCrumbItems: BreadCrumbItem[] = [
    { label: 'Home', url: '/home/dashboard' },
    { label: 'Reinsurance', url: '/home/lms/ind/reinsurance/initiation' },
    {
      label: 'Summary',
      url: '/home/lms/ind/reinsurance/summary',
    },
  ];

}
