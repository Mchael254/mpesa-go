import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {GlobalMessagingService} from "../../../../shared/services/messaging/global-messaging.service";

@Component({
  selector: 'app-service-desk',
  templateUrl: './service-desk.component.html',
  styleUrls: ['./service-desk.component.css']
})
export class ServiceDeskComponent implements OnInit {
  pageSize: 5;
  accountsData: any;
  accountsFilteringForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private globalMessagingService: GlobalMessagingService,
    private cdr: ChangeDetectorRef,
  ) { }
  ngOnInit(): void {
    this.accountFilteringCreateForm()
  }

  accountFilteringCreateForm() {
    this.accountsFilteringForm = this.fb.group({
      accountRadio: [''],
      searchCriteria: [''],
      accType: [''],
      inputSearch: [''],
      serviceProviderType: ['']
    });
  }

}
