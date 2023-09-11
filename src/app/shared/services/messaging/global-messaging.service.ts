import { Injectable } from '@angular/core';
import {Logger} from "../logger/logger.service";
import {MessageService} from "primeng/api";

const log = new Logger('GlobalMessagingService');

/**
 * Global Message Interface
 * @param messageSummary Message Summary
 * @param message Message to be published
 * @param severity Type of message as either info, warning, error or success
 */
export interface GlobalMessage{
  messageSummary: string,
  message: string,
  severity?: string
}

/**
 * This service is used to display messages to the user
 */
@Injectable({
  providedIn: 'root'
})
export class GlobalMessagingService {

  constructor(private messageService: MessageService) { }

  clearMessages() {
    this.messageService.clear();
  }

  /**
   *  Display a Single Message
   * @param severity Type of message as either info, warning, error or success
   * @param summary Message Summary
   * @param detail Message to be published
   */
  displaySingleMessage(severity: string,
                   summary: string,
                   detail: string){
    this.clearMessages();
    this.messageService.add({severity: severity, summary: summary,detail: detail});
  }

  /**
   *  Display Multiple Messages at once
   *  @param messages of type GlobalMessage[]
   */
  displayMultipleMessages(messages: GlobalMessage[]) {
    this.clearMessages();
    this.messageService.addAll(messages);
  }

  /**
   *  Display an Error Message
   * @param summary Message Summary
   * @param detail Message to be published
   */
  displayErrorMessage(summary: string, detail: string){
    this.clearMessages();
    this.messageService.add({severity: 'error', summary: summary, detail: detail});
  }

  /**
   *  Display a Warning Message
   * @param summary Message Summary
   * @param detail Message to be published
   */
  displayWarningMessage(summary: string, detail: string) {
    this.clearMessages();
    this.messageService.add({severity: 'warning', summary: summary, detail: detail});
  }

  /**
   *  Display Information
   * @param summary Message Summary
   * @param detail Message to be published
   */
  displayInfoMessage(summary: string, detail: string) {
    this.clearMessages();
    this.messageService.add({severity: 'info', summary: summary, detail: detail});
  }

  /**
   *  Display Success Message
   * @param summary Message Summary
   * @param detail Message to be published
   */
  displaySuccessMessage(summary: string, detail: string) {
    this.clearMessages();
    this.messageService.add({severity: 'success', summary: summary, detail: detail});
  }

}
