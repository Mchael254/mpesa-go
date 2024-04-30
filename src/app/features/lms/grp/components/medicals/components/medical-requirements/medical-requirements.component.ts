import { Component, OnDestroy, OnInit } from '@angular/core';
import stepData from '../../data/steps.json'
import { BreadCrumbItem } from 'src/app/shared/data/common/BreadCrumbItem';

@Component({
  selector: 'app-medical-requirements',
  templateUrl: './medical-requirements.component.html',
  styleUrls: ['./medical-requirements.component.css']
})
export class MedicalRequirementsComponent implements OnInit, OnDestroy {
  steps = stepData;
  breadCrumbItems: BreadCrumbItem[] = [];
  policySelected: string = 'PL/56656'

  ngOnInit(): void {
    this.populateBreadCrumbItems();
    
  }

  ngOnDestroy(): void {
    
  }

  populateBreadCrumbItems(): void {
    this.breadCrumbItems = [
      { label: 'Policy', url: '/home/lms/grp/medicals/policy-listing' },
      { label: this.policySelected, url: '/home/lms/grp/medicals/requirements' },
    ];
  }

}
