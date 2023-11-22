import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Logger } from 'src/app/shared/services';
import { QuickService } from '../../../../service/quick.service';
import { PayFrequencyService } from '../../../../service/pay-frequency/pay-frequency.service';
import { PayFrequency } from '../../../../models/payFrequency';
import { ClientService } from 'src/app/features/entities/services/client/client.service';
import { ClientDTO } from 'src/app/features/entities/data/ClientDTO';
import { AutoUnsubscribe } from 'src/app/shared/services/AutoUnsubscribe';
import { Pagination } from 'src/app/shared/data/common/pagination';
import { Currency } from '../../../../models/currency';
import { DurationTypes, FacultativeType, QuotationCovers, UnitRate } from '../../../../models/quotationCovers';
import { ProductService } from 'src/app/features/lms/service/product/product.service';
import { IntermediaryService } from 'src/app/features/entities/services/intermediary/intermediary.service';
import { AgentDTO } from 'src/app/features/entities/data/AgentDTO';
import { debounceTime } from 'rxjs/internal/operators/debounceTime';
import { distinctUntilChanged } from 'rxjs/internal/operators/distinctUntilChanged';
import { BranchService } from 'src/app/shared/services/setups/branch/branch.service';
import { OrganizationBranchDto } from 'src/app/shared/data/common/organization-branch-dto';
import { CurrencyService } from 'src/app/shared/services/setups/currency/currency.service';
import { GrpQuoteDetails } from '../../../../models/quoteDetails';
import { SessionStorageService } from 'src/app/shared/services/session-storage/session-storage.service';
import { formatDate } from '@angular/common';


const log = new Logger ('QuickComponent');
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
  quoteDetails: GrpQuoteDetails


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
    ) {}

  ngOnInit(): void {
    this.quickQuoteForm();
    this.getPayFrequencies();
    this.getClientList();
    this.getProducts();
    this.getAllCurrencies();
    this.getDurationTypes();
    this.getQuotationCovers();
    this.getUnitRate();
    this.getFacultativeTypes();
    this.getIntermediaries();
    this.searchClient();
    this.searchAgent();
    this.getBranch();
    // this.retrievQuoteDets();
  }

  ngOnDestroy(): void {

  }

  quickQuoteForm() {
    this.quickForm = this.fb.group({
      clients: ["", [Validators.required] ],
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
      commissionRate: ["", [Validators.required] ],

    });
  }

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

  searchClient() {
    this.quickForm.get('clients').valueChanges.pipe(debounceTime(900), distinctUntilChanged())
    .subscribe((clientTyped) => {
      if(clientTyped.length > 0) {
        this.client_service.searchClients(0, 5, clientTyped).subscribe((data: Pagination<ClientDTO>) => {
          this.clientList = data.content.map(client =>({
            label: this.capitalizeFirstLetterOfEachWord(`${client.firstName} ${client.lastName}-${client.id}`),
            value: client.id
          }));
        })
      }
      else {
        this.getClientList();
      }
    });
  }

  getClientList() {
    this.client_service.getClients().subscribe((data: Pagination<ClientDTO>) => {
      this.clientList = data.content.map(client => ({
        label: `${client.firstName} ${client.lastName}`,
        value: client.id
      }));
    });
  }

  searchAgent() {
    this.quickForm.get('intermediary').valueChanges.pipe(debounceTime(900), distinctUntilChanged())
    .subscribe((agentTyped) => {
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
    })
  }

  getProducts() {
    this.product_service.getListOfProduct().subscribe((products) => {
      this.productList = products.map((product) => ({
        label: this.capitalizeFirstLetterOfEachWord(product.description),
        value: product.code
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
    this.branchService.getBranches(2).subscribe((branch: OrganizationBranchDto[]) => {
      this.branch = branch;
    });

  }

  onContinue () {
    if(this.quickForm.valid) {
      const quickFormQuotationCalcType = this.quickForm.get("quotationCalcType").value;
      const commissionRatePattern = /^[0-9]*(\.[0-9]+)?$/;
      const commissionRateValue = this.quickForm.getRawValue().commissionRate;

      const formData = this.quickForm.value;

      const apiRequest = {
        "effective_date": formatDate(formData.effectiveDate, 'yyyy-MM-dd', 'en-US'),
        // "product_code": formData.products.value,
        "product_code": 2021675,
        // "client_code": formData.clients.value,
        "client_code": 212120912884,
        "facultative_type": formData.facultativeType.name,
        "cover_type_dependant": formData.quotationCovers.name,
        "calculation_type": formData.quotationCalcType,
        "duration_type": formData.durationType.name,
        "frequency_of_payment": formData.frequencyOfPayment.value,
        "unit_rate": formData.unitRateOption.value,
        // "agent_code": formData.intermediary.id,
        "agent_code": 2020201235490,
        "branch_code": formData.branch.id,
        "currency_code": formData.currency.value,
        "commission_rate": formData.commissionRate
      };

        if (!commissionRatePattern.test(commissionRateValue || (commissionRateValue === '' || null))) {
          console.log("Enter a valid commission rate value!")
          alert("Enter a valid commission rate value!");
          return;
        }

        const quoteData = {
          formData
        };

      this.quickService.postQuoteDetails(apiRequest).subscribe((details: GrpQuoteDetails) => {
        this.quoteDetails = details;
        console.log(this.quoteDetails, this.quoteDetails.quotation_code, this.quoteDetails.quotation_code.toString())
        // Store quotation_code in session storage
        this.session_storage.set('quotation_code', this.quoteDetails.quotation_code.toString());
        //Store the obj quoteData in sessionStorage
        this.session_storage.set('quotation_code', JSON.stringify(quoteData));
      });

      // const quotation_code = 20237347;
      
      // this.quickService.updateQuoteDetails(quotation_code, apiRequest).subscribe((details) => {
      // });
      this.router.navigate(['/home/lms/grp/quotation/coverage'], {
        queryParams: {
          quotationCalcType: quickFormQuotationCalcType,
          quotationCode: this.quoteDetails.quotation_code
        },
      });

      

      } else {
        alert("Fill all fields");
      }
    
  }

  retrievQuoteDets() {
    const storedQuoteData = this.session_storage.get('quotation_code');

    if (storedQuoteData) {
      const quoteData = JSON.parse(storedQuoteData);
      const formData = quoteData.formData;
      console.log("effectiveDate", formData)
      this.quickForm.patchValue(formData);
      // formData.effective_date = this.datePipe.transform(new Date(formData.effective_date), 'dd/MM/yy');
      // this.quickForm.patchValue(formData);
    }
  }

}
