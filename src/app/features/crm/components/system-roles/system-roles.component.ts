import {Component, OnInit, ViewChild} from '@angular/core';
import {SystemsDto} from "../../../../shared/data/common/systemsDto";
import {Logger} from "../../../../shared/services";
import {SystemsService} from "../../../../shared/services/setups/systems/systems.service";
import {BreadCrumbItem} from "../../../../shared/data/common/BreadCrumbItem";
import {SystemRole} from "../../../../shared/data/common/system-role";
import {NgxSpinnerService} from "ngx-spinner";
import {GlobalMessagingService} from "../../../../shared/services/messaging/global-messaging.service";
import {FormBuilder, FormGroup} from "@angular/forms";
import {ProcessArea} from "../../../../shared/data/common/process-area";
import {ProcessSubArea} from "../../../../shared/data/common/process-sub-area";
import {RoleArea} from "../../../../shared/data/common/role-area";

const log = new Logger('SystemRolesComponent');

@Component({
  selector: 'app-system-roles',
  templateUrl: './system-roles.component.html',
  styleUrls: ['./system-roles.component.css']
})
export class SystemRolesComponent implements OnInit {

  @ViewChild('closebutton') closebutton;
  @ViewChild('closeDeleteButton') closeDeleteButton;

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

  roleAreas: RoleArea[] = [];
  selectedRoleArea: RoleArea;
  shouldShowRoleAreas: boolean = false;

  processAreas: ProcessArea[] = [];
  processSubAreas: ProcessSubArea[] = [];

  roleForm: FormGroup;

  constructor(
    private systemsService: SystemsService,
    private spinner: NgxSpinnerService,
    private globalMessagingService: GlobalMessagingService,
    private fb: FormBuilder,
  ) {
  }

  ngOnInit(): void {
    this.fetchSystems();
    this.createRoleForm();
  }

  /**
   * This method create a role form and defines all fields
   */
  createRoleForm() {
    this.roleForm = this.fb.group({
      roleName: [''],
      shortDesc: [''],
      createdAt: [''],
      status: [''],
      authorized: ['']
    })
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
    this.fetchSystemRoles(this.selectedSystem.id);
  }

  fetchSystemRoles(id: number) {
    this.systemsService.getSystemRoles(id).subscribe({
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
    this.systemsService.getRolesAreas(role.systemCode).subscribe({
      next: (res) => {
        this.roleAreas = res;
      },
      error: (error) => {
        const errorMessage = error?.error?.message ?? error.message
        this.globalMessagingService.displayErrorMessage("Error", errorMessage);
      }
    })
    this.shouldShowRoleAreas = true;
  }

  saveDetails(): void {
    const formValues = this.roleForm.getRawValue();
    let role: SystemRole = {
      ...formValues,
      authorized: formValues.authorized === true ? 'Y' : 'N',
      systemCode: this.selectedSystem?.id
    }

    if (this.selectedRole.id === undefined) {
      this.createRole(role);
    } else {
      role = {
        ...role,
        id: this.selectedRole.id,
        authorizedBy: this.selectedRole.authorizedBy,
        createdAt: this.selectedRole.createdAt,
        createdBy: this.selectedRole.createdBy,
        organizationId: this.selectedRole.organizationId,
      };
      this.editRole(role);
    }
  }

  createRole(role: SystemRole): void {
    this.systemsService.createRole(role).subscribe({
      next: (role) => {
        this.globalMessagingService.displaySuccessMessage('Success', 'Role successfully created.')
        this.fetchSystemRoles(this.selectedSystem.id);
        this.closebutton.nativeElement.click();
      },
      error: (err) => {
        this.rolesErrorMessage = err?.error?.message ?? err.message
        this.globalMessagingService.displayErrorMessage('Error', this.rolesErrorMessage);
      }
    })
  }

  editRole(role: SystemRole): void {
    this.systemsService.editRole(role).subscribe({
      next: (role) => {
        this.globalMessagingService.displaySuccessMessage('Success', 'Role successfully updated.');
        this.fetchSystemRoles(this.selectedSystem.id);
        this.closebutton.nativeElement.click();
      },
      error: (err) => {
        this.rolesErrorMessage = err?.error?.message ?? err.message
        this.globalMessagingService.displayErrorMessage('Error', this.rolesErrorMessage);
      }
    })
  }

  prepareEditRole(): void {
    this.roleForm.patchValue({
      ...this.selectedRole,
      authorized: this.selectedRole.authorized === 'Y',
      createdAt: new Date(this.selectedRole.createdAt)
    });
  }

  resetFormValues(): void {
    this.selectedRole = {id: undefined, roleName: undefined};
    this.roleForm.reset();
  }

  deleteRole(): void {
    try {
      this.systemsService.deleteRole(this.selectedRole.id);
      this.globalMessagingService.displaySuccessMessage('Success', 'Role successfully deleted.');
      this.fetchSystemRoles(this.selectedSystem.id);
    } catch (err) {
      this.rolesErrorMessage = err?.error?.message ?? err.message
      this.globalMessagingService.displayErrorMessage('Error', this.rolesErrorMessage);
    }
      /*this.systemsService.deleteRole(this.selectedRole.id).subscribe({
      next: () => {
        this.globalMessagingService.displaySuccessMessage('Success', 'Role successfully deleted.');
        this.fetchSystemRoles(this.selectedSystem.id);
      },
      error: (err) => {
        this.rolesErrorMessage = err?.error?.message ?? err.message
        this.globalMessagingService.displayErrorMessage('Error', this.rolesErrorMessage);
      }
    });*/
    this.closeDeleteButton.nativeElement.click();
  }

  fetchProcessAreas(roleArea: RoleArea): void {
    this.selectedRoleArea = roleArea;
    this.systemsService.getProcessAreas(roleArea.id).subscribe({
      next: (res: ProcessArea[]) => {
        this.processAreas = res;
      },
      error: (error) => {
        const errorMessage = error?.error?.message ?? error.message
        this.globalMessagingService.displayErrorMessage("Error", errorMessage);
      }
    })
  }

  /*fetchProcessSubAreas(processArea: ProcessArea): void {
    this.systemsService.getProcessSubAreas(processArea.id).subscribe({
      next: (res: ProcessSubArea[]) => {
        this.processSubAreas= res;
      },
      error: (error) => {
        const errorMessage = error?.error?.message ?? error.message
        this.globalMessagingService.displayErrorMessage("Error", errorMessage);
      }
    })
  }*/

}
