import {ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit} from '@angular/core';
import {FormGroup} from "@angular/forms";
import {Router} from "@angular/router";
import {Observable} from "rxjs";
import {PoliciesClaimModuleDTO} from "../../../models/claim-inititation";
import {logInfo} from "source-map-explorer/bin/cli";

@Component({
  selector: 'app-claims-options',
  templateUrl: './claims-options.component.html',
  styleUrls: ['./claims-options.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ClaimsOptionsComponent implements OnInit, OnDestroy {
  constructor(
    private router: Router
  ) {
  }
  @Input() claimInitForm: FormGroup;
  @Input() policy: Observable<PoliciesClaimModuleDTO[]>;
  @Input() claim_types: any[];



  ngOnInit(): void {
    console.log('policy111>>>>', this.policy)
    this.policy.subscribe(data => console.log('policy>>>>', data))
  }

  ngOnDestroy(): void {
  }
}
