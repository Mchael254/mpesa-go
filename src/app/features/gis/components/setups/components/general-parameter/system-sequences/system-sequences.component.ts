import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { IntermediaryService } from 'src/app/features/entities/services/intermediary/intermediary.service';
import { SequenceService } from '../../../services/system-sequences/sequences.service';
import { Sequence } from '../../../data/gisDTO';
import { HttpErrorResponse } from '@angular/common/http';
import { MenuItem, MessageService, TreeNode } from 'primeng/api';
import { FormGroup,FormBuilder, FormControl, Validators } from '@angular/forms';
import { ProductService } from 'src/app/features/gis/services/product/product.service';
import { BranchService } from 'src/app/shared/services/setups/branch.service';
import { ThisReceiver } from '@angular/compiler';
@Component({
  selector: 'app-system-sequences',
  templateUrl: './system-sequences.component.html',
  styleUrls: ['./system-sequences.component.css']
})
export class SystemSequencesComponent {
  data: any[];
  files: TreeNode[];
  sequences:any;
  seq: any;
  product: any;
  name: any;
  branch: any;
  shortName: any;
  oldSequence: any;
  agents: any;
  agentName: any;
  selectedSequence: any = null;
  items: MenuItem[];
  selected: any;
  allocateCode: any;
  selectedFile: TreeNode;
  createForm: FormGroup
  allocateForm:FormGroup
  changeForm:FormGroup
  sequenceForm:FormGroup
  selectedNode:any;


  constructor(
    private sequenceService: SequenceService, 
    private productService: ProductService,
    private branchService:BranchService,
    private messageService: MessageService,
    private agentService: IntermediaryService,
    public cdr: ChangeDetectorRef,
    public fb: FormBuilder,
    
  ) { }

ngOnInit(): void {
    this.getSequences()
    this.createMissingSeqform()
    this.changingForm()
    this.allocationForm()
    this.getBranchesOrganizationId()
    this.getAllProucts()
    this.createSequenceForm()
    this.getAgents()
}

  createSequenceForm(){
    this.sequenceForm = this.fb.group({
      branch_code:['', Validators.required],
      product_prefix:['', Validators.required],
      next_number:['', Validators.required]
    })
  }
  SelectNode(event: any){
     this.selectedNode = event.node;
    
    if(this.selectedNode.key != undefined){
     
      this.getSequenceByCode(this.selectedNode.key);
    }

  }
  getSequenceByCode( code: number){
    this.sequenceService.getSequenceByCode(code).subscribe( data => {
      this.seq = data;
      console.log(this.seq)
      this.sequenceForm.patchValue(this.seq) 
      this.changeForm.controls['oldNextValue'].setValue(this.seq.next_number)
      this.cdr.detectChanges();
    });
  }

  getSequences(){
    
    this.sequenceService.getSequenceList().subscribe(data =>{
      this.sequences = data;
      this.data = this.sequences._embedded.system_sequence_dto_list.map((item) => ({
        label: item.type,
        children: this.sequences._embedded.system_sequence_dto_list.filter(child => child.type === item.type).map((child) => ({
          label: child.branch_code,
          children:  this.sequences._embedded.system_sequence_dto_list.filter(child2 => child2.type === item.type && child2.branch_code === child.branch_code).map((child2) =>({
            label: child2.product_prefix,
            key: child2.code
          }))
        }))
      }));
      this.cdr.detectChanges();
    })
  }


  createMissingSeqform(){
    this.createForm = this.fb.group({
      branch_code: ['', Validators.required],
      level: ['', Validators.required],
      country_code: ['', Validators.required],
      date: ['', Validators.required],
      month: ['', Validators.required],
      next_number: ['', Validators.required],
      number_type: ['', Validators.required],
      product_prefix: ['', Validators.required],
      reg: ['', Validators.required],
      type: ['', Validators.required],
      underwriting_year: ['', Validators.required],
      version: ['', Validators.required],
      organization_code: ['', Validators.required]
    })
  }

  allocationForm(){
    this.allocateForm = this.fb.group({
      agentCode: ['', Validators.required],
      branch_code: ['', Validators.required],
      nextNumberFrom: ['', Validators.required],
      nextNumberTo: ['', Validators.required],
      sequenceCode: ['', Validators.required]
    })
  }

  changingForm(){
    this.changeForm = this.fb.group({
      newNextValue: ['', Validators.required],
      oldNextValue: ['', Validators.required],
      remarks: ['', Validators.required],
      user: ['', Validators.required]
     
    })
  }

  getBranchesOrganizationId(){
    
    this.branchService.getBranches(2).subscribe(data =>{
      this.branch = data;
    })
  }
  getAllProucts(){

    this.productService.getAllProducts().subscribe(data =>{
      this.product = data;
    })
  }
  getAgents() {
    this.agentService.getAgents().subscribe(data => {
      this.agents = data.content
      console.log(this.agents)
    })
  }

  createMissingSequence(){
    this.createForm.controls['version'].setValue(0)
    this.createForm.controls['organization_code'].setValue(2)
    this.sequenceService.createSequence(this.createForm.value).subscribe(res=>{
      try{
        
        this.messageService.add({severity:'success', summary: 'Success', detail: 'Saved'});
      }catch(error){
       
        this.messageService.add({severity:'error', summary: 'Error', detail: 'Error, try again later'});
      
      }
    })
  }
  saveAllocateForm(){
    this.allocateForm.controls['sequenceCode'].setValue(this.selectedNode.key)
   
      this.sequenceService.allocate(this.selectedNode.key,this.allocateForm.value).subscribe(res=>{
        try{
        
          this.messageService.add({severity:'success', summary: 'Success', detail: 'Saved'});
        }catch(error){
         
          this.messageService.add({severity:'error', summary: 'Error', detail: 'Error, try again later'});
        
        }
      })
    
   
    
    
  }

  saveChangeForm(){
    try{
      this.sequenceService.change(this.selectedNode.key,this.changeForm.value).subscribe(res=>{
       
          console.log(this.allocateForm.value)
          this.messageService.add({severity:'success', summary: 'Success', detail: 'Saved'});
       
      })
    }catch(error){
         
      this.messageService.add({severity:'error', summary: 'Error', detail: 'Error, select a sequence to proceed'});
    
    }
    
  }

}
