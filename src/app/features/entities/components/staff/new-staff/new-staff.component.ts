import {Component, OnDestroy, OnInit} from '@angular/core';
import {Logger} from "../../../../../shared/services";
import {MenuItem} from "primeng/api";
import {Router} from "@angular/router";
import {GlobalMessagingService} from "../../../../../shared/services/messaging/global-messaging.service";
import {NgxSpinnerService} from "ngx-spinner";

const log = new Logger('NewStaffComponent');

/**
 * This component is a parent component for the new staff wizard
 * It contains the steps for the wizard and the logic for navigating between the steps
 */

@Component({
  selector: 'app-new-staff',
  templateUrl: './new-staff.component.html',
  styleUrls: ['./new-staff.component.css']
})
export class NewStaffComponent implements OnInit, OnDestroy {
  visibleStatus: any = {
    firstName: 'Y',
    lastName: 'Y',
    username: 'Y',
    userType: 'Y',
    countryCode: 'Y',
    townCode: 'Y',
    city: 'Y',
    physicalAddress: 'Y',
    phoneNumber: 'Y',
    otherPhone: 'Y',
    email: 'Y',
    departmentCode: 'Y',
    manager: 'Y',
    branch: 'Y',
    personelRank: 'Y',
    telNo: 'Y',
    postalCode: 'Y',
    pinNumber: 'Y',
    gender: 'Y',
    dateOfBirth: 'Y',
    idNumber: 'Y'
  };
  steps: MenuItem[]; // the menu items for each step

  submittedPrevious = false;
  staffProfileValid: boolean = false; assignAppsValid: boolean = false;

  activeIndex: number = 0;

  constructor(
     private globalMessagingService: GlobalMessagingService,
     private spinner:NgxSpinnerService,
     private router: Router) {
  }

  ngOnInit(): void {
    this.steps = [
      {
        label: 'Staff Profile',
        tooltip: 'Add Staff Profile Details',
        title: 'Add Staff Profile Details',
        separator: true,
        command: (event: any) => {},
        state: {completed: false,
                errorMesssage: 'Fill missing user profile details before proceeding'
        }
      },
      {
        label: 'Assign Apps',
        command: (event: any) => { },
        state: {completed: false}
      }
    ];
  }

  ngOnDestroy(): void {
  }


  /**
   * Submit the staff profile details, set the step to completed and go to the next step
   * @param event - which is the index of the current step
   */
  submitStaffProfile(event){
    this.staffProfileValid = true;
    this.steps[this.activeIndex].state['completed'] = true;
    this.goToNextStep(event);
  }

  /**
   * Submit the assigned apps, set the step to completed and go to the next step
   * @param event - which is the index of the current step
   */
  submitAssignedApps(event){
    this.assignAppsValid = true;
    this.steps[this.activeIndex].state['completed'] = true;
    this.goToNextStep(event);
  }

  /**
   * Change the active step to the index passed in
   * @param index - the index of the step to change to, this is the index of the steps array
   */
  changeStep(index: number) {
    if (index > this.activeIndex) {
      // check if previous steps are completed
      let valid = true;
      let invalidStep = 0;
      for (let i = 0; i < index; i++)
      {
        invalidStep = i;
        if (!this.steps[i].state['completed']) {
          valid = false; break;
        }
      }

      if (valid) {
        // update the activeIndex
        this.activeIndex = index;

      } else {
        // show an error message
        this.activeIndex = invalidStep;
        this.globalMessagingService.displayErrorMessage('Error','Please complete the previous steps before proceeding.');

        return;
      }
    } else {
      // update the activeIndex
      this.activeIndex = index;
    }

    // if the activeIndex is the last step, then route to the list of staffs
    if(this.activeIndex >= this.steps.length){
      this.spinner.show();

      setTimeout( () => {
        this.spinner.hide().then(r => this.router.navigate(['home/entity/staff/list']));
      },1000);

    }

  }

  /***
   * Go to the next component in the stepper using the activeIndex
   */
  goToNextStep(event) {
     log.info('Current index: ', this.activeIndex);

     this.submittedPrevious = this.activeIndex!= 0 ? this.steps[this.activeIndex - 1].state['completed'] : true;

     if(this.activeIndex!= 0 && !this.submittedPrevious){
        this.globalMessagingService.displayErrorMessage('Missing details', this.steps[this.activeIndex - 1].state['errorMessage']);
        return;
     }

     let newIndex = this.activeIndex + 1;
     this.changeStep(newIndex);
  }
}
