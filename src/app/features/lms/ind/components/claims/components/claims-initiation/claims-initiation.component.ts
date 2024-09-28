import {ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
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
import {untilDestroyed} from "../../../../../../../shared/shared.module";
import {ClaimDTO} from "../../models/claims";
import {SessionStorageService} from "../../../../../../../shared/services/session-storage/session-storage.service";
import {SESSION_KEY} from "../../../../../util/session_storage_enum";
import {StringManipulation} from "../../../../../util/string_manipulation";

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
  claimDetails$: Observable<ClaimDTO>;
  claimNo: string;
  @Input() eachStep: number
  @Output() valueChanged: EventEmitter<number> = new EventEmitter<number>();

  policy$: Observable<PoliciesClaimModuleDTO[]>;
  claimClients$: Observable<ClaimClientsDTO[]>;
  causationTypes$: Observable<CausationTypesDTO[]>;
  causationCauses$: Observable<CausationCausesDTO[]>;
  filteredPolicy: Observable<PoliciesClaimModuleDTO[]>;
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
    private session_storage: SessionStorageService
  ) { }

  ngOnInit(): void {
    this.createForm();
    this.claimType = this.activatedRoute.snapshot.queryParamMap.get('claimType');
    this.claimNo = this.activatedRoute.snapshot.queryParamMap.get('claimNo') ||
      StringManipulation.returnNullIfEmpty( this.session_storage.get(SESSION_KEY.CLAIM_NO) );

    // this.getClaimModules();
    this.getCausationTypes();

    this.claimInitForm.get('claimType').valueChanges
      .pipe(
        untilDestroyed(this)
      ).subscribe(claimType => {
      this.navigateToClaimsIntiation(claimType);
      this.cdr.detectChanges();
    });
    this.navigateToClaimsIntiation(this.claimType);
    if(this.claimNo) {
      this.getClaimDetails(this.claimNo)
    }
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
      .valueChanges
      .pipe(
        // Assuming `this.policy$` is an Observable of PoliciesClaimModuleDTO[]
        switchMap((selPolicy: PoliciesClaimModuleDTO) => {
          if(this.filteredPolicy) {
            return this.filteredPolicy.pipe(
              map((policies: PoliciesClaimModuleDTO[]) => {
                  console.log('polCode???>>', selPolicy)
                  return policies.find(policy => policy?.pol_code === Number(selPolicy?.pol_code))
                }
              )
            )
          }
        }


        )
      )
      .subscribe((selectedPolicy: PoliciesClaimModuleDTO) => {
        this.selectedPolicy = selectedPolicy;

      });

    this.subscriptions.add(policySelectionSubscription);
  }
  submitClaimInitFormData() {
    // Handle form submission logic here
  }

  getClaimModules() {
    this.policy$ = this.claimsService.getClaimModules().pipe(
      catchError(error => {
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
    const queryParams: any = {};

    // Add claimType to queryParams if it exists
    if (claimType) {
      queryParams.claimType = claimType.toLowerCase();
    }

    // Add claimNo to queryParams if it has a value
    // if (claimNo) {
    //   queryParams.claimNo = claimNo;
    // }

    // Navigate to the desired route with the constructed queryParams
    this.router.navigate(['/home/lms/ind/claims'], { queryParams }).then(() => {
      this.claimType = claimType?.toLowerCase();
    });
}

// use to handle policy search filtered value from claims option coponent event
  handlePolicyFiltered(policy: Observable<PoliciesClaimModuleDTO[]>) {
    this.filteredPolicy = policy
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

  onStepChange(newValue: number): void {
    this.eachStep = newValue;
    this.valueChanged.emit(newValue)
  }

  getClaimDetails(claimNo: string) {
    this.claimDetails$ = this.claimsService.fetchClaimDetails(claimNo)
      .pipe(
        untilDestroyed(this)
      )
  }

  routeParam(clm_no: string) {
    const claimType = this.activatedRoute.snapshot.queryParamMap.get('claimType');
    this.router.navigate(['/home/lms/ind/claims'], {
      queryParams: {   claimType:  claimType}
    }).then(() => {
      this.getClaimDetails(clm_no)
      this.claimNo = clm_no;
    });
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe(); // Ensures all subscriptions are cleaned up
  }
}
