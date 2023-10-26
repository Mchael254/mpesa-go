import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { Logger } from 'src/app/shared/services';
import { QuickService } from '../../../../service/quick.service';
import { PayFrequencyService } from '../../../../service/pay-frequency/pay-frequency.service';
import { PayFrequency } from '../../../../models/payFrequency';
import { untilDestroyed } from 'src/app/shared/shared.module';
import { ClientService } from 'src/app/features/entities/services/client/client.service';
import { ClientDTO } from 'src/app/features/entities/data/ClientDTO';
import { ProductService } from 'src/app/features/lms/service/product/product.service';
import { AutoUnsubscribe } from 'src/app/shared/services/AutoUnsubscribe';
import { Pagination } from 'src/app/shared/data/common/pagination';
import { Currency } from '../../../../models/currency';
import { DurationTypes, FacultativeType, QuotationCovers, UnitRate } from '../../../../models/quotationCovers';


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


  constructor (
    private fb: FormBuilder,
    private router: Router,
    private quickService: QuickService,
    private payFrequenciesService: PayFrequencyService,
    private client_service: ClientService,
    private product_service: ProductService
    ) {}

    public products = [
      {label: ' Britam Individual', value: 'britam'},
      {label: ' Defined Contribution', value: 'defined'},
      {label: ' Gratuity Fund', value: 'gratuity'},
      {label: ' Minor Trust', value: 'minor'},
      {label: ' Group Mortgage Foundation', value: 'mortgage'},
    ];

    public quotationCalcType = [
      {label: ' Detailed', value: 'detailed'},
      {label: ' Aggregate', value: 'aggregate'},
    ];

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
  }

  ngOnDestroy(): void {

  }

  quickQuoteForm() {
    this.quickForm = this.fb.group({
      clients: [""],
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
    console.log(quickFormValues)
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

  getClientList() {
    this.client_service.getClients().subscribe((data: Pagination<ClientDTO>) => {
      this.clientList = data.content.map(client => ({
        label: `${client.firstName} ${client.lastName}`,
        value: client.id
      }));
    });
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
        cover.desc = this.capitalizeFirstLetterOfEachWord(cover.desc);
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
