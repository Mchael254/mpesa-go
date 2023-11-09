import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { AutoUnsubscribe } from 'src/app/shared/services/AutoUnsubscribe';

@Component({
  selector: 'app-questions',
  templateUrl: './questions.component.html',
  styleUrls: ['./questions.component.css']
})
@AutoUnsubscribe
export class QuestionsComponent implements OnInit, OnDestroy {


  @Input() questions;
  @Input() index;
  @Input() optionPosition;
  @Output() selectOption: EventEmitter<any> = new EventEmitter<any>();
  optionText: string = '';

  ngOnInit(): void {
  }

  selectOptionEmitter(e){
    this.optionPosition = e;
    this.selectOption.emit(e)
  }

  get getOptionText(){
    return this.optionText;
  }

  ngOnDestroy(): void {
    console.log("UNSUBSCRIBE QuestionsComponent");

  }
}
