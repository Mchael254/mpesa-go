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

  /**
   * Emits the selected date to the parent component
   * @param date - type CalendarDay
   * @return void
   */
  emitSelectedDate(date: CalendarDay) {
    this.selectDate.emit(date);
  }

  /**
   * Shows a dialog with a list of events if a particular day has more than 2 events
   * @param calendarDay - type CalendarDay
   * @return void
   */
  showDialog(calendarDay: CalendarDay) {
    this.visible = true;
    this.selectedDayInMonthView = calendarDay;
  }

}
