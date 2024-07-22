import {ChangeDetectorRef, Component, EventEmitter, OnInit, Output} from '@angular/core';
import {Logger} from "../../../../../../../shared/services";
import {FormBuilder, FormGroup} from "@angular/forms";
import {CountryService} from "../../../../../../../shared/services/setups/country/country.service";
import {CountryDto} from "../../../../../../../shared/data/common/countryDto";
import {FundSourceDTO} from "../../../../../../../shared/data/common/bank-dto";
import {BankService} from "../../../../../../../shared/services/setups/bank/bank.service";
import {AmlWealthDetailsUpdateDTO} from "../../../../../data/accountDTO";
import {EntityService} from "../../../../../services/entity/entity.service";
import {GlobalMessagingService} from "../../../../../../../shared/services/messaging/global-messaging.service";

const log = new Logger('EditAmlFormComponent');


@Component({
  selector: 'app-edit-aml-form',
  templateUrl: './edit-aml-form.component.html',
  styleUrls: ['./edit-aml-form.component.css']
})
export class EditAmlFormComponent implements OnInit{

  @Output('closeEditModal') closeEditModal: EventEmitter<any> = new EventEmitter<any>();

  amlForm: FormGroup;
  amlDetails: any;
  countryData: CountryDto[];
  fundSource: FundSourceDTO[];
  shouldShowEditForm: boolean = false;
  extras: any;
  progressBarWidth: number = 10;

  constructor(
    private fb: FormBuilder,
    private countryService: CountryService,
    private bankService: BankService,
    private cdr: ChangeDetectorRef,
    private entityService: EntityService,
    private globalMessagingService: GlobalMessagingService,
  ) {}

  ngOnInit(): void {
    this.createAmlForm();
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
   * Prepare form for editing by patching existing values to form
   * @param amlDetails current AML details
   * @param extras additional info needed for updating bank details e.g. partyAccountId
   */
  prepareUpdateDetails(amlDetails: any, extras: any): void {
    this.shouldShowEditForm = false;
    this.amlDetails = amlDetails;
    this.extras = extras;
    this.amlForm.patchValue({
      tradingNames: amlDetails.tradingName,
      entitiesCompany: amlDetails.entitiesCompany,
      certRegYear: amlDetails.certificate_year_of_registration,
      operationCountry: amlDetails.operating_country_id,
      certRegNo: amlDetails.certificate_registration_number,
      sourceOfWealth: amlDetails.source_of_wealth_id,
      parentCompany: amlDetails.parentCompany,
    });
    this.progressBarWidth = 50;
    this.cdr.detectChanges();
    this.fetchCountries();
  }

  /**
   * This method fetches list of existing countries and populates the country dropdown
   */
  fetchCountries(): void {
    this.countryService.getCountries().subscribe({
      next: (countries) => {
        this.countryData = countries;
        this.progressBarWidth = 75;
        this.fetchFundSource();
        this.cdr.detectChanges();
      },
      error: (err) => {
        const errorMessage = err?.error?.message ?? err.message
        this.globalMessagingService.displayErrorMessage("Error", errorMessage);
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
        this.progressBarWidth = 100;
        this.shouldShowEditForm = true;
        this.cdr.detectChanges();
      },
      error: (err) => {
        const errorMessage = err?.error?.message ?? err.message
        this.globalMessagingService.displayErrorMessage("Error", errorMessage);
      }
    })
  }


  /**
   * This method updates the AML details in the database
   */
  updateDetails(): void {
    const formValues = this.amlForm.getRawValue();
    const amlDetailsToUpdate: AmlWealthDetailsUpdateDTO = {
      certificate_registration_number: formValues.certRegNo,
      certificate_year_of_registration: formValues.certRegYear,
      cr_form_required: 'N',
      cr_form_year: null,
      funds_source: formValues.sourceOfWealth,
      id: this.amlDetails.id,
      operating_country_id: formValues.operationCountry,
      parent_country_id: formValues.parentCountry,
      partyAccountId: this.extras.partyAccountId,
      registeredName: formValues.tradingNames,
      source_of_wealth_id: formValues.sourceOfWealth,
      tradingName: formValues.tradingNames
    }

    this.entityService.updateAmlDetails(this.extras.partyAccountId, amlDetailsToUpdate)
      .subscribe({
        next: (res) => {
          this.globalMessagingService.displaySuccessMessage('Success', 'Successfully Updated Bank Details');
          this.closeEditModal.emit();
        },
        error: (err) => {
          const errorMessage = err?.error?.message ?? err.message
          this.globalMessagingService.displayErrorMessage("Error", err?.error.errors[0] /*errorMessage*/);
        }
      })
  }


}
