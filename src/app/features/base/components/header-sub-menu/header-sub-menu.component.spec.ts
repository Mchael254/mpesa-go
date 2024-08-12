import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderSubMenuComponent } from './header-sub-menu.component';
import { TranslateModule } from '@ngx-translate/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

describe('HeaderSubMenuComponent', () => {
  let component: HeaderSubMenuComponent;
  let fixture: ComponentFixture<HeaderSubMenuComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HeaderSubMenuComponent],
      imports: [
        HttpClientTestingModule,
        TranslateModule.forRoot(),
        ReactiveFormsModule,
      ],
      providers: [],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
    });
    fixture = TestBed.createComponent(HeaderSubMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
