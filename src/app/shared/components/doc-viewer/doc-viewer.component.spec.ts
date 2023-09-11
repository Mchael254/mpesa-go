import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocViewerComponent } from './doc-viewer.component';
import {BrowserModule, DomSanitizer, SafeResourceUrl} from "@angular/platform-browser";
import {UtilService} from "../../services";
import {RouterTestingModule} from "@angular/router/testing";
import {SafeResourceUrlPipe} from "../../pipes/safe-resource-url/safe-resource-url.pipe";
import {SharedModule} from "../../shared.module";

export class MockUtilService {
  checkIfImage = jest.fn();
  generateURLFromBase64String = jest.fn();
}
describe('DocViewerComponent', () => {
  let component: DocViewerComponent;
  let utilService: Partial<UtilService>;
  let sanitizer: DomSanitizer;
  let fixture: ComponentFixture<DocViewerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, BrowserModule, SharedModule],
      declarations: [ DocViewerComponent, SafeResourceUrlPipe ],
      providers: [
        {provide: UtilService, useClass: MockUtilService},
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DocViewerComponent);
    utilService = TestBed.inject(UtilService);
    sanitizer = TestBed.inject(DomSanitizer);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create component', () => {
    expect(component).toBeTruthy();
  });

  it('should set the contentType to "document" when mimeType is not an image', () => {
    jest.spyOn(utilService, 'checkIfImage').mockReturnValue(false);

    component.mimeType = 'application/pdf';
    component.ngOnChanges({});

    expect(utilService.checkIfImage).toHaveBeenCalledWith('application/pdf');
    expect(component.contentType).toEqual('document');
  });

  it('should set the contentType to "image" when mimeType is an image', () => {
    jest.spyOn(utilService, 'checkIfImage').mockReturnValue(true);

    component.mimeType = 'image/jpeg';
    component.ngOnChanges({});

    expect(utilService.checkIfImage).toHaveBeenCalledWith('image/jpeg');
    expect(component.contentType).toEqual('image');
  });

  it('should render the object element when contentType is "document"', () => {
    component.contentType = 'document';
    fixture.detectChanges();
    const objectElement = fixture.nativeElement.querySelector('object');
    expect(objectElement).toBeTruthy();
  });

  it('should not render the object element when contentType is not "document"', () => {
    component.contentType = 'image';
    fixture.detectChanges();
    const objectElement = fixture.nativeElement.querySelector('object');
    expect(objectElement).toBeFalsy();
  });

  it('should render the img element when contentType is "image"', () => {
    component.contentType = 'image';
    fixture.detectChanges();
    const imgElement = fixture.nativeElement.querySelector('img');
    expect(imgElement).toBeTruthy();
  });

  it('should not render the img element when contentType is not "image"', () => {
    component.contentType = 'document';
    fixture.detectChanges();
    const imgElement = fixture.nativeElement.querySelector('img');
    expect(imgElement).toBeFalsy();
  });

});
