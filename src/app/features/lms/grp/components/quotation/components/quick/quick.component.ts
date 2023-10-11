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
import { ProductService } from 'src/app/features/lms/ind/service/product/product.service';
import { AutoUnsubscribe } from 'src/app/shared/services/AutoUnsubscribe';


const log = new Logger ('QuickComponent');
@AutoUnsubscribe
@Component({
  selector: 'app-quick',
  templateUrl: './quick.component.html',
  styleUrls: ['./quick.component.css']
})
export class QuickComponent implements OnInit, OnDestroy {
  quickForm: FormGroup;
  clientList: ClientDTO[] = [];
  productList: any[];
  constructor (
    private fb: FormBuilder,
    private router: Router,
    private quickService: QuickService,
    private payFrequenciesService: PayFrequencyService,
    private client_service: ClientService,
    private product_service: ProductService
    ) {}

    public clients = [
      { label: 'Client 1', value: 'client1' },
      { label: 'Client 2', value: 'client2' },
      { label: 'Client 3', value: 'client3' },
      { label: 'Client 10', value: 'client10' },
      { label: 'Client 15', value: 'client15' },
    ];

    public products = [
      {label: ' Britam Individual', value: 'britam'},
      {label: ' Defined Contribution', value: 'defined'},
      {label: ' Gratuity Fund', value: 'gratuity'},
      {label: ' Minor Trust', value: 'minor'},
      {label: ' Group Mortgage Foundation', value: 'mortgage'},
    ];

    public durationType = [
      {label: ' Annual', value: 'annual'},
      {label: ' Semi annual', value: 'semiAnnual'},
      {label: ' Quarterly', value: 'quarterly'},
      {label: ' Monthly', value: 'monthly'},
      {label: ' Termly', value: 'termly'},
      {label: ' Open', value: 'open'},
    ];

    public facultativeType = [
      {label: ' inward', value: 'inward'},
      {label: ' Outward', value: 'outward'},
      {label: ' Normal', value: 'normal'},
    ];

    public quotationCovers = [
      {label: ' Self', value: 'self'},
      {label: ' Self and dependants', value: 'selfDependant'},
      {label: ' Self and joint member', value: 'selfJoint'},
      {label: ' Self and member', value: 'selfMember'},
    ];

    frequencyOfPayment: { label: string, value: string }[] = [];

    public unitRateOption = [
      {label: ' Weighed age', value: 'weighedAge'},
      {label: ' Single age', value: 'singleAge'},
      {label: ' Average age', value: 'averageAge'},
      {label: ' Others', value: 'others'},
    ];

    public currency = [
      {label: ' Ksh', value: 'ksh'},
      {label: ' Naira', value: 'naira'},
      {label: ' USD', value: 'usd'},
      {label: ' EURO', value: 'euro'},
      {label: ' Ugsh', value: 'ugsh'},
      {label: ' Tzsh', value: 'tzsh'},
      {label: ' Peso', value: 'peso'},
      {label: ' Real', value: 'real'},
    ];

    public quotationCalcType = [
      {label: ' Detailed', value: 'detailed'},
      {label: ' Aggregate', value: 'aggregate'},
    ];

  ngOnInit(): void {
    this.quickQuoteForm();
    this.getPayFrequencies();
    this.getClientList();
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
    this.router.navigate(['/home/lms/grp/quotation/coverage']);
  }


  getPayFrequencies() {
    this.payFrequenciesService.getPayFrequencies().subscribe((freqs: PayFrequency[]) => {
      this.frequencyOfPayment = freqs.map(frequency => ({ 
        label: frequency.desc,
        value: frequency.sht_desc 
      })
      );
    });
  }
  getClientList() {
    this.client_service
      .getClients()
      .subscribe((data) => {
        this.clientList = data['content'];
        console.log(data)
      });
  }

  getProducts() {
    this.product_service
      .getListOfProduct()
      .subscribe(
        (products) =>
          (this.productList = [
            { code: 0, description: 'SELECT PRODUCT' },
            ...products,
          ])
          
      );
  }
}
