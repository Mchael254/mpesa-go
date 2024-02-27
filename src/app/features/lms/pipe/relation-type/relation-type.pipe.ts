import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'relationType'
})
export class RelationTypePipe implements PipeTransform {
  transform(relationTypeList: any[], code: number): string {
    if(relationTypeList?.length>0){
    const relationType = relationTypeList.find(data => {return data['id'] === +code});
    if (relationType) {
      return relationType['description'];
    }
    return code?.toString();
  }
  return code?.toString();
}
}
