import {ChangeDetectorRef, Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router } from '@angular/router';
import {Validators } from '@angular/forms';
import {HttpErrorResponse } from '@angular/common/http';
import {FormBuilder, FormGroup} from '@angular/forms';
import {MessageService} from 'primeng/api';
import { PerilsService } from '../../../services/perils-territories/perils/perils.service';
import { Peril } from '../../../data/gisDTO';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-peril',
  templateUrl: './peril.component.html',
  styleUrls: ['./peril.component.css']
})
export class PerilComponent {
  perilList:Peril[];
  perilDetails:Peril;
  perilForm:FormGroup;
  selected :any;
  filterBy: any;
  searchForm:FormGroup;
  isDisplayed:boolean;
  new:boolean;
  filteredPerils:Peril[];

  constructor(
    public service:PerilsService,
    public cdr: ChangeDetectorRef,
    public fb:FormBuilder,
    private messageService: MessageService,

  ) { }

  ngOnInit(): void {
    this.loadAllPerils();
    this.createPerilForm();
  }

  loadAllPerils(){
    return this.service.getAllPerils().pipe(tap(() => (this.isDisplayed = true)),).subscribe((data) => {
     this.perilList = data;
     this.filteredPerils = data;
     this.cdr.detectChanges();
     this.isDisplayed = true; 
   })   }
   loadPerils(id:any,item: any){
    
    return this.service.getPeril(id).subscribe(res=>{
      this.perilDetails = res;
      console.log(this.perilDetails);
      this.perilForm.patchValue(this.perilDetails) 
      this.selected = item; 
      this.cdr.detectChanges();
      this.new = false;
    });
    
   }
   isActive(item: any) {
    return this.selected === item;
  }
  createPerilForm(){
    this.perilForm = this.fb.group({
      shortDescription:['',Validators.required],
      description: ['',Validators.required],
      fullDescription: [''],
      paymentType: [''],
      dateWithEffectFrom: [''],
      dateWithEffectTo:[''],
      perilType: [''],
      organizationCode: ['']
     
    })

    this.searchForm = this.fb.group({
      search:['']
    })
   }

   New(){
    this.perilForm.reset()
    this.new = true;
   }

   save(){
    this.perilForm.controls['organizationCode'].setValue('2')
    if(this.new == true){
      this.service.createPeril(this.perilForm.value).subscribe((data: {}) => {
      
        try{
          console.log(this.perilForm.value)
          this.messageService.add({severity:'success', summary: 'Success', detail: 'Saved'});
        }catch(error){
          console.log(this.perilForm.value)
          this.messageService.add({severity:'error', summary: 'Error', detail: 'Error, try again later'});
        
        }
      })
    }
    else{
      this.service.updatePeril(this.perilForm.value,this.perilDetails.code).subscribe((data: {}) => {
      
        try{
          console.log(this.perilForm.value)
          this.messageService.add({severity:'success', summary: 'Success', detail: 'Saved'});
        }catch(error){
          console.log(this.perilForm.value)
          this.messageService.add({severity:'error', summary: 'Error', detail: 'Error, try again later'});
        
        }
      })
    }
   }
    delete(){
      this.messageService.add({severity:'error', summary: 'Error', detail: 'Unable to delete Peril'});
  //   if(this.selected==undefined){
  //     this.messageService.add({severity:'error', summary: 'Error', detail: 'Select a peril to continue'});
  //   }else{
      
  //       this.service.deletePeril(this.perilDetails.code).subscribe(
  //         (res)=>{
  //         this.messageService.add({severity:'success', summary: 'Success', detail: 'Cover type deleted'});
  //       },
  //         (error: HttpErrorResponse) => {
  //           console.log(error);
  //           this.messageService.add({severity:'error', summary: 'Error', detail: 'Unable to delete Peril.Try again later'});
  //           this.perilForm.reset(); 
  //         }
    
        
  //       )
      
    
  //  }
  }  
  filter(event: any) {
    const searchValue = (event.target.value).toUpperCase();
    this.filteredPerils = this.perilList.filter((el) => el.description.includes(searchValue));
    this.cdr.detectChanges();
  }


}
