import {Component, Input, OnInit, SimpleChanges} from '@angular/core';
import {Logger, UtilService} from "../../services";

import {DomSanitizer} from "@angular/platform-browser";

const log = new Logger('DocViewerComponent');

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

  protected docPath: any;
  public contentType: 'document' | 'image' | 'video' = 'document';

  constructor(private utilService: UtilService,
              private _sanitizer: DomSanitizer
              ) {
  }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges){
    log.info('Setting up document from ', this.isBase64 ? 'base64 string value' : 'url');
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

    if (elementUrl != null) {
      this.docPath = this._sanitizer.bypassSecurityTrustResourceUrl(elementUrl);
    }
  }

}
