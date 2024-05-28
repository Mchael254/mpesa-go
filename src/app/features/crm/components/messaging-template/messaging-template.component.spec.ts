import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MessagingTemplateComponent } from './messaging-template.component';
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {TranslateModule} from "@ngx-translate/core";
import {ReactiveFormsModule} from "@angular/forms";
import {createSpyObj} from "jest-createspyobj";
import {MessagingService} from "../../services/messaging.service";
import {GlobalMessagingService} from "../../../../shared/services/messaging/global-messaging.service";
import {SystemsService} from "../../../../shared/services/setups/systems/systems.service";
import {SystemModule, SystemsDto} from "../../../../shared/data/common/systemsDto";
import {of} from "rxjs";
import {CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA} from "@angular/core";
import {MessageTemplate} from "../../data/messaging-template";


const systems: SystemsDto[] = [{id: 0, shortDesc: "", systemName: ""}];
const systemModules: SystemModule[] = [{description: "", id: 0, shortDescription: "", systemId: 0, systemName: ""}];
const messageTemplates: MessageTemplate[] = [{
  content: "",
  id: 0,
  imageAttachment: "",
  imageUrl: "",
  name: "",
  productCode: 0,
  productName: "",
  status: "",
  subject: "",
  systemCode: 0,
  systemModule: "",
  templateType: ""
}];

export class MockMessageService {
  displayErrorMessage = jest.fn((summary,detail ) => {return});
  displaySuccessMessage = jest.fn((summary, detail) => { return });
  clearMessages = jest.fn();
}

describe('MessagingTemplateComponent', () => {
  let component: MessagingTemplateComponent;
  let fixture: ComponentFixture<MessagingTemplateComponent>;

  const messagingServiceStub = createSpyObj('MessagingService', [
    'saveMessageTemplate', 'getMessageTemplates'
  ]);

  const systemsServiceStub = createSpyObj(
    'SystemsService', ['getSystems', 'getSystemModules']);

  beforeEach(() => {
    jest.spyOn(systemsServiceStub, 'getSystems').mockReturnValue(of(systems));
    jest.spyOn(systemsServiceStub, 'getSystemModules').mockReturnValue(of(systemModules));
    jest.spyOn(messagingServiceStub, 'getMessageTemplates').mockReturnValue(of(messageTemplates));
    jest.spyOn(messagingServiceStub, 'saveMessageTemplate').mockReturnValue(of(messageTemplates[0]));

    TestBed.configureTestingModule({
      declarations: [MessagingTemplateComponent],
      imports: [
        HttpClientTestingModule,
        TranslateModule.forRoot(),
        ReactiveFormsModule
      ],
      providers: [
        { provide: MessagingService, useValue: messagingServiceStub },
        { provide: SystemsService, useValue: systemsServiceStub },
        { provide: GlobalMessagingService, useClass: MockMessageService },
      ],
      schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA]
    });
    fixture = TestBed.createComponent(MessagingTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });

  test('should select system', () => {
    const button = fixture.debugElement.nativeElement.querySelector('.select-system');
    button.click();
    fixture.detectChanges();
    expect(component.selectSystem.call).toBeTruthy();
  });

  test('should save template', () => {
    component.selectedSystem = {id: 37, shortDesc: "", systemName: ""};
    component.templateForm.controls['name'].setValue('sample template');
    component.templateForm.controls['subject'].setValue('sample template');
    component.templateForm.controls['content'].setValue('This is for test');
    component.templateForm.controls['systemModule'].setValue('GIS');
    component.templateForm.controls['systemModule'].setValue('EMAIL');
    component.templateForm.controls['systemModule'].setValue('Y');
    fixture.detectChanges();
    expect(component.selectedSystem.id).toBe(37)

    const button = fixture.debugElement.nativeElement.querySelector('#save-template');
    button.click();
    fixture.detectChanges();
    expect(component.saveTemplate.call).toBeTruthy();
  });


});
