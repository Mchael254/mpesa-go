import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {AssignAppsRequest} from "../../../data/StaffDto";
import {AppService} from "../../../../../shared/services/setups/app.service";
import {Logger} from "../../../../../shared/services";
import {GlobalMessagingService} from "../../../../../shared/services/messaging/global-messaging.service";
import {Router} from "@angular/router";
import {StaffService} from "../../../services/staff/staff.service";

const log = new Logger('AssignAppsComponent');

/**
 * Component to assign apps to staff
 */

@Component({
  selector: 'app-assign-apps',
  templateUrl: './assign-apps.component.html',
  styleUrls: ['./assign-apps.component.css']
})
export class AssignAppsComponent  implements OnInit{
  @Output() assigned = new EventEmitter<void>();

  assignedApps: number[] = [];
  apps: any[] = [];

  constructor(private appService: AppService,
              private globalMessagingService: GlobalMessagingService,
              public staffService: StaffService,
              private router: Router,) {
  }


  /**
   * Fetch apps list
   */
  fetchSystemApps(){
    this.apps = this.appService.getApps();
    this.apps.forEach(app =>  {
      app.clicked = false;
    });
  }

  /**
   * Initialize component by: fetching apps list
   */
  ngOnInit(): void {
    this.fetchSystemApps();
  }

  /**
   * Select or unselect app
   * @param i - index of app in the list
   */
  selectApp(i: number) {
    if (this.apps[i]) {
      this.apps[i]['clicked'] = !this.apps[i]['clicked']; //set  to selected or unselected

      if (this.apps[i]['clicked']) { //if selected=true check if not in the list of selected Apps then add
        if (this.assignedApps.indexOf(
          this.apps[i]['systemCode']) === -1) {
          this.assignedApps.push(this.apps[i]['systemCode']);
        }
      } else { //if set to unselected, remove from selectedApp List
        this.assignedApps = this.assignedApps.filter((item) => item !== this.apps[i]['systemCode']);
      }
    }
  }

  /**
   * Assign apps to staff
   * Ensures staff details are saved before proceeding
   * Emits event to parent component to refresh staff list
   */
  assignApps() {
    let savedStaffDetails = this.staffService.newlyCreatedStaff();

    if(!savedStaffDetails?.id){
      this.globalMessagingService.displayErrorMessage("Staff Details Missing", "Staff Details missing. Fill in Staff Profile Details before proceeding");
      return;
    }
    else if(savedStaffDetails && this.assignedApps){
      let asssignAppReq: AssignAppsRequest = { assignedSystems: this.assignedApps};

      let userId = savedStaffDetails?.id;
      this.staffService.assignUserSystemApps(userId, asssignAppReq)
        .subscribe( (data) => {
          this.globalMessagingService.displaySuccessMessage('Success', 'Hooray!! You have successfully assigned apps' );
          this.assigned.emit();
        });
    }
  }
}
