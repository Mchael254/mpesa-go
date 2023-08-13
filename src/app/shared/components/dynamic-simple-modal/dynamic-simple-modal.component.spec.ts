import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamicSimpleModalComponent } from './dynamic-simple-modal.component';

describe('DynamicSimpleModalComponent', () => {
  let component: DynamicSimpleModalComponent;
  let fixture: ComponentFixture<DynamicSimpleModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DynamicSimpleModalComponent]
    });
    fixture = TestBed.createComponent(DynamicSimpleModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
