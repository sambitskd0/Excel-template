import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'mask'
})
export class MaskPipe implements PipeTransform {

  transform(value: string, showMask :boolean): unknown {
    if (!showMask || value.length < 12) {
      return value;
    }
    return 'XXXX-XXXX-' + value.slice(-4);
  }

}
