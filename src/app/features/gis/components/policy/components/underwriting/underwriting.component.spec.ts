import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnderwritingComponent } from './underwriting.component';

describe('NewBusinessComponent', () => {
  let component: UnderwritingComponent;
  let fixture: ComponentFixture<UnderwritingComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UnderwritingComponent]
    });
    fixture = TestBed.createComponent(UnderwritingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
