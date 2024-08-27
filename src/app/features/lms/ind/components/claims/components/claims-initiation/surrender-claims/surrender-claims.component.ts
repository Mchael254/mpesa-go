import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {FormGroup} from "@angular/forms";
import {Observable} from "rxjs";
import {ClaimClientsDTO} from "../../../models/claim-clients";
import {CausationTypesDTO} from "../../../models/causation-types";
import {CausationCausesDTO} from "../../../models/causation-causes";

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
  @Input() causationCauses: Observable<CausationCausesDTO[]>;
  @Input() surClaim: string;


  submitClaimInitFormData() {
    // Handle form submission logic here
  }
}
