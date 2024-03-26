import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { Logger } from 'src/app/shared/services';
import {CountryDto} from "../../../../../../shared/data/common/countryDto";

const log = new Logger('EntityOtherDetails');

@Component({
  selector: 'app-entity-other-details',
  templateUrl: './entity-other-details.component.html',
  styleUrls: ['./entity-other-details.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EntityOtherDetailsComponent implements OnInit{

  @Input() partyAccountDetails: any;
  @Input() countries: CountryDto[];


  constructor() {
  }
  ngOnInit(): void {
  }

  getCountryName(id: number): string {
    if (this.countries?.length > 0) {
      const country: CountryDto = this.countries.filter((item: CountryDto) => item.id === id)[0];
      log.info(`country name ==> `, country);
      return country?.name
    }
  }

}
