import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'coverType'
})
export class CoverTypePipe implements PipeTransform {

  transform(coverTypeList: any[], code: number): string {
    if(coverTypeList?.length > 0){
    const coverType = coverTypeList?.find(data => data['id'] === code);
    if (coverType) {
      return coverType['desc'];
    }
    return '-';

  }
    return '-';
  }


}
