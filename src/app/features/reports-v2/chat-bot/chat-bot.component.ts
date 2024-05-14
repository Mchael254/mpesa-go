import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { take, tap } from 'rxjs';
import {GlobalMessagingService} from "../../../shared/services/messaging/global-messaging.service";
import { ReportServiceV2 } from '../services/report.service';
import { Logger } from '../../../shared/services';

const log = new Logger('ChatBotComponent')

@Component({
  selector: 'app-chat-bot',
  templateUrl: './chat-bot.component.html',
  styleUrls: ['./chat-bot.component.css']
})
export class ChatBotComponent implements OnInit {

  public chatForm: FormGroup;
  public shouldShowChatBot: boolean = false;
  public conversations: ChatMessage[] = [];
  public hasPreviousChat: boolean = false;

  constructor(
    private fb: FormBuilder,
    private globalMessagingService: GlobalMessagingService,
    private reportServiceV2: ReportServiceV2
  ) {

  }


  ngOnInit(): void {
    this.createChatForm();
    // this.showAIBot();
  }


  /**
   * This function creates a chat form using the FormBuilder module in Angular.
   * @return void
   */
  createChatForm(): void {
    this.chatForm = this.fb.group({
      queryTerm: ['']
    });
  }


  /**
   * Shows the chatbox with a welcome message from the AI bot
   * @returns void
   */
  showAIBot(): void {
    this.shouldShowChatBot = !this.shouldShowChatBot;
    log.info(`clicked`, this.shouldShowChatBot)
    if (this.conversations.length === 0 && !this.hasPreviousChat) {
      this.hasPreviousChat = true;
      setTimeout(() => {
        this.conversations.push({
          user: 'bot',
          message: 'Welcome to our Reports Section! I\'m here to assist you in exploring and generating insightful reports.'
         });
      }, 1000)
    }
  }

  /**
   * Clear the chat conversation for a fresh start
   * @returns void
   */
  clearChat(): void {
    this.conversations = [];
  }

  /**
   * Close chat window and set visibility status in parent element
   * @returns void
   */
  closeChatBox(): void {
    this.shouldShowChatBot = false;
  }

  /**
   * Get query term, builds message chain and calls bot API
   * @returns void
   */
  getQueryResult(): void {
    const queryTerm = this.chatForm.getRawValue().queryTerm;
    this.conversations.push(
      {
        message: queryTerm,
        user: 'me'
      },
      {
        message: 'loading...',
        user: 'bot'
      }
    );

    this.chatForm.patchValue({queryTerm: ''})

    this.reportServiceV2.aiBotQuestion(queryTerm)
    .pipe(
      take(1),
      tap((res) => {
      })
      )
    .subscribe({
      next: (res) => {
        this.conversations.pop();
        this.conversations.push({
          message: res.result,
          user: 'bot'
        });
      },
      error: (err) => {
        let errorMessage = '';
        if (err.error.message) {
          errorMessage = err.error.message
        } else {
          errorMessage = err.message
        }
        this.conversations.pop();
        this.conversations.push({
          message: "Chat service currently unavailable.",
          user: 'bot'
        });
        this.globalMessagingService.displayErrorMessage('Error', errorMessage)
      }
    })
  }

}

interface ChatMessage {
  message: string,
  user: string
}
