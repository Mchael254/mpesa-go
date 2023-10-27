import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ReportService } from '../../reports/services/report.service';
import {Logger} from "../../../shared/services";
import { ReportV2 } from 'src/app/shared/data/reports/report';


const log = new Logger('Save Report Modal');

@Component({
  selector: 'app-save-report-modal',
  templateUrl: './save-report-modal.component.html',
  styleUrls: ['./save-report-modal.component.css']
})
export class SaveReportModalComponent implements OnInit {

  @Output('reportToSave') reportToSave: EventEmitter<any> = new EventEmitter();

  public saveReportForm: FormGroup;
  public dashboards: any[] = [];
  @Input() public report: ReportV2;

  constructor(
    private fb: FormBuilder,
    private reportService: ReportService,
  ) {

  }


  ngOnInit(): void {
    this.createSaveReportForm();
    this.fetchDashboards();
  }

  createSaveReportForm(): void {
    this.saveReportForm = this.fb.group({
      reportName: [''],
      dashboard: [''],
      destination: [''],
    });
  };

  patchFormValues(report: ReportV2): void {
    this.saveReportForm.patchValue({
      reportName: report?.name,
      dashboard: report?.dashboardId,
      destination: report?.folder,
    })
  }


  /**
   * gets all existing dashboards from the DB so that a user can select 
   *  a specific dashboar when saving a report
   * @returns void
   */
  fetchDashboards(): void {
    this.reportService.getDashboards()
      .pipe()
      .subscribe({
        next: ((dashboards) => {
          log.info(`dashboards >>>`, dashboards);
          this.dashboards = dashboards;
        }),
        error: (e) => {

        }
      })
  };

  saveReport(): void {
    const formValues = this.saveReportForm.getRawValue();

    const report: ReportV2 = {
      ...this.report,
      name: formValues.reportName,
      dashboardId: parseInt(formValues.dashboard),
      folder: formValues.destination,
    };
    
    this.reportToSave.emit(report);
  }



}
