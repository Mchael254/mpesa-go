import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExcessOfLossCoverageComponent } from './excess-of-loss-coverage.component';

describe('ExcessOfLossCoverageComponent', () => {
  let component: ExcessOfLossCoverageComponent;
  let fixture: ComponentFixture<ExcessOfLossCoverageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ExcessOfLossCoverageComponent]
    });
    fixture = TestBed.createComponent(ExcessOfLossCoverageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
