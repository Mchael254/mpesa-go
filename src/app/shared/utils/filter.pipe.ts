import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'appFilter'
})
export class FilterPipe implements PipeTransform {
  /**
   * Pipe filters the list of elements based on the search text provided
   *
   * @param items list of elements to search in
   * @param searchText search string
   * @returns list of elements filtered by search text or []
   */


  //  transform(items: any[], searchText: string): any[] {
  //   if (!items) {
  //     return [];
  //   }
  //   if (!searchText) {
  //     return items;
  //   }
  //   searchText = searchText.toLocaleLowerCase();
  //   console.log(searchText)
  //   return items.filter(it => {

  //     if (typeof it === 'string') {
  //     return it.toLocaleLowerCase().includes(searchText);
  //       }
  //       return false;

  //   });
  // }

  transform(value: any, input: any): any {
    if (input) {
      return value.filter(val => {
        if (typeof val.propertyName === 'string') {
          return val.propertyName.indexOf(input) >= 0;
        }
        return false;
      });
    } else {
      return value;
    }
    }

}
