import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-service-request',
  templateUrl: './service-request.component.html',
  styleUrls: ['./service-request.component.css']
})
export class ServiceRequestComponent implements OnInit, OnDestroy {
  serviceRegForm: FormGroup;

  constructor(
    private fb: FormBuilder,
  ) { }

  ngOnInit(): void {
    this.regForm();

  }

  ngOnDestroy(): void {

  }

  regForm() {
    this.serviceRegForm = this.fb.group({
      category: [""],
      categoryType: [""],
      policy: [""],
      policyMember: [""],
      contactMethod: [""],
      contactTime: [""],
      description: [""],
    });
  }

}
