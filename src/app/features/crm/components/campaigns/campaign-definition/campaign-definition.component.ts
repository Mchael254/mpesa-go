import {ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {Logger} from "../../../../../shared/services";
import {GlobalMessagingService} from "../../../../../shared/services/messaging/global-messaging.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {MandatoryFieldsService} from "../../../../../shared/services/mandatory-fields/mandatory-fields.service";
import {untilDestroyed} from "../../../../../shared/services/until-destroyed";
import {map, take} from "rxjs";
import {ProductsService} from "../../../../gis/components/setups/services/products/products.service";
import {ProductService as LmsProductService} from "../../../../lms/service/product/product.service";
import {
  AggregatedCampaignsDTO, CampaignActivitiesDTO,
  CampaignMessagesDTO,
  CampaignsDTO,
  CampaignTargetsDTO
} from "../../../data/campaignsDTO";
import {StaffDto} from "../../../../entities/data/StaffDto";
import {CampaignsService} from "../../../services/campaigns..service";
import {StaffService} from "../../../../entities/services/staff/staff.service";
import {Pagination} from "../../../../../shared/data/common/pagination";
import {NgxSpinnerService} from "ngx-spinner";
import {ReusableInputComponent} from "../../../../../shared/components/reusable-input/reusable-input.component";
import {Table, TableLazyLoadEvent} from "primeng/table";
import {ClientService} from "../../../../entities/services/client/client.service";
import {ClientDTO} from "../../../../entities/data/ClientDTO";
import {LazyLoadEvent} from "primeng/api";
import {tap} from "rxjs/operators";
import {LeadsService} from "../../../services/leads.service";
import {Leads} from "../../../data/leads";
import {SystemsService} from "../../../../../shared/services/setups/systems/systems.service";
import {OrganizationService} from "../../../services/organization.service";
import {CurrencyService} from "../../../../../shared/services/setups/currency/currency.service";
import {SystemsDto} from "../../../../../shared/data/common/systemsDto";
import {OrganizationDTO} from "../../../data/organization-dto";
import {CurrencyDTO} from "../../../../../shared/data/common/currency-dto";
import {ActivityService} from "../../../services/activity.service";
import {Activity, ActivityType} from "../../../data/activity";

const log = new Logger('CampaignDefinitionComponent');
@Component({
  selector: 'app-campaign-definition',
  templateUrl: './campaign-definition.component.html',
  styleUrls: ['./campaign-definition.component.css']
})
export class CampaignDefinitionComponent implements OnInit {
  systems: SystemsDto[];
  currencies: CurrencyDTO[];
  organizations: OrganizationDTO[];
  @Input() selectedCampaign: AggregatedCampaignsDTO;
  selectedSystem: any;
  products: any[];
  pageSize: 5;
  campaignTargetData: CampaignTargetsDTO[];
  selectedCampaignTarget: any;
  selectedCampaignTargetClient: any[] = [];
  selectedCampaignTargetLead: any[] = [];
  selectedCampaignActivity: any;

  campaignActivityData: any[];
  trackerUrlData: any[];
  campaignTargetSearchData: any[];

  editMode: boolean = false;

  url = ""
  selectedFile: File;

  productList: AllProduct[] = [];
  lmsProducts: any[] = [];

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
  targetSearchForm: FormGroup;

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
    scheduleDate: 'Y',
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

  allUsersModalVisible: boolean = false;
  groupUserModalVisible: boolean = false;
  zIndex= 1;
  secondModalZIndex = 2;
  selectedMainUser: StaffDto;
  selectedDefaultUser: StaffDto;
  groupStaffMembers: Pagination<StaffDto> = <Pagination<StaffDto>>{};

  selectedOptions: any[];
  campaignMessageData: CampaignMessagesDTO[];

  selectedCampaignMessage: CampaignMessagesDTO;

  @ViewChild('campaignMessageConfirmationModal')
  campaignMessageConfirmationModal!: ReusableInputComponent;

  @ViewChild('campaignActivityConfirmationModal') campaignActivityConfirmationModal: ReusableInputComponent;

  @ViewChild('campaignMessagesTable') campaignMessagesTable: Table;
  @ViewChild('campaignsTargetTable') campaignsTargetTable: Table;
  @ViewChild('activitiesTable') activitiesTable: Table;
  @ViewChild('campaignsActivityTable') campaignsActivityTable: Table;
  @Output() editCampaignClick: EventEmitter<any> = new EventEmitter<any>();
  clientsData: Pagination<ClientDTO> = <Pagination<ClientDTO>>{};
  isSearching: boolean = false;
  leads: Leads[] = [];
  activityData: Activity[];
  activityTypeData: ActivityType[];
  selectedActivity: ActivityType;

  constructor(
    private globalMessagingService: GlobalMessagingService,
    private cdr: ChangeDetectorRef,
    private fb: FormBuilder,
    private mandatoryFieldsService: MandatoryFieldsService,
    private gisProductService: ProductsService,
    private lmsProductService: LmsProductService,
    private campaignsService: CampaignsService,
    private staffService: StaffService,
    private spinner: NgxSpinnerService,
    private clientService: ClientService,
    private leadService: LeadsService,
    private systemsService: SystemsService,
    private organizationService: OrganizationService,
    private currencyService: CurrencyService,
    private activityService: ActivityService
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
    this.targetSearchCreateForm();
    this.fetchStaffGroupMembers();
    // log.info(this.systems, this.currencies, this.organizations)
    log.info("selected campaign>", this.selectedCampaign)

    if (this.selectedCampaign) {
      this.fetchCampaignMessages();
      this.fetchCampaignTargets();
      this.getCampaignActivities();
    }
    this.getOrganizations();
    this.getCurrencies();
    this.getAllSystems();
    this.getActivities();
    this.getActivityTypes();
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
      sendTestTo: [''],
      scheduleDate: ['']
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
 * Initializes the target search form with the specified form controls.
 */
  targetSearchCreateForm() {
    this.targetSearchForm = this.fb.group({
      group: [''],
      searchCriteria: [''],
      searchValue: ['']
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
  get i() {
    return this.createTrackerUrlForm.controls;
  }

  deleteProduct(product: any) {
    const index = this.selectedOptions.indexOf(product);
    if (index > -1) {
      this.selectedOptions.splice(index, 1);
    }
  }

  /**
   * The function `openTargetModal` displays a modal if a campaign target is selected, otherwise it
   * shows an error message.
   */
  openTargetModal() {
    const modal = document.getElementById('targetSearchModal');
    if (modal) {
      modal.classList.add('show');
      modal.style.display = 'block';
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
 * Opens the modal for displaying all users by setting the zIndex to -1 and toggling the visibility of the modal.
 */
  openAllUsersModal() {
    this.zIndex  = -1;
    this.toggleAllUsersModal(true);
  }

  /**
 * Opens the group members modal by adjusting the z-index values and toggling the modal visibility.
 */
  openGroupMembersModal() {
    this.zIndex = -1;
    this.secondModalZIndex = 1;
    this.toggleGroupMembersModal(true);
  }

  /**
   * The function `toggleAllUsersModal` sets the visibility of the all users modal based on the `display` parameter.
   */
  private toggleAllUsersModal(display: boolean) {
    this.allUsersModalVisible = display;
  }

  /**
   * The function `processSelectedUser` toggles a modal and sets the zIndex to 1.
   */
  processSelectedUser($event: void) {
    this.toggleAllUsersModal(false);
    this.zIndex = 1;
  }

/**
 * Toggles the visibility of the group members modal based on the provided display parameter.
 *
 * @param display - A boolean value indicating whether to display the group members modal.
 */
  private toggleGroupMembersModal(display: boolean){
    this.groupUserModalVisible = display;
  }


  /**
   * Sets the selectedMainUser property to the provided event and patches the assignedTo value of the
   * createCampaignDefinitionForm with the id of the selected user.
   * @param event - The selected user.
   */
  getSelectedUser(event: StaffDto) {
    this.selectedMainUser = event;
    log.info(this.selectedMainUser)
    this.createCampaignDefinitionForm.patchValue({
      assignedTo: event?.id
    });
  }

  /**
   * Toggles the group members modal and sets the zIndex to 1.
   * @param event - An event indicating whether to toggle the modal.
   */
  processDefaultUser(event: void) {
    this.toggleGroupMembersModal(false);
    this.zIndex = 1;
  }

  /**
 * Updates the selected default user for the campaign definition form.
 *
 * @param event - The StaffDto object representing the selected default user.
 */
  getSelectedDefaultUser(event: StaffDto) {
    this.selectedDefaultUser = event;
    this.createCampaignDefinitionForm.patchValue({
      team: event?.id
    })
  }

  /**
 * Hides the all users modal and opens the group members modal.
 */
  showGroupMembers() {
    this.allUsersModalVisible = false;
    // this.fetchStaffGroupMembers();
    this.openGroupMembersModal();
  }

/**
 * Fetches staff group members by making a call to the staff service with specific parameters.
 * Updates the groupStaffMembers property with the retrieved data or displays an error message.
 */
  fetchStaffGroupMembers() {
    this.staffService.getStaff(0, null, 'G', null, null, null)
      .subscribe({
        next: (data) => {
          this.groupStaffMembers = data;
        },
        error: (err) => {
          let errorMessage = '';
          if (err?.error?.msg) {
            errorMessage = err.error.msg
          } else {
            errorMessage = err.message
          }
          this.globalMessagingService.displayErrorMessage('Error', errorMessage);
        }
      })
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
  /*goToNext() {
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
  }*/

  async goToNext() {
    let index = this.currentTab.id;

    if (index === 0) {
      try {
        // Call saveCampaign() and wait for it to complete if it's async
        await this.saveCampaign();
      } catch (error) {
        log.error('Failed to save campaign:', error);
        return; // Stop further execution if the save fails
      }
    }

    if (index === this.navigationLinks.length - 1) {
      index = 0;
      this.onClickSave.emit(index);
    } else {
      index++;
    }

    this.currentTab = this.navigationLinks[index];
    log.info(this.currentTab);

    // Update button text
    this.buttonText = this.navigationLinks.length - 1 === this.currentTab.id ? 'Back to campaigns' : 'Next';
  }

  /**
   * The function `tabNavigation` updates the current tab and button text based on the index provided.
   */
  tabNavigation(index:number) {
    this.currentTab = this.navigationLinks[index];
    this.buttonText = this.navigationLinks.length-1 === this.currentTab.id ? 'Back to campaigns' : 'Next';
  }

  /**
   * The function `editCampaignActivity` toggles the edit mode and opens a new campaign activity modal.
   */
  editCampaignActivity() {
    this.editMode = !this.editMode;
    this.openNewCampaignActivityModal();
  }

  /**
   * The function `editTrackerUrl` toggles the edit mode and opens a modal for editing a tracker URL.
   */
  editTrackerUrl() {
    this.editMode = !this.editMode;
    this.openTrackerUrlModal();
  }

  /**
   * The function checks the short description of a selected system and fetches corresponding products based on the
   * description.
   */
  onSystemChange() {
    const sysId = this.selectedSystem;

    if (sysId === 37) {
      log.info("gis",this.selectedSystem)
      this.fetchGisProducts();

    } else if (sysId === 27) {
      log.info("lms",this.selectedSystem)
      this.fetchLmsProducts();

    } else {
      this.productList = [];
    }

  }

  /**
   * The fetchGisProducts function retrieves all products from the GIS product service and stores them in the productList
   * array.
   */
  fetchGisProducts() {
    this.productList = [];
    this.gisProductService.getAllProducts()
      .pipe(
        take(1),
        map(data => {
          const allProducts: AllProduct[] = [];
          data.forEach(product => {
            const combinedProduct: AllProduct = {
              code: product.code,
              description: product.description
            }
            allProducts.push(combinedProduct);
          })
          return allProducts;
        })
      )
      .subscribe(
        (data) => {
          this.productList = data;
          log.info('gis products:', this.productList);
        })
  }

  /**
   * The fetchLmsProducts function retrieves a list of products from an LMS service and assigns it to the productList
   * variable.
   */
  fetchLmsProducts() {
    this.productList = [];
    this.lmsProductService.getListOfProduct()
      .pipe(
        take(1),
        map(data => {
          const allProducts: AllProduct[] = [];
          data.forEach(product => {
            const combinedProduct: AllProduct = {
              code: product.code,
              description: product.description
            }
            allProducts.push(combinedProduct);
          })
          return allProducts;
        })
      )
      .subscribe(
        (data) => {
          this.productList = data;
          log.info('lms products:', this.productList);
        })
  }

  /**
   * Saves a campaign by calling the createCampaign or updateCampaign method of the CampaignsService based on whether a campaign is being edited or not.
   * The payload for the request is built from the values of the campaign definition form.
   * If the campaign is being edited, the code of the campaign is used to update the campaign.
   * If the campaign is not being edited, a new campaign is created.
   * The method displays a success message if the campaign is saved successfully and an error message if the request fails.
   * If the campaign is being edited, the campaign message form is reset and the campaign message modal is closed.
   * The selected campaign is set to null after the campaign is saved.
   */
  /*saveCampaign() {
    this.createCampaignDefinitionForm.markAllAsTouched();
    if (this.createCampaignDefinitionForm.invalid) {
      // this.globalMessagingService.displayErrorMessage('Error', 'Fill required fields');
      return;
    }
    if(!this.selectedCampaign) {
      const campaignDefinitionFormValues = this.createCampaignDefinitionForm.getRawValue();

      const saveCampaignPayload: CampaignsDTO = {
        actualResponseCount: null,
        actualRoi: null,
        actualSalesCount: null,
        campaignName: campaignDefinitionFormValues.name,
        campaignType: campaignDefinitionFormValues.campaignType,
        cmpActlCost: campaignDefinitionFormValues.actualCost,
        cmpBgtCost: campaignDefinitionFormValues.budgetedCost,
        cmpDate: campaignDefinitionFormValues.dateFrom,
        cmpExptRevenue: campaignDefinitionFormValues.expectedRevenue,
        cmpNumSent: null,
        code: null,
        currencies: campaignDefinitionFormValues.currency,
        description: campaignDefinitionFormValues.description,
        eventTime: campaignDefinitionFormValues.executionTime,
        events: campaignDefinitionFormValues.event,
        expectCloseDate: campaignDefinitionFormValues.dateTo,
        expectedCost: campaignDefinitionFormValues.expectedCost,
        expectedResponseCount: null,
        expectedRoi: null,
        expectedSalesCount: null,
        impressionCount: campaignDefinitionFormValues.pageImpressions,
        objective: campaignDefinitionFormValues.objective,
        organization: campaignDefinitionFormValues.organization,
        product: campaignDefinitionFormValues?.products[0]?.code, //the endpoint doesn't support multiple products but on frontend we should be able to display multiple products
        sponsor: campaignDefinitionFormValues.sponsor,
        status: campaignDefinitionFormValues.status,
        system: campaignDefinitionFormValues.system,
        targetAudience: null,
        targetSize: null,
        teamLeader: campaignDefinitionFormValues.team,
        user: campaignDefinitionFormValues.assignedTo,
        venue: campaignDefinitionFormValues.venue
      }

      log.info("form>>", saveCampaignPayload);
      this.campaignsService.createCampaign(saveCampaignPayload)
        .subscribe((data) => {
            this.globalMessagingService.displaySuccessMessage('Success', 'Successfully Created a campaign');

            this.createCampaignDefinitionForm.reset();
            // this.fetchCampaign();
          },
          error => {
            // log.info('>>>>>>>>>', error.error.message)
            this.globalMessagingService.displayErrorMessage('Error', error.error.message);
          })
    }
    else {
      const campaignDefinitionFormValues = this.createCampaignDefinitionForm.getRawValue();
      const campaignCode = this.selectedCampaign?.campaign?.code;

      const saveCampaignPayload: CampaignsDTO = {
        actualResponseCount: null,
        actualRoi: null,
        actualSalesCount: null,
        campaignName: campaignDefinitionFormValues.name,
        campaignType: campaignDefinitionFormValues.campaignType,
        cmpActlCost: campaignDefinitionFormValues.actualCost,
        cmpBgtCost: campaignDefinitionFormValues.budgetedCost,
        cmpDate: campaignDefinitionFormValues.dateFrom,
        cmpExptRevenue: campaignDefinitionFormValues.expectedRevenue,
        cmpNumSent: null,
        code: campaignCode,
        currencies: campaignDefinitionFormValues.currency,
        description: campaignDefinitionFormValues.description,
        eventTime: campaignDefinitionFormValues.executionTime,
        events: campaignDefinitionFormValues.event,
        expectCloseDate: campaignDefinitionFormValues.dateTo,
        expectedCost: campaignDefinitionFormValues.expectedCost,
        expectedResponseCount: null,
        expectedRoi: null,
        expectedSalesCount: null,
        impressionCount: campaignDefinitionFormValues.pageImpressions,
        objective: campaignDefinitionFormValues.objective,
        organization: campaignDefinitionFormValues.organization,
        product: campaignDefinitionFormValues?.products[0]?.code || null, //the endpoint doesn't support multiple products but on frontend we should be able to display multiple products
        sponsor: campaignDefinitionFormValues.sponsor,
        status: campaignDefinitionFormValues.status,
        system: campaignDefinitionFormValues.system,
        targetAudience: null,
        targetSize: null,
        teamLeader: campaignDefinitionFormValues.team,
        user: campaignDefinitionFormValues.assignedTo,
        venue: campaignDefinitionFormValues.venue
      }
      log.info("campaign edit>", saveCampaignPayload)
      this.campaignsService.updateCampaign(campaignCode, saveCampaignPayload)
        .subscribe((data) => {
            this.globalMessagingService.displaySuccessMessage('Success', 'Successfully updated a campaign');

            this.createCampaignMessageForm.reset();
            this.closeCampaignMessageModal();
            this.selectedCampaign = null;
          },
          error => {
            // log.info('>>>>>>>>>', error.error.message)
            this.globalMessagingService.displayErrorMessage('Error', error.error.message);
          })
    }

  }*/

  saveCampaign(): Promise<void> {
    this.createCampaignDefinitionForm.markAllAsTouched();

    if (this.createCampaignDefinitionForm.invalid) {
      // this.globalMessagingService.displayErrorMessage('Error', 'Fill required fields');
      return Promise.reject('Form is invalid');
    }

    const campaignDefinitionFormValues = this.createCampaignDefinitionForm.getRawValue();
    const productCode = Array.isArray(campaignDefinitionFormValues?.products) && campaignDefinitionFormValues.products.length > 0
      ? campaignDefinitionFormValues.products[0].code
      : null;

    const saveCampaignPayload: CampaignsDTO = {
      actualResponseCount: null,
      actualRoi: null,
      actualSalesCount: null,
      campaignName: campaignDefinitionFormValues.name,
      campaignType: campaignDefinitionFormValues.campaignType,
      cmpActlCost: campaignDefinitionFormValues.actualCost,
      cmpBgtCost: campaignDefinitionFormValues.budgetedCost,
      cmpDate: campaignDefinitionFormValues.dateFrom,
      cmpExptRevenue: campaignDefinitionFormValues.expectedRevenue,
      cmpNumSent: null,
      code: this.selectedCampaign?.campaign?.code || null,  // Handle for create or update
      currencies: campaignDefinitionFormValues.currency,
      description: campaignDefinitionFormValues.description,
      eventTime: campaignDefinitionFormValues.executionTime,
      events: campaignDefinitionFormValues.event,
      expectCloseDate: campaignDefinitionFormValues.dateTo,
      expectedCost: campaignDefinitionFormValues.expectedCost,
      expectedResponseCount: null,
      expectedRoi: null,
      expectedSalesCount: null,
      impressionCount: campaignDefinitionFormValues.pageImpressions,
      objective: campaignDefinitionFormValues.objective,
      organization: campaignDefinitionFormValues.organization,
      product: productCode,
      sponsor: campaignDefinitionFormValues.sponsor,
      status: campaignDefinitionFormValues.status,
      system: campaignDefinitionFormValues.system,
      targetAudience: null,
      targetSize: null,
      teamLeader: campaignDefinitionFormValues.team,
      user: campaignDefinitionFormValues.assignedTo,
      venue: campaignDefinitionFormValues.venue
    };


    const campaignServiceCall = this.selectedCampaign
      ? this.campaignsService.updateCampaign(this.selectedCampaign.campaign.code, saveCampaignPayload)
      : this.campaignsService.createCampaign(saveCampaignPayload);

    return campaignServiceCall.toPromise()
      .then(data => {
        this.globalMessagingService.displaySuccessMessage('Success', this.selectedCampaign ? 'Successfully updated campaign' : 'Successfully created campaign');
        this.createCampaignDefinitionForm.reset();
      })
      .catch(error => {
        this.globalMessagingService.displayErrorMessage('Error', error.error.message || 'Error saving campaign');
        throw error;  // Throw to ensure calling function handles it
      });
  }

  /**
   * Toggles edit mode for the campaign definition form.
   *
   * If a campaign is selected, it populates the form with the campaign's details.
   * If no campaign is selected, it displays an error message.
   * @returns {void}
   */

  editCampaign() {
    this.editMode = !this.editMode;
    const campaign = this.selectedCampaign.campaign
    log.info(">>campaign", campaign)
    if (campaign) {
      // this.openCampaignMessageModal();
      this.createCampaignDefinitionForm.patchValue({
        name: campaign.campaignName,
        system: campaign.system,
        description: campaign.description,
        objective: campaign.objective,
        dateFrom: campaign.cmpDate,
        dateTo: campaign.expectCloseDate,
        executionTime: campaign.eventTime,
        assignedTo: campaign.user,
        organization: campaign.organization,
        team: campaign.teamLeader,
        currency: campaign.currencies,
        budgetedCost: campaign.cmpBgtCost,
        actualCost: campaign.cmpActlCost,
        expectedCost: campaign.expectedCost,
        expectedRevenue: campaign.cmpExptRevenue,
        sponsor: campaign.sponsor,
        campaignType: campaign.campaignType,
        status: campaign.status,
        pageImpressions: campaign.impressionCount,
        event: campaign.events,
        venue: campaign.venue,
        products: campaign.product
      });
    } else {
      this.globalMessagingService.displayErrorMessage(
        'Error',
        'No campaign is selected!'
      );
    }
  }

  /**
   * Fetches campaign messages for the selected campaign and sets the campaignMessageData variable.
   * Also shows a spinner while fetching the messages and hides it after the messages are received.
   */
  fetchCampaignMessages() {
    this.spinner.show();
    this.campaignsService.getCampaignMessages(this.selectedCampaign?.campaign?.code)
      .subscribe((data) => {
        this.campaignMessageData = data;
        this.spinner.hide();

        log.info("messages>>", data);
      });
  }

  /**
   * Sets the selectedCampaignMessage variable with the selected campaign message.
   * Logs 'campaign message select' with the campaign message code.
   * @param campaignMessage The selected campaign message.
   */
  onCampaignMessageSelect(campaignMessage: CampaignMessagesDTO) {
    this.selectedCampaignMessage = campaignMessage;
    log.info('campaign message select', this.selectedCampaignMessage.code)
  }

  /**
   * Saves a campaign message by calling the createCampaignMessage or updateCampaignMessage method of the CampaignsService based on whether a campaign message is being edited or not.
   * The payload for the request is built from the values of the campaign message form.
   * If the campaign message is being edited, the code of the campaign message is used to update the campaign message.
   * If the campaign message is not being edited, a new campaign message is created.
   * The method displays a success message if the campaign message is saved successfully and an error message if the request fails.
   * If the campaign message is being edited, the campaign message form is reset and the campaign message modal is closed.
   * The selected campaign message is set to null after the campaign message is saved.
   */
  saveCampaignMessage() {
    this.createCampaignMessageForm.markAllAsTouched();
    if (this.createCampaignMessageForm.invalid) {
      // this.globalMessagingService.displayErrorMessage('Error', 'Fill required fields');
      return;
    }

    if(!this.selectedCampaignMessage) {
      const campaignMessageFormValues = this.createCampaignMessageForm.getRawValue();

      const saveCampaignMessagePayload: CampaignMessagesDTO = {
        campaignCode: this.selectedCampaign?.campaign?.code, //should be added
        code: null,
        date: campaignMessageFormValues.scheduleDate, // should be added
        imageUrl: null,
        image: this.url,
        messageBody: campaignMessageFormValues.messagesContent,
        messageSubject: campaignMessageFormValues.messagesSubject,
        messageType: campaignMessageFormValues.msgCampaignType,
        sendAll: campaignMessageFormValues.sendToAllOptions,
        status: null
      }
      log.info("message>", saveCampaignMessagePayload)
      this.campaignsService.createCampaignMessage(saveCampaignMessagePayload)
        .subscribe({
          next: (data) => {
          this.globalMessagingService.displaySuccessMessage('Success', 'Successfully created a campaign message');

          this.createCampaignMessageForm.reset();
          this.closeCampaignMessageModal();
          this.fetchCampaignMessages();
          },
          error: (err) => {
            log.info('>>>>>>>>>', err.error.message)
            this.globalMessagingService.displayErrorMessage('Error', err.error.message);
          }
        });
    }
    else {
      const campaignMessageFormValues = this.createCampaignMessageForm.getRawValue()
      const campaignMessageCode = this.selectedCampaignMessage?.code;

      const saveCampaignMessagePayload: CampaignMessagesDTO = {
        campaignCode: this.selectedCampaign?.campaign?.code, //should be added
        code: campaignMessageCode,
        date: campaignMessageFormValues.scheduleDate, // should be added
        imageUrl: null,
        image: this.selectedCampaignMessage.imageUrl ? this.selectedCampaignMessage.imageUrl: this.url,
        messageBody: campaignMessageFormValues.messagesContent,
        messageSubject: campaignMessageFormValues.messagesSubject,
        messageType: campaignMessageFormValues.msgCampaignType,
        sendAll: campaignMessageFormValues.sendToAllOptions,
        status: null
      }
      log.info("message>", saveCampaignMessagePayload)
      this.campaignsService.updateCampaignMessage(campaignMessageCode, saveCampaignMessagePayload)
        .subscribe({
          next: (data) => {
            this.globalMessagingService.displaySuccessMessage('Success', 'Successfully updated a campaign message');

            this.createCampaignMessageForm.reset();
            this.closeCampaignMessageModal();
            this.fetchCampaignMessages();
            this.selectedCampaignMessage = null;
          },
          error: (err) => {
            // log.info('>>>>>>>>>', error.error.message)
            this.globalMessagingService.displayErrorMessage('Error', err.error.message);
          },
        });
    }

  }

  /**
   * The function `editCampaignMessage` toggles the edit mode and opens a campaign message
   * modal. If a campaign message is selected, it populates the form fields with the
   * selected campaign message's details. If no campaign message is selected, it shows an
   * error message.
   */
  editCampaignMessage() {
    this.editMode = !this.editMode;
    if (this.selectedCampaignMessage) {
      this.openCampaignMessageModal();
      this.createCampaignMessageForm.patchValue({
        msgCampaignType: this.selectedCampaignMessage.messageType,
        sendToAllOptions: this.selectedCampaignMessage.sendAll,
        messagesSubject: this.selectedCampaignMessage.messageSubject,
        messagesContent: this.selectedCampaignMessage.messageBody,
        image: this.selectedCampaignMessage.imageUrl,
        // sendTestTo: this.selectedCampaignMessage.,
        scheduleDate: this.selectedCampaignMessage.date

        // logo: this.selectedBank.bankLogo
      });
      /*this.url = this.selectedBank.bankLogo ?
        'data:image/jpeg;base64,' + this.selectedBank.bankLogo : '';*/
    } else {
      this.globalMessagingService.displayErrorMessage(
        'Error',
        'No campaign message is selected!'
      );
    }
  }

  /**
   * The function `deleteCampaignMessage` shows a confirmation modal to delete a campaign
   * message. If the user confirms the deletion, it calls the `confirmCampaignMessageDelete`
   * function to delete the campaign message.
   */
  deleteCampaignMessage() {
    this.campaignMessageConfirmationModal.show();
  }

  /**
   * The function `confirmCampaignMessageDelete` deletes a campaign message if the
   * user confirms the deletion.
   */

  confirmCampaignMessageDelete() {
    if (this.selectedCampaignMessage) {
      const campaignMessageId = this.selectedCampaignMessage.code;
      this.campaignsService.deleteCampaignMessage(campaignMessageId).subscribe({
        next: (data) => {
        this.globalMessagingService.displaySuccessMessage(
          'success',
          'Successfully deleted a campaign message'
        );
        this.selectedCampaignMessage = null;
        this.fetchCampaignMessages();
        },
        error: (err) => {
          this.globalMessagingService.displayErrorMessage('Error', err.error.message);
        },
      });
    } else {
      this.globalMessagingService.displayErrorMessage(
        'Error',
        'No campaign message is selected.'
      );
    }
  }

  /**
   * The function `fetchCampaignTargets` fetches the campaign targets for a
   * selected campaign. It shows a spinner while fetching the data and hides
   * it when the data is fetched. It also logs the fetched data to the console.
   */
  fetchCampaignTargets() {
    this.spinner.show();
    this.campaignsService.getCampaignTargets(this.selectedCampaign?.campaign?.code)
      .subscribe((data) => {
        this.campaignTargetData = data;
        this.spinner.hide();

        // log.info("targets>>", data);
      });
  }

  /**
   * The function `getClients` fetches clients from the client service.
   */
  getClients(pageIndex: number,
             pageSize: number,
             sortField: any = 'createdDate',
             sortOrder: string = 'desc') {
    this.spinner.show();
    return this.clientService.getClients(pageIndex, pageSize, sortField, sortOrder)
      .pipe( untilDestroyed(this)
      );
  }

  /**
   * The function `lazyLoadClients` is used to fetch clients lazily based on
   * the event parameters. It is used in the client table to fetch clients based
   * on the current page index, sort field, sort order, and page size. If the
   * user is searching for clients, it calls the `filterClients` function to
   * fetch clients based on the search criteria. Otherwise, it calls the
   * `getClients` function to fetch clients based on the current page index,
   * sort field, sort order, and page size. It shows a spinner while fetching
   * the data and hides it when the data is fetched. It also logs the fetched
   * data to the console.
   */
  lazyLoadClients(event:LazyLoadEvent | TableLazyLoadEvent){
    const pageIndex = event.first / event.rows;
    const sortField = event.sortField;
    const sortOrder = event?.sortOrder == 1 ? 'desc' : 'asc';
    const pageSize = event.rows;

    if (this.isSearching) {
      this.filterClients(null, pageSize)
    }
    else {
      this.getClients(pageIndex, pageSize, sortField, sortOrder)
        .pipe(
          untilDestroyed(this),
          tap((data) => log.info(`Fetching Clients>>>`, data))
        )
        .subscribe({
          next: (data: Pagination<ClientDTO>) => {
            this.clientsData = data;
            this.spinner.hide();
            this.cdr.detectChanges();
          },
          error: err => {
            this.spinner.hide();
          },
        });
    }
  }
  /**
   * The function `filterClients` is used to filter clients based on the
   * search criteria and value. It is called when the user enters a search
   * criteria and value in the search form. It shows a spinner while fetching
   * the data and hides it when the data is fetched. If the search criteria and
   * value are not provided, it displays an error message. It also logs the
   * fetched data to the console.
   */
  filterClients(event, pageSize: number = event.rows) {
    const sortValues = this.targetSearchForm.getRawValue();
    log.info('pagesi', pageSize, event)

    log.info('form value', sortValues);
    const payload: any = {
      group: sortValues.group ? sortValues.group : '',
      searchCriteria: sortValues.searchCriteria ? sortValues.searchCriteria : '',
      searchValue: sortValues.searchValue ? sortValues.searchValue : ''
    }
    log.info('form payload', payload);
    this.isSearching = true;
    if (payload.searchCriteria && payload.searchValue) {
      this.clientService
        .getClients(
          0, pageSize,
          '',
          '',
          payload.searchCriteria,
          payload.searchValue)
        .subscribe({
          next: (data) => {
            this.clientsData = data;
            this.spinner.hide();
          },
          error: (err) => {
            this.spinner.hide();
          }
        });
    }
    else {
      this.globalMessagingService.displayErrorMessage('Error', "Search criteria and value is required")
    }
  }

  fetchLeads() {
    this.leadService.getLeads()
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (data) => {
          if (data) {
            this.leads = data;
            log.info('Fetch Leads', this.leads);
          } else {
            this.globalMessagingService.displayErrorMessage(
              'Error', 'Something went wrong. Please try Again'
            );
          }
        },
        error: (err) => {
          this.globalMessagingService.displayErrorMessage(
            'Error', err.error.message
          );
          log.info(`error >>>`, err);
        },
      });
  }

  /**
   * The function filters the campaignMessagesTable based on the value entered in
   * the HTMLInputElement.
   */
  filterCampaignMessages(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.campaignMessagesTable.filterGlobal(filterValue, 'contains');
  }

  filterCampaignTargets(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.campaignsTargetTable.filterGlobal(filterValue, 'contains');
  }

  filterActivities(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.activitiesTable.filterGlobal(filterValue, 'contains');
  }

  filterCampaignActivities(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.campaignsActivityTable.filterGlobal(filterValue, 'contains');
  }

  getAllSystems() {
    this.systemsService.getSystems()
      .pipe(
        untilDestroyed(this),
      )
      .subscribe({
        next: (data) => {
          this.systems = data;
        },
        error: (err) => {
          this.globalMessagingService.displayErrorMessage('Error', err.message);
        }
      })
  }

  getOrganizations() {
    this.organizationService.getOrganization()
      .pipe(
        untilDestroyed(this),
      )
      .subscribe({
        next: (data) => {
          this.organizations = data;
        },
        error: (err) => {
          this.globalMessagingService.displayErrorMessage('Error', err.message);
        }
      })
  }

  getCurrencies() {
    this.currencyService.getCurrencies()
      .pipe(
        untilDestroyed(this),
      )
      .subscribe({
        next: (data) => {
          this.currencies = data;
        },
        error: (err) => {
          this.globalMessagingService.displayErrorMessage('Error', err.message);
        }
      })
  }

  saveCampaignTarget() {

    const sortValues = this.targetSearchForm.getRawValue();

    log.info('form value', sortValues);

    const selectedTargetGroup = sortValues.group ? sortValues.group : '';
    log.info('save target', selectedTargetGroup);

    if (selectedTargetGroup === 'Client') {
      const clientSelect = this.selectedCampaignTargetClient;
      log.info("selClient", clientSelect);
      const saveCampaignMessagePayload: CampaignTargetsDTO = {
        accountCode: clientSelect[0].id,
        accountType: selectedTargetGroup,
        campaignCode: this.selectedCampaign?.campaign?.code,
        code: null,
        targetDate: ""
      }
      log.info("selClientPayload", saveCampaignMessagePayload);
      this.campaignsService.createCampaignTarget(saveCampaignMessagePayload)
        .subscribe({
          next: (data) => {
            this.globalMessagingService.displaySuccessMessage('Success', 'Successfully created a campaign target');

            this.targetSearchForm.reset();
            this.closeTargetModal();
            this.selectedCampaignTargetClient = null;
            this.fetchCampaignTargets();
          },
          error: (err) => {
            log.info('>>>>>>>>>', err.error.message)
            this.globalMessagingService.displayErrorMessage('Error', err.error.message);
          },
        });
    } else {
      const leadSelect = this.selectedCampaignTargetLead;
      log.info("selLead", leadSelect);
      const saveCampaignMessagePayload: CampaignTargetsDTO = {
        accountCode: leadSelect[0].code,
        accountType: selectedTargetGroup,
        campaignCode: this.selectedCampaign?.campaign?.code,
        code: null,
        targetDate: ""
      }
      log.info("selLeadPayload", saveCampaignMessagePayload);
      this.campaignsService.createCampaignTarget(saveCampaignMessagePayload)
        .subscribe(  {
            next: (data) => {
            this.globalMessagingService.displaySuccessMessage('Success', 'Successfully created a campaign target');

            this.targetSearchForm.reset();
            this.closeTargetModal();
            this.selectedCampaignTargetLead = null;
            this.fetchCampaignTargets();
          },
          error: (err) => {
            log.info('>>>>>>>>>', err.error.message)
            this.globalMessagingService.displayErrorMessage('Error', err.error.message);
          },
        });
    }
  }

  /**
   * The `editTarget` function toggles the edit mode and opens a modal for editing a target.
   */
  editCampaignTarget() {
    this.editMode = !this.editMode;
    if (this.selectedCampaign) {
      this.openTargetModal();
    } else {
      this.globalMessagingService.displayErrorMessage(
        'Error',
        'No campaign target is selected!'
      );
    }
  }

  deleteCampaignTarget() {
    if (this.selectedCampaignTarget) {
      const targetId = this.selectedCampaignTarget?.code;
      this.campaignsService.deleteCampaignTarget(targetId).subscribe( {
        next: (data) => {
          this.globalMessagingService.displaySuccessMessage(
            'success',
            'Successfully deleted a campaign target'
          );
          this.selectedCampaignTarget = null;
          this.fetchCampaignTargets();
        },
        error: (err) => {
          this.globalMessagingService.displayErrorMessage('Error', err.error.message);
        },
      });
    } else {
      this.globalMessagingService.displayErrorMessage(
        'Error',
        'No campaign target is selected.'
      );
    }
  }

  getActivities() {
    this.activityService.getActivities().subscribe({
      next: (data) => {
        this.activityData = data;
        log.info(`Activity data >>> `, data);
        this.cdr.detectChanges();
      },
      error: (err) => {
        let errorMessage = err?.error?.message ?? err.message;
        this.globalMessagingService.displayErrorMessage('Error', errorMessage);
      },
    });
  }

  getActivityTypes() {
    this.activityService.getActivityTypes().subscribe({
      next: (data) => {
        log.info(`activity types >>> `, data);
        this.activityTypeData = data;
        this.cdr.detectChanges();
      },
      error: (err) => {
        let errorMessage = err?.error?.message ?? err.message;
        this.globalMessagingService.displayErrorMessage('Error', errorMessage);
      },
    });
  }

  getActivityTypeDescription(activityTypeCode: number) {
    const activityType = this.activityTypeData?.find(
      (type) => type.id === activityTypeCode
    );
    return activityType ? activityType.desc : activityTypeCode;
  }

  saveActivity() {
    const formValues = this.createCampaignActivityForm.getRawValue();
    log.info(`activity form>> `, formValues);
    const payload: Activity = {
      id: null,
      activityTypeCode: formValues.type,
      wef: formValues.wef,
      wet: formValues.wet,
      duration: null,
      subject: formValues.subject,
      location: formValues.location,
      assignedTo: null,
      relatedTo: null,
      statusId: null,
      desc: formValues.activityDescription,
      reminder: null,
      team: null,
      reminderTime: null,
      messageCode: null,
    };

    this.activityService.createActivity(payload).subscribe({
      next: (res) => {
        this.globalMessagingService.displaySuccessMessage(
          'Success',
          'Activity created successfully!'
        );
        this.createCampaignActivityForm.reset();
        this.getActivities();
        this.closeNewCampaignActivityModal();
      },
      error: (err) => {
        let errorMessage = err?.error?.message ?? err.message;
        this.globalMessagingService.displayErrorMessage('Error', errorMessage);
      },
    });
  }

  saveCampaignActivity() {
    log.info("Activity>>", this.selectedActivity)
    const payload: CampaignActivitiesDTO = {
      code: 0,
      campaignCode: this.selectedCampaign?.campaign?.code,
      campaignActCode: this.selectedActivity?.id
      /*id: null,
      activityTypeCode: formValues.type,
      wef: formValues.wef,
      wet: formValues.wet,
      duration: null,
      subject: formValues.subject,
      location: formValues.location,
      assignedTo: null,
      relatedTo: null,
      statusId: null,
      desc: formValues.activityDescription,
      reminder: null,
      team: null,
      reminderTime: null,
      messageCode: null,*/
    };

    this.campaignsService.createCampaignActivity(payload).subscribe({
      next: (res) => {
        this.globalMessagingService.displaySuccessMessage(
          'Success',
          'Campaign activity created successfully!'
        );
        this.createCampaignActivityForm.reset();
        this.getCampaignActivities();
        this.closeCampaignActivityModal();
      },
      error: (err) => {
        let errorMessage = err?.error?.message ?? err.message;
        this.globalMessagingService.displayErrorMessage('Error', errorMessage);
      },
    });
  }

  deleteCampaignActivity() {
    this.campaignActivityConfirmationModal.show();
  }

  confirmCampaignActivityDelete() {
    if (this.selectedCampaignActivity) {
      const campaignActivityId = this.selectedCampaignActivity.code;
      this.campaignsService.deleteCampaignActivity(campaignActivityId).subscribe({
        next: (data) => {
          this.globalMessagingService.displaySuccessMessage(
            'success',
            'Successfully deleted a campaign activity'
          );
          this.selectedCampaignActivity = null;
          this.getCampaignActivities();
        },
        error: (err) => {
          this.globalMessagingService.displayErrorMessage('Error', err.error.message);
        },
      });
    } else {
      this.globalMessagingService.displayErrorMessage(
        'Error',
        'No campaign activity is selected.'
      );
    }
  }

  getCampaignActivities() {
    this.campaignsService.getCampaignActivities(this.selectedCampaign?.campaign?.code).subscribe({
      next: (data) => {
        this.campaignActivityData = data;
        log.info(`Campaign activity data >>> `, data);
        // this.loadCampaignSpecificActivities();
        this.cdr.detectChanges();
      },
      error: (err) => {
        let errorMessage = err?.error?.message ?? err.message;
        this.globalMessagingService.displayErrorMessage('Error', errorMessage);
      },
    });
  }

  ngOnDestroy(): void {}
}

interface AllProduct {
  code: number,
  description: string
}
