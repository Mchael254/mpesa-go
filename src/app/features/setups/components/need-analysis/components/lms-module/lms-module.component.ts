import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {SessionStorageService} from "../../../../../../shared/services/session-storage/session-storage.service";
import {SESSION_KEY} from "../../../../../lms/util/session_storage_enum";

@Component({
  selector: 'app-lms-module',
  templateUrl: './lms-module.component.html',
  styleUrls: ['./lms-module.component.css']
})
export class LmsModuleComponent implements OnInit {

  sub_system = [
    {name:'New Business', system_name: 'LMS_INDIVIDUAL', process_type:'NEW_BUSINESS', url: '/home/setups/need-analysis/new-bussiness'},
    {name:'Existing Business', system_name: 'LMS_INDIVIDUAL', process_type:'EXISTING_BUSINESS', url: '/home/setups/need-analysis/new-bussiness'},
    {name:'Claims', system_name: 'LMS_INDIVIDUAL', process_type:'CLAIMS', url: '/home/setups/need-analysis/new-bussiness'},
    {name:'New Business', system_name: 'LMS_GROUP', process_type:'NEW_BUSINESS', url: '/home/setups/need-analysis/new-bussiness'},

  ];

  constructor(private router: Router, private session_storage_service: SessionStorageService){}

  ngOnInit(): void {

  }

  filterBySystem(system_name){
    return this.sub_system.filter(d => d['system_name']===system_name)
  }

  saveSystem(sub_system){
    this.session_storage_service.set(SESSION_KEY.NEED_ANALYSIS_SYSTEM_NAME, sub_system['system_name']);
    this.session_storage_service.set(SESSION_KEY.NEED_ANALYSIS_PROCESS_TYPE, sub_system['process_type']);
    this.router.navigate([sub_system['url']]);
  }

}
