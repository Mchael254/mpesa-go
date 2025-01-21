import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientSearchModalComponent } from './client-search-modal.component';

describe('ClientSearchModalComponent', () => {
  let component: ClientSearchModalComponent;
  let fixture: ComponentFixture<ClientSearchModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ClientSearchModalComponent]
    });
    fixture = TestBed.createComponent(ClientSearchModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
