import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import underwritingSteps from '../../data/underwriting-steps.json';
import { PolicyService } from '../../services/policy.service';
import { GlobalMessagingService } from 'src/app/shared/services/messaging/global-messaging.service';
import { Sidebar } from 'primeng/sidebar';
import { Logger, untilDestroyed } from '../../../../../../shared/shared.module'
import { PolicyContent, PolicyResponseDTO } from '../../data/policy-dto';
import { ClientService } from 'src/app/features/entities/services/client/client.service';
import { ClientDTO } from 'src/app/features/entities/data/ClientDTO';
import { catchError, forkJoin, map, of } from 'rxjs';
import { ProductService } from 'src/app/features/gis/services/product/product.service';
import { Router } from '@angular/router';
const log = new Logger("PolicySummaryDetails");

@Component({
  selector: 'app-policy-summary-details',
  templateUrl: './policy-summary-details.component.html',
  styleUrls: ['./policy-summary-details.component.css']
})
export class PolicySummaryDetailsComponent {
  steps = underwritingSteps
  policyDetails:any
  computationDetails: Object;
  premiumResponse:any;
  premium:number = 0;
  selectedItem: number = 1; 
  show: boolean = true;
  policySectionDetails:any;
  errorMessage: string;
  errorOccurred: boolean;
  batchNo:any;
  policyResponse: PolicyResponseDTO;
  policyDetailsData: PolicyContent;
  product:any
  clientDetails:ClientDTO;
  allClients:any;
  productDescription:any;
  policyNumber:any;
  endorsementNo:any;
  policyStatus:string;
  policyType:string;
  totalSumInsured:number;
  branch:any;
  basicPremium:any;
  insureds:any;
  wet:any;
  wef:any;
  authorizedStatus:string;
  underWritingOnly:string;
  currency:string;
  policySummary:any;
  transactionType:any;
  renewalDate:any;
  convertedQuotebatchNo:number;

  constructor(
    public policyService:PolicyService,
    private globalMessagingService: GlobalMessagingService,
    public cdr: ChangeDetectorRef,
    private clientService: ClientService,
    public productService:ProductService,
    private router: Router

  ){}

  ngOnInit(): void {
    const convertedQuotationBatchNoString = sessionStorage.getItem('convertedQuoteBatchNo');
    this.convertedQuotebatchNo = JSON.parse(convertedQuotationBatchNoString);
    log.debug("Converted Quote Batch no:",this.convertedQuotebatchNo)
    this.getUtil();
    // this.getPolicyDetails();
    this.getPolicy()
   
  }
  ngOnDestroy(): void { }

  selectItem(item: number) {
    this.selectedItem = item;
  }


  getUtil(){
   this.policyDetails = JSON.parse(sessionStorage.getItem('passedPolicyDetails'))
   this.getPolicy();

   this.policyService.policyUtils(this.policyDetails?.batchNumber || this.convertedQuotebatchNo).subscribe({
    next :(res) =>{
     this.computationDetails = res
     console.log( 'computation details',this.computationDetails)
     log.debug("Policy Details", this.policyDetails);
    }
  })
}
computePremium(){
  this.policyService.computePremium(this.computationDetails).subscribe({
    next:(res)=>{
      this.premiumResponse = res
      this.premium = this.premiumResponse.premiumAmount
      this.globalMessagingService.displaySuccessMessage('Success','Premium computed successfully ')
      console.log(this.premium)
    }, error : (error) => {
     
      this.globalMessagingService.displayErrorMessage('Error', 'Error, try again later' );

      }
  })
}
getPolicy() {
  this.batchNo = this.policyDetails?.batchNumber;
  const batchNo = this.batchNo || this.convertedQuotebatchNo
  log.debug("Batch No:", batchNo)
  this.policyService
    .getPolicy(batchNo)
    .pipe(untilDestroyed(this))
    .subscribe({
      next: (data: any) => {

        if (data && data.content && data.content.length > 0) {
          this.policyResponse = data;
          log.debug("Get Policy Endpoint Response", this.policyResponse)
          this.policyDetailsData = this.policyResponse.content[0]
          log.debug("Policy Details data get policy", this.policyDetailsData)
          this.policyNumber = this.policyDetailsData.policyNo
          this.endorsementNo = this.policyDetailsData.endorsementNo
          this.policyType = this.policyDetailsData.policyType
          this.totalSumInsured = this.policyDetailsData.totalSumInsured
          this.basicPremium = this.policyDetailsData.basicPremium
          this.policyStatus = this.policyDetailsData.policyStatus
          this.productDescription = this.policyDetailsData.product.description
          this.insureds = this.policyDetailsData.insureds[0]

          log.debug("Insureds", this.insureds)
          this.insureds = this.insureds.client.firstName + " " + this.insureds.client.lastName
          log.debug("Insureds", this.insureds)
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



getPolicyDetails(){
  this.policyService.getbypolicyNo(this.policyDetails.policyNumber).subscribe({
    next:(res)=>{
      this.policySummary = res
      const productCode = this.policySummary.proCode
      this.productService.getProductByCode(productCode).subscribe({
        next:(res)=>{
          this.product = res
          this.productDescription = this.product.description
        }
      })
     
      console.log(res)
    }
  })
}
editPolicyDetails(){
  this.router.navigate([`/home/gis/policy/policy-product/edit/${this.policyDetails.batchNumber}`]);

}
generateCoverNote(){
  const payload ={
    "encode_format": "BASE64",
    "params": [
      {
        "name": "V_BATCHNO",
        "value": this.policyDetails.batchNumber
      }
    ],
    "report_format": "PDF",
    "rpt_code": 25439,
    "system": "GIS"
  }
  this.policyService.generateCoverNote(payload).subscribe({
    next:(res)=>{
      console.log(res)
      this.downloadBase64FileUpdate(res, 'cover_note.pdf');
      this.globalMessagingService.displaySuccessMessage('Success','Cover note generated successfully ')
    },
    error: (err) => {

      this.globalMessagingService.displayErrorMessage(
        'Error', 'Something went wrong, try again later'
      );
      log.info(`error >>>`, err);
    },

  })
}

// Method to decode and trigger file download 
downloadBase64File(base64, filename: string): void {
  // Decode the base64 string
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  const blob = new Blob([bytes], { type: 'application/pdf' }); // Adjust the MIME type as needed

  // Create a URL for the blob and trigger the download
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(url);
  a.remove();
}
downloadBase64FileUpdate(base64, filename: string): void {
  // Fix URL-safe Base64 encoding and ensure padding
  const paddedBase64 = base64.replace(/-/g, '+').replace(/_/g, '/').padEnd(base64.length + (base64.length % 4), '=');

  try {
    // Decode the base64 string
    const binaryString = atob(paddedBase64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    const blob = new Blob([bytes], { type: 'application/pdf' }); // Adjust the MIME type as needed

    // Create a URL for the blob and trigger the download
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    a.remove();
  } catch (error) {
    console.error('Failed to decode Base64 string:', error);
  }
}

}
