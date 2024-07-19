import {Component, OnInit} from '@angular/core';
import {Logger} from "../../../../../../../shared/services";
import {FormBuilder, FormGroup} from "@angular/forms";
import {CountryDto} from "../../../../../../../shared/data/common/countryDto";
import {FundSourceDTO} from "../../../../../../../shared/data/common/bank-dto";
import {SectorDTO} from "../../../../../../../shared/data/common/sector-dto";
import {CountryService} from "../../../../../../../shared/services/setups/country/country.service";
import {SectorService} from "../../../../../../../shared/services/setups/sector/sector.service";
import {BankService} from "../../../../../../../shared/services/setups/bank/bank.service";

const log = new Logger('EditWealthFormComponent');


@Component({
  selector: 'app-edit-wealth-form',
  templateUrl: './edit-wealth-form.component.html',
  styleUrls: ['./edit-wealth-form.component.css']
})
export class EditWealthFormComponent implements OnInit{

  wealthForm: FormGroup;
  countryData: CountryDto[];
  fundSource: FundSourceDTO[];
  sectorData: SectorDTO[];

  constructor(
    private fb: FormBuilder,
    private countryService: CountryService,
    private sectorService: SectorService,
    private bankService: BankService,
  ) {}

  ngOnInit(): void {
    this.createWealthForm();
    this.fetchCountries();
    this.fetchSectors(2);
    this.fetchFundSource();
  }

  createWealthForm(): void {
    this.wealthForm = this.fb.group({
      nationality: [''],
      sourceOfFunds: [''],
      typeOfEmployment: [''],
      citizenship: [''],
      sector: ['']
    });
  }

  fetchCountries(): void {
    this.countryService.getCountries().subscribe({
      next: (countries) => {
        this.countryData = countries;
      },
      error: (err) => {
        log.info(`Could not fetch country data`, err);
      }
    })
  }

  fetchSectors(organizationId: number): void {
    this.sectorService.getSectors().subscribe({
      next: (sectors) => {
        this.sectorData = sectors;
      },
      error: (err) => {
        log.info(`could not fetch sectors `, err);
      }
    })
  }

  fetchFundSource(): void {
    this.bankService.getFundSource().subscribe({
      next: (fundSource) => {
        this.fundSource = fundSource;
      },
      error: (err) => {
        log.info(`could not fetch source of funds `, err)
      }
    })
  }

  updateDetails(): void {
    const formValues = this.wealthForm.getRawValue();
    log.info(`edit wealth details >>> `, formValues);
  }


}
