import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'endorsementType'
})
export class EndorsementTypePipe implements PipeTransform {

  transform(endorsementTypeList: any[], code: number): string {
    const relationType = endorsementTypeList.find(data => data['id'] === code);
    if (relationType) {
      return relationType['description'];
    }
    return '';
  }
}
