/**
 * Created By  : Sambit Kumar Dalai
 * Created On  : 20-05-2022
 * Description : Custom pipe integration in all modules.
 **/

import { CommonModule } from '@angular/common';
import { NgModule } from "@angular/core";
import { TimeFormatPipe } from "../pipes/time-format.pipe";

const allPipes = [TimeFormatPipe];
@NgModule({
  declarations: [...allPipes],
  exports: [...allPipes],
  imports: [CommonModule],

})
export class CustomPipesModule {}
