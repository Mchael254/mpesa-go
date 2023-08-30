import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SystemSequencesComponent } from './system-sequences.component';

describe('SystemSequencesComponent', () => {
  let component: SystemSequencesComponent;
  let fixture: ComponentFixture<SystemSequencesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SystemSequencesComponent]
    });
    fixture = TestBed.createComponent(SystemSequencesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
