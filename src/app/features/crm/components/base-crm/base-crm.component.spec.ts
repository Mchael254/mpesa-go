import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BaseCrmComponent } from './base-crm.component';

describe('BaseCrmComponent', () => {
  let component: BaseCrmComponent;
  let fixture: ComponentFixture<BaseCrmComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BaseCrmComponent]
    });
    fixture = TestBed.createComponent(BaseCrmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });

  test('should toggle the visibility of sub-items when calling toggleItem', () => {
    const item = {
      label: 'Organogram',
      showSubItems: false,
      subItems: [
        { label: 'Organizations', link: '/home/crm/organization' },
        { label: 'Countries & Holidays', link: '/home/crm/country' },
        { label: 'Hierarchy', link: '' },
      ],
    };

    component.toggleItem(item);

    expect(item.showSubItems).toBe(true);

    // Call toggleItem again to hide sub-items
    component.toggleItem(item);

    expect(item.showSubItems).toBe(false);
  });
});
