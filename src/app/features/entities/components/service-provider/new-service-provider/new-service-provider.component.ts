import { Component } from '@angular/core';
import { BreadCrumbItem } from 'src/app/shared/data/common/BreadCrumbItem';

@Component({
  selector: 'app-new-service-provider',
  templateUrl: './new-service-provider.component.html',
  styleUrls: ['./new-service-provider.component.css']
})
export class NewServiceProviderComponent {
  serviceProviderBreadCrumbItems: BreadCrumbItem[] = [
    {
      label: 'Home',
      url: '/home/dashboard'
    },
    {
      label: 'CRM',
      url: '/home/dashboard',
    },
    {
      label: 'New Service Provider',
      url: '/home/entity/service-provider/new'
    }
  ];
}
