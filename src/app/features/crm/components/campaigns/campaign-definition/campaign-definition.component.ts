import {ChangeDetectorRef, Component, EventEmitter, OnInit, Output} from '@angular/core';
import {Logger} from "../../../../../shared/services";
import {GlobalMessagingService} from "../../../../../shared/services/messaging/global-messaging.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {MandatoryFieldsService} from "../../../../../shared/services/mandatory-fields/mandatory-fields.service";
import {untilDestroyed} from "../../../../../shared/services/until-destroyed";

const log = new Logger('CampaignDefinitionComponent');
@Component({
  selector: 'app-campaign-definition',
  templateUrl: './campaign-definition.component.html',
  styleUrls: ['./campaign-definition.component.css']
})
export class CampaignDefinitionComponent implements OnInit {
  products: any[];
  pageSize: 5;
  campaignTargetData: any[];
  selectedCampaignTarget: any[] = [];

  editMode: boolean = false;

  url = ""
  selectedFile: File;

  navigationLinks: any[] = [
    {
      id: 0,
      url: 'campaignDetails',
      title: 'Campaign details'
    },
    {
      id: 1,
      url: 'targets',
      title: 'Targets'
    },
    {
      id: 2,
      url: 'activities',
      title: 'Activities'
    },
    {
      id: 3,
      url: 'messages',
      title: 'Messages'
    },
    {
      id: 4,
      url: 'performance',
      title: 'Performance'
    }
  ];
  currentTab: any = this.navigationLinks[0];
  buttonText:string = 'Next';
  @Output() onClickSave: EventEmitter<any> = new EventEmitter<any>();
  basicData: any;

  createCampaignDefinitionForm: FormGroup;
  createCampaignActivityForm: FormGroup;
  createCampaignMessageForm: FormGroup;
  createTrackerUrlForm: FormGroup;

  visibleStatus: any = {
    name: 'Y',
    system: 'Y',
    description: 'Y',
    objective: 'Y',
    dateFrom: 'Y',
    dateTo: 'Y',
    executionTime: 'Y',
    assignedTo: 'Y',
    organization: 'Y',
    team: 'Y',
    currency: 'Y',
    budgetedCost: 'Y',
    actualCost: 'Y',
    expectedCost: 'Y',
    expectedRevenue: 'Y',
    sponsor: 'Y',
    campaignType: 'Y',
    status: 'Y',
    pageImpressions: 'Y',
    event: 'Y',
    venue: 'Y',
    products: 'Y',
  //
    subject: 'Y',
    activityDescription: 'Y',
    wef: 'Y',
    wet: 'Y',
    location: 'Y',
    type: 'Y',
  //
    msgCampaignType: 'Y',
    sendToAllOptions: 'Y',
    messagesSubject: 'Y',
    messagesContent: 'Y',
    image: 'Y',
    sendTestTo: 'Y',
  //
    trackerName: 'Y',
    trackerUrl: 'Y',
    trackerDescription: 'Y',
    optOut: 'Y'
  }
  groupId: string = 'campaignDefinitionTab';
  groupIdCampaignActivity: string = 'campaignActivityTab';
  groupIdCampaignMessages: string = 'campaignMessagesTab';
  groupIdCampaignTrackerUrl: string = 'campaignTrackerUrlTab';

  constructor(
    private globalMessagingService: GlobalMessagingService,
    private cdr: ChangeDetectorRef,
    private fb: FormBuilder,
    private mandatoryFieldsService: MandatoryFieldsService,
  ) {}

  ngOnInit(): void {
    this.products = [
      {
        name: 'Private motor',
        id: 1
      },
      {
        name: 'Marine cargo',
        id: 2
      },
      {
        name: 'test 3',
        id: 3
      }
    ];
    this.basicData = {
      labels: ['Jun 12', 'Jun 13', 'Jun 14', 'Jun 15', 'Jun 16', 'Jun 17', 'Jun 18', 'Jun 19', 'Jun 20'],
      datasets: [
        {
          label: 'Engagements',
          data: [550, 570, 600, 760, 800, 255, 250, 990, 0, 120]
        }
      ]
    };
    this.campaignDefinitionCreateForm();
    this.campaignActivityCreateForm();
    this.campaignMessageCreateForm();
    this.campaignTrackerUrlCreateForm();
  }

  /**
   * The function `campaignDefinitionCreateForm` creates a form with various fields and dynamically
   * adds validators and asterisks to mandatory fields based on response data.
   */
  campaignDefinitionCreateForm() {
    this.createCampaignDefinitionForm = this.fb.group({
      name: [''],
      system: [''],
      description: [''],
      objective: [''],
      dateFrom: [''],
      dateTo: [''],
      executionTime: [''],
      assignedTo: [''],
      organization: [''],
      team: [''],
      currency: [''],
      budgetedCost: [''],
      actualCost: [''],
      expectedCost: [''],
      expectedRevenue: [''],
      sponsor: [''],
      campaignType: [''],
      status: [''],
      pageImpressions: [''],
      event: [''],
      venue: [''],
      products: ['']
    });
    this.mandatoryFieldsService.getMandatoryFieldsByGroupId(this.groupId).pipe(
      untilDestroyed(this)
    )
      .subscribe((response) =>{
        response.forEach((field) =>{
          for (const key of Object.keys(this.createCampaignDefinitionForm.controls)) {
            this.visibleStatus[field.frontedId] = field.visibleStatus;
            if (field.visibleStatus === 'Y') {
              if (key === field.frontedId && field.mandatoryStatus === 'Y'){
                this.createCampaignDefinitionForm.controls[key].addValidators(Validators.required);
                this.createCampaignDefinitionForm.controls[key].updateValueAndValidity();
                const label = document.querySelector(`label[for=${field.frontedId}]`);
                if (label) {
                  const asterisk = document.createElement('span');
                  asterisk.innerHTML = ' *';
                  asterisk.style.color = 'red';
                  label.appendChild(asterisk);
                }
              }
            }
          }
        })
        this.cdr.detectChanges();
      });
  }

  /**
   * The `campaignActivityCreateForm` function creates a form with specific fields and adds validators
   * for mandatory fields based on response data.
   */
  campaignActivityCreateForm() {
    this.createCampaignActivityForm = this.fb.group({
      subject: [''],
      activityDescription: [''],
      wef: [''],
      wet: [''],
      location: [''],
      type: ['']
    });
    this.mandatoryFieldsService.getMandatoryFieldsByGroupId(this.groupIdCampaignActivity).pipe(
      untilDestroyed(this)
    )
      .subscribe((response) =>{
        response.forEach((field) =>{
          for (const key of Object.keys(this.createCampaignActivityForm.controls)) {
            this.visibleStatus[field.frontedId] = field.visibleStatus;
            if (field.visibleStatus === 'Y') {
              if (key === field.frontedId && field.mandatoryStatus === 'Y'){
                this.createCampaignActivityForm.controls[key].addValidators(Validators.required);
                this.createCampaignActivityForm.controls[key].updateValueAndValidity();
                const label = document.querySelector(`label[for=${field.frontedId}]`);
                if (label) {
                  const asterisk = document.createElement('span');
                  asterisk.innerHTML = ' *';
                  asterisk.style.color = 'red';
                  label.appendChild(asterisk);
                }
              }
            }
          }
        })
        this.cdr.detectChanges();
      });
  }

  /** This method `campaignMessageCreateForm` which is used to create a
  *   form for creating campaign messages and adds validators for mandatory fields based on response data.
  */
  campaignMessageCreateForm() {
    this.createCampaignMessageForm = this.fb.group({
      msgCampaignType: [''],
      sendToAllOptions: [''],
      messagesSubject: [''],
      messagesContent: [''],
      image: [''],
      sendTestTo: ['']
    });
    this.mandatoryFieldsService.getMandatoryFieldsByGroupId(this.groupIdCampaignMessages).pipe(
      untilDestroyed(this)
    )
      .subscribe((response) =>{
        response.forEach((field) =>{
          for (const key of Object.keys(this.createCampaignMessageForm.controls)) {
            this.visibleStatus[field.frontedId] = field.visibleStatus;
            if (field.visibleStatus === 'Y') {
              if (key === field.frontedId && field.mandatoryStatus === 'Y'){
                this.createCampaignMessageForm.controls[key].addValidators(Validators.required);
                this.createCampaignMessageForm.controls[key].updateValueAndValidity();
                const label = document.querySelector(`label[for=${field.frontedId}]`);
                if (label) {
                  const asterisk = document.createElement('span');
                  asterisk.innerHTML = ' *';
                  asterisk.style.color = 'red';
                  label.appendChild(asterisk);
                }
              }
            }
          }
        })
        this.cdr.detectChanges();
      });
  };

  /**
   * The function `campaignTrackerUrlCreateForm` creates a form with fields based on response data,
   * sets validators for mandatory fields, and updates the form's visibility accordingly.
   */
  campaignTrackerUrlCreateForm() {
    this.createTrackerUrlForm = this.fb.group({
      trackerName: [''],
      trackerUrl: [''],
      trackerDescription: [''],
      optOut: ['']
    });
    this.mandatoryFieldsService.getMandatoryFieldsByGroupId(this.groupIdCampaignTrackerUrl).pipe(
      untilDestroyed(this)
    )
      .subscribe((response) =>{
        response.forEach((field) =>{
          for (const key of Object.keys(this.createTrackerUrlForm.controls)) {
            this.visibleStatus[field.frontedId] = field.visibleStatus;
            if (field.visibleStatus === 'Y') {
              if (key === field.frontedId && field.mandatoryStatus === 'Y'){
                this.createTrackerUrlForm.controls[key].addValidators(Validators.required);
                this.createTrackerUrlForm.controls[key].updateValueAndValidity();
                const label = document.querySelector(`label[for=${field.frontedId}]`);
                if (label) {
                  const asterisk = document.createElement('span');
                  asterisk.innerHTML = ' *';
                  asterisk.style.color = 'red';
                  label.appendChild(asterisk);
                }
              }
            }
          }
        })
        this.cdr.detectChanges();
      });
  }
  /**
   * The function returns the controls of a form named createCampaignDefinitionForm.
   * @returns The `controls` property of the `createCampaignDefinitionForm` object is being returned.
   */
  get f() {
    return this.createCampaignDefinitionForm.controls;
  }

 /**
  * The function returns the controls of a form named createCampaignActivityForm.
  * @returns The `controls` property of the `createCampaignActivityForm` form group is being returned.
  */
  get g() {
    return this.createCampaignActivityForm.controls;
  }

  /**
   * The function returns the controls of a form named createCampaignMessageForm.
   * @returns  the controls of the `createCampaignMessageForm` form group.
   */
  get h() {
    return this.createCampaignMessageForm.controls;
  }

  /**
   * The function returns the controls of a form named createTrackerUrlForm.
   */
  /**
   * The function returns the controls of a form named createTrackerUrlForm.
   */
  get i() {
    return this.createTrackerUrlForm.controls;
  }

  selectProduct(product: any) {

  }

  deleteProduct(product: any) {

  }

  /**
   * The function `openTargetModal` displays a modal if a campaign target is selected, otherwise it
   * shows an error message.
   */
  openTargetModal() {
    const modal = document.getElementById('targetSearchModal');
    if (modal && this.selectedCampaignTarget) {
      modal.classList.add('show');
      modal.style.display = 'block';
    } else {
      this.globalMessagingService.displayErrorMessage(
        'Error',
        'No target is selected!'
      );
    }
  }

  /**
   * The function `closeTargetModal` sets `editMode` to false and hides the target search modal
   * element.
   */
  closeTargetModal() {
    this.editMode = false;
    const modal = document.getElementById('targetSearchModal');
    if (modal) {
      modal.classList.remove('show');
      modal.style.display = 'none';
    }
  }

 /**
  * The function `openCampaignActivityModal` displays a modal by adding a 'show' class and setting its
  * display property to 'block'.
  */
  openCampaignActivityModal() {
    const modal = document.getElementById('campaignActivityModal');
    if (modal) {
      modal.classList.add('show');
      modal.style.display = 'block';
    }
  }

  /**
   * The function `closeCampaignActivityModal` sets `editMode` to false and hides the modal with the id
   * 'campaignActivityModal'.
   */
  closeCampaignActivityModal() {
    this.editMode = false;
    const modal = document.getElementById('campaignActivityModal');
    if (modal) {
      modal.classList.remove('show');
      modal.style.display = 'none';
    }
  }

  /**
   * The function `openNewCampaignActivityModal` opens a modal for a new campaign activity.
   */
  openNewCampaignActivityModal() {
    const modal = document.getElementById('newCampaignActivityModal');
    if (modal) {
      modal.classList.add('show');
      modal.style.display = 'block';
    }
  }

  /**
   * The function `closeNewCampaignActivityModal` sets `editMode` to false and hides the modal with the
   * id 'newCampaignActivityModal'.
   */
  closeNewCampaignActivityModal() {
    this.editMode = false;
    const modal = document.getElementById('newCampaignActivityModal');
    if (modal) {
      modal.classList.remove('show');
      modal.style.display = 'none';
    }
  }

  /**
   * The function `openCampaignMessageModal` displays a modal by adding a 'show' class and setting its
   * display property to 'block'.
   */
  openCampaignMessageModal() {
    const modal = document.getElementById('campaignMessageModal');
    if (modal) {
      modal.classList.add('show');
      modal.style.display = 'block';
    }
  }

  /**
   * The function `closeCampaignMessageModal` is used to hide and remove the display of a modal element
   * with the id 'campaignMessageModal'.
   */
  closeCampaignMessageModal() {
    this.editMode = false;
    const modal = document.getElementById('campaignMessageModal');
    if (modal) {
      modal.classList.remove('show');
      modal.style.display = 'none';
    }
  }

  /**
   * The function `openTrackerUrlModal` displays a modal with the ID 'trackerUrlModal' by adding a
   * 'show' class and setting its display style to 'block'.
   */
  openTrackerUrlModal() {
    const modal = document.getElementById('trackerUrlModal');
    if (modal) {
      modal.classList.add('show');
      modal.style.display = 'block';
    }
  }

  /**
   * The function `closeTrackerUrlModal` sets `editMode` to false and hides the element with id
   * 'trackerUrlModal'.
   */
  closeTrackerUrlModal() {
    this.editMode = false;
    const modal = document.getElementById('trackerUrlModal');
    if (modal) {
      modal.classList.remove('show');
      modal.style.display = 'none';
    }
  }

  /**
   * The function `onFileChange` reads a selected file, converts it to a data URL, and updates the URL
   * displayed.
   */
  onFileChange(event) {
    if (event.target.files) {
      var reader = new FileReader()
      this.selectedFile = event.target.files[0];
      reader.readAsDataURL(event.target.files[0])
      reader.onload = (event: any) => {
        this.url = event.target.result;
        this.cdr.detectChanges();
        log.info(this.url);
      }
    }
  }

  /**
   * The function `goToNext` increments the current tab index and updates the current tab and button
   * text accordingly.
   */
  goToNext() {
    let index = this.currentTab.id;
    if (index === this.navigationLinks.length-1) {
      index = 0;
      this.onClickSave.emit(index);
    }
    else {
      index++;
    }

    this.currentTab = this.navigationLinks[index];
    log.info(this.currentTab)

    this.buttonText = this.navigationLinks.length-1 === this.currentTab.id ? 'Back to campaigns' : 'Next';
  }

  /**
   * The function `tabNavigation` updates the current tab and button text based on the index provided.
   */
  tabNavigation(index:number) {
    this.currentTab = this.navigationLinks[index];
    this.buttonText = this.navigationLinks.length-1 === this.currentTab.id ? 'Back to campaigns' : 'Next';
  }

 /**
  * The `editTarget` function toggles the edit mode and opens a modal for editing a target.
  */
  editTarget() {
    this.editMode = !this.editMode;
    this.openTargetModal();
  }

  /**
   * The function `editCampaignActivity` toggles the edit mode and opens a new campaign activity modal.
   */
  editCampaignActivity() {
    this.editMode = !this.editMode;
    this.openNewCampaignActivityModal();
  }

  /**
   * The function `editCampaignMessages` toggles the edit mode and opens a modal for editing campaign
   * messages.
   */
  editCampaignMessages() {
    this.editMode = !this.editMode;
    this.openCampaignMessageModal();
  }

  /**
   * The function `editTrackerUrl` toggles the edit mode and opens a modal for editing a tracker URL.
   */
  editTrackerUrl() {
    this.editMode = !this.editMode;
    this.openTrackerUrlModal();
  }

  ngOnDestroy(): void {}
}
