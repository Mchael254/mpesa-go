import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {combineLatest, filter, Observable, of} from 'rxjs';
import {catchError, debounceTime, distinctUntilChanged, map, startWith, switchMap, take} from 'rxjs/operators';
import { PoliciesClaimModuleDTO } from '../../../models/claim-inititation';
import { ClaimsService } from '../../../../../../service/claims/claims.service';
import {AuthService} from "../../../../../../../../shared/services/auth.service";
import {UtilService} from "../../../../../../../../shared/services";

@Component({
  selector: 'app-claims-options',
  templateUrl: './claims-options.component.html',
  styleUrls: ['./claims-options.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ClaimsOptionsComponent implements OnInit, OnDestroy {
  @Input() claimInitForm: FormGroup;
  @Input() claim_types: any[];
  @Output() policyFiltered: EventEmitter<string> = new EventEmitter<string>();
  @Output() clientFiltered : EventEmitter<string> = new EventEmitter<string>();

  public userCode: number;
  public policy$: Observable<PoliciesClaimModuleDTO[]>;

  constructor(
    private router: Router,
    private claimsService: ClaimsService,
    private authService: AuthService,
  ) {
  }

  ngOnInit(): void {
    console.log('auth Service', this.authService.getCurrentUser())
  }

  handlePolicyFilter(searchTerm: string) {
    this.policy$ = this.createFilteredPolicyObservable(searchTerm, '');
  }

  handleClientFilter(searchTerm: string) {
    this.policy$ = this.createFilteredPolicyObservable('', searchTerm);
  }

  private createFilteredPolicyObservable(policyNo: string, name: string): Observable<PoliciesClaimModuleDTO[]> {
    return of(policyNo || name).pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(() => this.claimsService.getClaimPolicies(policyNo, name).pipe(
        catchError(() => of([]))
      )),
      map(response => response || [])
    );
  }

  ngOnDestroy(): void {}
}
