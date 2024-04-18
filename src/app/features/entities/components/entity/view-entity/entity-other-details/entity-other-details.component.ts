import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges
} from '@angular/core';
import {CountryDto} from "../../../../../../shared/data/common/countryDto";
import {EntityService} from "../../../../services/entity/entity.service";
import {Logger} from "../../../../../../shared/services";

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
  @Input() bankDetails: any;
  @Input() wealthAmlDetails: any;
  nokList: any[]
  @Output('fetchWealthAmlDetails') fetchWealthAmlDetails: EventEmitter<any> = new EventEmitter<any>();
  @Output('fetchPaymentDetails') fetchPaymentDetails: EventEmitter<any> = new EventEmitter<any>();


  constructor() {}

  ngOnChanges(changes: SimpleChanges): void {
    // this.getNokList();
  }

  ngOnInit(): void {
    this.getNokList();
  }

  getCountryName(id: number): string {
    if (this.countries?.length > 0) {
      const country: CountryDto = this.countries.filter((item: CountryDto):boolean => item.id === id)[0];
      // log.info(`country name ==> `, country);
      return country?.name
    }
  }

  getPaymentDetails(): void {
    this.fetchPaymentDetails.emit();
  }

  getWealthAmlDetails(): void {
    this.fetchWealthAmlDetails.emit();
  }

  getNokList(): void {
    if (this.partyAccountDetails?.nextOfKinDetailsList) {
      this.nokList = this.partyAccountDetails?.nextOfKinDetailsList;
      // log.info(`nok list ==> `, this.nokList);
    }
  }

}
