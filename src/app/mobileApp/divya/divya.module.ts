import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DivyaRoutingModule } from './divya-routing.module';
import { ResourceCenterComponent } from './resource-center/resource-center.component';
import { ResourceCenterTeacherComponent } from './resource-center-teacher/resource-center-teacher.component';
import { DivyaComponent } from './divya.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { KgbvComponent } from './kgbv/kgbv.component';
import { KgbvTeacherComponent } from './kgbv-teacher/kgbv-teacher.component';
import { ArtificialLimbCenterComponent } from './artificial-limb-center/artificial-limb-center.component';
import { ArtificialLimbCenterTeacherComponent } from './artificial-limb-center-teacher/artificial-limb-center-teacher.component';
import { SchoolSurveyComponent } from './school-survey/school-survey.component';
import { SchoolSurveyTeacherComponent } from './school-survey-teacher/school-survey-teacher.component';
import { TrainingComponent } from './training/training.component';
import { TrainingTeacherComponent } from './training-teacher/training-teacher.component';
import { HomeBasedEducationComponent } from './home-based-education/home-based-education.component';
import { HomeBasedEducationTeacherComponent } from './home-based-education-teacher/home-based-education-teacher.component';
import { AnyOtherComponent } from './any-other/any-other.component';
import { CampComponent } from './camp/camp.component';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { SurveyWorkComponent } from './survey-work/survey-work.component';
import { NgxImageCompressService } from 'ngx-image-compress';


@NgModule({
  declarations: [
    ResourceCenterComponent,
    ResourceCenterTeacherComponent,
    DivyaComponent,
    KgbvComponent,
    KgbvTeacherComponent,
    ArtificialLimbCenterComponent,
    ArtificialLimbCenterTeacherComponent,
    SchoolSurveyComponent,
    SchoolSurveyTeacherComponent,
    TrainingComponent,
    TrainingTeacherComponent,
    HomeBasedEducationComponent,
    HomeBasedEducationTeacherComponent,
    AnyOtherComponent,
    CampComponent,
    SurveyWorkComponent
  ],
  imports: [
    CommonModule,
    DivyaRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    BsDatepickerModule.forRoot(),
  ],
  providers: [NgxImageCompressService],
})
export class DivyaModule { }
