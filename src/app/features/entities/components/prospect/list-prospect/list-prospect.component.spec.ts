import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListProspectComponent } from './list-prospect.component';

describe('ListProspectComponent', () => {
  let component: ListProspectComponent;
  let fixture: ComponentFixture<ListProspectComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListProspectComponent]
    });
    fixture = TestBed.createComponent(ListProspectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
