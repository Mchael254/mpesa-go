import {ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Observable, of} from "rxjs";
import {ClaimClientsDTO} from "../../../models/claim-clients";
import {CausationTypesDTO} from "../../../models/causation-types";
import {CausationCausesDTO} from "../../../models/causation-causes";
import {PoliciesClaimModuleDTO} from "../../../models/claim-inititation";
import {ClaimsService} from "../../../../../../service/claims/claims.service";
import {NgxSpinnerService} from "ngx-spinner";
import {ToastService} from "../../../../../../../../shared/services/toast/toast.service";
import {ActivatedRoute, Router} from "@angular/router";
import {SessionStorageService} from "../../../../../../../../shared/services/session-storage/session-storage.service";
import {ClaimDTO} from "../../../models/claims";
import {StringManipulation} from "../../../../../../util/string_manipulation";
import {SESSION_KEY} from "../../../../../../util/session_storage_enum";
import {untilDestroyed} from "../../../../../../../../shared/services/until-destroyed";
import {catchError} from "rxjs/operators";
import {SurrenderReason, SurrenderRequest} from "../../../models/surrender";
import {PolicyClaimIntiation} from "../../../models/policy-claim-intiation";

@Component({
  selector: 'app-surrender-claims',
  templateUrl: './surrender-claims.component.html',
  styleUrls: ['./surrender-claims.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SurrenderClaimsComponent {
  @Input() claimInitForm: FormGroup;
  @Input() claimClients:  Observable<ClaimClientsDTO[]>;
  @Input() causationTypes: Observable<CausationTypesDTO[]>;
  @Input() filteredPolicy: string
  @Input() selectedPolicy: PoliciesClaimModuleDTO
  @Input() eachStep: number;
  @Output() valueChanged: EventEmitter<number> = new EventEmitter<number>();
  claimResponse: ClaimDTO | null = StringManipulation.returnNullIfEmpty( this.session_storage.get(SESSION_KEY.CLAIMS_DETAILS));
  claimNo: string
  surReasons$: Observable<SurrenderReason[]>


  constructor(
    private fb: FormBuilder,
    private claimsService: ClaimsService,
    private spinner_service: NgxSpinnerService,
    private toast: ToastService,
    private cdr: ChangeDetectorRef,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private session_storage: SessionStorageService
  ) {}

  ngOnInit(): void {
    this.claimNo = this.activatedRoute.snapshot.queryParamMap.get('claimNo') ||
      StringManipulation.returnNullIfEmpty( this.session_storage.get(SESSION_KEY.CLAIM_NO) );
    this.createForm()
    this.getSurReasons()
    if(this.claimNo) {
      this.getClaimDetails(this.claimNo)
    }
  }

  createForm() {
    this.claimInitForm = this.fb.group({
      offsetPremium: ['', [Validators.required]],
      claimReason: ['', [Validators.required]],
      surrenderDate: ['', [Validators.required]],
      requestDate: ['', [Validators.required]],
      surrenderType: ['', [Validators.required]],
      uploadFile: [''],
    });
  }

  submitClaimRequest(): void {
    const claimInitiationPayload = this.claimsRequestPayload();
    this.claimsService.initiateSurrenderClaims(claimInitiationPayload).pipe(
      untilDestroyed(this)
    ).subscribe({
      next: (response: ClaimDTO) => {
        this.claimResponse = response;
        this.getClaimDetails(response?.clm_no)
        this.storeTempClaimNo(response?.clm_no)
        this.claimNo = response?.clm_no
        // this.eachStep += 1
        // this.valueChanged.emit(this.eachStep);
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

  claimsRequestPayload(): any {
    const rawValue = this.claimInitForm.getRawValue();
    return <SurrenderRequest>{
      pol_code: +this.selectedPolicy?.pol_code,
      delete_trans: "N",
      surr_type: rawValue?.surrenderType,
      surr_date: rawValue?.surrenderDate,
      done_date: null,
      penalty_rate: null,
      penalty_div_fac: null,
      request_date: rawValue?.requestDate,
    };
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
        this.claimNo = data?.clm_no
        this.cdr.detectChanges()
        // }
      });
  }

  getSurReasons() {
    this.surReasons$ = this.claimsService.getSurReason().pipe(
      catchError(_ => {
        return of([]); // Return an empty array as a fallback
      })
    );
  }

  navigateToNextScreen() {
    this.eachStep += 1
    this.valueChanged.emit(this.eachStep);
  }

  ngOnDestroy(): void {
  }
}
