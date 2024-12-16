import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewProspectComponent } from './new-prospect.component';

describe('NewProspectComponent', () => {
  let component: NewProspectComponent;
  let fixture: ComponentFixture<NewProspectComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NewProspectComponent]
    });
    fixture = TestBed.createComponent(NewProspectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
