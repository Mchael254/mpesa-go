import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaturitiesComponent } from './maturities.component';

describe('MaturitiesComponent', () => {
  let component: MaturitiesComponent;
  let fixture: ComponentFixture<MaturitiesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MaturitiesComponent]
    });
    fixture = TestBed.createComponent(MaturitiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
