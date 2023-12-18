import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportRisksComponent } from './import-risks.component';

describe('ImportRisksComponent', () => {
  let component: ImportRisksComponent;
  let fixture: ComponentFixture<ImportRisksComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ImportRisksComponent]
    });
    fixture = TestBed.createComponent(ImportRisksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
