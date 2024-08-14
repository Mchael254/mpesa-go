import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {debounceTime, distinctUntilChanged, Observable, of, Subject, switchMap} from "rxjs";
import {PoliciesClaimModuleDTO} from "../../../models/claim-inititation";
import {ClaimClientsDTO} from "../../../models/claim-clients";
import {CausationTypesDTO} from "../../../models/causation-types";
import {CausationCausesDTO} from "../../../models/causation-causes";
import {ClaimsService} from "../../../../../../service/claims/claims.service";
import {ActivatedRoute, Router} from "@angular/router";
import {AuthService} from "../../../../../../../../shared/services/auth.service";
import {catchError, startWith, tap} from "rxjs/operators";

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

  causationCauses$: Observable<CausationCausesDTO[]> = of([]); // Initialize with an empty array
  private readonly destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private claimsService: ClaimsService
  ) { }


  ngOnInit(): void {
    this.createForm()

    this.setupCausationTypeListener()
  }


  createForm() {
    this.claimInitForm = this.fb.group({
      claimClients: [''],
      causationType: [''],
      causationCause: [''],
      dateReported: [''],
      incubationPeriod: [''],
      incidentLocation: [''],
      incidentDate: [''],
      uploadFile: [''],
    });
  }

  setupCausationTypeListener(): void {
    this.causationCauses$ = this.claimInitForm.get('causationType').valueChanges.pipe(
      debounceTime(300), // Wait for user input to settle
      distinctUntilChanged(), // Only trigger when the value changes
      switchMap(causationType => {
        console.log('causationType<><>', causationType)
        return  this.claimsService.getCausationCauses(causationType?.value).pipe(
          startWith([]), // Initialize with empty array
          catchError(() => of([])) // Handle errors by returning empty array
        )
      }

      )
    )
  }

  submitClaimInitFormData() {
    // Handle form submission logic here
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
