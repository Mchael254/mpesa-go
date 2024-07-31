import { Component, OnDestroy, OnInit } from '@angular/core';
import { Logger } from 'src/app/shared/services';

const log =  new Logger("ServiceRequestLogsComponent")
@Component({
  selector: 'app-service-request-logs',
  templateUrl: './service-request-logs.component.html',
  styleUrls: ['./service-request-logs.component.css']
})
export class ServiceRequestLogsComponent implements OnInit, OnDestroy {
  reqLogs = 'log'
  selectedFileName: string | null = null;

  constructor() { }

  ngOnInit(): void {

  }

  ngOnDestroy(): void {

  }

  showNewMessageModal() {
    const modal = document.getElementById('newMessageModal');
    if (modal) {
      modal.classList.add('show');
      modal.style.display = 'block';
    }
  }

  closeNewMessageModal() {
    const modal = document.getElementById('newMessageModal');
    if (modal) {
      modal.classList.remove('show')
      modal.style.display = 'none';
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFileName = input.files[0].name;
    }
  }

  removeFile(): void {
    this.selectedFileName = null;
  }

  notifications = [
    {
      sender: 'System Admin',
      message: 'Received your message, kindly indicate ABCD.',
      read: false,
      dateReceived: new Date()
    },
    {
      sender: 'Abiud Murithi',
      message: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s',
      read: true,
      dateReceived: new Date('2023-06-18')
    }
  ];

}
