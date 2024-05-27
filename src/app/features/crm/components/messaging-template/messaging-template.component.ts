import {Component, OnInit} from '@angular/core';
import {BreadCrumbItem} from "../../../../shared/data/common/BreadCrumbItem";
import {Logger} from "../../../../shared/services";
import {FormBuilder, FormGroup} from "@angular/forms";
import {MessagingService} from "../../services/messaging.service";
import {MessageTemplate, MessageTemplateResponse, } from "../../data/messaging-template";
import {SystemsService} from "../../../../shared/services/setups/systems/systems.service";
import {SystemModule, SystemsDto} from "../../../../shared/data/common/systemsDto";
import {GlobalMessagingService} from "../../../../shared/services/messaging/global-messaging.service";
import {TableLazyLoadEvent} from "primeng/table";

const log = new Logger('MessagingTemplateComponent');

@Component({
  selector: 'app-messaging-template',
  templateUrl: './messaging-template.component.html',
  styleUrls: ['./messaging-template.component.css']
})
export class MessagingTemplateComponent implements OnInit {

  messagingTemplateBreadCrumbItems: BreadCrumbItem[] = [
    { label: 'Administration', url: '/home/dashboard' },
    { label: 'CRM Setups', url: '/home/crm' },
    { label: 'Messaging', url: '/home/crm' },
    { label: 'Messaging Template', url: '/home/crm/messaging-template' },
  ];

  systems: SystemsDto[] = [];
  systemModules: SystemModule[] = [];

  templateForm: FormGroup;
  selectedSystem: SystemsDto = {
    id: 39,
    shortDesc: "SIV",
    systemName: "STORES"
  };

  messageTemplates: MessageTemplate[];
  messageTemplateResponse: MessageTemplateResponse;

  first = 0;
  rows = 10;
  pageNumber: number = 0;
  loading: boolean = false;

  status: { name: string, value: string }[] = [
    { name: 'Yes', value: 'Y' },
    { name: 'No', value: 'N' }
  ]

  constructor(
    private fb: FormBuilder,
    private messagingService: MessagingService,
    private systemsService: SystemsService,
    private globalMessagingService: GlobalMessagingService
  ) {
  }

  ngOnInit(): void {
    this.createTemplateForm();
    this.fetchSystems();
    this.fetchSystemModules();
  }

  /**
   * This method creates a template form for creating new message templates
   */
  createTemplateForm(): void {
    this.templateForm = this.fb.group({
      name: [''],
      subject: [''],
      content: [''],
      systemModule: [''],
      templateType: [''],
      active: [''],
    })
  }

  /**
   * This method fetches all system and assigns them to a variable
   */
  fetchSystems(): void {
    this.systemsService.getSystems()
      .subscribe({
        next: (res: SystemsDto[]) => {
          this.systems = res;
        },
        error: (err) => {
          log.info(err);
        }
      })
  }


  /**
   * This method fetches all system modules and assigns them to a variable
   */
  fetchSystemModules(): void {
    this.systemsService.getSystemModules()
      .subscribe({
        next: (res: SystemModule[]) => {
          this.systemModules = res;
        },
        error: (err) => {
          log.info(err);
        }
      })
  }


  /**
   * This method get the selected system module, and assigns it to a variable
   * @param system
   */
  selectSystem(system: SystemsDto) {
    log.info(`selected system: `, system);
    this.selectedSystem = system;
    // this.fetchTemplates(this.pageNumber, 10, system.id);
    // this.fetchTemplates();
    this.loading = true;
  }


  /**
   * This method fetches a list  of templates
   *  saves them in the templates variable
   */
  /*fetchTemplates(systemId: number, $event?: TableLazyLoadEvent): void {
    setTimeout(() => {
      // log.info(`event `, $event, systemId);
      this.loading = false;

      this.messagingService.getMessageTemplates(0, 10, 0)
        .subscribe({
          next: (res: MessageTemplateResponse) => {
            this.messageTemplateResponse = res
            // log.info(`message templates >>> `, this.messageTemplateResponse);
          },
          error: (err) => {
            console.log(err)
          }
        });
    }, 2000)
  }*/

  /**
   * This method fetches the values from the template form, creates a new object for saving
   *  and calls an API to save the template
   */
  saveTemplate() {
    const formValues = this.templateForm.getRawValue();

    if(!this.selectedSystem?.id) {
      this.globalMessagingService.displayErrorMessage('Select System', 'Select a System to continue');
      return;
    }
    const messageTemplate: MessageTemplate = {
      ...formValues,
      systemCode: this.selectedSystem.id,
      systemModule: +formValues.systemModule,
      imageAttachment: null,
      imageUrl: null,
      productCode: null,
      productName: null,
    }

    // log.info(`message template >>> `, messageTemplate);

    this.messagingService.saveMessageTemplate(messageTemplate)
      .subscribe({
        next: (res: MessageTemplate) => {
          // log.info(`message template created >>> `, res);
          this.globalMessagingService.displayErrorMessage('Success', 'Message template successfully created!')
        },
        error: (err) => {
          this.globalMessagingService.displayErrorMessage('Error', 'Message template not created!')
        }
      });
  }

}
