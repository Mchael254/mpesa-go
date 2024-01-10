import { ChangeDetectorRef, Component } from '@angular/core';
import stepData from '../../data/steps.json'
import { FormBuilder, FormGroup } from '@angular/forms';
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
import {QuotationDetails,QuotationProduct, RiskInformation, SectionDetail, TaxInformation, subclassCovertypeSection} from '../../data/quotationsDTO'
import { subclassSection } from '../../../setups/data/gisDTO';
import { ClientDTO } from 'src/app/features/entities/data/ClientDTO';
import { Router } from '@angular/router';
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


  ) { }

  ngOnInit(): void{
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
    this.quickQuoteSectionList=this.sharedService.getQuickSectionDetails();
    log.debug("Quick Quote Quotation Sections:",this.quickQuoteSectionList );
    this.sumInsuredValue=this.sharedService.getSumInsured();
    log.debug("Quick Quote Quotation SI:",this.sumInsuredValue);
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
  passCovertypeDesc(data:any){
    log.debug("data from passcovertpes;" ,data);
    this.passedCoverTypeShortDes=data;
    this.filteredSection = this.quickQuoteSectionList.filter(section => 
      section.coverTypeShortDescription == (this.passedCoverTypeShortDes == "COMP" ? "COMPREHENSIVE" : this.passedCoverTypeShortDes));
        log.debug("Filtered Section", this.filteredSection);

  }
  
  passedRiskcode(data:any){
    log.debug("Risk Code;" ,data);
    this.riskCode=data;
  }
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
        calcGroup: 0,
        code: section.code,
        compute: null,
        description:null,
        freeLimit:0,
        multiplierDivisionFactor:0,
        multiplierRate:0,
        premiumAmount:0,
        premiumRate:0,
        rateDivisionFactor:0,
        rateType:null,
        rowNumber:0,
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
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error try again later' });
        this.sectionDetailsForm.reset()
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
}
