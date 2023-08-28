import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientRemarksComponent } from './client-remarks.component';

describe('ClientRemarksComponent', () => {
  let component: ClientRemarksComponent;
  let fixture: ComponentFixture<ClientRemarksComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ClientRemarksComponent]
    });
    fixture = TestBed.createComponent(ClientRemarksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
