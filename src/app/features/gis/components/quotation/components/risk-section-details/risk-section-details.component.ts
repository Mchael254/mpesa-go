import { ChangeDetectorRef, Component, ElementRef, Renderer2, ViewChild } from '@angular/core';
import quoteStepsData from '../../data/normal-quote-steps.json';
import { Router } from '@angular/router';
import { SubclassesService } from '../../../setups/services/subclasses/subclasses.service';
import { Logger, untilDestroyed } from '../../../../../../shared/shared.module'
import { SubClassCoverTypesService } from '../../../setups/services/sub-class-cover-types/sub-class-cover-types.service';
import { Binder, Binders, Clause, Clauses, Premiums, Products, Subclass, Subclasses, SubclassesDTO, riskClauses, subclassClauses, subclassSection, vehicleMake, vehicleModel } from '../../../setups/data/gisDTO';
import { ProductService } from '../../../../../gis/services/product/product.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SharedQuotationsService } from '../../services/shared-quotations.service';
import { BinderService } from '../../../setups/services/binder/binder.service';
import { Calendar } from 'primeng/calendar';
import { QuotationsService } from '../../services/quotations/quotations.service';
import { QuotationDetails, quotationRisk, riskSection, ScheduleDetailsDto } from '../../data/quotationsDTO';
import { MessageService } from 'primeng/api';
import { SectionsService } from '../../../setups/services/sections/sections.service';
import { SubClassCoverTypesSectionsService } from '../../../setups/services/sub-class-cover-types-sections/sub-class-cover-types-sections.service';
import { VehicleMakeService } from '../../../setups/services/vehicle-make/vehicle-make.service';
import { VehicleModelService } from '../../../setups/services/vehicle-model/vehicle-model.service';
import { ProductsService } from '../../../setups/services/products/products.service';
import { PremiumRateService } from '../../../setups/services/premium-rate/premium-rate.service';
import { RiskClausesService } from '../../../setups/services/risk-clauses/risk-clauses.service';
import { GlobalMessagingService } from '../../../../../../shared/services/messaging/global-messaging.service';
import { ClientDTO } from "../../../../../entities/data/ClientDTO";
import { ClientService } from "../../../../../entities/services/client/client.service";
import { forkJoin, switchMap } from 'rxjs';
import { PolicyService } from '../../../policy/services/policy.service';
import { HttpErrorResponse } from '@angular/common/http';
import { animate, state, style, transition, trigger } from '@angular/animations';

const log = new Logger('RiskSectionDetailsComponent');

@Component({
  selector: 'app-risk-section-details',
  templateUrl: './risk-section-details.component.html',
  styleUrls: ['./risk-section-details.component.css'],
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
export class RiskSectionDetailsComponent {

  @ViewChild('editSectionModal') editSectionModal!: ElementRef;

  steps = quoteStepsData;

  quotationCode: any
  quotationRiskCode: any;
  quotationRiskData: any;

  riskCode: any;

  town: any;
  insuredCode: any;
  clientList: ClientDTO[];
  client: ClientDTO[];
  clientName: any;
  selectedClientList: ClientDTO[];

  subClassList: Subclass[];
  // filteredSubclass:Subclass[];
  // selectedSubclassCode:any;
  allMatchingSubclasses = [];

  subclassCoverType: any;
  coverTypeCode: any;
  selectedCoverType: any;
  filteredSubclass: Subclass[];
  selectedSubclass: any;
  selectedSubclassCode: any

  formData: any;
  clientFormData: any;
  riskDetailsForm: FormGroup;

  selectProductCode: any;
  productList: Products[]=[];
  description: any;

  binderList: any;
  binderListDetails: any;
  selectedBinderList: any;
  selectedBinderCode: any;

  // selectedDates: Date[]=[];
  // rangeDates: Date[]=[];
  coverFromDate: string;
  coverToDate: string;

  clauseList: Clause[];
  selectedClauseList: Clause[];
  SubclauseList: subclassClauses[];
  selectedSubClauseList: subclassClauses[];
  selectedClauseCode: any;
  // clauseDetail:any;
  selectedClauses: any

  riskSectionList: riskSection[]=[];
  sectionList: any;
  selectedSectionList: subclassSection[];
  sectionDetailsForm: FormGroup;
  subclassSectionCoverList: any;
  mandatorySections: any;
  filteredMandatorySections: any;
  searchText: string = '';



  quotationDetails: any;

  checkedSectionCode: any;
  checkedSectionDesc: any;
  checkedSectionType: any;
  sectionArray: any;
  selectedSection: any;

  scheduleDetailsForm: FormGroup;
  scheduleData: any;
  scheduleList: any;
  selectedSchedule: any;
  updatedSchedule: any;
  updatedScheduleData: any;
  passedlevel: any;

  vehicleMakeList: vehicleMake[];
  vehicleModelList: any;
  vehicleModelDetails: vehicleModel[];
  filteredVehicleModel: any;
  selectedVehicleMakeCode: any;
  vehiclemakeModel: any = '';
  selectedVehicleMakeName: any;
  selectedVehicleModelName: any;

  premiumList: any;

  isFromDateSelected = false;
  isToDateSelected = false;
  passedRiskId: any;

  editing = false; // Add other properties as needed
  modalHeight: number = 200; // Initial height
  products: Products[];
  coverFrom: any;
  coverTo: any;

  riskClausesList: riskClauses[];
  selectedRiskClause: Clause;
  selectedRiskClauseCode: any;

  selectedSections: any[] = [];
  premiumListIndex = 0;
  sectionDetails: any[] = [];

  bodytypesList: any;
  motorColorsList: any;
  securityDevicesList: any;
  motorAccessoriesList: any;
  modelYear: any;
  quotationNumber: string;
  passedCoverFromDate: any;
  passedCoverToDate: any;
  dateFormat: string;
  midnightexpiry: any;
  convertedDate: string;
  quoteProductCode: any;
  regexPattern: string;
  taxList: any;
  currentDate = new Date();
  defaultBinder: any;
  defaultBinderName: any;
  selectedRiskSection: any;
  minDate: Date | undefined;
  motorClassAllowed: string;
  showMotorSubclassFields: boolean = false;
  showNonMotorSubclassFields: boolean = false;
  productDescription: string;
  storedRiskFormDetails: quotationRisk = null
  quotationFormDetails: any = null
  sectionPremium: Premiums[]=[];
  storedScheduleDetails: ScheduleDetailsDto;
  storedSectionDetails: riskSection[] = [];
  passedProductCode: number;
  passedSubclassCode: number;
  passedCoverTypeCode: number;
  passedPropertyId: string;
  riskLevelPremiums: any;
  sumInsuredValue: number;

  passedClientDetails: any;

  constructor(
    private router: Router,
    private messageService: MessageService,
    public subclassService: SubclassesService,
    private subclassCoverTypesService: SubClassCoverTypesService,
    private gisService: ProductService,
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

    const motorClassAllowed = sessionStorage.getItem('motorClassAllowed');
    this.motorClassAllowed = motorClassAllowed;
    log.debug("Motor Class Allowed Value", this.motorClassAllowed);
    if (this.motorClassAllowed === 'Y') {
      this.showMotorSubclassFields = true;
      // this.motorProduct = true;
    } else if (this.motorClassAllowed == "N") {
      this.showNonMotorSubclassFields = true;
      // this.motorProduct = false;
    }
    const quotationAction = sessionStorage.getItem("quotationAction");
    if(!quotationAction) {
      this.storedRiskFormDetails = JSON.parse(sessionStorage.getItem('riskFormDetails'));
      log.debug("RISK FORM DETAILS", this.storedRiskFormDetails)
      if (this.storedRiskFormDetails) {
        this.loadCovertypeBySubclassCode(this.storedRiskFormDetails?.subclassCode);
      }
    }
    this.storedScheduleDetails = JSON.parse(sessionStorage.getItem('scheduleDetails'));
    this.scheduleList=this.storedScheduleDetails
    log.debug("SCHEDULE DETAILS:",this.storedScheduleDetails)


    this.storedSectionDetails = JSON.parse(sessionStorage.getItem('sectionDetails'));
    this.sectionDetails=this.storedSectionDetails
    log.debug("Section DETAILS:",this.storedSectionDetails)

  }
  public isCollapsibleOpen = false;
  public isOtherDetailsOpen = false;
  public isSectionDetailsOpen = false;
  public isThirdDetailsOpen = false;
  public isClausesOpen = false;

  ngOnInit(): void {
    this.minDate = new Date();

    const quotationFormDetails = sessionStorage.getItem('quotationFormDetails');
    this.formData = JSON.parse(quotationFormDetails);
    const clientFormDetails = sessionStorage.getItem('clientDetails') || sessionStorage.getItem('clientPayload');
    const clientData = JSON.parse(clientFormDetails)
    log.debug("Client form details:", clientData)
    this.clientName = clientData.firstName + ' ' + clientData.lastName;

    this.passedClientDetails = sessionStorage.getItem('clientDetails');

    this.clientFormData = this.sharedService.getFormData();
    this.quotationCode = sessionStorage.getItem('quotationCode');
    this.quotationNumber = sessionStorage.getItem('quotationNum');
    if (this.quotationNumber) {
      this.loadClientQuotation()
    }
    this.dateFormat = sessionStorage.getItem('dateFormat');
    log.debug("Date Formart", this.dateFormat)

    this.sumInsuredValue = JSON.parse(sessionStorage.getItem('sumInsuredValue'));

    this.createRiskDetailsForm();
    this.getVehicleMake();

    this.createSectionDetailsForm();
    this.createScheduleDetailsForm();

    this.loadFormData()

  }
  ngOnDestroy(): void { }

  openHelperModal(selectedClause: any) {
    // Set the showHelperModal property of the selectedClause to true
    selectedClause.showHelperModal = true;
  }
  onResize(event: any) {
    this.modalHeight = event.height;
  }
  /**
 * This method toggles the 'isCollapsibleOpen' property, which controls the open/closed
 * state of a Schedule section.
 */
  toggleSchedule() {
    this.isCollapsibleOpen = !this.isCollapsibleOpen;
  }
  /**
* This method toggles the 'isCollapsibleOpen' property, which controls the open/closed
* state of a Other Details section.
*/
  toggleOtherDetails() {
    this.isOtherDetailsOpen = !this.isOtherDetailsOpen;
  }
  /**
* This method toggles the 'isCollapsibleOpen' property, which controls the open/closed
* state of a Section.
*/
  toggleSectionDetails() {
    this.isSectionDetailsOpen = !this.isSectionDetailsOpen;
  }

  toggleClausesopen() {
    this.isClausesOpen = !this.isClausesOpen;
  }
  /**
* This method toggles the 'isCollapsibleOpen' property, which controls the open/closed
* state of a Third section.
*/
  toggleThirdDetails() {
    this.isThirdDetailsOpen = !this.isThirdDetailsOpen;
  }

  showSelectFromDateMessage() {
    if (!this.isFromDateSelected) {
      this.globalMessagingService.displayInfoMessage('Information', 'Select the "Cover From" date')


    }
  }

  showSelectToDateMessage() {
    if (!this.isFromDateSelected) {
      this.isFromDateSelected = true;
      this.globalMessagingService.clearMessages;
      this.globalMessagingService.displayInfoMessage('Information', 'Select the "Cover To" date')

    } else if (!this.isToDateSelected) {
      this.isToDateSelected = true;
      this.globalMessagingService.clearMessages;
    }
  }


  /**
 * Loads form data from a shared quotation service.
 * Retrieves and assigns various form-related details and initiates related data requests.
 */
  loadFormData() {

    log.debug(this.sharedService.getQuotationFormDetails(), "Form List")
    this.selectProductCode = this.formData.productCode;
    this.insuredCode = this.formData.clientCode;
    this.town = this.formData.clientCode
    log.debug(this.selectProductCode, "Selected Product Code")
    this.getProductByCode();
    // this.getProductSubclass(this.selectProductCode);
    // this.getSubclasses();

    // this.getClient();

  }

  /**
   * Retrieves and matches product subclasses for a given product code.
   * - Makes an HTTP GET request to GISService for product subclasses.
   * - Logs the final list of matching subclasses.
   * - Forces change detection to reflect updates.
   * @method getProductSubclass
   * @param {number} code - The product code to fetch subclasses.
   * @return {void}
   */
  getProductSubclass(code: number) {
    this.subclassService.getProductSubclasses(code).pipe(
      untilDestroyed(this)
    ).subscribe((subclasses) => {
      this.allMatchingSubclasses = subclasses.map((value) => {
        return {
          ...value,
          description: this.capitalizeWord(value.description),
        }
      })

       // Determine the subclass code to use (from storedRiskFormDetails or storedData)
      const subClassCodeToUse = this.storedRiskFormDetails?.subclassCode || this.passedSubclassCode;

      // If a subclass code is found, patch the form with the corresponding subclass
      if (subClassCodeToUse) {
        const selectedSubclass = this.allMatchingSubclasses.find(subclass => subclass.code === subClassCodeToUse);
        if (selectedSubclass) {
          // Patch the form with the selected subclass
          this.riskDetailsForm.patchValue({ subclassCode: selectedSubclass });

          // Manually call onSubclassSelected to handle the selected subclass
          this.onSubclassSelected({ value: selectedSubclass });

          this.selectedSubclassCode = subClassCodeToUse; // Update the selected subclass code
          this.loadAllBinders(); // Load all binders
        }
      } else {
        // If no subclass code is found, patch the form with the first subclass in the list
        if (this.allMatchingSubclasses.length > 0) {
          const firstSubclass = this.allMatchingSubclasses[0];
          this.riskDetailsForm.patchValue({ subclassCode: firstSubclass });

          // Manually call onSubclassSelected to handle the first subclass
          this.onSubclassSelected({ value: firstSubclass });

          this.selectedSubclassCode = firstSubclass.code; // Update the selected subclass code
          this.loadAllBinders(); // Load all binders
        }
      }
    })
  }
  capitalizeWord(value: String): string {
    return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
  }
  /**
  * Handles subclass selection.
  * Updates the selected subclass code, logs the selection, and loads related data.
  * It loads cover types, binders, and subclass clauses based on the selected value.
  */
  onSubclassSelected(event: any) {

    const selectedValue = event.value // Get the selected value
    this.selectedSubclassCode = selectedValue.code;
    // Perform your action based on the selected value
    log.debug("Selected value:", selectedValue);
    log.debug(this.selectedSubclassCode, 'Sekected Subclass Code')
    if (this.selectedSubclassCode) {
      this.fetchRegexPattern();
      this.fetchTaxes();
    }

    this.loadCovertypeBySubclassCode(this.selectedSubclassCode);
    this.loadAllBinders();
    this.loadSubclassClauses(this.selectedSubclassCode);
  }

  /**
 * Load cover types by subclass code
 * @param code {number} subclass code
 */
  loadCovertypeBySubclassCode(code: number) {
    this.subclassCoverTypesService.getSubclassCovertypeBySCode(code).subscribe(data => {
      // this.subclassCoverType = data;
      this.subclassCoverType = data.map((value) => {
        let capitalizedDescription =
          value.description.charAt(0).toUpperCase() +
          value.description.slice(1).toLowerCase();
        return {
          ...value,
          description: capitalizedDescription,
        };
      });
      this.coverTypeCode = this.subclassCoverType[0].coverTypeCode;
      log.debug(this.subclassCoverType, 'filtered covertype');
      log.debug(this.coverTypeCode, 'filtered covertype code');

      const coverTypeCodeToUse = this.storedRiskFormDetails?.coverTypeCode || this.passedCoverTypeCode;

      if (coverTypeCodeToUse) {
       this.selectedCoverType = this.subclassCoverType.find(coverType => coverType.coverTypeCode === coverTypeCodeToUse);
        if (this.selectedCoverType) {
          this.riskDetailsForm.patchValue({ coverTypeDescription: this.selectedCoverType });

        }
      }
      this.cdr.detectChanges();
    })

  }

  /**
 * Fetches client data and updates properties.
 * Retrieves client details via an HTTP request and updates properties
 * such as 'clientList' and 'clientName' for quotation generation.
 */
  getClient() {
    this.clientService.getClients(0, 1000).subscribe(data => {
      this.clientList = data.content
      log.debug("Client  Details", this.clientList)
      log.debug("Client  Insured code ", this.insuredCode)

      // this.clientList = this.client.content
      this.selectedClientList = this.clientList.filter(client => client.id == this.insuredCode);
      log.debug("Selected Client ", this.selectedClientList)

      this.clientName = this.selectedClientList[0].firstName + ' ' + this.selectedClientList[0].lastName;

      log.debug(this.clientName, "Client NAME")

    })
  }

  /**
 * Fetches product details by code.
 * Retrieves product details by sending an HTTP request with 'selectProductCode'.
 * Updates properties, including 'productList' and 'description'.
 */
  getProductByCode() {
    this.gisService.getProductDetailsByCode(this.selectProductCode).subscribe(res => {
      this.productList = [res];
      this.productDescription = this.productList[0].description;
      log.debug('Product Description', this.productDescription);
      log.debug('Product List', this.productList);
      this.getProductSubclass(this.selectProductCode)
      this.productList = [res].map((value) => {
        return {
          ...value,
          description: this.capitalizeWord(value.description),
        }
      })

      // Determine the product code to use (from storedRiskFormDetails or storedData)
      const productCodeToUse = this.storedRiskFormDetails?.productCode || this.passedProductCode;

      // If a product code is found, patch the form with the corresponding product
      if (productCodeToUse) {
        const selectedProduct = this.productList.find(product => product.code === productCodeToUse);
        if (selectedProduct) {
          this.riskDetailsForm.patchValue({ productCode: selectedProduct });
        }
      } else {
        // If no product code is found, patch the form with the first product in the list
        this.riskDetailsForm.patchValue({ productCode: this.productList[0] });
      }

    })
  }

  /**
 * Creates and initializes a risk details form.
 * It defines form controls for various risk-related fields,
 *  setting initial values and validation rules.
 */

  createRiskDetailsForm() {
    log.debug("passed cover from rskf:", this.passedCoverFromDate)
    log.debug("passed cover to rskf:", this.passedCoverToDate)
    this.riskDetailsForm = this.fb.group({
      insuredCode: [null],
      location: [''],
      town: [''],
      ncdLevel: [null],
      coverTypeCode: [null, Validators.required],
      addEdit: [''],
      quotationRevisionNumber: [null],
      code: [null],
      quotationProductCode: [null],
      quotationRiskNo: [''],
      quotationCode: [null],
      productCode: [null],
      propertyId: [this.storedRiskFormDetails ? this.storedRiskFormDetails.propertyId : '', Validators.required],
      value: [null],
      coverTypeShortDescription: [''],
      premium: [null],
      subclassCode: [null, Validators.required],
      itemDesc: [this.storedRiskFormDetails ? this.storedRiskFormDetails.itemDesc : '', Validators.required],
      binderCode: [null, Validators.required],
      wef: ['', Validators.required],
      wet: ['', Validators.required],
      commissionRate: [null],
      commissionAmount: [null],
      prpCode: [null],
      clientShortDescription: [''],
      annualPremium: [null],
      coverDays: [null],
      clientType: [''],
      prospectCode: [null],
      coverTypeDescription: [''],
      vehicleMake: [''],
      vehicleModel: ['']
    });
  }
  get f() {
    return this.riskDetailsForm.controls;
  }
  /**
* Loads and updates the list of binders for a specific subclass.
* Retrieves binder data via an HTTP request, updates 'binderList' and 'binderListDetails,'
* and filters 'selectedBinderList' to include only binders matching the provided subclass code.
*
* @param code - The subclass code for which binders are loaded.
*/
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

        log.debug("All Binders Details:", this.binderListDetails);

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
            this.riskDetailsForm.patchValue({ binderCode: selectedBinder });

          }
        }
        this.cdr.detectChanges();

        // Update form control value with default binder
        if (this.riskDetailsForm && this.defaultBinder && this.defaultBinder.length > 0) {
          this.riskDetailsForm.get('binderCode').setValue(this.defaultBinder[0]);
        }
      },
      (error) => {
        log.error("Error loading binders:", error);
        // Handle error appropriately
      }
    );
  }


  /**
 * Retrieves subclass clauses and updates related properties.
 * Sends an HTTP request to fetch subclass clauses, filters them based on a provided 'code',
 * and updates properties like 'selectedSubClauseList' and 'selectedClauseCode'.
 * Also initiates the 'loadAllClauses()' method.
 */
  loadSubclassClauses(code: any) {
    this.subclassService.getSubclassClauses(code).subscribe(data => {
      this.SubclauseList = data;
      // this.selectedSubClauseList=this.SubclauseList.filter(clause=>clause.subClassCode == code);
      // this.selectedClauseCode=this.selectedSubClauseList[0].clauseCode;

      log.debug('subclass ClauseList#####', this.SubclauseList)

      // log.debug('ClauseList',this.selectedSubClauseList)
      // log.debug('ClauseCode********',this.selectedClauseCode)
      this.loadAllClauses();
    })
  }

  loadAllClauses() {
    // Extract clause codes from selectedSubClauseList
    const subClauseCodes = this.SubclauseList.map(subClause => subClause.clauseCode);
    log.debug('Retrived Clause Codes', subClauseCodes)

    // Check if there are any subClauseCodes before making the request
    if (subClauseCodes.length === 0) {
      // Handle the case when there are no subClauseCodes
      return;
    }

    // Make the request to get all clauses based on the subClauseCodes
    this.subclassService.getAllClauses().subscribe(data => {
      this.clauseList = data._embedded.clause_dto_list;

      // Filter clauseList based on subClauseCodes
      this.selectedClauseList = this.clauseList.filter(clause => subClauseCodes.includes(clause.code));
      sessionStorage.setItem("riskClauses", JSON.stringify(this.selectedClauseList))
      log.debug('All ClauseList', this.clauseList);
      log.debug('ClauseSelectdList', this.selectedClauseList);
    });
  }

  /**
 * Navigates back to the quotation details page.
 * Uses the Angular Router to navigate to the 'quotation-details' page within the 'gis' module
 * when called, effectively returning to the previous page.
 */
  backLink() {
    this.router.navigate(['/home/gis/quotation/quotation-details'])
  }

  /**
 * Creates a new risk detail for a quotation.
 * Takes the data from the 'riskDetailsForm', processes it, and sends it to the server
 * to create a new risk detail associated with the current quotation. It then handles
 * the response data and displays a success or error message.
 * Additionally, it initiates the 'loadRiskSections()' method to update risk sections.

 */

  getVehicleMake() {
    this.vehicleMakeService.getAllVehicleMake().subscribe(data => {
      // this.vehicleMakeList = data;
      this.vehicleMakeList = data.map((value) => {
        let capitalizedDescription =
          value.name.charAt(0).toUpperCase() +
          value.name.slice(1).toLowerCase();
        return {
          ...value,
          name: capitalizedDescription,
        };
      });
      log.debug("VehicleMake", this.vehicleMakeList)
      if (this.storedRiskFormDetails) {
        const selectedVehicleMake = this.vehicleMakeList.find(make => make.name === this.storedRiskFormDetails?.vehicleMake);
        if (selectedVehicleMake) {
          log.debug("selected vehicle make:", selectedVehicleMake)
          this.riskDetailsForm.patchValue({ vehicleMake: selectedVehicleMake });
        }
        this.getVehicleModel(selectedVehicleMake.code)
      }


    })
  }

  // onVehicleMakeSelected(event: any) {
  //   log.debug("event logged",event.target.value[0].code)
  //   const selectedValue = event.target.value;
  //   this.selectedVehicleMakeCode=selectedValue;
  //   log.debug(`Selected vehicle value: ${selectedValue}`);
  //   log.debug(this.selectedVehicleMakeCode,'Sekected vehicle make Code')

  //   this.getVehicleModel();
  // }
  onVehicleMakeSelected(event: any) {
    const selectedValue = event.value.code;
    log.debug("SELECTED CODE:", selectedValue)

    this.selectedVehicleMakeCode = selectedValue;


    // Convert selectedValue to the appropriate type (e.g., number)
    const typedSelectedValue = this.convertToCorrectType(selectedValue);

    // Find the selected object using the converted value
    const selectedObject = this.vehicleMakeList.find(vehicleMake => vehicleMake.code === typedSelectedValue);

    // Check if the object is found
    if (selectedObject) {
      log.debug('Selected Vehicle Object:', selectedObject);
      // Perform further actions with the selected object as needed
    } else {
      console.error('Selected Vehicle Object not found');
    }
    this.getVehicleModel(this.selectedVehicleMakeCode);
    this.selectedVehicleMakeName = selectedObject.name
  }

  convertToCorrectType(value: any): any {
    // Implement the conversion logic based on the actual type of your identifier
    // For example, if your identifier is a number, you can use parseInt or parseFloat
    // If it's another type, implement the conversion accordingly
    return parseInt(value, 10); // Adjust based on your actual data type
  }


  getVehicleModel(code: number) {
    const vehicleMakeCode = code
    this.vehicleModelService.getAllVehicleModel(vehicleMakeCode).subscribe(data => {
      this.vehicleModelList = data;

      this.vehicleModelDetails = this.vehicleModelList._embedded.vehicle_model_dto_list;
      this.vehicleModelDetails = this.vehicleModelDetails.map((value) => {
        let capitalizedDescription =
          value.name.charAt(0).toUpperCase() +
          value.name.slice(1).toLowerCase();
        return {
          ...value,
          name: capitalizedDescription,
        };
      });
      log.debug("Vehicle Model Details", this.vehicleModelDetails);
      if (this.storedRiskFormDetails) {
        const selectedVehicleModel = this.vehicleModelDetails.find(model => model.name === this.storedRiskFormDetails?.vehicleModel);
        if (selectedVehicleModel) {
          this.riskDetailsForm.patchValue({ vehicleModel: selectedVehicleModel });

        }
      }

    })
  }
  onVehicleModelSelected(event: any) {
    const selectedValue = event.value.code;

    // Convert selectedValue to the appropriate type (e.g., number)
    const typedSelectedValue = this.convertToCorrectType(selectedValue);

    // Find the selected object using the converted value
    const selectedObject = this.vehicleModelDetails.find(vehicleModel => vehicleModel.code === typedSelectedValue);

    // Check if the object is found
    if (selectedObject) {
      log.debug('Selected Vehicle Model:', selectedObject);
      // Perform further actions with the selected object as needed
    } else {
      console.error('Selected Vehicle Model not found');
    }
    this.selectedVehicleModelName = selectedObject.name;
    this.vehiclemakeModel = this.selectedVehicleMakeName + ' ' + this.selectedVehicleModelName;
    log.debug('Selected Vehicle make model', this.vehiclemakeModel);

  }

  convertModelToCorrectType(value: any): any {
    // Implement the conversion logic based on the actual type of your code property
    // For example, if your code property is a number, you can use parseInt or parseFloat
    // If it's another type, implement the conversion accordingly
    return parseInt(value, 10); // Adjust based on your actual data type
  }
  onCoverTypeSelected(event: any) {
    const selectedValue = event.value;
    log.debug("Selected value(On Covertype selected", selectedValue)
    this.selectedCoverType = selectedValue;


  }
  onBinderSelected(event: any) {
    const selectedValue = event.value;
    log.debug("Selected value(On binder selected", selectedValue)
    this.selectedBinderList = selectedValue;
    this.selectedBinderCode = this.selectedBinderList.code

  }

  createRiskDetail() {

    const currentFormValues = this.riskDetailsForm ? {...this.riskDetailsForm.value} : null;

    log.debug("vehicleMake SELECTED", this.selectedVehicleMakeName)
    log.debug("vehicleMODEL SELECTED", this.selectedVehicleModelName)
    // const riskForm = this.riskDetailsForm.value;
    // riskForm.vehicleMake = this.riskDetailsForm.value.vehicleMake.name;

    this.riskDetailsForm.controls['vehicleModel'].setValue(this.selectedVehicleModelName)
    this.riskDetailsForm.controls['vehicleMake'].setValue(this.selectedVehicleMakeName)

    let riskPayload = this.getQuotationRiskPayload();
    log.debug("risk payload when creating a risk or editing", riskPayload);
    this.updateRiskDetailsForm(riskPayload);

    const riskArray = [riskPayload];
    log.debug(riskArray)
    this.quotationService.createQuotationRisk(this.quotationCode, riskPayload).pipe(
      switchMap(data => {
        this.quotationRiskData = data;
        const quotationRiskDetails = this.quotationRiskData._embedded[0];

        if (quotationRiskDetails) {
          this.quotationRiskCode = quotationRiskDetails.riskCode;
          this.quoteProductCode = quotationRiskDetails.quotProductCode;
        }

        // Determine the success message based on the action
        const successMessage = riskPayload[0].action === "E"
          ? 'Risk Edited Successfully'
          : 'Risk Created Successfully';
        this.globalMessagingService.displaySuccessMessage('Success', successMessage);
        sessionStorage.setItem('riskFormData', JSON.stringify(this.riskDetailsForm.value));

        // Prepare schedule payload
        const schedulePayload = this.prepareSchedulePayload();
        const subclasscode = this.selectedSubclassCode
        const binderCode = this.selectedBinderCode || this.defaultBinder[0].code
        const coverTypeCode =  this.selectedCoverType.coverTypeCode

        return forkJoin([
          this.quotationService.createSchedule(schedulePayload),
          this.quotationService.getRiskClauses(this.quotationRiskCode),
          this.premiumRateService.getCoverTypePremiums(subclasscode, binderCode, coverTypeCode)
        ]);
      })
    ).subscribe({
      next: ([createdSchedule, riskClauses,premiumRates]:any) => {
        this.scheduleData = createdSchedule;
        this.scheduleList = this.scheduleData._embedded;
        sessionStorage.setItem('scheduleDetails', JSON.stringify(this.scheduleList));

        this.riskClausesList = riskClauses;
        const result = premiumRates;
        this.sectionPremium= result
        log.debug("Schedule List:", this.scheduleList);
        log.debug("Risk Clauses List:", this.riskClausesList);
        log.debug("RESPONSE AFTER getting premium rates ", this.sectionPremium);

        this.globalMessagingService.displaySuccessMessage('Success', 'Schedule created successfully');
        this.fetchScheduleRelatedData();
        this.loadClientQuotation()

      },
      // error: () => this.globalMessagingService.displayErrorMessage('Error', 'Error, try again later')
      error: (error) => {
        this.globalMessagingService.displayErrorMessage('Error', error.message);
      }
    });

    // If we had form values, restore them
    if (currentFormValues) {
      // Wait for form to be recreated in ngOnInit
      setTimeout(() => {
        this.riskDetailsForm.patchValue(currentFormValues);
      }, 0);
    }

  }
  getQuotationRiskPayload(): any[] {
    log.debug("quotation code:", this.quotationCode)

    log.debug("Currency code-quote creation", this.riskDetailsForm.value.propertyId)
    log.debug("Selected Cover", this.riskDetailsForm.value.coverTypeDescription)
    log.debug("ITEM DESC:", this.riskDetailsForm.value.itemDesc)
    const formattedCoverFromDate = this.formatDate(new Date(this.passedCoverFromDate));
    const formattedCoverToDate = this.formatDate(new Date(this.passedCoverToDate));
    const FormCoverFrom = this.formatDate(this.riskDetailsForm.value.wef)
    const FormCoverTo = this.formatDate(new Date(this.riskDetailsForm.value.wet))
    log.debug(`API Cover From: ${formattedCoverFromDate}, API Cover To: ${formattedCoverToDate}`);
    log.debug(`Form Cover From: ${FormCoverFrom}, Form Cover To: ${FormCoverTo}`);

    // Determine the action based on whether riskInformation has a code
    const action = this.quotationDetails.quotationProducts[0]?.riskInformation[0]?.code ? "E" : "A";
    const existingRisk =  this.quotationDetails.quotationProducts[0]?.riskInformation;
    log.debug("existing risk", existingRisk);

    // const coverTypeSections = this.riskLevelPremiums
    //   .filter(value => value.coverTypeDetails.coverTypeCode === this.selectedCoverType)
    //   .map(section => section.limitPremiumDtos).flat()

    let risk = {
      coverTypeCode: this.selectedCoverType.coverTypeCode,
      action: action, // Set action to "A" (Add) or "E" (Edit) based on the condition
      quotationCode: JSON.parse(this.quotationCode),
      code: existingRisk && action === "E" ? existingRisk[0].code : null,
      productCode: this.selectProductCode,
      propertyId: this.riskDetailsForm.value.propertyId,
      value: this.sumInsuredValue, // TODO attach this to individual risk
      coverTypeShortDescription: this.selectedCoverType.coverTypeShortDescription,
      // premium: coverTypeSections.reduce((sum, section) => sum + section.premium, 0),
      premium: existingRisk ? existingRisk[0].premium : null,
      subclassCode: this.selectedSubclassCode,
      itemDesc: this.riskDetailsForm.value.itemDesc || this.vehiclemakeModel,
      binderCode: this.selectedBinderCode || this.defaultBinder[0].code,
      wef: FormCoverFrom || formattedCoverFromDate,
      wet: FormCoverTo || formattedCoverToDate,
      prpCode: this.passedClientDetails?.id,
      quotationProductCode: existingRisk && action === "E" ? existingRisk[0]?.quotationProductCode : null,
      coverTypeDescription: this.selectedCoverType.description,


      taxComputation: this.taxList.map(tax => ({
        code: tax.code,
        premium: tax.premium
      }))
    }
    log.debug("created risk payload", risk);
    return [risk]

  }
  updateRiskDetailsForm(riskPayload: any) {
    if (riskPayload && riskPayload.length === 0) {
      return;
    }
    const riskData = riskPayload[0]; // Extracting first item

    this.riskDetailsForm.patchValue({
      coverTypeCode: riskData.coverTypeCode || null,
      quotationCode: riskData.quotationCode || null,
      productCode: riskData.productCode || null,
      propertyId: riskData.propertyId || '',
      coverTypeShortDescription: riskData.coverTypeShortDescription || '',
      subclassCode: riskData.subclassCode || null,
      itemDesc: riskData.itemDesc || '',
      binderCode: riskData.binderCode || null,
      wef: riskData.wef || '',
      wet: riskData.wet || '',
      coverTypeDescription: riskData.coverTypeDescription || ''
    });
    sessionStorage.setItem('riskFormDetails', JSON.stringify(this.riskDetailsForm.value));

    log.debug("RISK DETAILS FOR VALUES", this.riskDetailsForm.value)


  }


  loadRiskSubclassSection() {
    this.sectionService.getSubclassSections(this.selectedSubclassCode).subscribe(data => {
      this.sectionList = data;
      this.selectedSectionList = this.sectionList.filter(section => section.subclassCode == this.selectedSubclassCode);

      log.debug("Filtered Section List", this.selectedSectionList)

    })
  }



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



  matchesSearch(description: string): boolean {
    return description.toLowerCase().includes(this.searchText.toLowerCase());
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

  // onCheckboxChange(section: subclassSection) {

  //   log.debug("Checked Section Data",section)
  //   this.checkedSectionCode=section.sectionCode;
  //   this.checkedSectionDesc=section.sectionShortDescription;
  //   this.checkedSectionType=section.sectionType;
  //   this.getPremiumRates()
  //   this.getSectionbyCode()
  // }

  onCheckboxChange(section: any): void {
    log.debug("Checkbox changed for section:", section);

    // Find the index of the section in the selectedSections array
    const index = this.selectedSections.findIndex(s => s.code === section.sectionCode);
    log.debug("Index of section in selectedSections:", index);

    if (index === -1) {
      // Section is not selected, so add it (immutable update)
      log.debug("Adding section to selectedSections");
      // Get the maximum row number from existing selected sections
      const maxRowNumber = this.getMaxRowNumber(this.selectedSections);

      // Assign a new row number to the section
      section.rowNumber = maxRowNumber + 1;
      this.selectedSections = [...this.selectedSections, section];
    } else {
      // Section is already selected, so remove it (immutable update)
      log.debug("Removing section from selectedSections");
      this.selectedSections = this.selectedSections.filter(s => s.code !== section.code);
    }

    log.debug("Updated selectedSections:", this.selectedSections);
    log.debug("Selected Sections", this.selectedSections);

    // Trigger premium calculation
    // this.getPremium(this.selectedSections);
  }

  getMaxRowNumber(sections: any[]): number {
    if (sections.length === 0) return 0; // If no sections exist, start from 0
    const rowNumbers = sections.map(section => section.rowNumber || 0); // Extract row numbers
    return Math.max(...rowNumbers); // Return the maximum row number
  }


  /**
 * Creates a new risk section associated with the current risk.
 * Takes section data from the 'sectionDetailsForm', sends it to the server
 * to create a new risk section associated with the current risk, and handles
 * the response data by displaying a success or error message.
 */

  createRiskSection() {
    log.debug("Risk Code:", this.quotationRiskCode);
    let limitsToSave = this.riskLimitPayload();

    if (this.selectedSections.length > 0) {
      const limitsPayLoad = {
        addOrEdit: 'A',
        quotationRiskCode: this.quotationRiskCode,
        riskSections: limitsToSave.map(value => ({
          ...value,
          quotationCode: this.quotationCode,
          quotRiskCode: this.quotationRiskCode
        }))
      };

      this.quotationService.createRiskLimits(limitsPayLoad).pipe(
        switchMap(() => this.quotationService.getRiskSection(this.quotationCode))
      ).subscribe({
        next: (data: any)=> {
          this.riskSectionList = data._embedded[0];
          log.debug("Section List", this.riskSectionList);
          this.sectionDetails = this.riskSectionList;
          sessionStorage.setItem('sectionDetails', JSON.stringify(this.sectionDetails));

          this.globalMessagingService.displaySuccessMessage('Success', 'Sections Created');
          this.sectionDetailsForm.reset();
        },
        error: error => {
          this.globalMessagingService.displayErrorMessage('Error', 'Error, try again later');
          this.sectionDetailsForm.reset();
        }
      });
    } else {
      console.error('Premium list is empty.');
      this.globalMessagingService.displayErrorMessage('Error', 'Premium list is empty');
    }
  }


  onSelectSection(event: any) {
    this.selectedRiskSection = event;
    log.info("Patched section", this.selectedSection)
    this.sectionDetailsForm.patchValue(this.selectedSection)
  }

  onSaveDetailsClick() {
    this.updateRiskSection();

    // Close the modal
    const modalElement: HTMLElement | null = this.editSectionModal.nativeElement;
    if (modalElement) {
      this.renderer.removeClass(modalElement, 'show'); // Remove 'show' class to hide the modal
      this.renderer.setStyle(modalElement, 'display', 'none'); // Set display property to 'none'
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
  onEditButtonClick(selectedSection: any) {
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

  deleteRiskSection() {

    const riskSectionCode = this.selectedRiskSection.code;
    log.debug("selected risk section code", riskSectionCode);

    if (riskSectionCode) {
      this.quotationService.deleteRiskSections(riskSectionCode).subscribe({
        next: (response: any) => {
          log.debug("Response after deleting a risk section ", response);
          this.globalMessagingService.displaySuccessMessage('Success', 'Risk section deleted successfully');

        },
        error: (error) => {
          log.debug("error when deleting a risk section", error);
          this.globalMessagingService.displayErrorMessage('Error', 'Failed to delete risk. Try again later');
        }
      })
    }
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
          Make: [''],
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
    schedule.riskCode = this.quotationRiskCode;
    schedule.transactionType = "Q";
    schedule.version = 0;



    // Remove specific fields from the payload
    delete schedule.details.level1.terrorismApplicable;
    delete schedule.details.level1.securityDevice1;
    delete schedule.details.level1.motorAccessories;
    delete schedule.details.level1.model;
    delete schedule.details.level1.securityDevice;
    delete schedule.details.level1.regularDriverName;
    delete schedule.details.level1.schActive;
    delete schedule.details.level1.licenceNo;
    delete schedule.details.level1.driverLicenceDate;
    delete schedule.details.level1.driverSmsNo;
    delete schedule.details.level1.driverRelationInsured;
    delete schedule.details.level1.driverEmailAddress;

    this.quotationService.updateSchedule(schedule).subscribe(data => {
      this.updatedScheduleData = data;
      log.debug('Updated Schedule Data:', this.updatedScheduleData);
      this.updatedSchedule = this.updatedScheduleData._embedded;
      log.debug('Updated Schedule  nnnnn:', this.updatedSchedule);
      this.scheduleList = this.updatedSchedule;
      sessionStorage.setItem('scheduleDetails', JSON.stringify(this.scheduleList));

      log.debug("UPDATED SCHEDULE LIST:", this.scheduleList)
      const index = this.scheduleList.findIndex(item => item.code === this.updatedSchedule.code);
      if (index !== -1) {
        this.scheduleList[index] = this.updatedSchedule;
        this.cdr.detectChanges();
      }

      try {

        this.scheduleDetailsForm.reset()
        this.globalMessagingService.displaySuccessMessage('Success', 'Schedule Updated')

      } catch (error) {
        this.globalMessagingService.displayErrorMessage('Error', 'Error, try again later')

        this.scheduleDetailsForm.reset()
      }
    })
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




  finish() {
    log.debug('sections-RISK SECTION COMP', this.sectionArray)
    log.debug('Schedules', this.scheduleList)
    // sessionStorage.setItem('limitAmount', section.limitAmount);
    // const sumInsured = section.limitAmount;
    // log.debug("Sum Insured Risk Details:", sumInsured);

    sessionStorage.setItem('sections', JSON.stringify(this.sectionArray))
    sessionStorage.setItem('schedules', JSON.stringify(this.scheduleList))

    this.router.navigate(['/home/gis/quotation/quotation-summary'])
  }
  getSectionbyCode() {
    this.sectionService.getSectionByCode(this.checkedSectionCode).subscribe(data => {
      this.sectionList = data;
      sessionStorage.setItem('sectionType', this.sectionList.type)
      log.debug(this.sectionList.type, "SECTION LIST WITH TYPE")
    })
  }
  getPremiumRates() {
    const selectedSectionCode = this.checkedSectionCode;
    const selectedBinderCode = this.selectedBinderCode || this.defaultBinder[0].code
    this.premiumRateService.getAllPremiums(selectedSectionCode, selectedBinderCode, this.selectedSubclassCode).subscribe(data => {
      this.premiumList = data;
      log.debug(this.premiumList[0].multiplierDivisionFactor, "premium List");
      sessionStorage.setItem('premiumRate', this.premiumList[0].rate)
      sessionStorage.setItem('multiplierDivisionFactor', this.premiumList[0].multiplierDivisionFactor)
      sessionStorage.setItem('divisionFactor', this.premiumList[0].divisionFactor)
      sessionStorage.setItem('rateType', this.premiumList[0].rateType)
      sessionStorage.setItem('premiumRate', this.premiumList[0].rate)
      // this.globalMessagingService.displaySuccessMessage('Success', 'Successfully updated');
    });
  }

  getPremium(passedSections: any[]) {
    const sections = passedSections;
    log.debug("Sections passed to premium service:", sections);

    // Create an array to store observables returned by each service call
    const observables = sections?.map(section => {
      return this.premiumRateService.getAllPremiums(section.sectionCode, this.selectedBinderCode, this.selectedSubclassCode);
    });

    // Use forkJoin to wait for all observables to complete
    forkJoin(observables).subscribe((data: any[]) => {
      // Flatten the array if needed
      const newPremiumList = data.flat();
      log.debug("New Premium List", newPremiumList);

      // Check if premiumList is an array (safeguard against initialization issues)
      if (!Array.isArray(this.premiumList)) {
        this.premiumList = [];
      }

      // Create a Set to track existing premium codes
      const premiumCodeSet = new Set(this.premiumList.map(premium => premium.code));

      // Filter out any new premiums that already exist in the premiumList
      const uniqueNewPremiumList = newPremiumList.filter(premium => !premiumCodeSet.has(premium.code));

      // Append uniqueNewPremiumList to existing premiumList
      this.premiumList = [...this.premiumList, ...uniqueNewPremiumList];
      log.debug("Updated Premium List", this.premiumList);
    });
  }

  loadRiskClauses() {
    this.quotationService.getRiskClauses(this.quotationRiskCode).subscribe(data => {
      this.riskClausesList = data;
      log.debug("Risk Clauses List:", this.riskClausesList)
    })
  }

  onSelectRiskClauses(event: any) {
    this.selectedRiskClause = event;
    log.info("Patched Risk Section", this.selectedRiskClause);
    this.selectedRiskClauseCode = this.selectedRiskClause.code;
    log.debug("SELECTED RISK CLAUSE CODE:", this.selectedRiskClauseCode);
    log.debug("SELECTED PRODUCT CODE:", this.selectProductCode);
    log.debug("SELECTED RISK CODE:", this.quotationRiskCode);
    log.debug("SELECTED Quote CODE:", this.quotationCode);

    this.captureRiskClause();
  }
  // captureRiskClause(){
  //   this.quotationService.captureRiskClauses(this.selectedRiskClauseCode,this.selectProductCode,this.quotationCode, this.riskCode).subscribe(data =>{
  //     log.debug("Response from capture risk endpont:",data);
  //     this.globalMessagingService.displaySuccessMessage('Success', 'Risk Clauses successfully captured');

  //   })
  // }
  captureRiskClause() {
    this.quotationService
      .captureRiskClauses(this.quotationRiskCode, this.quotationCode, this.selectedRiskClauseCode, this.selectProductCode, this.selectedSubclassCode)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (data) => {
          if (data) {
            log.info(`Response from capture risk endpont`, data);
          } else {
            this.globalMessagingService.displayErrorMessage(
              'Error',
              'Something went wrong. Please try Again'
            );
          }
        },
        // error: (err) => {

        //   this.globalMessagingService.displayErrorMessage(
        //     'Error',
        //     this.errorMessage
        //   );
        //   log.info(`error >>>`, err);
        // },
      });
  }
  fetchBodyTypes() {
    this.policyService
      .getBodyTypes()
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (response: any) => {
          this.bodytypesList = response._embedded
          log.debug("Body Types:", this.bodytypesList)

        },
        error: (error) => {

          this.globalMessagingService.displayErrorMessage('Error', 'Failed to retrieve  body types details.Try again later');
        }
      })
  }
  fetchMotorColours() {
    this.policyService
      .getMotorColors()
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (response: any) => {
          this.motorColorsList = response._embedded
          log.debug("Motor Colours:", this.motorColorsList)

        },
        error: (error) => {

          this.globalMessagingService.displayErrorMessage('Error', 'Failed to retrieve  motor colors  details.Try again later');
        }
      })
  }
  fetchSecurityDevices() {
    this.policyService
      .getSecurityDevices()
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (response: any) => {
          this.securityDevicesList = response._embedded
          log.debug("Motor Colours:", this.securityDevicesList)

        },
        error: (error) => {

          this.globalMessagingService.displayErrorMessage('Error', 'Failed to retrieve  security devices details.Try again later');
        }
      })
  }
  fetchMotorAccessories() {
    this.policyService
      .getMotorAccessories()
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (response: any) => {
          this.motorAccessoriesList = response._embedded
          log.debug("Motor Accessories:", this.motorAccessoriesList)

        },
        error: (error) => {

          this.globalMessagingService.displayErrorMessage('Error', 'Failed to retrieve  motor accessories details.Try again later');
        }
      })
  }
  getModelYear() {
    this.productService.getYearOfManufacture().subscribe({
      next: (data) => {
        const model = data._embedded
        this.modelYear = model[0]["List of cover years"]
        log.debug("model year", this.modelYear)
      }, error: (err) => {
        this.globalMessagingService.displayErrorMessage('Error', 'Error fetching model years');
        console.error(err);
      }
    })
  }
  // formatCurrency(event: any): void {
  //   let input = event.target.value.replace(/,/g, ''); // Remove existing commas
  //   if (input) {
  //       input = parseFloat(input).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  //       event.target.value = input;
  //   }
  // }
  loadClientQuotation() {
    log.debug("passed quotation Number:", this.quotationNumber)
    let defaultCode
    if (this.quotationNumber) {
      defaultCode = this.quotationNumber;
      log.debug("QUOTE Number", defaultCode)
    }
    //  else {
    //   defaultCode = this.passedNumber
    //   log.debug(" PASSED QUOTE Number", defaultCode)

    // }

    this.quotationService.getQuotationDetails(defaultCode).subscribe(data => {
      this.quotationDetails = data;
      log.debug("Quotation Details-covertype comparison:", this.quotationDetails)

      this.passedProductCode = this.quotationDetails?.quotationProducts[0]?.proCode;
      this.passedSubclassCode = this.quotationDetails.quotationProducts[0]?.riskInformation[0]?.subclassCode;
      this.passedCoverTypeCode = this.quotationDetails.quotationProducts[0]?.riskInformation[0]?.coverTypeCode;
      this.passedPropertyId = this.quotationDetails.quotationProducts[0]?.riskInformation[0]?.propertyId;
      this.sectionDetails = this.quotationDetails.quotationProducts[0]?.riskInformation[0]?.sectionsDetails;

      const passedCoverFromDate = this.quotationDetails.coverFrom;
      const passedCoverToDate = this.quotationDetails.coverTo;
      this.passedCoverFromDate = this.convertDate(passedCoverFromDate);
      this.passedCoverToDate = this.convertDate(passedCoverToDate);


      log.debug("passed cover from:", this.passedCoverFromDate)
      log.debug("passed cover to:", this.passedCoverToDate)
      log.debug("passed product code:", this.passedProductCode)
      log.debug("passed product subclass code:", this.passedSubclassCode)
      log.debug("passed property ID:", this.passedPropertyId)
      log.debug("passedCoverTypeCode:", this.passedCoverTypeCode)



      if (this.storedRiskFormDetails) {
        if (this.passedCoverFromDate) {
          this.riskDetailsForm.patchValue({
            wef: this.storedRiskFormDetails?.wef
              ? new Date(this.storedRiskFormDetails.wef)
              : this.passedCoverFromDate
          });
        }
        this.riskDetailsForm.patchValue({
          wet: this.storedRiskFormDetails?.wet
            ? new Date(this.storedRiskFormDetails.wet)
            : this.passedCoverToDate
        });
      } else {
        this.riskDetailsForm.patchValue({
          wef: this.passedCoverFromDate
        });
        this.riskDetailsForm.patchValue({
          wet: this.passedCoverToDate
        });

        this.riskDetailsForm.patchValue({
          propertyId: this.passedPropertyId
        });

        // this.riskDetailsForm.patchValue({
        //   subclassCode: this.passedSubclassCode
        // });

      }
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
  updateCoverToDate(date) {
    log.debug("Cover from date:", date)
    const coverFromDate = date;
    const formattedCoverFromDate = this.formatDate(coverFromDate);
    log.debug('FORMATTED cover from DATE:', formattedCoverFromDate);
    // this.producSetupService.getProductByCode(this.quotationForm.value.productCode).subscribe(res=>{
    //   this.productDetails = res
    //   log.debug(this.productDetails)
    // if(this.productDetails.expires === 'Y'){
    this.producSetupService.getCoverToDate(formattedCoverFromDate, this.selectProductCode)
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
          this.riskDetailsForm.controls['wet'].setValue(this.coverToDate)
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
  convertDate(date: any) {
    log.debug("DATE TO BE CONVERTED", date)
    const rawDate = new Date(date);
    log.debug(' Raw before being formatted', rawDate);

    // Extract the day, month, and year
    const day = rawDate.getDate();
    const month = rawDate.toLocaleString('default', { month: 'long' }); // 'long' gives the full month name
    const year = rawDate.getFullYear();

    // Format the date in 'dd-Month-yyyy' format
    const formattedDate = `${day}-${month}-${year}`;

    this.convertedDate = formattedDate;
    log.debug('Converted date', this.convertedDate);
    return this.convertedDate
  }

  fetchRegexPattern() {
    this.quotationService
      .getRegexPatterns(this.selectedSubclassCode)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (response: any) => {
          this.regexPattern = response._embedded?.riskIdFormat;
          log.debug('New Regex Pattern', this.regexPattern);
          this.riskDetailsForm
            ?.get('propertyId')
            .addValidators(Validators.pattern(this.regexPattern));
          this.riskDetailsForm?.get('propertyId').updateValueAndValidity();
        },
        error: (error) => {
          this.globalMessagingService.displayErrorMessage(
            'Error',
            error.error.message
          );
        },
      });
  }
  transformToUpperCase(event: Event): void {
    const input = event.target as HTMLInputElement;
    const upperCaseValue = input.value.toUpperCase();
    this.riskDetailsForm
      .get('propertyId')
      ?.setValue(upperCaseValue, { emitEvent: false });
  }


  fetchTaxes() {
    this.quotationService
      .getTaxes(this.selectProductCode, this.selectedSubclassCode)
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


      })
  }
  // onProductSelected() {
  //   log.debug("allow moto class field", this.policyDetails.product.allowMotorClass)
  //   this.motorClassAllowed = this.policyDetails.product.allowMotorClass;
  //   log.debug("Motor Class Allowed Value", this.motorClassAllowed);
  //   if (this.motorClassAllowed === 'Y') {
  //     this.showMotorSubclassFields = true;
  //     this.motorProduct = true;
  //   }else if(this.motorClassAllowed=="N"){
  //     this.showNonMotorSubclassFields = true;
  //     this.motorProduct = false;
  //   }
  // }
  prepareSchedulePayload() {
    const schedule = this.scheduleDetailsForm.value;

    schedule.details.level1 = {
      bodyType: null,
      yearOfManufacture: null,
      color: "red",
      engineNumber: null,
      cubicCapacity: null,
      Make: this.selectedVehicleMakeName,
      coverType: this.selectedCoverType.description,
      registrationNumber: this.passedRiskId,
      chasisNumber: null,
      tonnage: null,
      carryCapacity: null,
      logBook: null,
      value: null
    };

    schedule.riskCode = this.quotationRiskCode;
    schedule.transactionType = "Q";
    schedule.version = 0;

    // Remove unnecessary fields
    const removeFields = [
      "terrorismApplicable", "securityDevice1", "motorAccessories",
      "model", "securityDevice", "regularDriverName", "schActive",
      "licenceNo", "driverLicenceDate", "driverSmsNo",
      "driverRelationInsured", "driverEmailAddress"
    ];

    removeFields.forEach(field => delete schedule.details.level1[field]);

    return schedule;
  }
  fetchSectionPremiumRates() {
    const subclasscode = this.selectedSubclassCode
    const binderCode = this.selectedBinderCode || this.defaultBinder[0].code
    const coverTypeCode =  this.selectedCoverType.coverTypeCode
    this.premiumRateService.getCoverTypePremiums(subclasscode, binderCode, coverTypeCode).pipe(untilDestroyed(this)).subscribe({
      next: (response: any) => {
        const result = response._embedded;
        this.riskLevelPremiums = result;
        log.debug("RESPONSE AFTER getting premium rates ", result);
      },
      error: (error) => {
        this.globalMessagingService.displayErrorMessage('Error', error.error.message);
      }
    });
  }
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
}
