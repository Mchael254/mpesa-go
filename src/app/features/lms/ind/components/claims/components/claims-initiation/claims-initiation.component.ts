import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import stepData from '../../data/steps.json';
import { ClaimsService } from 'src/app/features/lms/service/claims/claims.service';
import { Logger } from 'src/app/shared/services';
import { BreadCrumbItem } from 'src/app/shared/data/common/BreadCrumbItem';
import { CausationTypesDTO } from '../../models/causation-types';
import { PoliciesClaimModuleDTO } from '../../models/claim-inititation';
import { untilDestroyed } from 'src/app/shared/shared.module';
import { CausationCausesDTO } from '../../models/causation-causes';
import { ClaimClientsDTO } from '../../models/claim-clients';
import { FormGroup } from '@angular/forms';
import { Table } from 'primeng/table';
import { PolicyClaimsDTO } from 'src/app/features/lms/grp/components/policy/models/policy-summary';

const log = new Logger ('ClaimsInitiationComponent');

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
  claimInitForm: FormGroup;

  policy: PoliciesClaimModuleDTO[] = [];
  claimClients: ClaimClientsDTO [] = [];
  causationTypes: CausationTypesDTO[] = [];
  causationCauses: CausationCausesDTO [] = [];

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
    this.getClaimModules();
    this.getClaimClients();
    this.getCausationTypes();
    this.getCausationCauses();
  }

  ngOnDestroy(): void {

  }

  submitClaimInitFormData () {
    
  }

  getClaimModules () {
    this.claims_service.getClaimModules().subscribe(data=>{
      this.policy = data
    })
  }

  getClaimClients () {
    this.claims_service.getClaimClients().subscribe(data=>{
      this.claimClients = data
    })
  }

  getCausationTypes () {
    this.claims_service.getCausationTypes().subscribe(data=>{
      this.causationTypes = data
    })
  }

  getCausationCauses() {
    this.claims_service.getCausationCauses().subscribe(data=>{
      this.causationCauses = data
    })
  }

  }