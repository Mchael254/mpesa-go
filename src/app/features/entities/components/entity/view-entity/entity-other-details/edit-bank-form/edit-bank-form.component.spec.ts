import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditBankFormComponent } from './edit-bank-form.component';
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {AppConfigService} from "../../../../../../../core/config/app-config-service";
import {GlobalMessagingService} from "../../../../../../../shared/services/messaging/global-messaging.service";
import {TranslateModule} from "@ngx-translate/core";
import {Bank} from "../../../../../data/BankDto";
import {ReactiveFormsModule} from "@angular/forms";
import {createSpyObj} from "jest-createspyobj";
import {of} from "rxjs";
import {BankService} from "../../../../../../../shared/services/setups/bank/bank.service";
import {BankBranchDTO} from "../../../../../../../shared/data/common/bank-dto";
import {EntityService} from "../../../../../services/entity/entity.service";

export class MockAppConfigService {
  get config() {
    return {
      contextPath: {
        "setup_services":  "crm",
      }
    };
  }
}

export class MockGlobalMessageService {
  displayErrorMessage = jest.fn((summary, detail) => {
    return;
  });
  displaySuccessMessage = jest.fn((summary, detail) => {
    return;
  });
}

const bank: Bank = {
  bankId: 1,
  bankName: "",
  branchCode: 0,
  branchName: "",
  contactPersonEmail: "",
  contactPersonName: "",
  contactPersonPhone: "",
  countryCode: 0,
  countryName: "",
  createdBy: "",
  createdDate: "",
  directDebitSupported: "",
  eftSupported: "",
  email: "",
  id: 0,
  name: "",
  physicalAddress: "",
  postalAddress: "",
  referenceCode: "",
  short_description: "",
  townCode: 0,
  townName: ""
};

const bankBranch: BankBranchDTO = {
  bankId: 1,
  bankName: "",
  branchCode: 0,
  branchName: "",
  contactPersonEmail: "",
  contactPersonName: "",
  contactPersonPhone: "",
  countryCode: 0,
  countryName: "",
  createdBy: "",
  createdDate: "",
  directDebitSupported: "",
  eftSupported: "",
  email: "",
  id: 0,
  name: "",
  physicalAddress: "",
  postalAddress: "",
  referenceCode: "",
  short_description: "",
  townCode: 0,
  townName: ""
};

const extras = {
  partyId: 417,
}

describe('EditBankFormComponent', () => {
  let component: EditBankFormComponent;
  let fixture: ComponentFixture<EditBankFormComponent>;
  let appConfigService: AppConfigService;

  const bankServiceStub = createSpyObj('BankService',
    ['getBanks', 'getBankBranchById']);
  const entityServiceStub = createSpyObj('EntityService',
    ['updateBankDetails']);

  beforeEach(() => {
    jest.spyOn(bankServiceStub, 'getBanks').mockReturnValue(of([bank]));
    jest.spyOn(bankServiceStub, 'getBankBranchById').mockReturnValue(of([bankBranch]));
    jest.spyOn(entityServiceStub, 'updateBankDetails').mockReturnValue(of([bank]));

    TestBed.configureTestingModule({
      declarations: [EditBankFormComponent],
      imports: [
        HttpClientTestingModule,
        TranslateModule.forRoot(),
        ReactiveFormsModule,
      ],
      providers: [
        { provide: AppConfigService, useClass: MockAppConfigService },
        { provide: GlobalMessagingService, useClass: MockGlobalMessageService },
        { provide: BankService, useValue: bankServiceStub },
        { provide: EntityService, useValue: entityServiceStub },
      ]
    });
    fixture = TestBed.createComponent(EditBankFormComponent);
    component = fixture.componentInstance;
    appConfigService = TestBed.inject(AppConfigService);
    fixture.detectChanges();
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });

  test('should prepare updateDetails and patch form values', () => {
    component.prepareUpdateDetails(bank, extras);
    expect(component.fetchBanks.call).toBeTruthy();
    expect(component.fetchBranches.call).toBeTruthy();
    expect(component.shouldShowEditForm).toBe(true);
  });

  test('should update branches when a bank is selected', () => {
    // todo:
  });

  test('should update Bank details and save to database', () => {
    component.extras = extras;
    component.bankForm.controls['bank'].setValue(1);
    component.bankForm.controls['accountNo'].setValue(12390756);
    component.bankForm.controls['accountType'].setValue('Savings');
    component.bankForm.controls['branch'].setValue('Head Office');
    component.bankForm.controls['paymentMethod'].setValue('Cash');

    const button = fixture.debugElement.nativeElement.querySelector('#update-details');
    button.click();
    fixture.detectChanges();

    expect(component.updateDetails.call).toBeTruthy();
  });
});
