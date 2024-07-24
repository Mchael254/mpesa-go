import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {FormGroup} from "@angular/forms";
import {Observable} from "rxjs";
import {PoliciesClaimModuleDTO} from "../../../models/claim-inititation";
import {ClaimClientsDTO} from "../../../models/claim-clients";
import {CausationTypesDTO} from "../../../models/causation-types";
import {CausationCausesDTO} from "../../../models/causation-causes";

@Component({
  selector: 'app-death-claims',
  templateUrl: './death-claims.component.html',
  styleUrls: ['./death-claims.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DeathClaimsComponent {
  @Input() claimInitForm: FormGroup;
  @Input() claimClients:  Observable<ClaimClientsDTO[]>;
  @Input() causationTypes: Observable<CausationTypesDTO[]>;
  @Input() causationCauses: Observable<CausationCausesDTO[]>;
}
