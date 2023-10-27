import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuickComponent } from './quick.component';

describe('QuickComponent', () => {
  let component: QuickComponent;
  let fixture: ComponentFixture<QuickComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [QuickComponent]
    });
    fixture = TestBed.createComponent(QuickComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
