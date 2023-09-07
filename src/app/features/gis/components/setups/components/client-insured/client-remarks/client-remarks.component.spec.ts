import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientRemarksComponent } from './client-remarks.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppConfigService } from '../../../../../../../core/config/app-config-service';

import { FormBuilder, FormGroup } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ClientRemarksService } from '../../../services/client-remarks/client-remarks.service';
import { BrowserStorage } from '../../../../../../../shared/services/storage/browser-storage';
describe('ClientRemarksComponent', () => {
  let component: ClientRemarksComponent;
  let fixture: ComponentFixture<ClientRemarksComponent>;
  let service: ClientRemarksService;
  let messageService: MessageService;
 
    beforeEach(async () => {
      await TestBed.configureTestingModule({
        declarations: [ ClientRemarksComponent ],
        imports: [HttpClientTestingModule],
        providers: [FormBuilder,ClientRemarksService,MessageService,BrowserStorage,
          {provide: AppConfigService, useValue: {config:{contextPath: { gis_services: 'gis/setups/api/v1' } }}}
        ],
      })
      .compileComponents();

    fixture = TestBed.createComponent(ClientRemarksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    service = TestBed.inject(ClientRemarksService);
    messageService = TestBed.inject(MessageService)
    component.remarkForm = new FormGroup({});

    component.remarkForm.patchValue({

  });
});


  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
