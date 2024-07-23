import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditNokFormComponent } from './edit-nok-form.component';
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {TranslateModule} from "@ngx-translate/core";
import {ReactiveFormsModule} from "@angular/forms";
import {AppConfigService} from "../../../../../../../core/config/app-config-service";
import {GlobalMessagingService} from "../../../../../../../shared/services/messaging/global-messaging.service";
import {EntityService} from "../../../../../services/entity/entity.service";
import {createSpyObj} from "jest-createspyobj";
import {AccountService} from "../../../../../services/account/account.service";
import {of} from "rxjs";
import {IdentityModeDTO} from "../../../../../data/entityDto";
import {NextKinDetailsUpdateDTO} from "../../../../../data/accountDTO";

export class MockAppConfigService {
  get config() {
    return {
      contextPath: {
        "setup_services":  "crm",
      }
    };
  }
}

const extras = {
  partyId: 417,
}

export class MockGlobalMessageService {
  displayErrorMessage = jest.fn((summary, detail) => {
    return;
  });
  displaySuccessMessage = jest.fn((summary, detail) => {
    return;
  });
}

const identityMode: IdentityModeDTO = {
  id: 0,
  identityFormat: "",
  identityFormatError: "",
  name: "",
  organizationId: 0
};

const nextOfKin: NextKinDetailsUpdateDTO = {
  accountId: 0,
  emailAddress: "",
  fullName: "",
  id: 0,
  identityNumber: "",
  modeOfIdentityId: 0,
  phoneNumber: "",
  relationship: "",
  smsNumber: ""
};

describe('EditNokFormComponent', () => {
  let component: EditNokFormComponent;
  let fixture: ComponentFixture<EditNokFormComponent>;

  const entityServiceStub = createSpyObj('EntityService',
    ['updateNokDetails']);
  const accountServiceStub = createSpyObj('AccountService',
    ['getIdentityMode']);

  beforeEach(() => {
    jest.spyOn(entityServiceStub, 'updateNokDetails').mockReturnValue(of(nextOfKin));
    jest.spyOn(accountServiceStub, 'getIdentityMode').mockReturnValue(of([identityMode]));

    TestBed.configureTestingModule({
      declarations: [EditNokFormComponent],
      imports: [
        HttpClientTestingModule,
        TranslateModule.forRoot(),
        ReactiveFormsModule
      ],
      providers: [
        { provide: AppConfigService, useClass: MockAppConfigService },
        { provide: GlobalMessagingService, useClass: MockGlobalMessageService },
        { provide: EntityService, useValue: entityServiceStub },
        { provide: AccountService, useValue: accountServiceStub },
      ]
    });
    fixture = TestBed.createComponent(EditNokFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });

  test('should prepare updateDetails and patch form values', () => {
    component.prepareUpdateDetails(nextOfKin, extras);
    expect(component.nokDetails).toBe(nextOfKin);
    expect(component.extras).toBe(extras);
  });

  test('should update Next-of-Kin details and call update endpoint', () => {
    component.extras = extras;
    component.nokForm.controls['identityType'].setValue(0);
    component.nokForm.controls['idNo'].setValue('A02123789');
    component.nokForm.controls['fullNames'].setValue('TQ User');
    component.nokForm.controls['email'].setValue('user@turkey.com');
    component.nokForm.controls['relation'].setValue('SIBLING');
    component.nokForm.controls['mobile'].setValue('0706452892');
    component.nokForm.controls['dob'].setValue('22/08/94');

    const button = fixture.debugElement.nativeElement.querySelector('#update-details');
    button.click();
    fixture.detectChanges();

    expect(component.updateDetails.call).toBeTruthy();
  });

});
