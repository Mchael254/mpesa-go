import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ClientRemarksService } from '../../../services/client-remarks/client-remarks.service';

@Component({
  selector: 'app-client-remarks',
  templateUrl: './client-remarks.component.html',
  styleUrls: ['./client-remarks.component.css']
})

/**
 * Component responsible for managing client remarks and comments.
 * This component handles the creation, updating, and deletion of client remarks,
 * as well as loading lists of clients and agents for selection.
 */

export class ClientRemarksComponent {
  remarkList: any;
  clientList: any;
  agentList: any;
  remarkDetails: any;
  remarkForm: FormGroup;
  searchForm: FormGroup;
  editcRemarkForm: FormGroup;
  clientRemarksData: any;
  clientListData: any;
  agentListData: any;
  selected: any;
  client: any;
  agent: any;
  filterBy: any;

  new: boolean = true;
  dropdownOptions: { id: string, name: string }[] = [];
  selectedLabel: string;

  constructor(
    public fb: FormBuilder,
    public remarkService: ClientRemarksService,
    public cdr: ChangeDetectorRef,
    private messageService: MessageService
  ) { }

   /**
   * Initialize component by:
   * 1.Initialize the create Remark Form
   * 2. Load all Client Remarks, Clients and Agents
   * 3. Set the initial label when the page loads
   */
  ngOnInit(): void {
    this.createRemarkForm();
    this.loadAllclientRemarks();
    this.loadAllclients();
    this.loadAllAgents();
    this.selectedLabel = 'Client:';
  }

  /**
 * Loads all client remarks from the service and 
 * Update the remarkList property with fetched data.
 *  Triggers change detection to update the component view.
 */
  loadAllclientRemarks() {
    return this.remarkService.getAllClientRemarks().subscribe(data => {
      this.remarkList = data;
      this.clientRemarksData = this.remarkList._embedded.client_remark_dto_list;
      console.log(this.clientRemarksData,"Client Remarks");

      this.cdr.detectChanges();
    });
  }
     /**
   * Creates the  Party form 
   * Sets comment,status,commented_by,date_with_effect_from, 
   * date_with_effect_to as required fields
   * It also initializes the search form group for user search queries
   */
  createRemarkForm() {
    this.remarkForm = this.fb.group({
      comment: ['', Validators.required],
      comment_date: [''],
      status: ['', Validators.required],
      commented_by: ['', Validators.required],
      date_with_effect_from: ['', Validators.required],
      date_with_effect_to: ['', Validators.required],
      proposer_code: [''],
      agent_code: [''],
      policy_code: [''],
      claim_code: [''],
      organization_code: ['2', { nonNullable: true }],
      version: [0, { nonNullable: true }],
      commentType: ['']
    });

    this.searchForm = this.fb.group({
      serach: ['']
    });
  }
    /**
 * Determines whether the provided item is currently selected, 
 * based on the comparison with the 'selected' property of the component.
 */
  isActive(item: any) {
    return this.selected === item;
  }

  /**
 * Load client remarks by ID and populate the form for editing.
 * @param id The ID of the client remark to load.
 */
  loadClientRemarks(id: any) {
    return this.remarkService.getClientRemarks(id).subscribe(res => {
      this.selected = res;
      console.log(this.selected, "Test");
      this.remarkForm.patchValue(this.selected);

      this.new = false;
      this.cdr.detectChanges();
    });
  }

  /**
 * Adds a new client remark by submitting the form data to the remark service.
 * Displays a success message if the creation is successful, or an error message if not.
 */
  addRemark() {
    console.log(this.remarkForm.value);
    this.remarkService.createRemark(this.remarkForm.value).subscribe((data: {}) => {
      try {
        console.log(this.remarkForm.value);
        this.messageService.add({ severity: 'sucess', summary: 'Success', detail: 'Saved' });
      } catch (error) {
        console.log(this.remarkForm.value);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error try again later' });
      }
    });
  }
/**
 * Updates the selected client remark with the values from the form and communicates with the API.
 * This method sends a request to update the client remark based on the selected code, then
 * resets the form and displays success or error messages accordingly.
 */
  updateRemark() {
    console.log(this.selected, 'Test');
    let id = this.selected.code;
    this.remarkService.updateRemark(this.remarkForm.value, id).subscribe((data) => {
      try {
        this.remarkForm.reset();
        console.log(this.remarkForm.value);
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Saved' });
      } catch (error) {
        console.log(this.remarkForm.value);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error, try again later' });
      }
    });
  }
/**
 * Save method that handles the saving of client remarks.
 * If the 'new' flag is true, it indicates creating a new remark;
 * otherwise, it updates an existing remark.
 */
  save() {
    if (this.new) {
      console.log("Create Client Remarks");
      this.addRemark();
    } else {
      console.log("Update Client Remarks");
      this.updateRemark();
    }
  }

  /**
 * Deletes a selected client remark.
 * If no remark is selected, an error message is displayed.
 * displays success or error messages accordingly then the form is reset.
 */
  deleteRemark() {
    if (this.selected == undefined) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Select a Remark to continue' });
    } else {
      this.remarkService.deleteRemark(this.remarkDetails.code).subscribe(
        (res) => {
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Remark deleted' });
        },
        (error: HttpErrorResponse) => {
          console.log(error);
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'You cannot delete this Remark' });
          this.remarkForm.reset();
        }
      );
    }
  }

  /**
 * Resets the remark form and sets the component to the new remark mode.
 * This method clears the form fields and indicates that a new remark is being added.
 */
  newRemark() {
    this.remarkForm.reset();
    this.new = true;
  }

/**
 * Loads a list of all clients and populates the dropdownOptions
 * with client data for selection in the remark form.
 */
  loadAllclients() {
    return this.remarkService.getAllClients().subscribe(data => {
      this.clientList = data;
      this.clientListData = this.clientList.content.map(client => ({
        id: client.id,
        name: `${client.firstName} ${client.lastName}`
      }));
      console.log(this.clientListData, "List of clients");
  
      this.dropdownOptions = this.clientListData;
      this.cdr.detectChanges();
    });
  }
  
  /**
 * Loads client details by ID and updates the form with the retrieved data.
 * @param id The ID of the client for which details are to be loaded.
 */
  loadClientList(id: any) {
    return this.remarkService.getClient(id).subscribe(res => {
      this.client = res;
      console.log(this.client, "Test");
      this.remarkForm.patchValue(this.client);
  
      this.new = false;
      this.cdr.detectChanges();
    });
  }
/**
 * Loads a list of all agents from the service and populates the agent list data.
 * Also updates the dropdown options with agent data for selection.
 */
loadAllAgents() {
  return this.remarkService.getAllAgents().subscribe(data => {
    this.agentList = data;
    this.agentListData = this.agentList.content.map(agent => ({
      id: agent.id,
      name: agent.name
    }));
    this.dropdownOptions = this.agentListData;
    console.log(this.agentListData, "List of Agents");

    this.cdr.detectChanges();
  });
}

/**
 * Loads agent details by ID and updates the form with the agent information.
 * @param id The ID of the agent to load.
 */
loadAgentList(id: any) {
  return this.remarkService.getAgent(id).subscribe(res => {
    this.agent = res;
    console.log(this.agent, "Test");
    this.remarkForm.patchValue(this.agent);

    this.new = false;
    this.cdr.detectChanges();
  });
}

/**
 * Handles the change event when the comment type selection changes.
 * Depending on the selected comment type, loads corresponding data and updates the label.
 * @remarks
 */
  onCommentTypeChange() {
    const commentType = this.remarkForm.get('commentType').value;
    if (commentType === '1') {
      this.loadAllclients();
      this.selectedLabel = 'Client:';
    } else if (commentType === '2') {
      this.loadAllAgents();
      this.selectedLabel = 'Agent:';
    } else if (commentType === '3') {
      // Load policy options
      // ...
      this.selectedLabel = 'Policy Label:';
    } else if (commentType === '4') {
      // Load claim options
      // ...
      this.selectedLabel = 'Claim Label:';
    } else {
      this.dropdownOptions = [];
      this.selectedLabel = '';
    }
  }
}
