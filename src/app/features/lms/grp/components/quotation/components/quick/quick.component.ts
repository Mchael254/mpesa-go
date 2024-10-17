import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { debounceTime } from 'rxjs/internal/operators/debounceTime';
import { distinctUntilChanged } from 'rxjs/internal/operators/distinctUntilChanged';
import { formatDate } from '@angular/common';
import { NgxSpinnerService } from 'ngx-spinner';
import { MessageService } from "primeng/api";
import { Currency } from '../../models/currency';
import { PayFrequency } from '../../models/payFrequency';
import { QuotationCovers, DurationTypes, UnitRate, FacultativeType } from '../../models/quotationCovers';
import { GrpQuoteDetails } from '../../models/quoteDetails';
import { PayFrequencyService } from '../../service/pay-frequency/pay-frequency.service';
import { QuickService } from '../../service/quick/quick.service';
import stepData from '../../data/steps.json';

import {AutoUnsubscribe} from "../../../../../../../shared/services/AutoUnsubscribe";
import {AgentDTO} from "../../../../../../entities/data/AgentDTO";
import {OrganizationBranchDto} from "../../../../../../../shared/data/common/organization-branch-dto";
import {ClientService} from "../../../../../../entities/services/client/client.service";
import {ProductService} from "../../../../../service/product/product.service";
import {IntermediaryService} from "../../../../../../entities/services/intermediary/intermediary.service";
import {BranchService} from "../../../../../../../shared/services/setups/branch/branch.service";
import {CurrencyService} from "../../../../../../../shared/services/setups/currency/currency.service";
import {SessionStorageService} from "../../../../../../../shared/services/session-storage/session-storage.service";


@AutoUnsubscribe
@Component({
  selector: 'app-quick',
  templateUrl: './quick.component.html',
  styleUrls: ['./quick.component.css']
})
export class QuickComponent implements OnInit, OnDestroy {
  quickForm: FormGroup;
  clientList: { label: string, value: number }[] = [];
  productList: any[] = [
    { code: 0, description: 'SELECT PRODUCT' },
  ];
  currencyList: Currency[] = [];
  quotationCovers: QuotationCovers [] = [];
  durationType: DurationTypes [] = []
  frequencyOfPayment: { label: string, value: string }[] = [];
  unitRateOption: UnitRate [] =  [];
  facultativeType: FacultativeType [] = [];
  intermediaries: AgentDTO[] = [];
  branch: OrganizationBranchDto[];
  quoteDetails: GrpQuoteDetails;
  maxDate: Date;
  showStateSpinner: boolean;
  showTownSpinner: boolean;
  quotationCode: number;
  steps = stepData;
  clientCode: number;


  constructor (
    private fb: FormBuilder,
    private router: Router,
    private quickService: QuickService,
    private payFrequenciesService: PayFrequencyService,
    private client_service: ClientService,
    private product_service: ProductService,
    private intermediaryService: IntermediaryService,
    private branchService: BranchService,
    private currencyService: CurrencyService,
    private session_storage: SessionStorageService,
    private spinner_Service: NgxSpinnerService,
    private messageService: MessageService,
    private activatedRoute: ActivatedRoute
    ) {
      this.maxDate = new Date();
    }

  ngOnInit(): void {
    this.quickQuoteForm();
    this.getPayFrequencies();
    // this.getClientList();
    this.getProducts();
    this.getAllCurrencies();
    this.getDurationTypes();
    this.getQuotationCovers();
    this.getUnitRate();
    this.getFacultativeTypes();
    this.getIntermediaries();
    // this.searchClient();
    this.searchAgent();
    this.getBranch();
    this.retrievQuoteDets();
    // this.getParams();
  }

  ngOnDestroy(): void {

  }

  quickQuoteForm() {
    this.quickForm = this.fb.group({
      communicationType: [""],
      // clients: ["", [Validators.required] ],
      branch: [""],
      products: ["", [Validators.required] ],
      durationType: ["", [Validators.required] ],
      facultativeType: ["", [Validators.required] ],
      quotationCovers: ["", [Validators.required] ],
      frequencyOfPayment: ["", [Validators.required] ],
      unitRateOption: ["", [Validators.required] ],
      currency: ["", [Validators.required] ],
      effectiveDate: ["", [Validators.required] ],
      quotationCalcType: ["", [Validators.required] ],
      intermediary: ["", [Validators.required] ],
      commissionRate: ["", [Validators.max(100)] ], //not required but if value above 100 is entered it sets form as has errors

    });
  }

  shareSummaryForm = this.fb.group({
    communicationType: ['', Validators.required],
  });

  // highlights a touched/clicked/dirtified field that is not filled or option not selected
highlightInvalid(field: string): boolean {
  const control = this.quickForm.get(field);
  return control.invalid && (control.dirty || control.touched);
}

//   getParams() {
//   this.activatedRoute.queryParams.subscribe((queryParams) => {
//     this.clientCode = queryParams['clientCode'];
//     console.log("clientCodeFromClientCreation", this.clientCode)
//   });
// }


  capitalizeFirstLetterOfEachWord(str) {
    return str.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');
  }

 getPayFrequencies() {
    this.payFrequenciesService.getPayFrequencies().subscribe((freqs: PayFrequency[]) => {
      this.frequencyOfPayment = freqs.map(frequency => ({
        label: this.capitalizeFirstLetterOfEachWord(frequency.desc),
        value: frequency.sht_desc
      })
      );
    });
  }

  // searchClient() {
  //   this.quickForm.get('clients').valueChanges.pipe(debounceTime(900), distinctUntilChanged())
  //   .subscribe((clientTyped) => {
  //     if(clientTyped.length > 0) {
  //       this.client_service.searchClients(0, 5, clientTyped).subscribe((data: Pagination<ClientDTO>) => {
  //         this.clientList = data.content.map(client =>({
  //           // label: this.capitalizeFirstLetterOfEachWord(`${client.firstName} ${client.lastName}-${client.id}`),
  //           label: this.capitalizeFirstLetterOfEachWord(
  //             `${client.firstName} ${client.lastName ? client.lastName : ''}-${client.id}`),
  //           value: client.id
  //         }));
  //       })
  //     }
  //     else {
  //       this.getClientList();
  //     }
  //   });
  // }

  // getClientList() {
  //   this.client_service.getClients().subscribe((data: Pagination<ClientDTO>) => {
  //     console.log("clients", data)
  //     this.clientList = data.content.map(client => ({
  //       label: this.capitalizeFirstLetterOfEachWord(`${client.firstName} ${client.lastName}`),
  //       value: client.id
  //     }));
  //   });
  // }

  searchAgent() {
    this.quickForm.get('intermediary').valueChanges.pipe(debounceTime(900), distinctUntilChanged())
    .subscribe((agentTyped) => {
        const agentBranchId = agentTyped.branchId;
        const matchingBranch = this.branch.find(branch => branch.id === agentBranchId);
        if (matchingBranch) {
          this.quickForm.get('branch').setValue(matchingBranch);
        }
        if(agentTyped.length > 0) {
        this.intermediaryService.searchAgent(0, 5, agentTyped).subscribe((data) => {
          this.intermediaries = data.content
        });
      } else {
        this.getIntermediaries();
      }
    });
  }

  getIntermediaries() {
    this.intermediaryService.getAgents().subscribe((data) => {
      this.intermediaries = data.content
      const agentBranchIds = this.intermediaries.map((agentIds) => agentIds.branchId)
      console.log("AgentsBranchId", agentBranchIds, this.intermediaries)
    })
  }

  getProducts() {
    this.product_service.getListOfProduct('G').subscribe((products) => {
      console.log("products", products)
      this.productList = products.map((product) => ({
        label: this.capitalizeFirstLetterOfEachWord(product.description),
        value: product.code,
        type: product.type
      }));
    });
  }

  getAllCurrencies() {
    this.currencyService.getAllCurrencies().subscribe((currencies) => {
      this.currencyList = currencies.map((currency) => ({
        label: this.formatCurrencyLabel(currency.name, currency.symbol),
        value: currency.id
      }));
    });
  }

  formatCurrencyLabel(desc: string, symbol: string): string {
    const formattedDesc = desc.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');
    return `${formattedDesc} (${symbol})`;
  }

  getDurationTypes() {
    this.quickService.getDurationTypes().subscribe((durationType: DurationTypes[]) =>{
      this.durationType = durationType.map(dTypes => {
        dTypes.value = this.capitalizeFirstLetterOfEachWord(dTypes.value);
        return dTypes;
      });
    });
  }

  getQuotationCovers() {
    this.quickService.getQuotationCovers().subscribe((quotationCovers: QuotationCovers[]) => {
      this.quotationCovers = quotationCovers.map(cover => {
        cover.value = this.capitalizeFirstLetterOfEachWord(cover.value);
        return cover;
      });
    });
  }

  getUnitRate() {
    this.quickService.getUnitRate().subscribe((unitRate: UnitRate[]) => {
      this.unitRateOption = unitRate
    });
  }

  getFacultativeTypes() {
    this.quickService.getFacultativeTypes().subscribe((facultative: FacultativeType[]) => {
     this.facultativeType = facultative;
    });
  }

  getBranch() {
    this.branchService.getBranches(1).subscribe((branch: OrganizationBranchDto[]) => {
      this.branch = branch;
      console.log("this.branch", this.branch)
      const id = this.branch.map((branchId) => branchId.id)
      console.log("BranchesId", id)
    });

  }

  onContinue () {
    console.log("quickForm", this.quickForm.value)

    if(this.quickForm.valid) {
      const quickFormQuotationCalcType = this.quickForm.get("quotationCalcType").value;
      const commissionRatePattern = /^[0-9]*(\.[0-9]+)?$/;
      const commissionRateValue = this.quickForm.getRawValue().commissionRate;

      const formData = this.quickForm.value;

      const apiRequest = {
        effective_date: formatDate(formData.effectiveDate, 'yyyy-MM-dd', 'en-US'),
        product_code: formData.products.value,
        client_code: this.clientCode,
        facultative_type: formData.facultativeType.name,
        cover_type_dependant: formData.quotationCovers.name,
        calculation_type: formData.quotationCalcType,
        duration_type: formData.durationType.name,
        frequency_of_payment: formData.frequencyOfPayment.value,
        unit_rate: formData.unitRateOption.value,
        agent_code: formData.intermediary.id,
        branch_code: formData.branch.id,
        // branch_code: formData.branch.id !== null ? formData.branch.id : 410,
        currency_code: formData.currency.value,
        commission_rate: formData.commissionRate,
        product_type: formData.products.type,

      };
      console.log("apiRequest", apiRequest)

      if (commissionRateValue !== null && commissionRateValue !== undefined) {
        if (!commissionRatePattern.test(commissionRateValue) || commissionRateValue > 100) {
          console.log("Enter a valid commission rate value!");
          this.messageService.add({severity: 'error', summary: 'summary', detail: 'Enter a valid commission rate value!'});
          return;
        }
      }

        const quoteData = {
          formData
        };

        if(this.quotationCode === null || this.quotationCode === undefined) {
          this.spinner_Service.show('download_view');
          this.quickService.postQuoteDetails(apiRequest).subscribe((details: GrpQuoteDetails) => {
            this.quoteDetails = details;
            // Store quotation_code in session storage
            // this.session_storage.set('quotationResponse', this.quoteDetails.quotation_code.toString());
            sessionStorage.setItem('quotationResponse', JSON.stringify(this.quoteDetails));
            //Store the obj quoteData in sessionStorage
            this.session_storage.set('quotation_code', JSON.stringify(quoteData));

            // this.router.navigate(['/home/lms/grp/quotation/coverage'], {
            //   queryParams: {
            //     quotationCalcType: quickFormQuotationCalcType,
            //     quotationCode: this.quoteDetails.quotation_code
            //   },
            // });
            this.spinner_Service.hide('download_view');
            this.messageService.add({severity: 'success', summary: 'Success', detail: 'Quotation generated successfully'});
            this.router.navigate(['/home/lms/grp/quotation/coverage']);

          },
          (error) => {
            console.log(error)
            this.spinner_Service.hide('download_view');
            this.messageService.add({severity: 'error', summary: 'summary', detail: 'Error processing the quote. Please try again'});

          }
          );
        } else {
          console.log("updating existing quote", this.quotationCode)
          this.spinner_Service.show('download_view');
          this.quickService.updateQuoteDetails(this.quotationCode, apiRequest).subscribe((details: GrpQuoteDetails) => {
            this.quoteDetails = details;
            this.session_storage.set('quotation_code', JSON.stringify(quoteData));

            this.spinner_Service.hide('download_view');
            this.messageService.add({severity: 'success', summary: 'Success', detail: 'Quotation updated successfully'});
            this.router.navigate(['/home/lms/grp/quotation/coverage']);

          },
          (error) => {
            console.log(error)
            this.spinner_Service.hide('download_view');
            this.messageService.add({severity: 'error', summary: 'summary', detail: 'Error processing the quote update. Please try again'});

          }
          );
        }
      } else {/*
      together with the method -highlightInvalid(field: string), it helps
       highlight all invalid form fields on click of Continue button
       */
      Object.keys(this.quickForm.controls).forEach(field => {
        const control = this.quickForm.get(field);
        control.markAsTouched({ onlySelf: true });
      });
        this.messageService.add({severity: 'warn', summary: 'summary', detail: 'Fill all the fields correctly!'});
      }
  }

  retrievQuoteDets() {
    const storedQuoteData = this.session_storage.get('quotation_code');
    const newClientCodeString = this.session_storage.get('newClientCode');
    const newClientCode = JSON.parse(newClientCodeString);
    this.clientCode = newClientCode;

    if (storedQuoteData) {
      const quoteData = JSON.parse(storedQuoteData);
      const formData = quoteData.formData;
      this.quickForm.patchValue(formData);
      console.log("quickFormFormData", formData);

      const storedQuoteDetails = sessionStorage.getItem('quotationResponse');
      const parsedQuoteDetails = JSON.parse(storedQuoteDetails);

      this.quotationCode = parsedQuoteDetails.quotation_code;
      console.log("quotation code Quick", this.quotationCode)
      this.quickForm.patchValue({
        clients: formData.clients.label,
        intermediary: formData.intermediary.name,
        // effectiveDate: formatDate(formData.effectiveDate, 'dd/MM/yyyy', 'en-US')
      })
    }
  }

}
