export interface CalendarEventReqDTO {
  code: number,
  location: string,
  title: string,
  startDays: string,
  startHour: string,
  endDays: string,
  endHours: string,
  user: string,
  createdDate: string,
  endDate: string,
  startDate: string
}
export interface CalendarDay {
  date?: number,
  month?: number,
  year?: number;
  active?: boolean;
  overflow?: boolean; // check if it's days outside the month's calendar
  isSelected?: boolean;
  event: CalendarEventReqDTO[];
}

export interface SaveCalendarEventDTO {
  StartDate: string,
  code: number,
  endDate: string,
  location: string,
  memo: string,
  startDate: string,
  title: string,
  user: string
}
