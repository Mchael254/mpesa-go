import {ChangeDetectorRef, Component, EventEmitter, OnInit, Output} from '@angular/core';
import {Logger} from "../../../../../../../shared/services";
import {FormBuilder, FormGroup} from "@angular/forms";
import {CountryDto} from "../../../../../../../shared/data/common/countryDto";
import {FundSourceDTO} from "../../../../../../../shared/data/common/bank-dto";
import {SectorDTO} from "../../../../../../../shared/data/common/sector-dto";
import {CountryService} from "../../../../../../../shared/services/setups/country/country.service";
import {SectorService} from "../../../../../../../shared/services/setups/sector/sector.service";
import {BankService} from "../../../../../../../shared/services/setups/bank/bank.service";
import {EntityService} from "../../../../../services/entity/entity.service";
import {GlobalMessagingService} from "../../../../../../../shared/services/messaging/global-messaging.service";
import {WealthAmlDTO, WealthDetailsUpdateDTO} from "../../../../../data/accountDTO";

const log = new Logger('EditWealthFormComponent');


@Component({
  selector: 'app-edit-wealth-form',
  templateUrl: './edit-wealth-form.component.html',
  styleUrls: ['./edit-wealth-form.component.css']
})
export class EditWealthFormComponent implements OnInit{

  @Output('closeEditModal') closeEditModal: EventEmitter<any> = new EventEmitter<any>();

  wealthAmlDetails: WealthAmlDTO;
  extras: any;

  wealthForm: FormGroup;
  countryData: CountryDto[];
  fundSource: FundSourceDTO[];
  sectorData: SectorDTO[];

  shouldShowEditForm: boolean = false;
  progressBarWidth: number = 10;

  constructor(
    private fb: FormBuilder,
    private countryService: CountryService,
    private sectorService: SectorService,
    private bankService: BankService,
    private cdr: ChangeDetectorRef,
    private entityService: EntityService,
    private globalMessagingService: GlobalMessagingService,
  ) {}

  ngOnInit(): void {
    this.createWealthForm();
    this.fetchCountries();
  }

  /**
   * This method creates wealth form for editing Wealth Details
   */
  createWealthForm(): void {
    this.wealthForm = this.fb.group({
      nationality: [''],
      sourceOfFunds: [''],
      typeOfEmployment: [''],
      citizenship: [''],
      sector: ['']
    });
  }

  /**
   * This method fetches the list of countries for patching and selecting
   */
  fetchCountries(): void {
    this.shouldShowEditForm = false;
    this.countryService.getCountries().subscribe({
      next: (countries) => {
        this.countryData = countries;
        this.fetchSectors();
        this.progressBarWidth = 40;
        this.cdr.detectChanges();
      },
      error: (err) => {
        const errorMessage = err?.error?.message ?? err.message
        this.globalMessagingService.displayErrorMessage("Error", errorMessage);
      }
    })
  }

  /**
   * This method fetches a list of sectors for patching and selecting
   */
  fetchSectors(): void {
    this.sectorService.getSectors().subscribe({
      next: (sectors) => {
        this.sectorData = sectors;
        this.progressBarWidth = 70;
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
   * This method fetches the list of funds sources for patching and selecting
   */
  fetchFundSource(): void {
    this.bankService.getFundSource().subscribe({
      next: (fundSource) => {
        this.fundSource = fundSource;
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
   * Prepare form for editing by patching existing values to form
   * @param wealthDetails current wealth details
   * @param extras additional info required for updating wealth details
   */
  prepareUpdateDetails(wealthDetails: any, extras: any): void {
    this.shouldShowEditForm = false;
    this.wealthAmlDetails = wealthDetails;
    this.extras = extras;
    this.wealthForm.patchValue({
      nationality: wealthDetails.nationality_country_id,
      sourceOfFunds: wealthDetails.fundSource,
      typeOfEmployment: wealthDetails.is_self_employed,
      citizenship: wealthDetails.citizenship_country_id,
      sector: wealthDetails.sector_id
    })
  }

  /**
   * Create update DTO and post to DB; then respond with update Wealth Details
   */
  updateDetails(): void {
    const formValues = this.wealthForm.getRawValue();
    const wealthDetailsToUpdate: WealthDetailsUpdateDTO = {
      citizenship_country_id: formValues.citizenship,
      funds_source: this.fundSource[formValues.sourceOfFunds].name,
      id: this.wealthAmlDetails.id,
      is_employed: 'Y',
      is_self_employed: formValues.typeOfEmployment,
      marital_status: null,
      nationality_country_id: formValues.nationality,
      occupation_id: formValues.occupation_id,
      partyAccountId: this.extras.partyAccountId,
      sector_id: formValues.sector,
      source_of_funds_id: formValues.sourceOfFunds,
    }

    this.entityService.updateWealthDetails(this.extras.partyAccountId, wealthDetailsToUpdate)
      .subscribe({
        next: (res) => {
          this.globalMessagingService.displaySuccessMessage('Success', 'Successfully Updated Bank Details');
          this.closeEditModal.emit();
        },
        error: (err) => {
          const errorMessage = err?.error?.message ?? err.message
          this.globalMessagingService.displayErrorMessage("Error", errorMessage);
        }
    })
  }


}
