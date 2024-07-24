import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import stepData from '../../data/steps.json';
import { ClaimsService } from 'src/app/features/lms/service/claims/claims.service';
import { Logger } from 'src/app/shared/services';
import { BreadCrumbItem } from 'src/app/shared/data/common/BreadCrumbItem';
import { CausationTypesDTO } from '../../models/causation-types';
import { PoliciesClaimModuleDTO } from '../../models/claim-inititation';
import { CausationCausesDTO } from '../../models/causation-causes';
import { ClaimClientsDTO } from '../../models/claim-clients';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from "@angular/router";
import {Observable, of} from "rxjs";
import {catchError, tap} from "rxjs/operators";

const log = new Logger('ClaimsInitiationComponent');

@Component({
  selector: 'app-claims-initiation',
  templateUrl: './claims-initiation.component.html',
  styleUrls: ['./claims-initiation.component.css']
})
export class ClaimsInitiationComponent implements OnInit, OnDestroy {
  breadCrumbs: BreadCrumbItem[] = [
    { label: 'Home', url: '/home/dashboard' },
    { label: 'Claims', url: '/home/lms/ind/claims/claims-initiation' },
  ];
  claimInitForm: FormGroup;
  claimType: string;
  steps = stepData;

  policy$: Observable<PoliciesClaimModuleDTO[]>;
  claimClients$: Observable<ClaimClientsDTO[]>;
  causationTypes$: Observable<CausationTypesDTO[]>;
  causationCauses$: Observable<CausationCausesDTO[]>;

  claim_types = [
    { name: "Normal", value: "NORMAL" },
    { name: "Surrender", value: "SURRENDER" },
    { name: "Maturities", value: "MATURITIES" }
  ];

  claimsType = {
    MATURITIES: 'maturities',
    SURRENDER: 'surrender',
    NORMAL: 'normal'
  };

  constructor(
    private fb: FormBuilder,
    private claimsService: ClaimsService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.claimsService.getClaimModules().subscribe(data => console.log('getClaimModules', data))
    this.createForm();
    this.getClaimModules();
    this.getClaimClients();
    this.getCausationTypes();
    this.getCausationCauses();
    this.claimType = this.activatedRoute.snapshot.queryParamMap.get('claimType');

    this.claimInitForm.get('claimType').valueChanges.subscribe(claimType => {
      this.navigateToClaimsIntiation(claimType);
      this.cdr.detectChanges();
    });
    this.navigateToClaimsIntiation(this.claimType);

  }

  createForm() {
    this.claimInitForm = this.fb.group({
      claimType: [''],
      policySelection: [''],
      policyMember: [''],
      claimClients: [''],
      causationType: [''],
      causationCause: [''],
      dateReported: [''],
      incubationPeriod: [''],
      incidentLocation: [''],
      incidentDate: [''],
      claimReason: [''],
      surrenderDate: [''],
      surrenderType: [''],
      requestDate: [''],
      offsetPremium: ['']

    });
  }

  submitClaimInitFormData() {
    // Handle form submission logic here
  }

  getClaimModules() {
    this.claimsService.getClaimModules().subscribe(data => console.log('getClaimModules', data))
    this.policy$ = this.claimsService.getClaimModules().pipe(
      tap(data => log.info('PoliciesClaimModuleDTO>>>>', data)),
      catchError(error => {
        console.error('Error fetching claim modules', error);
        return of([]); // Return an empty array to keep the app running
      })
    );
  }

  getClaimClients() {
    this.claimClients$ = this.claimsService.getClaimClients().pipe(
      tap(data => log.info('ClaimClientsDTO>>>>', data))
    );
  }

  getCausationTypes() {
    this.causationTypes$ = this.claimsService.getCausationTypes().pipe(
      tap(data => log.info('CausationTypesDTO>>>>', data))
    );
  }

  getCausationCauses() {
    this.causationCauses$ = this.claimsService.getCausationCauses().pipe(
      tap(data => log.info('CausationCausesDTO>>>>', data))
    );
  }

  navigateToClaimsIntiation(claimType: string) {
    if(claimType) {
      this.router.navigate(['/home/lms/ind/claims'], {
        queryParams: { claimType: claimType?.toLowerCase() }
      }).then(() => {
        this.claimType = claimType?.toLowerCase();
      });
    }

  }

  ngOnDestroy(): void {
    // Clean up any subscriptions or resources here
  }
}
