import { NgModule } from '@angular/core';

import { BaseComponent } from './base.component';
import { BaseRoutingModule } from './base-routing.module';
import {DragDropModule} from "@angular/cdk/drag-drop";
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { DashboardLayoutComponent } from './components/dashboard-layout/dashboard-layout.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { HeaderSubMenuComponent } from './components/header-sub-menu/header-sub-menu.component';
import {SharedModule} from "../../shared/shared.module";
import {ChartModule} from "primeng/chart";
import { TicketsSummaryComponent } from './components/dashboard/tickets-summary/tickets-summary.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CalendarComponent } from './components/dashboard/calendar/calendar.component';
import { CalendarLayoutComponent } from './components/dashboard/calendar-layout/calendar-layout.component';
import {CalendarModule} from "primeng/calendar";
import {DialogModule} from "primeng/dialog";


@NgModule({
    imports: [
        BaseRoutingModule,
        DragDropModule,
        SharedModule,
        ChartModule,
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        CalendarModule,
        DialogModule,
    ],
  declarations: [
    BaseComponent,
    DashboardLayoutComponent,
    HeaderComponent,
    FooterComponent,
    SidebarComponent,
    DashboardComponent,
    HeaderSubMenuComponent,
    TicketsSummaryComponent,
    CalendarComponent,
    CalendarLayoutComponent,
  ],
})
export class BaseModule {
}
