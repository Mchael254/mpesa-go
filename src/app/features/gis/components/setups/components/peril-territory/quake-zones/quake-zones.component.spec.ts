import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuakeZonesComponent } from './quake-zones.component';

describe('QuakeZonesComponent', () => {
  let component: QuakeZonesComponent;
  let fixture: ComponentFixture<QuakeZonesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [QuakeZonesComponent]
    });
    fixture = TestBed.createComponent(QuakeZonesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
