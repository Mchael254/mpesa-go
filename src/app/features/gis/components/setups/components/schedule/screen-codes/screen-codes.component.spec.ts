import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScreenCodesComponent } from './screen-codes.component';

describe('ScreenCodesComponent', () => {
  let component: ScreenCodesComponent;
  let fixture: ComponentFixture<ScreenCodesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ScreenCodesComponent]
    });
    fixture = TestBed.createComponent(ScreenCodesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
