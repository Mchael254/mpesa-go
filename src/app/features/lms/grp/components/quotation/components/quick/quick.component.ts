import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
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
  currencyList: { label: string; value: number; }[] = [];
  quotationCovers: QuotationCovers [] = [];
  durationType: DurationTypes [] = []
  frequencyOfPayment: { label: string, value: string }[] = [];
  unitRateOption: UnitRate [] =  [];
  facultativeType: FacultativeType [] = [];
  intermediaries: AgentDTO[] = [];


  constructor (
    private fb: FormBuilder,
    private router: Router,
    private quickService: QuickService,
    private payFrequenciesService: PayFrequencyService,
    private client_service: ClientService,
    private product_service: ProductService,
    private intermediaryService: IntermediaryService
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
  }

  ngOnDestroy(): void {

  }

  quickQuoteForm() {
    this.quickForm = this.fb.group({
      clients: [""],
      branch: [""],
      products: [""],
      durationType: [""],
      facultativeType: [""],
      quotationCovers: [""],
      frequencyOfPayment: [""],
      unitRateOption: [""],
      currency: [""],
      effectiveDate: [""],
      quotationCalcType: [""],
      intermediary: [""],
      commissionRate: [""],

    });
  }

  onContinue () {
    const quickFormValues = this.quickForm.get("quotationCalcType").value;
    this.router.navigate(['/home/lms/grp/quotation/coverage'], {
      queryParams: {
        quotationCalcType: quickFormValues,
      },
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
    this.product_service.getListOfGroupProduct().subscribe((products) => {
      this.productList = products.map((product) => ({
        label: this.capitalizeFirstLetterOfEachWord(product.description),
        value: product.code
      }));
    });
  }

  getAllCurrencies() {
    this.quickService.getAllCurrencies().subscribe((currencies: Currency[]) => {
      this.currencyList = currencies.map((currency) => ({
        label: this.formatCurrencyLabel(currency.desc, currency.symbol),
        value: currency.code
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

}
