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
  bmi:{}={};
  bmiNotReady: boolean = false;

  constructor(private fb: FormBuilder, private router: Router, private session_service: SessionStorageService,
    private country_service:CountryService, private payFrequenciesService: PayFrequencyService, private lifestyle_service: LifestyleService){
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


  getBMI(){
    this.bmiNotReady = true
    let bmi = {};
    bmi['height']= this.bmiForm.get('height').value;
    bmi['weight']= this.bmiForm.get('weight').value;
    this.payFrequenciesService
    .bmi(bmi['height'], bmi['weight'])
    .subscribe((data: any) =>{
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

  getClientLifeStyleById(){
    let client_code = this.session_service.get(SESSION_KEY.CLIENT_CODE);
    this.lifestyle_service.getClientLifeStyleById(client_code).subscribe((data: any) =>{

      this.bmiForm.patchValue({
        height: data['height'],
        weight: data['weight'],
        bmi: data['clientBmi'],
        clientBmi: data['clientBmi'],
      })
      console.log(data);
      this.clientLifestyleForm.patchValue({
        ...data
      })

    })
  }

  saveClientLisfeStyle(){
    let client_code = StringManipulation.returnNullIfEmpty(this.session_service.get(SESSION_KEY.CLIENT_CODE));
    let payload = {...this.clientLifestyleForm.value, ...this.bmiForm.value};
    payload['webClientCode'] = client_code
    payload['clientBmi'] = payload['bmi']
    console.log(payload);


    this.lifestyle_service.saveLifeStyle(payload).subscribe((data :any) => {
      console.log(data);

      // this.bmiForm.patchValue({
      //   height: data['height'],
      //   weight: data['weight'],
      //   bmi: data['clientBmi'],
      // });


    })
    // this.router.navigate(['/home/lms/ind/quotation/medical-history'])
  }

  ngOnDestroy(): void {
    console.log('LifestyleDetailsComponent UNSUBSCRIBE');
  }

}
