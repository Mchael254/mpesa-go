import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { take } from 'rxjs';
import { AccountReqPartyId, EntityDto } from 'src/app/features/entities/data/entityDto';
import { PartyTypeDto } from 'src/app/features/entities/data/partyTypeDto';
import { AccountService } from 'src/app/features/entities/services/account/account.service';
import { EntityService } from 'src/app/features/entities/services/entity/entity.service';
import { Logger } from 'src/app/shared/services';
import { GlobalMessagingService } from 'src/app/shared/services/messaging/global-messaging.service';

const log = new Logger('EntityBasicInfocomponent');

@Component({
  selector: 'app-entity-basic-info',
  templateUrl: './entity-basic-info.component.html',
  styleUrls: ['./entity-basic-info.component.css']
})
export class EntityBasicInfoComponent {

  @ViewChild('closebutton') closebutton;

  @Output('fetchTransactions') fetchTransactions: EventEmitter<any> = new EventEmitter();
  @Input() entityPartyIdDetails;
  @Input() entityAccountIdDetails;
  @Input() partyAccountDetails;
  selectedAccount: AccountReqPartyId;
  @Input() unAssignedPartyTypes;
  selectedRole: PartyTypeDto;

  constructor(
    private entityService: EntityService,
    private accountService: AccountService,
    private router: Router,
  ) {}


  onAssignRole(role) {
    this.selectedRole = role;
    this.closebutton.nativeElement.click();
    this.goToEntityRoleDefinitions();
  }

  goToEntityRoleDefinitions() {
    const currentEntity: EntityDto = {
      categoryName: this.entityPartyIdDetails.categoryName,
      countryId: this.entityPartyIdDetails.countryId,
      dateOfBirth: this.entityPartyIdDetails.dateOfBirth,
      effectiveDateFrom: this.entityPartyIdDetails.effectiveDateFrom,
      effectiveDateTo: this.entityPartyIdDetails.effectiveDateTo,
      id: this.entityPartyIdDetails.id,
      modeOfIdentity: this.entityPartyIdDetails.modeOfIdentity,
      identityNumber: this.entityPartyIdDetails.identityNumber,
      name: this.entityPartyIdDetails.name,
      organizationId: this.entityPartyIdDetails.organizationId,
      pinNumber: this.entityPartyIdDetails.pinNumber,
      profileImage: this.entityPartyIdDetails.profileImage,
      profilePicture: this.entityPartyIdDetails.profileImage,
      partyTypeId: this.selectedRole.id,
      modeOfIdentityName: ''
    }
    this.entityService.setCurrentEntity(currentEntity);

    let entityRoleName = this.selectedRole?.partyTypeName;
    let url = '';

    switch (entityRoleName?.toLocaleLowerCase()) {
      case 'staff':
        url = '/home/entity/staff/new';
        break;
      case 'client':
        url = '/home/entity/client/new';
        break;
      case 'agent':
        url = '/home/entity/intermediary/new';
        break;
      case 'service provider':
        url = 'home/entity/service-provider/new'
        break;
      default:
        break;
    }
    this.router.navigate([url], { queryParams: {id: this.entityPartyIdDetails?.id }});
  }

  selectPartyTypeRole(role) {
    const accountId = role?.id;
    const  accountType =  this.entityAccountIdDetails.find(account =>  account.id == accountId);
    this.selectedAccount = accountType;
    this.accountService.getAccountDetailsByAccountCode(accountType?.accountCode)
    .subscribe({
      next: (data) => {
        this.partyAccountDetails = data;
        this.accountService.setCurrentAccounts(this.partyAccountDetails);
        this.fetchTransactions.emit(this.partyAccountDetails);
      },
      error: (err) => {}
    })
  }
  

}
