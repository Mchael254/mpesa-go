import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'nationality'
})
export class NationalityPipe implements PipeTransform {

  transform(countryList: any[], code: number): string {
    if(countryList?.length > 0){

    const country = countryList.find(data => data['id'] === code);
    if (country) {
      return country['nationality'];
    }
    return code?.toString();
  }
  return code?.toString();
}
}
