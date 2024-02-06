import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatBotComponent } from './chat-bot.component';
import { MessageService } from 'primeng/api';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { createSpyObj } from 'jest-createspyobj';
import { of, throwError } from 'rxjs';
import { ReportServiceV2 } from '../services/report.service';

describe('ChatBotComponent', () => {
  const reportServiceV2 = createSpyObj('ReportServiceV2', ['aiBotQuestion']);

  let component: ChatBotComponent;
  let fixture: ComponentFixture<ChatBotComponent>;

  beforeEach(() => {
    jest.spyOn(reportServiceV2, 'aiBotQuestion').mockReturnValue(of('sample report'));

    TestBed.configureTestingModule({
      declarations: [ChatBotComponent],
      imports: [
        HttpClientTestingModule
      ],
      providers: [
        MessageService,
        { provide: ReportServiceV2, useValue: reportServiceV2}
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    });
    fixture = TestBed.createComponent(ChatBotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });

  test('should show AI bot dialog box', () => {
    component.showAIBot(); // pending
  });

  test('should clear chat', () => {
    const button = fixture.nativeElement.querySelector('#closeChatBox');
    button.click();
    expect(component.conversations.length).toBe(0)
  });

  test('should close chat box', () => {
    const button = fixture.nativeElement.querySelector('#clearChat');
    button.click();
    expect(component.shouldShowChatBot).toBe(false);
  });

  test('should get query result', () => {
    const query = 'List the top 5 claims';
    component.chatForm.controls['queryTerm'].setValue(query);
    const button = fixture.nativeElement.querySelector('#getQueryResult');
    button.click();
    fixture.detectChanges();
    expect(component.getQueryResult.call).toBeTruthy();
    expect(component.conversations.length).toBe(2);
  });

  test('should throw error when API call fails', () => {
    jest.spyOn(reportServiceV2, 'aiBotQuestion').mockReturnValue(
      throwError(() => new Error ('something went wrong') ));

      component.chatForm.controls['queryTerm'].setValue('');
      const button = fixture.nativeElement.querySelector('#getQueryResult');
      button.click(); // write assertions
      // const lastMessage = component.conversations[component.conversations.length - 1];
  })

});
