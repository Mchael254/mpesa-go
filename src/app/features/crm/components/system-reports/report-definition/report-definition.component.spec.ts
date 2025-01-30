import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportDefinitionComponent } from './report-definition.component';

describe('ReportDefinitionComponent', () => {
  let component: ReportDefinitionComponent;
  let fixture: ComponentFixture<ReportDefinitionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ReportDefinitionComponent]
    });
    fixture = TestBed.createComponent(ReportDefinitionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
