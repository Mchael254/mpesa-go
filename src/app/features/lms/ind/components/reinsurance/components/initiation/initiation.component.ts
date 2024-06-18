import { Component, OnDestroy, OnInit } from '@angular/core';
import {BreadCrumbItem} from "../../../../../../../shared/data/common/BreadCrumbItem";
import { ReinsuranceService } from 'src/app/features/lms/service/reinsurance/reinsurance.service';
import { Logger } from 'src/app/shared/services';


const log = new Logger('InitiationComponent')
@Component({
  selector: 'app-initiation',
  templateUrl: './initiation.component.html',
  styleUrls: ['./initiation.component.css']
})
export class InitiationComponent implements OnInit, OnDestroy {
  breadCrumbItems: BreadCrumbItem[] = [
    { label: 'Home', url: '/home/dashboard' },
    { label: 'Reinsurance', url: '/home/lms/ind/reinsurance/initiation' },

  ];
  endorsement_code: number = 202319
  
  constructor(private reinsuranceService:ReinsuranceService){}
  ngOnInit(): void {
    this.getTreatySelection();
  }

  ngOnDestroy(): void {
    
  }

  getTreatySelection(){
    this.reinsuranceService.getTreatySelection(this.endorsement_code).subscribe((res)=>{
      log.info("Treaty Types:", res);
    });
  }
}
