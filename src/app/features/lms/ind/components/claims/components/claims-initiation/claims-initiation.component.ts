import { Component, OnDestroy, OnInit } from '@angular/core';
import stepData from '../../data/steps.json';
import { ClaimsService } from 'src/app/features/lms/service/claims/claims.service';
import { Logger } from 'src/app/shared/services';
import { BreadCrumbItem } from 'src/app/shared/data/common/BreadCrumbItem';
import { CausationTypesDTO } from '../../models/causation-types';
import { PoliciesClaimModuleDTO } from '../../models/claim-inititation';
import { Subject, takeUntil } from 'rxjs';

const log = new Logger ('ClaimsInitiationComponent');

@Component({
  selector: 'app-claims-initiation',
  templateUrl: './claims-initiation.component.html',
  styleUrls: ['./claims-initiation.component.css']
})

export class ClaimsInitiationComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  breadCrumbs: BreadCrumbItem [] = [
    { label: 'Home', url: '/home/dashboard' },
    { label: 'Claims', url: '/home/lms/ind/claims/claims-initiation',},
  ];

  steps = stepData;
  causationTypes: CausationTypesDTO[] = [];
  policy: PoliciesClaimModuleDTO[] = [];

  claim_types = [
    {
      "name": "Normal",
      "value": "NORMAL"
    },
    {
      "name": "Surrender",
      "value": "SURRENDER"
    },
    {
      "name": "Maturities",
      "value": "MATURITIES"
    }
  ];

  constructor(private claims_service:ClaimsService){}

  ngOnInit(): void {
    this.getCausationTypes();
    this.getClaimModules();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  getCausationTypes () {
    this.claims_service.getCausationTypes().pipe(takeUntil(this.destroy$)).subscribe({
      next: (causationTypes: CausationTypesDTO []) => {
      this.causationTypes = causationTypes;
      log.info("Causation Types:", this.causationTypes);
    },
    error: (error) => {
      log.error("Error Fetching Causation Types:", error);
    }
  });
  }
  
    getClaimModules(){
      this.claims_service.getClaimModules().subscribe((policy: PoliciesClaimModuleDTO[])=>{
        this.policy = policy
        log.info("Claim Modules:", this.policy)
      });
    }
 
}
