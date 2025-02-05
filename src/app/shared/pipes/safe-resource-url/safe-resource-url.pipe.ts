import { Pipe, PipeTransform } from '@angular/core';
import {DomSanitizer, SafeResourceUrl} from "@angular/platform-browser";

/**
 * Pipe to bypass security trust of a resource url
 * @example
 *   <iframe [src]="url | safeUrl"></iframe>
 *   <img [src]="url | safeUrl">
 *
 *  <object [data]="url | safeUrl"></object>
 *
 *
 */
@Pipe({
  name: 'safeUrl',
  standalone : false
})
export class SafeResourceUrlPipe implements PipeTransform {

  constructor(private sanitizer: DomSanitizer) { }

  /**
   * Bypass security trust of a resource url
   * @param url {string} url to be sanitized
   * @returns {SafeResourceUrl | string} sanitized url
   */
  transform(url: string): SafeResourceUrl | string {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

}
