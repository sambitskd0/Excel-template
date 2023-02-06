import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { PageNotFoundComponent } from "../page-not-found/page-not-found.component";
import { SuccessComponent } from "../success/success.component";
import { AnyOtherComponent } from "./any-other/any-other.component";
import { ArtificialLimbCenterTeacherComponent } from "./artificial-limb-center-teacher/artificial-limb-center-teacher.component";
import { ArtificialLimbCenterComponent } from "./artificial-limb-center/artificial-limb-center.component";
import { CampComponent } from "./camp/camp.component";
import { DivyaComponent } from "./divya.component";
import { HomeBasedEducationTeacherComponent } from "./home-based-education-teacher/home-based-education-teacher.component";
import { HomeBasedEducationComponent } from "./home-based-education/home-based-education.component";
import { KgbvTeacherComponent } from "./kgbv-teacher/kgbv-teacher.component";
import { KgbvComponent } from "./kgbv/kgbv.component";
import { ResourceCenterTeacherComponent } from "./resource-center-teacher/resource-center-teacher.component";
import { ResourceCenterComponent } from "./resource-center/resource-center.component";
import { SchoolSurveyTeacherComponent } from "./school-survey-teacher/school-survey-teacher.component";
import { SchoolSurveyComponent } from "./school-survey/school-survey.component";
import { SurveyWorkComponent } from "./survey-work/survey-work.component";
import { TrainingTeacherComponent } from "./training-teacher/training-teacher.component";
import { TrainingComponent } from "./training/training.component";

const routes: Routes = [
  { path: "", component: DivyaComponent, pathMatch: "full" },
  {
    path: "resourceCenter",
    component: ResourceCenterComponent,
  },
  {
    path: "resourceCenterTeacher",
    component: ResourceCenterTeacherComponent,
  },
  {
    path: "kgbv",
    component: KgbvComponent,
  },
  {
    path: "kgbvTeacher",
    component: KgbvTeacherComponent,
  },
  {
    path: "artificialLimbCenter",
    component: ArtificialLimbCenterComponent,
  },
  {
    path: "artificialLimbCenterTeacher",
    component: ArtificialLimbCenterTeacherComponent,
  },
  {
    path: "schoolSurvey",
    component: SchoolSurveyComponent,
  },
  {
    path: "schoolSurveyTeacher",
    component: SchoolSurveyTeacherComponent,
  },
  {
    path: "training",
    component: TrainingComponent,
  },
  {
    path: "trainingTeacher",
    component: TrainingTeacherComponent,
  },
  {
    path: "homeBasedEducation",
    component: HomeBasedEducationComponent,
  },
  {
    path: "homeBasedEducationTeacher",
    component: HomeBasedEducationTeacherComponent,
  },
  {
    path: "anyOther",
    component: AnyOtherComponent,
  },
  {
    path: "camp",
    component: CampComponent,
  },
  {
    path: "surveyWork",
    component: SurveyWorkComponent,
  },
  {
    path: "success",
    component: SuccessComponent,
  },
  {
    path: "pageNotFound",
    component: PageNotFoundComponent,
  },
  { path: "**", redirectTo: "pageNotFound" },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DivyaRoutingModule {}
