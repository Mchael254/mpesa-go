import {Component, OnInit} from '@angular/core';
import {Logger} from "../../../../../../../shared/services";
import {FormBuilder, FormGroup} from "@angular/forms";
import {CountryService} from "../../../../../../../shared/services/setups/country/country.service";
import {CountryDto} from "../../../../../../../shared/data/common/countryDto";
import {FundSourceDTO} from "../../../../../../../shared/data/common/bank-dto";
import {BankService} from "../../../../../../../shared/services/setups/bank/bank.service";

const log = new Logger('EditAmlFormComponent');


@Component({
  selector: 'app-edit-aml-form',
  templateUrl: './edit-aml-form.component.html',
  styleUrls: ['./edit-aml-form.component.css']
})
export class EditAmlFormComponent implements OnInit{

  amlForm: FormGroup;
  countryData: CountryDto[];
  fundSource: FundSourceDTO[];

  constructor(
    private fb: FormBuilder,
    private countryService: CountryService,
    private bankService: BankService,
  ) {}

  ngOnInit(): void {
    this.createAmlForm();
    this.fetchCountries();
    this.fetchFundSource();
  }

  /**
   * This method creates the AML form for edit
   */
  createAmlForm(): void {
    this.amlForm = this.fb.group({
      tradingNames: [''],
      entitiesCompany: [''],
      certRegYear: [''],
      operationCountry: [''],
      certRegNo: [''],
      sourceOfWealth: [''],
      parentCompany: [''],
    });
  }

  /**
   * This method fetches list of existing countries and populates the country dropdown
   */
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

  /**
   * This method fetches list of funds sources and populates the fund sources dropdown
   */
  fetchFundSource(): void {
    this.bankService.getFundSource().subscribe({
      next: (fundSource) => {
        this.fundSource = fundSource
      },
      error: (err) => {
        log.info(`could not fetch funds source `, err)
      }
    })
  }


  /**
   * This method updates the AML details in the database
   */
  updateDetails(): void {
    const formValues = this.amlForm.getRawValue();
    log.info(`edit aml details >>> `, formValues);
  }


}
