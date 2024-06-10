import {Component, OnInit} from '@angular/core';
import {SystemsDto} from "../../../../shared/data/common/systemsDto";
import {Logger} from "../../../../shared/services";
import {SystemsService} from "../../../../shared/services/setups/systems/systems.service";
import {BreadCrumbItem} from "../../../../shared/data/common/BreadCrumbItem";
import {SystemRole} from "../../../../shared/data/common/system-role";

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

  // systemRoles: string[] = ['Customer Service', 'LMS CRM', 'Admin', 'GIS CRM', 'IT intern', 'FMS CRM', 'Underwriter'];
  systemRoles: SystemRole[] = [];
  selectedRole: SystemRole = {id: 0, roleName: ''};

  // shouldShowRoles: boolean = false;
  processesAndSubareas: string[] = ['one', 'two', 'three', 'four', 'five', 'six', 'seven'];
  subAreas: string[] = ['Access(AMA)', 'Clients (AMAC)', 'Holding companies (AMHC)']

  constructor(
    private systemsService: SystemsService,
  ) {
  }

  ngOnInit(): void {
    this.fetchSystems();
  }

  /**
   * This method fetches all system and assigns them to a variable
   */
  fetchSystems(): void {
    this.systemsService.getSystems()
      .subscribe({
        next: (res: SystemsDto[]) => {
          this.systems = res;
        },
        error: (err) => {
          log.info(err);
        }
      })
  }

  /**
   * This method get the selected system module, and assigns it to a variable
   * @param system
   */
  selectSystem(system: SystemsDto): void {
    this.selectedSystem = system;
    // this.shouldShowRoles = true;
    this.systemsService.getSystemRoles(2).subscribe({ // todo: make orgId optional from backend
      next: (roles: SystemRole[]) => {
        this.systemRoles = roles;
      },
      error: (err) => {
        log.info(err);
      }
    })
  }

  /**
   * This method get the selected role, and assigns it to a variable
   * @param role
   */
  selectRole(role: SystemRole): void {
    this.selectedRole = role;
  }

}
