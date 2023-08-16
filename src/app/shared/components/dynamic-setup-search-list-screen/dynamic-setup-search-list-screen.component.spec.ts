import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamicSetupSearchListScreenComponent } from './dynamic-setup-search-list-screen.component';

describe('DynamicSetupSearchListScreenComponent', () => {
  let component: DynamicSetupSearchListScreenComponent;
  let fixture: ComponentFixture<DynamicSetupSearchListScreenComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DynamicSetupSearchListScreenComponent]
    });
    fixture = TestBed.createComponent(DynamicSetupSearchListScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
