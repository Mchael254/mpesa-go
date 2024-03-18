import {ChangeDetectorRef, Component, Input, OnInit, SimpleChanges} from '@angular/core';
import { Logger } from '../../services/logger/logger.service';
import { UtilService } from '../../services/util/util.service';
// import {Logger, UtilService} from '../../shared.module';

const log = new Logger('DocViewerComponent');

/**
 * This component is used to display documents and images
 * It takes in the following inputs:
 * 1. srcUrl: The url of the document or image to be displayed
 * 2. base64String: The base64 string of the document or image to be displayed
 * 3. isBase64: A boolean value to indicate if the document or image is in base64 format
 * 4. mimeType: The mime type of the document or image to be displayed
 * 5. fileName: The name of the document or image to be displayed
 */

@Component({
  selector: 'ngx-doc-viewer',
  templateUrl: './doc-viewer.component.html',
  styleUrls: ['./doc-viewer.component.scss']
})
export class DocViewerComponent implements OnInit {

  @Input() srcUrl = '';
  @Input() base64String = '';
  @Input() isBase64 = false;
  @Input() mimeType = '';
  @Input() fileName = '';

  docPath: any;
  public contentType: 'document' | 'image' | 'video' = 'document';

  constructor(private utilService: UtilService,
              private cdr: ChangeDetectorRef
              ) {
  }

  ngOnInit(): void {
  }

  /**
   * This method is called when data-bound input properties sets or resets
   * It is called before ngOnInit() and whenever one or more data-bound input properties change.
   * It generates the url for the document  or image to be displayed
   * @param changes
   */
  ngOnChanges(changes: SimpleChanges){
    this.cdr.detectChanges();
    this.contentType = this.utilService.checkIfImage(this.mimeType) ?
      'image' :
      'document';

    let elementUrl : string | undefined;

    log.info('Checking mimeType: ', this.mimeType);
    if(this.mimeType?.includes('doc'))
      elementUrl = this.isBase64 ? this.utilService.generateURLFromBase64String(this.mimeType,
          this.base64String)
        : this.srcUrl;
    else
      elementUrl =
        this.isBase64 ?
          'data:' + this.mimeType + ';base64,' + this.base64String
          : this.srcUrl;

    log.info('Element url: ', elementUrl);
    if (elementUrl != null) {
      this.docPath = elementUrl;
    }
  }

}
