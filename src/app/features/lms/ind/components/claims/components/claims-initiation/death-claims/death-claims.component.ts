import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output
} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {debounceTime, distinctUntilChanged, finalize, Observable, of, Subject, switchMap} from "rxjs";
import {ClaimClientsDTO} from "../../../models/claim-clients";
import {CausationTypesDTO} from "../../../models/causation-types";
import {CausationCausesDTO} from "../../../models/causation-causes";
import {ClaimsService} from "../../../../../../service/claims/claims.service";
import {catchError, startWith, takeUntil, tap} from "rxjs/operators";
import {PoliciesClaimModuleDTO} from "../../../models/claim-inititation";
import {NgxSpinnerService} from "ngx-spinner";
import {ToastService} from "../../../../../../../../shared/services/toast/toast.service";
import {ClaimDTO} from "../../../models/claims";
import {PolicyClaimIntiation} from "../../../models/policy-claim-intiation";
import {untilDestroyed} from "../../../../../../../../shared/shared.module";
import {ActivatedRoute, Router} from "@angular/router";
import {SessionStorageService} from "../../../../../../../../shared/services/session-storage/session-storage.service";
import {StringManipulation} from "../../../../../../util/string_manipulation";
import {SESSION_KEY} from "../../../../../../util/session_storage_enum";

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
  @Input() eachStep: number;
  @Output() valueChanged: EventEmitter<number> = new EventEmitter<number>(); // Emit the updated value back to the parent


  causationCauses$: Observable<CausationCausesDTO[]> = of([]);
  claimOnLive$: Observable<ClaimClientsDTO[]> = of([]);
  claimResponse: ClaimDTO | null = null;
  claimNo: string
  claimType: string;
  private readonly destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private claimsService: ClaimsService,
    private spinner_service: NgxSpinnerService,
    private toast: ToastService,
    private cdr: ChangeDetectorRef,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private session_storage: SessionStorageService
  ) { }


  ngOnInit(): void {
    this.claimNo = this.activatedRoute.snapshot.queryParamMap.get('claimNo') ||
      StringManipulation.returnNullIfEmpty( this.session_storage.get(SESSION_KEY.CLAIM_NO) );;
    this.createForm()
    this.setupCausationTypeListener()
    this.setupCausationCauseListener()
    if(this.claimNo) {
      console.log('claimmmm', this.claimNo)
      this.getClaimDetails(this.claimNo)
    }
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
        if (!causationType?.value && !causationType) {
          return of([]);
        }
        const causeType = causationType?.value || causationType
        return  this.claimsService.getCausationCauses(causeType).pipe(
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
        if ((!causationCause?.caus_code && !causationCause) || !this.selectedPolicy?.policy_no) {
          return of([]);
        }
        const caussCaus = causationCause?.caus_code || causationCause
        return this.claimsService
          .getClaimOnLive(caussCaus, this.selectedPolicy.policy_no)
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
      untilDestroyed(this)
    ).subscribe({
      next: (response: ClaimDTO) => {
        this.claimResponse = response;
        console.log('this.claimResponse ', this.claimResponse )
        this.getClaimDetails(response?.clm_no)
        this.storeTempClaimNo(response?.clm_no)
        this.claimNo = response?.clm_no
        // this.eachStep += 1
        this.valueChanged.emit(this.eachStep);
        this.cdr.detectChanges()
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
      delete_existing_trans: 'N',
      clm_pod_code: +rawValue?.claimOnLive?.pod_code,
      pol_policy_no: String(this.selectedPolicy?.policy_no),
      prp_code: +this.selectedPolicy?.prp_code,
    };
  }

  patchFormWithClaimDetails(data: ClaimDTO): void {
    this.claimResponse = data;
    console.log('claimResponse', data)
    this.claimInitForm.patchValue({
      claimOnLive: data?.claim_life,
      causationType: data?.clm_caus_type,
      causationCause: data?.caus_code,
      dateReported: data?.clm_date_claim_reported,
      incubationPeriod: data?.clm_overide_inc_prd,
      incidentLocation: data?.clm_death_location,
      incidentDate: data?.clm_date_death_accident
    });
    this.cdr.detectChanges();
  }

  storeTempClaimNo(clm_no: string) {
    this.session_storage.set(SESSION_KEY.CLAIM_NO, clm_no)
    this.getClaimDetails(clm_no)
    this.claimNo = clm_no;
  }

  routeParam(clm_no: string) {
    const claimType = this.activatedRoute.snapshot.queryParamMap.get('claimType');
    this.router.navigate(['/home/lms/ind/claims'], {
      queryParams: {   claimType:  claimType, claimNo: clm_no}
    }).then(() => {
      this.getClaimDetails(clm_no)
      this.claimNo = clm_no;
    });
  }

  getClaimDetails(claimNo: string) {
    this.claimsService.fetchClaimDetails(claimNo)
      .pipe(untilDestroyed(this))
      .subscribe((data: ClaimDTO) => {
        // if (data) {
          this.claimResponse = data
          this.session_storage.set(SESSION_KEY.CLAIMS_DETAILS, data)
          console.log('this.claimResponse ', this.claimResponse )
          this.claimNo = data?.clm_no
          this.patchFormWithClaimDetails(data);
          this.cdr.detectChanges()
        // }
      });
  }
  ngOnDestroy(): void {
  }
}
