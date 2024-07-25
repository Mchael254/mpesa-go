import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CampaignDefinitionComponent } from './campaign-definition.component';

describe('CampaignDefinitionComponent', () => {
  let component: CampaignDefinitionComponent;
  let fixture: ComponentFixture<CampaignDefinitionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CampaignDefinitionComponent]
    });
    fixture = TestBed.createComponent(CampaignDefinitionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
