import {Directive, ElementRef, HostListener} from '@angular/core';
@Directive({
  selector: '[appCommaFormat]'
})
export class CommaformatDirective {

  constructor(private el: ElementRef) { }

  @HostListener('input')
  onInput() {
    const value = this.el.nativeElement.value;
    const formattedValue = this.formatNumber(value);
    this.el.nativeElement.value = formattedValue;
  }
  private formatNumber(value: string): string {
    // Remove existing commas and convert to number
    const numberValue = Number(value.replace(/,/g, ''));

    // Format the number with commas if it's greater than 1000
    if (numberValue >= 1000) {
      return numberValue.toLocaleString();
    }

    return value;
  }


}
