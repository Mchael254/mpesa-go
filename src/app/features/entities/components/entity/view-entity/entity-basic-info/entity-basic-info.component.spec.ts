import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EntityBasicInfoComponent } from './entity-basic-info.component';

import {TranslateModule} from "@ngx-translate/core";
import {PartyTypeDto} from "../../../../data/partyTypeDto";
import {AccountReqPartyId, IdentityModeDTO, ReqPartyById} from "../../../../data/entityDto";


describe('EntityBasicInfoComponent', () => {
  let component: EntityBasicInfoComponent;
  let fixture: ComponentFixture<EntityBasicInfoComponent>;

  beforeEach(() => {
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
    }

    const entityAccountIdDetails: AccountReqPartyId = {
      accountCode: 0,
      accountTypeId: 0,
      category: "",
      effectiveDateFrom: "",
      effectiveDateTo: "",
      id: 0,
      organizationGroupId: 0,
      organizationId: 0,
      partyId: 0,
      partyType: { partyTypeName: 'test-name' }
    }

    TestBed.configureTestingModule({
      declarations: [EntityBasicInfoComponent],
      imports: [TranslateModule.forRoot()],
      providers: []
    });
    fixture = TestBed.createComponent(EntityBasicInfoComponent);
    component = fixture.componentInstance;
    component.unAssignedPartyTypes = [partyTypeDto];
    component.entityPartyIdDetails = entityPartyIdDetails;
    component.entityAccountIdDetails = [entityAccountIdDetails];
    fixture.detectChanges();
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });

  test('should assign role', () => {
    const button = fixture.nativeElement.querySelector('#assign-role');
    button.click();
    fixture.detectChanges();
    // mock assertions
  });

  test('should select party type role', () => {
    const button = fixture.nativeElement.querySelector('#select-party-type-role');
    button.click();
    fixture.detectChanges();
    // mock assertions
  });

});
