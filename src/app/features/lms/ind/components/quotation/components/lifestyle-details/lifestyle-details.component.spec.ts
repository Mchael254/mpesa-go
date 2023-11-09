import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LifestyleDetailsComponent } from './lifestyle-details.component';

describe('LifestyleDetailsComponent', () => {
  let component: LifestyleDetailsComponent;
  let fixture: ComponentFixture<LifestyleDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LifestyleDetailsComponent]
    });
    fixture = TestBed.createComponent(LifestyleDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
