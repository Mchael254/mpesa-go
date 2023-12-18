import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'sentenceCase'
})
export class SentenceCasePipe implements PipeTransform {

  transform(value: string): string {
    if (!value) return value;

    // Convert the first character to uppercase and the rest to lowercase
    return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
  }

}
