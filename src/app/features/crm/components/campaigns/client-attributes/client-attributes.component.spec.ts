import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientAttributesComponent } from './client-attributes.component';

describe('ClientAttributesComponent', () => {
  let component: ClientAttributesComponent;
  let fixture: ComponentFixture<ClientAttributesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ClientAttributesComponent]
    });
    fixture = TestBed.createComponent(ClientAttributesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
