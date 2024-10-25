import { Component, OnDestroy, OnInit } from '@angular/core';
import { BreadCrumbItem } from 'src/app/shared/data/common/BreadCrumbItem';
import { SessionStorageService } from 'src/app/shared/services/session-storage/session-storage.service';
import { SESSION_KEY } from "../../../../../../../util/session_storage_enum";
import { Logger } from 'src/app/shared/services';

const log = new Logger("ServiceRequestDetailsComponent")
@Component({
  selector: 'app-service-request-details',
  templateUrl: './service-request-details.component.html',
  styleUrls: ['./service-request-details.component.css']
})
export class ServiceRequestDetailsComponent implements OnInit, OnDestroy {
  reqLogs = 'summary dets'
  selectedFileName: string | null = null;
  breadCrumbItems: BreadCrumbItem[] = [];
  selectedRequestNumber: string = 'req123456';
  entityType: string;

  constructor(
    private session_storage: SessionStorageService,
  ) { }

  ngOnInit(): void {
    this.populateBreadCrumbItems()
    this.getData();

  }

  ngOnDestroy(): void {

  }

  getData() {
    this.entityType = this.session_storage.get(SESSION_KEY.ENTITY_TYPE);
    const userProfileData = this.session_storage.get('memberProfile');
  }

  populateBreadCrumbItems(): void {
    const dashboardUrl = this.entityType === 'MEMBER'
      ? '/home/lms/grp/dashboard/dashboard-screen'
      : this.entityType === 'ADMIN'
        ? '/home/lms/grp/dashboard/admin'
        : this.entityType === 'AGENT'
          ? '/home/lms/grp/dashboard/agent'
          : '/home/lms/grp/dashboard/dashboard-screen';
    this.breadCrumbItems = [
      { label: 'Dashboard', url: dashboardUrl },
      { label: 'Service request', url: '/home/lms/grp/dashboard/service-requests-listing' },
      { label: this.selectedRequestNumber, url: '/home/lms/grp/dashboard/service-request-details' },
    ];
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
