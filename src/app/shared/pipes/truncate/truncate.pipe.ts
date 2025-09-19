import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'truncate'
})
export class TruncatePipe implements PipeTransform {

  // transform(value: string, wordLimit: number): string {
  //   if (!value) return '';
  //   const words = value.split(/\s+/).filter(word => word.length > 0);
  //   if (words.length <= wordLimit) {
  //     return value; 
  //   }
  //   return words.slice(0, wordLimit).join(' ') + '...';

  // }
  transform(value: any, limit = 25, completeWords = false, ellipsis = '...'): string {
    if (typeof value !== 'string') {
      return '';
    }

    if (completeWords) {
      limit = value.substr(0, limit).lastIndexOf(' ');
    }

    return value.length > limit ? value.substr(0, limit) + ellipsis : value;
  }

}
