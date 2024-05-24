import { Component, OnDestroy, OnInit } from '@angular/core';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit, OnDestroy {

  constructor() {}

  ngOnInit(): void {
    
  }

  ngOnDestroy(): void {
    
  }

  userProfileData = {
    fullName: 'Nairobi Union Sacco', idNo: 'NBO/SACCO/007', userName: 'nbisacco@gmail.com'
  }

}
