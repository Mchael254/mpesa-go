import { Component, OnInit } from '@angular/core';
import { BreadCrumbItem } from '../../../../shared/data/common/BreadCrumbItem';
import { Logger } from '../../../../shared/services';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MessagingService } from '../../services/messaging.service';
import { MessageTemplate } from '../../data/messaging-template';
import { SystemsService } from '../../../../shared/services/setups/systems/systems.service';
import {
  SystemModule,
  SystemsDto,
} from '../../../../shared/data/common/systemsDto';
import { GlobalMessagingService } from '../../../../shared/services/messaging/global-messaging.service';
import { TableLazyLoadEvent } from 'primeng/table';
import { NgxSpinnerService } from 'ngx-spinner';
import { Pagination } from '../../../../shared/data/common/pagination';

const log = new Logger('MessagingTemplateComponent');

@Component({
  selector: 'app-messaging-template',
  templateUrl: './messaging-template.component.html',
  styleUrls: ['./messaging-template.component.css'],
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
    shortDesc: 'SIV',
    systemName: 'STORES',
  };

  messageTemplates: MessageTemplate[];
  messageTemplateResponse: Pagination<MessageTemplate>;

  first = 0;
  rows = 10;
  pageNumber: number = 0;
  loading: boolean = false;

  status: { name: string; value: string }[] = [
    { name: 'Yes', value: 'Y' },
    { name: 'No', value: 'N' },
  ];

  constructor(
    private fb: FormBuilder,
    private messagingService: MessagingService,
    private systemsService: SystemsService,
    private globalMessagingService: GlobalMessagingService,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit(): void {
    this.spinner.show();
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
      status: [''],
    });
  }

  sliceString(str: string): string {
    if (str) {
      const slicedString = str.length > 25 ? str.slice(0, 25) + '...' : str;
      return slicedString;
    } else {
      return '';
    }
  }

  /**
   * This method fetches all system and assigns them to a variable
   */
  fetchSystems(): void {
    this.systemsService.getSystems().subscribe({
      next: (res: SystemsDto[]) => {
        this.systems = res;
        // this.spinner.hide();
      },
      error: (err) => {
        log.info(err);
        // this.spinner.hide();
      },
    });
  }

  /**
   * This method fetches all system modules and assigns them to a variable
   */
  fetchSystemModules(): void {
    this.systemsService.getSystemModules().subscribe({
      next: (res: SystemModule[]) => {
        this.systemModules = res;
      },
      error: (err) => {
        log.info(err);
      },
    });
  }

  /**
   * This method get the selected system module, and assigns it to a variable
   * @param system
   */
  selectSystem(system: SystemsDto) {
    this.spinner.show();
    // log.info(`selected system: `, system);
    this.selectedSystem = system;
    this.fetchTemplates();
    this.loading = true;
  }

  /**
   * This method fetches a list  of templates
   *  saves them in the templates variable
   */
  fetchTemplates($event?: TableLazyLoadEvent): void {
    this.spinner.show();

    if ($event) {
      this.first = $event.first;
      this.rows = $event.rows;
      this.pageNumber = this.first / this.rows;
    } else {
      this.first = 0;
      this.rows = 10;
      this.pageNumber = 0;
    }

    this.messagingService
      .getMessageTemplates(this.pageNumber, this.rows, this.selectedSystem?.id)
      .subscribe({
        next: (res: Pagination<MessageTemplate>) => {
          this.messageTemplateResponse = res;
          this.messageTemplates = res.content;
          this.loading = false;
          this.spinner.hide();
        },
        error: (err) => {
          // console.log(err);
          this.loading = false;
          this.spinner.hide();
        },
      });
  }

  /**
   * This method fetches the values from the template form, creates a new object for saving
   *  and calls an API to save the template
   */
  saveTemplate() {
    const formValues = this.templateForm.getRawValue();

    if (!this.selectedSystem?.id) {
      this.globalMessagingService.displayErrorMessage(
        'Select System',
        'Select a System to continue'
      );
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
    };

    // log.info(`message template >>> `, messageTemplate);

    this.messagingService.saveMessageTemplate(messageTemplate).subscribe({
      next: (res: MessageTemplate) => {
        // log.info(`message template created >>> `, res);
        this.globalMessagingService.displaySuccessMessage(
          'Success',
          'Message template successfully created!'
        );
      },
      error: (err) => {
        this.globalMessagingService.displayErrorMessage(
          'Error',
          'Message template not created!'
        );
      },
    });
  }
}
