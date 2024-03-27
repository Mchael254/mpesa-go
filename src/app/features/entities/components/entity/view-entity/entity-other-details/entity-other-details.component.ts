import {ChangeDetectionStrategy, Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {Logger} from 'src/app/shared/services';
import {CountryDto} from "../../../../../../shared/data/common/countryDto";
import {EntityService} from "../../../../services/entity/entity.service";
import {Bank} from "../../../../data/BankDto";

const log = new Logger('EntityOtherDetails');

@Component({
  selector: 'app-entity-other-details',
  templateUrl: './entity-other-details.component.html',
  styleUrls: ['./entity-other-details.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EntityOtherDetailsComponent implements OnInit, OnChanges {

  @Input() partyAccountDetails: any;
  @Input() countries: CountryDto[];
  bankDetails: any;
  wealthAmlDetails: any;
  nokList: any[]


  constructor(
    private entityService: EntityService
  ) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.partyAccountDetails = changes['partyAccountDetails']?.currentValue ?
      changes['partyAccountDetails']?.currentValue : this.partyAccountDetails;

    this.nokList = changes['nextOfKinDetailsList']?.currentValue ?
      changes['nextOfKinDetailsList']?.currentValue : this.nokList;

    this.wealthAmlDetails = changes['wealthAmlDetails']?.currentValue;

    log.info(`partyAccountDetails ==> `, this.partyAccountDetails);
    this.getWealthAmlDetails();
    this.getNokList();
    this.getPaymentDetails();
  }

  ngOnInit(): void {}

  getCountryName(id: number): string {
    if (this.countries?.length > 0) {
      const country: CountryDto = this.countries.filter((item: CountryDto) => item.id === id)[0];
      log.info(`country name ==> `, country);
      return country?.name
    }
  }

  getPaymentDetails(): void {
    if (this.partyAccountDetails) {
      const id: number  = this.partyAccountDetails?.paymentDetails?.bank_branch_id;
      this.entityService.fetchBankDetailsByBranchId(id)
        .subscribe({
          next: (bank: Bank) => {
              this.bankDetails = {
              bankId: bank.bankId,
              bank: bank.bankName,
              branch: bank.name,
              accountNo: this.partyAccountDetails?.paymentDetails?.account_number,
              paymentMethod: 'xxx',
              accountType: 'xxx'
            }
            log.info(`Bank details ==> `, bank, this.bankDetails);
          },
          error: (err) => {}
        });
    }
  }

  getWealthAmlDetails(): void {
    if (this.partyAccountDetails.wealthAmlDetails) {
      this.wealthAmlDetails = {
        citizenship_country_id:  this.partyAccountDetails?.wealthAmlDetails?.citizenship_country_id,
        funds_source: this.partyAccountDetails?.wealthAmlDetails?.funds_source,
        sector_id: this.partyAccountDetails?.wealthAmlDetails?.sector_id,
        employment_type: this.partyAccountDetails?.wealthAmlDetails?.occupation_id,
        nationality_country_id: this.partyAccountDetails?.wealthAmlDetails?.nationality_country_id,
        distribute_channel: this.partyAccountDetails?.wealthAmlDetails?.distributeChannel,
        insurance_purpose: this.partyAccountDetails?.wealthAmlDetails?.insurancePurpose,
        premium_frequency: this.partyAccountDetails?.wealthAmlDetails?.premiumFrequency,
      };
      log.info(`wealth AML Details ==> `, this.wealthAmlDetails);
    }
  }

  getNokList(): void {
    if (this.partyAccountDetails?.nextOfKinDetailsList) {
      this.nokList = this.partyAccountDetails?.nextOfKinDetailsList;
      log.info(`nok list ==> `, this.nokList);
    }
  }

}
