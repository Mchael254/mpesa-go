import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BaseFmsComponent } from './base-fms.component';

describe('BaseFmsComponent', () => {
  let component: BaseFmsComponent;
  let fixture: ComponentFixture<BaseFmsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BaseFmsComponent]
    });
    fixture = TestBed.createComponent(BaseFmsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
