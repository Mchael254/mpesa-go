import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListServiceProviderComponent } from './list-service-provider.component';

describe('ListServiceProviderComponent', () => {
  let component: ListServiceProviderComponent;
  let fixture: ComponentFixture<ListServiceProviderComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListServiceProviderComponent]
    });
    fixture = TestBed.createComponent(ListServiceProviderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
