import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SystemParameterComponent } from './system-parameter.component';

describe('SystemParameterComponent', () => {
  let component: SystemParameterComponent;
  let fixture: ComponentFixture<SystemParameterComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SystemParameterComponent]
    });
    fixture = TestBed.createComponent(SystemParameterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
