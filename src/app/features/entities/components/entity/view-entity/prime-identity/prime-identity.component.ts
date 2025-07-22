import {Component, Input} from '@angular/core';
import {PartyAccountsDetails} from "../../../../data/accountDTO";
import {ReqPartyById} from "../../../../data/entityDto";
import {UtilService} from "../../../../../../shared/services";

@Component({
  selector: 'app-prime-identity',
  templateUrl: './prime-identity.component.html',
  styleUrls: ['./prime-identity.component.css']
})
export class PrimeIdentityComponent {

  @Input() partyAccountDetails: PartyAccountsDetails;
  @Input() entityPartyIdDetails: ReqPartyById;
  @Input() primeDetailsConfig: any
  primaryDetailsConfig: any;
  language: string = '';


  constructor(
    private utilService: UtilService,
  ) {
    setTimeout(() => {
      this.primaryDetailsConfig = this.primeDetailsConfig.primary_details
    }, 500);

    this.utilService.currentLanguage.subscribe(lang => {
      this.language = lang;
    });
  }

}
