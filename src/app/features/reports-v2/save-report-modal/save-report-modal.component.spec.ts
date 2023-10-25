import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaveReportModalComponent } from './save-report-modal.component';

describe('SaveReportModalComponent', () => {
  let component: SaveReportModalComponent;
  let fixture: ComponentFixture<SaveReportModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SaveReportModalComponent]
    });
    fixture = TestBed.createComponent(SaveReportModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
