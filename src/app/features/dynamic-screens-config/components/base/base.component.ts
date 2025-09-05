import {Component, OnInit} from '@angular/core';
import {SystemsDto} from "../../../../shared/data/common/systemsDto";
import {BreadCrumbItem} from "../../../../shared/data/common/BreadCrumbItem";
import {SystemsService} from "../../../../shared/services/setups/systems/systems.service";
import {GlobalMessagingService} from "../../../../shared/services/messaging/global-messaging.service";
import {Router} from "@angular/router";
import {Logger} from "../../../../shared/services";

const log = new Logger('BaseComponent');
@Component({
  selector: 'app-base',
  templateUrl: './base.component.html',
  styleUrls: ['./base.component.css']
})
export class BaseComponent implements OnInit{
  systems: SystemsDto[] = [];
  selectedSystem: SystemsDto;

  dynamicConfigBreadCrumbItems: BreadCrumbItem[] = [
    {
      label: 'Home',
      url: '/home/dashboard',
    },
    {
      label: 'Administration',
      url: '/home/screens-config',
    },
    {
      label: 'Dynamic Setup',
      url: '/home/screens-config',
    },
  ];

  constructor(
    private systemsService: SystemsService,
    private globalMessagingService: GlobalMessagingService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.fetchSystems();
  }

  selectSystem(system: SystemsDto): void {
    this.selectedSystem = system;
    log.info( 'system', this.selectedSystem);
  }

  fetchSystems(): void {
    this.systemsService.getSystems().subscribe({
      next: (res: SystemsDto[]) => {
        this.systems = res;

      },
      error: (err) => {
        let errorMessage = err?.error?.message ?? err.message;
        this.globalMessagingService.displayErrorMessage('Error', errorMessage);
      },
    });
  }

  routeToSelectedSystem() {
    const selectedSystem = this.selectedSystem.shortDesc;
    switch (selectedSystem) {
      case 'CORE':
        this.router.navigate(['/home/screens-config/crm-screen-setup']);
        break;
      default:
        break;
    }
  }
}
