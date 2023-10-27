import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'coverType'
})
export class CoverTypePipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    return null;
  }

}
