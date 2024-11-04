import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Output,
} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { GlobalMessagingService } from '../../../../../../../shared/services/messaging/global-messaging.service';
import { Extras } from '../entity-other-details.component';
import { SectorDTO } from '../../../../../../../shared/data/common/sector-dto';
import { CurrencyDTO } from '../../../../../../../shared/data/common/currency-dto';
import { Logger } from '../../../../../../../shared/services/logger/logger.service';
import { SectorService } from '../../../../../../../shared/services/setups/sector/sector.service';
import { CurrencyService } from '../../../../../../../shared/services/setups/currency/currency.service';
import { untilDestroyed } from '../../../../../../../shared/services/until-destroyed';
import { LeadsService } from '../../../../../../../features/crm/services/leads.service';

const log = new Logger('EditOtherDetailsFormComponent');

@Component({
  selector: 'app-edit-other-details-form',
  templateUrl: './edit-other-details-form.component.html',
  styleUrls: ['./edit-other-details-form.component.css'],
})
export class EditOtherDetailsFormComponent {
  @Output('closeEditModal') closeEditModal: EventEmitter<any> =
    new EventEmitter<any>();
  @Output('isFormDetailsReady') isFormDetailsReady: EventEmitter<boolean> =
    new EventEmitter<boolean>();

  public otherDetailForm: FormGroup;

  public sectorsData: SectorDTO[] = [];
  public currenciesData: CurrencyDTO[] = [];

  public otherDetails: any;
  public extras: Extras;
  public errorOccurred = false;
  public errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private sectorService: SectorService,
    private currencyService: CurrencyService,
    private leadService: LeadsService,
    private globalMessagingService: GlobalMessagingService
  ) {}

  ngOnInit(): void {
    this.CreateOtherDetailsForm();
    this.fetchSectors();
    this.fetchCurrencies();
  }

  ngOnDestroy(): void {}

  CreateOtherDetailsForm() {
    this.otherDetailForm = this.fb.group({
      sector: [''],
      currency: [''],
      annualRevenue: [''],
      potentialAmount: [''],
      potentialName: [''],
      potentialSaleStage: [''],
      potentialContr: [''],
      converted: [''],
      potentialCloseDate: [''],
    });
  }

  fetchSectors(organizationId?: number) {
    this.sectorService
      .getSectors(organizationId)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (data) => {
          if (data) {
            this.sectorsData = data;
            log.info(`Fetched Sectors Data`, this.sectorsData);
          } else {
            this.errorOccurred = true;
            this.errorMessage = 'Something went wrong. Please try Again';
            this.globalMessagingService.displayErrorMessage(
              'Error',
              'Something went wrong. Please try Again'
            );
          }
        },
        error: (err) => {
          this.errorOccurred = true;
          this.errorMessage = err?.error?.errors[0];
          this.globalMessagingService.displayErrorMessage(
            'Error',
            this.errorMessage
          );
          log.info(`error >>>`, err);
        },
      });
  }

  fetchCurrencies() {
    this.currencyService
      .getCurrencies()
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (data) => {
          if (data) {
            this.currenciesData = data;
            log.info(`Fetched Currency Data`, this.currenciesData);
          } else {
            this.errorOccurred = true;
            this.errorMessage = 'Something went wrong. Please try Again';
            this.globalMessagingService.displayErrorMessage(
              'Error',
              'Something went wrong. Please try Again'
            );
          }
        },
        error: (err) => {
          this.errorOccurred = true;
          this.errorMessage = err?.error?.errors[0];
          this.globalMessagingService.displayErrorMessage(
            'Error',
            this.errorMessage
          );
          log.info(`error >>>`, err);
        },
      });
  }

  prepareUpdateDetails(otherDetails: any, extras: Extras): void {
    this.otherDetails = otherDetails;
    this.extras = extras;
    log.info(`Other Details for Edit`, this.otherDetails);
    this.otherDetailForm.patchValue({
      sector: this.otherDetails.industry,
      currency: this.otherDetails.currencyCode,
      annualRevenue: this.otherDetails.annualRevenue,
      potentialAmount: this.otherDetails.potentialAmount,
      potentialName: this.otherDetails.potentialName,
      potentialSaleStage: this.otherDetails.potentialSaleStage,
      potentialContr: this.otherDetails.potentialContributor,
      converted: this.otherDetails.converted,
      potentialCloseDate: this.otherDetails.potentialCloseDate,
    });
  }

  updateDetails(): void {
    const formValues = this.otherDetailForm.getRawValue();
    const updateOtherDetails = {
      industry: formValues.sector,
      currencyCode: formValues.currency,
      annuelRevenue: formValues.annuelRevenue,
      potentialAmount: formValues.potentialAmount,
      potentialName: formValues.potentialName,
      potentialSaleStage: formValues.potentialSaleStage,
      potentialContributor: formValues.potentialContr,
      converted: formValues.converted,
      potentialCloseDate: formValues.potentialCloseDate,
    };
    log.info(`Other Details to update`, updateOtherDetails);
    this.leadService
      .updateLead(updateOtherDetails, this.extras.leadId)
      .subscribe({
        next: (res) => {
          this.globalMessagingService.displaySuccessMessage(
            'Success',
            'Successfully Updated Other Details'
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
