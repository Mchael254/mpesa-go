import { Component } from '@angular/core';
import { Logger, untilDestroyed } from '../../../../../../shared/shared.module'
import * as Papa from 'papaparse';
import { GlobalMessagingService } from '../../../../../../shared/services/messaging/global-messaging.service';
import { ClientService } from 'src/app/features/entities/services/client/client.service';
import { ProductsService } from '../../../setups/services/products/products.service';
import { Subclasses } from '../../../setups/data/gisDTO';
import { SubclassesService } from '../../../setups/services/subclasses/subclasses.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { PolicyService } from '../../services/policy.service';
import { AuthService } from 'src/app/shared/services/auth.service';
import { Router } from '@angular/router';
const log = new Logger("ImportRiskDetailsComponent");
@Component({
  selector: 'app-import-risks',
  templateUrl: './import-risks.component.html',
  styleUrls: ['./import-risks.component.css']
})
export class ImportRisksComponent {

  fileSelected: boolean = false;
  uploadedFileName: string = '';
  uploading: string = '';
  importedRisk:any;
  policyDetails:any;
  policyNumber:any;
  client:any
  clientDetails:any;
  coverFrom:any;
  coverTo:any;
  productCode:any;
  subClassList:any;
  allSubclassList: Subclasses[]
  allMatchingSubclasses = [];
  selectedSubclassCode: any;
  selectedSubclass: any;
  errorMessage: string;
  errorOccurred: boolean;

  policyRiskForm: FormGroup;
  selectedTransactionType:any;
  currentYear:any;
  passedUserDetails: any;
  user: any;
  userId: any;
  riskForm: any;
  riskCode: any;
  batchNo:any;

  constructor(
    public globalMessagingService: GlobalMessagingService,
    public clientService:ClientService,
    public productService:ProductsService,
    public subclassService: SubclassesService,
    public fb: FormBuilder,
    private policyService: PolicyService,
    public authService: AuthService,
    private router: Router,

  ){

  }

  ngOnInit(): void {

    this.getPolicyDetails();
    this.selectedTransactionType = sessionStorage.getItem('selectedTransactionType');
    this.currentYear = new Date().getFullYear();

    this.getClientDetails();
    this.loadAllSubclass();
    this.createPolicyRiskForm();
    const passedUserDetailsString = sessionStorage.getItem('passedUserDetails');
    this.passedUserDetails = JSON.parse(passedUserDetailsString);
    log.debug("Passed User Details:", this.passedUserDetails);
    this.user = this.authService.getCurrentUserName()
    log.debug("logged in user :", this.user);

    this.userId = this.passedUserDetails?.code
    log.debug("Passed User Id:", this.userId);
    
    
  }
  ngOnDestroy(): void { }

  getPolicyDetails(){
    this.policyDetails = JSON.parse(sessionStorage.getItem('passedPolicyDetails'))
    log.debug("POLICY DETAILS:",this.policyDetails)
    this.batchNo= parseInt(this.policyDetails.batchNumber);
    log.debug("Batch number:",this.batchNo)
    this.policyNumber = this.policyDetails.policyNumber
    this.coverFrom = sessionStorage.getItem('coverFrom');
    this.coverTo = sessionStorage.getItem('coverTo');
    this.productCode = sessionStorage.getItem('productCode');

  }
  getClientDetails(){
    const clientCode = sessionStorage.getItem('clientCode')

    this.clientService.getClientById(Number(clientCode)).subscribe({
      next:(res)=>{
        this.clientDetails = res
        this.client = this.clientDetails.firstName + " " + this.clientDetails.lastName
        console.log(res)
      }
    })
  }

  downloadCSVTemplate(): void {
    console.log("TEST")
    const templateFilePath = '/assets/data/import-risks-template_2.csv';
    // const templateFilePath = '/assets/data/import-risks-template.csv';
    const link = document.createElement('a');
    link.setAttribute('target', '_blank');
    link.setAttribute('href', templateFilePath);
    link.setAttribute('download', 'template.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  // onFileSelected(event: any): void {
  //   const file: File = event.target.files[0];
  //   if (file) {

  //     this.uploading = 'progress';

  //     Papa.parse(file, {
  //       complete: (result: any) => {
         
  //         // const expectedHeaders = ['clientId', 'clientName', 'WEF','WET', 'riskDuplicated', 'class','coverType', 'premium', 'taxes'];
  //         const expectedHeaders = [
  //           'RISK_TYPE',
  //           'INSURED_ID',
  //           'INSURED_NAME',
  //           'NATIONAL_ID',
  //           'PIN',
  //           'POSTAL_ADDRS',
  //           'POSTAL_TOWN',
  //           'POSTAL_CODE',
  //           'TELEPHONE_NO',
  //           'MOBILE_NUMBER',
  //           'COUNTRY',
  //           'EFF_DATE',
  //           'EXP_DATE',
  //           'POL_NO',
  //           'RISK_DESCRIPTION',
  //           'INV_DATE',
  //           'INV_NO',
  //           'BUT_CHARGE_PREMIUM',
  //           'LEVIES',
  //           'REG_NO',
  //           'MODEL_TYPE',
  //           'MAKE_MODEL',
  //           'ENGINE_NO',
  //           'COLOR',
  //           'YOM',
  //           'CC_RATE',
  //           'CHASIS_NO',
  //           'SUM_INSURED',
  //           'STRIKE_RIOT',
  //           'COVER_TYPE',
  //           'EXCESS_BUY_BACK',
  //           'FLEET_DISCOUNT',
  //           'NCD_DISCOUNT',
  //           'FLOOD',
  //           'SUM_INSURED_EXCESS_BUY_BACK',
  //           'MOTOR_THIRD_PARTY_LIABILITY',
  //           'THIRD_PARTY_PROPERTY_DAMAGE',
  //           'FIRST_LOSS_VALUE_DISCOUNT',
  //           'FLAT_DISCOUNTS',
  //           'STRIKE_RIOT_AND_CIVIL_COMMOTION_LOAD',
  //           'EXCESS_BUY_BACK_EXT_SI',
  //           'SECTION_15',
  //           'SECTION_16',
  //           'SECTION_17',
  //           'SECTION_18',
  //           'SECTION_19',
  //           'SECTION_20',
  //           'SECTION_21',
  //           'NEW_CLIENT',
  //           'SECT1RATE',
  //           'SECT2RATE',
  //           'SECT3RATE',
  //           'SECT4RATE',
  //           'SECT5RATE',
  //           'SECT6RATE',
  //           'SECT7RATE',
  //           'SECT8RATE',
  //           'SECT9RATE',
  //           'SECT10RATE',
  //           'SECT11RATE',
  //           'SECT12RATE',
  //           'SECT13RATE',
  //           'SECT14RATE',
  //           'SECT15RATE',
  //           'SECT16RATE',
  //           'SECT17RATE',
  //           'SECT18RATE',
  //           'SECT19RATE',
  //           'SECT20RATE',
  //           'RATES_F_OR_P',
  //           'CARRY_CAPACITY',
  //           'RISK_NOTE_NO',
  //           'DRIVER_NAME',
  //           'DRIVER_TEL_NO',
  //           'DRIVER_EMAIL',
  //           'REGULAR_DRIVER',
  //           'YEAR_OF_BUILT',
  //           'VESSEL_TYPE',
  //           'CLAUSE',
  //           'CATEGORY',
  //           'SUB_CATEGORY',
  //           'CONVEYANCE',
  //           'PROFORMA_INVOICE_VALUE',
  //           'PROFORMA_INVOICE_NUMBER',
  //           'PROFORMA_INVOICE_DATE',
  //           'PORT_DESTINATION',
  //           'PAYMENT_DATE',
  //           'CERTIFICATE_NO',
  //           'TIN',
  //           'EXCESS',
  //           'RISK_LOCATION',
  //           'RISK_TOWN',
  //           'TERRITORY',
  //           'IS_NEW_RISK',
  //           'PARTSHIPMENT',
  //           'PED_RISK_ADDRESS',
  //           'COMPUTE_MAX_EXPOSURE(Y/N)',
  //           'MAX_EXPOSURE_AMOUNT',
  //           'SURVEY_RISK(Y/N)',
  //           'CURRENCY',
  //           'CERT_DATE',
  //           'PORT_OF_DISCHARGE',
  //           'SHIPMENT_PERCENT',
  //           'LANDING_STATUS'
  //         ];
          
  //         const actualHeaders = result.meta.fields;
  //         console.log(actualHeaders)
  //         // Assuming CSV has header row, you can access data with result.data
  //         if (this.validateHeaders(expectedHeaders, actualHeaders)) {
  //           this.importedRisk = result.data[0];
  //           console.log(result.data);
  //           console.log("Results after upload:",this.importedRisk)
  //           this.globalMessagingService.displaySuccessMessage('Success','Risks successfully added')
  
  //           try {
  //             this.uploadedFileName = file.name;
  //             sessionStorage.setItem('uploadedFileName', this.uploadedFileName);
  //             this.uploading = 'success';
  //           } catch (e) {
  //             console.log(`file upload failed >>> `, e);
  //             this.uploading = 'error';
  //           }
  //         }else {
  //           this.globalMessagingService.displayErrorMessage(
  //             'Error',
  //             'CSV headers do not match the required format.'
  //           );
          
  //           this.uploading = 'error';
  //         }
         
  //       },
  //       header: true // Set to true if CSV file has a header row
  //     });
  //   }else{
  //     this.fileSelected = false;
  //     this.uploadedFileName = '';
  //     this.uploading = '';
  //   }
  // }
  
  // validateHeaders(expectedHeaders: string[], actualHeaders: string[]): boolean {
  //   if (expectedHeaders.length !== actualHeaders.length) {
  //     return false;
  //   }
  
  //   for (let i = 0; i < expectedHeaders.length; i++) {
  //     if (expectedHeaders[i] !== actualHeaders[i]) {
  //       return false;
  //     }
  //   }
  
  //   return true;
  // }
  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      this.uploading = 'progress';
  
      Papa.parse(file, {
        complete: (result: any) => {
          const expectedHeaders = [
            'RISK_TYPE', 'INSURED_ID', 'INSURED_NAME', 'NATIONAL_ID', 'PIN', 'POSTAL_ADDRS', 'POSTAL_TOWN', 'POSTAL_CODE',
            'TELEPHONE_NO', 'MOBILE_NUMBER', 'COUNTRY', 'EFF_DATE', 'EXP_DATE', 'POL_NO', 'RISK_DESCRIPTION', 'INV_DATE',
            'INV_NO', 'BUT_CHARGE_PREMIUM', 'LEVIES', 'REG_NO', 'MODEL_TYPE', 'MAKE_MODEL', 'ENGINE_NO', 'COLOR', 'YOM',
            'CC_RATE', 'CHASIS_NO', 'SUM_INSURED', 'STRIKE_RIOT', 'COVER_TYPE', 'EXCESS_BUY_BACK', 'FLEET_DISCOUNT',
            'NCD_DISCOUNT', 'FLOOD', 'SUM_INSURED_EXCESS_BUY_BACK', 'MOTOR_THIRD_PARTY_LIABILITY', 'THIRD_PARTY_PROPERTY_DAMAGE',
            'FIRST_LOSS_VALUE_DISCOUNT', 'FLAT_DISCOUNTS', 'STRIKE_RIOT_AND_CIVIL_COMMOTION_LOAD', 'EXCESS_BUY_BACK_EXT_SI',
            'SECTION_15', 'SECTION_16', 'SECTION_17', 'SECTION_18', 'SECTION_19', 'SECTION_20', 'SECTION_21', 'NEW_CLIENT',
            'SECT1RATE', 'SECT2RATE', 'SECT3RATE', 'SECT4RATE', 'SECT5RATE', 'SECT6RATE', 'SECT7RATE', 'SECT8RATE', 'SECT9RATE',
            'SECT10RATE', 'SECT11RATE', 'SECT12RATE', 'SECT13RATE', 'SECT14RATE', 'SECT15RATE', 'SECT16RATE', 'SECT17RATE',
            'SECT18RATE', 'SECT19RATE', 'SECT20RATE', 'RATES_F_OR_P', 'CARRY_CAPACITY', 'RISK_NOTE_NO', 'DRIVER_NAME',
            'DRIVER_TEL_NO', 'DRIVER_EMAIL', 'REGULAR_DRIVER', 'YEAR_OF_BUILT', 'VESSEL_TYPE', 'CLAUSE', 'CATEGORY', 'SUB_CATEGORY',
            'CONVEYANCE', 'PROFORMA_INVOICE_VALUE', 'PROFORMA_INVOICE_NUMBER', 'PROFORMA_INVOICE_DATE', 'PORT_DESTINATION',
            'PAYMENT_DATE', 'CERTIFICATE_NO', 'TIN', 'EXCESS', 'RISK_LOCATION', 'RISK_TOWN', 'TERRITORY', 'IS_NEW_RISK',
            'PARTSHIPMENT', 'PED_RISK_ADDRESS', 'COMPUTE_MAX_EXPOSURE(Y/N)', 'MAX_EXPOSURE_AMOUNT', 'SURVEY_RISK(Y/N)',
            'CURRENCY', 'CERT_DATE', 'PORT_OF_DISCHARGE', 'SHIPMENT_PERCENT', 'LANDING_STATUS'
          ];
  
          const actualHeaders = result.meta.fields;
          console.log("Expected Headers:", expectedHeaders);
          console.log("Actual Headers:", actualHeaders);
  
          if (this.validateHeaders(expectedHeaders, actualHeaders)) {
            this.importedRisk = result.data;
            console.log("Data:", result.data);
            console.log("Results after upload:", this.importedRisk);
            this.globalMessagingService.displaySuccessMessage('Success', 'Risks successfully added');
            if(this.importedRisk){
              this.addPolicyRisk();
            }
            try {
              this.uploadedFileName = file.name;
              sessionStorage.setItem('uploadedFileName', this.uploadedFileName);
              this.uploading = 'success';
            } catch (e) {
              console.log(`File upload failed: `, e);
              this.uploading = 'error';
            }
          } else {
            this.globalMessagingService.displayErrorMessage('Error', 'CSV headers do not match the required format.');
            this.uploading = 'error';
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
  validateHeaders(expectedHeaders: string[], actualHeaders: string[]): boolean {
    if (expectedHeaders.length !== actualHeaders.length) {
      return false;
    }
  
    for (let i = 0; i < expectedHeaders.length; i++) {
      if (expectedHeaders[i].trim().toLowerCase() !== actualHeaders[i].trim().toLowerCase()) {
        return false;
      }
    }
  
    return true;
  }
    
  getProductSubclass() {
    this.productService
      .getProductSubclasses(this.productCode)
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
      .subscribe({
        next: (data) => {
          console.log(data)
          if (data) {
            this.allSubclassList = data;
            console.log(this.allSubclassList, "All Subclass List");
            this.getProductSubclass();

         


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
  createPolicyRiskForm() {
    this.policyRiskForm = this.fb.group({
      addOrEdit: [''],
      allowedCommissionRate: [''],
      // autogenerateCert: [''],
      basicPremium: [''],
      binderCode: [''],
      // cashApplicable: [''],
      cashLevel: [''],
      commissionAmount: [''],
      commissionRate: [''],
      computeMaxExposure: [''],
      conveyanceType: [''],
      coverDays: [''],
      coverTypeCode: [''],
      coverTypeShortDescription: [''],
      currencyCode: [''],
      dateCoverFrom: [''],
      dateCoverTo: [''],
      delSect: [''],
      grossPremium: [''],
      installmentPaymentPercentage: [''],

      insureds: this.fb.group({
        client: this.fb.group({
          firstName: [''],
          id: [''],
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
      modelYear: [''],
      ncdApplicable: [''],
      ncdLevel: [''],
      netPremium: [''],
      newRisk: [''],
      // netPremium: [''],
      paidPremium: [''],
      policyBatchNo: [''],
      policyNumber: [''],
      policyStatus: [''],
      periodRate: [''],
      productCode: [''],
      propertyDescription: [''],
      propertyId: [''],
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
      subClassCode: [''],
      subClassDescription: [''],
      transactionType: [''],
      underwritingYear: [''],
      value: [''],
      vehicleMake: [''],
      vehicleModel: [''],
      surveyDate: [''],
      territory: [''],
      topLocationLevel: [''],
      // town: [''],
     
    });
  }
  onSubclassSelected(selectedValue: any) {

    this.selectedSubclassCode = parseInt(selectedValue);
    log.debug("SELECTEDSubclass", this.selectedSubclassCode)

    // const selectedValue = event.target.value;
    this.selectedSubclassCode = parseInt(selectedValue);
    // Perform your action based on the selected value
    const selectedSubclass = this.allMatchingSubclasses.find(subclass => subclass.code === this.selectedSubclassCode)
    this.selectedSubclass = selectedSubclass;
    log.debug(this.selectedSubclass, 'Selected Subclass Info')

  

  }
  addPolicyRisk() {
   
    this.policyRiskForm.get('insureds.client.firstName').setValue(this.importedRisk[0]?.INSURED_NAME);
    this.policyRiskForm.get('insureds.client.lastName').setValue(this.importedRisk[0]?.INSURED_NAME);
    this.policyRiskForm.get('insureds.client.id').setValue(this.importedRisk[0]?.INSURED_ID);
    this.policyRiskForm.get('insureds.prpCode').setValue(this.importedRisk[0]?.INSURED_ID);
    this.policyRiskForm.get('allowedCommissionRate').setValue(890);
    this.policyRiskForm.get('basicPremium').setValue(890);
    this.policyRiskForm.get('binderCode').setValue(202420207353);
    this.policyRiskForm.get('commissionAmount').setValue(890);
    this.policyRiskForm.get('commissionRate').setValue(2);
    this.policyRiskForm.get('coverTypeCode').setValue(302);
    this.policyRiskForm.get('coverTypeShortDescription').setValue(this.importedRisk[0]?.COVER_TYPE);
    this.policyRiskForm.get('currencyCode').setValue(268);
    this.policyRiskForm.get('dateCoverFrom').setValue(this.importedRisk[0]?.EFF_DATE);
    this.policyRiskForm.get('dateCoverTo').setValue(this.importedRisk[0]?.EXP_DATE);
    this.policyRiskForm.get('delSect').setValue(null);
    this.policyRiskForm.get('grossPremium').setValue(890);
    this.policyRiskForm.get('ipuNcdCertNo').setValue(null);
    this.policyRiskForm.get('loaded').setValue("N");
    this.policyRiskForm.get('ltaCommission').setValue(890);
    this.policyRiskForm.get('netPremium').setValue(0);
    this.policyRiskForm.get('paidPremium').setValue(890);
    this.policyRiskForm.get('policyBatchNo').setValue(this.batchNo);
    this.policyRiskForm.get('policyNumber').setValue(this.policyDetails.policyNumber);
    this.policyRiskForm.get('policyStatus').setValue("NB");
    this.policyRiskForm.get('productCode').setValue(this.productCode);
    this.policyRiskForm.get('propertyDescription').setValue(this.importedRisk[0].RISK_DESCRIPTION);
    this.policyRiskForm.get('propertyId').setValue(this.importedRisk[0].REG_NO);
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
    this.policyRiskForm.get('coverDays').setValue(365);
    this.policyRiskForm.get('installmentPaymentPercentage');
    this.policyRiskForm.get('installmentPeriod');
    this.policyRiskForm.get('ipu_ncd_cert_no');
    this.policyRiskForm.get('logbookAvailable');
    this.policyRiskForm.get('logbookUnderInsuredName');
    this.policyRiskForm.get('maintenanceCover');
    this.policyRiskForm.get('maxExposureAmount');
    this.policyRiskForm.get('modelYear').setValue(2015);
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
      .addPolicyRisk(this.batchNo, this.riskForm, this.user)
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
  createRiskSection() {
    throw new Error('Method not implemented.');
  }
  createSchedule() {
    throw new Error('Method not implemented.');
  }
  next(){
    this.router.navigate(['/home/gis/policy/risk-details']);
  }
  previous(){
    this.router.navigate(['/home/gis/policy/policy-product']);
  }
}
