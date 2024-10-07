import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MandatoryFieldsService } from '../../../../../shared/services/mandatory-fields/mandatory-fields.service';
import { GlobalMessagingService } from '../../../../../shared/services/messaging/global-messaging.service';
import { Logger } from '../../../../../shared/services';
import { StaffDto } from '../../../../entities/data/StaffDto';
import { untilDestroyed } from '../../../../../shared/services/until-destroyed';
import {
  Activity,
  ActivityNote,
  ActivityParticipant,
  ActivityStatus,
  ActivityTask,
  ActivityType,
  PriorityLevel,
} from '../../../data/activity';
import { ActivityService } from '../../../services/activity.service';
import { MessagingService } from '../../../services/messaging.service';
import { MessageTemplate } from '../../../data/messaging-template';
import { StaffModalComponent } from '../../../../entities/components/staff/staff-modal/staff-modal.component';
import { ClientDTO } from '../../../../entities/data/ClientDTO';
import { ServiceProviderDTO } from '../../../../entities/data/ServiceProviderDTO';
import { ClientService } from '../../../../entities/services/client/client.service';

const log = new Logger('ActivitiesComponent');
@Component({
  selector: 'app-activities',
  templateUrl: './activities.component.html',
  styleUrls: ['./activities.component.css'],
})
export class ActivitiesComponent implements OnInit {
  @ViewChild('closeDeleteButton') closeDeleteButton;
  @ViewChild('staffModal') staffModal: StaffModalComponent;

  pageSize: 5;
  activityData: Activity[];
  selectedActivity: Activity;
  notesAndAttachmentsData: ActivityNote[];
  selectedNote: ActivityNote;
  tasksData: ActivityTask[];
  selectedTask: ActivityTask;
  participantsData: ActivityParticipant[];
  selectedParticipant: ActivityParticipant;

  accountData;
  selectedAccount;
  selectedUserType: string;

  first = 0;
  rows = 10;
  pageNumber: number = 0;
  loading: boolean = false;

  editMode: boolean = false;
  activityForm: FormGroup;
  noteForm: FormGroup;
  taskForm: FormGroup;

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
  selectedMainUser: StaffDto | ClientDTO | ServiceProviderDTO;
  zIndex = 1;
  firstModalZIndex = 2;

  groupId: string = 'activityMngtActivityTab';
  groupIdNote: string = 'activityMngtNoteTab';
  groupIdTask: string = 'activityMngtTaskTab';

  activityTypes: ActivityType[];
  activityStatuses: ActivityStatus[];
  priorityLevels: PriorityLevel[];

  userField: string;
  userFormFields = {
    assignedTo: null,
    relatedAccount: null,
    team: null,
    relateTo: null,
    taskRelatedTo: null,
    participant: null,
  };

  isDataReady = {
    activities: false,
    notes: false,
    tasks: false,
    participants: false,
  };

  activityText: string;

  messageTemplates: MessageTemplate[];

  constructor(
    private fb: FormBuilder,
    private mandatoryFieldsService: MandatoryFieldsService,
    private globalMessagingService: GlobalMessagingService,
    private cdr: ChangeDetectorRef,
    private activityService: ActivityService,
    private messagingService: MessagingService,
    private clientService: ClientService
  ) {}

  ngOnInit(): void {
    this.getActivityStatuses();
    this.getEmailTemplates();
    this.getActivityParticipants();
    this.getActivityTypes();
    this.getActivityNotes();
    this.getActivityTasks();
    this.getActivities();
    this.getPriorityLevels();
    this.activityCreateForm();
    this.noteCreateForm();
    this.taskCreateForm();
  }

  getEmailTemplates(): void {
    this.messagingService.getMessageTemplates(0, 50, 37).subscribe({
      next: (res) => {
        this.messageTemplates = res.content;
      },
      error: (err) => {
        let errorMessage = err?.error?.message ?? err.message;
        this.globalMessagingService.displayErrorMessage('Error', errorMessage);
      },
    });
  }

  getActivityTypes(): void {
    this.activityService.getActivityTypes().subscribe({
      next: (res) => {
        this.activityTypes = res;
      },
      error: (err) => {
        let errorMessage = err?.error?.message ?? err.message;
        this.globalMessagingService.displayErrorMessage('Error', errorMessage);
      },
    });
  }

  getActivityStatuses(): void {
    this.activityService.getActivityStatuses().subscribe({
      next: (res) => {
        this.activityStatuses = res;
      },
      error: (err) => {
        let errorMessage = err?.error?.message ?? err.message;
        this.globalMessagingService.displayErrorMessage('Error', errorMessage);
      },
    });
  }

  getPriorityLevels(): void {
    this.activityService.getPriorityLevels().subscribe({
      next: (res) => {
        this.priorityLevels = res;
      },
      error: (err) => {
        let errorMessage = err?.error?.message ?? err.message;
        this.globalMessagingService.displayErrorMessage('Error', errorMessage);
      },
    });
  }

  /* The `activityCreateForm()` function is responsible for setting up the form controls */
  activityCreateForm() {
    this.activityForm = this.fb.group({
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
          for (const key of Object.keys(this.activityForm.controls)) {
            this.visibleStatus[field.frontedId] = field.visibleStatus;
            if (field.visibleStatus === 'Y') {
              if (key === field.frontedId && field.mandatoryStatus === 'Y') {
                this.activityForm.controls[key].addValidators(
                  Validators.required
                );
                this.activityForm.controls[key].updateValueAndValidity();
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
    this.noteForm = this.fb.group({
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
          for (const key of Object.keys(this.noteForm.controls)) {
            this.visibleStatus[field.frontedId] = field.visibleStatus;
            if (field.visibleStatus === 'Y') {
              if (key === field.frontedId && field.mandatoryStatus === 'Y') {
                this.noteForm.controls[key].addValidators(Validators.required);
                this.noteForm.controls[key].updateValueAndValidity();
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
    this.taskForm = this.fb.group({
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
          for (const key of Object.keys(this.taskForm.controls)) {
            this.visibleStatus[field.frontedId] = field.visibleStatus;
            if (field.visibleStatus === 'Y') {
              if (key === field.frontedId && field.mandatoryStatus === 'Y') {
                this.taskForm.controls[key].addValidators(Validators.required);
                this.taskForm.controls[key].updateValueAndValidity();
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
    return this.activityForm.controls;
  }

  /**
   * The function returns the controls of a form named createNoteForm.
   */
  get f() {
    return this.noteForm.controls;
  }

  /**
   * The function returns the controls of a createTaskForm in TypeScript.
   */
  get h() {
    return this.taskForm.controls;
  }

  /**
   * The function `openDefineActivityModal` displays a modal with the id 'newActivity' by adding a
   * 'show' class and setting its display style to 'block'.
   */
  openDefineActivityModal(action?: string) {
    const modal = document.getElementById('newActivity');
    if (modal) {
      modal.classList.add('show');
      modal.style.display = 'block';
    }

    action === 'add' ? this.activityForm.reset() : '';
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
    this.activityForm.patchValue({
      subject: this.selectedActivity?.subject,
      activityType: this.selectedActivity?.activityTypeCode,
      description: this.selectedActivity?.desc,
      location: this.selectedActivity?.location,
      assignedTo: this.selectedActivity?.user?.name,
      relatedAccount: this.selectedActivity?.participant?.name,
      startDate: this.selectedActivity?.wet,
      endDate: this.selectedActivity?.wef,
      duration: this.selectedActivity?.duration,
      status: this.selectedActivity?.statusId,
      team: this.selectedActivity?.team,
      emailTemplate: this.selectedActivity?.messageCode,
      sendReminder: this.selectedActivity?.reminder,
      reminderTime: this.selectedActivity?.reminderTime,
    });
    this.openDefineActivityModal('edit');
  }

  /**
   * The `editNote` function toggles the edit mode and opens a modal for defining a note.
   */
  editNote() {
    this.editMode = !this.editMode;
    this.noteForm.patchValue({
      noteSubject: this.selectedNote.subject,
      relateTo: this.selectedNote.participant?.name,
      noteDescription: this.selectedNote.notes,
      attachment: this.selectedNote.attachment,
    });
    this.openDefineNoteModal();
  }

  /**
   * The `editTask` function toggles the edit mode and opens a modal to define a task.
   */
  editTask() {
    this.editMode = !this.editMode;
    this.taskForm.patchValue({
      taskSubject: this.selectedTask.subject,
      taskStartDate: this.selectedTask.dateFrom,
      taskEndDate: this.selectedTask.dateTo,
      taskRelatedTo: this.selectedTask.participant?.name,
      priority: this.selectedTask.priorityCode,
    });
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
  openAllUsersModal(userField?: string) {
    this.userField = userField;
    switch (userField) {
      case 'assignedTo':
        this.selectedUserType = UserType.USER;
        this.staffModal.fetchAccountByAccountType(UserType.USER);
        break;
      case 'relatedAccount':
      case 'relateTo':
      case 'taskRelatedTo':
        this.selectedUserType = UserType.AGENT;
        this.staffModal.fetchAccountByAccountType(UserType.AGENT);
        break;
      case 'team':
        this.selectedUserType = UserType.GROUP;
        this.staffModal.fetchAccountByAccountType(UserType.GROUP);
        break;
      default:
    }
    this.cdr.detectChanges();

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

  getSelectedUser(event: StaffDto | ClientDTO | ServiceProviderDTO) {
    this.selectedMainUser = event;
    // this.showDefaultUser = this.selectedMainUser?.userType === 'G';
    /*this.debtOwnerForm.patchValue({
      modalUserAssignTo: event?.username
    });*/
    this.patchUserToFormField(event);
    log.info(`selected user >>. `, this.selectedMainUser);
  }

  patchUserToFormField(user: StaffDto | ClientDTO | ServiceProviderDTO): void {
    let username: string;
    switch (this.userField) {
      case 'assignedTo':
        this.userFormFields.assignedTo = this.selectedMainUser;
        this.activityForm.patchValue({
          assignedTo: this.userFormFields.assignedTo?.name,
        });
        break;
      case 'relatedAccount':
        this.userFormFields.relatedAccount = this.selectedMainUser;
        username =
          this.userFormFields.relatedAccount.name ||
          this.userFormFields.relatedAccount.username ||
          this.userFormFields.relatedAccount.firstName;
        this.activityForm.patchValue({
          relatedAccount: username,
        });
        break;
      case 'taskRelatedTo':
        this.userFormFields.taskRelatedTo = this.selectedMainUser;
        username =
          this.userFormFields.taskRelatedTo.name ||
          this.userFormFields.taskRelatedTo.username ||
          this.userFormFields.taskRelatedTo.firstName;
        this.taskForm.patchValue({
          taskRelatedTo: username,
        });
        break;
      case 'team':
        this.userFormFields.team = this.selectedMainUser;
        this.activityForm.patchValue({
          team: this.userFormFields.team?.name,
        });
        break;
      case 'relateTo':
        this.userFormFields.relateTo = this.selectedMainUser;
        username =
          this.userFormFields.relateTo.name ||
          this.userFormFields.relateTo.username ||
          this.userFormFields.relateTo.firstName;
        this.noteForm.patchValue({
          relateTo: username,
        });
        break;
      case 'participant':
        this.userFormFields.participant = this.selectedMainUser;
        this.createUpdateActivityParticipant();
        break;
      default:
      // code block
    }
  }

  getActivities(): void {
    this.isDataReady.activities = false;
    this.activityService.getActivities().subscribe({
      next: (data) => {
        this.activityData = data;
        this.isDataReady.activities = true;
        this.cdr.detectChanges();
      },
      error: (err) => {
        let errorMessage = err?.error?.message ?? err.message;
        this.globalMessagingService.displayErrorMessage('Error', errorMessage);
        this.isDataReady.activities = true;
      },
    });
  }

  createUpdateActivity(): void {
    const formValues = this.activityForm.getRawValue();

    const assignedTo =
      this.userFormFields?.assignedTo?.id !== undefined
        ? this.userFormFields?.assignedTo?.id
        : this.selectedActivity?.user?.id;

    const relatedTo =
      this.userFormFields?.relatedAccount?.id !== undefined
        ? this.userFormFields?.relatedAccount?.id
        : this.selectedActivity?.participant?.id;

    const activity: Activity = {
      id: this.selectedActivity?.id || null,
      activityTypeCode: formValues.activityType,
      wef: formValues.startDate,
      wet: formValues.endDate,
      duration: formValues.duration,
      subject: formValues.subject,
      location: formValues.location,
      assignedTo,
      relatedTo,
      statusId: formValues.status,
      desc: formValues.description,
      reminder: formValues.reminder,
      team: this.userFormFields?.team?.id,
      reminderTime: formValues.reminderTime,
      messageCode: formValues.emailTemplate,
    };

    if (!this.editMode) {
      this.createActivity(activity);
    } else {
      this.updateActivity(activity);
    }
  }

  createActivity(activity: Activity): void {
    this.activityService.createActivity(activity).subscribe({
      next: (res) => {
        this.globalMessagingService.displaySuccessMessage(
          'Success',
          'Activity created successfully!'
        );
        this.getActivities();
        this.closeDefineActivityModal();
      },
      error: (err) => {
        let errorMessage = err?.error?.message ?? err.message;
        this.globalMessagingService.displayErrorMessage('Error', errorMessage);
      },
    });
  }

  updateActivity(activity: Activity): void {
    this.activityService.updateActivity(activity).subscribe({
      next: (res) => {
        this.globalMessagingService.displaySuccessMessage(
          'Success',
          'Activity updated successfully!'
        );
        this.getActivities();
        this.closeDefineActivityModal();
      },
      error: (err) => {
        let errorMessage = err?.error?.message ?? err.message;
        this.globalMessagingService.displayErrorMessage('Error', errorMessage);
      },
    });
  }

  confirmDeleteActivity(): void {
    const id = this.selectedActivity.id;

    this.activityService.deleteActivity(id).subscribe({
      next: (res) => {
        this.globalMessagingService.displaySuccessMessage(
          'Success',
          'Activity deleted successfully!'
        );
        this.getActivities();
        this.closeDeleteButton.nativeElement.click();
      },
      error: (err) => {
        let errorMessage = err?.error?.message ?? err.message;
        this.globalMessagingService.displayErrorMessage('Error', errorMessage);
        this.closeDeleteButton.nativeElement.click();
      },
    });
  }

  getActivityTasks(): void {
    this.isDataReady.tasks = false;
    this.activityService.getActivityTasks().subscribe({
      next: (data) => {
        this.tasksData = data;
        this.isDataReady.tasks = true;
        this.cdr.detectChanges();
      },
      error: (err) => {
        let errorMessage = err?.error?.message ?? err.message;
        this.globalMessagingService.displayErrorMessage('Error', errorMessage);
        this.isDataReady.tasks = true;
      },
    });
  }

  createUpdateActivityTask(): void {
    const formValues = this.taskForm.getRawValue();

    const accCode = this.selectedMainUser?.id
      ? this.selectedMainUser?.id
      : this.selectedNote?.accCode;

    const activityTask: ActivityTask = {
      id: this.selectedTask?.id || null,
      actCode: formValues.actCode,
      dateFrom: formValues.taskStartDate,
      dateTo: formValues.taskEndDate,
      subject: formValues.taskSubject,
      statusId: formValues.statusId,
      priorityCode: formValues.priority,
      accCode,
    };

    if (!this.editMode) {
      this.createActivityTask(activityTask);
    } else {
      this.updateActivityTask(activityTask);
    }
  }

  createActivityTask(activityTask: ActivityTask): void {
    this.activityService.createActivityTask(activityTask).subscribe({
      next: (res) => {
        this.globalMessagingService.displaySuccessMessage(
          'Success',
          'Activity Task created successfully!'
        );
        this.getActivityTasks();
        this.closeDefineTaskModal();
      },
      error: (err) => {
        let errorMessage = err?.error?.message ?? err.message;
        this.globalMessagingService.displayErrorMessage('Error', errorMessage);
      },
    });
  }

  updateActivityTask(activityTask: ActivityTask): void {
    this.activityService.updateActivityTask(activityTask).subscribe({
      next: (res) => {
        this.globalMessagingService.displaySuccessMessage(
          'Success',
          'Activity Task updated successfully!'
        );
        this.getActivityTasks();
        this.closeDefineTaskModal();
      },
      error: (err) => {
        let errorMessage = err?.error?.message ?? err.message;
        this.globalMessagingService.displayErrorMessage('Error', errorMessage);
      },
    });
  }

  confirmDeleteActivityTask(): void {
    const id = this.selectedTask?.id;

    this.activityService.deleteActivityTask(id).subscribe({
      next: (res) => {
        this.globalMessagingService.displaySuccessMessage(
          'Success',
          'Activity Task deleted successfully!'
        );
        this.getActivityTasks();
        this.closeDeleteButton.nativeElement.click();
      },
      error: (err) => {
        let errorMessage = err?.error?.message ?? err.message;
        this.globalMessagingService.displayErrorMessage('Error', errorMessage);
        this.closeDeleteButton.nativeElement.click();
      },
    });
  }

  getActivityNotes(): void {
    this.isDataReady.notes = false;
    this.activityService.getActivityNotes().subscribe({
      next: (data) => {
        this.notesAndAttachmentsData = data;
        this.isDataReady.notes = true;
        this.cdr.detectChanges();
      },
      error: (err) => {
        let errorMessage = err?.error?.message ?? err.message;
        this.globalMessagingService.displayErrorMessage('Error', errorMessage);
        this.isDataReady.notes = true;
      },
    });
  }

  createUpdateActivityNote(): void {
    const formValues = this.noteForm.getRawValue();
    const accCode = this.selectedMainUser?.id
      ? this.selectedMainUser?.id
      : this.selectedNote?.accCode;

    const activityNote: ActivityNote = {
      id: this.selectedNote?.id || null,
      accCode,
      contactCode: 0,
      subject: formValues.noteSubject,
      notes: formValues.noteDescription,
      attachment: formValues.attachment,
      actCode: 0,
      attachmentType: formValues.attachment,
      fileName: '',
    };

    if (!this.editMode) {
      this.createActivityNote(activityNote);
    } else {
      this.updateActivityNote(activityNote);
    }
  }

  createActivityNote(activityNote: ActivityNote): void {
    this.activityService.createActivityNote(activityNote).subscribe({
      next: (res) => {
        this.globalMessagingService.displaySuccessMessage(
          'Success',
          'Activity Note created successfully!'
        );
        this.getActivityNotes();
        this.closeDefineNoteModal();
      },
      error: (err) => {
        let errorMessage = err?.error?.message ?? err.message;
        this.globalMessagingService.displayErrorMessage('Error', errorMessage);
      },
    });
  }

  updateActivityNote(activityNote: ActivityNote): void {
    this.activityService.updateActivityNote(activityNote).subscribe({
      next: (res) => {
        this.globalMessagingService.displaySuccessMessage(
          'Success',
          'Activity Note updated successfully!'
        );
        this.getActivityNotes();
        this.closeDefineNoteModal();
      },
      error: (err) => {
        let errorMessage = err?.error?.message ?? err.message;
        this.globalMessagingService.displayErrorMessage('Error', errorMessage);
      },
    });
  }

  confirmDeleteActivityNote(): void {
    const id = this.selectedNote?.id;

    this.activityService.deleteActivityNote(id).subscribe({
      next: (res) => {
        this.globalMessagingService.displaySuccessMessage(
          'Success',
          'Activity Note deleted successfully!'
        );
        this.getActivityNotes();
        this.closeDeleteButton.nativeElement.click();
      },
      error: (err) => {
        let errorMessage = err?.error?.message ?? err.message;
        this.globalMessagingService.displayErrorMessage('Error', errorMessage);
        this.closeDeleteButton.nativeElement.click();
      },
    });
  }

  getActivityParticipants(): void {
    this.isDataReady.participants = false;
    this.activityService.getActivityParticipants().subscribe({
      next: (data) => {
        this.participantsData = data;
        this.isDataReady.participants = true;
        this.cdr.detectChanges();
      },
      error: (err) => {
        let errorMessage = err?.error?.message ?? err.message;
        this.globalMessagingService.displayErrorMessage('Error', errorMessage);
        this.isDataReady.participants = true;
      },
    });
  }

  createUpdateActivityParticipant(): void {
    const participant: ActivityParticipant = {
      id: null,
      aacCode: this.selectedMainUser.id,
      actCode: 0, //todo: confirm actual value
      // participant: {
      //   id: this.selectedMainUser.id,
      //   name: this.selectedMainUser.name,
      //   emailAddress: this.selectedMainUser.emailAddress,
      // },
    };
    this.createActivityParticipant(participant);
  }

  createActivityParticipant(participant: ActivityParticipant): void {
    this.activityService.createParticipant(participant).subscribe({
      next: (res) => {
        this.globalMessagingService.displaySuccessMessage(
          'Success',
          'Activity Participant created successfully!'
        );
        this.getActivityParticipants();
        // this.closeDefineActivityNoteModal();
      },
      error: (err) => {
        let errorMessage = err?.error?.message ?? err.message;
        this.globalMessagingService.displayErrorMessage('Error', errorMessage);
      },
    });
  }

  // updateActivityParticipant(participant: ActivityParticipant): void {
  //   this.activityService.updateParticipant(participant).subscribe({
  //     next: (res) => {
  //       this.globalMessagingService.displaySuccessMessage(
  //         'Success',
  //         'Activity Participant updated successfully!'
  //       );
  //       this.getActivityNotes();
  //       // this.closeDefineActivityNoteModal();
  //     },
  //     error: (err) => {
  //       let errorMessage = err?.error?.message ?? err.message;
  //       this.globalMessagingService.displayErrorMessage('Error', errorMessage);
  //     },
  //   });
  // }

  confirmDeleteActivityParticipant(): void {
    const id = this.selectedParticipant?.id;

    this.activityService.deleteParticipant(id).subscribe({
      next: (res) => {
        this.globalMessagingService.displaySuccessMessage(
          'Success',
          'Activity Participant deleted successfully!'
        );
        this.getActivityParticipants();
        this.closeDeleteButton.nativeElement.click();
      },
      error: (err) => {
        let errorMessage = err?.error?.message ?? err.message;
        this.globalMessagingService.displayErrorMessage('Error', errorMessage);
        this.closeDeleteButton.nativeElement.click();
      },
    });
  }

  prepareItemForDelete(activityType: string): void {
    this.activityText = activityType;
  }

  confirmDelete(activityType: string) {
    switch (activityType) {
      case ActivityText.ACTIVITY:
        this.confirmDeleteActivity();
        break;
      case ActivityText.NOTE:
        this.confirmDeleteActivityNote();
        break;
      case ActivityText.TASK:
        this.confirmDeleteActivityTask();
        break;
      case ActivityText.PARTICIPANT:
        this.confirmDeleteActivityParticipant();
        break;
      default:
      // this.activityText = '';
    }
  }

  ngOnDestroy(): void {}
}

enum ActivityText {
  ACTIVITY = 'activity',
  NOTE = 'note',
  TASK = 'task',
  PARTICIPANT = 'participant',
}

enum UserType {
  AGENT = 'AGENT',
  CLIENT = 'CLIENT',
  SERVICE_PROVIDER = 'SERVICE_PROVIDER',
  USER = 'USER',
  GROUP = 'GROUP',
}
