import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { GlobalMessagingService } from './../../../../shared/services/messaging/global-messaging.service';
import { Logger } from 'src/app/shared/services';
import fmsStepsData from '../../data/fms-step.json';
import { BankingProcessService } from '../../services/banking-process.service';
import { PaymentModesDTO } from '../../data/auth-requisition-dto';
import { SessionStorageService } from 'src/app/shared/services/session-storage/session-storage.service';
import { OrganizationDTO } from 'src/app/features/crm/data/organization-dto';
import { ReceiptDTO, ReceiptsToBankRequest } from '../../data/receipting-dto';
const log = new Logger('NewBankingProcessComponent');
@Component({
  selector: 'app-new-banking-process',
  templateUrl: './new-banking-process.component.html',
  styleUrls: ['./new-banking-process.component.css'],
})
export class NewBankingProcessComponent implements OnInit {
  bankingForm!: FormGroup;
  steps = fmsStepsData.bankingSteps;
  receiptData: ReceiptDTO[];
  filteredReceipts: ReceiptDTO[] = [];
  totalRecord: number = this.filteredReceipts.length;
  visible: boolean = false;
  selectedReceipt!: receiptDto;
  columns: Column[];
  returnedCol: Column[];
  selectedColumns: any[] = [];
  paymentModes: PaymentModesDTO[] = [];
 /**
   * @description default organization
   */
  defaultOrg: OrganizationDTO;
  /**
   * @description selected organization
   */
  selectedOrg: OrganizationDTO;
  displayTable:boolean=false;
  constructor(
    public translate: TranslateService,
    private fb: FormBuilder,
    private router: Router,
    private globalMessagingService: GlobalMessagingService,
    private bankingService: BankingProcessService,
    private sessionStorage:SessionStorageService
  ) {}
  ngOnInit() {
    this.createBankingForm();
this.initiateColumns();
     this.selectedColumns = this.initiateColumns();
     this.fetchPaymentsModes();
      // Retrieve organization from localStorage or receiptDataService
    let storedSelectedOrg = this.sessionStorage.getItem('selectedOrg');
    let storedDefaultOrg = this.sessionStorage.getItem('defaultOrg');
    this.selectedOrg = storedSelectedOrg ? JSON.parse(storedSelectedOrg) : null;
    this.defaultOrg = storedDefaultOrg ? JSON.parse(storedDefaultOrg) : null;
    // Ensure only one organization is active at a time
    if (this.selectedOrg) {
      this.defaultOrg = null;
    } else if (this.defaultOrg) {
      this.selectedOrg = null;
    }
   
  }


  createBankingForm(): void {
    this.bankingForm = this.fb.group({
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      paymentMethod: ['', Validators.required],
    });
  }
  get currentReportTemplate(): string {
    return this.translate.instant('fms.receipt-management.pageReport');
  }
  initiateColumns():any{
return this.columns = [
      {
        field: 'receiptId',
        header: this.translate.instant('fms.banking.receiptId'),
      },
      {
        field: 'customer',
        header: this.translate.instant('fms.banking.customer'),
      },
      {
        field: 'amount',
        header: this.translate.instant('fms.receipting.amount'),
      },
      {
        field: 'collectionAcc',
        header: this.translate.instant('fms.banking.collectionAcc'),
      },
      {
        field: 'assignedTo',
        header: this.translate.instant('fms.banking.assignedTo'),
      },
      { field: 'date', header: this.translate.instant('fms.date') },
      {
        field: 'actions',
        header: this.translate.instant('fms.receipting.actions'),
      },
    ];
    
  }
  fetchPaymentsModes(): void {
    this.bankingService.getPaymentMethods().subscribe({
      next: (response) => {
       this.paymentModes =response.data;
       //automatically default to any available method
       if(this.paymentModes?.length > 0){
        const selectedMethod = this.paymentModes[0].code;
        this.bankingForm.patchValue({paymentMethod:selectedMethod})
       }
    
      },
      error: (err) => {
         const customMessage = this.translate.instant('fms.errorMessage');
        const backendError =
          err.error?.msg ||
          err.error?.error ||
          err.error?.status ||
          err.statusText;
        this.globalMessagingService.displayErrorMessage(
          customMessage,
          backendError
        );
       
      },
    });
  }
  onClickRetrieveRcts() {
    const formData =  this.bankingForm.value;
    this.bankingForm.markAllAsTouched();
    if (!this.bankingForm.valid) {
      this.globalMessagingService.displayErrorMessage(
        '',
        'Please fill the required fields'
      );
      return;
    }
    this.fetchReceipts();
  }
  fetchReceipts():void{
  const params:ReceiptsToBankRequest = {
     dateFrom: this.bankingForm.get('startDate')?.value,
      dateTo:this.bankingForm.get('endDate')?.value,
      orgCode: this.defaultOrg?.id || this.selectedOrg?.id,
      payMode: this.bankingForm.get('paymentMethod')?.value,
      includeBatched:'Y',
      // bctCode: 1,          
        //brhCode: 1,       
        pageable: {
        page: 0,
        size: 10,
        sort: 'receiptDate'
      }
  }
  this.bankingService.getReceipts(params).subscribe({
    next:(response)=>{
     this.receiptData=response;
     this.filteredReceipts=this.receiptData;
    this.displayTable=true;
    },
    error:(err)=>{
          const customMessage = this.translate.instant('fms.errorMessage');
        const backendError =
          err.error?.msg ||
          err.error?.error ||
          err.error?.status ||
          err.statusText;
        this.globalMessagingService.displayErrorMessage(
          customMessage,
          backendError
        );
    }
  })
}
  
  navigateToBatch(): void {
    this.router.navigate(['/home/fms/process-batch']);
  }
  showColumnsDialogs(): void {
    this.visible = true;
  }

  filter(event: any, fieldName: any): any {
    let inputValue = (event.target as HTMLInputElement).value;

    this.filteredReceipts = this.receiptData.filter((obj) => {
      //acess the object property dynamically  using variable to avoid
      //hardcoding name
      //const fieldValue = obj.amount;
      let fieldValue = obj[fieldName];
      if (fieldValue instanceof Date) {
        const formattedDateField = fieldValue.toISOString().split('T')[0];

        return formattedDateField.includes(inputValue);
      } else if (typeof fieldValue === 'number') {
        const inputNumber = String(inputValue);

        return fieldValue.toString().includes(inputNumber);
      } else if (typeof fieldValue === 'string') {
        fieldValue = fieldValue.toString();

        return fieldValue.toLowerCase().includes(inputValue.toLowerCase());
      }
      return false;
    });
  }
  onRowSelected(event: any): void {
    const s = (event.target as HTMLInputElement).value;
    //console.log('event', s);
  }

}
export interface receiptDto {
  receiptId: string;
  customer: string;
  amount: number;
  collectionAcc: string;
  assignedTo: string;
  date: Date;
}
interface Column {
  field: string;
  header: string;
}
