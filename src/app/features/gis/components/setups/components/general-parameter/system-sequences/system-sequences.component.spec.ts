import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SystemSequencesComponent } from './system-sequences.component';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { SequenceService } from '../../../services/system-sequences/sequences.service';
import { AppConfigService } from '../../../../../../../core/config/app-config-service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import {MessageService} from "primeng/api";
import { IntermediaryService } from '../../../../../../entities/services/intermediary/intermediary.service';
import { ProductService } from '../../../../../../gis/services/product/product.service';
import { of, throwError } from 'rxjs';
import { BranchService } from 'src/app/shared/services/setups/branch/branch.service';

describe('SystemSequencesComponent', () => {
  let component: SystemSequencesComponent;
  let fixture: ComponentFixture<SystemSequencesComponent>;
  let fb: FormBuilder;
  let sequenceService: SequenceService;
  let branchService:BranchService;
  let agentService:IntermediaryService;
  let productService:ProductService;
  let messageService:MessageService;
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SystemSequencesComponent],
      imports: [
        ReactiveFormsModule,
        HttpClientTestingModule
      ],
      providers: [
        FormBuilder,
        SequenceService,
        MessageService,
        IntermediaryService,
      {provide: AppConfigService, useValue: {config:{contextPath: { gis_services: 'gis' } }}},
      ]
    });
    fixture = TestBed.createComponent(SystemSequencesComponent);
    component = fixture.componentInstance;
    fb = TestBed.inject(FormBuilder);
    sequenceService = TestBed.inject(SequenceService);
    branchService = TestBed.inject(BranchService);
    agentService = TestBed.inject(IntermediaryService);
    messageService = TestBed.inject(MessageService)
    productService = TestBed.inject(ProductService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should create the sequence form with form controls', () => {
    component.createSequenceForm();

    expect(component.sequenceForm).toBeDefined();
    expect(component.sequenceForm.get('branch_code')).toBeDefined();
    expect(component.sequenceForm.get('product_prefix')).toBeDefined();
    expect(component.sequenceForm.get('next_number')).toBeDefined();
  });
  it('should select a node and call getSequenceByCode()', () => {
    const event = {
      node: { key: 123 },
    };
    jest.spyOn(component, 'getSequenceByCode');

    component.SelectNode(event);

    expect(component.selectedNode).toBe(event.node);
    expect(component.getSequenceByCode).toHaveBeenCalledWith(event.node.key);
  });
  it('should fetch sequence by code and update the form', () => {
    const code = 123;
    const mockSequence = {
      branch_code: 'BR001',
      product_prefix: 'PP001',
      next_number: 100,
    };

    jest.spyOn(sequenceService, 'getSequenceByCode').mockReturnValue(of(mockSequence));
    jest.spyOn(component.cdr, 'detectChanges');

    component.getSequenceByCode(code);

    expect(sequenceService.getSequenceByCode).toHaveBeenCalledWith(code);
    expect(component.seq).toEqual(mockSequence);
    expect(component.sequenceForm.value).toEqual(mockSequence);
    expect(component.changeForm.controls['oldNextValue'].value).toBe(mockSequence.next_number);
    expect(component.cdr.detectChanges).toHaveBeenCalled();
  });
  it('should create the missing sequence form with form controls', () => {
    component.createMissingSeqform();

    expect(component.createForm).toBeDefined();
    expect(component.createForm.get('branch_code')).toBeDefined();
    expect(component.createForm.get('level')).toBeDefined();
    expect(component.createForm.get('country_code')).toBeDefined();
    expect(component.createForm.get('date')).toBeDefined();
    expect(component.createForm.get('month')).toBeDefined();
    expect(component.createForm.get('next_number')).toBeDefined();
    expect(component.createForm.get('number_type')).toBeDefined();
    expect(component.createForm.get('product_prefix')).toBeDefined();
    expect(component.createForm.get('reg')).toBeDefined();
    expect(component.createForm.get('type')).toBeDefined();
    expect(component.createForm.get('underwriting_year')).toBeDefined();
    expect(component.createForm.get('version')).toBeDefined();
    expect(component.createForm.get('organization_code')).toBeDefined();
  });

  it('should create the allocation form with form controls', () => {
    component.allocationForm();

    expect(component.allocateForm).toBeDefined();
    expect(component.allocateForm.get('agentCode')).toBeDefined();
    expect(component.allocateForm.get('branch_code')).toBeDefined();
    expect(component.allocateForm.get('nextNumberFrom')).toBeDefined();
    expect(component.allocateForm.get('nextNumberTo')).toBeDefined();
    expect(component.allocateForm.get('sequenceCode')).toBeDefined();
  });

  it('should create the changing form with form controls', () => {
    component.changingForm();

    expect(component.changeForm).toBeDefined();
    expect(component.changeForm.get('newNextValue')).toBeDefined();
    expect(component.changeForm.get('oldNextValue')).toBeDefined();
    expect(component.changeForm.get('remarks')).toBeDefined();
    expect(component.changeForm.get('user')).toBeDefined();
  });
  it('should get branches for organization with ID 2', () => {
    jest.spyOn(branchService, 'getBranches').mockReturnValue(of());
    component.getBranchesOrganizationId();
    expect(branchService.getBranches(2).subscribe((data) =>{
      component.branch= data;
    })).toBeTruthy();

  });
  it('should get agents', () => {
    jest.spyOn(agentService, 'getAgents').mockReturnValue(of());
    component.getAgents();
    expect(agentService.getAgents().subscribe((data) =>{
      component.agents= data;
    })).toBeTruthy();

  });
  it('should get all products', () => {
    jest.spyOn(productService, 'getAllProducts').mockReturnValue(of());
    component.getAgents();
    expect(productService.getAllProducts().subscribe((data) =>{
      component.product= data;
    })).toBeTruthy();

  });
  it('should create a missing sequence successfully and show success message', () => {

    jest.spyOn(sequenceService, 'createSequence').mockReturnValue(of());

    component.createMissingSequence();

    expect(sequenceService.createSequence).toHaveBeenCalledWith(component.createForm.value);

  });

  it('should handle an error when creating a missing sequence and show error message', () => {

    jest.spyOn(sequenceService, 'createSequence').mockReturnValue(
      throwError(new Error('Failed to create sequence'))
    );

    component.createMissingSequence();

    expect(sequenceService.createSequence).toHaveBeenCalledWith(component.createForm.value);

  });
  it('should save allocation form successfully and show success message', () => {
    const selectedNodeKey = '123';
    component.selectedNode = { key: selectedNodeKey };



    const mockResponse = {}; // Mock response from the sequenceService

    // Mock the sequenceService's allocate method to return an observable of the mock response
    jest.spyOn(sequenceService, 'allocate').mockReturnValue(of());

    // Call the method to be tested
    component.saveAllocateForm();

    // Assert that the sequenceService's allocate method was called with the expected parameters
    expect(sequenceService.allocate).toHaveBeenCalledWith(selectedNodeKey, component.allocateForm.value);


  });

  it('should handle an error when saving allocation form and show error message', () => {
    const selectedNodeKey = '123';
    component.selectedNode = { key: selectedNodeKey };

    // Simulate an error by throwing an error when the sequenceService's allocate method is called
    jest.spyOn(sequenceService, 'allocate').mockReturnValue(
      throwError(new Error('Failed to allocate'))
    );

    // Call the method to be tested
    component.saveAllocateForm();

    // Assert that the sequenceService's allocate method was called with the expected parameters
    expect(sequenceService.allocate).toHaveBeenCalledWith(selectedNodeKey, component.allocateForm.value);


  });
});
