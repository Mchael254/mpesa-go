import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewServiceProviderComponent } from './new-service-provider.component';

describe('NewServiceProviderComponent', () => {
  let component: NewServiceProviderComponent;
  let fixture: ComponentFixture<NewServiceProviderComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NewServiceProviderComponent]
    });
    fixture = TestBed.createComponent(NewServiceProviderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
