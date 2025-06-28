import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'truncate'
})
export class TruncatePipe implements PipeTransform {

  transform(value: string, wordLimit: number): string {
    if (!value) return '';
    const words = value.split(/\s+/).filter(word => word.length > 0);
    if (words.length <= wordLimit) {
      return value; // Return original if within limit
    }
    return words.slice(0, wordLimit).join(' ') + '...';
    
  }

}
