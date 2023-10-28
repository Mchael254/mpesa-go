import { Component, OnDestroy, OnInit } from '@angular/core';
import stepData from '../../data/steps.json';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BreadCrumbItem } from 'src/app/shared/data/common/BreadCrumbItem';
import { AutoUnsubscribe } from 'src/app/shared/services/AutoUnsubscribe';
import { CountryService } from 'src/app/shared/services/setups/country/country.service';
import { CountryDto } from 'src/app/shared/data/common/countryDto';
import { PayFrequencyService } from 'src/app/features/lms/grp/service/pay-frequency/pay-frequency.service';
import { PayFrequency } from 'src/app/features/lms/grp/models/payFrequency';


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

  insuranceHistoryForm: FormGroup;
  countryList: CountryDto[] = [];
  frequencyOfPayment: any[] = [];
  constructor(private fb: FormBuilder, private country_service:CountryService, private payFrequenciesService: PayFrequencyService){
    this.insuranceHistoryForm = this.fb.group({
      question1: ['N'],
      question2: ['N'],
      question3: ['N'],
      question4: ['N'],
    });
  }
  ngOnInit(): void {
    this.getCountryList();
    this.getPayFrequencies();
  }

  getValue(name: string = 'sa_prem_select') {
    return this.insuranceHistoryForm.get(name).value;
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

  ngOnDestroy(): void {
    console.log('LifestyleDetailsComponent UNSUBSCRIBE');

  }

}
