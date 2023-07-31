import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[appHideMessage]'
})
export class HideMessageDirective {

  constructor(
  ) { }

  @HostListener('click', ['$event.target'])
  onClick(elem: HTMLDivElement): void {
    if (!elem) {
      return;
    }
    if (elem.classList.contains('action')) {
      (elem.parentElement as any).style.display = 'none';
    }
  }
}
