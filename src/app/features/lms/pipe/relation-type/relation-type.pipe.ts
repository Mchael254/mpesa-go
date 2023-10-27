import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'relationType'
})
export class RelationTypePipe implements PipeTransform {
  transform(relationTypeList: any[], code: number): string {
    const relationType = relationTypeList.find(data => data['id'] === code);
    if (relationType) {
      return relationType['description'];
    }
    return '';
  }
}
