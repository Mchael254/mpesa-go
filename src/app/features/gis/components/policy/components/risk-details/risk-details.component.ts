import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Logger, untilDestroyed } from '../../../../../../shared/shared.module'
import { PolicyService } from '../../services/policy.service';
import { Router } from '@angular/router';
import { GlobalMessagingService } from '../../../../../../shared/services/messaging/global-messaging.service';
import { SubclassesService } from '../../../setups/services/subclasses/subclasses.service';
import { Subclass, Subclasses, subclassCoverTypes, vehicleMake, vehicleModel } from '../../../setups/data/gisDTO';
import { ProductsService } from '../../../setups/services/products/products.service';
import { SubClassCoverTypesService } from '../../../setups/services/sub-class-cover-types/sub-class-cover-types.service';
import { BinderService } from '../../../setups/services/binder/binder.service';
import { VehicleMakeService } from '../../../setups/services/vehicle-make/vehicle-make.service';
import { VehicleModelService } from '../../../setups/services/vehicle-model/vehicle-model.service';
import { PolicyResponseDTO, PolicyContent } from '../../data/policy-dto';
import { CountryDto, StateDto, TownDto } from '../../../../../../shared/data/common/countryDto';
import { CountryService } from '../../../../../../shared/services/setups/country/country.service';
import { StaffService } from '../../../../../entities/services/staff/staff.service';
import { StaffDto } from '../../../../../entities/data/StaffDto';
import underwritingSteps from '../../data/underwriting-steps.json'
import { ClientDTO } from 'src/app/features/entities/data/ClientDTO';
import { ClientService } from 'src/app/features/entities/services/client/client.service';
import { Table } from 'primeng/table';

const log = new Logger("RiskDetailsComponent");

@Component({
  selector: 'app-risk-details',
  templateUrl: './risk-details.component.html',
  styleUrls: ['./risk-details.component.css']
})
export class RiskDetailsComponent {
  steps=underwritingSteps
  policyRiskForm: FormGroup;
  show: boolean = true;
  isNcdApplicable: boolean = false;
  isCashApplicable: boolean = false;

  passedPolicyDetails: any;
  batchNo: any;
  policyResponse: PolicyResponseDTO;
  policyDetails: PolicyContent;

  passedUserDetails: any;
  userId:any;
  detailedUserInfo:StaffDto;
  userCountryCode:any;
  
  errorMessage: string;
  errorOccurred: boolean;

  subClassList: Subclass[];
  allSubclassList: Subclasses[]
  allMatchingSubclasses = [];
  selectedSubclassCode: any;
  selectedSubclass:any;

  productCode: any;

  binderList: any;
  binderListDetails: any;

  subclassCoverType: subclassCoverTypes[] = [];
  selectedCoverType:any;
  coverTypeCode: any;
  coverTypeDesc: any;

  passedCoverFrom: any;
  passedCoverTo: any;
  passedCoverDays: any;
  passedClientCode:any;
  passedClientName:any;
  passedClient:any;

  clientData: ClientDTO[];
  clientDetails: ClientDTO;
  clientList:any;

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
   townList:TownDto[];
   countryList:CountryDto[];
   userCountryName:any;
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
    public staffService :StaffService,
    public globalMessagingService: GlobalMessagingService,
    private router: Router,
    public cdr: ChangeDetectorRef,
    private clientService: ClientService,


  ) {

  }

  ngOnInit(): void {
    this.loadAllSubclass();
    this.getVehicleMake();
    const passedPolicyDetailsString = sessionStorage.getItem('passedPolicyDetails');
    this.passedPolicyDetails = JSON.parse(passedPolicyDetailsString);
    log.debug("Passed Policy Details:", this.passedPolicyDetails);

    const passedUserDetailsString = sessionStorage.getItem('passedUserDetails');
    this.passedUserDetails = JSON.parse(passedUserDetailsString);
    log.debug("Passed User Details:", this.passedUserDetails);
    this.userId= this.passedUserDetails?.code
    log.debug("Passed User Id:", this.userId);
    if(this.userId){
      this.getUserDetails();
    }else{
      this.globalMessagingService.displayErrorMessage(
        'Error',
        'User ID not found'
      );
    }

    this.createPolicyRiskForm();
    this.getPolicy();

  }
  ngOnDestroy(): void { }
  getUserDetails() {
    this.staffService
      .getStaffById(this.userId)
      .pipe(untilDestroyed(this))
      .subscribe({
        next:(data:any) =>{
          if(data){
            this.detailedUserInfo=data;
            log.debug("Detailed User Details:",this.detailedUserInfo)
            this.userCountryCode= this.detailedUserInfo.countryCode;
            log.debug("User country code:",this.userCountryCode);
            if(this.userCountryCode){
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

      allowed_commission_rate: [''],
      basic_premium: [''],
      binder_code: [''],
      commission_amount: [''],
      commission_rate: [''],
      cover_type_code: [''],
      cover_type_short_description: [''],
      currency_code: [''],
      date_cover_from: [''],
      date_cover_to: [''],
      del_sect: [''],
      gross_premium: [''],
      insureds: this.fb.group({
        client: this.fb.group({
          first_name: [''],
          id: [''],
          last_name: ['']
        }),
        prp_code: [''],
      }),
      ipu_ncd_cert_no: [''],
      loaded: [''],
      lta_commission: [''],
      net_premium: [''],
      paid_premium: [''],
      policy_batch_no: [''],
      policy_number: [''],
      policy_status: [''],
      product_code: [''],
      property_description: [''],
      property_id: [''],
      quantity: [''],
      reinsurance_endorsement_number: [''],
      renewal_area: [''],
      risk_fp_override: [''],
      risk_ipu_code: [''],
      sections: this.fb.array([
        this.fb.group({
          div_factor: [0],
          free_limit: [0],
          limit_amount: [0],
          multiplier_rate: [0],
          pil_prem_rate: [0],
          premium: [0],
          rate_type: [''],
          sect_code: [0],
          sect_ipu_code: [0],
          section_code: [0],
          section_desc: [''],
          section_short_desc: ['']
        })
      ]),
      stamp_duty: [''],
      sub_class_code: [''],
      sub_class_description: [''],
      transaction_type: [''],
      underwriting_year: [''],
      value: [''],

      cover_days: [''],

    });
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
            this.passedCoverFrom = this.policyDetails.wef_dt;
            log.debug("COVER FROM", this.passedCoverFrom);
            this.passedCoverTo = this.policyDetails.wet_dt;
            log.debug("COVER TO", this.passedCoverTo);
            this.passedClientCode = this.policyDetails.client_code
            log.debug("CLIENT CODE", this.passedClientCode);


            // Calculate cover days
            const coverFromDate = new Date(this.passedCoverFrom).getTime(); // Convert to milliseconds
            const coverToDate = new Date(this.passedCoverTo).getTime(); // Convert to milliseconds
            const coverDays = Math.ceil((coverToDate - coverFromDate) / (1000 * 60 * 60 * 24));
            this.passedCoverDays = coverDays;
            this.policyRiskForm.controls['cover_days'].setValue(this.passedCoverDays);

            log.debug("Cover Days", this.passedCoverDays);

            this.onProductSelected();
            this.getProductSubclass();
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
  loadAllSubclass() {
    this.subclassService
      .getAllSubclasses()
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (data) => {

          if (data) {
            this.allSubclassList = data;
            log.debug(this.allSubclassList, "All Subclass List");
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
            log.debug("Passed CLient",selectedClient)
            this.passedClient=selectedClient
            log.debug("Passed CLient  not inusured",selectedClient)

            this.passedClientName= selectedClient.firstName + ' ' + selectedClient.lastName;

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
    this.passedClient=this.clientDetails
    log.debug("THE INSURRED FULL INFO",this.passedClient)
    this.passedClientName = this.clientDetails.firstName + ' ' + this.clientDetails.lastName;
    log.debug("another insured chosen:", this.passedClientName)
  }
  onSubclassSelected(event: any) {
    const selectedValue = event.target.value;
    this.selectedSubclassCode = parseInt(selectedValue);
    // Perform your action based on the selected value
    log.debug(this.selectedSubclassCode, 'Selected Subclass Code')
    const selectedSubclass = this.allMatchingSubclasses.find( subclass => subclass.code === this.selectedSubclassCode)
    this.selectedSubclass = selectedSubclass;
    log.debug(this.selectedSubclass, 'Selected Subclass Info')

    this.loadCovertypeBySubclassCode(this.selectedSubclassCode);
    this.loadAllBinders();
    // this.loadSubclassSectionCovertype();

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
  onCoverTypeSelected(event: any) {
    const selectedValue = event.target.value;
    this.coverTypeCode = parseInt(selectedValue);
    log.debug("Cover Type Code:", this.coverTypeCode)
    const selectedCover = this.subclassCoverType.find(cover => cover.code === this.coverTypeCode)

    this.selectedCoverType = selectedCover;
    log.debug("Cover Type selected:",selectedCover)

  }
  onProductSelected() {
    log.debug("allow moto class field",this.policyDetails.product.allowMotorClass)
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
    if(this.selectedStateId){
      this.getRiskTown();
    }
    log.debug("SELECTED State Id:", this.selectedStateId)

  }
  getRiskTown(){
    this.countryService
    .getTownsByMainCityState(this.selectedStateId)
    .pipe(untilDestroyed(this))
    .subscribe({
      next:(data:any) =>{
        if(data){
          this.townList=data;
          log.debug("Town List:",this.townList)
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
addPolicyRisk(){
  this.policyRiskForm.get('insureds.client.first_name').setValue(this.passedClient?.firstName);
  this.policyRiskForm.get('insureds.client.last_name').setValue(this.passedClient?.lastName);
  this.policyRiskForm.get('insureds.client.id').setValue(this.passedClient?.id);
  this.policyRiskForm.get('cover_type_short_description').setValue(this.selectedCoverType?.description);
  this.policyRiskForm.get('policy_batch_no').setValue(this.policyDetails.batch_no);
  this.policyRiskForm.get('policy_number').setValue(this.policyDetails.policy_no);
  this.policyRiskForm.get('product_code').setValue(this.policyDetails.product.code);
  this.policyRiskForm.get('sub_class_description').setValue(this.selectedSubclass.description);
  this.policyRiskForm.get('transaction_type').setValue(this.policyDetails.transaction_type);
  
  

  log.debug("MY RISK FORM", JSON.stringify(this.policyRiskForm.value))

}
}

