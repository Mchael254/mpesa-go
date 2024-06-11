import {Component, OnInit} from '@angular/core';
import {SystemsDto} from "../../../../shared/data/common/systemsDto";
import {Logger} from "../../../../shared/services";
import {SystemsService} from "../../../../shared/services/setups/systems/systems.service";
import {BreadCrumbItem} from "../../../../shared/data/common/BreadCrumbItem";
import {SystemRole} from "../../../../shared/data/common/system-role";
import {NgxSpinnerService} from "ngx-spinner";
import {GlobalMessagingService} from "../../../../shared/services/messaging/global-messaging.service";

const log = new Logger('SystemRolesComponent');

@Component({
  selector: 'app-system-roles',
  templateUrl: './system-roles.component.html',
  styleUrls: ['./system-roles.component.css']
})
export class SystemRolesComponent implements OnInit {

  messagingTemplateBreadCrumbItems: BreadCrumbItem[] = [
    { label: 'Administration', url: '/home/dashboard' },
    { label: 'CRM Setups', url: '/home/crm' },
    { label: 'Messaging', url: '/home/crm' },
    { label: 'System Roles', url: '/home/crm/system-roles' },
  ];

  systems: SystemsDto[] = [];
  selectedSystem: SystemsDto = {
    id: undefined,
    shortDesc: undefined,
    systemName: undefined
  }
  shouldShowSystems: boolean = false;

  systemRoles: SystemRole[] = [];
  selectedRole: SystemRole = {id: undefined, roleName: undefined};
  shouldShowRoles: boolean = false;
  rolesErrorMessage: string = '';

  processesAndSubareas: string[] = ['one', 'two', 'three', 'four', 'five', 'six', 'seven'];
  subAreas: string[] = ['Access(AMA)', 'Clients (AMAC)', 'Holding companies (AMHC)'];
  shouldShowRoleAreas: boolean = false;

  constructor(
    private systemsService: SystemsService,
    private spinner: NgxSpinnerService,
    private globalMessagingService: GlobalMessagingService,
  ) {
  }

  ngOnInit(): void {
    this.fetchSystems();
  }

  /**
   * This method fetches all system and assigns them to a variable
   */
  fetchSystems(): void {
    this.shouldShowSystems = false;
    this.spinner.show();
    this.systemsService.getSystems()
      .subscribe({
        next: (res: SystemsDto[]) => {
          this.systems = res;
          this.spinner.hide();
          this.shouldShowSystems = true;
        },
        error: (err) => {
          let errorMessage = err?.error?.message ?? err.message
          this.spinner.hide();
          this.shouldShowSystems = true;
          this.globalMessagingService.displayErrorMessage('Error', errorMessage);
        }
      })
  }

  /**
   * This method get the selected system module, and assigns it to a variable
   * @param system
   */
  selectSystem(system: SystemsDto): void {
    this.spinner.show();
    this.shouldShowRoles = false;
    this.selectedSystem = system;
    this.systemsService.getSystemRoles(this.selectedSystem.id).subscribe({
      next: (roles: SystemRole[]) => {
        this.systemRoles = roles;
        this.spinner.hide();
        if (roles.length === 0) this.rolesErrorMessage = 'No roles found for selected system';
        this.shouldShowRoles = true;
      },
      error: (err) => {
        this.rolesErrorMessage = err?.error?.message ?? err.message
        this.spinner.hide();
        this.shouldShowRoles = true;
        this.globalMessagingService.displayErrorMessage('Error', this.rolesErrorMessage);
      }
    })
  }

  /**
   * This method get the selected role, and assigns it to a variable
   * @param role
   */
  selectRole(role: SystemRole): void {
    this.selectedRole = role;
    this.shouldShowRoleAreas = true;
  }

}
