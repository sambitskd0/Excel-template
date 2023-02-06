import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'mobilePan'
})
export class MobilePanPipe implements PipeTransform {

  transform(value: string, maskMobilePan :boolean): unknown {
   
    if(!maskMobilePan || value.length < 10) {     
     return value;
   }
   return 'XXX-XXX-' + value.slice(-4);
  }

}
