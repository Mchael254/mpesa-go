import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UnderwritingComponent } from './underwriting.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { SharedModule } from '../../../../../../shared/shared.module';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { BrowserStorage } from '../../../../../../shared/services/storage';
import { APP_BASE_HREF } from '@angular/common';
import { GlobalMessagingService } from '../../../../../../shared/services/messaging/global-messaging.service';
import { MessageService } from 'primeng/api';
import { AppConfigService } from '../../../../../../core/config/app-config-service';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateFakeLoader } from '@ngx-translate/core'
import { FormBuilder } from '@angular/forms';

export class MockBrowserStorage {}

describe('NewBusinessComponent', () => {
  let component: UnderwritingComponent;
  let fixture: ComponentFixture<UnderwritingComponent>;
  let globalMessagingService: GlobalMessagingService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UnderwritingComponent],
      imports: [
        SharedModule,
        FormsModule,
        RouterTestingModule,
        HttpClientTestingModule,
        TranslateModule.forRoot({
          loader: { provide: TranslateLoader, useClass: TranslateFakeLoader } // Use TranslateFakeLoader
        })
      ],
      providers:[
        { provide: BrowserStorage, useClass: MockBrowserStorage },
        { provide: APP_BASE_HREF, useValue: '/' },
        GlobalMessagingService,
        MessageService,
        FormBuilder,
        { provide: AppConfigService, useValue: { config: { contextPath: { gis_services: 'gis/setups/api/v1' } } } }
      ]
    });
    fixture = TestBed.createComponent(UnderwritingComponent);
    component = fixture.componentInstance;
    globalMessagingService = TestBed.inject(GlobalMessagingService);
    component.fb = TestBed.inject(FormBuilder);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
