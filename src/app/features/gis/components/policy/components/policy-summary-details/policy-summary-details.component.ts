import {ChangeDetectorRef, Component, Input, OnDestroy, OnInit} from '@angular/core';
import underwritingSteps from '../../data/underwriting-steps.json';
import {PolicyService} from '../../services/policy.service';
import {GlobalMessagingService} from 'src/app/shared/services/messaging/global-messaging.service';
import {Logger} from '../../../../../../shared/services'
import {PolicyContent} from '../../data/policy-dto';
import {ClientDTO} from 'src/app/features/entities/data/ClientDTO';
import {ProductService} from 'src/app/features/gis/services/product/product.service';
import {Router} from '@angular/router';
import {mergeMap} from "rxjs";

const log = new Logger("PolicySummaryDetails");

@Component({
  selector: 'app-policy-summary-details',
  templateUrl: './policy-summary-details.component.html',
  styleUrls: ['./policy-summary-details.component.css']
})
export class PolicySummaryDetailsComponent implements OnInit, OnDestroy {
  steps = underwritingSteps
  policyDetails: any
  computationDetails: Object;
  premiumResponse: any;
  selectedItem: number = 1;
  show: boolean = true;
  errorMessage: string;
  errorOccurred: boolean;
  batchNo: any;
  @Input() policyDetailsData: PolicyContent;
  @Input() batchNumber: number
  product: any
  clientDetails: ClientDTO;
  productDescription: any;
  policyNumber: any;
  endorsementNo: any;
  policyStatus: string;
  totalSumInsured: number;
  branch: any;
  insureds: any;
  wet: any;
  wef: any;
  authorizedStatus: string;
  currency: string;
  policySummary: any;
  transactionType: any;
  convertedQuotebatchNo: number;

  constructor(
    public policyService: PolicyService,
    private globalMessagingService: GlobalMessagingService,
    public cdr: ChangeDetectorRef,
    public productService: ProductService,
    private router: Router
  ) {
  }

  ngOnInit(): void {
    log.debug("Converted Quote Batch no:", this.convertedQuotebatchNo)
  }

  ngOnDestroy(): void {
  }

  selectItem(item: number) {
    this.selectedItem = item;
  }


  computePremium() {
    this.policyService.policyUtils(this.batchNumber).pipe(
      mergeMap((payload) => {
        return this.policyService.computePremium(payload)
      })
    ).subscribe({
      next: (response) => {
        this.premiumResponse = response
        this.policyDetailsData.totalPremium = response.premiumAmount
        log.debug("Computation result >>>", response)
        this.globalMessagingService.displaySuccessMessage('Success', 'Premium computed successfully ')
      },
      error: (response) => {
        this.globalMessagingService.displayErrorMessage('Error', 'Error, try again later');
      }
    })
  }

  getPolicyDetails() {
    this.policyService.getbypolicyNo(this.policyDetails?.policyNumber).subscribe({
      next: (res) => {
        this.policySummary = res
        const productCode = this.policySummary.proCode
        this.productService.getProductByCode(productCode).subscribe({
          next: (res) => {
            this.product = res
            this.productDescription = this.product.description
          }
        })

        console.log(res)
      }
    })
  }

  editPolicyDetails() {
    this.router.navigate([`/home/gis/policy/policy-product/edit/${this.policyDetails.batchNumber}`]);

  }

  generateCoverNote() {
    const payload = {
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
      next: (res) => {
        console.log(res)
        this.downloadBase64FileUpdate(res, 'cover_note.pdf');
        this.globalMessagingService.displaySuccessMessage('Success', 'Cover note generated successfully ')
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
    const blob = new Blob([bytes], {type: 'application/pdf'}); // Adjust the MIME type as needed

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
      const blob = new Blob([bytes], {type: 'application/pdf'}); // Adjust the MIME type as needed

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
