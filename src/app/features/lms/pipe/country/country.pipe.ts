import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'country'
})
export class CountryPipe implements PipeTransform {

  transform(countryList: any[], code: number): string {
    if(countryList?.length > 0){

    const country = countryList.find(data => data['id'] === code);
    if (country) {
      return country['name'];
    }
    return code?.toString();
  }
  return code?.toString();
}
}
