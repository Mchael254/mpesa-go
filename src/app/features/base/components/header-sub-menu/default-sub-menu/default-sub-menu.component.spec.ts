import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DefaultSubMenuComponent } from './default-sub-menu.component';
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {TranslateModule} from "@ngx-translate/core";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA} from "@angular/core";
import {createSpyObj} from "jest-createspyobj";
import {of} from "rxjs";

describe('DefaultSubMenuComponent', () => {
  const menuServiceStub = createSpyObj('MenuService', ['updateSidebarMainMenu']);

  let component: DefaultSubMenuComponent;
  let fixture: ComponentFixture<DefaultSubMenuComponent>;

  beforeEach(() => {
    jest.spyOn(menuServiceStub, 'updateSidebarMainMenu').mockReturnValue(of(null));


    TestBed.configureTestingModule({
      declarations: [DefaultSubMenuComponent],
      imports: [
        HttpClientTestingModule,
        TranslateModule.forRoot(),
        ReactiveFormsModule,
        FormsModule,
      ],
      providers: [],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    });
    fixture = TestBed.createComponent(DefaultSubMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });

  test('should update sidebar menu', () => {
    const button = fixture.debugElement.nativeElement.querySelector('.update-side-menu');
    button.click();
    fixture.detectChanges();
    expect(component.dynamicSideBarMenu.call).toBeTruthy();
  });

  /*test('should display search values', () => {
    const searchNameInput = fixture.debugElement.nativeElement.querySelector('#searchNameInput')
    searchNameInput.value = 'turnkey user';
    searchNameInput.dispatchEvent(new KeyboardEvent('input'));
    searchNameInput.dispatchEvent(new KeyboardEvent('keyup[enter]'));
    fixture.detectChanges();
  });*/

  test('should close modal', () => {
    const closeModalBtn = fixture.debugElement.nativeElement.querySelector('#close-modal')
    closeModalBtn.click();
    fixture.detectChanges();
    expect(component.closeModal.call).toBeTruthy();
  })

});
