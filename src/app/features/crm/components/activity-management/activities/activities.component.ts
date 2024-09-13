import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MandatoryFieldsService } from '../../../../../shared/services/mandatory-fields/mandatory-fields.service';
import { GlobalMessagingService } from '../../../../../shared/services/messaging/global-messaging.service';
import { Logger } from '../../../../../shared/services';
import { StaffDto } from '../../../../entities/data/StaffDto';
import { untilDestroyed } from '../../../../../shared/services/until-destroyed';
import { CampaignsService } from '../../../services/campaigns..service';
import { Activity } from '../../../data/activity';
import { ActivityService } from '../../../services/activity.service';

const log = new Logger('ActivitiesComponent');
@Component({
  selector: 'app-activities',
  templateUrl: './activities.component.html',
  styleUrls: ['./activities.component.css'],
})
export class ActivitiesComponent implements OnInit {
  pageSize: 5;
  activityData: Activity[];
  selectedActivity: any[] = [];
  notesAndAttachmentsData: any[];
  selectedNotes: any[] = [];
  tasksData: any[];
  selectedTask: any[] = [];
  partipantsData: any[];
  selectedParticipant: any[] = [];

  editMode: boolean = false;
  createActivityForm: FormGroup;
  createNoteForm: FormGroup;
  createTaskForm: FormGroup;

  visibleStatus: any = {
    subject: 'Y',
    activityType: 'Y',
    description: 'Y',
    location: 'Y',
    assignedTo: 'Y',
    relatedAccount: 'Y',
    startDate: 'Y',
    endDate: 'Y',
    duration: 'Y',
    status: 'Y',
    team: 'Y',
    emailTemplate: 'Y',
    sendReminder: 'Y',
    //
    noteSubject: 'Y',
    relateTo: 'Y',
    noteDescription: 'Y',
    attachment: 'Y',
    //
    taskSubject: 'Y',
    taskStartDate: 'Y',
    taskEndDate: 'Y',
    taskRelatedTo: 'Y',
    priority: 'Y',
  };

  url = '';
  selectedFile: File;
  allUsersModalVisible: boolean = false;
  showDefaultUser: boolean = false;
  selectedMainUser: StaffDto;
  zIndex = 1;
  firstModalZIndex = 2;

  groupId: string = 'activityMngtActivityTab';
  groupIdNote: string = 'activityMngtNoteTab';
  groupIdTask: string = 'activityMngtTaskTab';

  constructor(
    private fb: FormBuilder,
    private mandatoryFieldsService: MandatoryFieldsService,
    private globalMessagingService: GlobalMessagingService,
    private cdr: ChangeDetectorRef,
    private activityService: ActivityService
  ) {}

  ngOnInit(): void {
    this.activityCreateForm();
    this.noteCreateForm();
    this.taskCreateForm();
    this.getActivities();
  }

  /* The `activityCreateForm()` function is responsible for setting up the form controls */
  activityCreateForm() {
    this.createActivityForm = this.fb.group({
      subject: [''],
      activityType: [''],
      description: [''],
      location: [''],
      assignedTo: [''],
      relatedAccount: [''],
      startDate: [''],
      endDate: [''],
      duration: [''],
      status: [''],
      team: [''],
      emailTemplate: [''],
      sendReminder: [''],
      reminderTime: [''],
    });
    this.mandatoryFieldsService
      .getMandatoryFieldsByGroupId(this.groupId)
      .pipe(untilDestroyed(this))
      .subscribe((response) => {
        response.forEach((field) => {
          for (const key of Object.keys(this.createActivityForm.controls)) {
            this.visibleStatus[field.frontedId] = field.visibleStatus;
            if (field.visibleStatus === 'Y') {
              if (key === field.frontedId && field.mandatoryStatus === 'Y') {
                this.createActivityForm.controls[key].addValidators(
                  Validators.required
                );
                this.createActivityForm.controls[key].updateValueAndValidity();
                const label = document.querySelector(
                  `label[for=${field.frontedId}]`
                );
                if (label) {
                  const asterisk = document.createElement('span');
                  asterisk.innerHTML = ' *';
                  asterisk.style.color = 'red';
                  label.appendChild(asterisk);
                }
              }
            }
          }
        });
        this.cdr.detectChanges();
      });
  }

  /* The `noteCreateForm()` function is responsible for setting up the form controls for creating a
  note. */
  noteCreateForm() {
    this.createNoteForm = this.fb.group({
      noteSubject: [''],
      relateTo: [''],
      noteDescription: [''],
      attachment: [''],
    });
    this.mandatoryFieldsService
      .getMandatoryFieldsByGroupId(this.groupIdNote)
      .pipe(untilDestroyed(this))
      .subscribe((response) => {
        response.forEach((field) => {
          for (const key of Object.keys(this.createNoteForm.controls)) {
            this.visibleStatus[field.frontedId] = field.visibleStatus;
            if (field.visibleStatus === 'Y') {
              if (key === field.frontedId && field.mandatoryStatus === 'Y') {
                this.createNoteForm.controls[key].addValidators(
                  Validators.required
                );
                this.createNoteForm.controls[key].updateValueAndValidity();
                const label = document.querySelector(
                  `label[for=${field.frontedId}]`
                );
                if (label) {
                  const asterisk = document.createElement('span');
                  asterisk.innerHTML = ' *';
                  asterisk.style.color = 'red';
                  label.appendChild(asterisk);
                }
              }
            }
          }
        });
        this.cdr.detectChanges();
      });
  }

  /* The `taskCreateForm()` function in the provided TypeScript code is responsible for setting up the
  form controls for creating a task. */
  taskCreateForm() {
    this.createTaskForm = this.fb.group({
      taskSubject: [''],
      taskStartDate: [''],
      taskEndDate: [''],
      taskRelatedTo: [''],
      priority: [''],
    });
    this.mandatoryFieldsService
      .getMandatoryFieldsByGroupId(this.groupIdTask)
      .pipe(untilDestroyed(this))
      .subscribe((response) => {
        response.forEach((field) => {
          for (const key of Object.keys(this.createTaskForm.controls)) {
            this.visibleStatus[field.frontedId] = field.visibleStatus;
            if (field.visibleStatus === 'Y') {
              if (key === field.frontedId && field.mandatoryStatus === 'Y') {
                this.createTaskForm.controls[key].addValidators(
                  Validators.required
                );
                this.createTaskForm.controls[key].updateValueAndValidity();
                const label = document.querySelector(
                  `label[for=${field.frontedId}]`
                );
                if (label) {
                  const asterisk = document.createElement('span');
                  asterisk.innerHTML = ' *';
                  asterisk.style.color = 'red';
                  label.appendChild(asterisk);
                }
              }
            }
          }
        });
        this.cdr.detectChanges();
      });
  }

  /**
   * The function returns the controls of a form named createActivityForm.
   */
  get g() {
    return this.createActivityForm.controls;
  }

  /**
   * The function returns the controls of a form named createNoteForm.
   */
  get f() {
    return this.createNoteForm.controls;
  }

  /**
   * The function returns the controls of a createTaskForm in TypeScript.
   */
  get h() {
    return this.createTaskForm.controls;
  }

  /**
   * The function `openDefineActivityModal` displays a modal with the id 'newActivity' by adding a
   * 'show' class and setting its display style to 'block'.
   */
  openDefineActivityModal() {
    const modal = document.getElementById('newActivity');
    if (modal) {
      modal.classList.add('show');
      modal.style.display = 'block';
    }
  }

  /**
   * The function `closeDefineActivityModal` sets `editMode` to false and hides the modal with the id
   * 'newActivity'.
   */
  closeDefineActivityModal() {
    this.editMode = false;
    const modal = document.getElementById('newActivity');
    if (modal) {
      modal.classList.remove('show');
      modal.style.display = 'none';
    }
  }

  /**
   * The function `openDefineNoteModal` displays a modal with the id 'newNote' by adding a 'show' class
   * and setting its display property to 'block'.
   */
  openDefineNoteModal() {
    const modal = document.getElementById('newNote');
    if (modal) {
      modal.classList.add('show');
      modal.style.display = 'block';
    }
  }

  /**
   * The function `closeDefineNoteModal` sets `editMode` to false and hides the modal with the id
   * 'newNote'.
   */
  closeDefineNoteModal() {
    this.editMode = false;
    const modal = document.getElementById('newNote');
    if (modal) {
      modal.classList.remove('show');
      modal.style.display = 'none';
    }
  }

  /**
   * The function `openDefineTaskModal` displays a modal with the id 'newTask' by adding a 'show' class
   * and setting its display style to 'block'.
   */
  openDefineTaskModal() {
    const modal = document.getElementById('newTask');
    if (modal) {
      modal.classList.add('show');
      modal.style.display = 'block';
    }
  }

  /**
   * The function `closeDefineTaskModal` sets `editMode` to false and hides the modal with the id
   * 'newTask'.
   */
  closeDefineTaskModal() {
    this.editMode = false;
    const modal = document.getElementById('newTask');
    if (modal) {
      modal.classList.remove('show');
      modal.style.display = 'none';
    }
  }

  /**
   * The `editActivity` function toggles the edit mode and opens a modal for defining an activity.
   */
  editActivity() {
    this.editMode = !this.editMode;
    this.openDefineActivityModal();
  }

  /**
   * The `editNote` function toggles the edit mode and opens a modal for defining a note.
   */
  editNote() {
    this.editMode = !this.editMode;
    this.openDefineNoteModal();
  }

  /**
   * The `editTask` function toggles the edit mode and opens a modal to define a task.
   */
  editTask() {
    this.editMode = !this.editMode;
    this.openDefineTaskModal();
  }

  /**
   * The function `onFileChange` reads a selected file using FileReader and updates the URL with the
   * file's data.
   * @param event - The `event` parameter in the `onFileChange` function represents the event that is
   * triggered when a file input field's value changes. It contains information about the selected
   * file, such as its name, size, type, and the actual file data.
   */
  onFileChange(event) {
    if (event.target.files) {
      var reader = new FileReader();
      this.selectedFile = event.target.files[0];
      reader.readAsDataURL(event.target.files[0]);
      reader.onload = (event: any) => {
        this.url = event.target.result;
        this.cdr.detectChanges();
        log.info(this.url);
      };
    }
  }

  /**
   * The function `openAllUsersModal` sets the `zIndex` to -1 and toggles the visibility of the all
   * users modal.
   */
  openAllUsersModal() {
    this.zIndex = -1;
    this.toggleAllUsersModal(true);
  }

  /**
   * The function `toggleAllUsersModal` sets the visibility of the all users modal based on the
   * `display` parameter.
   */
  private toggleAllUsersModal(display: boolean) {
    this.allUsersModalVisible = display;
  }

  /**
   * The function `processSelectedUser` toggles a modal and sets the zIndex property to 1.
   */
  processSelectedUser($event: void) {
    this.toggleAllUsersModal(false);
    this.zIndex = 1;
  }

  getSelectedUser(event: StaffDto) {
    this.selectedMainUser = event;
    this.showDefaultUser = this.selectedMainUser?.userType === 'G';
    /*this.debtOwnerForm.patchValue({
      modalUserAssignTo: event?.username
    });*/
    log.info('user>', event);
  }

  getActivities(): void {
    this.activityService.getActivities().subscribe({
      next: (data) => {
        this.activityData = data;
        log.info(`Activity data >>> `, data);
      },
      error: (err) => {},
    });
  }

  createActivity(): void {
    const formValues = this.createActivityForm.getRawValue();
    log.info(`form values >>> `, formValues);
  }

  ngOnDestroy(): void {}
}
