import { Component, OnDestroy, OnInit } from '@angular/core';
import stepData from '../../data/steps.json';
import { ClaimsService } from 'src/app/features/lms/service/claims/claims.service';
import { Logger } from 'src/app/shared/services';
import { BreadCrumbItem } from 'src/app/shared/data/common/BreadCrumbItem';
import { CausationTypesDTO } from '../../models/causation-types';

const log = new Logger ('ClaimsInitiationComponent')

@Component({
  selector: 'app-claims-initiation',
  templateUrl: './claims-initiation.component.html',
  styleUrls: ['./claims-initiation.component.css']
})

export class ClaimsInitiationComponent implements OnInit, OnDestroy {
  breadCrumbs: BreadCrumbItem [] = [
    { label: 'Home', url: '/home/dashboard' },
    { label: 'Claims', url: '/home/lms/ind/claims/claims-initiation',},
  ];

  steps = stepData;
  causationTypes: CausationTypesDTO[] = [];

  constructor( private claims_service:ClaimsService){}

  ngOnInit(): void {
    this.getCausationTypes();
  }

  ngOnDestroy(): void {

  }

  getCausationTypes () {
    this.claims_service.getCausationTypes().subscribe((causationTypes: CausationTypesDTO []) => {
      this.causationTypes = causationTypes;
      log.info("Causation Types:", this.causationTypes);
    })
  }
}
