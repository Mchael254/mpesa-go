import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReassignTicketModalComponent } from './reassign-ticket-modal.component';

describe('ReassignTicketModalComponent', () => {
  let component: ReassignTicketModalComponent;
  let fixture: ComponentFixture<ReassignTicketModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ReassignTicketModalComponent]
    });
    fixture = TestBed.createComponent(ReassignTicketModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
