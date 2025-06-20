import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {GlobalMessagingService} from "../../../../shared/services/messaging/global-messaging.service";
import {ClientService} from "../../../entities/services/client/client.service";
import {Logger} from "../../../../shared/services";
import {Pagination} from "../../../../shared/data/common/pagination";
import {ClientDTO} from "../../../entities/data/ClientDTO";
import {Router} from "@angular/router";
import {SessionStorageService} from "../../../../shared/services/session-storage/session-storage.service";
import {IntermediaryService} from "../../../entities/services/intermediary/intermediary.service";
import { AgentDTO } from 'src/app/features/entities/data/AgentDTO';
import {ServiceProviderService} from "../../../entities/services/service-provider/service-provider.service";
import {ServiceProviderDTO} from "../../../entities/data/ServiceProviderDTO";

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
  clientsData: Pagination<ClientDTO> = <Pagination<ClientDTO>>{};
  agentsData: Pagination<AgentDTO> = <Pagination<AgentDTO>>{};
  serviceProvidersData: Pagination<ServiceProviderDTO> = <Pagination<ServiceProviderDTO>>{};

  constructor(
    private fb: FormBuilder,
    private globalMessagingService: GlobalMessagingService,
    private cdr: ChangeDetectorRef,
    private clientService: ClientService,
    private router: Router,
    private sessionStorage: SessionStorageService,
    private intermediaryService: IntermediaryService,
    private serviceProviderService: ServiceProviderService,
  ) { }
  ngOnInit(): void {
    this.accountFilteringCreateForm();
    this.getClients();
    this.getAgents();
    this.getServiceProviders();
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

  getClients(){
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

  getAgents(){
    this.intermediaryService.getAgents(null, null, null, null).subscribe({
      next:(res=>{
        this.agentsData = res;

        log.info('Agents', res.content);
      }),
      error: (err => {
        log.error("Error fetching agents:", err);
      })
    })
  }

  getServiceProviders(){
    this.serviceProviderService.getServiceProviders(null, null, null, null).subscribe({
      next:(res=>{
        this.serviceProvidersData = res;

        log.info('Service Providers', res.content);
      }),
      error: (err => {
        log.error("Error fetching service providers:", err);
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
