import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InterestedPartiesComponent } from './interested-parties.component';
import { InterestedPartiesService } from '../../../services/interested-parties/interested-parties.service';
import { MessageService } from 'primeng/api';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder, FormGroup } from '@angular/forms';
import {AppConfigService} from '../../../../../../../core/config/app-config-service'
import { of, throwError } from 'rxjs';

describe('InterestedPartiesComponent', () => {
  let component: InterestedPartiesComponent;
  let fixture: ComponentFixture<InterestedPartiesComponent>;
  let service: InterestedPartiesService;
  let messageService: MessageService;
  // beforeEach(() => {
  //   TestBed.configureTestingModule({
  //     declarations: [InterestedPartiesComponent]
  //   });
  //   fixture = TestBed.createComponent(InterestedPartiesComponent);
  //   component = fixture.componentInstance;
  //   fixture.detectChanges();
  // });
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InterestedPartiesComponent ],
      imports: [HttpClientTestingModule],
      providers: [FormBuilder,InterestedPartiesService,MessageService,
        {provide: AppConfigService, useValue: {config:{contextPath: { gis_services: 'gis/setups/api/v1' } }}}
      ],
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(InterestedPartiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    service = TestBed.inject(InterestedPartiesService);
    messageService = TestBed.inject(MessageService)
    component.partyForm = new FormGroup({});
    
    
    component.partyForm.patchValue({
     
    });
   
  });


  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should load all interested parties', () => {
    // Create a sample response data
    const responseData = {
      _embedded: {
        interested_party_dto_list: [
          // interested parties data
        ],
      },
    };
    expect(service).toBeDefined();
    // Create a spy on the partyService's getAllInterestedParties method
    jest.spyOn(service, 'getAllInterestedParties').mockReturnValue(of(responseData));
    // Call the method to be tested
    component.loadAllinterestedParties();

    // Expectations
    expect(service.getAllInterestedParties).toHaveBeenCalled();
    expect(component.partyList).toEqual(responseData);
    expect(component.interestedPartiesData).toEqual(responseData._embedded.interested_party_dto_list);
    // expect(console.log).toHaveBeenCalledWith(responseData);
    // Add additional expectations or assertions as needed
  });
  it('should load interested parties by id', () => {
    // Create a sample response data
    const responseData = {
      // response data object
    };

    // Create a spy on the partyService's getInterestedParties method
    jest.spyOn(service, 'getInterestedParties').mockReturnValue(of(responseData) as any);

    // Spy on console.log
    const consoleSpy = jest.spyOn(console, 'log');

    // Call the method to be tested
    const id = 'sampleId';
    component.loadInterestedParties(id);

    // Expectations
    expect(service.getInterestedParties).toHaveBeenCalledWith(id);
    expect(component.selected).toEqual(responseData);
    // expect(consoleSpy).toHaveBeenCalledWith(component.selected, 'Test');
    expect(component.partyForm.value).toEqual(responseData); // Assuming partyForm is an instance of FormGroup
    expect(component.new).toBe(true);
    // Add additional expectations or assertions as needed
  });
  it('should return true if the selected item matches the provided item', () => {
    // Set the selected item
    component.selected = 'Item 1' ;

    // Define an item that matches the selected item
    const item = 'Item 1' ;

    // Call the method and expect it to return true
    const result = component.isActive(item);
    expect(result).toBe(true);
  });
  it('should return false if the selected item does not match the provided item', () => {
    // Set the selected item
    component.selected = 'Item 1';

    // Define an item that does not match the selected item
    const item = 'Item 2';

    // Call the method and expect it to return false
    const result = component.isActive(item);
    expect(result).toBe(false);
  });
  it('should call createParty and add success message on success', () => {
    // messageService = {
    //   add: jest.fn()
    // } as any;
    const responseData = {};
    jest.spyOn(service, 'createParty').mockReturnValue(of(responseData) as any);
    const message = jest.spyOn(messageService, 'add')

    component.addParty();

    expect(service.createParty).toHaveBeenCalledWith(component.partyForm.value);
    expect(message).toHaveBeenCalledWith({
      severity: 'success',
      summary: 'Success',
      detail: 'Saved'
    });
    
  });

 
  it('should reset form and display success message on successful update', () => {
    // Mock the necessary data
    const id = 'test-id';
    const partyFormValue = { yourFormValue: 'test-value' };
    component.selected = { code: id };
    jest.spyOn(messageService, 'add');

    // Use setTimeout to allow form control initialization
    setTimeout(() => {
      component.partyForm.setValue(partyFormValue);
    });

    // Mock the service response
    const mockResponse = { /* your mocked response object */ };
    jest.spyOn(service, 'updateParty').mockReturnValue(of(mockResponse)as any);

    // Spy on the form reset method
    const resetSpy = jest.spyOn(component.partyForm, 'reset');

    // Call the method
    component.updateParty();

    // Verify that the necessary methods were called
    expect(resetSpy).toHaveBeenCalled();
    expect(messageService.add).toHaveBeenCalledWith({
      severity: 'success',
      summary: 'Success',
      detail: 'Saved',
    });
  });
  //   it('should reset form and display error message on update failure', () => {
  //   // Mock the necessary data
  //   const id = 'test-id';
  //   const partyFormValue = { yourFormValue: 'test-value' };
  //   component.selected = { code: id };
  //   component.partyForm.setValue(partyFormValue);
  //   jest.spyOn(messageService, 'add');


  //   // Mock the service response to throw an error
  //   service.updateParty.mockReturnValue(throwError('Test error'));

  //   // Call the method
  //   component.updateParty();

  //   // Verify that the necessary methods were called
  //   expect(component.partyForm.reset).toHaveBeenCalled();
  //   expect(messageService.add).toHaveBeenCalledWith({
  //     severity: 'error',
  //     summary: 'Error',
  //     detail: 'Error, try again later',
  //   });
  // });

});
