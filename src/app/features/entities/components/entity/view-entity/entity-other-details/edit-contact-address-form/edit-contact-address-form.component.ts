import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  OnInit,
  Output,
} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import {
  CountryISO,
  PhoneNumberFormat,
  SearchCountryField,
} from 'ngx-intl-tel-input';

import { Extras } from '../entity-other-details.component';
import { Logger } from '../../../../../../../shared/services/logger/logger.service';
import { CountryService } from '../../../../../../../shared/services/setups/country/country.service';
import { ProspectService } from '../../../../../services/prospect/prospect.service';
import { untilDestroyed } from '../../../../../../../shared/services/until-destroyed';
import { GlobalMessagingService } from '../../../../../../../shared/services/messaging/global-messaging.service';
import {
  CountryDto,
  TownDto,
} from '../../../../../../../shared/data/common/countryDto';

const log = new Logger('EditContactAddressFormComponent');

@Component({
  selector: 'app-edit-contact-address-form',
  templateUrl: './edit-contact-address-form.component.html',
  styleUrls: ['./edit-contact-address-form.component.css'],
})
export class EditContactAddressFormComponent implements OnInit {
  @Output('closeEditModal') closeEditModal: EventEmitter<any> =
    new EventEmitter<any>();
  @Output('isFormDetailsReady') isFormDetailsReady: EventEmitter<boolean> =
    new EventEmitter<boolean>();

  public prospectContactAddressForm: FormGroup;

  public countryData: CountryDto[] = [];
  public townData: TownDto[] = [];

  public selectedCountry: number;

  public prospectDetails: any;
  public extras: Extras;
  public errorOccurred = false;
  public errorMessage: string = '';

  SearchCountryField = SearchCountryField;
  CountryISO = CountryISO;
  PhoneNumberFormat = PhoneNumberFormat;
  preferredCountries: CountryISO[] = [
    CountryISO.Kenya,
    CountryISO.Nigeria,
    CountryISO.UnitedStates,
    CountryISO.UnitedKingdom,
  ];

  constructor(
    private fb: FormBuilder,
    private countryService: CountryService,
    private prospectService: ProspectService,
    private globalMessagingService: GlobalMessagingService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.CreateProspectContactForm();
    this.fetchCountries();
  }

  ngOnDestroy(): void {}

  CreateProspectContactForm() {
    this.prospectContactAddressForm = this.fb.group({
      mobileNumber: [''],
      emailAddress: [''],
      telNumber: [''],
      country: [''],
      town: [''],
      postalAddress: [''],
      postalCode: [''],
      physicalAddress: [''],
    });
  }

  fetchCountries() {
    this.countryService
      .getCountries()
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (data) => {
          if (data) {
            this.countryData = data;
            log.info('Fetched Countries', this.countryData);
          } else {
            this.errorOccurred = true;
            this.errorMessage = 'Something went wrong. Please try Again';
            this.globalMessagingService.displayErrorMessage(
              'Error',
              this.errorMessage
            );
          }
        },
        error: (err) => {
          this.errorOccurred = true;
          this.errorMessage = err?.message || 'An error occurred';
          this.globalMessagingService.displayErrorMessage(
            'Error',
            this.errorMessage
          );
          log.info(`error >>>`, err);
        },
      });
  }

  onCountryChange() {
    this.prospectContactAddressForm.patchValue({
      town: null,
    });

    this.countryService
      .getTownsByCountry(this.selectedCountry)
      .pipe(untilDestroyed(this))
      .subscribe((data) => {
        this.townData = data;
      });
    this.cdr.detectChanges();
  }

  prepareUpdateDetails(prospectDetails: any, extras: Extras): void {
    this.prospectDetails = prospectDetails;
    this.extras = extras;
    log.info('Lead Contact Details for Edit', this.prospectDetails);
    this.prospectContactAddressForm.patchValue({
      mobileNumber: this.prospectDetails.mobileNumber,
      emailAddress: this.prospectDetails.emailAddress,
      telNumber: this.prospectDetails.telNumber,
      country: this.prospectDetails.countryId,
      town: this.prospectDetails.townId,
      postalAddress: this.prospectDetails.postalAddress,
      postalCode: this.prospectDetails.postalCode,
      physicalAddress: this.prospectDetails.physicalAddress,
    });

    this.selectedCountry = this.prospectDetails.countryId;

    this.countryService
      .getTownsByCountry(this.selectedCountry)
      .pipe(untilDestroyed(this))
      .subscribe((townData) => {
        this.townData = townData;

        this.prospectContactAddressForm.patchValue({
          town: this.prospectDetails.townId,
        });
      });
  }

  updateDetails(): void {
    const formValues = this.prospectContactAddressForm.getRawValue();

    log.info(`Prospect Form Values`, formValues);

    const updateDetails = {
      mobileNumber: formValues.mobileNumber.internationalNumber,
      emailAddress: formValues.emailAddress,
      telNumber: formValues.telNumber.internationalNumber,
      country: formValues.country,
      town: formValues.town,
      postalAddress: formValues.postalAddress,
      postalCode: formValues.postalCode,
      physicalAddress: formValues.physicalAddress,
    };

    log.info(`Number to be saved`, updateDetails);

    this.prospectService
      .updateProspect(updateDetails, this.extras.prospectId)
      .subscribe({
        next: (res) => {
          this.globalMessagingService.displaySuccessMessage(
            'Success',
            'Successfully Updated Prospect Details'
          );
          this.closeEditModal.emit();
          this.isFormDetailsReady.emit(false);
        },
        error: (err) => {
          const errorMessage = err?.error?.message ?? err.message;
          this.globalMessagingService.displayErrorMessage(
            'Error',
            errorMessage
          );
        },
      });
  }
}
