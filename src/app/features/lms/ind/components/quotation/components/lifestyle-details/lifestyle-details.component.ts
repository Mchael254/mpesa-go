import { Component, OnDestroy, OnInit } from '@angular/core';
import stepData from '../../data/steps.json';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BreadCrumbItem } from 'src/app/shared/data/common/BreadCrumbItem';
import { AutoUnsubscribe } from 'src/app/shared/services/AutoUnsubscribe';
import { CountryService } from 'src/app/shared/services/setups/country/country.service';
import { CountryDto } from 'src/app/shared/data/common/countryDto';
import { PayFrequencyService } from 'src/app/features/lms/grp/service/pay-frequency/pay-frequency.service';
import { PayFrequency } from 'src/app/features/lms/grp/models/payFrequency';
import { LifestyleService } from 'src/app/features/lms/service/lifestyle/lifestyle.service';
import { SessionStorageService } from 'src/app/shared/services/session-storage/session-storage.service';
import { SESSION_KEY } from 'src/app/features/lms/util/session_storage_enum';
import { Router } from '@angular/router';
import { StringManipulation } from 'src/app/features/lms/util/string_manipulation';
import {NgxSpinnerService} from "ngx-spinner";
import {finalize} from "rxjs/internal/operators/finalize";
import { Observable } from 'rxjs';
import { ToastService } from 'src/app/shared/services/toast/toast.service';


@Component({
  selector: 'app-lifestyle-details',
  templateUrl: './lifestyle-details.component.html',
  styleUrls: ['./lifestyle-details.component.css']
})
@AutoUnsubscribe
export class LifestyleDetailsComponent implements OnInit, OnDestroy {
  steps = stepData
  breadCrumbItems: BreadCrumbItem[] = [
    {
      label: 'Home',
      url: '/home/dashboard'
    },
    {
      label: 'Quotation',
      url: '/home/lms/quotation/list'
    },
    {
      label: 'Lifestyle details(Data Entry)',
      url: '/home/lms/ind/quotation/lifestyle-details'
    },
  ];

  clientLifestyleForm: FormGroup;
  bmiForm: FormGroup;
  countryList: CountryDto[] = [];
  frequencyOfPayment: any[] = [];
  bmi: {} = {};
  bmiNotReady: boolean = false;
  isLoading: boolean = false;

  constructor(private fb: FormBuilder, private spinner_service: NgxSpinnerService, private router: Router, private session_service: SessionStorageService,
              private country_service: CountryService, private payFrequenciesService: PayFrequencyService, private lifestyle_service: LifestyleService,
              private toast: ToastService) {
    this.clientLifestyleForm = this.fb.group({
      code: [],
      isClientHazardous: ['N'],
      tobaccoFrequency: [],
      tobaccoConsumptionPeriod: [],
      tobaccoQuantity: [],
      alcoholFrequency: [],
      alcoholQuantity: [],
      alcoholConsumptionPeriod: [],
      question2: ['N'],
      question3: ['N'],
      question4: ['N'],
    });

    this.bmiForm = this.fb.group({
      height: [],
      weight: [],
      bmi: [],
      clientBmi: [],
    })
  }

  ngOnInit(): void {
    this.getCountryList();
    this.getPayFrequencies();
    this.getClientLifeStyleById();
  }


  getBMI() {
    this.bmiNotReady = true
    let bmi = {};
    bmi['height'] = this.bmiForm.get('height').value;
    bmi['weight'] = this.bmiForm.get('weight').value;
    this.payFrequenciesService
      .bmi(bmi['height'], bmi['weight'])
      .subscribe((data: any) => {
        this.bmiNotReady = false
        this.bmi = data

        this.bmiForm.patchValue({...data})
      })
  }

  getValue(name: string = 'sa_prem_select') {
    return this.clientLifestyleForm.get(name).value;
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

  getCountryList() {
    this.country_service
      .getCountries()
      .subscribe((data) => {
        this.countryList = data;
      });
  }

  getClientLifeStyleById() {
    this.spinner_service.show("lifestyle_screen");
    this.isLoading = true;
    let client_code = this.session_service.get(SESSION_KEY.CLIENT_CODE);
    this.lifestyle_service.getClientLifeStyleById(client_code).pipe(finalize(() => {
      this.spinner_service.hide("lifestyle_screen");
      this.isLoading = false;
    })).subscribe((data: any) => {
      this.bmiForm.patchValue({
        height: data['height'],
        weight: data['weight'],
        bmi: data['clientBmi'],
        clientBmi: data['clientBmi'],
      })
      this.bmi['bmi'] = data['clientBmi'];
      if (data['alcoholQuantity']) this.clientLifestyleForm.get('question4').setValue('Y')
      if (data['tobaccoQuantity']) this.clientLifestyleForm.get('question3').setValue('Y')
      this.clientLifestyleForm.patchValue({
        ...data
      })
      this.spinner_service.hide("lifestyle_screen");
    },
    err=>{
      this.toast.danger('We are unable to complete your request, try again later', 'INFO');

    })
  }

  saveClientLifeStyle() {
    this.spinner_service.show("lifestyle_screen");
    this.isLoading = true;
    let client_code = StringManipulation.returnNullIfEmpty(this.session_service.get(SESSION_KEY.CLIENT_CODE));
    let payload = {...this.clientLifestyleForm.value, ...this.bmiForm.value};
    payload['webClientCode'] = client_code;
    payload['clientBmi'] = payload['bmi'];
    let life_style_base_service: Observable<any>;

    if(payload['code']!=null){
      life_style_base_service = this.lifestyle_service.updateLifeStyle(payload);
    }else{
      life_style_base_service = this.lifestyle_service.saveLifeStyle(payload);
    }


    life_style_base_service.pipe(finalize(()=> {
      this.isLoading = false;
      this.spinner_service.hide("lifestyle_screen");
    }))
      .subscribe((data :any) => {
        this.router.navigate(['/home/lms/ind/quotation/medical-history']);
        this.spinner_service.hide("lifestyle_screen");

      },
      err=>{
        this.toast.danger("Unable to Save Client Lifestyle's Record, try again later!!", 'DANGER');
  
      })


  }

  ngOnDestroy(): void {
    console.log('LifestyleDetailsComponent UNSUBSCRIBE');
  }

}