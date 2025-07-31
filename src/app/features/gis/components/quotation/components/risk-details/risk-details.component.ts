import { ChangeDetectorRef, Component, ElementRef, Input, Renderer2, SimpleChanges, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Logger, untilDestroyed } from '../../../../../../shared/shared.module'
import { ClientService } from 'src/app/features/entities/services/client/client.service';
import { GlobalMessagingService } from 'src/app/shared/services/messaging/global-messaging.service';
import { PolicyService } from '../../../policy/services/policy.service';
import { BinderService } from '../../../setups/services/binder/binder.service';
import { PremiumRateService } from '../../../setups/services/premium-rate/premium-rate.service';
import { ProductsService } from '../../../setups/services/products/products.service';
import { RiskClausesService } from '../../../setups/services/risk-clauses/risk-clauses.service';
import { SectionsService } from '../../../setups/services/sections/sections.service';
import { SubClassCoverTypesSectionsService } from '../../../setups/services/sub-class-cover-types-sections/sub-class-cover-types-sections.service';
import { SubClassCoverTypesService } from '../../../setups/services/sub-class-cover-types/sub-class-cover-types.service';
import { SubclassesService } from '../../../setups/services/subclasses/subclasses.service';
import { VehicleMakeService } from '../../../setups/services/vehicle-make/vehicle-make.service';
import { VehicleModelService } from '../../../setups/services/vehicle-model/vehicle-model.service';
import { QuotationsService } from '../../services/quotations/quotations.service';
import { SharedQuotationsService } from '../../services/shared-quotations.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Clause, DynamicRiskField, QuotationDetails, quotationRisk, RiskInformation, riskSection } from '../../data/quotationsDTO';
import { Premiums, subclassClauses, SubclassCoverTypes, vehicleMake, vehicleModel } from '../../../setups/data/gisDTO';
import { ClientDTO } from 'src/app/features/entities/data/ClientDTO';
import { debounceTime, distinctUntilChanged, forkJoin, map, Observable, switchMap, tap } from 'rxjs';
import { Table } from 'primeng/table';
import { NgxCurrencyConfig } from "ngx-currency";
import { trigger, state, style, transition, animate } from '@angular/animations';
import * as bootstrap from 'bootstrap';
import { riskClause } from 'src/app/features/gis/data/quotations-dto';


const log = new Logger('RiskDetailsComponent');

@Component({
  selector: 'app-risk-details',
  templateUrl: './risk-details.component.html',
  styleUrls: ['./risk-details.component.css'],
  animations: [
    trigger('slideInOut', [
      state('open', style({
        height: '*', // Expand to fit content
        opacity: 1,
        overflow: 'hidden',
      })),
      state('closed', style({
        height: '0', // Collapse to 0 height
        opacity: 0,
        overflow: 'hidden',
      })),
      transition('open <=> closed', [
        animate('300ms ease-in-out') // Smooth transition
      ]),
    ]),
  ],
})

export class RiskDetailsComponent {
  freeLimitValue: any;
  sumInsured: number;
  getFreeLimitLabel(arg0: any) {
    throw new Error('Method not implemented.');
  }
  @Input() selectedProduct!: any;
  @ViewChild('sectionTable') sectionTable!: Table;
  @ViewChild('addRiskModal') addRiskModalRef!: ElementRef;
  @ViewChild('addRiskSection') addRiskSectionRef!: ElementRef;
  @ViewChild('editSectionModal') editSectionModal!: ElementRef;
  private modals: { [key: string]: bootstrap.Modal } = {};

  @ViewChild('riskClauseTable') riskClauseTable: any;
  modalInstance: any;
  sectionInstance: any;

  riskDetails: RiskInformation[] = [];
  riskDetailsForm: FormGroup;
  minDate: Date | undefined;
  motorClassAllowed: string;
  showMotorSubclassFields: boolean = false;
  showNonMotorSubclassFields: boolean = false;
  dateFormat: string;
  coverFromDate: string;
  coverToDate: string;
  midnightexpiry: any;
  binderList: any;
  binderListDetails: any;
  selectedBinderList: any;
  selectedBinderCode: any;
  selectedCoverType: SubclassCoverTypes;
  subclassCoverType: SubclassCoverTypes[] = [];
  passedCoverTypeCode: number;
  coverTypeCode: any;
  storedRiskFormDetails: quotationRisk = null
  vehicleMakeList: vehicleMake[];
  vehicleModelList: any;
  vehicleModelDetails: vehicleModel[];
  filteredVehicleModel: any;
  selectedVehicleMakeCode: any;
  vehiclemakeModel: any = '';
  selectedVehicleMakeName: any;
  selectedVehicleModelName: any;
  passedRiskId: any;
  allMatchingSubclasses = [];
  selectedSubclassCode: any
  passedSubclassCode: number;
  defaultBinder: any;
  defaultBinderName: any;
  regexPattern: string;
  taxList: any;
  clientList: ClientDTO[];
  client: ClientDTO[];
  clientName: any;
  selectedClientList: ClientDTO;
  insuredCode: any;
  quotationCode: any;
  quotationNumber: string;
  quotationDetails: QuotationDetails;
  selectedProductCode: any;
  quotationRiskData: any;
  quoteProductCode: any;
  quotationRiskCode: any
  sectionPremium: Premiums[] = [];
  passedCoverFromDate: string;
  passedCoverToDate: string;

  scheduleDetailsForm: FormGroup;
  level2DetailsForm: FormGroup;
  scheduleData: any;
  scheduleList: any;
  selectedSchedule: any;
  updatedSchedule: any;
  updatedScheduleData: any;
  passedlevel: any;
  bodytypesList: any;
  motorColorsList: any;
  securityDevicesList: any;
  motorAccessoriesList: any;
  modelYear: any;
  selectedRisk: RiskInformation;

  selectedSections: Premiums[] = [];
  selectedSection: any;
  sectionDetails: any[] = [];
  sectionDetailsForm: FormGroup;
  riskSectionList: riskSection[] = [];
  // quotationCode: any
  // quotationRiskCode: any;
  // quotationRiskData: any;
  selectedRiskSection: any;
  inputErrors: { [key: string]: boolean } = {};
  private typingTimer: any;// Timer reference
  passedSections: any[] = [];
  sectionToBeRemoved: number[] = [];
  public currencyObj: NgxCurrencyConfig;

  editing = false; // Add other properties as needed
  modalHeight: number = 200; // Initial height
  clauseList: Clause[];
  // selectedClauseList: Clause[];
  SubclauseList: any[] = [];
  selectedSubClauseList: subclassClauses[];
  selectedClauseCode: any;
  // clauseDetail:any;
  selectedClause: subclassClauses[] = [];
  nonMandatoryClauses: subclassClauses[] = [];
  riskClause: subclassClauses[] = [];
  selectProductCode: any
  showOtherSscheduleDetails: boolean = false;
  formContent: any;
  formData: {
    type: string;
    name: string;
    max: number
    min: number
    isMandatory: string;
    disabled: boolean;
    readonly: boolean;
    regexPattern: string;
    placeholder: string;
    label: string;
    selectOptions?: { label: string; value: any }[];
  }[];
  subclassFormContent: any
  subclassFormData: {
    type: string;
    name: string;
    max: number
    min: number
    isMandatory: string;
    disabled: boolean;
    readonly: boolean;
    regexPattern: string;
    placeholder: string;
    label: string;
    scheduleLevel: string
    selectOptions?: { label: string; value: any }[];
  }[];
  existingPropertyIds: string[] = [];
  dynamicRegexPattern: string;
  clientsData: ClientDTO[] = [];
  sectionToDelete: any = null;
  declaration1: boolean | null = null;
  declaration2: boolean | null = null;
  premiumTypes: any[] = [];
  isEditable: boolean = false;
  quotationIsAuthorised: boolean = true; // or false
  yearList: any;
  clientCode: number;
  showSections: boolean = false;
  tabs = ['Schedule Details', 'Level 2', 'Level 3']; // Dummy tabs for now
  activeTab = 'Schedule Details';
  isEditMode: boolean = false;
  selectedRiskClauses: any;
  clauseModified: boolean = false;
  sessionClauses: any[] = [];
  selectedRiskCode: any;
  showRiskClauses: boolean = true;
  showClauseModal: boolean = false;
  clausesModified: boolean = false;
  clauses: any;
  selectedRiskClause: any = {
    id: '',
    heading: '',
    wording: ''
  };
  originalClauseBeforeEdit: any = null;
  clauseToDelete: any = null;

  constructor(
    public subclassService: SubclassesService,
    private subclassCoverTypesService: SubClassCoverTypesService,
    public sharedService: SharedQuotationsService,
    public binderService: BinderService,
    public clientService: ClientService,
    public quotationService: QuotationsService,
    public sectionService: SectionsService,
    public subclassSectionCovertypeService: SubClassCoverTypesSectionsService,
    public vehicleMakeService: VehicleMakeService,
    public vehicleModelService: VehicleModelService,
    public producSetupService: ProductsService,
    public premiumRateService: PremiumRateService,
    public riskClauseService: RiskClausesService,
    public globalMessagingService: GlobalMessagingService,
    private policyService: PolicyService,
    public productService: ProductsService,
    public fb: FormBuilder,
    public cdr: ChangeDetectorRef,
    private renderer: Renderer2

  ) {
    this.quotationCode = sessionStorage.getItem('quotationCode');
    this.quotationNumber = sessionStorage.getItem('quotationNum');
    log.debug("Quotation number from session storage:", this.quotationNumber)


  }

  public isCollapsibleOpen = false;
  public isOtherDetailsOpen = false;
  public isSectionDetailsOpen = false;
  public isThirdDetailsOpen = false;
  public isClausesOpen = false;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['selectedProduct']) {
      console.log("Selected Product-risk details:", this.selectedProduct);
      const selectedProductCode = this.selectedProduct.productCode
      this.selectedProductCode = selectedProductCode
      this.loadSelectedProductRiskFields(selectedProductCode)
      this.getProductSubclass(selectedProductCode)
      // this.checkMotorClass()
      const quoatationNo = this.selectedProduct.quotationNo
      const quoatationCode = this.selectedProduct.quotationCode
      this.fetchQuotationDetails(quoatationCode)
      // this.fetchRisksLimits(quoatationCode)
      this.scheduleList = []
      this.sectionPremium = []
      // this.sectionDetails = []
      this.showOtherSscheduleDetails = false;

    }
  }

  ngOnInit(): void {
    this.loadPersistedRiskClauses();

    this.riskDetailsForm = new FormGroup({
      subclass: new FormControl(null)
    });
    this.dateFormat = sessionStorage.getItem('dateFormat');
    log.debug("Date Formart", this.dateFormat)
    this.getVehicleMake();
    // this.updateRiskDetailsForm();
    this.createScheduleDetailsForm();
    this.createSectionDetailsForm();
    const currencyDelimiter = sessionStorage.getItem('currencyDelimiter');
    const currencySymbol = sessionStorage.getItem('currencySymbol')
    log.debug("currency Object:", currencySymbol)
    log.debug("currency Delimeter:", currencyDelimiter)
    this.currencyObj = {
      prefix: currencySymbol + ' ',
      allowNegative: false,
      allowZero: false,
      decimal: '.',
      precision: 0,
      thousands: currencyDelimiter,
      suffix: ' ',
      nullable: true,
      align: 'left',
    };
    this.loadDummyFreeLimit();

    this.clientCode = Number(sessionStorage.getItem('insuredCode'))
    console.log(Object.keys(this.sectionPremium[0]));

    // this.clientCode = Number(sessionStorage.getItem('insuredCode'))
    this.loadAllClients();

  }
  ngOnDestroy(): void { }

  ngAfterViewInit(): void {
    this.modals['editSection'] = new bootstrap.Modal(this.editSectionModal.nativeElement);

    // Initialize addRiskModal
    if (this.addRiskModalRef?.nativeElement) {
      this.modalInstance = new bootstrap.Modal(this.addRiskModalRef.nativeElement, {
        backdrop: 'static',
        keyboard: false
      });
    }

    // Initialize addRiskSection (if treated like another modal)
    if (this.addRiskSectionRef?.nativeElement) {
      this.sectionInstance = new bootstrap.Modal(this.addRiskSectionRef.nativeElement, {
        backdrop: 'static',
        keyboard: false
      });
    }
  }

  openModals(modalName: string) {
    this.modals[modalName]?.show();
  }

  closeModals(modalName: string) {
    this.modals[modalName]?.hide();
  }




  setDeclaration1(value: boolean) {
    this.declaration1 = value;
    this.riskDetailsForm.get('declarationField')?.setValue(value ? 'Yes' : 'No'); // Optional
  }

  setDeclaration2(value: boolean) {
    this.declaration2 = value;
    this.riskDetailsForm.get('computeField')?.setValue(value ? 'Yes' : 'No'); // Optional
  }

  loadDummyFreeLimit() {

    const dummyResponse = {
      value: 100000,
      editable: false
    };

    this.freeLimitValue = dummyResponse.value;
    this.isEditable = dummyResponse.editable;

    if (this.isEditable) {
      this.riskDetailsForm.get('freeLimit')?.setValue(this.freeLimitValue);
    }
  }


  setSectionToDelete(section: any) {
    this.sectionToDelete = section;
    log.debug("Section to delete", this.sectionToDelete)
  }
  confirmDelete() {
    if (this.sectionToDelete) {
      const sectionCode = this.sectionToDelete.code
      sectionCode && this.deleteRiskSection(sectionCode)

    }
  }

  fetchQuotationDetails(quotationCode: number) {
    log.debug("Quotation Number tot use:", quotationCode)
    this.quotationService.getQuotationDetails(quotationCode)
      .subscribe({
        next: (res: any) => {
          this.quotationDetails = res;
          log.debug("Quotation details-risk details", this.quotationDetails);
          this.insuredCode = this.quotationDetails.clientCode
          this.clientCode = this.quotationDetails.clientCode
          if (this.insuredCode) {
            this.loadClientDetails();
            this.loadAllClients();
          }
          this.passedCoverFromDate = this.quotationDetails.coverFrom
          this.passedCoverToDate = this.quotationDetails.coverTo
          log.debug("Selected Product code -fetching:", this.selectedProductCode)
          const productDetails = this.quotationDetails.quotationProducts.find(
            product => product.productCode === this.selectedProductCode
          )
          this.riskDetails = productDetails?.riskInformation || []
          const curentlySavedRisk = this.riskDetails?.filter(risk => risk.code == this.quotationRiskCode)
          log.debug('Currently saved Risk:', curentlySavedRisk)
          curentlySavedRisk && this.handleRowClick(curentlySavedRisk[0])
          log.debug("Risk information specific to the selected product:", this.riskDetails)
          log.debug("Schedule information specific to the selected product:", this.scheduleList)
          if (this.scheduleList[0]?.details?.level2) {
            this.showOtherSscheduleDetails = true;
          } else {
            this.showOtherSscheduleDetails = false;

          }
        },
        error: (error: HttpErrorResponse) => {
          log.debug("Error log", error.error.message);

          this.globalMessagingService.displayErrorMessage(
            'Error',
            error.error.message
          );
        },

      })
  }



  selectAll: boolean = false;

  toggleSelectAll(event: any) {
    const checked = event.target.checked;
    this.sectionPremium.forEach((section: any) => {
      section.isChecked = checked;
    });
  }
  filterHeading(event: Event) {
    const input = event.target as HTMLInputElement;
    this.riskClauseTable.filter(input.value, 'heading', 'contains');
  }

  filterShortDesc(event: Event) {
    const input = event.target as HTMLInputElement;
    this.riskClauseTable.filter(input.value, 'shortDescription', 'contains');
  }
  filterWording(event: Event) {
    const input = event.target as HTMLInputElement;
    this.riskClauseTable.filter(input.value, 'wording', 'contains');
  }



  openAddRiskModal() {
    this.modalInstance?.show();
  }
  openEditRiskModal(risk: RiskInformation) {
    this.isEditMode = true
    this.modalInstance?.show();

    log.debug("Selected risk:", risk)
    this.riskDetailsForm.patchValue(risk);
    this.riskDetailsForm.patchValue({ subclass: risk.subclass.code });
    this.onSubclassSelected(risk.subclass)
  }
  // loadSelectedSubclassRiskFields(subclassCode: number): void {
  //   const riskFieldDescription = `detailed-risk-subclass-form-${subclassCode}`;

  //   this.quotationService.getFormFields(riskFieldDescription).subscribe({
  //     next: (response) => {
  //       const fields = response?.[0]?.fields || [];
  //       this.subclassFormContent = response;
  //       this.subclassFormData = fields.filter(field => field.scheduleLevel === "L1");

  //       log.debug('Loaded subclass form content:', this.subclassFormContent);
  //       log.debug('Filtered subclass form fields:', this.subclassFormData);

  //       // Remove only the old subclass controls, keep product-level controls intact
  //       Object.keys(this.riskDetailsForm.controls).forEach(controlName => {
  //         const control = this.riskDetailsForm.get(controlName) as any;
  //         if (control?.metadata?.dynamicSubclass) {
  //           this.riskDetailsForm.removeControl(controlName);
  //           log.debug(`Removed previous dynamicSubclass control: ${controlName}`);
  //         }
  //       });

  //       // Add new subclass controls
  //       this.subclassFormData.forEach(field => {
  //         if (!this.riskDetailsForm.get(field.name)) {
  //           const validators = field.isMandatory === 'Y' ? [Validators.required] : [];
  //           const control = new FormControl(this.getDefaultValue(field), validators);
  //           (control as any).metadata = { dynamicSubclass: true }; // tag it
  //           this.riskDetailsForm.addControl(field.name, control);
  //           log.debug(`Added new dynamicSubclass control: ${field.name}`);
  //         }
  //       });
  //       this.fetchRegexPattern();
  //       this.fetchScheduleRelatedData();

  //       log.debug('Final riskDetailsForm controls after adding subclass fields:', this.riskDetailsForm.controls);
  //     },
  //     error: (err) => {
  //       this.globalMessagingService.displayErrorMessage('Error', 'Unable to load subclass risks');
  //       log.error('Failed to load subclass form fields', err);
  //     }
  //   });
  // }
  loadSelectedSubclassRiskFields(subclassCode: number): Promise<void> {
    const riskFieldDescription = `detailed-risk-subclass-form-${subclassCode}`;

    return new Promise((resolve, reject) => {
      this.quotationService.getFormFields(riskFieldDescription).subscribe({
        next: (response) => {
          const fields = response?.[0]?.fields || [];
          this.subclassFormContent = response;
          this.subclassFormData = fields.filter(field => field.scheduleLevel === "L1");

          Object.keys(this.riskDetailsForm.controls).forEach(controlName => {
            const control = this.riskDetailsForm.get(controlName) as any;
            if (control?.metadata?.dynamicSubclass) {
              this.riskDetailsForm.removeControl(controlName);
            }
          });

          this.subclassFormData.forEach(field => {
            if (!this.riskDetailsForm.get(field.name)) {
              const validators = field.isMandatory === 'Y' ? [Validators.required] : [];
              const control = new FormControl(this.getDefaultValue(field), validators);
              (control as any).metadata = { dynamicSubclass: true };
              this.riskDetailsForm.addControl(field.name, control);
              log.debug(`Added new dynamicSubclass control: ${field.name}`);

            }
          });

          this.fetchRegexPattern();
          this.fetchScheduleRelatedData();
          const riskValue = this.riskDetailsForm.value
          log.debug("risk value for patching:", riskValue)
          if (this.isEditMode) {
            this.riskDetailsForm.patchValue({ registrationNumber: this.selectedRisk?.propertyId });
            this.riskDetailsForm.patchValue({ riskDescription: this.selectedRisk?.itemDesc });
            this.riskDetailsForm.patchValue({ coverType: this.selectedRisk?.coverTypeCode });
            this.riskDetailsForm.patchValue({ premiumBand: this.selectedRisk?.binderCode });
            this.riskDetailsForm.patchValue({ value: this.selectedRisk?.value });
            this.riskDetailsForm.patchValue({ vehicleMake: this.selectedRisk?.scheduleDetails.details.level1.make });
            this.riskDetailsForm.patchValue({ vehicleModel: this.selectedRisk?.scheduleDetails.details.level1.model });
            this.riskDetailsForm.patchValue({ yearOfManufacture: this.selectedRisk?.scheduleDetails.details.level1.yearOfManufacture });
            this.riskDetailsForm.patchValue({ cubicCapacity: this.selectedRisk?.scheduleDetails.details.level1.cubicCapacity });
            this.riskDetailsForm.patchValue({ seatingCapacity: this.selectedRisk?.scheduleDetails.details.level1.carryCapacity });
            this.riskDetailsForm.patchValue({ bodyType: this.selectedRisk?.scheduleDetails.details.level1.bodyType });
            this.riskDetailsForm.patchValue({ color: this.selectedRisk?.scheduleDetails.details.level1.color });
            this.riskDetailsForm.patchValue({ chasisNumber: this.selectedRisk?.scheduleDetails.details.level1.chasisNumber });
            this.riskDetailsForm.patchValue({ engineNumber: this.selectedRisk?.scheduleDetails.details.level1.engineNumber });
          }
          resolve();
        },
        error: (err) => {
          this.globalMessagingService.displayErrorMessage('Error', 'Unable to load subclass risks');
          reject(err);
        }
      });
    });
  }


  getDefaultValue(field: any): any {
    if (field.type === 'date') {
      return new Date();
    }
    return '';
  }

  //populates the dynamic risk fields
  safePopulateSelectOptions(formDataArray: any[], fieldName: string, options: any[], labelKey: string, valueKey: string) {
    if (formDataArray && Array.isArray(formDataArray)) {
      formDataArray.forEach(field => {
        if (field.name === fieldName) {
          field.selectOptions = options.map(opt => ({
            label: opt[labelKey],
            value: opt[valueKey]
          }));
        }
      });
      log.debug(`Populated selectOptions for '${fieldName}'`, formDataArray);
    } else {
      log.warn(`Cannot populate '${fieldName}', form data array is not ready`);
    }
  }


  loadSelectedProductRiskFields(productCode: number): void {
    const formFieldDescription = `detailed-quotation-risk-${productCode}`;

    this.quotationService.getFormFields(formFieldDescription).subscribe({
      next: (response) => {
        const fields = response?.[0]?.fields || [];

        this.formContent = response;
        this.formData = fields;

        log.debug(this.formContent, 'Form-content');
        log.debug(this.formData, 'formData is defined here');

        // Remove existing dynamic controls
        Object.keys(this.riskDetailsForm.controls).forEach((controlName) => {
          const control = this.riskDetailsForm.get(controlName) as any;
          if (control?.metadata?.dynamic) {
            this.riskDetailsForm.removeControl(controlName);
            log.debug(`Removed dynamic control: ${controlName}`);
          }
        });

        // Add new dynamic controls
        this.formData.forEach((field) => {
          const validators = field.isMandatory === 'Y' ? [Validators.required] : [];
          const formControl = new FormControl(this.getDefaultValue(field), validators);
          (formControl as any).metadata = { dynamic: true };
          this.riskDetailsForm.addControl(field.name, formControl);
        });

        log.debug(this.riskDetailsForm.value, 'Final Form Value');
      },
      error: (err) => {
        log.error(err, 'Failed to load risk fields');
      }
    });
  }

  // loadAllClients() {
  //   this.clientService.getClients()
  //     .subscribe({
  //       next: (data: any) => {
  //         data.content.forEach(client => {
  //           client.clientTypeName = client.clientType.clientTypeName;
  //           client.clientFullName = client.firstName + ' ' + (client.lastName || '');
  //         });
  //         this.clientsData = data.content;
  //         log.debug("CLIENT data", this.clientsData)

  //         // Populate selectOptions for insureds field
  //         this.safePopulateSelectOptions(this.formData, 'insureds', this.clientsData, 'clientFullName', 'id');

  //         // Ensure FormControl exists
  //         if (!this.riskDetailsForm.contains('insureds')) {
  //           this.riskDetailsForm.addControl('insureds', new FormControl('', Validators.required));
  //           log.debug('Added insureds control to the form');
  //         }

  //         // Now preselect if clientCode matches
  //         log.debug("CLIENT CODE", this.clientCode)
  //         // if (this.clientCode) {
  //         //   const selectedClient = this.clientsData.find(client => client.id === this.clientCode);
  //         //   if (selectedClient) {
  //         //     this.riskDetailsForm.patchValue({ insureds: selectedClient.id });
  //         //     log.debug('Preselected insured client in form:', selectedClient);
  //         //   }
  //         // }

  //         log.debug('Clients loaded and insureds options populated:', this.formData);
  //       },
  //       error: (err) => {
  //         log.error('Failed to fetch clients', err);
  //       }
  //     });
  // }
  loadAllClients() {
    const pageSize = 100
    const pageIndex = 0;
    this.clientService.getClients(pageIndex, pageSize).subscribe({
      next: (data: any) => {
        // Format clients
        data.content.forEach(client => {
          client.clientTypeName = client.clientType?.clientTypeName;
          client.clientFullName = client.firstName + ' ' + (client.lastName || '');
        });

        this.clientsData = data.content;
        log.debug('client data', this.clientsData)
        // // Add the control if it doesn't exist
        // if (!this.riskDetailsForm.contains('insureds')) {
        //   this.riskDetailsForm.addControl('insureds', new FormControl('', Validators.required));
        // }

        // // Pre-select if clientCode is provided
        // log.debug('client codeload all:', this.clientCode)
        // if (this.clientCode) {
        //   const selectedClient = this.clientsData.find(c => c.id === this.clientCode);
        //   log.debug('selected client codeload all:', selectedClient)

        //   if (selectedClient) {
        //     this.riskDetailsForm.patchValue({ insureds: selectedClient.id });
        //   }
        // }
      },
      error: (err) => {
        log.error('Failed to fetch clients', err);
      }
    });
  }



  // loadClientDetails() {
  //   this.clientService.getClientById(this.insuredCode).subscribe((data: any) => {
  //     this.selectedClientList = data;
  //     log.debug('Selected Client Details:', this.selectedClientList);

  //     this.clientName = this.selectedClientList?.firstName + ' ' + this.selectedClientList?.lastName;
  //     log.debug("Client NAME", this.clientName)


  //   });
  // }
  loadClientDetails() {
    this.clientService.getClientById(this.insuredCode).subscribe((data: any) => {
      const client = data;
      client.clientFullName = client.firstName + ' ' + (client.lastName || '');

      this.clientName = client.clientFullName;

      // Set dropdown options
      this.clientsData = [client]; // wrap in array for dropdown options

      // Add the control if it doesn't exist
      if (!this.riskDetailsForm.contains('insureds')) {
        this.riskDetailsForm.addControl('insureds', new FormControl('', Validators.required));
      }

      // Pre-select the dropdown
      this.riskDetailsForm.patchValue({ insureds: client.id });
    });
  }

  checkMotorClass() {
    this.productService.getProductDetailsByCode(this.selectedProductCode).subscribe(res => {
      log.debug("Product Response", res);
      this.motorClassAllowed = res.allowMotorClass
      log.debug("Motor class Allowed:", this.motorClassAllowed)
      if (this.motorClassAllowed === 'Y') {
        this.showMotorSubclassFields = true;
        this.showNonMotorSubclassFields = false;

        // this.motorProduct = true;
      } else if (this.motorClassAllowed == 'N') {
        this.showNonMotorSubclassFields = true;
        this.showMotorSubclassFields = false;

        // this.motorProduct = false;
      }


    });
  }


  get f() {
    return this.riskDetailsForm.controls;
  }
  updateCoverToDate(date) {
    log.debug("Cover from date:", date)
    const coverFromDate = date;
    const formattedCoverFromDate = this.formatDate(coverFromDate);
    log.debug('FORMATTED cover from DATE:', formattedCoverFromDate);
    // this.producSetupService.getProductByCode(this.quotationForm.value.productCode).subscribe(res=>{
    //   this.productDetails = res
    //   log.debug(this.productDetails)
    // if(this.productDetails.expires === 'Y'){
    this.producSetupService.getCoverToDate(formattedCoverFromDate, this.selectedProductCode)
      .subscribe({
        next: (res) => {
          this.midnightexpiry = res;
          log.debug("midnightexpirydate", this.midnightexpiry);
          log.debug(this.midnightexpiry)
          const coverFrom = this.midnightexpiry._embedded[0].coverToDate
          const coverFromDate = new Date(coverFrom)
          // Extract the day, month, and year
          const day = coverFromDate.getDate();
          const month = coverFromDate.toLocaleString('default', { month: 'long' }); // 'long' gives the full month name
          const year = coverFromDate.getFullYear();

          // Format the date in 'dd-Month-yyyy' format
          const formattedDate = `${day}-${month}-${year}`;

          this.coverToDate = formattedDate;
          log.debug('Cover to  Date', this.coverToDate);
          // this.riskDetailsForm.controls['wet'].setValue(this.coverToDate)
          this.riskDetailsForm.patchValue({ wet: this.coverToDate });


        },
        error: (error: HttpErrorResponse) => {
          log.debug("Error log", error.error.message);

          this.globalMessagingService.displayErrorMessage(
            'Error',
            error.error.message
          );
        },

      })

  }
  formatDate(date: string | Date): string {
    // Check if the date is in the format "5-March-2025"
    if (typeof date === 'string' && /^\d{1,2}-[A-Za-z]+-\d{4}$/.test(date)) {
      // Split the date into day, month, and year
      const [day, month, year] = date.split('-');

      // Convert month name to month number (e.g., "March" -> 3)
      const monthNumber = new Date(`${month} 1, ${year}`).getMonth() + 1;

      // Format the date as "YYYY-MM-DD"
      return `${year}-${String(monthNumber).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    }

    // If the date is already in ISO format (e.g., "2025-03-05"), convert it to a Date object
    if (typeof date === 'string' && date.includes('T')) {
      date = new Date(date); // Convert ISO string to Date object
    }

    // If the date is a Date object, format it as "YYYY-MM-DD"
    if (date instanceof Date) {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    }

    // If the date is already in the correct format or cannot be formatted, return it as is
    return date as string;
  }
  onBinderSelected(event: any) {
    const selectedValue = event.value;
    log.debug("Selected value(On binder selected", selectedValue)
    this.selectedBinderList = selectedValue;
    this.selectedBinderCode = this.selectedBinderList.code

  }
  onCoverTypeSelected(event: any) {
    const selectedValue = event.value;
    log.debug("Selected value(On Covertype selected", selectedValue)
    this.selectedCoverType = selectedValue;


  }
  /**
 * Load cover types by subclass code
 * @param code {number} subclass code
 */
  loadCovertypeBySubclassCode(code: number) {
    this.subclassCoverTypesService.getSubclassCovertypeBySCode(code).subscribe(data => {
      this.subclassCoverType = data.map(value => ({
        ...value,
        description: value.description.charAt(0).toUpperCase() + value.description.slice(1).toLowerCase()
      }));
      log.debug('Processed covertypes:', this.subclassCoverType);

      // Inject into the subclass formData
      // this.subclassFormData = this.subclassFormData.map(field => {
      //   if (field.name === 'coverType') {
      //     return {
      //       ...field,
      //       selectOptions: this.subclassCoverType.map(cover => ({
      //         label: cover.description,
      //         value: cover.coverTypeCode
      //       }))
      //     };
      //   }
      //   return field;
      // });

      this.safePopulateSelectOptions(this.subclassFormData, 'coverType', this.subclassCoverType, 'description', 'coverTypeCode');

      const coverTypeCodeToUse = this.storedRiskFormDetails?.coverTypeCode || this.passedCoverTypeCode;
      if (coverTypeCodeToUse) {
        this.riskDetailsForm.patchValue({
          covertype: coverTypeCodeToUse
        });
      }


      this.cdr.detectChanges();
    });
  }

  getVehicleMake() {
    this.vehicleMakeService.getAllVehicleMake().subscribe(data => {
      this.vehicleMakeList = data;

      this.vehicleMakeList = data.map((value) => {
        let capitalizedDescription =
          value.name.charAt(0).toUpperCase() +
          value.name.slice(1).toLowerCase();
        return {
          ...value,
          name: capitalizedDescription,
        };
      });

      log.debug('this is the vehicle make list >>>', this.vehicleMakeList)

      // Inject into the subclass formData
      this.safePopulateSelectOptions(this.subclassFormData, 'vehicleMake', this.vehicleMakeList, 'name', 'code');


      log.debug("VehicleMake list", this.vehicleMakeList)
      if (this.storedRiskFormDetails) {
        const selectedVehicleMake = this.vehicleMakeList.find(make => make.code === this.storedRiskFormDetails?.vehicleMake);
        if (selectedVehicleMake) {
          log.debug("selected vehicle make:", selectedVehicleMake)
          this.riskDetailsForm.patchValue({ vehicleMake: selectedVehicleMake });
        }
        this.getVehicleModel(selectedVehicleMake.code)
      }


    })
  }


  onVehicleMakeSelected(event: any) {
    const selectedMakeCode = event.value;
    log.debug("Selected Vehicle Make Code:", selectedMakeCode);
    const selectedObject = this.vehicleMakeList.find(vehicleMake => vehicleMake.code === selectedMakeCode);
    this.selectedVehicleMakeName = selectedObject.name
    if (selectedMakeCode) {
      this.getVehicleModel(selectedMakeCode);
    }
  }


  convertToCorrectType(value: any): any {
    // Implement the conversion logic based on the actual type of your identifier
    // For example, if your identifier is a number, you can use parseInt or parseFloat
    // If it's another type, implement the conversion accordingly
    return parseInt(value, 10); // Adjust based on your actual data type
  }


  getVehicleModel(code: number) {
    const vehicleMakeCode = code;
    this.vehicleModelService.getAllVehicleModel(vehicleMakeCode).subscribe(data => {
      this.vehicleModelList = data;
      this.vehicleModelDetails = this.vehicleModelList._embedded.vehicle_model_dto_list.map((value) => ({
        ...value,
        name: value.name.charAt(0).toUpperCase() + value.name.slice(1).toLowerCase()
      }));

      log.debug("Vehicle Model Details", this.vehicleModelDetails);
      sessionStorage.setItem('vehicleModelList', JSON.stringify(this.vehicleModelDetails));

      // populate 
      this.safePopulateSelectOptions(this.subclassFormData, 'vehicleModel', this.vehicleModelDetails, 'name', 'code');

      // patch if stored data exists
      if (this.storedRiskFormDetails) {
        const selectedVehicleModel = this.vehicleModelDetails.find(model => model.code === this.storedRiskFormDetails?.vehicleModel);
        if (selectedVehicleModel) {
          this.riskDetailsForm.patchValue({ vehicleModel: selectedVehicleModel.code });
        }
      }
    });
  }



  onVehicleModelSelected(event: any) {
    const selectedValue = event.value.code;
    const vehicleModel = this.riskDetailsForm.value.vehicleModel || selectedValue
    // Convert selectedValue to the appropriate type (e.g., number)
    const typedSelectedValue = this.convertToCorrectType(vehicleModel);

    // Find the selected object using the converted value
    const selectedObject = this.vehicleModelDetails.find(vehicleModel => vehicleModel.code === typedSelectedValue);

    // Check if the object is found
    if (selectedObject) {
      log.debug('Selected Vehicle Model:', selectedObject);
      sessionStorage.setItem('selectedVehicleModel', JSON.stringify(selectedObject));

      // Perform further actions with the selected object as needed
    } else {
      console.error('Selected Vehicle Model not found');
    }
    this.selectedVehicleModelName = selectedObject.name;
    this.vehiclemakeModel = this.selectedVehicleMakeName + ' ' + this.selectedVehicleModelName;
    log.debug('Selected Vehicle make model', this.vehiclemakeModel);
    if (this.vehiclemakeModel) {
      this.riskDetailsForm.patchValue({ riskDescription: this.vehiclemakeModel });
    }

  }

  convertModelToCorrectType(value: any): any {
    // Implement the conversion logic based on the actual type of your code property
    // For example, if your code property is a number, you can use parseInt or parseFloat
    // If it's another type, implement the conversion accordingly
    return parseInt(value, 10); // Adjust based on your actual data type
  }
  // transformToUpperCase(event: Event): void {
  //   const input = event.target as HTMLInputElement;
  //   const upperCaseValue = input.value.toUpperCase();
  //   this.riskDetailsForm
  //     .get('propertyId')
  //     ?.setValue(upperCaseValue, { emitEvent: false });
  // }
  riskIdPassed(event: any): void {


    if (event instanceof Event) {
      this.passedRiskId = (event.target as HTMLInputElement).value;
    } else {
      this.passedRiskId = event;
    }

    if (this.passedRiskId !== undefined) {
      log.debug('Passed Risk Id', this.passedRiskId);
    } else {
      console.error('Unable to retrieve value from the event object.');
    }
  }

  getProductSubclass(code: number) {
    this.subclassService.getProductSubclasses(code).pipe(
      untilDestroyed(this)
    ).subscribe((subclasses) => {
      this.allMatchingSubclasses = subclasses.map((value) => {
        return {
          ...value,
          description: this.capitalizeWord(value.description),
        }
      });

      if (this.formData) {
        this.formData.forEach((field) => {
          if (field.name === 'subclass') {
            field.selectOptions = this.allMatchingSubclasses.map(subclass => ({
              label: subclass.description,
              value: subclass.code
            }));
          }
        });
      }
      log.debug("Subclasses-risk details:", this.allMatchingSubclasses)
      // Determine the subclass code to use (from storedRiskFormDetails or storedData)
      const subClassCodeToUse = this.storedRiskFormDetails?.subclassCode || this.passedSubclassCode;

      // If a subclass code is found, patch the form with the corresponding subclass
      if (subClassCodeToUse) {
        const selectedSubclass = this.allMatchingSubclasses.find(subclass => subclass.code === subClassCodeToUse);
        if (selectedSubclass) {
          // Patch the form with the selected subclass
          this.riskDetailsForm.patchValue({ subclassCode: selectedSubclass });

          // Manually call onSubclassSelected to handle the selected subclass
          // this.onSubclassSelected({ value: selectedSubclass });

          // this.selectedSubclassCode = subClassCodeToUse; // Update the selected subclass code
          // this.loadAllBinders(); // Load all binders
        }
      } else {
        // If no subclass code is found, patch the form with the first subclass in the list
        if (this.allMatchingSubclasses.length > 0) {
          const firstSubclass = this.allMatchingSubclasses[0];
          // this.riskDetailsForm.patchValue({ subclassCode: firstSubclass });

          // Manually call onSubclassSelected to handle the first subclass
          // this.onSubclassSelected({ value: firstSubclass });

          this.selectedSubclassCode = firstSubclass.code; // Update the selected subclass code
          // this.loadAllBinders(); // Load all binders
        }
      }
    })
  }

  // onSubclassSelected(event: any) {
  //   this.selectedSubclassCode = event.value;
  //   log.debug("Selected subclass code:", this.selectedSubclassCode);

  //   if (this.selectedSubclassCode) {
  //     this.loadSelectedSubclassRiskFields(this.selectedSubclassCode);

  //     this.fetchTaxes();
  //     this.loadCovertypeBySubclassCode(this.selectedSubclassCode);
  //     this.loadAllBinders();
  //     this.loadSubclassClauses(this.selectedSubclassCode);
  //     this.getVehicleMake();
  //     this.fetchYearOfManufacture()
  //   }
  // }

  async onSubclassSelected(event: any) {
    this.selectedSubclassCode = event.value || event.code;
    log.debug("Selected subclass code:", this.selectedSubclassCode);

    if (this.selectedSubclassCode) {
      try {
        await this.loadSelectedSubclassRiskFields(this.selectedSubclassCode);

        this.fetchTaxes();
        this.loadCovertypeBySubclassCode(this.selectedSubclassCode);
        this.loadAllBinders();
        this.loadSubclassClauses(this.selectedSubclassCode);
        this.getVehicleMake();
        this.fetchYearOfManufacture();
      } catch (err) {
        log.error("Failed to load subclass risk fields:", err);
        this.globalMessagingService.displayErrorMessage('Error', 'Failed to load subclass data');
      }
    }
  }

  capitalizeWord(value: String): string {
    return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
  }

  loadAllBinders() {
    this.binderService.getAllBindersQuick(this.selectedSubclassCode).subscribe(
      (data) => {
        this.binderList = data;

        this.binderListDetails = this.binderList._embedded.binder_dto_list;

        // Map and capitalize binder names
        this.binderListDetails = this.binderListDetails.map((value) => {
          let capitalizedDescription = value.binder_name.charAt(0).toUpperCase() + value.binder_name.slice(1).toLowerCase();
          return {
            ...value,
            binder_name: capitalizedDescription,
          };
        });

        log.debug("binder list", this.binderListDetails)

        // Inject into the subclass formData
        this.subclassFormData = this.subclassFormData.map(field => {
          if (field.name === 'premiumBand') {
            return {
              ...field,
              selectOptions: this.binderListDetails.map(binder => ({
                label: binder.binder_short_description,
                value: binder.code
              }))
            };
          }
          return field;
        });

        log.debug("All Binders Details:", this.binderListDetails);
        sessionStorage.setItem('binderList', JSON.stringify(this.binderListDetails));

        // Find default binder
        this.defaultBinder = this.binderListDetails.filter(binder => binder.is_default === "Y");
        log.debug("Default Binder", this.defaultBinder);

        // Set default binder object (not just the name)
        if (this.defaultBinder && this.defaultBinder.length > 0) {
          this.defaultBinderName = this.defaultBinder[0].binder_name;
          this.selectedBinderList = this.defaultBinder[0]; // Store the complete object
          this.selectedBinderCode = this.defaultBinder[0].code; // Set the code as well
          log.debug("Default Binder name", this.defaultBinderName);
          log.debug("Selected binder code", this.selectedBinderCode);
        }
        if (this.storedRiskFormDetails) {
          const selectedBinder = this.binderListDetails.find(binder => binder.code === this.storedRiskFormDetails?.binderCode);
          if (selectedBinder) {
            this.riskDetailsForm.patchValue({ premiumBand: selectedBinder.binder_name });

          }
        }
        this.cdr.detectChanges();

        // Update form control value with default binder
        if (this.riskDetailsForm && this.defaultBinder && this.defaultBinder.length > 0) {
          this.riskDetailsForm.get('premiumBand').setValue(this.defaultBinder[0].code);
        }
      },
      (error) => {
        log.error("Error loading binders:", error);
        // Handle error appropriately
      }
    );
  }

  fetchRegexPattern() {
    this.quotationService
      .getRegexPatterns(this.selectedSubclassCode)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (response: any) => {
          this.regexPattern = response._embedded?.riskIdFormat;
          log.debug('New Regex Pattern', this.regexPattern);

          this.dynamicRegexPattern = this.regexPattern;
          log.debug("fetch regex risk details:", this.riskDetailsForm.value)
          const control = this.riskDetailsForm.get('registrationNumber') as FormControl;

          if (control) {
            // Add your required validators here
            control.setValidators([
              Validators.required,
              Validators.pattern(this.dynamicRegexPattern)
            ]);

            control.updateValueAndValidity();
          }
        },
        error: (error) => {
          this.globalMessagingService.displayErrorMessage(
            'Error',
            error.error.message
          );
        },
      });
  }
  fetchTaxes() {
    this.quotationService
      .getTaxes(this.selectedProductCode, this.selectedSubclassCode)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (response: any) => {
          this.taxList = response._embedded;
          log.debug('Tax List ', this.taxList);
        },
        error: (error) => {
          this.globalMessagingService.displayErrorMessage(
            'Error',
            error.error.message
          );
        },
      });
  }


  createRiskDetail() {
    log.debug("RISK FORM VALUE", this.riskDetailsForm.value)
    sessionStorage.setItem('riskFormDetails', JSON.stringify(this.riskDetailsForm.value));
    log.debug("Insured code:", this.insuredCode)
    this.riskDetailsForm.get('insureds').setValue(this.insuredCode);
    this.selectedBinderCode = this.riskDetailsForm.value.premiumBand
    const clauses = this.getProductClausesPayload();
    log.debug('Product Clauses-', clauses)
    // validate inputs
    if (this.riskDetailsForm.invalid) {
      Object.keys(this.riskDetailsForm.controls).forEach(field => {
        const control = this.riskDetailsForm.get(field);
        control?.markAsTouched({ onlySelf: true });
      });
      for (let controlsKey in this.riskDetailsForm.controls) {
        if (this.riskDetailsForm.get(controlsKey).invalid) {
          log.debug(
            `${controlsKey} is invalid`,
            this.riskDetailsForm.get(controlsKey).errors
          );
        }
      }
      return;
    }
    // if valid
    const modal = bootstrap.Modal.getInstance(this.addRiskModalRef.nativeElement);
    modal.hide();
    const currentFormValues = this.riskDetailsForm.value
    if (this.riskDetailsForm.value) {
      const riskPayload = this.getQuotationRiskPayload();
      const payload = {
        quotationProducts: [
          {
            code: this.selectedProduct.code,
            productCode: this.selectedProductCode,
            quotationCode: this.selectedProduct.quotationCode,
            productName: this.selectedProduct.productName,
            productShortDescription: this.selectedProduct.productShortDescription,
            premium: this.selectedProduct.premium,
            wef: this.selectedProduct.wef,
            wet: this.selectedProduct.wet,
            totalSumInsured: this.selectedProduct.totalSumInsured,
            converted: this.selectedProduct.converted,
            binder: this.riskDetailsForm.value.premiumBand,
            agentShortDescription: this.selectedProduct.agentShortDescription,
            riskInformation: riskPayload,
            limitsOfLiability: [],
            taxInformation: [],
            productClauses: clauses
          }
        ],
        quotationNumber: this.selectedProduct.quotationNo,
        quotationCode: this.selectedProduct.quotationCode,
        source: this.quotationDetails.source.code,
        user: this.quotationDetails.preparedBy,
        currencyCode: this.quotationDetails.currencyCode,
        currencyRate: this.quotationDetails.currencyRate,
        agentCode: this.quotationDetails.agentCode,
        agentShortDescription: this.quotationDetails.agentShortDescription,
        wefDate: this.quotationDetails.coverFrom,
        wetDate: this.quotationDetails.coverTo,
        premium: this.quotationDetails.premium,
        branchCode: this.quotationDetails.branchCode,
        comments: this.quotationDetails.comments,
        clientType: this.quotationDetails.clientType,
        multiUser: this.quotationDetails.multiUser,
        clientCode: this.quotationDetails.clientCode,
        prospectCode: this.quotationDetails.prospectCode,
      };

      this.quotationService.processQuotation(payload).pipe(
        switchMap(data => {
          const quotationCode = data._embedded.quotationCode
          this.quotationCode = quotationCode
          const quotationNo = data._embedded.quotationNo

          // this.quotationCode && this.fetchQuotationDetails(this.quotationCode)
          this.globalMessagingService.displaySuccessMessage('Success', 'Risk created succesfully');



          const subclasscode = this.selectedSubclassCode
          const binderCode = this.selectedBinderCode || this.defaultBinder[0].code
          const coverTypeCode = this.selectedCoverType.coverTypeCode
          // Call services directly
          return forkJoin([

            this.quotationService.getQuotationDetails(quotationCode),
            this.premiumRateService.getCoverTypePremiums(subclasscode, binderCode, coverTypeCode)
          ]);
        })
      ).subscribe({
        next: ([quoteDetails, premiumRates]: any) => {
          this.quotationDetails = quoteDetails
          const quotationProducts = quoteDetails.quotationProducts || [];
          // Find the selected product
          const selectedProduct = quotationProducts.find(product => product.code === this.selectedProduct.code);
          log.debug("Quotation full details:", quoteDetails);
          log.debug("Matched product from quotation:", selectedProduct);
          const matchedRisk: RiskInformation = selectedProduct?.riskInformation?.find(risk =>
            risk.propertyId === this.riskDetailsForm.value.registrationNumber
          );
          log.debug("Matched risk from quotation:", matchedRisk);
          this.selectedRisk = matchedRisk

          const currentQuotationRiskCode = matchedRisk.code
          this.quotationRiskCode = currentQuotationRiskCode
          const result = premiumRates;
          this.sectionPremium = result
          // log.debug("Risk Clauses List:", this.riskClausesList);
          log.debug("RESPONSE AFTER getting premium rates ", this.sectionPremium);
          const defaultSection = this.sectionPremium.filter(section => section.isMandatory == 'Y')
          log.debug('the default or mandatory section to be added:', defaultSection)
          this.selectedSections = defaultSection
          currentQuotationRiskCode && this.createRiskSection();
          this.quotationRiskCode && this.createScheduleL1(this.quotationRiskCode)
          this.riskDetails = selectedProduct?.riskInformation || []

          this.quotationCode && this.fetchQuotationDetails(this.quotationCode)

        },
        // error: () => this.globalMessagingService.displayErrorMessage('Error', 'Error, try again later')
        error: (error) => {
          this.globalMessagingService.displayErrorMessage('Error', error.message);
        }
      });

    }

    // const riskDetails: any = {
    //  selectedModel: this.riskDetailsForm.ge
    // }

    // this.updateRiskDetailsForm(riskPayload);
    // If we had form values, restore them
    if (currentFormValues) {
      // Wait for form to be recreated in ngOnInit
      setTimeout(() => {
        this.riskDetailsForm.patchValue(currentFormValues);
      }, 0);
    }

  }
  UpdateRiskDetail() {
    log.debug('UPDATE RISK-FORM', this.riskDetailsForm.value)
    this.riskDetailsForm.get('insureds').setValue(this.insuredCode);
    this.selectedBinderCode = this.riskDetailsForm.value.premiumBand
    // validate inputs
    if (this.riskDetailsForm.invalid) {
      Object.keys(this.riskDetailsForm.controls).forEach(field => {
        const control = this.riskDetailsForm.get(field);
        control?.markAsTouched({ onlySelf: true });
      });
      for (let controlsKey in this.riskDetailsForm.controls) {
        if (this.riskDetailsForm.get(controlsKey).invalid) {
          log.debug(
            `${controlsKey} is invalid`,
            this.riskDetailsForm.get(controlsKey).errors
          );
        }
      }
      return;
    }
    // if valid
    const modal = bootstrap.Modal.getInstance(this.addRiskModalRef.nativeElement);
    modal.hide();
    const currentFormValues = this.riskDetailsForm.value
    if (this.riskDetailsForm.value) {
      const riskPayload = this.getQuotationRiskPayload();
      const payload = {
        quotationProducts: [
          {
            code: this.selectedProduct.code,
            productCode: this.selectedProductCode,
            quotationCode: this.selectedProduct.quotationCode,
            productName: this.selectedProduct.productName,
            productShortDescription: this.selectedProduct.productShortDescription,
            premium: this.selectedProduct.premium,
            wef: this.selectedProduct.wef,
            wet: this.selectedProduct.wet,
            totalSumInsured: this.selectedProduct.totalSumInsured,
            converted: this.selectedProduct.converted,
            binder: this.riskDetailsForm.value.premiumBand,
            agentShortDescription: this.selectedProduct.agentShortDescription,
            riskInformation: riskPayload,
            limitsOfLiability: [], // can be empty for now
            taxInformation: [] // optional or empty
          }
        ],
        quotationNumber: this.selectedProduct.quotationNo,
        quotationCode: this.selectedProduct.quotationCode,
        source: this.quotationDetails.source.code,
        user: this.quotationDetails.preparedBy,
        currencyCode: this.quotationDetails.currencyCode,
        currencyRate: this.quotationDetails.currencyRate,
        agentCode: this.quotationDetails.agentCode,
        agentShortDescription: this.quotationDetails.agentShortDescription,
        wefDate: this.quotationDetails.coverFrom,
        wetDate: this.quotationDetails.coverTo,
        premium: this.quotationDetails.premium,
        branchCode: this.quotationDetails.branchCode,
        comments: this.quotationDetails.comments,
        clientType: this.quotationDetails.clientType,
        multiUser: this.quotationDetails.multiUser,
        clientCode: this.quotationDetails.clientCode,
        prospectCode: this.quotationDetails.prospectCode,
      };

      this.quotationService.processQuotation(payload).pipe(
        switchMap(data => {
          const quotationCode = data._embedded.quotationCode
          this.quotationCode = quotationCode
          const quotationNo = data._embedded.quotationNo
          this.globalMessagingService.displaySuccessMessage('Success', 'Risk edited succesfully');



          const subclasscode = this.selectedSubclassCode
          const binderCode = this.selectedBinderCode || this.defaultBinder[0].code
          const coverTypeCode = this.selectedCoverType.coverTypeCode
          // Call services directly
          return forkJoin([


            this.premiumRateService.getCoverTypePremiums(subclasscode, binderCode, coverTypeCode)
          ]);
        })
      ).subscribe({
        next: ([premiumRates]: any) => {

          // this.quotationDetails = quoteDetails
          // log.debug("Quotation List-risk creation method:", this.quotationDetails);

          const result = premiumRates;
          this.sectionPremium = result
          // log.debug("Risk Clauses List:", this.riskClausesList);
          log.debug("RESPONSE AFTER getting premium rates ", this.sectionPremium);
          // log.debug("Keys in sectionPremium[0]:", Object.keys(this.sectionPremium[0]));


          // this.globalMessagingService.displaySuccessMessage('Success', 'Schedule created successfully');
          this.fetchQuotationDetails(this.quotationCode)


        },
        // error: () => this.globalMessagingService.displayErrorMessage('Error', 'Error, try again later')
        error: (error) => {
          this.globalMessagingService.displayErrorMessage('Error', error.message);
        }
      });

    }
  }
  getQuotationRiskPayload(): any[] {
    log.debug("quotation code:", this.quotationCode)
    const limitPayload = this.getRiskLimitPayload()
    const selectedCoverTypeCode = this.riskDetailsForm.value.coverType
    const selectedCoverType = this.subclassCoverType.find(cover => cover.coverTypeCode === selectedCoverTypeCode)
    this.selectedCoverType = selectedCoverType
    log.debug("Cover type :", selectedCoverType)
    if (!selectedCoverType) {
      log.error("No matching cover type found for code:", selectedCoverTypeCode);
      return; // Exit the function early
    }

    const selectedSubclassCode = this.riskDetailsForm.value.subclass
    this.selectedSubclassCode = selectedSubclassCode
    const selectedSubclass = this.allMatchingSubclasses.find(subclass => subclass.code === selectedSubclassCode)
    log.debug("Selected SUBCLASS :", selectedSubclass)

    const sumInsured = this.riskDetailsForm.value.value
    sessionStorage.setItem("sumInsured", sumInsured)
    log.debug("Currency code-quote creation", this.riskDetailsForm.value.propertyId)
    log.debug("Selected Cover", this.riskDetailsForm.value.coverTypeDescription)
    log.debug("ITEM DESC:", this.riskDetailsForm.value.itemDesc)
    const formattedCoverFromDate = this.formatDate(new Date(this.passedCoverFromDate));
    const formattedCoverToDate = this.formatDate(new Date(this.passedCoverToDate));
    const FormCoverFrom = this.formatDate(this.riskDetailsForm.value.coverFrom)
    const FormCoverTo = this.formatDate(this.riskDetailsForm.value.coverTo)
    log.debug(`API Cover From: ${formattedCoverFromDate}, API Cover To: ${formattedCoverToDate}`);
    log.debug(`Form Cover From: ${FormCoverFrom}, Form Cover To: ${FormCoverTo}`);

    // Determine the action based on whether riskInformation has a code
    let action
    if (this.isEditMode) {
      action = 'E'
    } else {
      action = 'A'
    }
    // const action = this.quotationDetails.quotationProducts[0]?.riskInformation[0]?.code ? "E" : "A";
    const existingRisk = this.quotationDetails.quotationProducts[0]?.riskInformation;
    log.debug("existing risk", existingRisk);

    // const coverTypeSections = this.riskLevelPremiums
    //   .filter(value => value.coverTypeDetails.coverTypeCode === this.selectedCoverType)
    //   .map(section => section.limitPremiumDtos).flat()
    let riskPayload = {
      code: this.selectedRisk?.code || null,
      coverTypeCode: this.riskDetailsForm.value.coverType,
      coverTypeShortDescription: selectedCoverType?.coverTypeShortDescription ?? '',
      coverTypeDescription: selectedCoverType?.description ?? '',
      productCode: this.selectedProductCode,
      premium: null,
      value: this.riskDetailsForm.value.value,
      clientType: "I",
      itemDesc: this.riskDetailsForm.value.riskDescription,
      wef: FormCoverFrom,
      wet: FormCoverTo,
      propertyId: this.riskDetailsForm.value.registrationNumber,
      annualPremium: null,
      sectionsDetails: null,
      action: action,
      clauseCodes: [],
      subclassCode: this.riskDetailsForm.value.subclass,
      binderCode: this.riskDetailsForm.value.premiumBand,
      riskLimits: limitPayload || [],
      subclass: {
        code: this.riskDetailsForm.value.subclass,
        description: selectedSubclass?.description,
        shortDescription: selectedSubclass?.shortDescription,
        productCode: this.selectedProductCode,
      },
      coverDays: null,
    };

    // let risk = {
    //   coverTypeCode: this.riskDetailsForm.value.propertyId,
    //   action: "A", // Set action to "A" (Add) or "E" (Edit) based on the condition
    //   quotationCode: JSON.parse(this.quotationCode),
    //   // code: existingRisk && action === "E" ? existingRisk[0].code : null,
    //   productCode: this.selectedProductCode,
    //   propertyId: this.riskDetailsForm.value.propertyId,
    //   // value: this.sumInsuredValue, // TODO attach this to individual risk
    //   coverTypeShortDescription: this.selectedCoverType.coverTypeShortDescription,
    //   // premium: coverTypeSections.reduce((sum, section) => sum + section.premium, 0),
    //   premium: existingRisk?.[0] ? existingRisk[0].premium : null,
    //   subclassCode: this.selectedSubclassCode,
    //   itemDesc: this.riskDetailsForm.value.itemDesc || this.vehiclemakeModel,
    //   binderCode: this.selectedBinderCode || this.defaultBinder[0].code,
    //   wef: FormCoverFrom || formattedCoverFromDate,
    //   wet: FormCoverTo || formattedCoverToDate,
    //   prpCode: this.insuredCode,
    //   quotationProductCode: existingRisk && action === "E" ? existingRisk[0]?.quotationProductCode : null,
    //   coverTypeDescription: this.selectedCoverType.description,


    //   taxComputation: this.taxList.map(tax => ({
    //     code: tax.code,
    //     premium: tax.premium
    //   }))
    // }
    log.debug("created risk payload", riskPayload);
    return [riskPayload]

  }
  /**
* This method toggles the 'isCollapsibleOpen' property, which controls the open/closed
* state of a Schedule section.
*/
  toggleSchedule() {
    this.isCollapsibleOpen = !this.isCollapsibleOpen;
  }
  createScheduleDetailsForm() {
    this.scheduleDetailsForm = this.fb.group({
      details: this.fb.group({
        level1: this.fb.group({
          bodyType: [''],
          yearOfManufacture: [''],
          color: [''],
          engineNumber: [''],
          cubicCapacity: [''],
          make: [''],
          coverType: [''],
          registrationNumber: [''],
          chasisNumber: [''],
          tonnage: [''],
          carryCapacity: [''],
          logBook: [''],
          value: [''],
          age: [''],
          itemNo: [''],
          terrorismApplicable: [''],
          securityDevice1: [''],
          motorAccessories: [''],
          model: [''],
          securityDevice: [''],
          regularDriverName: [''],
          schActive: [''],
          licenceNo: [''],
          driverLicenceDate: [''],
          driverSmsNo: [''],
          driverRelationInsured: [''],
          driverEmailAddress: ['']
        }),
      }),
      riskCode: [''],
      transactionType: [''],
      version: [''],
    });

    this.level2DetailsForm = this.fb.group({
      code: [''],
      geographicalLimits: [''],
      deductibleDesc: [''],
      limitationUse: [''],
      authorisedDriver: ['']
    });
  }





  toggleSections() {
    this.showSections = !this.showSections;
  }


  // This method Clears the Schedule Detail form by resetting the form model
  clearForm() {
    this.scheduleDetailsForm.reset();

  }
  onSelectSchedule(event: any) {
    this.selectedSchedule = event;
    log.info("Patched Schedule", this.selectedSchedule)
    this.scheduleDetailsForm.patchValue(this.selectedSchedule)
    let level = this.selectedSchedule.details;
    log.info("Patched level", level)
    this.deleteScheduleForLevel();
  }
  openEditScheduleModal() {
    if (!this.selectedSchedule) {
      this.globalMessagingService.displayErrorMessage('Error', 'Select a Schedule to continue')
    } else {
      document.getElementById("openModalButtonEdit").click();

    }
  }
  updateSchedule() {
    const schedule = this.scheduleDetailsForm.value;
    const level2Details = this.level2DetailsForm.value;
    log.debug("schedule form details value", schedule);
    log.debug(" level2Details value ", level2Details);

    // Check if level2DetailsForm has been touched or filled
    const isLevel2FormTouched = this.level2DetailsForm.touched || Object.values(level2Details).some(value => value !== '' && value !== null);

    if (isLevel2FormTouched) {
      // Get the current scheduleList data
      const scheduleItem = Array.isArray(this.scheduleList) ? this.scheduleList[0] : this.scheduleList;
      log.debug("schedule item", scheduleItem);

      // Create a properly structured payload with both level1 and level2
      const updatedPayload = {
        code: scheduleItem.code,
        riskCode: scheduleItem.riskCode,
        transactionType: scheduleItem.transactionType,
        organizationCode: scheduleItem.organizationCode,
        version: scheduleItem.version,
        details: {
          level1: scheduleItem.details.level1,  // Keep the existing level1 data
          level2: level2Details                // Add the new level2 data
        }
      };

      // Send the updated payload to the backend
      this.quotationService.updateSchedule(updatedPayload).subscribe(data => {
        log.debug('Final Updated Schedule:', data);
        this.updatedScheduleData = data;
        this.updatedSchedule = this.updatedScheduleData._embedded;
        this.scheduleList = this.updatedSchedule;

        // Save to session storage
        sessionStorage.setItem('scheduleDetails', JSON.stringify(this.scheduleList));

        // Reset the forms
        this.scheduleDetailsForm.reset();
        this.level2DetailsForm.reset();
        this.globalMessagingService.displaySuccessMessage('Success', 'Schedule Updated with Level 2 Details');
      }, (error) => {
        log.debug("schedule update error", error);
        this.globalMessagingService.displayErrorMessage('Error', 'Error updating schedule with level2 details');
      });
    } else {
      log.debug("updating level1 details");

      const scheduleItem = Array.isArray(this.scheduleList) ? this.scheduleList[0] : this.scheduleList;
      log.debug("schedule item", scheduleItem);
      // Handle the case where we're only updating level1 data
      schedule.riskCode = scheduleItem.riskCode;
      schedule.transactionType = scheduleItem.transactionType;
      schedule.version = scheduleItem.version;

      if (scheduleItem.details.level2) {
        schedule.details.level2 = scheduleItem.details.level2;
      } else {
        schedule.details.level2 = {};
      }

      const removeFields = [
        "terrorismApplicable", "securityDevice1", "motorAccessories",
        "model", "securityDevice", "regularDriverName", "schActive",
        "licenceNo", "driverLicenceDate", "driverSmsNo",
        "driverRelationInsured", "driverEmailAddress"
      ];

      // Conditionally remove fields if they exist
      removeFields.forEach(field => {
        if (schedule.details.level1[field] !== undefined) {
          delete schedule.details.level1[field];
        }
      });

      log.debug("level 1 payload", schedule);

      this.quotationService.updateSchedule(schedule).subscribe(data => {
        this.updatedScheduleData = data;
        log.debug('Updated Schedule Data:', this.updatedScheduleData);
        this.updatedSchedule = this.updatedScheduleData._embedded;
        log.debug('Updated Schedule:', this.updatedSchedule);
        this.scheduleList = this.updatedSchedule;
        sessionStorage.setItem('scheduleDetails', JSON.stringify(this.scheduleList));

        log.debug("UPDATED SCHEDULE LIST:", this.scheduleList);

        if (Array.isArray(this.scheduleList)) {
          const index = this.scheduleList.findIndex(item => item.code === this.updatedSchedule.code);
          if (index !== -1) {
            this.scheduleList[index] = this.updatedSchedule;
            this.cdr.detectChanges();
          }
        }

        try {
          this.scheduleDetailsForm.reset();
          this.globalMessagingService.displaySuccessMessage('Success', 'Schedule Updated with Level 1 Details');
        } catch (error) {
          this.globalMessagingService.displayErrorMessage('Error', 'Error, try again later');
          this.scheduleDetailsForm.reset();
        }

        // this.loadClientQuotation();
      });
    }
    this.cdr.detectChanges();
  }

  deleteScheduleForLevel() {
    const levelNumber = this.extractLevelNumber(this.selectedSchedule.details);
    if (levelNumber !== null) {
      this.passedlevel = levelNumber;
      log.debug("the level passsed", this.passedlevel)
    } else {
      log.debug("No 'level' property found in the object.");
    }
  }
  extractLevelNumber(obj: any): number | null {
    const keys = Object.keys(obj);
    const levelKey = keys.find(key => key.startsWith('level'));
    const levelNumber = levelKey ? parseInt(levelKey.match(/\d+/)[0], 10) : null;
    return levelNumber;
  }
  deleteSchedule() {
    if (this.selectedSchedule && this.selectedSchedule.code) {
      let level = this.passedlevel;

      // Ensure that level is a number
      if (typeof level === 'number') {
        let scheduleCode = this.selectedSchedule.code;
        let riskCode = this.selectedSchedule.riskCode;

        this.quotationService.deleteSchedule(level, riskCode, scheduleCode).subscribe(() => {
          // Remove the deleted schedule from the scheduleList
          this.scheduleList = this.scheduleList.filter(schedule => schedule.code !== scheduleCode);

          this.globalMessagingService.displaySuccessMessage('Success', 'Deleted Successfully')

        }, error => {
          console.error('Error deleting schedule:', error);
          this.globalMessagingService.displayErrorMessage('Error', 'Error, try again later')

        });
      } else {
        log.debug('Invalid level number:', level);
        // Handle the case where level is not a valid number
      }
    } else {
      // Handle the case where selectedPremiumRate is undefined or does not have a code property
      this.globalMessagingService.displayErrorMessage('Error', 'Select a Schedule to continue')

    }
  }

  hasAnyLevel2Data(): boolean {
    if (!Array.isArray(this.scheduleList) || this.scheduleList.length === 0) {
      return false;
    }
    return this.scheduleList.some(schedule =>
      schedule.details?.level2 &&
      (
        schedule.details.level2.code ||
        schedule.details.level2.geographicalLimits ||
        schedule.details.level2.deductibleDesc ||
        schedule.details.level2.limitationUse ||
        schedule.details.level2.authorisedDriver
      )
    );
  }
  prepareSchedulePayload() {
    const schedule = this.scheduleDetailsForm.value;
    const riskform = JSON.parse(sessionStorage.getItem('riskFormDetails'));

    log.debug('SELECTED RISK:', this.selectedRisk)
    log.debug("Risk form-session storage:", riskform)
    schedule.details.level1 = {
      bodyType: riskform.bodyType,
      yearOfManufacture: riskform.yearOfManufacture,
      color: riskform.color,
      engineNumber: riskform.engineNumber,
      cubicCapacity: riskform.cubicCapacity,
      make: riskform.vehicleMake,
      model: riskform.vehicleModel,
      coverType: this.selectedRisk.coverTypeDescription,
      registrationNumber: riskform.registrationNumber,
      chasisNumber: riskform.chasisNumber,
      tonnage: null,
      carryCapacity: riskform.seatingCapacity,
      logBook: null,
      value: riskform.value
    };

    schedule.riskCode = this.quotationRiskCode;
    schedule.transactionType = "Q";
    schedule.version = 0;

    // Remove unnecessary fields
    const removeFields = [
      "terrorismApplicable", "securityDevice1", "motorAccessories",
      , "securityDevice", "regularDriverName", "schActive",
      "licenceNo", "driverLicenceDate", "driverSmsNo",
      "driverRelationInsured", "driverEmailAddress"
    ];

    removeFields.forEach(field => delete schedule.details.level1[field]);

    return schedule;
  }

  fetchScheduleRelatedData() {
    forkJoin(([
      this.policyService.getBodyTypes(),
      this.policyService.getMotorColors(),
      this.policyService.getSecurityDevices(),
      this.policyService.getMotorAccessories(),
      this.productService.getYearOfManufacture()
    ])).pipe(
      untilDestroyed(this)
    )
      .subscribe(([bodyTypes, motorColours, securityDevices, motorAccessories, modelYear]: any) => {
        this.bodytypesList = bodyTypes._embedded ?? []
        this.motorColorsList = motorColours._embedded ?? []
        this.securityDevicesList = securityDevices._embedded ?? []
        this.motorAccessoriesList = motorAccessories._embedded ?? []
        const model = modelYear._embedded
        this.modelYear = model[0]["List of cover years"]

        log.debug("Body Types:", this.bodytypesList)
        log.debug("Motor Colours:", this.motorColorsList)
        log.debug("Security Devices:", this.securityDevicesList)
        log.debug("Motor Accessories:", this.motorAccessoriesList)
        log.debug("model year", this.modelYear)

        this.safePopulateSelectOptions(this.subclassFormData, 'bodyType', this.bodytypesList, 'description', 'description');
        this.safePopulateSelectOptions(this.subclassFormData, 'color', this.motorColorsList, 'description', 'code');



      })
  }


  handleRowClick(data: any) {
    if (!data?.code) {
      log.debug('Invalid data for row click:', data);
      return;
    }

    log.debug('Row clicked with data:', data);
    this.selectedRisk = data;

    this.sumInsured = this.selectedRisk.value;
    // this.onRiskEdit(this.selectedRisk)
    const selectedRiskCode = this.selectedRisk?.code
    this.quotationRiskCode = selectedRiskCode

    log.debug("Quotation risk code:", this.quotationRiskCode)
    const productDetails = this.quotationDetails.quotationProducts.find(
      product => product.productCode === this.selectedProductCode
    )
    const riskSelectedData = productDetails.riskInformation.find(risk => risk.code === selectedRiskCode)
    this.scheduleList = riskSelectedData.scheduleDetails ? [riskSelectedData.scheduleDetails] : [];
    log.debug("SCHEDULE DETAILS AFTER ROW CLICK:", this.scheduleList)

    this.sectionDetails = this.selectedRisk.riskLimits
    log.debug("section DETAILS AFTER ROW CLICK:", this.sectionDetails)

    const subclassCode = riskSelectedData.subclassCode;
    const binderCode = riskSelectedData.binderCode;
    const covertypeCode = riskSelectedData.coverTypeCode;

    this.premiumRateService.getCoverTypePremiums(subclassCode, binderCode, covertypeCode)
      .subscribe(
        (response) => {
          console.log('Premium rates:', response);

          const sectionPremiumList = response;

          log.debug("SECTION PREMIUMS-unfiltered:", sectionPremiumList);

          const sectionPremiums = sectionPremiumList
            .filter(premium => !this.sectionDetails.some(detail => detail.sectionCode === premium.sectionCode))
            .map(premium => {
              // Check condition for SumInsured — adjust this condition to your actual use case
              if (premium.isMandatory === 'Y') {
                return {
                  ...premium,
                  limitAmount: this.sumInsured  // Patch with sum insured
                };
              }
              return premium;
            });

          this.sectionPremium = sectionPremiums;
          log.debug("SECTION PREMIUMS-filtered & patched:", this.sectionPremium);
        },
        (error) => {
          log.error('Error fetching premium rates:', error);
        }
      );

    this.selectedSubclassCode = riskSelectedData.subclassCode;
    this.selectedRiskCode = riskSelectedData.code;
    log.debug("firstRiskCode", this.selectedRiskCode);
    sessionStorage.setItem("selectedRiskCode", this.selectedRiskCode);
    this.loadPersistedRiskClauses();
    this.loadSubclassClauses(riskSelectedData.subclassCode);

  }
  /**
* This method toggles the 'isCollapsibleOpen' property, which controls the open/closed
* state of a Section.
*/
  toggleSectionDetails() {
    this.isSectionDetailsOpen = !this.isSectionDetailsOpen;
  }

  toggleClauses() {
    this.isClausesOpen = !this.isClausesOpen;
  }
  /**
* Creates and initializes a section details form.
* Utilizes the 'FormBuilder'to create a form group ('sectionDetailsForm').
* Defines form controls for various section-related fields, setting initial values as needed.
*/
  createSectionDetailsForm() {
    this.sectionDetailsForm = this.fb.group({
      calcGroup: [''],
      code: [''],
      compute: [''],
      description: [''],
      freeLimit: [''],
      limitAmount: [''],
      multiplierDivisionFactor: [''],
      multiplierRate: [''],
      premiumAmount: [''],
      premiumRate: [''],
      quotRiskCode: [''],
      rateDivisionFactor: [''],
      rateType: [''],
      rowNumber: [''],
      sectionCode: [''],
      sectionShortDescription: [''],
      sectionType: [''],
      sumInsuredLimitType: [''],
      sumInsuredRate: ['']
    });
  }
  onKeyUp(event: any, section: any): void {
    clearTimeout(this.typingTimer); // Reset the timer

    this.typingTimer = setTimeout(() => {
      const inputElement = event.target as HTMLInputElement;
      const inputValue = inputElement.value.trim(); // Trim spaces
      const checkbox = document.getElementById('check_section_' + section.sectionCode) as HTMLInputElement;
      if (section.isChecked && !section.limitAmount) {
        document.getElementById(`section_${section.sectionCode}`)?.classList.add('error-border');
      } else {
        document.getElementById(`section_${section.sectionCode}`)?.classList.remove('error-border');
      }
      // Update checkbox state based on input value
      checkbox.checked = !!(checkbox && inputValue);
      section.typedWord = parseInt(inputValue, 10);
      section.isChecked = !!inputValue; // True only if input has a value
      if (section.isChecked) {
        // Add section if it's not already included
        if (!this.passedSections.some(s => s.sectionCode === section.sectionCode)) {
          this.passedSections.push(section);
        }

        this.selectedSections = [...this.passedSections]; // Ensure selectedSections is updated properly
        log.debug("Section selected", this.passedSections);
        log.debug("Selected Sections", this.selectedSections);
      } else {
        // Remove section from passedSections
        this.passedSections = this.passedSections.filter(s => s.sectionCode !== section.sectionCode);
        this.selectedSections = [...this.passedSections]; // Update selectedSections after removal
        log.debug("Selected Sections after removal", this.selectedSections);

        const removedSectionCode = section.sectionCode;

        // Ensure sectionToBeRemoved is an array
        if (!Array.isArray(this.sectionToBeRemoved)) {
          this.sectionToBeRemoved = [];
        }

        // Store multiple removed sections
        this.sectionToBeRemoved.push(removedSectionCode);
        console.debug("Sections to be removed", this.sectionToBeRemoved);
      }


      // Remove error if user types a valid value
      if (section.limitAmount) {
        this.inputErrors[section.sectionCode] = false;
      }

      // this.loadAllPremiums();
    }, 500); // Trigger after 500ms of no typing
  }
  applyGlobalFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    if (this.sectionTable) {
      this.sectionTable.filterGlobal(filterValue, 'contains');
    }
  }

  /**
 * Creates a new risk section associated with the current risk.
 * Takes section data from the 'sectionDetailsForm', sends it to the server
 * to create a new risk section associated with the current risk, and handles
 * the response data by displaying a success or error message.
 */

  // createRiskSection() {
  //   log.debug("Risk Code:", this.quotationRiskCode);
  //   let limitsToSave = this.riskLimitPayload();

  //   if (this.selectedSections.length > 0) {
  //     const limitsPayLoad = {
  //       addOrEdit: 'A',
  //       quotationRiskCode: this.quotationRiskCode,
  //       riskSections: limitsToSave.map(value => ({
  //         ...value,
  //         quotationCode: this.quotationCode,
  //         quotRiskCode: this.quotationRiskCode
  //       }))
  //     };

  //     this.quotationService.createRiskLimits(limitsPayLoad).pipe(
  //       tap((createResponse) => {
  //         log.debug('Response from createRiskLimits:', createResponse);
  //         // You can store it in a local variable if needed
  //         const riskcreateresponse = createResponse;
  //       }),
  //       switchMap(() => this.quotationService.getRiskSection(this.quotationCode))
  //     ).subscribe({
  //       next: (data: any) => {
  //         this.riskSectionList = data._embedded[0];
  //         this.sectionDetails = this.riskSectionList;
  //         sessionStorage.setItem('sectionDetails', JSON.stringify(this.sectionDetails));

  //         this.globalMessagingService.displaySuccessMessage('Success', 'Sections Created');

  //         const modal = bootstrap.Modal.getInstance(this.addRiskSectionRef.nativeElement);
  //         modal?.hide();
  //       },
  //       error: (error) => {
  //         this.globalMessagingService.displayErrorMessage('Error', 'Error, try again later');
  //         this.sectionDetailsForm.reset();
  //       }
  //     });
  //   } else {
  //     console.error('Premium list is empty.');
  //     this.globalMessagingService.displayErrorMessage('Error', 'Premium list is empty');
  //   }
  // } 
  makeRiskPayload() {
    if (this.selectedRisk) {
      const limitPayload = this.getRiskLimitPayload()
      let riskPayload = {
        code: this.selectedRisk.code,
        coverTypeCode: this.selectedRisk.coverTypeCode,
        coverTypeShortDescription: this.selectedRisk.coverTypeShortDescription,
        coverTypeDescription: this.selectedRisk.coverTypeDescription ?? '',
        productCode: this.selectedProductCode,
        premium: this.selectedRisk.premium,
        value: this.selectedRisk.value,
        clientType: "I",
        itemDesc: this.selectedRisk.itemDesc,
        wef: this.selectedRisk.wef,
        wet: this.selectedRisk.wet,
        propertyId: this.selectedRisk.propertyId,
        annualPremium: this.selectedRisk.annualPremium,
        sectionsDetails: this.selectedRisk.sectionsDetails,
        action: "E",
        clauseCodes: this.selectedRisk.clauseCodes,
        subclassCode: this.selectedRisk.subclassCode,
        binderCode: this.selectedRisk.binderCode,
        riskLimits: limitPayload || [],
        subclass: {
          code: this.selectedRisk.subclass.code,
          description: this.selectedRisk.subclass?.description,
          shortDescription: this.selectedRisk.subclass?.shortDescription,
          productCode: this.selectedProductCode,
        },
        coverDays: this.selectedRisk.coverDays,
      };
      return [riskPayload]
    }
  }
  createRiskLimitsNew() {
    log.debug('selected risk', this.selectedRisk)
    const riskPayload = this.makeRiskPayload();
    const payload = {
      quotationProducts: [
        {
          code: this.selectedProduct.code,
          productCode: this.selectedProductCode,
          quotationCode: this.selectedProduct.quotationCode,
          productName: this.selectedProduct.productName,
          productShortDescription: this.selectedProduct.productShortDescription,
          premium: this.selectedProduct.premium,
          wef: this.selectedProduct.wef,
          wet: this.selectedProduct.wet,
          totalSumInsured: this.selectedProduct.totalSumInsured,
          converted: this.selectedProduct.converted,
          binder: this.riskDetailsForm.value.premiumBand,
          agentShortDescription: this.selectedProduct.agentShortDescription,
          riskInformation: riskPayload,
          limitsOfLiability: [], // can be empty for now
          taxInformation: [] // optional or empty
        }
      ],
      quotationNumber: this.selectedProduct.quotationNo,
      quotationCode: this.selectedProduct.quotationCode,
      source: this.quotationDetails.source.code,
      user: this.quotationDetails.preparedBy,
      currencyCode: this.quotationDetails.currencyCode,
      currencyRate: this.quotationDetails.currencyRate,
      agentCode: this.quotationDetails.agentCode,
      agentShortDescription: this.quotationDetails.agentShortDescription,
      wefDate: this.quotationDetails.coverFrom,
      wetDate: this.quotationDetails.coverTo,
      premium: this.quotationDetails.premium,
      branchCode: this.quotationDetails.branchCode,
      comments: this.quotationDetails.comments,
      clientType: this.quotationDetails.clientType,
      multiUser: this.quotationDetails.multiUser,
      clientCode: this.quotationDetails.clientCode,
      prospectCode: this.quotationDetails.prospectCode,
    };

    this.quotationService.processQuotation(payload).subscribe({
      next: (response) => {
        log.debug('RESPONSE AFTER CREATING RISK LIMIT', response);

        this.globalMessagingService.displaySuccessMessage('Success', 'Sections Created');

        // Fetch updated risk sections after successful creation
        // this.fetchRiskSections();
      },
      error: (error) => {
        log.error('Error creating risk limits:', error);
        this.globalMessagingService.displayErrorMessage('Error', 'Failed to create risk SECTIONS');
      }
    });
  }

  createRiskSection() {
    log.debug("Risk Code:", this.quotationRiskCode);

    const limitsToSave = this.riskLimitPayload();

    if (this.selectedSections.length === 0) {
      this.globalMessagingService.displayErrorMessage('Error', 'Premium list is empty');
      return;
    }

    const limitsPayLoad = {
      addOrEdit: 'A',
      quotationRiskCode: this.quotationRiskCode,
      riskSections: limitsToSave.map(value => ({
        ...value,
        quotationCode: this.quotationCode,
        quotRiskCode: this.quotationRiskCode
      }))
    };

    this.createRiskLimits(limitsPayLoad);
  }
  private createRiskLimits(payload: any): void {
    this.quotationService.createRiskLimits(payload).subscribe({
      next: (response) => {
        log.debug('[createRiskLimits] Response:', {
          message: response?.message,
          status: response?.status
        });

        this.globalMessagingService.displaySuccessMessage('Success', 'Sections Created');

        // Fetch updated risk sections after successful creation
        // this.fetchRiskSections();
      },
      error: (error) => {
        log.error('Error creating risk limits:', error);
        this.globalMessagingService.displayErrorMessage('Error', 'Failed to create risk limits');
      }
    });
  }

  // private fetchRiskSections(): void {
  //   this.quotationService.getRiskSection(this.quotationCode).subscribe({
  //     next: (data: any) => {
  //       try {
  //         const embedded = data?._embedded;

  //         if (embedded && Array.isArray(embedded) && embedded.length > 0) {
  //           const section = embedded[0];

  //           // Safe logging
  //           log.debug('[fetchRiskSections] Section keys:', Object.keys(section));

  //           this.riskSectionList = section;
  //           this.sectionDetails = section;

  //           // Store only safe fields if necessary
  //           sessionStorage.setItem('sectionDetails', JSON.stringify({
  //             id: section?.id,
  //             name: section?.name // Replace with safe keys only
  //           }));

  //           // Close modal
  //           const modalElement = this.addRiskSectionRef?.nativeElement;
  //           if (modalElement) {
  //             const modal = bootstrap.Modal.getInstance(modalElement);
  //             modal?.hide();
  //           }
  //         } else {
  //           this.globalMessagingService.displayErrorMessage('Error', 'No section data received');
  //         }
  //       } catch (e) {
  //         log.error('Error processing section response:', e);
  //         this.globalMessagingService.displayErrorMessage('Error', 'Invalid section data');
  //       }
  //     },
  //     error: (error) => {
  //       log.error('Error fetching risk sections:', error);
  //       this.globalMessagingService.displayErrorMessage('Error', 'Failed to fetch risk sections');
  //       setTimeout(() => this.sectionDetailsForm.reset(), 100);
  //     }
  //   });
  // }



  riskLimitPayload() {
    let limitsToSave: any[] = [];

    for (let section of this.selectedSections) {
      limitsToSave.push({
        calcGroup: 1,
        code: section.code,
        compute: "Y",
        description: section.sectionDescription,
        freeLimit: section.freeLimit || 0,
        multiplierDivisionFactor: section.multiplierDivisionFactor,
        multiplierRate: section.multiplierRate,
        premiumAmount: section.premiumMinimumAmount || 0,
        premiumRate: section.rate || 0,
        rateDivisionFactor: section.divisionFactor || 1,
        rateType: section.rateType || "FXD",
        rowNumber: 1, // Assuming unique rowNumber per section
        sectionType: section.sectionType,
        sumInsuredLimitType: section.sumInsuredLimitType || null,
        sumInsuredRate: section.sumInsuredRate,
        sectionShortDescription: section.sectionShortDescription,
        sectionCode: section.sectionCode,
        limitAmount: section.limitAmount,
      });
    }

    return limitsToSave;
  }
  getRiskLimitPayload() {
    let limitsToSave: any[] = [];

    for (let section of this.selectedSections) {
      limitsToSave.push({
        sectionCode: section.sectionCode,
        quotationCode: this.selectedProduct.quotationCode,
        quotationRiskCode: this.selectedRisk.code,
        productCode: this.selectedProductCode,
        quotationProCode: this.selectedProduct.code,
        minimumPremium: section.minimumPremium,
        rateDescription: section.rateDescription,
        annualPremium: null,
        usedLimit: null,
        setupPremiumRate: null,
        indemnityFirstPeriod: null,
        indemnityFirstPeriodPct: null,
        indemnityPeriod: null,
        indemnityRemainingPeriodPct: null,
        minimumPremiumRate: null,
        periodType: null,
        maxPremiumRate: null,
        calcGroup: 1,
        code: 0,
        compute: null,
        description: section.sectionDescription,
        freeLimit: section.freeLimit,
        multiplierRate: section.multiplierRate,
        premiumAmount: null,
        premiumRate: section.rate,
        rateDivisionFactor: section.divisionFactor,
        rateType: section.rateType,
        rowNumber: 1,
        sectionType: section.sectionType,
        sectionShortDescription: section.sectionShortDescription,
        limitAmount: section.limitAmount,
        sumInsuredRate: section.sumInsuredRate

      });
    }

    return limitsToSave;
  }

  openEditSectionModal() {
    this.openModals('editSection');
  }

  closeEditSectionModal() {
    this.closeModals('editSection');
  }

  onSelectSection(event: any) {
    this.selectedRiskSection = event;
    log.info("Patched section", this.selectedRiskSection)
    this.sectionDetailsForm.patchValue(this.selectedRiskSection)
  }

  onOpenEditSectionModal(selectedSection: any) {
    this.openEditSectionModal();
    this.selectedSection = selectedSection; // Track the selected section
    log.debug("Selected section:", this.selectedSection);

    // Patch the form with the selected section's values, including the row number
    this.sectionDetailsForm.patchValue({
      ...this.selectedSection,
      rowNumber: this.selectedSection.rowNumber // Preserve the row number
    });

    // Open the modal
    const modalElement: HTMLElement | null = this.editSectionModal.nativeElement;
    if (modalElement) {
      this.renderer.addClass(modalElement, 'show'); // Add 'show' class to make it visible
      this.renderer.setStyle(modalElement, 'display', 'block'); // Set display property to 'block'
    }
  }

  editSection() {
    const section = this.sectionDetailsForm.value;
    log.debug("Selected Section(UpdateRiskSection):", this.selectedSection)
    log.debug("Section Details(UpdateRiskSection):", this.sectionDetails)

    if (!this.selectedSection) {
      console.error('No section selected for update.');
      this.globalMessagingService.displayErrorMessage('Error', 'No section selected for update');
      return;
    }

    const index = this.sectionDetails.findIndex(s => s.sectionCode === this.selectedSection.sectionCode);

    if (index !== -1) {
      this.sectionDetails[index] = { ...this.sectionDetails[index], ...section };
      this.sectionDetails = [...this.sectionDetails]; // Trigger change detection

      // Log the updated section
      log.debug("Updated section:", this.sectionDetails[index]);

      // Send the updated section to the service
      this.quotationService.updateRiskSection(this.quotationRiskCode, [this.sectionDetails[index]]).subscribe((data) => {
        try {
          // Reset the form and selected section
          this.sectionDetailsForm.reset();
          this.selectedSection = null;

          this.globalMessagingService.displaySuccessMessage('Success', 'Section Updated');
          this.closeEditSectionModal();
        } catch (error) {
          log.error("Error updating section:", error);
          this.globalMessagingService.displayErrorMessage('Error', 'Error, try again later');
          this.sectionDetailsForm.reset();
        }
      });
    } else {
      console.error('Selected section not found in the sections array.');
      this.globalMessagingService.displayErrorMessage('Error', 'Selected section not found');
    }

  }




  updateRiskSection() {
    const section = this.sectionDetailsForm.value;
    log.debug("Selected Section(UpdateRiskSection):", this.selectedSection)
    log.debug("Section Details(UpdateRiskSection):", this.sectionDetails)
    // Ensure a section is selected
    if (!this.selectedSection) {
      console.error('No section selected for update.');
      this.globalMessagingService.displayErrorMessage('Error', 'No section selected for update');
      return;
    }

    // Find the index of the selected section in the 'sections' array
    const index = this.sectionDetails.findIndex(s => s.sectionCode === this.selectedSection.sectionCode);

    if (index !== -1) {
      // Update the section in the array with the new values
      this.sectionDetails[index] = { ...this.sectionDetails[index], ...section };
      this.sectionDetails = [...this.sectionDetails]; // Trigger change detection

      // Log the updated section
      log.debug("Updated section:", this.sectionDetails[index]);

      // Send the updated section to the service
      this.quotationService.updateRiskSection(this.quotationRiskCode, [this.sectionDetails[index]]).subscribe((data) => {
        try {

          // sessionStorage.setItem('limitAmount', section.limitAmount);
          // const sumInsured = section.limitAmount;
          // log.debug("Sum Insured Risk Details:", sumInsured);

          // Reset the form and selected section
          this.sectionDetailsForm.reset();
          this.selectedSection = null;

          this.globalMessagingService.displaySuccessMessage('Success', 'Section Updated');
        } catch (error) {
          log.error("Error updating section:", error);
          this.globalMessagingService.displayErrorMessage('Error', 'Error, try again later');
          this.sectionDetailsForm.reset();
        }
      });
    } else {
      console.error('Selected section not found in the sections array.');
      this.globalMessagingService.displayErrorMessage('Error', 'Selected section not found');
    }
  }



  deleteRiskSection(riskSectionCode: number) {

    log.debug("selected risk section code", riskSectionCode);

    if (riskSectionCode) {
      this.quotationService.deleteRiskSections(riskSectionCode).subscribe({
        next: (response: any) => {
          log.debug("Response after deleting a risk section ", response);
          this.globalMessagingService.displaySuccessMessage('Success', 'Risk section deleted successfully');
          this.sectionDetails = this.sectionDetails.filter(
            (section) => section.sectioncode !== this.sectionToDelete.sectioncode
          );
          this.sectionToDelete = null;
        },
        error: (error) => {
          log.debug("error when deleting a risk section", error);
          this.globalMessagingService.displayErrorMessage('Error', error.error.message);
        }
      })
    }
  }
  openHelperModal(selectedClause: any) {
    // Set the showHelperModal property of the selectedClause to true
    selectedClause.showHelperModal = true;
  }
  onResize(event: any) {
    this.modalHeight = event.height;
  }
  toggleClausesopen() {
    this.isClausesOpen = !this.isClausesOpen;
  }
  // loadSubclassClauses(code: any) {
  //   this.subclassService.getSubclassClauses(code).subscribe(data => {
  //     this.SubclauseList = data;
  //     // this.selectedSubClauseList=this.SubclauseList.filter(clause=>clause.subClassCode == code);
  //     // this.selectedClauseCode=this.selectedSubClauseList[0].clauseCode;

  //     log.debug('subclass ClauseList#####', this.SubclauseList)
  //     // ✅ Ensure all mandatory clauses are selected on load
  //     this.selectedClause = this.SubclauseList.filter(clause => clause.isMandatory === 'Y');

  //     // ✅ Mark mandatory clauses as checked
  //     this.SubclauseList.forEach(clause => {
  //       clause.checked = clause.isMandatory === 'Y';
  //     });
  //   })
  // }

  loadSubclassClauses(code: any) {
    if (!code) {
      console.warn("Missing subclass code, skipping clause loading.");
      return;
    }

    this.subclassService.getSubclassClauses(code).subscribe({
      next: (data) => {
        this.SubclauseList = data || [];

        log.debug('subclass ClauseList#####', this.SubclauseList);

        this.selectedClause = this.SubclauseList.filter(clause => clause.isMandatory === 'Y');
        this.nonMandatoryClauses = this.SubclauseList.filter(clause => clause.isMandatory === 'N');
        log.debug('selected subclass ClauseList#####', this.selectedClause);
        log.debug('Non mandatory  subclass ClauseList#####', this.nonMandatoryClauses);

        this.SubclauseList.forEach(clause => {
          clause.checked = clause.isMandatory === 'Y';
        });
      },
      error: (err) => {
        console.error('Failed to load subclass clauses:', err);
        this.SubclauseList = [];
      },
      complete: () => {
        console.log('Subclass clause loading complete');
      }
    });
  }

  private fetchAndCacheSubclassClauses(code: string): void {
    this.subclassService.getSubclassClauses(code).subscribe({
      next: (data) => {
        this.SubclauseList = data || [];

        this.selectedClause = this.SubclauseList.filter(c => c.isMandatory === 'Y');
        this.nonMandatoryClauses = this.SubclauseList.filter(c => c.isMandatory === 'N');
        this.riskClause = [...this.selectedClause];
        this.sessionClauses = [...this.riskClause];

        const quotationCode = Number(sessionStorage.getItem("quotationCode"));
        const riskCode = Number(this.selectedRiskCode);
        this.selectedClause.forEach(clause => {
          const payload: riskClause = {
            clauseCode: clause.clauseCode,
            clauseShortDescription: clause.shortDescription ?? '',
            quotationCode: quotationCode,
            riskCode: riskCode,
            clause: clause.wording?.trim() ?? '',
            clauseEditable: clause.isEditable ?? 'N',
            clauseType: clause.clauseType ?? 'CL',
            clauseHeading: clause.heading ?? ''
          };

          this.quotationService.addRiskClause(payload).subscribe({
            next: () => {
              console.debug("Mandatory clause persisted:", clause.shortDescription);
            },
            error: (err) => {
              console.warn("Clause may already exist or failed to add:", err);
            }
          });
        });

        const riskClauseMap = JSON.parse(sessionStorage.getItem("riskClauseMap") || "{}");
        riskClauseMap[code] = {
          riskClause: this.riskClause,
          nonMandatoryClauses: this.nonMandatoryClauses,
          clauseModified: false
        };
        sessionStorage.setItem("riskClauseMap", JSON.stringify(riskClauseMap));
        log.debug("risk clause map >>", riskClauseMap);
      },
      error: (err) => {
        console.error("Error fetching subclass clauses:", err);
        this.SubclauseList = [];
      },
      complete: () => console.log("Fetched and cached subclass clauses.")
    });
  }

  toggleRiskClauses() {
    this.showRiskClauses = !this.showRiskClauses;

  }

  openClauseModal() {
    const storedRiskCode = sessionStorage.getItem("selectedRiskCode");

    if (storedRiskCode) {
      if ((!this.clauses || this.clauses.length === 0) && !this.clausesModified) {
        this.selectedRiskCode = storedRiskCode;
        this.loadPersistedRiskClauses();

      }

      this.showClauseModal = true;
      const modalElement = document.getElementById('addClause');
      if (modalElement) {
        const modal = new (window as any).bootstrap.Modal(modalElement);
        modal.show();
      }
    } else {
      this.globalMessagingService.displayErrorMessage('warning', 'You need to select a risk first');
    }

  }

  private loadPersistedRiskClauses(): void {
    const storedRiskCode = sessionStorage.getItem("selectedRiskCode");
    const riskClauseMap = JSON.parse(sessionStorage.getItem("riskClauseMap") || "{}");

    if (storedRiskCode && riskClauseMap[storedRiskCode]) {
      const sessionData = riskClauseMap[storedRiskCode];
      this.selectedRiskCode = storedRiskCode;

      this.riskClause = sessionData.riskClause || [];
      this.nonMandatoryClauses = sessionData.nonMandatoryClauses || [];
      this.clauseModified = sessionData.clauseModified || false;
      this.sessionClauses = [...this.riskClause];

      console.log("Loaded persisted clauses from session:", {
        riskCode: this.selectedRiskCode,
        sessionClauses: this.sessionClauses
      });
    } else {
      console.warn("No persisted data found. Fetching from API...");
      this.fetchAndCacheSubclassClauses(this.selectedSubclassCode);
    }
  }

  addRiskClauses(): void {
    if (this.selectedRiskClauses?.length) {
      // Combine selected and already mandatory clauses
      this.riskClause = [...this.riskClause, ...this.selectedRiskClauses];
      this.sessionClauses = [...this.riskClause];

      log.debug("Selected Risk Clauses:", this.selectedRiskClauses);

      // Filter out selected from non-mandatory list
      this.nonMandatoryClauses = this.nonMandatoryClauses.filter(clause =>
        !this.selectedRiskClauses.some(sel => sel.shortDescription === clause.shortDescription)
      );

      this.clauseModified = true;

      // Store in sessionStorage
      const riskClauseMap = JSON.parse(sessionStorage.getItem("riskClauseMap") || "{}");
      riskClauseMap[this.selectedRiskCode] = {
        riskClause: this.riskClause,
        nonMandatoryClauses: this.nonMandatoryClauses,
        clauseModified: this.clauseModified
      };
      sessionStorage.setItem("riskClauseMap", JSON.stringify(riskClauseMap));
      log.debug("risk clause map after add >>", riskClauseMap);

      const quotationCode = Number(sessionStorage.getItem("quotationCode"));
      const riskCode = Number(this.selectedRiskCode);

      const combinedClauses = [...this.selectedRiskClauses];
      log.debug("combined clauses >> ", combinedClauses)

      let successCount = 0;
      let failureCount = 0;

      combinedClauses.forEach(clause => {
        const singlePayload: riskClause = {
          clauseCode: clause.clauseCode,
          clauseShortDescription: clause.shortDescription,
          quotationCode: quotationCode,
          riskCode: riskCode,
          clause: clause.wording,
          clauseEditable: clause.isEditable,
          clauseType: clause.clauseType,
          clauseHeading: clause.heading
        };

        log.debug("Sending single clause payload:", singlePayload);

        this.quotationService.addRiskClause(singlePayload).subscribe({
          next: () => {
            successCount++;
            if (successCount + failureCount === combinedClauses.length) {
              this.globalMessagingService.displaySuccessMessage("Success", 'risk clause(s) added successfully');
            }
          },
          error: (err) => {
            failureCount++;
            log.error(`Failed to add clause ${clause.clauseCode}:`, err);
            if (successCount + failureCount === combinedClauses.length) {
              this.globalMessagingService.displayErrorMessage("Error", `${failureCount} clause(s) failed to save`);
            }
          }
        });
      });

      this.selectedRiskClauses = [];
    }
  }

  //edit clause
  wasModified(): boolean {
    if (!this.selectedRiskClause || !this.originalClauseBeforeEdit) return false;

    const newWording = this.selectedRiskClause.wording?.trim();
    const oldWording = this.originalClauseBeforeEdit.wording?.trim();

    return newWording !== oldWording && newWording.length > 0;
  }

  populateEditClauseModal(clause: any) {
    this.selectedRiskClause = { ...clause };
    this.originalClauseBeforeEdit = { ...clause };
  }

  editRiskClause(): void {
    if (!this.selectedRiskClause || !this.wasModified()) return;

    const quotationCode = Number(sessionStorage.getItem("quotationCode"));
    const riskCode = Number(this.selectedRiskCode);

    const payload: riskClause = {
      clauseCode: this.selectedRiskClause.clauseCode,
      clauseShortDescription: this.selectedRiskClause.shortDescription ?? '',
      quotationCode: quotationCode,
      riskCode: riskCode,
      clause: this.selectedRiskClause.wording?.trim() ?? '',
      clauseEditable: this.selectedRiskClause.isEditable ?? 'N',
      clauseType: this.selectedRiskClause.clauseType ?? 'CL',
      clauseHeading: this.selectedRiskClause.heading ?? ''
    };

    log.debug("Sending update for clause:", payload);

    this.quotationService.editRiskClause(payload).subscribe({
      next: () => {
        // Replace in all relevant arrays
        const replaceClause = (list: any[]) =>
          list.map(c => c.shortDescription === this.selectedRiskClause.shortDescription
            ? { ...this.selectedRiskClause }
            : c
          );

        this.sessionClauses = replaceClause(this.sessionClauses);
        this.riskClause = replaceClause(this.riskClause);

        // Update sessionStorage
        this.clauseModified = true;
        const riskClauseMap = JSON.parse(sessionStorage.getItem("riskClauseMap") || "{}");
        riskClauseMap[this.selectedRiskCode] = {
          riskClause: this.riskClause,
          nonMandatoryClauses: this.nonMandatoryClauses,
          clauseModified: true
        };
        sessionStorage.setItem("riskClauseMap", JSON.stringify(riskClauseMap));

        // Reset state
        this.selectedRiskClause = { id: '', heading: '', wording: '' };
        this.originalClauseBeforeEdit = null;

        this.globalMessagingService.displaySuccessMessage('Success', 'Clause edited successfully');
      },
      error: (err) => {
        log.error("Failed to edit clause:", err);
        this.globalMessagingService.displayErrorMessage('Error', 'Failed to update clause');
      }
    });
  }


  //delete risk clause
  prepareDeleteClause(clause: any) {
    this.clauseToDelete = clause;
  }

  deleteRiskClause(): void {
    if (!this.clauseToDelete) return;

    const clauseCode = this.clauseToDelete.clauseCode;
    const riskCode = Number(this.selectedRiskCode);

    this.quotationService.deleteRiskClause(clauseCode, riskCode).subscribe({
      next: () => {
        // Remove from local arrays
        this.sessionClauses = this.sessionClauses.filter(
          c => c.shortDescription !== this.clauseToDelete.shortDescription
        );
        this.riskClause = this.riskClause.filter(
          c => c.shortDescription !== this.clauseToDelete.shortDescription
        );

        // Update session storage
        const riskClauseMap = JSON.parse(sessionStorage.getItem("riskClauseMap") || "{}");
        if (riskClauseMap[this.selectedRiskCode]) {
          riskClauseMap[this.selectedRiskCode].riskClause = this.riskClause;
          riskClauseMap[this.selectedRiskCode].clauseModified = true;
          sessionStorage.setItem("riskClauseMap", JSON.stringify(riskClauseMap));
        }

        this.globalMessagingService.displaySuccessMessage('Success', 'Clause deleted successfully');
        this.clauseToDelete = null;
      },
      error: (err) => {
        log.error("Failed to delete clause:", err);
        this.globalMessagingService.displayErrorMessage('Error', 'Failed to delete clause');
      }
    });
  }


  onClauseSelectionChange(selectedClauseList: any) {
    if (selectedClauseList.checked) {
      // ✅ Add to selectedClause if not already included
      if (!this.selectedClause.includes(selectedClauseList)) {
        this.selectedClause.push(selectedClauseList);
      }
    } else {
      // ✅ Remove from selectedClause only if NOT mandatory
      if (selectedClauseList.isMandatory !== 'Y') {
        this.selectedClause = this.selectedClause.filter(item => item.clauseCode !== selectedClauseList.clauseCode);
      }
    }
    log.debug("Selected  Risk clause:", this.selectedClause)

    // ✅ Call API with updated selection
    // this.selectedProductClauses(this.quotationCode);
    this.captureRiskClause();


  }

  captureRiskClause() {
    if (this.selectedClause && this.selectedClause.length > 0) {
      this.selectedClause.forEach(el => {
        this.quotationService.captureRiskClauses(this.quotationRiskCode, this.selectedSubclassCode, this.quotationCode, el.clauseCode, this.selectProductCode).subscribe(res => {
          if (res) {
            log.info(`Response from capture risk endpont`, res);
          } else {
            this.globalMessagingService.displayErrorMessage(
              'Error',
              'Something went wrong. Please try Again'
            );
          }
        });
        console.debug(el.clauseCode);
      });
    }
    // this.quotationService
    //   .captureRiskClauses(this.quotationRiskCode, this.selectedSubclassCode, this.quotationCode, this.selectedRiskClauseCode, this.selectProductCode)
    //   .pipe(untilDestroyed(this))
    //   .subscribe({
    //     next: (data) => {
    //       if (data) {
    //         log.info(`Response from capture risk endpont`, data);
    //       } else {
    //         this.globalMessagingService.displayErrorMessage(
    //           'Error',
    //           'Something went wrong. Please try Again'
    //         );
    //       }
    //     },
    //     // error: (err) => {

    //     //   this.globalMessagingService.displayErrorMessage(
    //     //     'Error',
    //     //     this.errorMessage
    //     //   );
    //     //   log.info(`error >>>`, err);
    //     // },
    //   });
  }
  // onRiskEdit(risk: any) {
  //   this.selectedRisk = risk;
  //   const binderList = JSON.parse(sessionStorage.getItem('binderList'));

  //   const selectedVehicleMake = JSON.parse(sessionStorage.getItem('selectedVehicleMake'));
  //   const selectedVehicleModel = JSON.parse(sessionStorage.getItem('selectedVehicleModel'));
  //   const patchData = {

  //     propertyId: risk.propertyId ?? '', // Assuming propertyId is a form field in the HTML
  //     itemDesc: risk.itemDesc ?? '', // Assuming itemDesc is a form field in the HTML
  //     coverTypeDescription: risk.coverTypeDescription ?? '', // Assuming coverTypeDescription is in the HTML
  //     // binderCode: risk.binderCode ?? null, // Assuming binderCode is in the HTML
  //     wef: risk.wef ? new Date(risk.wef) : '', // Assuming wef is part of the form
  //     wet: risk.wet ? new Date(risk.wet) : '' // Assuming wet is part of the form
  //   };

  //   // Patch only the fields that are in the form
  //   const subClassCodeToUse = risk.subclassCode
  //   const selectedSubclass = this.allMatchingSubclasses.find(subclass => subclass.code === subClassCodeToUse);
  //   if (selectedSubclass) {
  //     // Patch the form with the selected subclass
  //     this.editRiskDetailsForm.patchValue({ subclassCode: selectedSubclass });
  //   }
  //   const binderCodeToUse = risk.binderCode
  //   const selectedBinder = this.binderListDetails.find(binder => binder.code === binderCodeToUse);

  //   if (binderCodeToUse) {
  //     this.editRiskDetailsForm.patchValue({ binderCode: selectedBinder });
  //   }
  //   this.editRiskDetailsForm.patchValue({ vehicleMake: selectedVehicleMake });
  //   this.editRiskDetailsForm.patchValue({ vehicleModel: selectedVehicleModel });


  //   this.editRiskDetailsForm.patchValue(patchData);

  //   log.info("Patched Risk", patchData);
  //   log.info("Patched Risk whole", this.editRiskDetailsForm.value);
  // }

  // updateRiskDetails() {
  //   const quotationCode = this.selectedRisk.quotationCode
  //   log.debug("quotation code:", quotationCode)

  //   log.debug("Currency code-quote creation", this.editRiskDetailsForm.value.propertyId)
  //   log.debug("Selected Cover", this.editRiskDetailsForm.value.coverTypeDescription)
  //   log.debug("ITEM DESC:", this.editRiskDetailsForm.value.itemDesc)
  //   const formattedCoverFromDate = this.formatDate(new Date(this.passedCoverFromDate));
  //   const formattedCoverToDate = this.formatDate(new Date(this.passedCoverToDate));
  //   const FormCoverFrom = this.formatDate(this.editRiskDetailsForm.value.wef)
  //   const FormCoverTo = this.formatDate(new Date(this.editRiskDetailsForm.value.wet))
  //   log.debug(`API Cover From: ${formattedCoverFromDate}, API Cover To: ${formattedCoverToDate}`);
  //   log.debug(`Form Cover From: ${FormCoverFrom}, Form Cover To: ${FormCoverTo}`);

  //   // Determine the action based on whether riskInformation has a code
  //   const existingRisk = this.quotationDetails.quotationProducts[0]?.riskInformation;
  //   log.debug("existing risk", existingRisk);

  //   // const coverTypeSections = this.riskLevelPremiums
  //   //   .filter(value => value.coverTypeDetails.coverTypeCode === this.selectedCoverType)
  //   //   .map(section => section.limitPremiumDtos).flat()

  //   // let risk = {
  //   //   coverTypeCode: this.selectedCoverType.coverTypeCode,
  //   //   action: "E", // Set action to "A" (Add) or "E" (Edit) based on the condition
  //   //   quotationCode: JSON.parse(this.quotationCode),
  //   //   code: this.selectedRisk.code,
  //   //   productCode: this.selectedProductCode,
  //   //   propertyId: this.editRiskDetailsForm.value.propertyId,
  //   //   // value: this.sumInsuredValue, // TODO attach this to individual risk
  //   //   coverTypeShortDescription: this.selectedCoverType.coverTypeShortDescription,
  //   //   // premium: coverTypeSections.reduce((sum, section) => sum + section.premium, 0),
  //   //   premium: existingRisk?.[0] ? existingRisk[0].premium : null,
  //   //   subclassCode: this.selectedSubclassCode,
  //   //   itemDesc: this.editRiskDetailsForm.value.itemDesc || this.vehiclemakeModel,
  //   //   binderCode: this.selectedBinderCode || this.defaultBinder[0].code,
  //   //   wef: FormCoverFrom || formattedCoverFromDate,
  //   //   wet: FormCoverTo || formattedCoverToDate,
  //   //   prpCode: this.insuredCode,
  //   //   quotationProductCode: this.selectedRisk.quotationProductCode,
  //   //   coverTypeDescription: this.selectedCoverType.description,


  //   //   taxComputation: this.taxList.map(tax => ({
  //   //     code: tax.code,
  //   //     premium: tax.premium
  //   //   })),
  //   //   // ✅ Now adding the **missing required fields** from your interface
  //   //   insuredCode: this.insuredCode,
  //   //   location: this.selectedRisk.location,
  //   //   town: this.selectedRisk.town,
  //   //   ncdLevel: this.selectedRisk.ncdLevel,
  //   //   quotationRevisionNumber: this.selectedRisk.quotationRevisionNumber,
  //   //   quotationRiskNo: this.selectedRisk.quotationRiskNo, // or generate one if needed
  //   //   value: this.selectedRisk.value || 0,
  //   //   commissionRate: this.selectedRisk.commissionRate || 0,
  //   //   commissionAmount: this.selectedRisk.commissionAmount || 0,
  //   //   clientShortDescription: this.selectedRisk.clientShortDescription || '',
  //   //   annualPremium: this.selectedRisk.annualPremium || 0,
  //   //   coverDays: this.selectedRisk.coverDays || 0,
  //   //   clientType: this.selectedRisk.clientType || '',
  //   //   prospectCode: this.selectedRisk.prospectCode || 0,
  //   //   vehicleModel: this.editRiskDetailsForm.value.vehicleModel,
  //   //   vehicleMake: this.editRiskDetailsForm.value.vehicleMake,
  //   // }
  //   const riskPayload = []
  //   this.quotationService.createQuotationRisk(quotationCode, riskPayload).pipe(

  //   ).subscribe({
  //     next: (data: any) => {
  //       const response = data._embedded;
  //       log.debug("Response after updating risk", response);
  //       this.fetchQuotationDetails(this.selectedProduct.quotationNo)
  //     },
  //     error: error => {
  //       this.globalMessagingService.displayErrorMessage('Error', error.error.message);
  //     }
  //   });

  // }

  openRiskDeleteModal() {
    log.debug("Selected Risk  to delete", this.selectedRisk)
    if (!this.selectedRisk) {
      this.globalMessagingService.displayInfoMessage('Error', 'Select a risk to continue');
    } else {
      document.getElementById("openRiskModalButtonDelete").click();
    }
  }

  deleteRisk() {
    log.debug("Selected Risk to be deleted", this.selectedRisk)
    if (this.selectedRisk) {
      this.quotationService
        .deleteRisk(this.selectedRisk.code)
        .pipe(untilDestroyed(this))
        .subscribe({
          next: (response: any) => {
            log.debug("Response after deleting a risk ", response);
            this.globalMessagingService.displaySuccessMessage('Success', 'Risk deleted successfully');

            // Remove the deleted risk from the riskDetails array
            const index = this.riskDetails.findIndex(risk => risk.code === this.selectedRisk.code);
            if (index !== -1) {
              this.riskDetails.splice(index, 1);
            }
            // Clear the selected risk
            this.selectedRisk = null;

          },
          error: (error) => {

            this.globalMessagingService.displayErrorMessage('Error', 'Failed to delete risk. Try again later');
          }
        });
    }

  }

  validateCarRegNo() {
    const control = this.riskDetailsForm.get('registrationNumber') as FormControl;
    log.debug("Keyed In value>>>", control);
    const input = event.target as HTMLInputElement;
    log.debug("Keyed In value event>>>", input);

    if (!control) return;

    const value = control.value;
    log.debug("Keyed In value>>>", value);

    // Exit early if there's a pattern error or no value
    if (control.hasError('pattern') || !value) return;

    // Remove validator before making the service call
    control.removeValidators([this.uniqueValidator]);
    control.updateValueAndValidity({ emitEvent: false });

    this.quotationService.validateRiskExistence({
      propertyId: value,
      subClassCode: this.selectedSubclassCode,
      withEffectFrom: "2024-01-01",
      withEffectTo: "2024-01-01",
      addOrEdit: 'A'
    }).pipe(
      debounceTime(500),
      distinctUntilChanged(),
      untilDestroyed(this)
    ).subscribe((response) => {
      const canProceed = response?._embedded?.duplicateAllowed;
      log.debug("Risk allowed>>>", canProceed);

      const isDuplicate = this.existingPropertyIds?.some(
        (existingValue) =>
          existingValue.replace(/\s+/g, '').toUpperCase() === value.replace(/\s+/g, '').toUpperCase()
      );

      log.debug("Existing risk>>>", isDuplicate);

      if (isDuplicate || !canProceed) {
        control.addValidators([this.uniqueValidator]);
      } else {
        control.removeValidators([this.uniqueValidator]);
      }

      control.updateValueAndValidity({ emitEvent: false });
    });
  }

  uniqueValidator(control: AbstractControl) {
    return { unique: true };
  }
  transformToUpperCase(event: Event): void {
    const input = event.target as HTMLInputElement;
    const upperCaseValue = input.value.toUpperCase();
    log.debug("RISK FORM VALUE", this.riskDetailsForm)
    const control = this.riskDetailsForm.get('registrationNumber') as FormControl;

    if (!control) {
      console.warn('Could not find control for carRegNo at given indexes');
      return;
    }

    log.debug("Keyed In value>>>", control.value);

    control.setValue(upperCaseValue, { emitEvent: false });
  }
  getCarRegNoControl(): FormControl {
    return this.riskDetailsForm.get('registrationNumber') as FormControl;

  }





  selectedClauses: any[] = [];


  toggleSelectAlls(event: any) {
    // this.clauseList.forEach(clause => (clause.isChecked = this.selectAll));
  }






  openAddSectionModal(): void {

    if (!this.selectedRisk || !this.selectedRisk.code) {
      this.globalMessagingService.displayErrorMessage(
        'No Risk Selected',
        'Please select a risk before adding a section.'
      );
      return;
    }

    const modal = document.getElementById('addSection');
    if (modal) {
      const bootstrapModal = new bootstrap.Modal(modal);
      bootstrapModal.show();
    }
  }




  fetchYearOfManufacture() {
    this.productService.getYearOfManufacture()
      .subscribe({
        next: (modelYear) => {
          const model = modelYear._embedded
          this.yearList = model[0]["List of cover years"]
          log.debug("YEAR LIST", this.yearList)

        },
        error: (error: HttpErrorResponse) => {
          log.debug("Error log", error.error.message);

          this.globalMessagingService.displayErrorMessage(
            'Error',
            error.error.message
          );
        },

      })

  }

  handleSelectChange(fieldName: string, event: any): void {
    switch (fieldName) {
      case 'vehicleMake':
        this.onVehicleMakeSelected(event);
        break;
      case 'vehicleModel':
        this.onVehicleModelSelected(event);
        break;
      // Add more cases if needed
    }
  }
  createScheduleL1(riskCode: number) {
    // Prepare schedule payload
    const schedulePayload = this.prepareSchedulePayload();
    log.debug("Schedule payload:", schedulePayload)
    this.quotationService.createSchedule(schedulePayload)
      .subscribe({
        next: (createdSchedule) => {
          this.scheduleData = createdSchedule;
          this.scheduleList = this.scheduleData._embedded;
          log.debug("Schedule List:", this.scheduleList);
          this.globalMessagingService.displaySuccessMessage('Success', 'Schedule created successfully');
        },
        error: (error: HttpErrorResponse) => {
          log.debug("Error log", error.error.message);

          this.globalMessagingService.displayErrorMessage(
            'Error',
            error.error.message
          );
        },

      })
  }
  getProductClausesPayload(): any[] {
    const allClausesMap = JSON.parse(sessionStorage.getItem("allClausesMap") || "{}");
    const payload: any[] = [];
    const selectedSubclassCode = this.riskDetailsForm.value.subclass
    Object.keys(allClausesMap).forEach(productCode => {
      const productData = allClausesMap[productCode];
      const clauses = productData.productClause || [];

      clauses.forEach(clause => {
        payload.push({
          productCode: +productCode,
          clauseCode: clause.code,
          quotationProductCode: this.selectedProduct.code || 0,
          quotationCode: this.selectedProduct.quotationCode,
          quotationNumber: this.selectedProduct.quotationNo || '',
          clause: clause.wording || '',
          clauseIsEditable: clause.isEditable || 'Y',
          clauseShortDescription: clause.shortDescription || '',
          clauseHeading: clause.heading || '',
          clauseType: clause.type || '',
          quotationRevisionNumber: 0,
          subclassCode: selectedSubclassCode || 0
        });
      });
    });

    return payload;
  }

}
