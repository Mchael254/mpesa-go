import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketsSummaryComponent } from './tickets-summary.component';
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {RouterTestingModule} from "@angular/router/testing";
import {TicketsService} from "../../../../administration/services/tickets.service";
import {of} from "rxjs";
import {
  DEFAULT_LANGUAGE,
  MissingTranslationHandler,
  TranslateCompiler, TranslateFakeLoader,
  TranslateLoader,
  TranslateModule, TranslateModuleConfig, TranslateParser,
  TranslateService,
  TranslateStore, USE_DEFAULT_LANG, USE_EXTEND, USE_STORE
} from "@ngx-translate/core";

export class MockTicketsService {
  getTicketCount = jest.fn().mockReturnValue(of());
}
describe('TicketsSummaryComponent', () => {
  let component: TicketsSummaryComponent;
  let fixture: ComponentFixture<TicketsSummaryComponent>;
  let ticketsServiceStub : TicketsService;

  beforeEach(() => {
    const translateModuleConfig: TranslateModuleConfig = {
      loader: {
        provide: TranslateLoader,
        useClass: TranslateFakeLoader, // Use the fake loader for testing
      },
    };

    TestBed.configureTestingModule({
      declarations: [TicketsSummaryComponent],
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        TranslateModule.forRoot(translateModuleConfig)
      ],
      providers: [ TranslateLoader, TranslateCompiler, TranslateParser,
        MissingTranslationHandler,
        { provide: TicketsService, useClass: MockTicketsService },
        { provide: TranslateService },
        { provide: TranslateStore },
        { provide: USE_DEFAULT_LANG, useValue: true },
        { provide: USE_STORE, useValue: true },
        { provide: USE_EXTEND, useValue: true },
        { provide: DEFAULT_LANGUAGE, useValue: true },
      ]
    });
    fixture = TestBed.createComponent(TicketsSummaryComponent);
    component = fixture.componentInstance;
    ticketsServiceStub = TestBed.inject(TicketsService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
