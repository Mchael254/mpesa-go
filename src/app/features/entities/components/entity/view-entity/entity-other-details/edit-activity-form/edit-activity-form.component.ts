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

@Component({
  selector: 'app-edit-activity-form',
  templateUrl: './edit-activity-form.component.html',
  styleUrls: ['./edit-activity-form.component.css'],
})
export class EditActivityFormComponent implements OnInit {
  @Output('closeEditModal') closeEditModal: EventEmitter<any> =
    new EventEmitter<any>();
  @Output('isFormDetailsReady') isFormDetailsReady: EventEmitter<boolean> =
    new EventEmitter<boolean>();

  public activityDetailForm: FormGroup;

  public activityDetails: any;

  constructor(
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private globalMessagingService: GlobalMessagingService
  ) {}

  ngOnInit(): void {
    this.isFormDetailsReady.emit(true);
  }

  prepareUpdateDetails(activityDetails: any, extras: Extras): void {}

  updateDetails(): void {
    this.isFormDetailsReady.emit(false);
  }
}
