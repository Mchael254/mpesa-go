import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReinsuranceApportionmentComponent } from './reinsurance-apportionment.component';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import {SharedModule} from "../../../../../shared/shared.module";
import { TranslateLoader, TranslateService, TranslateStore } from '@ngx-translate/core';
import {of} from "rxjs";


export class MockTranslateService {
  getTranslation = jest.fn().mockReturnValue(of());
  get = jest.fn().mockReturnValue(of());
}

describe('ReinsuranceApportionmentComponent', () => {
  let component: ReinsuranceApportionmentComponent;
  let fixture: ComponentFixture<ReinsuranceApportionmentComponent>;
  let translateServiceStub: TranslateService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ReinsuranceApportionmentComponent],
      imports: [
        ReactiveFormsModule,
        FormsModule,
        SharedModule,
        TableModule
      ],
      providers: [
        { provide: TranslateService},
        { provide: TranslateStore},
        { provide: TranslateLoader},
        { provide: TranslateService, useClass: MockTranslateService }
      ]
    });
    fixture = TestBed.createComponent(ReinsuranceApportionmentComponent);
    component = fixture.componentInstance;
    translateServiceStub = TestBed.inject(TranslateService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  // Form group is created successfully with all controls initialized
  it('should create form group with all controls initialized when called', () => {
    const formBuilder = new FormBuilder();
    const component = new ReinsuranceApportionmentComponent(formBuilder);

    component.createTreatyRiSummaryForm();

    expect(component.treatyRISummaryForm).toBeDefined();
    expect(Object.keys(component.treatyRISummaryForm.controls)).toEqual([
      'companyNetPRate', 'companyNetRiAmt', 'companyNetCession', 'companyNetPremium',
      'reinsurancePRate', 'reinsuranceRiAmt', 'reinsuranceCession', 'reinsurancePremium',
      'treatyPRate', 'treatyRiAmt', 'treatyCession', 'treatyPremium',
      'facrePRate', 'facreRiAmt', 'facreCession', 'facrePremium',
      'totalRiAmt', 'totalCession', 'totalPremium',
      'excessRiAmt', 'excessCession', 'excessPremium'
    ]);
  });

  // ngOnInit initializes the form correctly
  it('should initialize the form correctly when ngOnInit is called', () => {
    const component = new ReinsuranceApportionmentComponent(new FormBuilder());
    component.ngOnInit();
    expect(component.treatyRISummaryForm).toBeDefined();
  });

  // Modal element with id 'treatySetupToggle' is found and displayed
  it('should add "show" treatySetupToggle', () => {
    component.openTreatySetupModal();
    const modal = document.getElementById('treatySetupToggle');
    const modalBackdrop = document.getElementsByClassName('modal-backdrop')[0];
    expect(modal.classList.contains('show')).toBe(true);
    expect(modal.style.display).toBe('block');
  });

  it('should add "show" riskCedingEditToggle', () => {
    component.openRiskCedingModal();
    const modal = document.getElementById('riskCedingEditToggle');
    const modalBackdrop = document.getElementsByClassName('modal-backdrop')[0];
    expect(modal.classList.contains('show')).toBe(true);
    expect(modal.style.display).toBe('block');
  });

  it('should add "show" treatyCessionsEditToggle moddal', () => {
    component.openTreatyCessionsModal();
    const modal = document.getElementById('treatyCessionsEditToggle');
    const modalBackdrop = document.getElementsByClassName('modal-backdrop')[0];
    expect(modal.classList.contains('show')).toBe(true);
    expect(modal.style.display).toBe('block');
  });

  it('should add "show" facreCedingEditToggle moddal', () => {
    component.openFacreCedingModal();
    const modal = document.getElementById('facreCedingEditToggle');
    const modalBackdrop = document.getElementsByClassName('modal-backdrop')[0];
    expect(modal.classList.contains('show')).toBe(true);
    expect(modal.style.display).toBe('block');
  });

  it('should add "show" policyFacreCedingEditToggle moddal', () => {
    component.openPolicyFacreCedingModal();
    const modal = document.getElementById('policyFacreCedingEditToggle');
    const modalBackdrop = document.getElementsByClassName('modal-backdrop')[0];
    expect(modal.classList.contains('show')).toBe(true);
    expect(modal.style.display).toBe('block');
  });

  it('should close treatySetupToggle modal and remove the backdrop when modal element exists', () => {
    component.closeTreatySetupModal();
    const modal = document.getElementById('treatySetupToggle');
    const modalBackdrop = document.getElementsByClassName('modal-backdrop')[0];
    expect(modal.classList.contains('show')).toBe(false);
    expect(modal.style.display).toBe('none');
  });

  it('should close riskCedingEditToggle modal and remove the backdrop when modal element exists', () => {
    component.closeRiskCedingModal();
    const modal = document.getElementById('riskCedingEditToggle');
    const modalBackdrop = document.getElementsByClassName('modal-backdrop')[0];
    expect(modal.classList.contains('show')).toBe(false);
    expect(modal.style.display).toBe('none');
  });

  it('should close policyFacreCedingEditToggle modal and remove the backdrop when modal element exists', () => {
    component.closePolicyFacreCedingModal();
    const modal = document.getElementById('policyFacreCedingEditToggle');
    const modalBackdrop = document.getElementsByClassName('modal-backdrop')[0];
    expect(modal.classList.contains('show')).toBe(false);
    expect(modal.style.display).toBe('none');
  });

  it('should close treatyCessionsEditToggle modal and remove the backdrop when modal element exists', () => {
    component.closeTreatyCessionsModal();
    const modal = document.getElementById('treatyCessionsEditToggle');
    const modalBackdrop = document.getElementsByClassName('modal-backdrop')[0];
    expect(modal.classList.contains('show')).toBe(false);
    expect(modal.style.display).toBe('none');
  });

  it('should close facreCedingEditToggle modal and remove the backdrop when modal element exists', () => {
    component.closeFacreCedingModal();
    const modal = document.getElementById('facreCedingEditToggle');
    const modalBackdrop = document.getElementsByClassName('modal-backdrop')[0];
    expect(modal.classList.contains('show')).toBe(false);
    expect(modal.style.display).toBe('none');
  });
});
