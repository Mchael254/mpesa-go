import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { NewBusinessService } from '../../service/new-business/new-business.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-need-analysis',
  templateUrl: './need-analysis.component.html',
  styleUrls: ['./need-analysis.component.css']
})
export class NeedAnalysisComponent implements OnInit {

  questionData: any = {};
  questions: any[] = [];
  optionSelected: any[] = []
  questionSelected: any[] = []
  constructor(private new_business_service: NewBusinessService, private spinner_service: NgxSpinnerService, private cdr: ChangeDetectorRef,){}

  ngOnInit(): void {
    this.getQuestions();

  }

  getQuestions(){
    this.spinner_service.show('analysis_view')
    this.new_business_service.getNeedAnalysis().pipe(finalize(() => {
      this.spinner_service.hide('analysis_view')
    })).subscribe(data =>{
      // console.log(data['question']);
      this.questionData = data['question'];
      // this.questionData['isSelected'] = true;

      this.questionSelected.push(this.questionData);
      // this.optionSelected.push(0);
      this.spinner_service.hide('analysis_view')

    })
  }

  selectOption($event) {
    // this.optionSelected.push($event)
    this.appendingSelectedQuestionByOption($event)

    }
  appendingSelectedQuestionByOption(e: any) {
    // console.log(e);

    let question = {...this.questionData};

    if(question?.options.length >0){
      let pastQuestion = {...this.questionSelected[this.questionSelected.length -1]};
      pastQuestion['isSelected'] = true;
      this.questionSelected[this.questionSelected.length -1] = pastQuestion;
      this.questionData = question['options'][e];
      this.questionSelected.push(this.questionData);
      this.optionSelected.push(e);
      this.questionSelected = [...this.questionSelected];
    //   this.cdr.detectChanges();


    //   // question["isSelected"] = true

    }

  }

}
