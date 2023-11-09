import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExceptionsComponent } from './exceptions.component';

describe('ExceptionsComponent', () => {
  let component: ExceptionsComponent;
  let fixture: ComponentFixture<ExceptionsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ExceptionsComponent]
    });
    fixture = TestBed.createComponent(ExceptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
