import { Component } from '@angular/core';
import { BreadCrumbItem } from 'src/app/shared/data/common/BreadCrumbItem';

@Component({
  selector: 'app-initiation',
  templateUrl: './initiation.component.html',
  styleUrls: ['./initiation.component.css']
})
export class InitiationComponent {
  breadCrumbItems: BreadCrumbItem[] = [
    { label: 'Home', url: '/home/dashboard' },
    { label: 'Reinsurance', url: '/home/lms/ind/reinsurance/initiation' },
    
  ];
}
