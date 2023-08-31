import { Component } from '@angular/core';
import {BreadCrumbItem} from "../../../../../../../shared/data/common/BreadCrumbItem";

@Component({
  selector: 'app-liability',
  templateUrl: './liability.component.html',
  styleUrls: ['./liability.component.css']
})
export class LiabilityComponent {

  public liabilities = ['private motors', 'private motors', 'private motors', 'private motors', 'private motors']
  public breadCrumbItems: BreadCrumbItem[] = [
    {
      label: 'Home',
      url: '/home/dashboard'
    },
    {
      label: 'GIS Setups',
      url: '/home/gis/setup/schedule/liability',
    },
    {
      label: 'Liability',
      url: '/home/gis/setup/schedule/liability'
    }
  ];

  filterLiabilities($event: KeyboardEvent) {

  }
}
