/**
 * Created By  : Sambit Kumar Dalai
 * Created On  : 20-05-2022
 * Description : Common auto focus directive.
 **/

import { AfterViewInit, Directive, ElementRef } from '@angular/core';

@Directive({
  selector: '[appAutoFocus]',
})
export class AutoFocusDirective implements AfterViewInit{
  constructor(private elementRef: ElementRef) {}
  ngAfterViewInit() {
    this.elementRef.nativeElement.focus();
  }
}
