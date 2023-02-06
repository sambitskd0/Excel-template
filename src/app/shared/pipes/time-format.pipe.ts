/**
 * Created By   : Sambit Kumar Dalai
 * Created On   : 24-Aug-2022
 * Description  : Convert time from 24 hour to 12 hour format
 **/

import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "timeFormat",
})
export class TimeFormatPipe implements PipeTransform {
  transform(time: any): any {
    let hour = time.split(":")[0];
    let min = time.split(":")[1];
    let part = hour >= 12 ? "PM" : "AM";
    if (parseInt(hour) == 0) hour = 12;
    min = (min + "").length == 1 ? `0${min}` : min;
    hour = hour > 12 ? hour - 12 : hour;
    hour = (hour + "").length == 1 ? `0${hour}` : hour;
    return `${hour}:${min} ${part}`;
  }
}
