import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'fileExtension'
})
export class FileExtensionPipe implements PipeTransform {

  transform(value: string): string {
    // return value ? value.substring( value.lastIndexOf('.') + 1, value.length) : null;

    let extractedString = /^.+\.([^.]+)$/.exec(value);
    return extractedString ? extractedString[1] : "";
  }

}
