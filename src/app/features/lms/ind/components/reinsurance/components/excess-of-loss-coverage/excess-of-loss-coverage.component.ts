import { Component, OnDestroy, OnInit } from '@angular/core';
import {BreadCrumbItem} from "../../../../../../../shared/data/common/BreadCrumbItem";
import { ReinsuranceService } from 'src/app/features/lms/service/reinsurance/reinsurance.service';
import { ReinsuranceCompaniesDTO } from '../../models/reinsurance-companies';
import { Logger } from 'src/app/shared/services';

const log = new Logger('ExcessOfLossCoverageComponent')

@Component({
  selector: 'app-excess-of-loss-coverage',
  templateUrl: './excess-of-loss-coverage.component.html',
  styleUrls: ['./excess-of-loss-coverage.component.css']
})
export class ExcessOfLossCoverageComponent implements OnInit, OnDestroy{

  breadCrumbItems: BreadCrumbItem[] = [
    { label: 'Home', url: '/home/dashboard' },
    { label: 'Reinsurance', url: '/home/lms/ind/reinsurance/initiation' },
    {
      label: 'Excess of Coverage',
      url: '/home/lms/ind/reinsurance/excess-of-loss-coverage',
    },
  ];

  pcvt_code: number = 2024746618  
  reinsuranceCompanies: ReinsuranceCompaniesDTO[] = [];
  constructor(private reinsurance_service:ReinsuranceService){}

  ngOnInit(): void {
    this.getTreatyTypes();
    this.getReinsuranceCompanies();
  }

  ngOnDestroy(): void {
    
  }

  getTreatyTypes(){
    this.reinsurance_service.getSetupTreatyTypes().subscribe((res)=>{
      log.info("Treaty Types:", res);
    })
  }

  getReinsuranceCompanies(){
    this.reinsurance_service.getReinsuranceCompanies(this.pcvt_code).subscribe((reinsuranceCompanies: ReinsuranceCompaniesDTO[])=>{
      // log.info("Reinsurance Companies:", res);
      this.reinsuranceCompanies = reinsuranceCompanies;
      log.info("Reinsurance Companies:", this.reinsuranceCompanies);
    })
  }
}
