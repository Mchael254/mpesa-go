import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminSubMenuComponent } from './admin-sub-menu.component';
import {TranslateModule} from "@ngx-translate/core";
import {HttpClientTestingModule} from "@angular/common/http/testing";

describe('AdminSubMenuComponent', () => {
  let component: AdminSubMenuComponent;
  let fixture: ComponentFixture<AdminSubMenuComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdminSubMenuComponent],
      imports: [
        HttpClientTestingModule,
        TranslateModule.forRoot(),
      ],
      providers: []
    });
    fixture = TestBed.createComponent(AdminSubMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
