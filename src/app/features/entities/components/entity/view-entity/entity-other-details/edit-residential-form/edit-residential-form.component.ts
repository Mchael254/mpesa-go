import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  OnInit,
  Output,
} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

import { GlobalMessagingService } from '../../../../../../../shared/services/messaging/global-messaging.service';
import { Extras } from '../entity-other-details.component';
import {
  CountryDto,
  StateDto,
  TownDto,
} from '../../../../../../../shared/data/common/countryDto';
import { CountryService } from '../../../../../../../shared/services/setups/country/country.service';
import { untilDestroyed } from '../../../../../../../shared/services/until-destroyed';
import { Logger } from '../../../../../../../shared/services/logger/logger.service';
import { LeadsService } from '../../../../../../../features/crm/services/leads.service';

const log = new Logger('EditResidentialFormComponent');

@Component({
  selector: 'app-edit-residential-form',
  templateUrl: './edit-residential-form.component.html',
  styleUrls: ['./edit-residential-form.component.css'],
})
export class EditResidentialFormComponent implements OnInit {
  @Output('closeEditModal') closeEditModal: EventEmitter<any> =
    new EventEmitter<any>();
  @Output('isFormDetailsReady') isFormDetailsReady: EventEmitter<boolean> =
    new EventEmitter<boolean>();

  public residentialDetailForm: FormGroup;

  public countryData: CountryDto[] = [];
  public statesData: StateDto[] = [];
  public townData: TownDto[] = [];

  public selectedCountry: number;
  public selectedState: number;
  public residentialDetails: any;
  public extras: Extras;

  public errorOccurred = false;
  public errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private countryService: CountryService,
    private leadService: LeadsService,
    private globalMessagingService: GlobalMessagingService
  ) {}

  ngOnInit(): void {
    this.CreateResidentialForm();
    this.fetchCountries();
  }

  ngOnDestroy(): void {}

  CreateResidentialForm() {
    this.residentialDetailForm = this.fb.group({
      country: [''],
      state: [''],
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
    this.residentialDetailForm.patchValue({
      state: null,
      town: null,
    });

    this.countryService
      .getMainCityStatesByCountry(this.selectedCountry)
      .pipe(untilDestroyed(this))
      .subscribe((data) => {
        this.statesData = data;
      });
    this.cdr.detectChanges();
  }

  onCityChange() {
    this.countryService
      .getTownsByMainCityState(this.selectedState)
      .pipe(untilDestroyed(this))
      .subscribe((data) => {
        this.townData = data;
      });
  }

  prepareUpdateDetails(residentialDetails: any, extras: Extras): void {
    this.residentialDetails = residentialDetails;
    this.extras = extras;
    log.info(`Residential Details for Edit`, this.residentialDetails);
    this.residentialDetailForm.patchValue({
      country: this.residentialDetails.countryCode,
      state: this.residentialDetails.stateCode,
      town: this.residentialDetails.townCode,
      postalAddress: this.residentialDetails.postalAddress,
      postalCode: this.residentialDetails.postalCode,
      physicalAddress: this.residentialDetails.physicalAddress,
    });

    this.selectedCountry = this.residentialDetails.countryCode;

    this.countryService
      .getMainCityStatesByCountry(this.selectedCountry)
      .pipe(untilDestroyed(this))
      .subscribe((statesData) => {
        this.statesData = statesData;
        this.selectedState = this.residentialDetails.stateCode;

        this.residentialDetailForm.patchValue({
          state: this.selectedState,
        });

        this.countryService
          .getTownsByMainCityState(this.selectedState)
          .pipe(untilDestroyed(this))
          .subscribe((townData) => {
            this.townData = townData;

            this.residentialDetailForm.patchValue({
              town: this.residentialDetails.townCode,
            });
          });
      });
  }

  updateDetails(): void {
    const formValue = this.residentialDetailForm.getRawValue();

    const updateResidentialDetails = {
      countryCode: formValue.country,
      stateCode: formValue.state,
      townCode: formValue.town,
      postalAddress: formValue.postalAddress,
      postalCode: formValue.postalCode,
      physicalAddress: formValue.physicalAddress,
    };
    log.info(`Residential Details to be updated`, updateResidentialDetails);
    this.leadService
      .updateLead(updateResidentialDetails, this.extras.leadId)
      .subscribe({
        next: (res) => {
          this.globalMessagingService.displaySuccessMessage(
            'Success',
            'Successfully Updated Residential Details'
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
