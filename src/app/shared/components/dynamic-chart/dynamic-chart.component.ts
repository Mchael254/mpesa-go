import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-dynamic-chart',
  templateUrl: './dynamic-chart.component.html',
  styleUrls: ['./dynamic-chart.component.css']
})
export class DynamicChartComponent implements OnInit {

  @Input() public basicData: any;
  @Input() public chartType: any;
  @Input() public chartTitle: string;
  public barChartOptions: any;
  public pieChartOptions: any;
  public doughnutChartOptions: any;
  public lineChartOptions: any;
  public polarAreaChartOptions: any;
  public radarChartOptions: any;
  public basicOptions: any;

  constructor() {
  }


  ngOnInit(): void {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');
    const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
    const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

    this.barChartOptions = {
      responsive: false,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          labels: {
            color: textColor
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            color: textColorSecondary
          },
          grid: {
            color: surfaceBorder,
            drawBorder: false
          }
        },
        x: {
          ticks: {
            color: textColorSecondary
          },
          grid: {
            color: surfaceBorder,
            drawBorder: false
          }
        }
      }
    };

    this.pieChartOptions = {
      responsive: false,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          labels: {
            usePointStyle: true,
            color: textColor
          }
        }
      }
    };

    this.doughnutChartOptions = {
      responsive: false,
      maintainAspectRatio: false,
      cutout: '60%',
      plugins: {
        legend: {
          labels: {
            color: textColor
          }
        }
      }
    };

    this.lineChartOptions = {
      responsive: false,
      maintainAspectRatio: false,
      aspectRatio: 0.6,
      plugins: {
        legend: {
          labels: {
            color: textColor
          }
        }
      },
      scales: {
        x: {
          ticks: {
            color: textColorSecondary
          },
          grid: {
            color: surfaceBorder,
            drawBorder: false
          }
        },
        y: {
          ticks: {
            color: textColorSecondary
          },
          grid: {
            color: surfaceBorder,
            drawBorder: false
          }
        }
      }
    };

    this.polarAreaChartOptions = {
      responsive: false,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          labels: {
            color: textColor
          }
        }
      },
      scales: {
        r: {
          grid: {
            color: surfaceBorder
          }
        }
      }
    };

    this.radarChartOptions = {
      responsive: false,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          labels: {
            color: textColor
          }
        }
      },
      scales: {
        r: {
          grid: {
            color: textColorSecondary
          },
          pointLabels: {
            color: textColorSecondary
          }
        }
      }
    };

    this.setChartOptions(this.chartType);

  }

  setChartOptions(chartType) {
    switch(chartType) {
      case 'bar':
        this.basicOptions = this.barChartOptions;
        break;
      case 'pie':
        this.basicOptions = this.pieChartOptions;
        break;
      case 'doughnut':
        this.basicOptions = this.doughnutChartOptions;
        break;
      case 'line':
        this.basicOptions = this.lineChartOptions;
        break;
      case 'polarArea':
        this.basicOptions = this.lineChartOptions;
        break;
      case 'radar':
        this.basicOptions = this.radarChartOptions;
        break;
      default:
        this.basicOptions = this.barChartOptions;
    }
  }

}
