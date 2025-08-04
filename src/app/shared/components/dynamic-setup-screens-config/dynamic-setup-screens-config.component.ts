import {Component, OnInit} from '@angular/core';
import {SystemsDto} from "../../data/common/systemsDto";
import {SystemsService} from "../../services/setups/systems/systems.service";
import {GlobalMessagingService} from "../../services/messaging/global-messaging.service";
import {BreadCrumbItem} from "../../data/common/BreadCrumbItem";
import {Logger} from "../../services";
import {Router} from "@angular/router";

const log = new Logger('DynamicSetupScreensConfigComponent');
@Component({
  selector: 'app-dynamic-setup-screens-config',
  templateUrl: './dynamic-setup-screens-config.component.html',
  styleUrls: ['./dynamic-setup-screens-config.component.css']
})
export class DynamicSetupScreensConfigComponent implements OnInit {

  systems: SystemsDto[] = [];
  selectedSystem: SystemsDto;

  dynamicConfigBreadCrumbItems: BreadCrumbItem[] = [
    {
      label: 'Home',
      url: '/home/dashboard',
    },
    {
      label: 'Administration',
      url: '/home/screen-setup',
    },
    {
      label: 'Dynamic Setup',
      url: '/home/screen-setup',
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
        this.router.navigate(['/home/crm-screen-setup']);
        break;
      default:
        break;
    }
  }
}
