import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ColorSchemeComponent } from './color-scheme.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import {AppConfigService} from "../../../../core/config/app-config-service";
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { createSpyObj } from 'jest-createspyobj';
import { of } from 'rxjs';
import { ColorSchemeService } from '../../services/color-scheme.service';


export class MockAppConfigService {
  get config() {
    return {
      contextPath: {
        "accounts_services": "crm",
        "users_services": "user",
        "auth_services": "oauth"
      },
      cubejsDefaultUrl: `http://10.176.18.211:4000/cubejs-api/v1`
    };
  }
}

describe('ColorSchemeComponent', () => {
  const colorSchemeServiceStub = createSpyObj('ColorSchemeService', [
    'fetchAllColorSchemes', 'deleteColorScheme', 'createColorScheme'
  ]);

  let component: ColorSchemeComponent;
  let fixture: ComponentFixture<ColorSchemeComponent>;

  const colorSchemes = [
    {
      id: 123,
      name: 'Test Color Scheme',
      colors: ['#4f1033', '#c5113e', '#d9ff6b', '#98aa00', '#34362d'],
    }
  ]

  beforeEach(() => {
    jest.spyOn(colorSchemeServiceStub, 'fetchAllColorSchemes').mockReturnValue(of(colorSchemes));
    jest.spyOn(colorSchemeServiceStub, 'createColorScheme').mockReturnValue(of({}));

    TestBed.configureTestingModule({
      declarations: [ColorSchemeComponent],
      imports: [HttpClientTestingModule],
      providers: [
        { provide: AppConfigService, useClass: MockAppConfigService },
        { provide: ColorSchemeService, useValue: colorSchemeServiceStub },
      ],
      schemas: [NO_ERRORS_SCHEMA]
    });
    fixture = TestBed.createComponent(ColorSchemeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  test('should create', () => {
    expect(component).toBeTruthy();
    expect(component.createColorSchemeForm.call).toBeTruthy();
    expect(component.fetchAllColorSchemes.call).toBeTruthy();
  });

  test(`should select color`, () => {
    const button = fixture.debugElement.nativeElement.querySelector('#select-color-scheme');
    button.click();
    fixture.detectChanges();
  });

  test('should define color scheme name', () => {
    // pending()
  });

  test('should save color scheme', () => {
    component.colorSchemeForm.controls['color0'].setValue('red');
    component.colorSchemeForm.controls['color1'].setValue('orange');
    component.colorSchemeForm.controls['color2'].setValue('yellow');
    component.colorSchemeForm.controls['color3'].setValue('green');
    component.colorSchemeForm.controls['color4'].setValue('indigo');
    
    const button = fixture.debugElement.nativeElement.querySelector('#saveColorScheme')
    button.click();
    fixture.detectChanges();

    expect(component.saveColorScheme.call).toBeTruthy();
  });

  test('should add color box', () => {
    component.newColorScheme = {
      name: '',
      colors: ['','', '', '', '']
    };

    const button = fixture.debugElement.nativeElement.querySelector('#addColorBox');
    button.click();
    fixture.detectChanges();

  });

});
