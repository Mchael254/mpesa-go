import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactComponent } from './contact.component';
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {MessageService} from "primeng/api";
import {mockUtilService} from "../../../../../crm/components/country/country.component.spec";
import {of} from "rxjs";
import {FormBuilder, ReactiveFormsModule} from "@angular/forms";
import {ClientService} from "../../../../services/client/client.service";
import {BranchService} from "../../../../../../shared/services/setups/branch/branch.service";
import {AccountService} from "../../../../services/account/account.service";
import {UtilService} from "../../../../../../shared/services";
import {GlobalMessagingService} from "../../../../../../shared/services/messaging/global-messaging.service";
import {ClientTitlesDto} from "../../../../data/ClientDTO";

const clientTitles: ClientTitlesDto = {description: "", gender: "", id: 0, organizationId: 0, shortDescription: ""}

describe('ContactComponent', () => {
  let component: ContactComponent;
  let fixture: ComponentFixture<ContactComponent>;

  const mockUtilService = {
    currentLanguage: of('en')
  }

  const mockClientService = {
    getClientTitles: jest.fn().mockReturnValue(of([clientTitles])),
    updateClient: jest.fn().mockReturnValue(of({}))
  }

  const mockBranchService = {
    getAllBranches: jest.fn().mockReturnValue(of([])),
  }

  const mockAccountService = {
    getPreferredCommunicationChannels: jest.fn().mockReturnValue(of([])),
  }

  const mockGlobalMessagingService = {
    displayErrorMessage: jest.fn(),
    displaySuccessMessage: jest.fn(),
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ContactComponent],
      imports: [
        HttpClientTestingModule,
        ReactiveFormsModule,
      ],
      providers: [
        MessageService,
        FormBuilder,
        { provide: ClientService, useValue: mockClientService },
        { provide: BranchService, useValue: mockBranchService },
        { provide: AccountService, useValue: mockAccountService },
        { provide: UtilService, useValue: mockUtilService },
        { provide: GlobalMessagingService, useValue: mockGlobalMessagingService },
      ]
    });
    fixture = TestBed.createComponent(ContactComponent);
    component = fixture.componentInstance;

    component.contactDetails = {
      id: 4011,
      title: null,
      titleId: 52,
      receivedDocuments: null,
      emailAddress: "james@gmail.com",
      smsNumber: "+254712452252",
      phoneNumber: "+254753231543",
      accountId: 4206,
      socialMediaUrl: null,
      websiteUrl: null,
      contactChannel: "sms",
      whatsappNumber: null,
      createdDate: "2025-07-24T12:06:29.871+00:00",
      modifiedDate: "2025-07-24T12:14:26.323+00:00",
      createdBy: "philip@turnkeyafrica.com",
      modifiedBy: "philip@turnkeyafrica.com",
      faxNumber: null,
      emailVerified: null,
      phoneVerified: null
    };

    component.contactDetailsConfig =  {
      title: "contact",
      label: {
        en: "contact",
        fr: "french details",
        ke: "swahili details"
      },
      contact_details: {
        branch: {
          en: "branch",
          fr: "",
          ke: ""
        },
        title: {
          en: "title",
          fr: "",
          ke: ""
        },
        tel_number: {
          en: "telephone number",
          fr: "",
          ke: ""
        },
        email: {
          en: "email address",
          fr: "",
          ke: ""
        },
        sms_number: {
          en: "sms number",
          fr: "",
          ke: ""
        },
        preferred_contact_channel: {
          en: "preferred contact channel",
          fr: "",
          ke: ""
        }
      },
      order: 2
    };

    component.formFieldsConfig = {
      label: {
        en: "contact details",
        fr: "contact",
        ke: "mawasiliano"
      },
      fields: [
        {
          "sectionId": "contact",
          "fieldId": "branch",
          "type": "text",
          "label": {
            "en": "physical address",
            "ke": "Aina ya Mteja",
            "fr": "Type de Client"
          },
          "dynamicLabel": null,
          "defaultValue": null,
          "visible": true,
          "disabled": false,
          "validations": [],
          "conditions": [],
          "order": 4,
          "tooltip": {
            "en": "",
            "fr": "",
            "ke": ""
          },
          "placeholder": {
            "en": "",
            "fr": "",
            "ke": ""
          },
          "isMandatory": true,
          "options": []
        },
        {
          "sectionId": "contact",
          "fieldId": "title",
          "type": "select",
          "label": {
            "en": "branch",
            "ke": "Aina ya Mteja",
            "fr": "Type de Client"
          },
          "dynamicLabel": null,
          "defaultValue": null,
          "visible": true,
          "disabled": false,
          "validations": [],
          "conditions": [],
          "order": 4,
          "tooltip": {
            "en": "",
            "fr": "",
            "ke": ""
          },
          "placeholder": {
            "en": "branch",
            "fr": "",
            "ke": ""
          },
          "isMandatory": true,
          "options": []
        },
        {
          "sectionId": "contact",
          "fieldId": "contactChannel",
          "type": "select",
          "label": {
            "en": "branch",
            "ke": "Aina ya Mteja",
            "fr": "Type de Client"
          },
          "dynamicLabel": null,
          "defaultValue": null,
          "visible": true,
          "disabled": false,
          "validations": [],
          "conditions": [],
          "order": 4,
          "tooltip": {
            "en": "",
            "fr": "",
            "ke": ""
          },
          "placeholder": {
            "en": "branch",
            "fr": "",
            "ke": ""
          },
          "isMandatory": true,
          "options": []
        },
      ],
      "buttons": {
        "cancel": {
          "sectionId": "prime_identity",
          "fieldId": "cancel_button",
          "type": "button",
          "label": {
            "en": "cancel",
            "ke": "Aina ya Mteja",
            "fr": "Type de Client"
          }
        },
        "save": {
          "sectionId": "prime_identity",
          "fieldId": "cancel_button",
          "type": "button",
          "label": {
            "en": "save details",
            "ke": "Aina ya Mteja",
            "fr": "Type de Client"
          }
        }
      }
    }

    component.accountCode = 123;

    fixture.detectChanges();

  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });

  test('should initialize component and fetch data', () => {
    const titles: ClientTitlesDto[] = [{description: "", gender: "", id: 0, organizationId: 0, shortDescription: ""}];
    mockClientService.getClientTitles.mockReturnValue(of(titles));
    mockBranchService.getAllBranches.mockReturnValue(of([]));
    mockAccountService.getPreferredCommunicationChannels.mockReturnValue(of([]));

    fixture.detectChanges();

    expect(mockBranchService.getAllBranches).toHaveBeenCalled();
    expect(mockAccountService.getPreferredCommunicationChannels).toHaveBeenCalled();
  });

  test('should update contact details', () => {
    component.editForm = component['fb'].group({
      title: [1],
      smsNumber: [{ internationalNumber: '+234000000000' }],
      telNumber: [{ internationalNumber: '+234000000000' }],
      email: ['test@example.com'],
      conctactChannel: ['EMAIL']
    });

    mockClientService.updateClient.mockReturnValue(of({}));

    component.closeButton = {
      nativeElement: { click: jest.fn() }
    } as any;

    component.editContactDetails();

    expect(mockClientService.updateClient).toHaveBeenCalled();
    expect(component.closeButton.nativeElement.click).toHaveBeenCalled();
  })
});
