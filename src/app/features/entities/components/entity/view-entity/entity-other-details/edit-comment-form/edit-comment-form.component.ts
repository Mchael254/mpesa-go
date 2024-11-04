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
import { Logger } from '../../../../../../../shared/services/logger/logger.service';
import { LeadsService } from '../../../../../../../features/crm/services/leads.service';

const log = new Logger('EditCommentFormComponent');

@Component({
  selector: 'app-edit-comment-form',
  templateUrl: './edit-comment-form.component.html',
  styleUrls: ['./edit-comment-form.component.css'],
})
export class EditCommentFormComponent implements OnInit {
  @Output('closeEditModal') closeEditModal: EventEmitter<any> =
    new EventEmitter<any>();
  @Output('isFormDetailsReady') isFormDetailsReady: EventEmitter<boolean> =
    new EventEmitter<boolean>();

  @Output('commentUpdated') commentUpdated: EventEmitter<boolean> =
    new EventEmitter<boolean>();

  public commentDetailForm: FormGroup;

  public commentDetails: any;
  public extras: Extras;

  constructor(
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private leadService: LeadsService,
    private globalMessagingService: GlobalMessagingService
  ) {}

  ngOnInit(): void {
    this.CreateCommentForm();
  }

  CreateCommentForm() {
    this.commentDetailForm = this.fb.group({
      comment: [''],
      date: [''],
      disposition: [''],
    });
  }

  initializeNewComment(extras: Extras): void {
    this.extras = extras;
    this.commentDetails = null;
    this.commentDetailForm.reset();
    this.isFormDetailsReady.emit(true);
    this.cdr.detectChanges();
    log.info(
      `Initialized form for new comment creation with extras`,
      this.extras
    );
  }

  prepareUpdateDetails(commentDetails: any, extras: Extras): void {
    this.extras = extras;
    this.commentDetails = commentDetails;
    log.info(`Leads Comment Details for Edit`, this.commentDetails);
    let formattedDate = null;
    if (this.commentDetails.date) {
      const dateObj = new Date(this.commentDetails.date);
      formattedDate = dateObj.toISOString().split('T');
    }
    this.commentDetailForm.patchValue({
      comment: this.commentDetails.comment,
      date: formattedDate,
      disposition: this.commentDetails.disposition,
    });
    this.isFormDetailsReady.emit(true);
    this.cdr.detectChanges();
  }

  updateDetails(): void {
    const formValues = this.commentDetailForm.getRawValue();
    const commentCode = this.commentDetails?.code;
    if (commentCode) {
      const updateCommentDetails = {
        code: commentCode,
        comment: formValues.comment,
        date: formValues.date,
        disposition: formValues.disposition,
        leadCode: this.commentDetails.leadCode,
        userCode: this.commentDetails.userCode,
      };
      log.info(`Other Details to Update`, updateCommentDetails);
      // Update existing comment
      this.leadService
        .updateLeadComment(commentCode, updateCommentDetails)
        .subscribe({
          next: (res) => {
            this.globalMessagingService.displaySuccessMessage(
              'Success',
              'Successfully Updated Comment Details'
            );
            this.closeEditModal.emit();
            this.commentUpdated.emit(true);
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
    } else {
      const commentDetails = {
        code: null,
        comment: formValues.comment,
        date: formValues.date,
        disposition: formValues.disposition,
        leadCode: this.extras.leadId,
        userCode: this.extras.userCode,
      };
      log.info(`Comment Details to Create`, commentDetails);
      // Create new comment
      this.leadService.createLeadComment(commentDetails).subscribe({
        next: (res) => {
          this.globalMessagingService.displaySuccessMessage(
            'Success',
            'Successfully Created Comment Details'
          );
          this.closeEditModal.emit();
          this.commentUpdated.emit(true);
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
}
