import { Component } from '@angular/core';
import {BreadCrumbItem} from "../../../../../../../shared/data/common/BreadCrumbItem";

@Component({
  selector: 'app-excess-of-loss-coverage',
  templateUrl: './excess-of-loss-coverage.component.html',
  styleUrls: ['./excess-of-loss-coverage.component.css']
})
export class ExcessOfLossCoverageComponent {

  breadCrumbItems: BreadCrumbItem[] = [
    { label: 'Home', url: '/home/dashboard' },
    { label: 'Reinsurance', url: '/home/lms/ind/reinsurance/initiation' },
    {
      label: 'Excess of Coverage',
      url: '/home/lms/ind/reinsurance/excess-of-loss-coverage',
    },
  ];

}
