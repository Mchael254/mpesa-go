import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EntityBasicInfoComponent } from './entity-basic-info.component';

import { TranslateModule } from '@ngx-translate/core';
import { PartyTypeDto } from '../../../../data/partyTypeDto';
import {
  AccountReqPartyId,
  IdentityModeDTO,
  ReqPartyById,
} from '../../../../data/entityDto';
import { MessageService } from 'primeng/api';
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {PartyAccountsDetails} from "../../../../data/accountDTO";
import {UtilService} from "../../../../../../shared/services";
import {StatusService} from "../../../../../../shared/services/system-definitions/status.service";
import {ClientService} from "../../../../services/client/client.service";
import {of, throwError} from "rxjs";
import {StatusDTO} from "../../../../../../shared/data/common/systemsDto";
import {ElementRef} from "@angular/core";

const partyTypeDto: PartyTypeDto = {
  id: 111,
  organizationId: 111,
  partyTypeLevel: 111,
  partyTypeName: 'test',
  partyTypeShtDesc: 'test',
  partyTypeVisible: 'test',
};

const entityPartyIdDetails: ReqPartyById = {
  categoryName: 'test',
  countryId: 111,
  dateOfBirth: 'test',
  effectiveDateFrom: '2022-06-17T11:06:50.369Z',
  effectiveDateTo: '2022-06-17T11:06:50.369Z',
  id: 111,
  modeOfIdentity: null,
  modeOfIdentityNumber: 'test',
  name: 'test',
  organizationId: 111,
  pinNumber: 'test',
  profilePicture: 'test',
  profileImage: 'test',
  identityNumber: 111,
};

const entityAccountIdDetails: AccountReqPartyId = {
  accountCode: 0,
  accountTypeId: 0,
  category: '',
  effectiveDateFrom: '',
  effectiveDateTo: '',
  id: 0,
  organizationGroupId: 0,
  organizationId: 0,
  partyId: 0,
  partyType: { partyTypeName: 'test-name' },
};

const mockStatuses : StatusDTO[] = [
  { name: 'Draft', value: 'DRAFT', actionLabel: 'draft' },
  { name: 'Active', value: 'ACTIVE', actionLabel: 'activate' },
  { name: "INACTIVE", value: "INACTIVE", actionLabel: "deactivate" },
  { name: "BLACKLISTED", value: "BLACKLISTED", actionLabel: "blacklist" },
  { name: "READY", value: "READY", actionLabel: "prepare" },
  { name: "SUSPENDED", value: "SUSPENDED", actionLabel: "suspend" }
]


const partyAccountDetails: PartyAccountsDetails = {
  status: 'A'
}

const mockOverviewConfig = {
  basic_info: {},
  applicable_status: {
    draft: ['active']
  }
};

describe('EntityBasicInfoComponent', () => {
  let component: EntityBasicInfoComponent;
  let fixture: ComponentFixture<EntityBasicInfoComponent>;

  const mockClientService = {
    updateClientSection: jest.fn().mockReturnValue(of(mockStatuses ))
  }

  const mockStatusService = {
    getClientStatus: jest.fn().mockReturnValue(of({}))
  }

  const mockUtilService = {
    currentLanguage: of('en')
  }

  const mockGlobalMessagingService = {
    displayErrorMessage: jest.fn(),
    displaySuccessMessage: jest.fn(),
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EntityBasicInfoComponent],
      imports: [
        TranslateModule.forRoot(),
        HttpClientTestingModule,
      ],
      providers: [
        MessageService,
        { provide: ClientService, useValue: mockClientService },
        { provide: UtilService, useValue: mockUtilService },
        { provide: StatusService, useValue: mockStatusService },
      ],
    });
    fixture = TestBed.createComponent(EntityBasicInfoComponent);
    component = fixture.componentInstance;
    component.unAssignedPartyTypes = [partyTypeDto];
    component.entityPartyIdDetails = entityPartyIdDetails;
    component.entityAccountIdDetails = [entityAccountIdDetails];
    component.partyAccountDetails = partyAccountDetails;
    component.overviewConfig = mockOverviewConfig;

    component.statusModalButton = {
      nativeElement: {
        click: jest.fn()
      }
    } as unknown as ElementRef;

    // Spy on filterApplicableStatuses
    jest.spyOn(component, 'filterApplicableStatuses');

    fixture.detectChanges();
  });


  test('should create', () => {
    expect(component).toBeTruthy();
  });

  test('should fetch and set client statuses', () => {
    mockStatusService.getClientStatus.mockReturnValue(of(mockStatuses));
    component.fetchClientStatuses();
    expect(mockStatusService.getClientStatus).toHaveBeenCalled();
  });

  test('should filter applicable statuses for Draft', () => {
    component.clientStatuses = mockStatuses;
    component.selectedClientStatus = mockStatuses[0]; // DRAFT
    component.filterApplicableStatuses();
    expect(component.actionableStatuses.length).toBe(1);
  });

  test('should filter applicable statuses for ..', () => {
    component.clientStatuses = mockStatuses;
    component.selectedClientStatus = mockStatuses[1];
    component.filterApplicableStatuses();
    expect(component.actionableStatuses.length).toBe(1);
  });

  test('should call updateClientSection on changeClientStatus', () => {
    const mockTextarea = { nativeElement: { value: 'Testing comment' } } as ElementRef;
    component.commentInput = mockTextarea;
    component.selectedClientStatus = mockStatuses[1]; // ACTIVE
    component.changeClientStatus();

    expect(mockClientService.updateClientSection).toHaveBeenCalled();
  });

  test('should emit assignRole', () => {
    const emitSpy = jest.spyOn(component.assignRole, 'emit');
    component.selectedRole = {};
    component.closebutton = { nativeElement: { click: jest.fn() } } as any;

    component.onAssignRole();

    expect(emitSpy).toHaveBeenCalledWith(component.selectedRole);
    expect(component.closebutton.nativeElement.click).toHaveBeenCalled();
  });

  test('should handle error in fetchClientStatuses', () => {
    mockStatusService.getClientStatus.mockReturnValue(throwError(() => new Error('Failed')));
    component.fetchClientStatuses();
    expect(mockStatusService.getClientStatus).toHaveBeenCalled();
  });


  test('should call filterApplicableStatuses and click the statusModalButton', () => {
    const mockSelect = document.createElement('select');
    mockSelect.value = 'someStatus';

    const event = {
      target: mockSelect
    } as unknown as Event;

    component.clientStatuses = mockStatuses;
    component.processSelectedStatus(event);

    expect(component.filterApplicableStatuses).toHaveBeenCalled();
  });

  test('should assign role', () => {
    const button = fixture.nativeElement.querySelector('#assign-role');
    button.click();
    fixture.detectChanges();
    // mock assertions
  });

  test('should select party type role', () => {
    const button = fixture.nativeElement.querySelector(
      '#select-party-type-role'
    );
    button.click();
    fixture.detectChanges();
    // mock assertions
  });

});
