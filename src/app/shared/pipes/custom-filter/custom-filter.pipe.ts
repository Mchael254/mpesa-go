import { Pipe, PipeTransform } from '@angular/core';

/**
 * Pipe to filter an array of objects
 *
 * Usage:
 *  array | customFilter: term: excludes
 *  term: string to filter by
 *  excludes: array of object keys to exclude from filter
 *
 *  Example:
 *    <input type="text" [(ngModel)]="searchTerm">
 *      <div *ngFor="let item of items | customFilter:searchTerm:['id','name']">
 *        {{item | json}}
 *        <hr>
 *          </div>
 *          searchTerm = 'foo'
 *          items = [
 *          {id: 1, name: 'foo', description: 'lorem ipsum'},
 *          {id: 2, name: 'bar', description: 'lorem ipsum'},
 *          {id: 3, name: 'baz', description: 'lorem ipsum'},
 *          {id: 4, name: 'foobar', description: 'lorem ipsum'},
 *          {id: 5, name: 'foobaz', description: 'lorem ipsum'},
 *          {id: 6, name: 'barbaz', description: 'lorem ipsum'},
 *          {id: 7, name: 'lorem', description: 'lorem ipsum'},
 *          ]
 *          Result:
 *          {id: 1, name: 'foo', description: 'lorem ipsum'}
 *          {id: 4, name: 'foobar', description: 'lorem ipsum'}
 *          {id: 5, name: 'foobaz', description: 'lorem ipsum'}
 *
 * Pipe will filter by all object keys by default
 */

@Pipe({
  name: 'customFilter',
  standalone : false
})
export class CustomFilterPipe implements PipeTransform {

  transform(items: any, term: string, excludes: any = []): any {
    if (!term || !items) return items;
    return CustomFilterPipe.filter(items, term, excludes);
  }

  static filter(
    items: Array<{ [key: string]: any }>,
    term: string,
    excludes: any
  ): Array<{ [key: string]: any }> {
    const toCompare = term.toLowerCase();

    function checkInside(item: any, term: string) {
      if (
        typeof item === "string" &&
        item
          .toString()
          .toLowerCase()
          .includes(toCompare)
      ) {
        return true;
      }

      for (let property in item) {
        if (
          item[property] === null ||
          item[property] == undefined ||
          excludes.includes(property)
        ) {
          continue;
        }

        if (typeof item[property] === "object") {
          if (checkInside(item[property], term)) {
            return true;
          }
        } else if (
          item[property]
            .toString()
            .toLowerCase()
            .includes(toCompare)
        ) {
          return true;
        }
      }
      return false;
    }

    return items.filter(function (item) {
      return checkInside(item, term);
    });
  }

}
