import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Logger, untilDestroyed } from '../../../../../../shared/shared.module'
import { PolicyService } from '../../services/policy.service';
import { Router } from '@angular/router';
import { GlobalMessagingService } from '../../../../../../shared/services/messaging/global-messaging.service';
import { SubclassesService } from '../../../setups/services/subclasses/subclasses.service';
import { QuakeZone, Subclass, Subclasses, subclassCoverTypeSection, subclassCoverTypes, subclassSection, vehicleMake, vehicleModel } from '../../../setups/data/gisDTO';
import { ProductsService } from '../../../setups/services/products/products.service';
import { SubClassCoverTypesService } from '../../../setups/services/sub-class-cover-types/sub-class-cover-types.service';
import { BinderService } from '../../../setups/services/binder/binder.service';
import { VehicleMakeService } from '../../../setups/services/vehicle-make/vehicle-make.service';
import { VehicleModelService } from '../../../setups/services/vehicle-model/vehicle-model.service';
import { PolicyResponseDTO, PolicyContent, RiskSection, RiskInformation } from '../../data/policy-dto';
import { CountryDto, StateDto, TownDto } from '../../../../../../shared/data/common/countryDto';
import { CountryService } from '../../../../../../shared/services/setups/country/country.service';
import { StaffService } from '../../../../../entities/services/staff/staff.service';
import { StaffDto } from '../../../../../entities/data/StaffDto';
import underwritingSteps from '../../data/underwriting-steps.json'
import { ClientDTO } from '../../../../../../features/entities/data/ClientDTO';
import { ClientService } from '../../../../../../features/entities/services/client/client.service';
import { Table } from 'primeng/table';
import { SectionsService } from '../../../setups/services/sections/sections.service';
import { SubClassCoverTypesSectionsService } from '../../../setups/services/sub-class-cover-types-sections/sub-class-cover-types-sections.service';
import { concatMap, forkJoin, switchMap, tap } from 'rxjs';
import { PremiumRateService } from '../../../setups/services/premium-rate/premium-rate.service';
import { AuthService } from '../../../../../../shared/services/auth.service';
import { QuotationsService } from '../../../../components/quotation/services/quotations/quotations.service'
import * as XLSX from 'xlsx';
import * as Papa from 'papaparse';
import { QuakeZonesService } from '../../../setups/services/perils-territories/quake-zones/quake-zones.service';

const log = new Logger("RiskDetailsComponent");

@Component({
  selector: 'app-risk-details',
  templateUrl: './risk-details.component.html',
  styleUrls: ['./risk-details.component.css']
})
export class RiskDetailsComponent {
  steps = underwritingSteps
  policyRiskForm: FormGroup;
  show: boolean = true;
  isNcdApplicable: boolean = false;
  isCashApplicable: boolean = false;

  passedPolicyDetails: any;
  batchNo: any;
  policyResponse: PolicyResponseDTO;
  policyDetails: PolicyContent;

  passedUserDetails: any;
  userId: any;
  user: any;
  detailedUserInfo: StaffDto;
  userCountryCode: any;

  errorMessage: string;
  errorOccurred: boolean;

  subClassList: Subclass[];
  allSubclassList: Subclasses[]
  allMatchingSubclasses = [];
  selectedSubclassCode: any;
  selectedSubclass: any;

  productCode: any;

  binderList: any;
  binderListDetails: any;
  selectedBinder: any;

  subclassCoverType: subclassCoverTypes[] = [];
  selectedCoverType: any;
  selectedCoverTypeCode: any;
  coverTypeCode: any;
  coverTypeDesc: any;
  covertypeSections: any;

  passedCoverFrom: any;
  passedCoverTo: any;
  passedCoverDays: any;
  passedClientCode: any;
  passedClientName: any;
  passedClient: any;

  clientData: ClientDTO[];
  clientDetails: ClientDTO;
  clientList: any;

  showMotorSubclassFields: boolean = false;
  motorClassAllowed: any;

  vehicleMakeList: vehicleMake[];
  vehicleModelList: any;
  vehicleModelDetails: vehicleModel[];
  filteredVehicleModel: any;
  selectedVehicleMakeCode: any;
  vehiclemakeModel: any;
  selectedVehicleMakeName: any;
  selectedVehicleModelName: any;

  motorProduct: boolean;

  statesList: StateDto[];
  selectedStateId: any;
  townList: TownDto[];
  quakeZoneList: QuakeZone[] = [];
  countryList: CountryDto[];
  userCountryName: any;

  sectionList: any;
  // selectedSectionList:subclassSection[];
  subclassSectionCoverList: subclassCoverTypeSection[];
  allMatchingSections: any;
  mandatorySections: any;
  filteredMandatorySections: any;
  selectedSection: any;
  sectionDetailsForm: FormGroup;
  sectionArray: any;
  searchText: string = '';
  checkedSectionCode: any;
  checkedSectionDesc: any;
  checkedSectionType: any;
  filteredAllMatchingSections: any;
  selectedSections: any[] = [];
  allTransformedSections: any;
  fileSelected: boolean = false;
  uploadedFileName: string = '';
  uploading: string = '';
  selectedPolicy: any;
  selectedRisk: any;
  policyRisks: any;
  policyRiskDetails: any;
  policySectionDetails: any;
  premiumList: any[] = [];
  premiumListIndex = 0;
  currentYear: any;
  riskForm: any;
  selectedTransactionType: any
  csvRisksList: any;
  editing = false;

  riskCode: any;

  scheduleDetailsForm: FormGroup;
  scheduleData: any;
  scheduleList: any;
  scheduleArray: any[]=[];
  selectedSchedule: any;
  updatedSchedule: any;
  updatedScheduleData: any;
  failedCounter:number = 0;
  successCounter:number = 0;
  modelYear: any;

  passedPolicyRiskDetails: RiskInformation;
  subclass: any;
  binder: any;
  coverType: any;
  riskId: any;
  riskDescription: any;
  vehicleMake: any;
  vehicleModel: any;
  passedModelYear: any;

  binderDescription: any;
  passedBinder: any;
  relationGroups:any;
  riskClassList:any;

  @ViewChild('dt1') dt1: Table | undefined;
  @ViewChild('closebutton') closebutton;




  constructor(
    public fb: FormBuilder,
    private policyService: PolicyService,
    public subclassService: SubclassesService,
    public productService: ProductsService,
    public binderService: BinderService,
    private subclassCoverTypesService: SubClassCoverTypesService,
    public vehicleMakeService: VehicleMakeService,
    public vehicleModelService: VehicleModelService,
    public countryService: CountryService,
    public staffService: StaffService,
    public globalMessagingService: GlobalMessagingService,
    private router: Router,
    public cdr: ChangeDetectorRef,
    private clientService: ClientService,
    public sectionService: SectionsService,
    public subclassSectionCovertypeService: SubClassCoverTypesSectionsService,
    public premiumRateService: PremiumRateService,
    public authService: AuthService,

    public quotationService: QuotationsService,
    public quakeZoneService: QuakeZonesService,




  ) {

  }

  ngOnInit(): void {
    // this.loadAllSubclass();
    this.getVehicleMake();
    this.getAllSection();
    this.getQuakeZone();
    this.selectedTransactionType = sessionStorage.getItem('selectedTransactionType');
    this.createScheduleDetailsForm();
    this.getModelYear()

    const passedPolicyDetailsString = sessionStorage.getItem('passedPolicyDetails');
    this.passedPolicyDetails = JSON.parse(passedPolicyDetailsString);

    const passedUserDetailsString = sessionStorage.getItem('passedUserDetails');
    this.passedUserDetails = JSON.parse(passedUserDetailsString);
    log.debug("Passed User Details:", this.passedUserDetails);
    this.user = this.authService.getCurrentUserName()
    log.debug("logged in user :", this.user);

    this.userId = this.passedUserDetails?.code
    log.debug("Passed User Id:", this.userId);
    if (this.userId) {
      this.getUserDetails();
    } else {
      this.globalMessagingService.displayErrorMessage(
        'Error',
        'User ID not found'
      );
    }
    const passedPolicyRiskString = sessionStorage.getItem('passedRiskPolicyDetails');
    this.passedPolicyRiskDetails = JSON.parse(passedPolicyRiskString);
    log.debug("Passed Policy Risk Details:", this.passedPolicyRiskDetails);
    if (this.passedPolicyRiskDetails) {
      // this.policyRiskForm.patchValue(this.passedPolicyRiskDetails)
      this.patchValues();

    }
    this.getImportedRisk()
    this.createPolicyRiskForm();
    this.createSectionDetailsForm();
    this.getPolicy();
    this.currentYear = new Date().getFullYear();
  }
  ngOnDestroy(): void { }
  getUserDetails() {
    this.staffService
      .getStaffById(this.userId)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (data: any) => {
          if (data) {
            this.detailedUserInfo = data;
            log.debug("Detailed User Details:", this.detailedUserInfo)
            this.userCountryCode = this.detailedUserInfo.countryCode;
            log.debug("User country code:", this.userCountryCode);
            if (this.userCountryCode) {
              this.getRiskLocation();
              this.getRiskTerritory()
            }

          }
          else {
            this.errorOccurred = true;
            this.errorMessage = 'Something went wrong. Please try Again';
            this.globalMessagingService.displayErrorMessage(
              'Error',
              'Something went wrong. Please try Again'
            );
          }
        },
        error: (err) => {

          this.globalMessagingService.displayErrorMessage(
            'Error',
            this.errorMessage
          );
          log.info(`error >>>`, err);
        },
      })
  }
  createPolicyRiskForm() {
    this.policyRiskForm = this.fb.group({
      addOrEdit: [''],
      allowedCommissionRate: [''],
      // autogenerateCert: [''],
      basicPremium: [''],
      binderCode: ['',Validators.required],
      // cashApplicable: [''],
      cashLevel: [''],
      commissionAmount: [''],
      commissionRate: [''],
      computeMaxExposure: [''],
      conveyanceType: [''],
      coverDays: [''],
      coverTypeCode: ['',Validators.required],
      coverTypeShortDescription: [''],
      currencyCode: [''],
      dateCoverFrom: ['',Validators.required],
      dateCoverTo: ['',Validators.required],
      delSect: [''],
      grossPremium: [''],
      installmentPaymentPercentage: [''],

      insureds: this.fb.group({
        client: this.fb.group({
          firstName: [''],
          id: ['',Validators.required],
          lastName: ['']
        }),
        prpCode: ['']
      }),
      installmentPeriod: [''],

      ipuNcdCertNo: [''],
      loaded: [''],
      logbook: [''],
      logbookAvailable: [''],
      // logbookUnderInsuredName: [''],
      ltaCommission: [''],
      maintenanceCover: [''],
      maxExposureAmount: [''],
      modelYear: ['',Validators.required],
      ncdApplicable: [''],
      ncdLevel: [''],
      netPremium: [''],
      newRisk: ['',Validators.required],
      // netPremium: [''],
      paidPremium: [''],
      policyBatchNo: [''],
      policyNumber: [''],
      policyStatus: [''],
      periodRate: [''],
      productCode: [''],
      propertyDescription: ['',Validators.required],
      propertyId: ['',Validators.required],
      quakeFloodZone: [''],
      quantity: [''],
      reinsuranceEndorsementNumber: [''],
      renewalArea: [''],
      retroactiveCover: [''],
      riskAddress: [''],
      riskClass:[''],
      riskDetails: [''],
      // regularDriver: [''],
      riskFpOverride: [''],
      riskIpuCode: [''],
      riskLocation: [''],
      sections: this.fb.array([
        this.fb.group({
          divFactor: [0],
          freeLimit: [0],
          limitAmount: [0],
          multiplierRate: [0],
          pilPremRate: [0],
          premium: [0],
          rateType: [''],
          sectCode: [0],
          sectIpuCode: [0],
          sectionCode: [0],
          sectionDesc: [''],
          sectionShortDesc: ['']
        })
      ]),
      stampDuty: [''],
      subClassCode: ['',Validators.required],
      subClassDescription: [''],
      transactionType: [''],
      underwritingYear: [''],
      value: [''],
      vehicleMake: ['',Validators.required],
      vehicleModel: ['',Validators.required],
      surveyDate: [''],
      territory: [''],
      topLocationLevel: [''],
      // town: [''],
     
    });
    // this.policyRiskForm = this.fb.group({
    //   addOrEdit: [''],
    //   allowedCommissionRate: [''],
    //   autogenerateCert: [''],
    //   basicPremium: [''],
    //   binderCode: [''],
    //   cashApplicable: [''],
    //   cashLevel: [''],
    //   commissionAmount: [''],
    //   commissionRate: [''],
    //   computeMaxExposure: [''],
    //   conveyanceType: [''],
    //   coverDays: [''],
    //   coverTypeCode: [''],
    //   coverTypeShortDescription: [''],
    //   currencyCode: [''],
    //   dateCoverFrom: [''],
    //   dateCoverTo: [''],
    //   delSect: [''],
    //   grossPremium: [''],
    //   installmentPaymentPercentage: [''],
    //   installmentPeriod: [''],
    //   insureds: this.fb.group({
    //     client: this.fb.group({
    //       firstName: [''],
    //       id: [''],
    //       lastName: ['']
    //     }),
    //     prpCode: ['']
    //   }),
    //   ipuNcdCertNo: [''],
    //   loaded: [''],
    //   logbook: [''],
    //   logbookAvailable: [''],
    //   // logbookUnderInsuredName: [''],
    //   ltaCommission: [''],
    //   maintenanceCover: [''],
    //   maxExposureAmount: [''],
    //   modelYear: [''],
    //   ncdApplicable: [''],
    //   ncdLevel: [''],
    //   netPremium: [''],
    //   newRisk:[''],
    //   paidPremium: [''],
    //   periodRate: [''],
    //   policyNumber: [''],
    //   policyStatus: [''],
    //   productCode: [''],
    //   propertyDescription: [''],
    //   propertyId: [''],
    //   quakeFloodZone: [''],
    //   quantity: [''],
    //   regularDriver: [''],
    //   reinsuranceEndorsementNumber: [''],
    //   renewalArea: [''],
    //   retroactiveCover: [''],
    //   riskAddress: [''],
    //   riskClass:[''],
    //   riskDetails: [''],
    //   riskFpOverride: [''],
    //   riskIpuCode:[''],
    //   riskLocation: [''],
    //   sections: this.fb.array([
    //     this.fb.group({
    //       divFactor: [0],
    //       freeLimit: [0],
    //       limitAmount: [0],
    //       multiplierRate: [0],
    //       pilPremRate: [0],
    //       premium: [0],
    //       rateType: [''],
    //       sectCode: [0],
    //       sectIpuCode: [0],
    //       sectionCode: [0],
    //       sectionDesc: [''],
    //       sectionShortDesc: ['']
    //     })
    //   ]),
    //   stampDuty: [''],
    //   subClassCode: [''],
    //   subClassDescription: [''],
    //   surveyDate: [''],
    //   territory: [''],
    //   topLocationLevel: [''],
    //   town: [''],
    //   transactionType: [''],
    //   underwritingYear: [''],
    //   value: [''],
    //   vehicleMake: [''],
    //   vehicleModel: ['']
    // });

  }
  toggleNcdApplicableFields(checked: boolean) {
    this.isNcdApplicable = checked;
  }
  toggleCashApplicableField(checked: boolean) {
    this.isCashApplicable = checked;
  }
  getPolicy() {
    this.batchNo = this.passedPolicyDetails?.batchNumber;
    log.debug("Batch No:", this.batchNo)
    this.policyService
      .getPolicy(this.batchNo)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (data: any) => {

          if (data && data.content && data.content.length > 0) {
            this.policyResponse = data;
            log.debug("Get Policy Endpoint Response", this.policyResponse)
            this.policyDetails = this.policyResponse.content[0]
            log.debug("Policy Details", this.policyDetails)
            this.productCode = this.policyDetails.product.code;
            log.debug("Product Code", this.productCode)
            this.passedCoverFrom = this.policyDetails.wefDt;
            log.debug("COVER FROM", this.passedCoverFrom);
            this.passedCoverTo = this.policyDetails.wetDt;
            log.debug("COVER TO", this.passedCoverTo);
            this.passedClientCode = this.policyDetails.clientCode
            log.debug("CLIENT CODE", this.passedClientCode);


            // Calculate cover days
            const coverFromDate = new Date(this.passedCoverFrom).getTime(); // Convert to milliseconds
            const coverToDate = new Date(this.passedCoverTo).getTime(); // Convert to milliseconds
            const coverDays = Math.ceil((coverToDate - coverFromDate) / (1000 * 60 * 60 * 24));
            this.passedCoverDays = coverDays;
            this.policyRiskForm.controls['coverDays'].setValue(this.passedCoverDays);

            log.debug("Cover Days", this.passedCoverDays);
            this.loadAllSubclass();
            this.onProductSelected();
            this.loadAllClients();
            this.cdr.detectChanges();

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

          this.globalMessagingService.displayErrorMessage(
            'Error',
            this.errorMessage
          );
          log.info(`error >>>`, err);
        },
      });
  }
  patchValues() {
    log.debug('PATCH FUNCTION CALLED')
    this.subclass = this.passedPolicyRiskDetails.subClassDescription;
    log.debug('Sub Desc', this.subclass)

    this.binder = this.passedPolicyRiskDetails.binderCode;
    const binderNumber = parseInt(this.binder)
    log.debug("BINDER NUMBER", binderNumber)
    log.debug("BINDER details", this.binderListDetails)

    // this.passedBinder = this.binderListDetails.filter(binder => binder.code === this.binder )
    // const selectedClient = this.clientData.find(client => client.id === this.passedClientCode);

    // log.debug("BINDER ",this.passedBinder)

    // log.debug('Binder Desc ',this.passedBinder)
    // this.binderDescription = this.passedBinder.binder_short_description;
    this.coverType = this.passedPolicyRiskDetails.coverTypeShortDescription;
    log.debug('cover type', this.coverType)
    log.debug('Property ID', this.riskId)

    this.riskId = this.passedPolicyRiskDetails.propertyId;
    this.riskDescription = this.passedPolicyRiskDetails.propertyDescription;
    this.vehiclemakeModel = this.riskDescription;
    log.debug('Property Desc', this.vehiclemakeModel)

    this.vehicleMake = this.passedPolicyRiskDetails.vehicleMake;
    log.debug('Veh Make', this.vehicleMake)
    // const passedVehModel = this.vehicleMakeList.find(vehicle => vehicle.code === this.vehicleMake);
    // log.debug('Veh Make object', passedVehModel)

    this.vehicleModel = this.passedPolicyRiskDetails.vehicleModel;
    log.debug('VEH MODEL ', this.vehicleMake)
    this.passedModelYear = this.passedPolicyRiskDetails.modelYear;
  }
  loadAllSubclass() {
    this.subclassService
      .getAllSubclasses()
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (data) => {

          if (data) {
            this.allSubclassList = data;
            log.debug(this.allSubclassList, "All Subclass List");
            this.getProductSubclass();

            this.cdr.detectChanges();


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

          this.globalMessagingService.displayErrorMessage(
            'Error',
            this.errorMessage
          );
          log.info(`error >>>`, err);
        },
      });

  }
  getProductSubclass() {
    this.productService
      .getProductSubclasses(this.productCode)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (data) => {

          if (data) {
            this.subClassList = data._embedded.product_subclass_dto_list;
            log.debug(this.subClassList, 'Product Subclass List');
            log.debug(this.allSubclassList, 'All Subclass List');
            if (this.allSubclassList) {
              this.subClassList.forEach(element => {
                const matchingSubclasses = this.allSubclassList.filter(subCode => subCode.code === element.sub_class_code);
                this.allMatchingSubclasses.push(...matchingSubclasses);
              });

              log.debug("Retrieved Subclasses by code", this.allMatchingSubclasses);
            }



            this.cdr.detectChanges();


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

          this.globalMessagingService.displayErrorMessage(
            'Error',
            this.errorMessage
          );
          log.info(`error >>>`, err);
        },
      });
  }
  loadAllClients() {
    this.clientService
      .getClients(0, 100)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (data) => {

          if (data) {
            this.clientList = data;
            log.debug("CLIENT DATA:", this.clientList)
            this.clientData = this.clientList.content
            log.debug("CLIENT DATA:", this.clientData)
            const selectedClient = this.clientData.find(client => client.id === this.passedClientCode);
            log.debug("Passed CLient", selectedClient)
            this.passedClient = selectedClient
            log.debug("Passed CLient  not inusured", selectedClient)

            this.passedClientName = selectedClient.firstName + ' ' + selectedClient.lastName;

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

          this.globalMessagingService.displayErrorMessage(
            'Error',
            this.errorMessage
          );
          log.info(`error >>>`, err);
        },
      });
  }
  /**
  * Applies a global filter to a DataTable.
  * - Retrieves the input value from the event target.
  * - Calls the DataTable's 'filterGlobal' method with the input value and a specified string value.
  * @method applyFilterGlobal
  * @param {Event} $event - The event triggering the filter application.
  * @param {string} stringVal - The specified string value for filtering.
  * @return {void}
  */
  applyFilterGlobal($event, stringVal) {
    this.dt1.filterGlobal(($event.target as HTMLInputElement).value, stringVal);
  }
  loadClientDetails(id) {
    log.info("Client Id:", id)
    this.clientService.getClientById(id).subscribe(data => {
      this.clientDetails = data;
      log.debug("Selected Client Details:", this.clientDetails)
      // this.getCountries();
      this.saveclient()
      this.closebutton.nativeElement.click();
      // this.updateJointAccountData();
    })
  }
  saveclient() {
    // this.clientCode = this.clientDetails.id;
    this.passedClient = this.clientDetails
    log.debug("THE INSURRED FULL INFO", this.passedClient)
    this.passedClientName = this.clientDetails.firstName + ' ' + this.clientDetails.lastName;
    log.debug("another insured chosen:", this.passedClientName)
  }
  onSubclassSelected(selectedValue: any) {

    this.selectedSubclassCode = parseInt(selectedValue);
    log.debug("SELECTEDSubclass", this.selectedSubclassCode)

    // const selectedValue = event.target.value;
    this.selectedSubclassCode = parseInt(selectedValue);
    // Perform your action based on the selected value
    log.debug(this.selectedSubclassCode, 'Selected Subclass Code')
    const selectedSubclass = this.allMatchingSubclasses.find(subclass => subclass.code === this.selectedSubclassCode)
    this.selectedSubclass = selectedSubclass;
    log.debug(this.selectedSubclass, 'Selected Subclass Info')

    this.loadCovertypeBySubclassCode(this.selectedSubclassCode);
    this.loadAllBinders();
    // this.loadSubclassSectionCovertype();
    this.loadSubclassSectionCovertype();
    if(this.selectedSubclassCode)
      this.getRequiredGroups()
      this.getRiskClasses()
  }
  loadAllBinders() {
    this.binderService
      .getAllBindersQuick(this.selectedSubclassCode)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (data) => {

          if (data) {
            this.binderList = data;
            this.binderListDetails = this.binderList._embedded.binder_dto_list;
            console.log("All Binders Details:", this.binderListDetails);
            this.cdr.detectChanges();


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

          this.globalMessagingService.displayErrorMessage(
            'Error',
            this.errorMessage
          );
          log.info(`error >>>`, err);
        },
      });
  }
  loadCovertypeBySubclassCode(code: number) {
    this.subclassCoverTypesService
      .getSubclassCovertypeBySCode(code)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (data) => {

          if (data) {
            this.subclassCoverType = data;
            log.debug('Subclass Covertype', this.subclassCoverType);

            this.cdr.detectChanges();


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

          this.globalMessagingService.displayErrorMessage(
            'Error',
            this.errorMessage
          );
          log.info(`error >>>`, err);
        },
      });
  }
  onCoverTypeSelected(selectedValue: any) {

    this.coverTypeCode = parseInt(selectedValue);

    log.debug("Cover Type Code:", this.coverTypeCode)
    const selectedCover = this.subclassCoverType.find(cover => cover.code === this.coverTypeCode)

    this.selectedCoverType = selectedCover;
    log.debug("Cover Type selected:", selectedCover)
    this.selectedCoverTypeCode = this.selectedCoverType?.coverTypeCode;
    log.debug("Cover Type code selected:", this.selectedCoverTypeCode)

    this.covertypeSections = this.subclassSectionCoverList?.filter(sectionCover => sectionCover.coverTypeCode === this.selectedCoverTypeCode)
    log.debug("All section for a selected Cover Type:", this.covertypeSections)

    if (this.sectionList && this.covertypeSections) {
      this.allMatchingSections = [];
      this.covertypeSections.forEach(element => {
        const matchingSections = this.sectionList.filter(section => section.code === element.sectionCode);
        this.allMatchingSections.push(...matchingSections);
      });

      log.debug("Retrieved All matching sections", this.allMatchingSections);
    }
    this.filterMandatorySections();

  }
  getAllSection() {
    this.sectionService
      .getAllSections()
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (data) => {

          if (data) {
            this.sectionList = data;
            log.debug("Section List", this.sectionList)
            this.cdr.detectChanges();


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

          this.globalMessagingService.displayErrorMessage(
            'Error',
            this.errorMessage
          );
          log.info(`error >>>`, err);
        },
      });
  }
  onProductSelected() {
    log.debug("allow moto class field", this.policyDetails.product.allowMotorClass)
    this.motorClassAllowed = this.policyDetails.product.allowMotorClass;
    log.debug("Motor Class Allowed Value", this.motorClassAllowed);
    if (this.motorClassAllowed === 'Y') {
      this.showMotorSubclassFields = true;
      this.motorProduct = true;
    }
  }
  getVehicleMake() {
    this.vehicleMakeService
      .getAllVehicleMake()
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (data) => {

          if (data) {
            this.vehicleMakeList = data;
            log.debug("VehicleMake", this.vehicleMakeList)
            this.cdr.detectChanges();


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

          this.globalMessagingService.displayErrorMessage(
            'Error',
            this.errorMessage
          );
          log.info(`error >>>`, err);
        },
      });
  }
  onVehicleMakeSelected(selectedValue: any) {
    this.selectedVehicleMakeCode = selectedValue;

    log.debug("SELECTED vehicle CODE:", this.selectedVehicleMakeCode)



    // Convert selectedValue to the appropriate type (e.g., number)
    // const typedSelectedValue = this.convertToCorrectType(selectedValue);
    // log.debug("SELECTED vehicle CODE type changed:", typedSelectedValue)

    const selectedObject = this.vehicleMakeList.find(vehicleMake => vehicleMake.code === this.selectedVehicleMakeCode);

    // Check if the object is found
    if (selectedObject) {
      console.log('Selected Vehicle Object:', selectedObject);
    } else {
      console.error('Selected Vehicle Object not found');
    }
    this.getVehicleModel();
    this.selectedVehicleMakeName = selectedObject.name
  }

  // convertToCorrectType(value: any): any {
  //   // Implement the conversion logic based on the actual type of your identifier
  //   // For example, if your identifier is a number, you can use parseInt or parseFloat
  //   // If it's another type, implement the conversion accordingly
  //   return parseInt(value, 10); // Adjust based on your actual data type
  // }
  getVehicleModel() {

    this.vehicleModelService
      .getAllVehicleModel()
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (data) => {

          if (data) {
            this.vehicleModelList = data;
            log.debug("VehicleModel", this.vehicleModelList);
            this.vehicleModelDetails = this.vehicleModelList._embedded.vehicle_model_dto_list;
            log.debug("Vehicle Model Details", this.vehicleModelDetails);
            this.filteredVehicleModel = this.vehicleModelDetails.filter(model => model.vehicle_make_code == this.selectedVehicleMakeCode);
            log.debug("Filtered Vehicle Model Details", this.filteredVehicleModel);

            this.cdr.detectChanges();


          } else {
            this.errorOccurred = true;
            this.errorMessage = 'Empty response received from the server.';
            this.globalMessagingService.displayErrorMessage('Error', this.errorMessage);
          }
        },
        error: (err) => {

          this.globalMessagingService.displayErrorMessage(
            'Error',
            this.errorMessage
          );
          log.info(`error >>>`, err);
        },
      });
  }
  onVehicleModelSelected(selectedVehivleModel: any) {
    const selectedValue = selectedVehivleModel
    log.debug("SELECTED vehicle make CODE:", selectedValue)

    // Find the selected object using the converted value
    const selectedObject = this.filteredVehicleModel.find(vehicleModel => vehicleModel.code === selectedValue);

    // Check if the object is found
    if (selectedObject) {
      console.log('Selected Vehicle Model:', selectedObject);
      // Perform further actions with the selected object as needed
    } else {
      console.error('Selected Vehicle Model not found');
    }
    this.selectedVehicleModelName = selectedObject.name;
    this.vehiclemakeModel = this.selectedVehicleMakeName + ' ' + this.selectedVehicleModelName;
    console.log('Selected Vehicle make model combined ', this.vehiclemakeModel);

  }
  getRiskLocation() {
    this.countryService
      .getMainCityStatesByCountry(this.userCountryCode)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (data) => {

          if (data) {
            this.statesList = data;
            log.debug("State  list", this.statesList)


            this.cdr.detectChanges();

          } else {
            this.errorOccurred = true;
            this.errorMessage = 'Empty response received from the server.';
            this.globalMessagingService.displayErrorMessage('Error', this.errorMessage);
          }
        },
        error: (err) => {

          this.globalMessagingService.displayErrorMessage(
            'Error',
            this.errorMessage
          );
          log.info(`error >>>`, err);
        },
      });
  }
  onStateSelected(selectedValue: any) {
    this.selectedStateId = selectedValue;
    if (this.selectedStateId) {
      this.getRiskTown();
    }
    log.debug("SELECTED State Id:", this.selectedStateId)

  }
  getRiskTown() {
    this.countryService
      .getTownsByMainCityState(this.selectedStateId)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (data: any) => {
          if (data) {
            this.townList = data;
            log.debug("Town List:", this.townList)
            // this.userCountryCode= this.detailedUserInfo.countryCode;
            // log.debug("User country code:",this.userCountryCode);
            // if(this.userCountryCode){
            //   this.getRiskLocation();
            // }

          }
          else {
            this.errorOccurred = true;
            this.errorMessage = 'Empty response received from the server.';
            this.globalMessagingService.displayErrorMessage('Error', this.errorMessage);
          }

        },
        error: (err) => {

          this.globalMessagingService.displayErrorMessage(
            'Error',
            this.errorMessage
          );
          log.info(`error >>>`, err);
        },
      })
  }

  getRiskTerritory() {
    this.countryService
      .getCountries()
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (data: any) => {
          if (data && data.length > 0) {
            this.countryList = data;
            console.log("Country List:", this.countryList);

            const country = this.countryList.find(country => country.id === this.userCountryCode);
            console.log("User Country:", country);

            if (country) {
              this.userCountryName = country.name;
              console.log("User Country Name:", this.userCountryName);
            } else {
              this.errorOccurred = true;
              this.errorMessage = 'User country not found in the list.';
              this.globalMessagingService.displayErrorMessage('Error', this.errorMessage);
            }
          } else {
            this.errorOccurred = true;
            this.errorMessage = 'Empty response received from the server.';
            this.globalMessagingService.displayErrorMessage('Error', this.errorMessage);
          }
        },
        error: (err) => {
          this.errorOccurred = true;
          this.errorMessage = 'An error occurred while fetching countries.';
          this.globalMessagingService.displayErrorMessage('Error', this.errorMessage);
          log.debug('Error:', err);
        },
      });
  }
  addPolicyRisk() {
    if (this.policyRiskForm.invalid) {
      this.policyRiskForm.markAllAsTouched();  // This will trigger validation for all fields
    }
    if (this.passedPolicyRiskDetails){
      this.policyRiskForm.get('addOrEdit').setValue("E");
    }
    else{
      this.policyRiskForm.get('addOrEdit').setValue("A");

    }
    log.debug("Policy batch no:", this.policyDetails.batchNo)
    this.policyRiskForm.get('insureds.client.firstName').setValue(this.passedClient?.firstName);
    this.policyRiskForm.get('insureds.client.lastName').setValue(this.passedClient?.lastName);
    this.policyRiskForm.get('insureds.client.id').setValue(this.passedClient?.id);
    this.policyRiskForm.get('insureds.prpCode').setValue(this.policyDetails.clientCode);
    this.policyRiskForm.get('allowedCommissionRate').setValue(890);
    this.policyRiskForm.get('basicPremium').setValue(890);
    this.policyRiskForm.get('binderCode').setValue(this.selectedBinder);
    this.policyRiskForm.get('commissionAmount').setValue(890);
    this.policyRiskForm.get('commissionRate').setValue(2);
    this.policyRiskForm.get('coverTypeCode').setValue(this.selectedCoverTypeCode);
    this.policyRiskForm.get('coverTypeShortDescription').setValue(this.selectedCoverType?.description);
    this.policyRiskForm.get('currencyCode').setValue(268);
    this.policyRiskForm.get('dateCoverFrom').setValue(this.policyDetails.wefDt);
    this.policyRiskForm.get('dateCoverTo').setValue(this.policyDetails.wetDt);
    this.policyRiskForm.get('delSect').setValue(null);
    this.policyRiskForm.get('grossPremium').setValue(890);
    this.policyRiskForm.get('ipuNcdCertNo').setValue(null);
    this.policyRiskForm.get('loaded').setValue("N");
    this.policyRiskForm.get('ltaCommission').setValue(890);
    this.policyRiskForm.get('netPremium').setValue(0);
    this.policyRiskForm.get('paidPremium').setValue(890);
    this.policyRiskForm.get('policyBatchNo').setValue(this.policyDetails.batchNo);
    this.policyRiskForm.get('policyNumber').setValue(this.policyDetails.policyNo);
    this.policyRiskForm.get('policyStatus').setValue(this.policyDetails.policyStatus);
    this.policyRiskForm.get('productCode').setValue(this.policyDetails.product.code);
    this.policyRiskForm.get('propertyDescription').setValue(this.vehiclemakeModel);
    this.policyRiskForm.get('propertyId')
    this.policyRiskForm.get('quantity').setValue(0);
    this.policyRiskForm.get('reinsuranceEndorsementNumber').setValue("N");
    this.policyRiskForm.get('renewalArea').setValue("N");
    this.policyRiskForm.get('riskFpOverride').setValue(0);
    this.policyRiskForm.get('riskIpuCode').setValue(0);
    this.policyRiskForm.get('stampDuty').setValue(890);
    this.policyRiskForm.get('subClassCode').setValue(this.selectedSubclassCode);
    this.policyRiskForm.get('subClassDescription').setValue(this.selectedSubclass.description);
    this.policyRiskForm.get('transactionType').setValue(this.selectedTransactionType);
    this.policyRiskForm.get('underwritingYear').setValue(this.currentYear);
    this.policyRiskForm.get('value').setValue(0);
    this.policyRiskForm.get('autogenerateCert');
    this.policyRiskForm.get('cashApplicable');
    this.policyRiskForm.get('cashLevel');
    this.policyRiskForm.get('computeMaxExposure');
    this.policyRiskForm.get('conveyanceType');
    this.policyRiskForm.get('coverDays');
    this.policyRiskForm.get('installmentPaymentPercentage');
    this.policyRiskForm.get('installmentPeriod');
    this.policyRiskForm.get('ipu_ncd_cert_no');
    this.policyRiskForm.get('logbookAvailable');
    this.policyRiskForm.get('logbookUnderInsuredName');
    this.policyRiskForm.get('maintenanceCover');
    this.policyRiskForm.get('maxExposureAmount');
    this.policyRiskForm.get('modelYear');
    this.policyRiskForm.get('ncdApplicable');
    this.policyRiskForm.get('ncdLevel');
    this.policyRiskForm.get('newRisk');
    this.policyRiskForm.get('periodRate');
    this.policyRiskForm.get('quakeFloodZone');
    this.policyRiskForm.get('regularDriver');
    this.policyRiskForm.get('retroactiveCover');
    this.policyRiskForm.get('riskAddress');
    this.policyRiskForm.get('riskClass');
    this.policyRiskForm.get('riskDetails');
    this.policyRiskForm.get('riskLocation');
    this.policyRiskForm.get('surveyDate');
    this.policyRiskForm.get('territory');
    this.policyRiskForm.get('topLocationLevel');
    this.policyRiskForm.get('town');
    this.policyRiskForm.get('vehicleMake');
    this.policyRiskForm.get('vehicleModel');

    // const riskForm = this.policyRiskForm.value;
    const riskForm = this.policyRiskForm.value;
    this.riskForm = [riskForm];

    log.debug("MY RISK FORM", JSON.stringify(this.policyRiskForm.value))
    this.policyService
      .addPolicyRisk(this.policyDetails.batchNo, this.riskForm, this.user)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (data: any) => {
          if (data) {
            log.debug("Add risk endpoint response:", data)
            this.globalMessagingService.displaySuccessMessage('Success', 'Policy Risk has been created');
            if (data && data._embedded && Array.isArray(data._embedded) && data._embedded.length > 0) {
              const embedded = data._embedded[0];
              if (embedded && embedded['IPU_CODE[0]']) {
                this.riskCode = embedded['IPU_CODE[0]'];
                log.debug('Risk Code:', this.riskCode);
                this.createRiskSection();
                this.createSchedule();
              }
            }
            this.policyRiskForm.reset()
          }
          else {
            this.errorOccurred = true;
            this.errorMessage = 'Empty response received from the server.';
            this.globalMessagingService.displayErrorMessage('Error', this.errorMessage);
          }

        },
        error: (err) => {

          this.globalMessagingService.displayErrorMessage(
            'Error',
            this.errorMessage
          );
          log.info(`error >>>`, err);
        },
      })
  }
  loadSubclassSectionCovertype() {
    this.subclassSectionCovertypeService
      .getSubclassCovertypeSections()
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (data: any) => {
          if (data) {
            this.subclassSectionCoverList = data;
            log.debug("Subclass Section Covertype:", this.subclassSectionCoverList);
            this.mandatorySections = this.subclassSectionCoverList.filter(section => section.subClassCode == this.selectedSubclassCode && section.isMandatory == "Y");
            log.debug("Mandatory Section Covertype:", this.mandatorySections);

          }
          else {
            this.errorOccurred = true;
            this.errorMessage = 'Empty response received from the server.';
            this.globalMessagingService.displayErrorMessage('Error', this.errorMessage);
          }

        },
        error: (err) => {

          this.globalMessagingService.displayErrorMessage(
            'Error',
            this.errorMessage
          );
          log.info(`error >>>`, err);
        },
      })
  }
  filterMandatorySections() {
    log.debug("selectedCover should be coverdesc", this.selectedCoverType?.coverTypeShortDescription)
    const coverType = this.selectedCoverType?.coverTypeShortDescription
    if (coverType) {
      this.filteredMandatorySections = this.mandatorySections.filter(section =>
        section.coverTypeShortDescription === (coverType === "COMP" ? "COMP" : coverType));
      log.debug("Filtered Section", this.filteredMandatorySections);

      this.filteredAllMatchingSections = this.allMatchingSections.filter(section =>
        !this.filteredMandatorySections.some(filteredSection => filteredSection.sectionCode === section.code)
      );
      console.log('Filtered Matching Sections:', this.filteredAllMatchingSections);

      this.getPremium(this.filteredMandatorySections);
    } else {
      this.filteredMandatorySections = this.mandatorySections;
    }
  }
  // getPremium(passedSections: any[]) {
  //   const selectedBinder = this.policyRiskForm.get('binderCode').value;
  //   this.selectedBinder = parseInt(selectedBinder);

  //   log.debug("Selected Binder:", this.selectedBinder);

  //   const selectedSubclassCode = this.selectedSubclassCode;
  //   const sections = passedSections;
  //   log.debug("Sections passed to premium service:", sections);

  //   // Create an array to store observables returned by each service call
  //   const observables = sections?.map(section => {
  //     return this.premiumRateService.getAllPremiums(section.sectionCode, this.selectedBinder, selectedSubclassCode);
  //   });

  //   // Use forkJoin to wait for all observables to complete
  //   forkJoin(observables).subscribe((data: any[]) => {
  //     // data is an array containing the results of each service call
  //     const newPremiumList = data.flat(); // Flatten the array if needed
  //     log.debug("New Premium List", newPremiumList);

  //     // Check if premiumList is an array (safeguard against initialization issues)
  //     if (!Array.isArray(this.premiumList)) {
  //       this.premiumList = [];
  //     }

  //     // Append newPremiumList to existing premiumList
  //     this.premiumList = [...this.premiumList, ...newPremiumList];
  //     log.debug("Updated Premium List", this.premiumList);
  //   });
  // }
  getPremium(passedSections: any[]) {
    const selectedBinder = this.policyRiskForm.get('binderCode').value;
    this.selectedBinder = parseInt(selectedBinder);

    log.debug("Selected Binder:", this.selectedBinder);

    const selectedSubclassCode = this.selectedSubclassCode;
    const sections = passedSections;
    log.debug("Sections passed to premium service:", sections);

    // Create an array to store observables returned by each service call
    const observables = sections?.map(section => {
      return this.premiumRateService.getAllPremiums(section.sectionCode, this.selectedBinder, selectedSubclassCode);
    });

    // Use forkJoin to wait for all observables to complete
    forkJoin(observables).subscribe((data: any[]) => {
      // data is an array containing the results of each service call
      const newPremiumList = data.flat(); // Flatten the array if needed
      log.debug("New Premium List", newPremiumList);

      // Check if premiumList is an array (safeguard against initialization issues)
      if (!Array.isArray(this.premiumList)) {
        this.premiumList = [];
      }

      // Append newPremiumList to existing premiumList
      this.premiumList = [...this.premiumList, ...newPremiumList];
      log.debug("Updated Premium List", this.premiumList);
    });
  }



  matchesSearch(description: string): boolean {
    return description.toLowerCase().includes(this.searchText.toLowerCase());
  }
  // onCheckboxChange(section: subclassSection) {

  //   log.debug("Checked Section Data", section)
  //   this.checkedSectionCode = section.sectionCode;
  //   this.checkedSectionDesc = section.sectionShortDescription;
  //   this.checkedSectionType = section.sectionType;
  //   // this.getPremiumRates()
  //   // this.getSectionbyCode()
  // }  
  // onCheckboxChange(section: any) {
  //   const index = this.selectedSections.findIndex((s) => s.code === section.code);

  //   if (index === -1) {
  //     // Section is not yet selected, add it to the array
  //     this.selectedSections.push(section);
  //     log.debug("Checked Sections Data", this.selectedSections);
  //     this.allTransformedSections = [];
  //     this.selectedSections.forEach(element => {
  //       const changedSections = this.covertypeSections?.filter(section => section.sectionCode === element.code
  //         && section.coverTypeShortDescription === this.selectedCoverType.coverTypeShortDescription);
  //       this.allTransformedSections?.push(...changedSections);
  //       log.debug("Transformed Sections Data", this.allTransformedSections);

  //     });
  //     this.getPremium(this.allTransformedSections);
  //     // this.createRiskSection();


  //   } else {
  //     // Section is already selected, remove it from the array
  //     this.selectedSections.splice(index, 1);
  //   }
  // }
  onCheckboxChange(section: any) {
    const index = this.selectedSections.findIndex((s) => s.code === section.code);

    if (index === -1) {
      // Section is not yet selected, add it to the array
      this.selectedSections.push(section);
      log.debug("Checked Sections Data", this.selectedSections);
      this.allTransformedSections = [];

      // Filter sections based on the selected cover type
      this.selectedSections.forEach(element => {
        const changedSections = this.covertypeSections?.filter(section =>
          section.sectionCode === element.code &&
          section.coverTypeShortDescription === this.selectedCoverType?.coverTypeShortDescription
        );

        if (changedSections) {
          this.allTransformedSections.push(...changedSections);
          log.debug("Transformed Sections Data", this.allTransformedSections);
        } else {
          log.debug("No matching sections found for", element);
        }
      });

      this.getPremium(this.allTransformedSections);
      // this.createRiskSection();
    } else {
      // Section is already selected, remove it from the array
      this.selectedSections.splice(index, 1);
    }
  }

  isSelected(section: any): boolean {
    return this.selectedSections.some((s) => s.code === section.code);

  }
  createSectionDetailsForm() {
    this.sectionDetailsForm = this.fb.group({
      bindCode: [''],
      coverTypeCode: [''],
      group: [''],
      limit: [''],
      ncdLevel: [''],
      renewal: [''],
      riskCode: [''],
      row: [''],
      sectionCode: [''],
      subClassCode: ['']
    });
  }
  // createRiskSection() {
  //   const section = this.sectionDetailsForm.value;
  //   this.sectionArray = [section];
  //   section.bindCode = this.selectedBinder;
  //   section.coverTypeCode = this.selectedCoverType.coverTypeCode;
  //   section.group = 1;
  //   section.limit = 0;
  //   section.ncdLevel = null;
  //   section.renewal = "RN";
  //   section.riskCode = this.riskCode;
  //   section.row = 0;
  //   section.sectionCode = this.premiumList[0].sectionCode;
  //   section.subClassCode = this.selectedSubclassCode;

  //   this.policyService
  //     .createRiskSection(this.sectionArray)
  //     .pipe(untilDestroyed(this))
  //     .subscribe({
  //       next: (data: any) => {
  //         if (data) {
  //           log.debug("Risk Section Created data:", data)
  //           this.globalMessagingService.displaySuccessMessage('Success', 'Risk Section has been added');


  //         }
  //         else {
  //           this.errorOccurred = true;
  //           this.errorMessage = 'Empty response received from the server.';
  //           this.globalMessagingService.displayErrorMessage('Error', this.errorMessage);
  //         }

  //       },
  //       error: (err) => {

  //         this.globalMessagingService.displayErrorMessage(
  //           'Error',
  //           this.errorMessage
  //         );
  //         log.info(`error >>>`, err);
  //       },
  //     })
  // }
  createRiskSection() {
    const section = this.sectionDetailsForm.value;
    log.debug("Premium List:", this.premiumList);
    // Check if premiumList has data and if the index is within bounds
    if (this.premiumList.length > 0 && this.premiumListIndex < this.premiumList.length) {
      console.log(`Using sectionCode: ${this.premiumList[this.premiumListIndex].sectionCode} (Premium List Index: ${this.premiumListIndex})`);

      // Log the current premiumListIndex before incrementing
      console.log(`Current premiumListIndex before increment: ${this.premiumListIndex}`);

      // Increment the premiumListIndex and wrap around using modulo
      this.premiumListIndex = (this.premiumListIndex + 1) % this.premiumList.length;

      // Log the updated premiumListIndex after incrementing
      console.log(`Updated premiumListIndex after increment: ${this.premiumListIndex}`);

      section.sectionCode = this.premiumList[this.premiumListIndex].sectionCode;
    } else {
      // Handle scenario when premiumList is empty or index is out of bounds
      console.error('Premium list is empty or index is out of bounds.');
      return; // or throw an error, handle as per your requirement
    }

    // Set other properties for section
    this.sectionArray = [section];
    section.bindCode = this.selectedBinder;
    section.coverTypeCode = this.selectedCoverType.coverTypeCode;
    section.group = 1;
    section.limit = 0;
    section.ncdLevel = null;
    section.renewal = null;
    section.riskCode = this.riskCode;
    section.row = 0;
    section.subClassCode = this.selectedSubclassCode;

    this.policyService
      .createRiskSection(this.sectionArray)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (data: any) => {
          if (data) {
            console.log("Risk Section Created data:", data);
            this.globalMessagingService.displaySuccessMessage('Success', 'Risk Section has been added');
          } else {
            this.errorOccurred = true;
            this.errorMessage = 'Empty response received from the server.';
            this.globalMessagingService.displayErrorMessage('Error', this.errorMessage);
          }
        },
        error: (err) => {
          this.globalMessagingService.displayErrorMessage('Error', 'An error occurred.');
          console.error(`Error >>>`, err);
        },
      });
  }
  getQuakeZone() {
    this.quakeZoneService
      .getQuakeZone()
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (data) => {

          if (data) {
            this.quakeZoneList = data;
            log.debug("Quake Zone list", this.quakeZoneList)

            this.cdr.detectChanges();

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

          this.globalMessagingService.displayErrorMessage(
            'Error',
            this.errorMessage
          );
          log.info(`error >>>`, err);
        },
      });
  }

  downloadCSVTemplate(): void {
    console.log("TEST")
    const templateFilePath = '/assets/data/private-motor-schedule-template.csv';
    const link = document.createElement('a');
    link.setAttribute('target', '_blank');
    link.setAttribute('href', templateFilePath);
    link.setAttribute('download', 'template.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {

      this.uploading = 'progress';

      Papa.parse(file, {
        complete: (result: any) => {
          console.log('file result', result.data)
          this.csvRisksList = result.data
          // Assuming CSV has header row, you can access data with result.data
          // ADDING A SCHEDULE
          this.csvRisksList.forEach(element => {
            console.log(element,'element')
            const csvRisksList = element
            const schedule = this.scheduleDetailsForm.value;
             // Set specific values for uploaded fields
            schedule.details.level1.bodyType = csvRisksList.bodyType;
            schedule.details.level1.yearOfManufacture = csvRisksList.yearOfManufacture;
            schedule.details.level1.color = csvRisksList.color;
            schedule.details.level1.engineNumber = csvRisksList.engineNumber;
            schedule.details.level1.cubicCapacity = csvRisksList.cubicCapacity;
            schedule.details.level1.Make =csvRisksList.Make;
            schedule.details.level1.coverType = csvRisksList.coverType;
            schedule.details.level1.registrationNumber = csvRisksList.registrationNumber;
            schedule.details.level1.chasisNumber = csvRisksList.chasisNumber;
            schedule.details.level1.tonnage = csvRisksList.tonnage;
            schedule.details.level1.carryCapacity = csvRisksList.carryCapacity;
            schedule.details.level1.logBook = csvRisksList.logBook;
            schedule.details.level1.value = csvRisksList.value;
            schedule.riskCode = csvRisksList.riskCode;
            schedule.transactionType = "Q";
            schedule.version = 0;
            console.log(this.scheduleDetailsForm.value)


            this.policyService.createSchedules(schedule).subscribe(
              (data) => {
                try {
                  this.scheduleData = data;
                  this.scheduleList=this.scheduleData._embedded;
                  this.scheduleList.forEach(element => {
                    console.log(element,'step2')
                    console.log(element.details.level1,'step2')
                    const level1 =  element.details.level1
                    const scheduleArray = [];
                    console.log(level1,'level1')
                    this.scheduleArray.push(level1)
                    console.log(this.scheduleArray,'scheduleArray')
                  });
                  console.log(this.scheduleArray,'schedule array outside')
                 
                  log.debug("Schedule Data:", this.scheduleList);
                  this.successCounter+1
                 
        
                } catch (error) {
                  this.failedCounter = this.failedCounter+1
                  console.log(this.failedCounter)
        
                }
              },
              (error) => {
                // console.error('Error creating schedule:', error);
               
        
              }
            );
          });
          console.log("Sucessful schedules",this.successCounter)
          console.log("Failed schedules",this.failedCounter)
          // if(this.successCounter>0){
          //   console.log("Sucessful schedules",this.successCounter)
          // }
          // if(this.failedCounter>0){
          //   console.log("Failed schedules",this.failedCounter)
          // }
          
          
          try {

            this.uploadedFileName = file.name;
            sessionStorage.setItem('uploadedFileName', this.uploadedFileName)
            this.uploading = 'success';
          
       
        
            // Set specific default values for some fields
            // schedule.details.level1.bodyType = csvRisksList.bodyType;
            // schedule.details.level1.yearOfManufacture = csvRisksList.yearOfManufacture;
            // schedule.details.level1.color = csvRisksList.color;
            // schedule.details.level1.engineNumber = csvRisksList.engineNumber;
            // schedule.details.level1.cubicCapacity = csvRisksList.cubicCapacity;
            // schedule.details.level1.Make =csvRisksList.Make;
            // schedule.details.level1.coverType = csvRisksList.coverType;
            // schedule.details.level1.registrationNumber = csvRisksList.registrationNumber;
            // schedule.details.level1.chasisNumber = csvRisksList.chasisNumber;
            // schedule.details.level1.tonnage = csvRisksList.tonnage;
            // schedule.details.level1.carryCapacity = csvRisksList.carryCapacity;
            // schedule.details.level1.logBook = csvRisksList.logBook;
            // schedule.details.level1.value = csvRisksList.value;
            // schedule.riskCode = csvRisksList.riskCode;
            // schedule.transactionType = "Q";
            // schedule.version = 0;
          } catch (e) {
            console.log(`file upload failed >>> `, e);
          }
        },
        header: true // Set to true if CSV file has a header row
      });
    } else {
      this.fileSelected = false;
      this.uploadedFileName = '';
      this.uploading = '';
    }
  }


  // EDIT SCHEDULE DETAILS FUNCTIONALITY 

  // This method Clears the Schedule Detail form by resetting the form model
  clearForm() {
    this.scheduleDetailsForm.reset();

  }

  updateSchedule() {
    const schedule = this.scheduleDetailsForm.value;
    schedule.riskCode = this.riskCode;
    schedule.transactionType = "Q";
    schedule.version = 0;
    this.quotationService.updateSchedule(schedule).subscribe(data => {
      this.updatedScheduleData = data;
      console.log('Updated Schedule Data:', this.updatedScheduleData);
      this.updatedSchedule = this.updatedScheduleData._embedded;
      console.log('Updated Schedule  nnnnn:', this.updatedSchedule);
      const index = this.scheduleList.findIndex(item => item.code === this.updatedSchedule.code);
      if (index !== -1) {
        this.scheduleList[index] = this.updatedSchedule;
        this.cdr.detectChanges();
      }

      try {

        this.scheduleDetailsForm.reset()
        this.globalMessagingService.displaySuccessMessage('Success', 'Successfully updated');
      } catch (error) {
        // this.globalMessagingService.displayErrorMessage('Error', 'Error, try again later');

        this.scheduleDetailsForm.reset()
      }
    })
    this.cdr.detectChanges();

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
        }),
      }),
      riskCode: [''],
      transactionType: [''],
      version: [''],
    });
  }

  getImportedRisk() {
    const policyDetails = JSON.parse(sessionStorage.getItem('passedPolicyDetails'))
    const policyNo = policyDetails.policyNumber
    console.log(policyNo)
    if (policyNo) {
      console.log(policyNo)
      this.policyService.getPolicyRisks(policyNo).pipe(untilDestroyed(this))
        .subscribe({
          next: (data) => {
            this.policyRisks = data
            this.policyRiskDetails = this.policyRisks.content
            this.policyRiskDetails.forEach(element => {
              this.policySectionDetails = element.sections
              console.log('section test', element.sections)
            });
            console.log('risks', this.policyRiskDetails)
          }


        })
    }
  }
  getModelYear() {
    this.productService.getYearOfManufacture().subscribe({
      next: (data) => {
        const model = data._embedded
        this.modelYear = model[0]["List of cover years"]
        console.log("model year", this.modelYear)
      }, error: (err) => {
        this.globalMessagingService.displayErrorMessage('Error', 'Error fetching model years');
        console.error(err);
      }
    })
  }
  filterPolicies(policyNo) {
    if (policyNo) {
      this.policyService.getbypolicyNo(policyNo).subscribe({
        next: (data) => {
          if (data === null) {
            this.globalMessagingService.displayErrorMessage('Policy not found', ' Try a different policy no or check the structure of the policy No');
          }
          this.selectedPolicy = [data];


          console.log(this.selectedPolicy)
        }, error: (err) => {
          this.globalMessagingService.displayErrorMessage('Policy not found', ' Try a different policy no or check the structure of the policy No');
          console.error(err);
        }
      })
    } else {
      this.globalMessagingService.displayErrorMessage('Error', 'Fill in a policy number');
    }


  }
  filterRisk(riskId) {
    if (riskId) {
      this.policyService.getbyRiskId(riskId).subscribe({
        next: (data) => {
          if (data === null) {
            this.globalMessagingService.displayErrorMessage('Risk not found', 'Try a different Risk Id or check the structure of the Risk Id');
          }
          this.selectedRisk = [data];
        }, error: (err) => {
          this.globalMessagingService.displayErrorMessage('Risk not found', 'Try a different Risk Id or check the structure of the Risk Id');
          console.error(err);
        }
      })
    } else {
      this.globalMessagingService.displayErrorMessage('Error', 'Fill in a policy number');
    }

  }
  createSchedule() {
    const schedule = this.scheduleDetailsForm.value;
    const riskID = this.policyRiskForm.get('propertyId').value;
    log.debug("passedriskid", riskID);
    
  log.debug("passedcovertype",this.selectedCoverType)

    // Set specific default values for some fields
    schedule.details.level1.bodyType = null;
    schedule.details.level1.yearOfManufacture = null;
    schedule.details.level1.color = "red";
    schedule.details.level1.engineNumber = null;
    schedule.details.level1.cubicCapacity = null;
    schedule.details.level1.Make =this.selectedVehicleMakeName;
    schedule.details.level1.coverType = this.selectedCoverType.coverTypeShortDescription;
    schedule.details.level1.registrationNumber = riskID;
    schedule.details.level1.chasisNumber = null;
    schedule.details.level1.tonnage = null;
    schedule.details.level1.carryCapacity = null;
    schedule.details.level1.logBook = null;
    schedule.details.level1.value = null;
    schedule.riskCode = this.riskCode;
    schedule.transactionType = "Q";
    schedule.version = 0;

    this.policyService.createSchedules(schedule).subscribe(
      (data) => {
        try {
          this.scheduleData = data;
          this.scheduleList=this.scheduleData._embedded;
          this.scheduleList.forEach(element => {
            console.log(element,'step2')
            console.log(element.details.level1,'step2')
            const level1 =  element.details.level1
            const scheduleArray = [];
            console.log(level1,'level1')
            this.scheduleArray.push(level1)
            console.log(this.scheduleArray,'scheduleArray')
          });
          console.log(this.scheduleArray,'schedule array outside')
          this.csvRisksList =this.scheduleList;
          log.debug("Schedule Data:", this.scheduleList);
          this.globalMessagingService.displaySuccessMessage('Success', 'Schedule created')

        } catch (error) {
          this.globalMessagingService.displayErrorMessage('Error', 'Error, try again later')

        }
      },
      (error) => {
        console.error('Error creating schedule:', error);
        this.globalMessagingService.displayErrorMessage('Error', 'Error, try again later')

      }
    );
  }
  next(){
    this.router.navigate(['/home/gis/policy/policy-summary']);
  }
  previous(){
    this.router.navigate([`/home/gis/policy/policy-product/edit/${this.policyDetails.batchNo}`]);
  }
  editPolicyDetails(){
    this.router.navigate([`/home/gis/policy/policy-product/edit/${this.policyDetails.batchNo}`]);
  
  }
  getRequiredGroups(){
    this.policyService.getRelationalGroups(this.selectedSubclassCode).pipe(untilDestroyed(this))
    .subscribe({
      next: (data) => {
        this.relationGroups = data
        
        console.log('Relation Groups', this.relationGroups)
      }


    })
}
getRiskClasses(){
  this.policyService
  .getRiskClass(this.selectedSubclassCode,this.currentYear)
  .pipe(untilDestroyed(this))
  .subscribe({
    next: (response: any) => {
      this.riskClassList= response._embedded
      log.debug("RISK CLASSES:",this.riskClassList)

    },
    error: (error) => {

      this.globalMessagingService.displayErrorMessage('Error', 'Failed to add  certificates details.Try again later');
    }
  })
}
}
