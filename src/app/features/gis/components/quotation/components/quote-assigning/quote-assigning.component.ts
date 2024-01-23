import { Component } from '@angular/core';
import quoteStepsData from '../../data/normal-quote-steps.json';
import { SubclassesService } from '../../../setups/services/subclasses/subclasses.service';
import { SubclassesDTO } from '../../../setups/data/gisDTO';
import { FormControl,FormBuilder, FormGroup } from '@angular/forms';
@Component({
  selector: 'app-quote-assigning',
  templateUrl: './quote-assigning.component.html',
  styleUrls: ['./quote-assigning.component.css']
})
export class QuoteAssigningComponent {

  steps = quoteStepsData;
  subclass:any
  assigned:any=[]
  multiUserForm:FormGroup

  constructor( 
    public subclassService:SubclassesService,
    public fb:FormBuilder
    ){}

    ngOnInit(): void {
      this.getSubclasses();
      this.createForm();
    }

    getSubclasses(){
      this.subclassService.getAllSubclasses().subscribe(res=>{
        this.subclass = res
      })
    }

    createForm(){
      this.multiUserForm = this.fb.group({
        user:[''],
        subclass:['']
      })
    }

    assignUser(){
     
      this.assigned.push(this.multiUserForm.value)
    }

   
}
