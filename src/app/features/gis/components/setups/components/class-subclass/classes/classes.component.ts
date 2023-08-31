import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import {NavigationExtras, Router } from '@angular/router';
import { FormGroup,FormBuilder, FormControl, Validators } from '@angular/forms';
import {MessageService} from 'primeng/api';
import { HttpErrorResponse } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { interval } from 'rxjs';
import {Peril,classPeril,Classes,Vessel,Conditions, Excesses} from '../../../data/gisDTO'
import { ClassesSubclassesService } from '../../../services/classes-subclasses/classes-subclasses.service';
import { TableDetail } from 'src/app/shared/data/table-detail';
import { NgxSpinnerService } from 'ngx-spinner';
@Component({
  selector: 'app-classes',
  templateUrl: './classes.component.html',
  styleUrls: ['./classes.component.css']
})
export class ClassesComponent {
  @ViewChild('addClassPeril') myModal: ElementRef;
  classList: Classes[];
  classDetails:Classes;
  classForm: FormGroup;
  selected: string = '';
  subClassList :any;
  subclass:any;
  isLoading: boolean = true;
  subClassDetails: any;
  new:boolean = true;
  selectedSubClass:any;
  classPerilList:any;
  isDisplayed:boolean;
  classexcesses: Excesses[];
  classPeril:classPeril[];
  classPerilDetails:any;
  excessesDetails:Excesses;
  Peril:Peril[];
  perilDetails:Peril;
  PerilForm:FormGroup;
  ExcessForm:FormGroup;
  ConditionsForm:FormGroup;
  VesselTypes:Vessel[]
  VesselForm:FormGroup;
  VesselDetails:Vessel;
  Conditions:Conditions;
  subclassForm:FormGroup;
  classSelect:boolean = false;
  filterBy:any;
  fields:any;
  subperils:any;
  status: boolean = false;
  show: string;
  
  tableDetails: TableDetail;

  globalFilterFields = ['description','code','classCode','screenCode','claimPrefix'];

  cols = [
    { field: 'code', header: 'Sub Class Code' },
    { field: 'classCode', header: 'Sub Class Id' },
    { field: 'description', header: 'Sub Class' },
    { field: 'screenCode', header: 'Screen Code' },
    { field: 'claimPrefix', header: 'Claim Prefix' },
  ];

  constructor(
    public router:Router,
    public classService:ClassesSubclassesService,
    public fb: FormBuilder,
    public messageService: MessageService,
    public cdr: ChangeDetectorRef,
    private spinner: NgxSpinnerService
   
   //  private classPerilService:ClassPerilService,
   //  public excessesService:ExcessServiceService,
  
  ) { 
      this.tableDetails = {
      cols: this.cols,
      rows: this.subclass?.content,
      globalFilterFields: this.globalFilterFields,
      isLazyLoaded: false,
      paginator: false,
      showFilter: false,
      showSorting: false
    }
  }
  

  ngOnInit(): void {
    // this.tableDetails = {
    //   cols: this.cols,
    //   rows: this.subclass?.content,
    //   globalFilterFields: this.globalFilterFields,
    //   showFilter: false,
    //   showSorting: true,
    //   paginator: true,
    //   url: '/home/entity/edit',
    //   urlIdentifier: 'id',
    //   isLazyLoaded: false
    // },
    this.spinner.show();
    this.loadAllClasses();
    this.createClassForm();
    this.createClassPerilForm(); 
    this.toggle('classPeril')
    // this.createForm();  
    this.toggle('classPeril')
 
}


   
  // ***classes***
createClassForm(){
  this.classForm = this.fb.group({
    classCode: ['', Validators.required],
    classDescription:  ['', Validators.required],
    dateWithEffectFrom:  ['', Validators.required],
    dateWithEffectTo:  ['', Validators.required],
    shortDescription:  ['', Validators.required],
    maxPolicyAccumulationLimit: ['', Validators.required],
    maxInsuredAccumulationLimit:['', Validators.required],
    organizationCode:['2', {nonNullable: true}],
    claCrgCode: ['', Validators.required],
    claReinCrgCode: ['', Validators.required],
    subClasses:[[],{nonNullable: true}]

  })
 }
 toggle(x:string){
  this.show = x 
  console.log(this.show)
 }

 test(){

  // keep the if else statement here
  document.getElementById("openModalButton").click();
 }
loadAllClasses(){
    return this.classService.getAllClasses().pipe(tap(() => (this.isDisplayed = true)),).subscribe((data: Classes[]) => {
      this.classList = data;
      this.isDisplayed = true; 
      this.spinner.hide();
      this.cdr.detectChanges();
   })  
}

subPerilsActivity(){
    this.status = !this.status;       
}
getClass(event: any){
    console.log(event)
    this.new = false;
    this.classSelect = true;
    return this.classService.getClasses(event).pipe(tap(() => (this.isDisplayed = true)),).subscribe((res: Classes)=>{
      this.classDetails = res;
      console.log(this.classDetails.dateWithEffectFrom)
      this.classForm.patchValue(this.classDetails)
      this.classForm.controls['organizationCode'].setValue(2);
      this.subclass = this.classDetails.subClasses
      this.isDisplayed = true; 
      this.spinner.hide();
      this.cdr.detectChanges();
    
      
})
   }
   updateClass(){
    const id = this.classForm.value.classCode
    this.classForm.removeControl('classCode');
    console.log(id)
    this.classService.updateClass(this.classForm.value,id).subscribe(
      (response:Classes) => {
        this.messageService.add({severity:'success', summary: 'Success', detail: 'Saved'}); 
        this.classForm.reset(); 
      },
      (error: HttpErrorResponse) => {
        console.log(error);
        this.messageService.add({severity:'error', summary: 'Error', detail: 'Error, try again later'});
        this.classForm.reset(); 
      }
    );
   }
   addClass(){
      this.classForm.removeControl('classCode');
      console.log(this.classForm.value)
      this.classService.createClass(this.classForm.value).subscribe((data: {}) => {
      
        try{
          console.log(this.classForm.value)
          this.messageService.add({severity:'success', summary: 'Success', detail: 'Saved'});
        }catch(error){
          console.log(this.classForm.value)
          this.messageService.add({severity:'error', summary: 'Error', detail: 'Error, try again later'});
        
        }
      })

  
   
  }
  save(){
    if(this.new==true){
      this.addClass();
    }else{
      this.updateClass();
    }
    console.log(this.new)
  }

   deleteClass(){
    if(this.selected == undefined){
      this.messageService.add({severity:'error', summary: 'Error', detail: 'Select a Class to continue'});
    }else{
      
        this.classService.deleteClass(this.selected).subscribe(
          (res)=>{
          this.messageService.add({severity:'success', summary: 'Success', detail: 'Class deleted'});
        },
          (error: HttpErrorResponse) => {
            console.log(error);
            this.messageService.add({severity:'error', summary: 'Error', detail: 'You cannot delete this record because child record exists'});
            this.classForm.reset(); 
          }
    
        
        )
      
    
   }
  }
  //***SUBCLASSES***//
  onRowSelect(code) {
    console.log(code)
    return this.classService.getSubclass(code).subscribe((res)=>{
      this.subClassDetails = res;
      console.log(this.subClassDetails)
    })
 }
  // editSubclass() {
  //   try {
  //     this.router.navigate(['/home/gis/setup/class-subclass/setup-wizard/2', this.subClassDetails.code])
  //   } catch (error) {
  //     this.messageService.add({severity:'error', summary: 'Error', detail: 'Select a Subclass to continue'});
  //   }
  // }
  
  editSubclass() {
    console.log(this.subClassDetails);
    try {
      if (!this.subClassDetails) {
        throw new Error('Select a Subclass to continue');
      }

      this.router.navigate(['/home/gis/setup/class-subclass/setup-wizard/3'], {
        state: { subclassDetails: this.subClassDetails }
      });
    } catch (error) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: error.message });
    }
  }



deleteSubclass(){

  try {
    this.classService.deleteSubClass(this.subClassDetails.code).subscribe(
          (res)=>{
          this.messageService.add({severity:'success', summary: 'Success', detail: 'Class deleted'});
          this.classForm.reset(); 
        },
          (error: HttpErrorResponse) => {
            console.log(error);
            this.messageService.add({severity:'error', summary: 'Error', detail: 'You cannot delete this record '});
            this.classForm.reset(); 
          });
    
  } catch (error) {
    this.messageService.add({severity:'error', summary: 'Error', detail: 'Select a Subclass to continue'});

  }
  
    
  
 
}
newClass() {
  this.classForm.reset({
    organizationCode: '2'
  });
  this.classForm.removeControl('classCode');
  this.new = true;
}
//** CLASS PERILS **//
getPerilByClassCode(event:any){
    
  return this.classService.getPerilByClass(event).pipe(tap(() => (this.isDisplayed = true)),).subscribe((data: classPeril[]) => {
  this.classPeril = data;
  this.isDisplayed = true; 
  console.log(this.classPeril)
  this.cdr.detectChanges();
 })  

}
perilsSelect(code){
return this.classService.getClassPeril(code).subscribe((res)=>{
  this.classPerilDetails = res;
  console.log(this.classPerilDetails)

});
}
getAllPerils(){
  return this.classService.getAllPerils().subscribe((res)=>{
    this.Peril = res;
    console.log(this.Peril)
    this.cdr.detectChanges();
  });
}
getPeril(event){
  return this.classService.getPeril(event).subscribe((res)=>{
    this.perilDetails = res;
    console.log(this.perilDetails.description)
    this.PerilForm.controls['perCode'].setValue(this.perilDetails.description);
    this.cdr.detectChanges();
  });
}

// editClassperil(){
//   try {
//     this.router.navigate(['/home/gis/editClassPeril', this.classPerilDetails.code])
//   } catch (error) {
//     this.messageService.add({severity:'error', summary: 'Error', detail: 'Select a Class Peril to continue'});
//   }
//  }



createClassPerilForm(){
  this.PerilForm = this.fb.group({
    subClPerilShtDesc: ['', Validators.required],
    expireOnClaim:[''],
    benefitPerPeriod:[''],
    perCode:['',Validators.required],
    maxClaimType:[''],
    personLimit:[''],
    perilType:['', Validators.required],
    perType:['', Validators.required],
    perShtDescription:['',Validators.required],
    multiplier:[''],
    perilLimitScope:[''],
    excessSectCode:[''],
    claimLimit:[''],
    perilLimit:[''],
    sumInsuredOrLimit:['', Validators.required],
    maxClaimPeriod:[''],
    depreciationPercentage:[''],
    claimExcessType:[''],
    classCode:['', {nonNullable: true}],
    dependLossType:['N', {nonNullable: true}],
    excessType:['P',{nonNullable: true}]
  })
}
savePeril(){
  this.PerilForm.controls['perCode'].setValue(this.perilDetails.description);
  this.PerilForm.controls['perShtDescription'].setValue(this.perilDetails.shortDescription);
  
}
saveExcessSection(){
  this.PerilForm.controls['excessSectCode'].setValue(this.excessesDetails.desc);
}
saveClassPeril(){

  if(this.new==true){
    console.log(this.classDetails.classCode)
    console.log(this.perilDetails)
    this.PerilForm.controls['classCode'].setValue(this.classDetails.classCode);
    this.PerilForm.controls['perCode'].setValue(this.perilDetails.code);
    this.PerilForm.controls['claimExcessType'].setValue('P');
    this.PerilForm.controls['perType'].setValue('P');
    
    console.log(this.PerilForm.value)
    try{
       this.classService.createClassPeril(this.PerilForm.value).subscribe(
      (data: {}) => {
        
        try{
          this.PerilForm.controls['perCode'].setValue(this.perilDetails.code);
          console.log(this.PerilForm.value)
          this.messageService.add({severity:'success', summary: 'Success', detail: 'Saved'});
        }catch(error){
          console.log(this.classForm.value)
  
          this.messageService.add({severity:'error', summary: 'Error', detail: 'Error, try again later'});
        
        }
      }
    );
    }catch{   
      this.messageService.add({severity:'error', summary: 'Error', detail: 'Select A class to proceed'});
    }
  }else{
    
    this.PerilForm.controls['classCode'].setValue(this.classDetails.classCode);
    this.PerilForm.controls['perCode'].setValue(this.perilDetails.code);
    this.PerilForm.controls['claimExcessType'].setValue('P');
    this.PerilForm.controls['perType'].setValue('P');
   this.classService.updateClassPeril(this.PerilForm.value,this.classPerilDetails.code).subscribe(
    res => {
      this.messageService.add({severity:'success', summary: 'Success', detail: 'Saved'});
    }
   )
  }
  
  

  
}
deleteClassPeril(){
  
  try {
    this.classService.deleteClassPeril(this.classPerilDetails.code).subscribe(
          (res)=>{
          this.messageService.add({severity:'success', summary: 'Success', detail: 'Class Peril deleted'});
          console.log(res)
        },
          (error: HttpErrorResponse) => {
            console.log(error);
            this.messageService.add({severity:'error', summary: 'Error', detail: 'You cannot delete this record '});
            
          });
    
  } catch (error) {
    this.messageService.add({severity:'error', summary: 'Error', detail: 'Select a Class Peril to continue'});

  }
  
}

newClassPeril(){
  this.PerilForm.reset();
  this.new = true;
}
editPeril(){
  this.PerilForm.patchValue(this.classPerilDetails)
  this.getPeril(this.classPerilDetails.perCode)
  console.log(this.perilDetails)
  this.new = false;
  
  }
  
  /* GET SUBPERILS  */
  fetchSubperils(code){
  
    this.classService.getAllSubperils(code).subscribe(res=>{
      this.subperils = res.content
      console.log(this.subperils)
    })
  }

    //***CLASS EXCESSES***//
  
  getByClassCode(event:any){
    
      return this.classService.getExcessesByClass(event).pipe(tap(() => (this.isDisplayed = true)),).subscribe((data: Excesses[]) => {
      this.classexcesses = data;
      this.isDisplayed = true; 
      console.log(this.classexcesses)
      this.cdr.detectChanges();
     })  
  
  }

  excessesSelect(code){
    return this.classService.getExcessesDetails(code).subscribe((res)=>{
      this.excessesDetails = res;
      console.log(this.excessesDetails)
    });
  }

  createExcessForm(){
    this.ExcessForm = this.fb.group({

          description:['',Validators.required],
          classCode: ['',Validators.required],
          dependLossType:['',Validators.required],
          totalLossExcessRateType: ['',Validators.required],
          totalLossExcessRate: ['',Validators.required],
          totalLossExcessMin:['',Validators.required],
          totalLossExcessMax: ['',Validators.required],
          totalLossClaimExRateType: ['',Validators.required],
          totalLossClaimExRate: ['',Validators.required],
          totalLossClaimExMin: ['',Validators.required],
          totalLossClaimExMax: ['',Validators.required],
          partialLossExcessRateType: [''],
          partialLossExcessRate: [''],
          partialLossExcessMin:  [''],
          partialLossExcessMax:  [''],
          partialLossClaimExRateType:  [''],
          partialLossClaimExRate:  [''],
          partialLossClaimExMin:  [''],
          partialLossClaimExMax:  [''],
          conditions:  [''],
          computationType:['',Validators.required],
          wef:['',Validators.required],
          wet:['',Validators.required]
    })
    this.ConditionsForm = this.fb.group({
      name:[''],
      operator:[''],
      value:['']
    })
  }

  addExcess(){
    // console.log(this.classDetails.classCode);
    // this.new = true
    // this.ExcessForm.controls['classCode'].setValue(this.classDetails.classCode);
    try {
      console.log(this.classDetails.classCode);
      this.new = true
      this.ExcessForm.controls['classCode'].setValue(this.classDetails.classCode);
    } catch (error) {
      this.messageService.add({severity:'error', summary: 'Error', detail: 'Select a Class to continue'});
    }
  }
  editExcess(){
    this.new = false
  
      try {
        this.PerilForm.controls['classCode'].setValue(this.classDetails.classCode);
      this.ExcessForm.patchValue(this.excessesDetails)
      console.log(this.ExcessForm.value)
      } catch (error) {
        this.messageService.add({severity:'error', summary: 'Error', detail: 'Select a Class to continue'});
      }
      
      

    // this.PerilForm.controls['classCode'].setValue(this.classDetails.classCode);
    // this.ExcessForm.patchValue(this.excessesDetails)
    // console.log(this.ExcessForm.value)
  }
  saveExcess(){
    if(this.new==true){
    console.log(this.classDetails.classCode)
    this.ExcessForm.controls['classCode'].setValue(this.classDetails.classCode);
    this.classService.createExcesses(this.ExcessForm.value).subscribe(res=>{
    
      try{
        this.messageService.add({severity:'success', summary: 'Success', detail: 'Saved'});
      }catch(error){
        this.messageService.add({severity:'error', summary: 'Error', detail: 'Error, try again later'});
      
      }
    })
    
    }else{
      this.classService.updateExcesses(this.ExcessForm.value,this.excessesDetails.code).subscribe((data: {}) => {
        
        try{
          this.messageService.add({severity:'success', summary: 'Success', detail: 'Saved'});
        }catch(error){
          this.messageService.add({severity:'error', summary: 'Error', detail: 'Error, try again later'});
        
        }
      })
    }
    console.log(this.new)
  }
  deleteClassExcess(){
    
    try {
      this.classService.deleteExcesses(this.excessesDetails.code).subscribe(
            (res)=>{
            this.messageService.add({severity:'success', summary: 'Success', detail: 'Class Excess deleted'});
            this.classForm.reset(); 
          },
            (error: HttpErrorResponse) => {
              console.log(error);
              this.messageService.add({severity:'error', summary: 'Error', detail: 'You cannot delete this record '});
              this.classForm.reset(); 
            });
      
    } catch (error) {
      this.messageService.add({severity:'error', summary: 'Error', detail: 'Select a Class Excess to continue'});

    }
    
      
    
  
  }
  getConditions(){
    this.classService.getConditions().subscribe(
      res=>{
        this.Conditions = res 
        console.log(res)
      }
    )
  }
  addCondition(){
    this.messageService.add({severity:'error', summary: 'Error', detail: 'Select a Condition to continue'});
  }

}
