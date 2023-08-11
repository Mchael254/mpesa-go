import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectStatusComponent } from './select-status.component';

describe('SelectStatusComponent', () => {
  let component: SelectStatusComponent;
  let fixture: ComponentFixture<SelectStatusComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SelectStatusComponent]
    });
    fixture = TestBed.createComponent(SelectStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
