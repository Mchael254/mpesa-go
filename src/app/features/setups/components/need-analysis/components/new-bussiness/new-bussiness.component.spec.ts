import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewBussinessComponent } from './new-bussiness.component';

describe('NewBussinessComponent', () => {
  let component: NewBussinessComponent;
  let fixture: ComponentFixture<NewBussinessComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NewBussinessComponent]
    });
    fixture = TestBed.createComponent(NewBussinessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
