import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {debounceTime, distinctUntilChanged, Observable, of, Subject, switchMap} from "rxjs";
import {ClaimClientsDTO} from "../../../models/claim-clients";
import {CausationTypesDTO} from "../../../models/causation-types";
import {CausationCausesDTO} from "../../../models/causation-causes";
import {ClaimsService} from "../../../../../../service/claims/claims.service";
import {catchError, startWith, takeUntil, tap} from "rxjs/operators";
import {PoliciesClaimModuleDTO} from "../../../models/claim-inititation";
import {NgxSpinnerService} from "ngx-spinner";
import {PartyService} from "../../../../../../service/party/party.service";
import {SessionStorageService} from "../../../../../../../../shared/services/session-storage/session-storage.service";
import {ToastService} from "../../../../../../../../shared/services/toast/toast.service";
import {ClaimDTO} from "../../../models/claims";
import {PolicyClaimIntiation} from "../../../models/policy-claim-intiation";

@Component({
  selector: 'app-death-claims',
  templateUrl: './death-claims.component.html',
  styleUrls: ['./death-claims.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DeathClaimsComponent implements OnInit, OnDestroy{
  claimInitForm: FormGroup;
  @Input() claimClients:  Observable<ClaimClientsDTO[]>;
  @Input() causationTypes: Observable<CausationTypesDTO[]>;
  @Input() filteredPolicy: string
  @Input() selectedPolicy: PoliciesClaimModuleDTO

  causationCauses$: Observable<CausationCausesDTO[]> = of([]);
  claimOnLive$: Observable<ClaimClientsDTO[]> = of([]);
  claimResponse: ClaimDTO | null = null;
  private readonly destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private claimsService: ClaimsService,
    private spinner_service: NgxSpinnerService,
    private toast: ToastService
  ) { }


  ngOnInit(): void {
    this.createForm()

    this.setupCausationTypeListener()
    this.setupCausationCauseListener()
  }


  createForm() {
    this.claimInitForm = this.fb.group({
      claimOnLive: ['', [Validators.required]],
      causationType: ['', [Validators.required]],
      causationCause: ['', [Validators.required]],
      dateReported: ['', [Validators.required]],
      incubationPeriod: ['', [Validators.required]],
      incidentLocation: ['', [Validators.required]],
      incidentDate: ['', [Validators.required]],
      uploadFile: [''],
    });
  }

  setupCausationTypeListener(): void {
    this.causationCauses$ = this.claimInitForm.get('causationType').valueChanges.pipe(
      debounceTime(300), // Wait for user input to settle
      distinctUntilChanged(), // Only trigger when the value changes
      switchMap(causationType => {
        // Ensure both causationType is not empty
        if (!causationType?.value) {
          return of([]);
        }
        return  this.claimsService.getCausationCauses(causationType?.value).pipe(
          startWith([]),
          catchError(() => of([]))
        )
      }
      )
    )
  }

  setupCausationCauseListener(): void {
   this.claimOnLive$ = this.claimInitForm
     .get('causationCause').valueChanges
     .pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(causationCause => {
        // Check if the causationCause and policy_no are valid
        if (!causationCause?.caus_code || !this.selectedPolicy?.policy_no) {
          return of([]);
        }
        return this.claimsService
          .getClaimOnLive(causationCause?.caus_code, this.selectedPolicy.policy_no)
          .pipe(
          startWith([]),
          catchError(err => {
            return of([]); // Handle error by returning an empty array
          })
        );
      })
    )
  }
  submitClaimRequest(): void {
    const claimInitiationPayload = this.claimsRequestPayload();
    this.spinner_service.show('claims_initiation');

    this.claimsService.initiateClaims(claimInitiationPayload).pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: (response: ClaimDTO) => {
        this.claimResponse = response;
        this.toast.success('Claims Initiated Successfully', 'Claims Initiation');
      },
      error: (err) => {
        this.spinner_service.hide('claims_initiation');
        this.toast.danger(err?.error?.errors[0], 'Claims Initiation');
      },
      complete: () => {
        this.spinner_service.hide('claims_initiation');
      }
    });
  }


  claimsRequestPayload(): PolicyClaimIntiation {
    const rawValue = this.claimInitForm.getRawValue();
    const incubationPeriod = rawValue?.incubationPeriod=== 'yes' ? 'Y' : 'N'
    return <PolicyClaimIntiation>{
      pol_code: +this.selectedPolicy?.pol_code,
      clm_date_death_accident: rawValue?.incidentDate,
      place_of_incident: rawValue?.incidentLocation,
      clm_exgratia_checked: incubationPeriod,
      caus_code: +rawValue?.causationCause?.caus_code,
      caus_sht_desc: rawValue?.causationCause?.caus_sht_desc,
      csc_code: +rawValue?.causationCause?.csc_code,
      ddc_code: +rawValue.causationCause.ddc_code,
      ddc_desc: rawValue.causationCause.ddc_desc,
      place_of_death: rawValue.incidentLocation,
      caus_type: rawValue.causationCause.caus_type,
      delete_existing_trans: 'Y',
      clm_pod_code: +rawValue?.claimOnLive?.pod_code,
      pol_policy_no: String(this.selectedPolicy?.policy_no),
      prp_code: +this.selectedPolicy?.prp_code,
    };
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
