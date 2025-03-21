import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {GlobalMessagingService} from "../../../../shared/services/messaging/global-messaging.service";
import {ClientService} from "../../../entities/services/client/client.service";
import {Logger} from "../../../../shared/services";
import {Pagination} from "../../../../shared/data/common/pagination";
import {ClientDTO} from "../../../entities/data/ClientDTO";
import {Router} from "@angular/router";
import {SessionStorageService} from "../../../../shared/services/session-storage/session-storage.service";

const log = new Logger('ServiceDeskComponent');
@Component({
  selector: 'app-service-desk',
  templateUrl: './service-desk.component.html',
  styleUrls: ['./service-desk.component.css']
})
export class ServiceDeskComponent implements OnInit {
  pageSize: 5;
  accountsData: any;
  accountsFilteringForm: FormGroup;
  clientsData: Pagination<ClientDTO> = <Pagination<ClientDTO>>{}

  constructor(
    private fb: FormBuilder,
    private globalMessagingService: GlobalMessagingService,
    private cdr: ChangeDetectorRef,
    private clientService: ClientService,
    private router: Router,
    private sessionStorage: SessionStorageService,
  ) { }
  ngOnInit(): void {
    this.accountFilteringCreateForm();
    this.getClient();
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

  getClient(){
    this.clientService.getClients(null, null, null, null, 'name', 'john').subscribe({
      next:(res=>{
        this.clientsData = res;

        log.info('Clients', res.content);
      }),
      error: (err => {
        log.error("Error fetching clients:", err);
      })
    })
  }

  viewDetailsWithId(entity: any, row: any) {
    let entityId = row.id;
    this.sessionStorage.setItem('selectedEntity', row);

    // this.router.navigate([`/home/crm/service-desk-details/${entity}/${selectedEntityId}`]);
    this.router.navigate(['/home/crm/service-desk-details'],
      {queryParams: {entity, entityId }}).then(r => {
    })

  }
}
