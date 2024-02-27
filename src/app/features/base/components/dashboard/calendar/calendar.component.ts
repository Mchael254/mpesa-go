import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {Logger} from "../../../../../shared/services";
import {
  CalendarDay,
  CalendarEventReqDTO,
  SaveCalendarEventDTO
} from "../../../../../shared/data/base/dashboard/calendar-dto";
import {AuthService} from "../../../../../shared/services/auth.service";
import {FormBuilder, FormGroup} from "@angular/forms";
import {Router} from "@angular/router";
import {GlobalMessagingService} from "../../../../../shared/services/messaging/global-messaging.service";
import {CalendarService} from "../../../services/calendar.service";
import {take} from "rxjs/operators";
import * as moment from "moment";

const log = new Logger('CalendarComponent');

enum DURATION {
  DAY = 'DAY',
  WEEK = 'WEEK',
  MONTH = 'MONTH',
}

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit {

  eventsData: CalendarEventReqDTO[] = [];
  events: CalendarEventReqDTO[] = [];
  loggedInUser = this.authService.getCurrentUserName();
  public liTag = '';
  public daysToDisplay: CalendarDay[] = [];

  public date = new Date();
  public currYear: number = this.date.getFullYear();
  public currMonth: number = this.date.getMonth();

  public dateSelectionForm: FormGroup;
  public newEventForm: FormGroup;

  public months = [
    'jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul',
    'aug', 'sep', 'oct', 'nov', 'dec'
  ];
  public daysOfTheWeek = [
    'sun', 'mon', 'tue', 'wed',
    'thu', 'fri', 'sat'
  ]

  public dateRange = [DURATION.DAY, DURATION.WEEK, DURATION.MONTH];
  public years: number[] = []
  public selectedRange = DURATION.DAY;
  public selectedDate: number = this.date.getDate();
  public dayOfWeek: number = 0;
  public slicedTimeTo: Date[] = [];
  public slicedTimeFrom: Date[] = [];

  public createEditToggle: boolean = false;
  public calendarView: string = DURATION.DAY;
  public visible: boolean = false;
  public selectedDayInMonthView: CalendarDay = {event: []}
  startTime: any;

  constructor(
    private authService: AuthService,
    private calendarService: CalendarService,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private fb: FormBuilder,
    private globalMessagingService: GlobalMessagingService
  ) {
    for (let i=0; i < 10; i++) this.years.push(this.currYear + i)
  }
  ngOnInit(): void {
    const todayDateString = this.createDateString(this.selectedDate, this.currMonth, this.currYear);
    this.getEvents(todayDateString);
    this.createDateSelectionForm();
    this.createEventForm();
    // this.sliceTime();
  }

  createDateString(selectedDate, currMonth, currYear): string {
    const adjustedMonth = currMonth + 1;
    return (`${selectedDate < 10 ? '0'
      + selectedDate : selectedDate}/${adjustedMonth < 10 ? '0'
      + adjustedMonth : adjustedMonth}/${currYear}`);
  }

  createDateSelectionForm(): void {
    this.dateSelectionForm = this.fb.group({
      dateRange: [''],
      month: [''],
      year: ['']
    });

    this.dateSelectionForm.patchValue({
      dateRange: this.selectedRange,
      month: this.months[this.currMonth],
      year: this.currYear
    })
  }

  createEventForm(): void {
    this.newEventForm = this.fb.group({
      userName: [''],
      eventTitle: [''],
      fromDate: [''],
      toDate: [''],
      location: [''],
      guests: [''],
      status: [''],
      details: [''],
      eventDate: [''],
    });
    this.newEventForm.patchValue({
      userName: this.loggedInUser,
      eventDate: new Date()
    });
  }

  renderCalendar(): void {
    let firstDayOfMonth = new Date(this.currYear, this.currMonth, 1).getDay();
    let lastDateOfMonth = new Date(this.currYear, this.currMonth + 1, 0).getDate();
    let lastDayOfMonth = new Date(this.currYear, this.currMonth, lastDateOfMonth).getDay();
    let lastDateOfLastMonth = new Date(this.currYear, this.currMonth, 0).getDate();

    for (let i = firstDayOfMonth; i > 0; i--) {
      this.liTag += `<li class="inactive">${lastDateOfLastMonth - i + 1}</li>`;
      const dayToAdd: CalendarDay = {
        event: [],
        date: lastDateOfLastMonth - i + 1,
        month: this.currMonth-1,
        year: this.currYear,
        overflow: true,
        isSelected: false,
        active: false
      }
      this.daysToDisplay.push(dayToAdd)
    }

    for (let i = 1; i <= lastDateOfMonth; i++) {
      let isToday = i === this.date.getDate()
        && this.currMonth === new Date().getMonth()
        && this.currYear === new Date().getFullYear();

      this.liTag += `<li class="${isToday}">${i}</li>`;

      const dayToAdd: CalendarDay = {
        date: i,
        month: this.currMonth,
        year: this.currYear,
        active: isToday,
        overflow: false,
        isSelected: false,
        event: []
      }
      this.daysToDisplay.push(dayToAdd)
    }

    for (let i = lastDayOfMonth; i < 6; i++) {
      this.liTag += `<li class="inactive">${i - lastDayOfMonth + 1}</li>`;
      const dayToAdd: CalendarDay = {
        event: [],
        date: i - lastDayOfMonth + 1,
        month: this.currMonth+1,
        year: this.currYear,
        overflow: true,
        isSelected: false,
        active: false
      }
      this.daysToDisplay.push(dayToAdd)
    }
    this.cdr.detectChanges();
  }

  selectDate(day: CalendarDay): void {
    this.deselectDays();

    const selectedDate: CalendarDay = this.daysToDisplay.filter(x =>
      x.year === day.year && x.month === day.month && x.date === day.date)[0];

    const index = this.daysToDisplay.indexOf(selectedDate);

    this.daysToDisplay[index].isSelected = !this.daysToDisplay[index].isSelected;

    this.selectedDate = selectedDate.date;
    this.fetchFilteredEvents();
  }

  fetchFilteredEvents(): void {
    const formValues = this.dateSelectionForm.getRawValue();

    this.selectedRange = formValues.dateRange;

    let startDate;
    if (this.selectedRange === DURATION.MONTH) {
      startDate = 1; // todo: change to firstDayOfMonthIndex
      this.deselectDays();
    } else {
      startDate = this.selectedDate;
    }

    this.currMonth = this.months.indexOf(formValues.month);
    this.currYear = formValues.year;

    let constructedDate = new Date(this.currYear, this.currMonth, startDate);

    const lastDayOfMonthIndex = (new Date(this.currYear, this.currMonth + 1, 0)).getDate();

    const dateRangeForEvents = this.selectedRange === DURATION.DAY ? 1
      : this.selectedRange === DURATION.WEEK ? 7 : lastDayOfMonthIndex;

    this.calendarView = this.selectedRange === DURATION.MONTH ? DURATION.MONTH
      : this.selectedRange === DURATION.WEEK ? DURATION.WEEK
        :  DURATION.DAY;

    this.events = [];

    const dayToSetActive = this.daysToDisplay.filter(x =>
      x.year === this.currYear && x.month === this.currMonth && x.date === this.selectedDate)[0];


    for (let i=0; i < dateRangeForEvents; i++) {

      const selectedDate = constructedDate.getDate();
      const month = constructedDate.getMonth();
      const year = constructedDate.getFullYear();

      const todayDateString = this.createDateString(selectedDate, month, year)

      const fetchedEvents = this.filterEvents(todayDateString);
      this.events.push(...fetchedEvents);

      constructedDate.setDate(constructedDate.getDate() + 1);
    }

    const index = this.daysToDisplay.indexOf(dayToSetActive);
    // this.daysToDisplay[index].isSelected = true;

    if (this.events.length > 0
      && (this.selectedRange === DURATION.WEEK || this.selectedRange === DURATION.DAY)) {
      for (let i = 1; i < 7; i++) { // todo: use start_index & end_index; remove constants
        this.daysToDisplay[index + i].isSelected = formValues.dateRange === DURATION.WEEK;
      }
    }
    this.mapEventsToDate(this.daysToDisplay, this.events);
  }

  mapEventsToDate(daysToDisplay, events) {
    this.daysToDisplay.forEach((day) => day.event = []);

    let currentDate;

    events.forEach((event) => {
      const eventDate = this.createDateString(
        new Date(event.startDate).getDate(), new Date(event.startDate).getMonth(), new Date(event.startDate).getFullYear()
      )

      daysToDisplay.forEach((day, i) => {
        currentDate = this.createDateString(day.date, day.month, day.year);
        if (eventDate === currentDate) {
          this.daysToDisplay[i].event.push(event)
        }
      });

    })
  }

  filterEvents(dateString: string): CalendarEventReqDTO[] {
    return this.eventsData.filter((event) => {
      return moment(new Date(event.startDate)).format("DD/MM/YYYY") === dateString;
    });
  }

  gotoPrevNext(): void {
    const formValues = this.dateSelectionForm.getRawValue();
    const month = this.months.indexOf(formValues.month);
    const year = formValues.year;
    const selectedDate = this.selectedDate;

    this.date = new Date(year, month, selectedDate);
    this.currYear = this.date.getFullYear();
    this.currMonth = this.date.getMonth();

    this.daysToDisplay = [];
    this.renderCalendar();

    // const todayDateString = this.createDateString(selectedDate, month, year)
    // this.events = this.filterEvents(todayDateString)
    this.fetchFilteredEvents()
  }

  getEvents(dateString: string): void {
    const userName= this.loggedInUser;
    // log.info(`logged In User >>>`, this.loggedInUser);
    this.calendarService.getCalendarEvent(userName)
      .pipe(
        take(1)
      )
      .subscribe(
        (data) => {
          this.eventsData = data;
          this.renderCalendar();

          this.events = this.filterEvents(dateString);

          this.cdr.detectChanges();
        }
      )
  }

  deselectDays(): void {
    this.daysToDisplay.forEach((d,i) => {
      this.daysToDisplay[i].isSelected = false;
      this.daysToDisplay[i].event = [];
    });
  }

  activateCreateEvent(calendarView): void {

    const today = (new Date()).getDate();

    if (today > this.selectedDate) {
      this.globalMessagingService
        .displayInfoMessage("Info", "You cannot create an event for previous date");
      return
    }

    this.calendarView = calendarView;
    const eventDate = this.newEventForm.getRawValue().eventDate;
    this.startTime = new Date(eventDate); // format: new Date("2016-05-04T00:00:00.000Z");
    this.startTime.setHours(0,0,0,0);
    this.slicedTimeFrom = this.sliceTime(this.startTime);
  }

  createEvent(): void {
    const eventFormValues = this.newEventForm.getRawValue();

    const saveCalendarEvent : SaveCalendarEventDTO = {
      StartDate: new Date(eventFormValues.fromDate).toISOString(),
      code: 0,
      endDate: new Date(eventFormValues.toDate).toISOString(),
      location: eventFormValues.location,
      memo: eventFormValues.details,
      startDate: new Date(eventFormValues.fromDate).toISOString(),
      title: eventFormValues.eventTitle,
      user: this.loggedInUser
    }
    // log.info(`calendarEvent to save >>>`, saveCalendarEvent)

    this.calendarService.saveCalendarEvent(saveCalendarEvent)
      .pipe(
        take(1)
      )
      .subscribe(createdEvent => {
        this.globalMessagingService
          .displaySuccessMessage("Success", "Successfully created event");

        const day: CalendarDay = {
          active: true,
          date: this.selectedDate,
          event: [],
          isSelected: false,
          month: this.currMonth,
          overflow: false,
          year: this.currYear
        }
        // this.selectDate(day);
        this.daysToDisplay = [];

        const todayDateString = this.createDateString(this.selectedDate, this.currMonth, this.currYear);
        this.getEvents(todayDateString);

        this.newEventForm.reset();
        this.newEventForm.patchValue({
          eventDate: new Date()
        });
        this.cdr.detectChanges();
        // log.info('saved event data', createdEvent)
      })
  }

  sliceTime(start) {
    const eventDate = this.newEventForm.getRawValue().eventDate;
    let end = new Date(start.getTime() + (24 * 60 * 60 * 1000));

    let slices = [];
    let count = 0;

    while (end >= start) {
      slices[count] = start;
      start = new Date(start.getTime() + (30 * 60 * 1000));
      count++;
    }

    // this.slicedTime = slices;
    this.selectedDate = eventDate.getDate();
    this.currMonth = eventDate.getMonth();
    this.dayOfWeek = eventDate.getDay();
    return slices;
  }

  timeFromEvent(event) {
    let currTime = new Date (event.target.value);
    let startTime = new Date(currTime.getTime() + (30 * 60 * 1000));
    this.slicedTimeTo = this.sliceTime(startTime);
  }
}
