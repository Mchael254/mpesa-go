import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import {AccountReqPartyId, ReqPartyById} from 'src/app/features/entities/data/entityDto';
import { PartyTypeDto } from 'src/app/features/entities/data/partyTypeDto';
import { Logger } from 'src/app/shared/services';
import {PartyAccountsDetails} from "../../../../data/accountDTO";

const log = new Logger('EntityBasicInfoComponent');

@Component({
  selector: 'app-entity-basic-info',
  templateUrl: './entity-basic-info.component.html',
  styleUrls: ['./entity-basic-info.component.css']
})
export class EntityBasicInfoComponent {

  @Output('fetchTransactions') fetchTransactions: EventEmitter<any> = new EventEmitter();
  @Output('assignRole') assignRole: EventEmitter<any> = new EventEmitter();
  @Output('partyTypeRole') partyTypeRole: EventEmitter<any> = new EventEmitter<any>();

  @Input() entityPartyIdDetails: ReqPartyById;
  @Input() entityAccountIdDetails: AccountReqPartyId[];
  @Input() partyAccountDetails: PartyAccountsDetails;
  @Input() unAssignedPartyTypes: PartyTypeDto[];

  constructor() {}

  onAssignRole(role: PartyTypeDto) {
    this.assignRole.emit(role);
  }

  selectPartyTypeRole(role: PartyTypeDto) {
    this.partyTypeRole.emit(role);
  }

}
