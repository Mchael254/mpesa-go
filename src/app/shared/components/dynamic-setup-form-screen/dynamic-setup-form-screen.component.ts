import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup} from '@angular/forms';

@Component({
  selector: 'app-dynamic-setup-form-screen',
  templateUrl: './dynamic-setup-form-screen.component.html',
  styleUrls: ['./dynamic-setup-form-screen.component.css']
})
export class DynamicSetupFormScreenComponent {
  selected :any;
  editParamForm:FormGroup;
  constructor(
    public fb: FormBuilder,
    public cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.createClassForm();
  }
 
   
   isActive(item: any) {
  }
  cancel(){

   }
   createClassForm(){
    
   }

   addParam(){
    
   }
   updateParam(){
   
   }

}
