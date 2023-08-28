import { Component,ChangeDetectorRef } from '@angular/core';
import { shortPeriod } from '../../../data/gisDTO';
import { FormControl,FormBuilder,FormGroup } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { HttpErrorResponse } from '@angular/common/http';
import { ShortPeriodService } from '../../../services/short-period/short-period.service';
@Component({
  selector: 'app-standard-short-period-rates',
  templateUrl: './standard-short-period-rates.component.html',
  styleUrls: ['./standard-short-period-rates.component.css']
})
export class StandardShortPeriodRatesComponent {


  rates:any =[];
  rate:any;
  rateForm:FormGroup;
  new:Boolean;
  filterBy:any;


  constructor(
    public shortPeriodService:ShortPeriodService,
    public fb:FormBuilder,
    public cdr: ChangeDetectorRef,
    private messageService: MessageService,
  ) { }

  ngOnInit(): void {
    this.fetchSPRates();
    this.createForm();
  }



  fetchSPRates(){
    this.shortPeriodService.getAllSPRates().subscribe(
      res=>{
        this.rates = res._embedded.short_period_rate_dto_list
        console.log(this.rates)
        this.cdr.detectChanges();
      }
    )
  }
  fetchSPRate(id){
    this.shortPeriodService.getSPRates(id).subscribe(
      res=>{
        this.rate = res
      }
    )
  }
  createForm(){
    this.rateForm = this.fb.group({
      annual_premium_rate:[''],
      date_with_effect_from:[''],
      date_with_effect_to:[''],
      maximum_days:[''],
      minimum_days:[''],
      organization_code:[''],
      rate_division_factor:[''],
      version:['']
    })
  }

  add(){
    this.new = true;
  }

  edit(){
    console.log(this.rate)
    try {
      // this.rateForm.controls['organizationCode'].setValue(2)
      // this.rateForm.controls['version'].setValue(0)
      // this.rateForm.controls['rateDivisionFactor'].setValue(this.rate.rate_division_factor)
      // this.rateForm.controls['minimumDays'].setValue(this.rate.minimum_days)
      // this.rateForm.controls['maximumDays'].setValue(this.rate.maximum_days)
      // this.rateForm.controls['dateWithEffectTo'].setValue(this.rate.date_with_effect_to)
      // this.rateForm.controls['annualPremiumRate'].setValue(this.rate.annual_premium_rate)
      // this.rateForm.controls['dateWithEffectFrom'].setValue(this.rate.date_with_effect_from)
      // this.rateForm.controls['code'].setValue(this.rate.code)
      this.rateForm.patchValue(this.rate)
  
    
      this.new = false;
      
    } catch (error) {
      this.messageService.add({severity:'error', summary: 'Error', detail: 'Select a Short Period rate to edit'});
      this.new = true;
    }
   

    // if(this.rate==undefined){
    //   alert("error")
    // }else{
    //   this.new = false;
    // console.log(this.rate)
    // }
    // this.new = false;
    // console.log(this.rate)
  }

  save(){
    if(this.new == true){
      this.rateForm.controls['organization_code'].setValue(2)
      this.rateForm.controls['version'].setValue(0)
      this.shortPeriodService.createSPRates(this.rateForm.value).subscribe(
        res=>{
          this.messageService.add({severity:'success', summary: 'Success', detail: 'Saved'});
        },
        (error: HttpErrorResponse) => {
          this.messageService.add({severity:'error', summary: 'Error', detail: 'Unable to save record'});
        }
      );
    }else{
      this.shortPeriodService.updateSPRates(this.rateForm.value,this.rate.code).subscribe(
        res=>{
          this.messageService.add({severity:'success', summary: 'Success', detail: 'Saved'});
        },
        (error: HttpErrorResponse) => {
          this.messageService.add({severity:'error', summary: 'Error', detail: 'Unable to save record'});
        }
      )
    }
    
  }

  delete(){
    try {
      this.shortPeriodService.deleteSPRates(this.rate.code).subscribe(
        res=>{
          this.messageService.add({severity:'success', summary: 'Success', detail: 'Successfully deleted'});
          },
          (error: HttpErrorResponse) => {
            this.messageService.add({severity:'error', summary: 'Error', detail: 'Unable to delete record.Try again later'});
          
        }
      )
    } catch (error) {
      this.messageService.add({severity:'error', summary: 'Error', detail: 'Select a record to proceed'});
    }
   

}


}
