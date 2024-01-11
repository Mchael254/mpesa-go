import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { finalize } from 'rxjs';
import { NeedAnalysisService } from 'src/app/features/setups/service/need-analysis/need-analysis.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-need-analysis',
  templateUrl: './need-analysis.component.html',
  styleUrls: ['./need-analysis.component.css']
})
export class NeedAnalysisComponent implements OnInit {

  questionData: any = {};
  questions: any[] = [];
  optionSelected: any[] = [];
  questionSelected: any[] = [];
  constructor( private spinner_service: NgxSpinnerService, private cdr: ChangeDetectorRef, private need_analysis_service: NeedAnalysisService){}

  ngOnInit(): void {
    this.getQuestions();
  }

  getQuestions(){
    this.spinner_service.show('analysis_view')
    let TENANT_ID = environment?.TENANT_ID?.toUpperCase();
    let NEED_ANALYSIS_PROCESS_TYPE = 'NEW_BUSINESS'
    let NEED_ANALYSIS_SYSTEM_NAME = 'LMS_INDIVIDUAL'

    this.need_analysis_service
      .getNeedAnalysisBySystemNameAndProcessTypeAndTenantID(
        TENANT_ID,
        NEED_ANALYSIS_PROCESS_TYPE,
        NEED_ANALYSIS_SYSTEM_NAME
      ).pipe(finalize(() => {
      this.spinner_service.hide('analysis_view')
    })).subscribe(data =>{
      this.questionData = data['data']['question'];
      this.questionSelected.push(this.questionData);
      this.spinner_service.hide('analysis_view')

    })
  }

  selectOption($event) {
    this.appendingSelectedQuestionByOption($event);
    }
  appendingSelectedQuestionByOption(e: any) {
    let question = {...this.questionData};
    if(question?.options.length >0){
      let pastQuestion = {...this.questionSelected[this.questionSelected.length -1]};
      pastQuestion['isSelected'] = true;
      this.questionSelected[this.questionSelected.length -1] = pastQuestion;
      this.questionData = question['options'][e];
      this.questionSelected.push(this.questionData);
      this.optionSelected.push(e);
      this.questionSelected = [...this.questionSelected];
    }
  }

  reset(){
    this.questionData= {};
    this.questions = [];
    this.optionSelected= []
    this.questionSelected= []
    this.ngOnInit();
  }

}
