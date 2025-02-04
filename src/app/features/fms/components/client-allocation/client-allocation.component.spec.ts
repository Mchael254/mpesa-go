import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientAllocationComponent } from './client-allocation.component';

describe('ClientAllocationComponent', () => {
  let component: ClientAllocationComponent;
  let fixture: ComponentFixture<ClientAllocationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ClientAllocationComponent]
    });
    fixture = TestBed.createComponent(ClientAllocationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
