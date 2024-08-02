import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CampaignAnalyticsComponent } from './campaign-analytics.component';

describe('CampaignAnalyticsComponent', () => {
  let component: CampaignAnalyticsComponent;
  let fixture: ComponentFixture<CampaignAnalyticsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CampaignAnalyticsComponent]
    });
    fixture = TestBed.createComponent(CampaignAnalyticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
