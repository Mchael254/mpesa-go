import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClausesComponent } from './clauses.component';
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {RouterTestingModule} from "@angular/router/testing";
import {NgxSpinnerModule, NgxSpinnerService} from "ngx-spinner";
import {Router} from "@angular/router";
import {ClauseService} from "../../../../../services/clause/clause.service";
import {AuthService} from "../../../../../../../shared/services/auth.service";
import {of} from "rxjs";
import {GlobalMessagingService} from "../../../../../../../shared/services/messaging/global-messaging.service";
import {MessageService} from "primeng/api";
import {BrowserStorage} from "../../../../../../../shared/services/storage";
import {AppConfigService} from "../../../../../../../core/config/app-config-service";
import {ReactiveFormsModule} from "@angular/forms";

export class MockClauseService {
  createClause = jest.fn().mockReturnValue(of());
  getClauses = jest.fn().mockReturnValue(of());
  setClauseCode = jest.fn().mockReturnValue(of());
  getClauseCode = jest.fn().mockReturnValue(of());
  getSingleClause = jest.fn().mockReturnValue(of());
  updateClause = jest.fn().mockReturnValue(of());
  reviseClause = jest.fn().mockReturnValue(of());
  deleteClause = jest.fn().mockReturnValue(of());
}
export class MockBrowserStorage{

}
export class MockAuthService{
  getCurrentUserName = jest.fn().mockReturnValue('testUser');
}
export class MockAppConfigService {
  get config() {
    return {
      contextPath: {
        "accounts_services": "crm",
        "users_services": "user",
        "auth_services": "oauth"
      },
    };
  }
}
describe('ClausesComponent', () => {
  let component: ClausesComponent;
  let fixture: ComponentFixture<ClausesComponent>;
  let routeStub: Router;
  let spinnerStub: NgxSpinnerService;
  let clauseServiceStub: ClauseService;
  let authServiceStub: AuthService;
  let globalMessagingServiceStub: GlobalMessagingService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ClausesComponent],
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        NgxSpinnerModule.forRoot(),
        ReactiveFormsModule,
      ],
      providers: [
        { provide: ClauseService, useClass: MockClauseService },
        { provide: GlobalMessagingService },
        { provide: MessageService },
        { provide: AuthService, useClass: MockAuthService },
        { provide: BrowserStorage, useClass: MockBrowserStorage },
        { provide: AppConfigService, useClass: MockAppConfigService },
      ]
    });
    fixture = TestBed.createComponent(ClausesComponent);
    component = fixture.componentInstance;
    clauseServiceStub = TestBed.inject(ClauseService);
    routeStub = TestBed.inject(Router);
    spinnerStub = TestBed.inject(NgxSpinnerService);
    authServiceStub = TestBed.inject(AuthService);
    globalMessagingServiceStub = TestBed.inject(GlobalMessagingService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should retrieve and set clauses', () => {

    const sampleClauses = [
      { id: 1, text: 'Clause 1' },
      { id: 2, text: 'Clause 2' },
    ];

    clauseServiceStub.getClauses();

    component.getAllClauses();

    fixture.whenStable().then(() => {

      expect(component.allClauses).toEqual(sampleClauses);
      expect(component.filteredClauses).toEqual(sampleClauses);

    });
  });

  it('should set clause code and update date and editor', () => {
    const code = '123';
    const updatedAt = '2023-08-24T12:34:56Z';
    const updatedBy = 'John Doe';

    component.selectedClause(code, updatedAt, updatedBy);

    expect(clauseServiceStub.setClauseCode).toHaveBeenCalledWith(code);

    expect(component.dateEdited).toBe('2023-08-24');
    expect(component.editedBy).toBe(updatedBy);
  });
  it('should reset the clauseForm and set isupdate to false', () => {
    // component.clauseForm.get('isCurrent').setValue({ code: 'YourInitialCodeValue' })
    // component.isupdate = true;

    const clauseFormInput = component.clauseForm.controls['isCurrent'];
    clauseFormInput.setValue(null);
    component.createNewClause();

    expect(clauseFormInput).toEqual(null); // Make sure 'code' is set to null

    expect(component.isupdate).toBe(false);
  });

  /*it('should call updateClause if isupdate is true', () => {
    // Set up component state
    component.isupdate = true;

    // Trigger the save method
    component.save();
    const updateClause = jest.spyOn(component, "updateClause");

    // Assert that updateClause is called
    expect(updateClause).toHaveBeenCalled();

    // Assert that createClause is not called
    expect(component.createClause).not.toHaveBeenCalled();
  });*/

  it('should create a new clause when createClause is called', () => {
    // Arrange
    const requestBody = {
      code: 1,
      short_description: '',
      heading: '',
      wording: '',
      type: '',
      is_editable: '',
      is_current: '',
      is_lien: '',
      ins: '',
      merge: '',
      organization_code: 1,
      version: 1,
      updated_at: '',
      updated_by: '',
    };

    jest.spyOn(authServiceStub, 'getCurrentUserName').mockReturnValue(of('testUser') as any);
    jest.spyOn(clauseServiceStub, 'createClause').mockReturnValue(of({}) as any); // Mock the service response
    jest.spyOn(globalMessagingServiceStub, 'displaySuccessMessage');
    jest.spyOn(globalMessagingServiceStub, 'displayErrorMessage');

    component.createClause();

    expect(authServiceStub.getCurrentUserName).toHaveBeenCalled();
    expect(clauseServiceStub.createClause).toHaveBeenCalled();
    expect(globalMessagingServiceStub.displaySuccessMessage).toHaveBeenCalledWith('Success', 'Successfully created');
    expect(globalMessagingServiceStub.displayErrorMessage).not.toHaveBeenCalled();
  });

  it('should update a clause when updateClause is called', () => {
    const requestBody: any = {};
    const selectedCode = 'your_selected_code';

    jest.spyOn(clauseServiceStub, 'updateClause').mockReturnValue(of(requestBody) as any);
    jest.spyOn(globalMessagingServiceStub, 'displaySuccessMessage');
    jest.spyOn(globalMessagingServiceStub, 'displayErrorMessage');

    component.updateClause();

    expect(clauseServiceStub.updateClause).toHaveBeenCalledWith(requestBody, selectedCode);
    expect(globalMessagingServiceStub.displaySuccessMessage).toHaveBeenCalledWith('Success', 'Successfully updated');
    expect(globalMessagingServiceStub.displayErrorMessage).not.toHaveBeenCalled();
  });

  it('should revise a clause when reviseClause is called', () => {
    const requestBody = {};
    const code = 'your_code';

    jest.spyOn(clauseServiceStub, 'reviseClause').mockReturnValue(of({}) as any);
    jest.spyOn(component, 'reviseSuccess');

    component.reviseClause();

    expect(clauseServiceStub.reviseClause).toHaveBeenCalledWith(requestBody, code);
    expect(component.reviseSuccess).toHaveBeenCalled();
  });

  it('should delete a clause when deleteClause is called', () => {
    const code = 2;
    const requestBody: any = component.clauseForm.controls['code'];

    jest.spyOn(clauseServiceStub, 'deleteClause').mockReturnValue(of({}) as any);
    jest.spyOn(component, 'deleteSuccess');
    jest.spyOn(component, 'getAllClauses');
    jest.spyOn(component.clauseForm, 'reset');

    component.deleteClause();

    expect(clauseServiceStub.deleteClause).toHaveBeenCalledWith(requestBody);
    expect(component.deleteSuccess).toHaveBeenCalled();
    expect(component.getAllClauses).toHaveBeenCalled();
    expect(component.clauseForm.reset).toHaveBeenCalled();
  });

  it('should filter clauses based on search input', () => {
    const searchValue = 'Another Clause';
    const filtered =[]= [
      { heading: 'Clause 1' },
      { heading: 'Clause 2' },
      { heading: 'Another Clause' },
    ];

    component.filterClauses({ target: { value: searchValue } });

    expect(filtered[2]).toEqual({ heading: 'Another Clause' });
  });
});
