import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PolicyProductComponent } from './policy-product.component';
import { of, throwError } from 'rxjs';
import { ClientService } from '../../../../../entities/services/client/client.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { SharedModule } from '../../../../../../shared/shared.module';
import { FormBuilder, FormControl, FormGroup, FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { BrowserStorage } from "../../../../../../shared/services/storage";
import { APP_BASE_HREF } from '@angular/common';
import { GlobalMessagingService } from '../../../../../../shared/services/messaging/global-messaging.service';
import { MessageService } from 'primeng/api';
import { AppConfigService } from '../../../../../../core/config/app-config-service';
import { ClientDTO } from 'src/app/features/entities/data/ClientDTO';

export class mockClientService {
  getClients = jest.fn().mockReturnValue(of());
  getClientById = jest.fn().mockReturnValue(of());
}
export class MockBrowserStorage {

}
const mockClientData = {
  content: [{
    branchCode: 1,
    category: 'Individual',
    clientTitle: 'Mr.',
    clientType: {
      category: 'Person',
      clientTypeName: 'Regular',
      code: 1,
      description: 'Regular Client',
      organizationId: 1,
      person: 'Natural Person',
      type: 'Individual',
    },
    country: 2,
    createdBy: 'admin',
    dateOfBirth: '1990-01-01',
    emailAddress: 'john.doe@example.com',
    firstName: 'John',
    gender: 'Male',
    id: 123,
    idNumber: '1234567890',
    lastName: 'Doe',
    modeOfIdentity: 'ID Card',
    occupation: {
      id: 1,
      name: 'Engineer',
      sector_id: 3,
      short_description: 'Engineering',
    },
    passportNumber: 'AB123456',
    phoneNumber: '555-1234',
    physicalAddress: '123 Main St',
    pinNumber: '9876',
    shortDescription: 'Client 1',
    status: 'Active',
    withEffectFromDate: '2022-01-01',
    clientTypeName: 'Type A',
    clientFullName: 'Mr. John Doe',
  }],
};


describe('PolicyProductComponent', () => {
  let component: PolicyProductComponent;
  let fixture: ComponentFixture<PolicyProductComponent>;
  let clientService: ClientService;
  let globalMessagingService: GlobalMessagingService;



  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PolicyProductComponent],
      imports: [HttpClientTestingModule, SharedModule, FormsModule, RouterTestingModule],
      providers:[
        { provide: clientService, useClass: mockClientService },
        { provide: BrowserStorage, useClass: MockBrowserStorage },
        { provide: APP_BASE_HREF, useValue: '/' },
        GlobalMessagingService, MessageService,
        FormBuilder,
        { provide: AppConfigService, useValue: { config: { contextPath: { gis_services: 'gis/setups/api/v1' } } } }

      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PolicyProductComponent);
    component = fixture.componentInstance;
    globalMessagingService = TestBed.inject(GlobalMessagingService);
    clientService = TestBed.inject(ClientService);
    component.policyProductForm = new FormGroup({});
    component.fb = TestBed.inject(FormBuilder);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should load all clients successfully', () => {
    const mockClientData = { content: [/* your mock client data */] };
    jest.spyOn(clientService, 'getClients').mockReturnValue(of(mockClientData) as any);

    jest.spyOn(globalMessagingService, 'displayErrorMessage');

    component.loadAllClients();

    expect(clientService.getClients).toHaveBeenCalledWith(0, 100);
    expect(component.clientList).toEqual(mockClientData);
    expect(component.clientData).toEqual(mockClientData.content);
    expect(globalMessagingService.displayErrorMessage).not.toHaveBeenCalled();
  });
  it('should handle error when loading clients', () => {
    const errorMessage = 'Mock error message';

    jest.spyOn(clientService, 'getClients').mockReturnValue(throwError(errorMessage));
    jest.spyOn(globalMessagingService, 'displayErrorMessage');


    component.loadAllClients();

    expect(jest.spyOn(clientService, 'getClients')).toHaveBeenCalledWith(0, 100);
    expect(jest.spyOn(globalMessagingService, 'displayErrorMessage')).toHaveBeenCalledWith('Error', component.errorMessage);
  });
});
