import { ChangeDetectorRef, Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { InterestedPartiesService } from '../../../services/interested-parties/interested-parties.service';
import {Logger} from '../../../../../../../shared/shared.module'

const log = new Logger('InterestedPartiesComponent');

@Component({
  selector: 'app-interested-parties',
  templateUrl: './interested-parties.component.html',
  styleUrls: ['./interested-parties.component.css']
})
/**
 * Represents the Angular component responsible for managing interested parties information.
 * This component facilitates the creation, retrieval, and modification of interested party data.
 * The component interacts with the InterestedPartiesService to perform data operations.
 */
export class InterestedPartiesComponent {
  partyList: any;
  partyDetails:any;
  partyForm:FormGroup;
  searchForm:FormGroup;
  editPartyForm:FormGroup;
  interestedPartiesData:any;
  selected:any;
  fBy:any;
  
  new:boolean=true;
  constructor(
    public fb: FormBuilder,
    public partyService: InterestedPartiesService,
    public cdr: ChangeDetectorRef,
    private messageService: MessageService,
  ) { }

 /**
   * Initialize component by:
   * 1.Initialize the create Party Form
   * 2. Load all Interested Parties
   */
  ngOnInit(): void {
    this.createPartyForm()
    this.loadAllinterestedParties();
  }
  
/**
 * Retrieves and populates the list of interested parties by subscribing to the service.
 * Fetches all interested parties' data and updates the component's partyList and interestedPartiesData properties.
 * Additionally, triggers change detection to reflect any changes in the UI.
 */
  loadAllinterestedParties(){
    return this.partyService.getAllInterestedParties().subscribe(data=>{
      this.partyList=data;
      this.interestedPartiesData = this.partyList._embedded.interested_party_dto_list
      log.info(this.partyList)

      this.cdr.detectChanges();
    })
  }
     /**
   * Creates the  Party form 
   * Sets branch_name and   name as required fields
   * It also initializes the search form group for user search queries
   */
  createPartyForm(){
    this.partyForm = this.fb.group({
      branch_name:['',Validators.required],
      date_of_birth:[''],
      email: [''],
      name: ['',Validators.required],
      organization_code:['2',{nonNullable:true}],
      polin_code: [''],
      postal_address: [''],
      postal_code: [''],
      remark: [''],
      type: ['IP',{nonNullable:true}],
      version: [0,{nonNullable:true}],
    })

    this.searchForm = this.fb.group({
      search:['']
    })
  }

    /**
 * Determines whether the provided item is currently selected, based on the comparison
 * with the 'selected' property of the component.
 */
  isActive(item:any){
    return this.selected === item;
  }

  /**
 * Loads details of a specific interested party based on the provided ID by subscribing to the service.
 * Retrieves the interested party's details and updates the component's selected property.
 * The partyForm is then populated with the retrieved data, and default values are set for certain fields.
 * Additionally, sets the new flag to false and triggers change detection for UI updates.
 * @param id The ID of the interested party for which details are to be loaded.
 */
  loadInterestedParties(id:any){
    return this.partyService.getInterestedParties(id).subscribe(res=>{
      this.selected = res;
      log.info(this.selected,"Test")
      this.partyForm.patchValue(this.selected)
      this.partyForm.controls['organization_code'].setValue(2);
      this.partyForm.controls['version'].setValue(0);
      this.partyForm.controls['type'].setValue('IP');
      //this.selected=item;
      this.new=false;
      this.cdr.detectChanges();
    });
  }
  /**
 * Sends a request to the service to create a new interested party using the data from the party form.
 * Subscribes to the response and handles success and error scenarios by displaying corresponding messages.
 */
  addParty(){
    this.partyService.createParty(this.partyForm.value).subscribe((data:{})=>{
      try{
        log.info(this.partyForm.value)
        this.messageService.add({severity:'success', summary: 'Success', detail: 'Saved'});
      }catch(error){
        log.info(this.partyForm.value)
        this.messageService.add({severity:'error', summary: 'Error', detail: 'Error, try again later'});

      }
    });
  }
  /**
 * Sends a request to the service to update the details of an interested party using the data from the party form.
 * Subscribes to the response and handles success and error scenarios by displaying corresponding messages.
 * Resets the party form after the operation.
 */
  updateParty(){
    log.info(this.selected, "TEST IT OUT")
    let id = this.selected.code
    this.partyService.updateParty(this.partyForm.value,id).subscribe((data)=>{
      try{
        this.partyForm.reset();
        log.info(this.partyForm.value)
        this.messageService.add({severity:'success', summary: 'Success', detail: 'Saved'});
      }catch(error){
        log.info(this.partyForm.value)
        this.messageService.add({severity:'error', summary: 'Error', detail: 'Error, try again later'});

      }
    })
    }
    /**
   * Handles the process of saving an interested party's details based on whether it's a new party or an update.
   * If it's a new party (new flag is true), calls the addParty method to create the party.
   * If it's an existing party (new flag is false), calls the updateParty method to update the party.
   */
    save(){
      if(this.new){
        log.info("Create interested parties")
         this.addParty();
      }else{
        log.info("update interested parties")
         this.updateParty();
      }
    }  
    // deleteParty(){
    //   if(this.selected==undefined){
    //     this.messageService.add({severity:'error', summary: 'Error', detail: 'Select a client to continue'});
    //   }else{
    //     this.partyService.deleteClient(this.partyDetails.code).subscribe(
    //       (res)=>{
    //         this.messageService.add({severity:'success', summary: 'Success', detail: 'Client deleted'});
    //       },
    //       (error:HttpErrorResponse) => {
    //        log.info(error);
    //         this.messageService.add({severity:'error', summary: 'Error', detail: 'You cannot delete this client'});
    //         this.partyForm.reset();
    //       }
    //     )
    //   }
    // } 
    /**
   * Resets the party form to its initial state and sets the 'new' flag to true.
   * This method is used when adding a new interested party to clear the form fields and indicate that a new party is being added.
   */
    newParty(){
      this.partyForm.reset()
      this.new = true; 
    }   

}
