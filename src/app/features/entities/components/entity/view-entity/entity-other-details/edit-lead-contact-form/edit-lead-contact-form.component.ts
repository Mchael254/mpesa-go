import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  OnInit,
  Output,
} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

import { Extras } from '../entity-other-details.component';
import { GlobalMessagingService } from '../../../../../../../shared/services/messaging/global-messaging.service';
import { ClientTitleDTO } from '../../../../../../../features/entities/data/accountDTO';
import { CountryDto } from '../../../../../../../shared/data/common/countryDto';
import { Logger } from '../../../../../../../shared/services/logger/logger.service';
import { untilDestroyed } from '../../../../../../../shared/services/until-destroyed';
import { AccountService } from '../../../../../../../features/entities/services/account/account.service';
import { LeadsService } from '../../../../../../../features/crm/services/leads.service';

const log = new Logger('EditLeadContactFormComponent');

@Component({
  selector: 'app-edit-lead-contact-form',
  templateUrl: './edit-lead-contact-form.component.html',
  styleUrls: ['./edit-lead-contact-form.component.css'],
})
export class EditLeadContactFormComponent implements OnInit {
  @Output('closeEditModal') closeEditModal: EventEmitter<any> =
    new EventEmitter<any>();
  @Output('isFormDetailsReady') isFormDetailsReady: EventEmitter<boolean> =
    new EventEmitter<boolean>();

  public leadContactDetailForm: FormGroup;

  public leadTitlesData: ClientTitleDTO[] = [];
  public countryData: CountryDto[] = [];

  public leadContactDetails: any;
  public extras: Extras;
  public errorOccurred = false;
  public errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private accountService: AccountService,
    private leadService: LeadsService,
    private globalMessagingService: GlobalMessagingService
  ) {}

  ngOnInit(): void {
    this.CreateLeadContactForm();
    this.fetchLeadTitle();
  }

  ngOnDestroy(): void {}

  CreateLeadContactForm() {
    this.leadContactDetailForm = this.fb.group({
      leadTitle: [''],
      mobileNumber: [''],
      emailAddress: [''],
      countryCodeMob: [''],
    });
  }

  fetchLeadTitle(organizationId?: number) {
    this.accountService
      .getClientTitles(organizationId)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (data) => {
          if (data) {
            this.leadTitlesData = data;
            log.info('Fetched Lead Title', this.leadTitlesData);
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

  prepareUpdateDetails(leadContactDetails: any, extras: Extras): void {
    this.leadContactDetails = leadContactDetails;
    this.extras = extras;
    log.info('Lead Contact Details for Edit', this.leadContactDetails);
    this.leadContactDetailForm.patchValue({
      leadTitle: this.leadContactDetails.title,
      mobileNumber: this.leadContactDetails.mobileNumber,
      emailAddress: this.leadContactDetails.emailAddress,
    });
  }

  updateDetails(): void {
    const formValues = this.leadContactDetailForm.getRawValue();

    const updateContactDetails = {
      title: formValues.leadTitle,
      mobileNumber: formValues.mobileNumber,
      emailAddress: formValues.emailAddress,
    };
    log.info(`Contact Details to be update`, updateContactDetails);
    this.leadService
      .updateLead(updateContactDetails, this.extras.leadId)
      .subscribe({
        next: (res) => {
          this.globalMessagingService.displaySuccessMessage(
            'Success',
            'Successfully Updated Contact Details'
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
