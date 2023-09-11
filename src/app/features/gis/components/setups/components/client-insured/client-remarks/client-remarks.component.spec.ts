import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientRemarksComponent } from './client-remarks.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppConfigService } from '../../../../../../../core/config/app-config-service';

import { FormBuilder, FormGroup } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ClientRemarksService } from '../../../services/client-remarks/client-remarks.service';
import { BrowserStorage } from '../../../../../../../shared/services/storage/browser-storage';
import {TicketsService} from "../../../../../../../../app/features/administration/services/tickets.service"
import { of, throwError } from 'rxjs';
import { ClientRemarks } from '../../../data/gisDTO';
import { HttpErrorResponse } from '@angular/common/http';

// const mockClientRemarksService: any = {
//   getAllClientRemarks: jest.fn(),
//   getClientRemarks:jest.fn(),
//     createRemark:jest.fn(),
//     updateRemark:jest.fn(),
//     deleteRemark:jest.fn(),
//     getClient:jest.fn(),
//     getAllAgents:jest.fn(),
//     getAgent:jest.fn()
//   };
export class mockClientRemarksService{
  getAllClientRemarks=jest.fn().mockReturnValue(of());
  getAllClients=jest.fn().mockReturnValue(of());
  getClientRemarks=jest.fn().mockReturnValue(of());
  createRemark=jest.fn().mockReturnValue(of());
  updateRemark=jest.fn().mockReturnValue(of());
  deleteRemark=jest.fn().mockReturnValue(of());
  getClient=jest.fn().mockReturnValue(of());
  getAllAgents=jest.fn().mockReturnValue(of());
  getAgent=jest.fn().mockReturnValue(of());

}
export class mockTicketService{
  getAllClaims=jest.fn().mockReturnValue(of());
}

describe('ClientRemarksComponent', () => {
  let component: ClientRemarksComponent;
  let fixture: ComponentFixture<ClientRemarksComponent>;
  let service: ClientRemarksService;
  let ticketService:TicketsService
  let messageService: MessageService;
 
    beforeEach(async () => {
      await TestBed.configureTestingModule({
        declarations: [ ClientRemarksComponent ],
        imports: [HttpClientTestingModule],
        providers: [
          { provide: ClientRemarksService,useClass:mockClientRemarksService},  
          { provide: TicketsService,useClass:mockTicketService },   
          { provide: MessageService }, 
          FormBuilder
          // {provide: AppConfigService, useValue: {config:{contextPath: { gis_services: 'gis/setups/api/v1' } }}}
  
        ],
      })
      .compileComponents();

    fixture = TestBed.createComponent(ClientRemarksComponent);
    component = fixture.componentInstance;
    service = TestBed.inject(ClientRemarksService);
    messageService = TestBed.inject(MessageService);
    ticketService=TestBed.inject(TicketsService);
    component.remarkForm = new FormGroup({});
    component.fb = TestBed.inject(FormBuilder);

    fixture.detectChanges();

});

  it('should create', () => {
    expect(component).toBeTruthy();
  });
 
  // it('should load client remarks data', () => {
  //   // Simulate a response with some mock data
  //   const mockData = ['mockRemark1', 'mockRemark2'];
  //   jest.spyOn(service,'getAllClientRemarks').mockReturnValue(of(mockData)as any);

  //   component.loadAllclientRemarks();

  //   // Expect that getAllClientRemarks is called
  //   expect(service.getAllClientRemarks).toHaveBeenCalled();

  //   // After loading data, the clientRemarksData should be set to the mock data
  //   expect(component.clientRemarksData).toEqual(mockData);
  // });
  it('should load client remarks', () => {
    const mockData = { _embedded: { client_remark_dto_list: [/* your mock data here */] } };
    
    // Mock the service method to return the mock data
    jest.spyOn(service, 'getAllClientRemarks').mockReturnValue(of(mockData));

    // Call the method
    component.loadAllclientRemarks();

    // Perform assertions to check if the component properties and methods behave as expected after loading the data
    expect(component.remarkList).toEqual(mockData);
    expect(component.clientRemarksData).toEqual(mockData._embedded.client_remark_dto_list);
    // Add more assertions as needed
  });
  it('should load client remarks', () => {
    const mockId = 123; // Replace with the ID you want to test with
    const mockData = { /* your mock data here */ };
    
    // Mock the service method to return the mock data
    jest.spyOn(service, 'getClientRemarks').mockReturnValue(of(mockData)as any);

    // Call the method with the mock ID
    component.loadClientRemarks(mockId);

    // Perform assertions to check if the component properties and methods behave as expected after loading the data
    expect(component.selected).toEqual(mockData);
    expect(component.new).toBe(false);
    // Add more assertions as needed
  });
  it('should add a remark successfully', () => {
    const mockFormData = {
      comment: '', // Removed comment text
      comment_date: '2023-09-08',
      status: 'Pending',
      commented_by: 'John Doe',
      date_with_effect_from: '2023-09-08',
      date_with_effect_to: '2023-09-15',
      proposer_code: 123,
      agent_code: 456,
      policy_code: 'POL123',
      claim_code: 'CLM456',
      organization_code: 789,
      version: 1,
      commentType: 'General', 
    }as any;    
    jest.spyOn(messageService, 'add');

    // Mock the service method to return a successful response
    jest.spyOn(service, 'createRemark').mockReturnValue(of({})as any);

    // Call the method with the mock form data
    component.remarkForm.setValue(mockFormData); // Set form data
    component.addRemark();

    // Expect that the createRemark method was called with the form data
    expect(service.createRemark).toHaveBeenCalledWith(mockFormData);

    // Expect that the message service was called with a success message
    // expect(messageService.add).toHaveBeenCalledWith({
    //   severity: 'success',
    //   summary: 'Success',
    //   detail: 'Saved',
    // });
  });
  it('should handle an error when adding a remark', () => {
    const mockFormData = {
      comment: '', // Removed comment text
      comment_date: '2023-09-08',
      status: 'Pending',
      commented_by: 'John Doe',
      date_with_effect_from: '2023-09-08',
      date_with_effect_to: '2023-09-15',
      proposer_code: 123,
      agent_code: 456,
      policy_code: 'POL123',
      claim_code: 'CLM456',
      organization_code: 789,
      version: 1,
      commentType: 'General', 
    }as any;    
    jest.spyOn(messageService, 'add');
  
    // Mock the service method to return an error response
    jest.spyOn(service, 'createRemark').mockReturnValue(throwError('Error'));

    // Call the method with the mock form data
    component.remarkForm.setValue(mockFormData); // Set form data
    component.addRemark();

    // Expect that the createRemark method was called with the form data
    expect(service.createRemark).toHaveBeenCalledWith(mockFormData);

    // Expect that the message service was called with an error message
    // expect(messageService.add).toHaveBeenCalledWith({
    //   severity: 'error',
    //   summary: 'Error',
    //   detail: 'Error try again later',
    // });
  });
  
  it('should update a remark successfully', () => {
    const mockFormData = {
      comment: null,
      comment_date: null,
      status: null,
      commented_by: null,
      date_with_effect_from: null,
      date_with_effect_to: null,
      proposer_code:null ,
      agent_code: null,
      policy_code: null,
      claim_code: null,
      organization_code: '2',
      version: 0,
      commentType: null,
    }as any;     
    const mockId = 1; // Replace with the desired ID
    
    // Mock the service method to return a successful response
    jest.spyOn(service, 'updateRemark').mockReturnValue(of({})as any);

    // Set the selected object with a code property
    component.selected = { code: mockId };

    // Call the method with the mock form data
    component.remarkForm.setValue(mockFormData); // Set form data
    component.updateRemark();

    // Expect that the updateRemark method was called with the form data and ID
    expect(service.updateRemark).toHaveBeenCalledWith(mockFormData, mockId);

    // Expect that the remarkForm was reset
    expect(component.remarkForm.value).toEqual(mockFormData);

    // Expect that the message service was called with a success message
    // expect(messageService.add).toHaveBeenCalledWith({
    //   severity: 'success',
    //   summary: 'Success',
    //   detail: 'Saved',
    // });
  });
  it('should handle an error when updating a remark', () => {
    const mockFormData = { 
      comment: null,
      comment_date: null,
      status: null,
      commented_by: null,
      date_with_effect_from: null,
      date_with_effect_to: null,
      proposer_code:null ,
      agent_code: null,
      policy_code: null,
      claim_code: null,
      organization_code: '2',
      version: 0,
      commentType: null,
     }as any;
    const mockId = 1; // Replace with the desired ID
    
    // Mock the service method to return an error response
    jest.spyOn(service, 'updateRemark').mockReturnValue(throwError('Error'));

    // Set the selected object with a code property
    component.selected = { code: mockId };

    // Call the method with the mock form data
    component.remarkForm.setValue(mockFormData); // Set form data
    component.updateRemark();

    // Expect that the updateRemark method was called with the form data and ID
    expect(service.updateRemark).toHaveBeenCalledWith(mockFormData, mockId);

    // Expect that the message service was called with an error message
    // expect(messageService.add).toHaveBeenCalledWith({
    //   severity: 'error',
    //   summary: 'Error',
    //   detail: 'Error, try again later',
    // });
  });
  it('should show an error message when selected is undefined', () => {
    // Call the method with selected as undefined
    component.selected = undefined;
    component.deleteRemark();
    jest.spyOn(messageService, 'add');

    // Expect that a error message is displayed
    // expect(messageService.add).toHaveBeenCalledWith({
    //   severity: 'error',
    //   summary: 'Error',
    //   detail: 'Select a Remark to continue',
    // });
  });
  
  // it('should delete a remark successfully', () => {
  //   const mockRemarkCode = 0; 
  
  //   // Mock the service method to return a successful response
  //   jest.spyOn(service, 'deleteRemark').mockReturnValue(of({})as any);
  
  //   // Set the remarkDetails with a code property
  //   component.remarkDetails = { code: mockRemarkCode };
  
  //   //debugging log to check the value of mockRemarkCode
  //   console.log('mockRemarkCode:', mockRemarkCode);
  
  //   // Call the method
  //   component.deleteRemark();
  
  //   // Expect that the deleteRemark method was called with the remark code
  //   expect(service.deleteRemark).toHaveBeenCalledWith(mockRemarkCode);
  
  //   // Expect that a success message is displayed
  //   expect(messageService.add).toHaveBeenCalledWith({
  //     severity: 'success',
  //     summary: 'Success',
  //     detail: 'Remark deleted',
  //   });
  // });
  
  // it('should handle an error when deleting a remark', () => {
  //   const mockRemarkCode = 1; 
    
  //   // Mock the service method to return an error response
  //   jest.spyOn(service, 'deleteRemark').mockReturnValue(throwError(new HttpErrorResponse({ status: 403 })));

  //   // Set the remarkDetails with a code property
  //   component.remarkDetails = { code: mockRemarkCode };

  //   // Call the method
  //   component.deleteRemark();

  //   // Expect that the deleteRemark method was called with the remark code
  //   expect(service.deleteRemark).toHaveBeenCalledWith(mockRemarkCode);

  //   // Expect that an error message is displayed
  //   expect(messageService.add).toHaveBeenCalledWith({
  //     severity: 'error',
  //     summary: 'Error',
  //     detail: 'You cannot delete this Remark',
  //   });

  //   // Expect that the remarkForm is reset
  //   expect(component.remarkForm.value).toEqual({});
  // });
  
  it('should reset the remarkForm and set new to true', () => {
    // Create a form group and set it as the remarkForm
    const initialFormData = {
      // Initialize form controls with some initial values
      comment: null,
      // Add other form controls and initial values here
    };
    const initialFormGroup: FormGroup = component.fb.group(initialFormData);
    component.remarkForm = initialFormGroup;

    // Call the method
    component.newRemark();

    // Expect that the remarkForm is reset to its initial state
    expect(component.remarkForm.value).toEqual(initialFormData);

    // Expect that the 'new' property is set to true
    expect(component.new).toBe(true);
  });
  it('should load clients successfully', () => {
    const mockClientData = [
      // Replace with your mock client data as needed
      { id: 1, firstName: 'John', lastName: 'Doe' },
      { id: 2, firstName: 'Jane', lastName: 'Smith' },
    ];

    // Mock the service method to return the mock client data
    jest.spyOn(service, 'getAllClients').mockReturnValue(of({ content: mockClientData }));

    // Call the method
    component.loadAllclients();

    // Use 'fixture.detectChanges()' to trigger change detection if needed
    fixture.detectChanges();

    // Expect that the clientListData property is populated correctly
    expect(component.clientListData).toEqual([
      { id: 1, name: 'John Doe' },
      { id: 2, name: 'Jane Smith' },
    ]);

    // Expect that the dropdownOptions property is also populated correctly
    expect(component.dropdownOptions).toEqual([
      { id: 1, name: 'John Doe' }as any,
      { id: 2, name: 'Jane Smith' }as any,
    ]);
  });
  
  it('should load a client by ID successfully', () => {
    const mockClientId = 1; 
    const mockClientData = {
      id: mockClientId,
      firstName: 'John',
      lastName: 'Doe',
      
    };

    // Mock the service method to return the mock client data
    jest.spyOn(service, 'getClient').mockReturnValue(of(mockClientData)as any);

    // Call the method with the mock client ID
    component.loadClientList(mockClientId);

    // Use 'fixture.detectChanges()' to trigger change detection if needed
    fixture.detectChanges();

    // Expect that the 'client' property is populated correctly
    expect(component.client).toEqual(mockClientData);

    // Expect that the 'remarkForm' is populated correctly with client data
    // expect(component.remarkForm.value).toEqual(mockClientData);

    // Expect that 'new' is set to false
    expect(component.new).toBe(false);
  });
  
  it('should load agents successfully', () => {
    const mockAgentData = [
      // Replace with your mock agent data as needed
      { id: 1, name: 'Agent 1' },
      { id: 2, name: 'Agent 2' },
    ];

    // Mock the service method to return the mock agent data
    jest.spyOn(service, 'getAllAgents').mockReturnValue(of({ content: mockAgentData }));

    // Call the method
    component.loadAllAgents();

    // Use 'fixture.detectChanges()' to trigger change detection if needed
    fixture.detectChanges();

    // Expect that the agentListData property is populated correctly
    expect(component.agentListData).toEqual([
      { id: 1, name: 'Agent 1' },
      { id: 2, name: 'Agent 2' },
    ]);

    // Expect that the dropdownOptions property is also populated correctly
    expect(component.dropdownOptions).toEqual([
      { id: 1, name: 'Agent 1' }as any,
      { id: 2, name: 'Agent 2' }as any,
    ]);
  });
  it('should load claims by ID successfully', () => {
    const mockClaimData = [
      // Replace with your mock claim data as needed
      { claim_no: 'CLM001' },
      { claim_no: 'CLM002' },
    ];

    // Mock the service method to return the mock claim data
    jest.spyOn(ticketService, 'getAllClaims').mockReturnValue(of({ content: mockClaimData }as any));

    // Call the method
    component.loadAllClaims();

    // Use 'fixture.detectChanges()' to trigger change detection if needed
    fixture.detectChanges();

    // Expect that the claimListData property is populated correctly
    expect(component.claimListData).toEqual([
      { claim_no: 'CLM001', name: 'CLM001' },
      { claim_no: 'CLM002', name: 'CLM002' },
    ]);

    // Expect that the dropdownOptions property is also populated correctly
    expect(component.dropdownOptions).toEqual([
      { claim_no: 'CLM001', name: 'CLM001' }as any,
      { claim_no: 'CLM002', name: 'CLM002' }as any,
    ]);
  });
  
  it('should load an agent successfully', () => {
    const mockAgentId = 1; // Replace with the desired agent ID
    const mockAgentData = {
      // Replace with your mock agent data as needed
      id: mockAgentId,
      name: 'Agent 1',
      // Other properties as needed
    };

    // Mock the service method to return the mock agent data
    jest.spyOn(service, 'getAgent').mockReturnValue(of(mockAgentData)as any);

    // Call the method with the mock agent ID
    component.loadAgentList(mockAgentId);

    // Use 'fixture.detectChanges()' to trigger change detection if needed
    fixture.detectChanges();

    // Expect that the 'agent' property is populated correctly
    expect(component.agent).toEqual(mockAgentData);

    // Expect that the 'remarkForm' is populated correctly with agent data
    // expect(component.remarkForm.value).toEqual(mockAgentData);

    // Expect that 'new' is set to false
    expect(component.new).toBe(false);
  });
  
  it('should load clients and set selectedLabel when commentType is "1"', () => {
    // Create a form group with commentType set to '1'
    const mockFormData = {
      commentType: '1',
      // Other form controls as needed
    };
    const mockFormGroup: FormGroup = component.fb.group(mockFormData);
    component.remarkForm = mockFormGroup;

    // Spy on the loadAllclients method using Jest's spyOn
    const loadAllclientsSpy = jest.spyOn(component, 'loadAllclients');

    // Mock the service method to return data (e.g., mock clients)
    jest.spyOn(service, 'getAllClients').mockReturnValue(of(/* Mock client data */));

    // Call the method
    component.onCommentTypeChange();

    // Expect that loadAllclients was called
    expect(loadAllclientsSpy).toHaveBeenCalled();

    // Expect that selectedLabel is set to 'Client:'
    expect(component.selectedLabel).toBe('Client:');
  });
  it('should handle other cases when commentType is not recognized', () => {
    // Create a form group with an unrecognized commentType value
    const mockFormData = {
      commentType: '5', // Unrecognized value
      // Other form controls as needed
    };
    const mockFormGroup: FormGroup = component.fb.group(mockFormData);
    component.remarkForm = mockFormGroup;

    // Call the method
    component.onCommentTypeChange();

    // Expect that dropdownOptions is cleared
    expect(component.dropdownOptions).toEqual([]);

    // Expect that selectedLabel is cleared
    expect(component.selectedLabel).toBe('');
  });
  
});

