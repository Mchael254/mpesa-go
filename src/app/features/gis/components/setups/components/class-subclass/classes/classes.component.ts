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
  

/* The above code is written in TypeScript and it is defining the `ngOnInit()` method of a component. */
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



/**
 * The function creates a form group with various form controls and validators for a class form.
 */
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
/**
 * The toggle function takes a string parameter and assigns it to the "show" property, then logs the
 * value of "show" to the console.
 * @param {string} x - string - The value that will be assigned to the "show" property.
 */
 toggle(x:string){
  this.show = x 
  console.log(this.show)
 }

 test(){

  // keep the if else statement here
  document.getElementById("openModalButton").click();
 }
/**
 * The function "loadAllClasses" retrieves all classes from a service, updates the class list, and
 * updates the display.
 * @returns a subscription to the observable returned by `this.classService.getAllClasses()`.
 */
loadAllClasses(){
    return this.classService.getAllClasses().pipe(tap(() => (this.isDisplayed = true)),).subscribe((data: Classes[]) => {
      this.classList = data;
      this.isDisplayed = true; 
      this.spinner.hide();
      this.cdr.detectChanges();
   })  
}

/**
 * The function `subPerilsActivity` toggles the value of the `status` property.
 */
subPerilsActivity(){
    this.status = !this.status;       
  }
  
/**
 * The `getClass` function logs the event, sets some flags and values, makes a service call to get
 * class details, updates the form with the received data, and performs some additional operations.
 * @param {any} event - The "event" parameter is of type "any", which means it can accept any type of
 * value. It is used as an input to the "getClass" function.
 * @returns The code is returning a subscription to the observable returned by
 * `this.classService.getClasses(event)`.
 */
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
  /**
   * The `updateClass()` function is used to update a class by sending a request to the server with the
   * updated class data.
   */
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
  /**
   * The addClass function removes a control from a form, logs the form value, and then calls a service
   * to create a class with the form value.
   */
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
 /**
  * The `save()` function checks if a new class needs to be added or an existing class needs to be
  * updated, and then logs the value of the `new` variable.
  */
  save(){
    if(this.new==true){
      this.addClass();
    }else{
      this.updateClass();
    }
    console.log(this.new)
  }

  /**
   * The deleteClass function checks if a class is selected and then calls the classService to delete
   * the selected class, displaying success or error messages accordingly.
   */
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
 /**
  * The function `onRowSelect` logs the code parameter, calls a service method to get subclass details
  * based on the code, and assigns the response to the `subClassDetails` variable.
  * @param code - The code parameter is the value that is passed when a row is selected. It is used as
  * a parameter to call the getSubclass method of the classService.
  * @returns The code is returning a subscription to the `getSubclass` method of the `classService`
  * service.
  */
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
  
 /**
  * The function `editSubclass()` logs the subclass details, checks if a subclass is selected, and
  * navigates to a setup wizard page with the subclass details if available, otherwise it displays an
  * error message.
  */
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



/**
 * The function `deleteSubclass()` is used to delete a subclass and display success or error messages
 * accordingly.
 */
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
/**
 * The function `newClass()` resets a form, removes a control, and sets a flag to indicate that a new
 * class is being created.
 */
newClass() {
  this.classForm.reset({
    organizationCode: '2'
  });
  this.classForm.removeControl('classCode');
  this.new = true;
  }
  

//** CLASS PERILS **//
/**
 * The function "getPerilByClassCode" retrieves peril data based on a given class code and updates the
 * classPeril variable with the retrieved data.
 * @param {any} event - The parameter "event" is of type "any", which means it can accept any type of
 * value.
 * @returns a subscription to the `getPerilByClass` method of the `classService`.
 */
getPerilByClassCode(event:any){
    
  return this.classService.getPerilByClass(event).pipe(tap(() => (this.isDisplayed = true)),).subscribe((data: classPeril[]) => {
  this.classPeril = data;
  this.isDisplayed = true; 
  console.log(this.classPeril)
  this.cdr.detectChanges();
 })  

  }
  

/**
 * The function "perilsSelect" retrieves class peril details based on a given code and assigns the
 * result to the "classPerilDetails" variable.
 * @param code - The code parameter is a string that represents the code of a class.
 * @returns The code is returning the result of the subscription to the classService's getClassPeril
 * method.
 */
perilsSelect(code){
return this.classService.getClassPeril(code).subscribe((res)=>{
  this.classPerilDetails = res;
  console.log(this.classPerilDetails)

});
  }
  

/**
 * The function `getAllPerils()` retrieves all perils from the class service and logs the result to the
 * console.
 * @returns The getAllPerils() function is returning the subscription object.
 */
getAllPerils(){
  return this.classService.getAllPerils().subscribe((res)=>{
    this.Peril = res;
    console.log(this.Peril)
    this.cdr.detectChanges();
  });
  }
  
/**
 * The function `getPeril` retrieves the peril details for a given event and updates the PerilForm with
 * the description of the peril.
 * @param event - The "event" parameter is the event object that is passed to the "getPeril" function.
 * It is used to retrieve the peril details for a specific event.
 * @returns The code is returning the result of the `this.classService.getPeril(event)` method, which
 * is a subscription to an observable.
 */
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



/**
 * The function creates a form group for a PerilForm with various form controls and validators.
 */
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
  

/**
 * The function "savePeril" sets the values of the "perCode" and "perShtDescription" form controls
 * based on the "description" and "shortDescription" properties of the "perilDetails" object.
 */
savePeril(){
  this.PerilForm.controls['perCode'].setValue(this.perilDetails.description);
  this.PerilForm.controls['perShtDescription'].setValue(this.perilDetails.shortDescription);
  
}
/**
 * The function saves the excess section code in a form control.
 */
saveExcessSection(){
  this.PerilForm.controls['excessSectCode'].setValue(this.excessesDetails.desc);
}
/**
 * The function `saveClassPeril()` is used to save class peril details, either by creating a new class
 * peril or updating an existing one.
 */
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
/**
 * This function deletes a class peril and displays a success message if the deletion is successful, or
 * an error message if there is an error.
 */
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

/**
 * The function "newClassPeril" resets the PerilForm and sets the "new" flag to true.
 */
newClassPeril(){
  this.PerilForm.reset();
  this.new = true;
  }
  
/**
 * The function `editPeril()` updates the PerilForm with the classPerilDetails, retrieves the peril
 * details based on the perCode, logs the perilDetails, and sets the new flag to false.
 */
editPeril(){
  this.PerilForm.patchValue(this.classPerilDetails)
  this.getPeril(this.classPerilDetails.perCode)
  console.log(this.perilDetails)
  this.new = false;
  
  }
  
  /* GET SUBPERILS  */
/**
 * The function fetchSubperils fetches all subperils for a given code and assigns the result to the
 * subperils variable.
 * @param code - The code parameter is used to fetch subperils based on a specific code.
 */
  fetchSubperils(code){
  
    this.classService.getAllSubperils(code).subscribe(res=>{
      this.subperils = res.content
      console.log(this.subperils)
    })
  }

    //***CLASS EXCESSES***//
  
/**
 * The function `getByClassCode` retrieves excesses by class code and updates the `classexcesses`
 * variable with the retrieved data.
 * @param {any} event - The event parameter is the input value that is passed to the getByClassCode
 * function. It is used as a parameter for the classService.getExcessesByClass method.
 * @returns a subscription to the classService's getExcessesByClass method.
 */
  getByClassCode(event:any){
    
      return this.classService.getExcessesByClass(event).pipe(tap(() => (this.isDisplayed = true)),).subscribe((data: Excesses[]) => {
      this.classexcesses = data;
      this.isDisplayed = true; 
      console.log(this.classexcesses)
      this.cdr.detectChanges();
     })  
  
  }

 /**
  * The function `excessesSelect` retrieves excesses details from a class service based on a given code
  * and assigns the result to the `excessesDetails` variable, while also logging the result to the
  * console.
  * @param code - The code parameter is used to specify the code for which the excesses details are
  * being requested.
  * @returns The code is returning a subscription to the `getExcessesDetails` method of the
  * `classService` class.
  */
  excessesSelect(code){
    return this.classService.getExcessesDetails(code).subscribe((res)=>{
      this.excessesDetails = res;
      console.log(this.excessesDetails)
    });
  }

 /**
  * The function creates a form using the FormBuilder module in TypeScript, with various fields and
  * validators.
  */
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

  /**
   * The function "addExcess" sets a value in a form control based on a class code, and displays an
   * error message if no class is selected.
   */
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
  /**
   * The function `editExcess()` sets the value of the `classCode` control in the `PerilForm` to the
   * `classCode` property of `classDetails`, and patches the values of `ExcessForm` with
   * `excessesDetails`.
   */
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
  /**
   * The function `saveExcess()` saves excesses data either by creating a new record or updating an
   * existing record.
   */
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
  /**
   * The function `deleteClassExcess` is used to delete a class excess and display success or error
   * messages accordingly.
   */
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
  /**
   * The function "getConditions" makes an HTTP request to the classService to retrieve a list of
   * conditions and assigns the response to the "Conditions" variable.
   */
  getConditions(){
    this.classService.getConditions().subscribe(
      res=>{
        this.Conditions = res 
        console.log(res)
      }
    )
  }
  /**
   * The addCondition function displays an error message if a condition is not selected.
   */
  addCondition(){
    this.messageService.add({severity:'error', summary: 'Error', detail: 'Select a Condition to continue'});
  }

}
