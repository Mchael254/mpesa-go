import { Component, OnDestroy, OnInit } from '@angular/core';
import {BreadCrumbItem} from "../../../../../../../shared/data/common/BreadCrumbItem";
import { Logger } from 'src/app/shared/services';
import { ReinsuranceService } from 'src/app/features/lms/service/reinsurance/reinsurance.service';

const log = new Logger ('SummaryComponent')
@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.css']
})
export class SummaryComponent implements OnInit, OnDestroy {
  breadCrumbItems: BreadCrumbItem[] = [
    { label: 'Home', url: '/home/dashboard' },
    { label: 'Reinsurance', url: '/home/lms/ind/reinsurance/initiation' },
    {
      label: 'Summary',
      url: '/home/lms/ind/reinsurance/summary',
    },
  ];

  endorsement_code: number = 20231684111
  constructor (private reinsuranceService: ReinsuranceService) {}
  ngOnInit(): void {
      this.getTreatyTypes();
  }

  ngOnDestroy(): void {
      
  }

  getTreatyTypes () {
    this.reinsuranceService.getTreatyTypes(this.endorsement_code).subscribe((res) => {
      log.info ('TreatyTypes', res);
    });
  }

}
