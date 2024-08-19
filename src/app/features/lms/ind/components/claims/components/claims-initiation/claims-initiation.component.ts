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
import {filter, Observable, of, Subscription} from "rxjs";
import {catchError, debounceTime, distinctUntilChanged, map, switchMap, take, tap} from "rxjs/operators";
import {AuthService} from "../../../../../../../shared/services/auth.service";

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
  filteredPolicy: string;
  selectedPolicy: PoliciesClaimModuleDTO;
  private subscriptions: Subscription = new Subscription();

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
    private authService: AuthService,
    private cdr: ChangeDetectorRef,
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.createForm();
    this.getClaimModules();
    // this.getClaimClients();
    this.getCausationTypes();
    this.claimType = this.activatedRoute.snapshot.queryParamMap.get('claimType');

    this.claimInitForm.get('claimType').valueChanges.subscribe(claimType => {
      this.navigateToClaimsIntiation(claimType);
      this.cdr.detectChanges();
    });
    this.navigateToClaimsIntiation(this.claimType);
    this.patchFormWithQueryParam();

  }

  createForm() {
    this.claimInitForm = this.fb.group({
      claimType: [''],
      policySelection: [''],
      policyMember: [''],
      claimReason: [''],
      surrenderDate: [''],
      surrenderType: [''],
      requestDate: [''],
      offsetPremium: ['']

    });

    const policySelectionSubscription = this.claimInitForm.get('policySelection')
      .valueChanges.subscribe(value => {
      this.selectedPolicy = value;
      console.log('Selected Policy in Parent:', value);
    });
    this.subscriptions.add(policySelectionSubscription);
  }

  submitClaimInitFormData() {
    // Handle form submission logic here
  }

  getClaimModules() {
    this.policy$ = this.claimsService.getClaimModules().pipe(
      catchError(error => {
        console.error('Error fetching claim modules', error);
        return of([]); // Return an empty array to keep the app running
      })
    );
  }

  getClaimClients() {
    this.claimClients$ = this.claimsService.getClaimClients().pipe(
      catchError(_ => {
        return of([]); // Return an empty array as a fallback
      })
    )
  }

  getCausationTypes() {
    this.causationTypes$ = this.claimsService.getCausationTypes().pipe(
      catchError(_ => {
        return of([]); // Return an empty array as a fallback
      })
    );
  }

  getCausationCauses(causationType: string): void {
    this.causationCauses$ = this.claimsService.getCausationCauses(causationType).pipe(
      catchError(_ => {
        return of([]); // Return an empty array as a fallback
      })
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

// use to handle policy search filtered value from claims option coponent event
  handlePolicyFiltered(policy: string) {
    this.filteredPolicy = policy
  }
  // use to handle client search filtered value
  handleClientFiltered(client: string) {
  }


  private patchFormWithQueryParam(): void {
    const queryParamsSubscription = this.route.queryParams
      .pipe(
        filter(params => !!params['claimType']),
        take(1) // Ensures this only runs once
      )
      .subscribe(params => {
        const claimType = params['claimType'];
        this.claimInitForm.patchValue({
          claimType: claimType
        });
      });
    this.subscriptions.add(queryParamsSubscription);
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe(); // Ensures all subscriptions are cleaned up
  }
}
