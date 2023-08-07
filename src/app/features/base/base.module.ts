import { NgModule } from '@angular/core';
// import { NbMenuModule } from '@nebular/theme';

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
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';


@NgModule({
    imports: [
        BaseRoutingModule,
        DragDropModule,
        SharedModule,
        ChartModule,
        CommonModule
    ],
  declarations: [
    BaseComponent,
    DashboardLayoutComponent,
    HeaderComponent,
    FooterComponent,
    SidebarComponent,
    DashboardComponent,
    HeaderSubMenuComponent,
  ],
})
export class BaseModule {
}
