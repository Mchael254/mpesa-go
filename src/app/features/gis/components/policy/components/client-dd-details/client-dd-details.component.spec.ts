import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientDdDetailsComponent } from './client-dd-details.component';

describe('ClientDdDetailsComponent', () => {
  let component: ClientDdDetailsComponent;
  let fixture: ComponentFixture<ClientDdDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ClientDdDetailsComponent]
    });
    fixture = TestBed.createComponent(ClientDdDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
