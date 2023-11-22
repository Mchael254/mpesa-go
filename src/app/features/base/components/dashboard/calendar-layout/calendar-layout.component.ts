import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {CalendarDay} from "../../../../../shared/data/base/dashboard/calendar-dto";

@Component({
  selector: 'app-calendar-layout',
  templateUrl: './calendar-layout.component.html',
  styleUrls: ['./calendar-layout.component.css']
})
export class CalendarLayoutComponent implements OnInit{

  @Input() daysOfTheWeek: string[];
  @Input() daysToDisplay: CalendarDay[];
  @Input() selectedRange;
  @Input() selectedDayInMonthView;
  @Output('selectDate') selectDate: EventEmitter<any> = new EventEmitter();

  public visible: boolean = false;
  constructor() {
  }

  ngOnInit(): void {
  }

  emitSelectedDate(date) {
    this.selectDate.emit(date);
  }

  showDialog(calendarDay: CalendarDay) {
    this.visible = true;
    this.selectedDayInMonthView = calendarDay;
  }

}
