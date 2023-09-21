import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LiabilityComponent } from './liability.component';
import {NO_ERRORS_SCHEMA} from "@angular/core";

describe('LiabilityComponent', () => {
  let component: LiabilityComponent;
  let fixture: ComponentFixture<LiabilityComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LiabilityComponent],
      imports: [],
      providers: [],
      schemas: [
        NO_ERRORS_SCHEMA
      ]
    });
    fixture = TestBed.createComponent(LiabilityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
