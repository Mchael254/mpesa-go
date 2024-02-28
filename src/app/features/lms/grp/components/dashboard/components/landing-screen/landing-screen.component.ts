import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-landing-screen',
  templateUrl: './landing-screen.component.html',
  styleUrls: ['./landing-screen.component.css']
})
export class LandingScreenComponent implements OnInit {
  basicData: any;
  basicClaims: any;
  chartOptions: any;

  constructor(
    private router: Router
  ) {

  }

  ngOnInit(): void {
     this.chartOptions = {
      scales: {
        yAxes: [{
          ticks: {
            suggestedMin: 0,
            stepSize: 10
          }
        }]
      }
    };

    this.basicData = {
      labels: ['Jan', 'Feb', 'March', 'April', 'May', 'June', 'July'],
  datasets: [
    {
      label: 'sum assured',
      data: [50, 59, 55, 58, 54, 57, 50],
      borderColor: 'purple',
      fill: false,
      lineTension: 0.4
    },
    {
      label: 'Premium',
      data: [40, 45, 40, 43, 40, 42, 40],
      borderColor: 'green',
      fill: false,
      lineTension: 0.4
    }
  ]
    };

    this.basicClaims = {
      labels: ['Jan', 'Feb', 'March', 'April', 'May', 'June', 'July'],
  datasets: [
    {
      label: 'Amount paid',
      data: [50, 59, 55, 58, 54, 57, 50],
      borderColor: 'purple',
      fill: false,
      lineTension: 0.4
    }
  ]
    };
  }

  onViewPolicies() {
    this.router.navigate(['/home/lms/grp/policy/policyListing'])
  }
}
