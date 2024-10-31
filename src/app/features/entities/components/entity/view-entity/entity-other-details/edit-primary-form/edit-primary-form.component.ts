import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  OnInit,
  Output,
} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

import { GlobalMessagingService } from '../../../../../../../shared/services/messaging/global-messaging.service';
import { CampaignsDTO } from '../../../../../../../features/crm/data/campaignsDTO';
import { LeadSourceDto } from '../../../../../../../features/crm/data/leads';
import { OccupationDTO } from '../../../../../../../shared/data/common/occupation-dto';
import { Extras } from '../entity-other-details.component';
import { Logger } from '../../../../../../../shared/services/logger/logger.service';
import { untilDestroyed } from '../../../../../../../shared/services/until-destroyed';
import { CampaignsService } from '../../../../../../../features/crm/services/campaigns..service';
import { LeadsService } from '../../../../../../../features/crm/services/leads.service';
import { OccupationService } from '../../../../../../../shared/services/setups/occupation/occupation.service';
import { DatePipe } from '@angular/common';

const log = new Logger('EditPrimaryFormComponent');

@Component({
  selector: 'app-edit-primary-form',
  templateUrl: './edit-primary-form.component.html',
  styleUrls: ['./edit-primary-form.component.css'],
})
export class EditPrimaryFormComponent implements OnInit {
  @Output('closeEditModal') closeEditModal: EventEmitter<any> =
    new EventEmitter<any>();
  @Output('isFormDetailsReady') isFormDetailsReady: EventEmitter<boolean> =
    new EventEmitter<boolean>();

  public primaryDetailForm: FormGroup;
  public campaingsData: CampaignsDTO[] = [];
  public leadSourcesData: LeadSourceDto[] = [];
  public occupationsData: OccupationDTO[] = [];

  public primaryDetails: any;
  public extras: Extras;
  public errorOccurred = false;
  public errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private datePipe: DatePipe,
    private campaignService: CampaignsService,
    private leadService: LeadsService,
    private occupationServive: OccupationService,
    private globalMessagingService: GlobalMessagingService
  ) {}

  ngOnInit(): void {
    this.CreatePrimaryDetailForm();
    this.fetchCampaigns();
    this.fetchLeadSources();
    this.fetchOccupations();
  }

  ngOnDestroy(): void {}

  CreatePrimaryDetailForm() {
    this.primaryDetailForm = this.fb.group({
      campaingName: [''],
      leadSource: [''],
      occupation: [''],
      date: [''],
    });
  }

  fetchCampaigns() {
    this.campaignService
      .getCampaigns()
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (data) => {
          if (data) {
            this.campaingsData = data;
            log.info(`Fetched Campaigns Data`, this.campaingsData);
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
          this.errorMessage = err?.error;
          this.globalMessagingService.displayErrorMessage(
            'Error',
            this.errorMessage
          );
          log.info(`error >>>`, err);
        },
      });
  }

  fetchLeadSources() {
    this.leadService
      .getLeadSources()
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (data) => {
          if (data) {
            this.leadSourcesData = data;
            log.info('Fetch Lead Sources', this.leadSourcesData);
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

  fetchOccupations(organizationId?: number) {
    this.occupationServive
      .getOccupations(organizationId)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (data) => {
          if (data) {
            this.occupationsData = data;
            log.info(`Fetched Occuption Data`, this.occupationsData);
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

  prepareUpdateDetails(primaryDetails: any, extras: Extras): void {
    this.primaryDetails = primaryDetails;
    this.extras = extras;
    log.info(`Primary Details for Edit`, this.primaryDetails);
    const occupationId = this.occupationsData.find(
      (occupation) => occupation.name === this.primaryDetails.occupation
    )?.id;
    this.primaryDetailForm.patchValue({
      campaingName: this.primaryDetails.campaingName,
      leadSource: this.primaryDetails.leadSource,
      occupation: occupationId || null,
      date: this.primaryDetails.date,
    });
    this.isFormDetailsReady.emit(true);
    this.cdr.detectChanges();
  }

  updateDetails(): void {
    const formValues = this.primaryDetailForm.getRawValue();

    const selectedOccupation = this.occupationsData.find(
      (occupation) => occupation.id === formValues.occupation
    );

    const occupation = selectedOccupation ? selectedOccupation.name : null;

    const updatePrimaryDetails = {
      campCode: formValues.campaingName,
      leadSource: formValues.leadSource,
      occupation: occupation,
      leadDate: formValues.date,
    };

    log.info(`Primary Details to be Updated`, updatePrimaryDetails);
    this.leadService
      .updateLead(updatePrimaryDetails, this.extras.leadId)
      .subscribe({
        next: (res) => {
          this.globalMessagingService.displaySuccessMessage(
            'Success',
            'Successfully Updated Primary Details'
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
