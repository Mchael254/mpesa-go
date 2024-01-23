import { ChangeDetectorRef, Component } from '@angular/core';
import stepData from '../../data/steps.json'
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ClientService } from 'src/app/features/entities/services/client/client.service';
import { ProductService } from 'src/app/features/gis/services/product/product.service';
import { AuthService } from 'src/app/shared/services/auth.service';
import { CurrencyService } from 'src/app/shared/services/setups/currency/currency.service';
import { BinderService } from '../../../setups/services/binder/binder.service';
import { ProductsService } from '../../../setups/services/products/products.service';
import { SubClassCoverTypesService } from '../../../setups/services/sub-class-cover-types/sub-class-cover-types.service';
import { SubclassesService } from '../../../setups/services/subclasses/subclasses.service';
import { QuotationsService } from '../../../../services/quotations/quotations.service';
import { SharedQuotationsService } from '../../services/shared-quotations.service';
import {Logger} from '../../../../../../shared/shared.module'
import { forkJoin } from 'rxjs';
import {PremiumComputationRequest, QuotationDetails,QuotationProduct, RiskInformation, SectionDetail, TaxInformation, subclassCovertypeSection} from '../../data/quotationsDTO'
import { subclassSection } from '../../../setups/data/gisDTO';
import { ClientDTO } from 'src/app/features/entities/data/ClientDTO';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
const log = new Logger('CoverTypesDetailsComponent');

@Component({
  selector: 'app-cover-types-details',
  templateUrl: './cover-types-details.component.html',
  styleUrls: ['./cover-types-details.component.css']
})
export class CoverTypesDetailsComponent {
  
  isCollapsibleOpen = false;
  isModalOpen = false;
  selectedOption: string = 'email';
  clientName: string = '';
  contactValue: string = '';
  steps = stepData;
  coverTypes:any[];

  quickQuotationNumbers:any;
  quotationDetails:QuotationDetails[];

  quickQuoteSectionList:any;
  selectedSections: any[] = [];
  sections: any[] = []; 
  filteredSection:any;
  sectionDetailsForm:FormGroup;
  checkedSectionCode:any;
  checkedSectionDesc:any;
  checkedSectionType:any;
  sectionArray:any;
  // checked:boolean=false;
  // limitAmount:number=0;

  taxInformation:any;
  riskInformation:any
  riskInfo:any;
  sumInsuredValue:any;

  riskCode:any;
  premium:any;
  index=1;

  coverTypeShortDescription:any;
  passedCoverTypeShortDes:any;
  passedCovertypeDescription:any;
  passedCovertypeCode:any;

  clientDetails:ClientDTO;
  selectedClientName:any;
  clientcode:any;
  selectedEmail:any;
  selectedPhoneNo:any;
  selectedQuotationData:any;
  selectedQuotationNo:any;
  SelectedQuotationCode:any;
  formData: any;


  typedWord: number | null = null; // Initialize as null or a default value
  isChecked: boolean = false;

  emailData:any={
    "address": [
      "kevine.oyanda@turnkeyafrica.com"
    ],
    "attachments": [],
    "fromName":"TQ Ticketing Service",
    "bcc": [],
    "cc": [],
    "data": {
        "html_content": "<p>Test</p>"
    },
    "subject": "Ticket Notification",
    "useLocalTemplate": true
  }

  premiumPayload:PremiumComputationRequest;
  premiumResponse:any;
  passedCovertypes:any;

  user:any;
  userDetails: any
  userBranchId: any;

  quotationCode:any;
  quotationData:any;
  quotationNo:any;
  passedQuotationSource:any;
  quotationForm:FormGroup;


  riskDetailsForm: FormGroup;
  quotationRiskData:any;


  currencyList: any;
  currencyCode: any;
  selectedCurrency: any;
  selectedCurrencyCode: any;

  passedClientDetails

  constructor(
    public fb:FormBuilder,
    public productService:ProductsService,
    public binderService:BinderService,
    public quotationService:QuotationsService,
    private subclassCoverTypesService: SubClassCoverTypesService,
    public subclassService:SubclassesService,
    public currencyService:CurrencyService,
    private gisService: ProductService,
    public authService:AuthService,
    public cdr:ChangeDetectorRef,
    private messageService:MessageService,
    private clientService:ClientService,
    public sharedService:SharedQuotationsService,
    private router: Router,
    private ngxSpinner: NgxSpinnerService,



  ) { }

  ngOnInit(): void{

   const data=this.sharedService.getPremiumPayload();
    log.debug("PREMIUM PAYLOAD",data);
    this.premiumPayload=data.data;
    this.passedCovertypes=data.covertypes
    this.premiumResponse=this.sharedService.getPremiumResponse();
    log.debug("PREMIUM RESPONSE",this.premiumResponse);
    this.sumInsuredValue=this.premiumPayload.risks[0].limits[0].limitAmount;
    log.debug("Quick Quote Quotation SI:",this.sumInsuredValue);


    this.quickQuoteSectionList=this.sharedService.getQuickSectionDetails();
    log.debug("Quick Quote Quotation Sections:",this.quickQuoteSectionList );
    this.passedClientDetails=this.sharedService.getClientDetails();
    log.debug("Client details",this.passedClientDetails);
    const passedClientCode= this.passedClientDetails.id;
    log.debug("Client code",passedClientCode);

    this.passedQuotationSource=this.sharedService.getQuotationSource();
    log.debug("Source details",this.passedQuotationSource);

    this.createQuotationForm();
    this.getuser();
    this.createRiskDetailsForm();


    this.formData = sessionStorage.getItem('quickQuoteFormDetails');
    log.debug("MY TRIAL",JSON.parse(this.formData))

    this.quickQuotationNumbers=this.sharedService.getQuickQuotationDetails();
    log.debug("Quick Quote Quotation Codes:",this.quickQuotationNumbers );
    this.loadClientQuotations(this.quickQuotationNumbers);

    // if (Array.isArray(this.quickQuotationCodes) && this.quickQuotationCodes.length > 0) {
    //   this.loadClientQuotations(this.quickQuotationCodes);
    // } else {
    //   console.error('Invalid or empty quickQuotationCodes');

    // }    
   
    this.createSectionDetailsForm();  

  }

  toggleCollapsible() {
    this.isCollapsibleOpen = !this.isCollapsibleOpen;
  }
  openModal() {
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }
 

 
  loadClientQuotations(quotationNumbers: string[]) {
    forkJoin(
      quotationNumbers.map(code =>
        this.quotationService.getClientQuotations(code)
      )
    ).subscribe(
      (data: QuotationDetails[]) => {
        this.quotationDetails = data;
        console.log('Quotation Details:', this.quotationDetails);
      },
      error => {
        console.error('Error fetching quotation details:', error);
      }
    );
  }
  passCovertypeDesc(data:any,code:any){
    log.debug("data from passcovertpes" ,data);
    log.debug("data from passcovertpes" ,code);
    this.passedCovertypeDescription=data;
    this.passedCovertypeCode=code;
    this.passedCoverTypeShortDes=data;
    this.filteredSection = this.quickQuoteSectionList.filter(section => 
      section.coverTypeShortDescription == (this.passedCoverTypeShortDes == "COMP" ? "COMPREHENSIVE" : this.passedCoverTypeShortDes));
        log.debug("Filtered Section", this.filteredSection);

  }
  
  // passedRiskcode(data:any){
  //   log.debug("Risk Code;" ,data);
  //   this.riskCode=data;
  // }
  passedClient(data:any){
    log.debug("client Code;" ,data);
    this.clientcode=data;
    this.getClient();
  }
  

  // loadClientQuotations(quotationCodes: string[]) {
  //   forkJoin(
  //     quotationCodes.map(code =>
  //       this.quotationService.getClientQuotations(code)
  //     )
  //   ).subscribe(
  //     (data: QuotationDetails[]) => {
  //       for (let i = 0; i < data.length; i++) {
  //         const quotationDetails = data[i];
  //         log.debug(`Quotation Details for Code ${quotationCodes[i]}:`, quotationDetails);
  
  //         const taxInformation = quotationDetails.taxInformation;
  //         log.debug(`Tax and Levies Details for Code ${quotationCodes[i]}:`, taxInformation);
  
  //         const premium = quotationDetails.premium;
  //         log.debug(`Premium for Code ${quotationCodes[i]}:`, premium);
  
  //         const riskInformation = quotationDetails.riskInformation;
  //         log.debug(`Risk Info for Code ${quotationCodes[i]}:`, riskInformation);
  
  //         const coverTypeShortDescription = riskInformation[0].covertypeShortDescription;
  //         log.debug(`Cover type Desc for Code ${quotationCodes[i]}:`, coverTypeShortDescription);
  
  //         // Handle other details as needed
  //       }
  //     },
  //     error => {
  //       console.error('Error fetching quotation details:', error);
  //     }
  //   );
  // }
 
  calculateTotalPayablePremium(quotationDetail: QuotationDetails): number {
    let totalPremium = quotationDetail.premium || 0;

    if (quotationDetail.taxInformation && quotationDetail.taxInformation.length > 0) {
      // Sum up the amounts of all taxes
      totalPremium += quotationDetail.taxInformation.reduce((total, tax) => total + (tax.amount || 0), 0);
    }

    return totalPremium;
  }
    /**
 * Creates and initializes a section details form.
 * Utilizes the 'FormBuilder'to create a form group ('sectionDetailsForm').
 * Defines form controls for various section-related fields, setting initial values as needed.
 */
    createSectionDetailsForm(){
      this.sectionDetailsForm=this.fb.group({
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
    // onInputChange(section: any): void {
    //   log.debug("this method has been called")
    //   this.checked = this.limitAmount >0;
    // }
    
    onKeyUp(event: KeyboardEvent, section: any): void {
      const inputElement = event.target as HTMLInputElement;
      const inputValue = inputElement.value;
    
      // Assuming each row in the p-table has a 'code' property
      section.typedWord = parseInt(inputValue, 10);
      section.isChecked = !isNaN(section.typedWord);
    
      // Check if the section is checked and add it to the selectedSections array
      if (section.isChecked && !this.selectedSections.includes(section)) {
        this.selectedSections.push(section);
        console.log('Selected Sections:', this.selectedSections);

      }
    }
    
  
    // Function to determine the checkbox state for each row
    isSectionChecked(section: any): boolean {
      return section.isChecked || false;
      
    }
    // onSelectionChange(event: any) {
    //   console.log('Selected Sections:', this.selectedSections);
    // }
   
  
  createRiskSection(payload: any) {
    // Your implementation for createRiskSection
    console.log('createRiskSection called with payload:', payload);
  }

  onCreateRiskSection() {
    console.log('Selected Sections:', this.selectedSections);

    const payload = this.selectedSections.map(section => {
      return {
        calcGroup: 1,
        code: section.code,
        compute: "Y",
        description:this.premiumPayload.risks[0].limits[0].description,
        freeLimit:0,
        multiplierDivisionFactor:this.premiumPayload.risks[0].limits[0].multiplierDivisionFactor,
        multiplierRate:this.premiumPayload.risks[0].limits[0].multiplierRate,
        premiumAmount:this.premiumPayload.risks[0].limits[0].premiumAmount,
        premiumRate:this.premiumPayload.risks[0].limits[0].premiumRate,
        rateDivisionFactor:this.premiumPayload.risks[0].limits[0].rateDivisionFactor,
        rateType:this.premiumPayload.risks[0].limits[0].rateType,
        rowNumber:this.premiumPayload.risks[0].limits[0].rowNumber,
        sumInsuredLimitType:null,
        sumInsuredRate:0,
        sectionShortDescription: section.sectionShortDescription,
        sectionCode:section.sectionCode,
        limitAmount: section.limitAmount,
      };
    });
    this.sectionArray = payload;

    // Call your createRiskSection method with the constructed payload
    this.createRiskSection(payload);
    this.quotationService.createRiskSection(this.riskCode,this.sectionArray).subscribe(data =>{
      
      try {
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Section Created' });
        this.sectionDetailsForm.reset()
      } catch (error) {
        // this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error try again later' });
        // this.sectionDetailsForm.reset()
      }
      this.computePremium();

    })
  }
   

  getClient(){
    this.clientService.getClientById(this.clientcode).subscribe(data=>{
      this.clientDetails = data;
      log.debug("Selected Client Details",this.clientDetails);
      this.selectedClientName=this.clientDetails.firstName + ' ' + this.clientDetails.lastName
      log.debug("Selected Client Name",this.selectedClientName);
      this.selectedEmail=this.clientDetails.emailAddress;
      // remember to remove phonenumber
      this.selectedPhoneNo=+254789456123;
      // this.selectedPhoneNo=this.clientDetails.phoneNumber;

    })
  }
  selectedQuotationCover(data:any){
    // this.ngxSpinner.show("coverComparisonScreen")

    this.selectedQuotationData=data;
    log.debug("Selected Quotation/cover:",this.selectedQuotationData);
    this.SelectedQuotationCode=this.selectedQuotationData.riskInformation[0].quotationCode;
    log.debug("Selected Quotation Code:",this.SelectedQuotationCode);

    this.selectedQuotationNo=this.selectedQuotationData.quotationProduct[0].quotationNo;
    log.debug("Selected Quotation/cover Number:",this.selectedQuotationNo);
    // this.sharedService.setSelectedCover(this.selectedQuotationNo);
    // this.router.navigate(['/home/gis/quotation/quote-summary']);

  }
  computePremium(){
    this.quotationService.computePremium(this.SelectedQuotationCode).subscribe(data =>{
      try {
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Premiums computed successfully' });
      } catch (error) {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error, please try again later' });
      }
    })
  }
  passSelectedCover(){
     this.sharedService.setSelectedCover(this.selectedQuotationNo);
    //  this.ngxSpinner.show("coverComparisonScreenx")

    this.router.navigate(['/home/gis/quotation/quote-summary']);
  }
//  sendEmail(){
//   this.notificationService.sendEmail(this.emailData).subscribe(data=>{
//     try {
//       log.debug("email:",data)
//       this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Email sent' });
//     } catch (error) {
//       this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error, please try again later' });
//     }
//     })
//  }


              /**NEW PREMIUM COMPUTATION ENGINE */
createQuotationForm(){
  this.quotationForm = this.fb.group({
    actionType: [''],
    addEdit: [''],
    agentCode: [''],
    agentShortDescription: [''],
    bdivCode: [''],
    bindCode: [''],
    branchCode: [''],
    clientCode: [''],
    clientType: [''],
    coinLeaderCombined: [''],
    consCode: [''],
    currencyCode: [''],
    currencySymbol: [''],
    fequencyOfPayment: [''],
    isBinderPolicy: [''],
    paymentMode: [''],
    proInterfaceType: [''],
    productCode: [''],
    source: [''],
    withEffectiveFromDate: [''],
    withEffectiveToDate: [''],
    multiUser:[''],
    comments:[''],
    internalComments:[''],
    introducerCode:[''],
    dateRange:[''],
    RFQDate:[''],
    expiryDate:['']
  })
}

 /**
   * Creates and initializes the risk details form using Angular FormBuilder.
   * - Defines form controls with validators for various risk details.
   * @method createRiskDetailsForm
   * @return {void}
   */
 createRiskDetailsForm() {
  this.riskDetailsForm = this.fb.group({
    binderCode: ['', Validators.required],
    coverTypeCode: ['', Validators.required],
    coverTypeShortDescription: [''],
    dateWithEffectFrom: [''],
    dateWithEffectTo: [''],
    dateRange: [''],
    insuredCode: [''],
    isNoClaimDiscountApplicable: [''],
    itemDescription: ['', Validators.required],
    location: [''],
    noClaimDiscountLevel: [''],
    productCode: [''],
    propertyId: [''],
    riskPremAmount: [''],
    subClassCode: ['', Validators.required],
    town: [''],
  });
}

   /**
   * Retrieves the current user and stores it in the 'user' property.
   * @method getUser
   * @return {void}
   */
   getuser() {
    this.user = this.authService.getCurrentUserName()
    this.userDetails = this.authService.getCurrentUser();
    log.info('Login UserDetails', this.userDetails);
    this.userBranchId = this.userDetails.branchId;
    log.debug("Branch Id", this.userBranchId);
  }
  loadAllCurrencies() {
    this.currencyService.getAllCurrencies().subscribe(data => {
      this.currencyList = data;
      log.info(this.currencyList, "this is a currency list");
      const curr = this.currencyList.filter(currency => currency.id == this.currencyCode);
      this.selectedCurrency = curr[0].name
      log.debug("Selected Currency:", this.selectedCurrency);
      this.selectedCurrencyCode = curr[0].id;
      log.debug("Selected Currency code:", this.selectedCurrencyCode);

      this.cdr.detectChanges()

    })
  }
  createQuotation(){
    const quoteForm = this.quotationForm.value;
    quoteForm.agentCode = 0;
    quoteForm.agentShortDescription = "DIRECT";
    quoteForm.branchCode = this.userBranchId;
    quoteForm.bindCode =this.premiumPayload.risks[0].binderDto.code;
    quoteForm.clientCode =this.passedClientDetails.id
    quoteForm.clientType="I";
    quoteForm.currencyCode=this.premiumPayload.risks[0].binderDto.currencyCode;
    quoteForm.currencySymbol=this.selectedCurrency;
    quoteForm.productCode=this.premiumPayload.product.code;
    quoteForm.source=this.passedQuotationSource[0].code;
    quoteForm.withEffectiveFromDate=this.premiumPayload.risks[0].withEffectFrom;
    quoteForm.withEffectiveToDate=this.premiumPayload.risks[0].withEffectTo;

    this.quotationService.createQuotation(quoteForm,this.user).subscribe(data=>{
      this.quotationData = data;
      this.quotationCode = this.quotationData._embedded[0].quotationCode;
      this.quotationNo = this.quotationData._embedded[0].quotationNumber;
      // this.quotationNo = data;
      console.log(this.quotationData,"Quotation results:")    
      log.debug("Quotation Number",this.quotationNo);
      log.debug("Quotation Code",this.quotationCode);
      this.createQuotationRisk()
      })
  }
  createQuotationRisk(){
    const risk = this.riskDetailsForm.value;
    risk.binderCode = this.premiumPayload.risks[0].binderDto.code;
    risk.coverTypeCode = this.passedCovertypeCode;
    risk.coverTypeShortDescription = this.passedCovertypeDescription;
    risk.insuredCode = this.passedClientDetails.id
    risk.productCode = this.premiumPayload.product.code;
    risk.dateWithEffectFrom = this.premiumPayload.risks[0].withEffectFrom;
    risk.dateWithEffectTo = this.premiumPayload.risks[0].withEffectTo;
    risk.subClassCode = this.premiumPayload.risks[0].subclassSection.code;
    risk.itemDescription = "volvo 4e";

    // FROM DYNAMIC FORM
    risk.propertyId = this.premiumPayload.risks[0].propertyId;
    console.log('Quick Form Risk', risk);
    const riskArray = [risk];

    return this.quotationService.createQuotationRisk(this.quotationCode, riskArray).subscribe(data =>{
      this.quotationRiskData = data;
      const quotationRiskCode = this.quotationRiskData._embedded[0];
      if (quotationRiskCode) {
        for (const key in quotationRiskCode) {
          if (quotationRiskCode.hasOwnProperty(key)) {
            const value = quotationRiskCode[key];
            console.log(`${value}`);
            this.riskCode = value;
          }
        }
      } else {
        console.log("The quotationRiskCode object is not defined.");
      }

      console.log(this.quotationRiskData, "Quotation Risk Code Data");
      console.log(this.riskCode, "Quotation Risk Code ");
    })

  }
  selectedQuotation(){
    log.info("Quote NO",    this.quotationNo    )
    this.selectedQuotationNo=this.quotationNo;
  }
  SelectCover(){
    this.sharedService.setSelectedCover(this.selectedQuotationNo);

    this.router.navigate(['/home/gis/quotation/quote-summary']);

  }
}
