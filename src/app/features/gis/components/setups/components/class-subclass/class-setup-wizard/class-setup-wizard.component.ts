import { ChangeDetectorRef,Component, OnInit } from '@angular/core';
import { FormGroup,FormBuilder, FormControl, Validators } from '@angular/forms';
import { setupListItem, setupWizard } from 'src/app/shared/data/common/setup-wizard';
import { DynamicFormFields } from 'src/app/shared/utils/dynamic.form.fields';
import { ActivatedRoute, Router } from '@angular/router';
import { retryWhen, tap } from 'rxjs/operators';
import { MessageService } from 'primeng/api'; 
import { ClassesSubclassesService } from '../../../services/classes-subclasses/classes-subclasses.service';
import { Classes, Subclasses,Peril, } from '../../../data/gisDTO';
@Component({
  selector: 'app-class-setup-wizard',
  templateUrl: './class-setup-wizard.component.html',
  styleUrls: ['./class-setup-wizard.component.css']
})
export class ClassSetupWizardComponent {
  // wizardConfig: setupWizard[] = [
  //   {
  //     tabTitle: 'Classes and Subclasses',
  //     url: '/home/gis/setup/class-subclass/classes'
  //   }
  
  // ];
  // classesListItem: setupListItem[]=[
  //   {
  //     listLabel:'Classes Setup',
  //     listPosition:'1',

  //   },
  //   {
  //     listLabel:'Subclass Setup',
  //     listPosition:'2'
  //   },
  //   {
  //     listLabel:'Class Perils',
  //     listPosition:'3'
  //   },
  //   {
  //     listLabel:'Class Excesses',
  //     listPosition:'4'
  //   }
  // ]
  // formContent: DynamicFormFields[]=[
  //   {
  //     name:'firstName',
  //     label:'First Name',
  //     type:'text',
  //     required: true,
  //     disabled:false,
  //     placeholder:'Enter your first name',
  //     value: ""

  //   },
  //   {
  //     name: 'date_of_birth_file',
  //     label: 'Date of Birth File',
  //     type: 'file',
  //     required: true,
  //     disabled:false,
  //     placeholder: 'Date of Birth File'
  //   },
  // ]

  saveClass:boolean;
  show:boolean = true;
  active:boolean = true;
  classDone:boolean = false;
  subclassDone:boolean = true;
  classForm: FormGroup;
  PerilForm:FormGroup;
  Peril:Peril[];
  perilDetails:Peril;
  page:string = '1';
  fields:any;
  formFields:any = []
  testForm:FormGroup;
  mandatoryFrontendScreens: any;
  optionalFrontendScreens: any;
  excessesDetails: any;
  isDisplayed: boolean;
  classList: Classes[];
  classDetails: Classes;
  editCode:any;
  subClassDetails: any;
  constructor(
    public gisService:ClassesSubclassesService,
     public fb: FormBuilder,
     public cdr: ChangeDetectorRef,
     private route: ActivatedRoute,
     public router:Router,
     public messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.sel();
    this.createForm();
    this.getFormFields();
    this.createTestForm();
    this.page = this.route.snapshot.paramMap.get('num');
    this.getSubclass(this.editCode);
    const state = window.history.state;
    if (state && state.subclassDetails) {
      const subclassDetails = state.subclassDetails;
      console.log('Subclass Details:', subclassDetails);
      // Now you can use subclassDetails in your component
    }
  }
  selectedCard: number = 1; 

  selectCard(cardNumber:string): void {
    
    // this.router.navigate(['/home/gis/classSetupsWizard', cardNumber])
    this.page = cardNumber
    this.cdr.detectChanges();
    // this.page =  this.route.snapshot.paramMap.get('num')

    this.createTestForm()
  }
  sel(){
    
    const cardNumber =  this.route.snapshot.paramMap.get('num')
    console.log(cardNumber)
    console.log(this.selectedCard)

  }

  addClass(){
    this.classForm.removeControl('classCode');
      console.log(this.classForm.value)
      this.gisService.createClass(this.classForm.value).subscribe((data: {}) => {
        try{
          this.messageService.add({severity:'success', summary: 'Success', detail: 'Saved'}); 

          this.classForm.reset()

          console.log(this.saveClass)
          console.log(this.classForm.value)   
        }catch(error){
          console.log(this.classForm.value)
        }
      })
  }
  createForm(){
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
      glAccountGroupCode:[''],
      underwritingScreenCode:[''],
      classCode:['', {nonNullable: true}],
      dependLossType:['N', {nonNullable: true}],
      excessType:['P',{nonNullable: true}]
    })
   }
   getAllPerils(){
    return this.gisService.getAllPerils().subscribe((res)=>{
      this.Peril = res;
      console.log(this.Peril)
      this.cdr.detectChanges();
    });
  }
  getPeril(event){
    return this.gisService.getPeril(event).subscribe((res)=>{
      this.perilDetails = res;
      console.log(this.perilDetails.description)
      this.PerilForm.controls['perCode'].setValue(this.perilDetails.description);
      this.cdr.detectChanges();
    });
  }
  savePeril(){
    this.PerilForm.controls['perCode'].setValue(this.perilDetails.description);
    this.PerilForm.controls['perShtDescription'].setValue(this.perilDetails.shortDescription);
    
  }
  saveExcessSection(){
    this.PerilForm.controls['excessSectCode'].setValue(this.excessesDetails.desc);
  }

  getFormFields(){
    this.gisService.getField(7).subscribe((res)=>{
      this.fields = res
      this.cdr.detectChanges();
    })
  }

  createTestForm(){
    this.gisService.getField(7).subscribe((res)=>{
      this.fields = res
       this.formFields = this.fields.fields
      if (this.fields && this.fields.fields) {
        const formControlsConfig = {}; 
        this.formFields.forEach(field=>{
          formControlsConfig[field.name]= ['', Validators.required];
        })
        this.testForm = this.fb.group(formControlsConfig);
       
      }
    this.mandatoryFrontendScreens = this.fields.fields.filter(field => field.isMandatory === 'Y');
    this.optionalFrontendScreens = this.fields.fields.filter(field => field.isMandatory === 'N');
    this.cdr.detectChanges();
    })
    
  }

  getClass(){
    return this.gisService.getAllClasses().pipe(tap(() => (this.isDisplayed = true)),).subscribe((data: Classes[]) => {
      this.classList = data;
      console.log(this.classList)
      this.isDisplayed = true; 

      this.cdr.detectChanges();

     })   
  }
  getClassDetails(code: any){
    return this.gisService.getClasses(code).pipe(tap(() => (this.isDisplayed = true)),).subscribe((res: Classes)=>{
      this.classDetails = res;
      // console.log(this.classDetails.dateWithEffectFrom)
      // this.classForm.patchValue(this.classDetails)
      // this.classForm.controls['organizationCode'].setValue(2);
      // this.subclass = this.classDetails.subClasses
      // this.isDisplayed = true; 
      

      this.cdr.detectChanges();
    
      
})
  }
  saveSubclass(){
    this.testForm.addControl('organizationCode', new FormControl('2', Validators.required));
    console.log(this.testForm.value)

    return this.gisService.createSubClass(this.testForm.value).subscribe((res)=>{
      this.messageService.add({severity:'success', summary: 'Success', detail: 'Saved'}); 
      this.classForm.reset(); 
    })

  }
  chooseClass(){
    this.PerilForm.controls['classCode'].setValue(this.classDetails.classDescription);
  }
  addClassPeril(){
    console.log(this.classDetails.classCode)
    console.log(this.perilDetails)
    this.PerilForm.controls['classCode'].setValue(this.classDetails.classCode);
    this.PerilForm.controls['perCode'].setValue(this.perilDetails.code);
    this.PerilForm.controls['claimExcessType'].setValue('P');
    this.PerilForm.controls['perType'].setValue('P');
    
    console.log(this.PerilForm.value)
    try{
       this.gisService.createClassPeril(this.PerilForm.value).subscribe(
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
  
    
    this.PerilForm.controls['classCode'].setValue(this.classDetails.classCode);
    this.PerilForm.controls['perCode'].setValue(this.perilDetails.code);
    this.PerilForm.controls['claimExcessType'].setValue('P');
    this.PerilForm.controls['perType'].setValue('P');
  
  }

  getSubclass(code) {
    if(this.editCode!=null && this.page=='3'){
      console.log(code)
      return this.gisService.getSubclass(code).subscribe((res)=>{
        this.subClassDetails = res;
        this.testForm.patchValue(this.subClassDetails)
  
        console.log(this.subClassDetails)
      })
    }
   
   }


   


}
