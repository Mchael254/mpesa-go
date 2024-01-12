import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'diseases'
})
export class DiseasePipe implements PipeTransform {

  transform(diseaseList: any[], code: number): string {
    const disease = diseaseList.find(data => {return data['id'] === code});
    if (disease) {
      return disease['name'];
    }
    return code?.toString();
  }
}
