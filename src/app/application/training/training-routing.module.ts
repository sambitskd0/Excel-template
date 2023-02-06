import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { TrainingComponent } from "./training.component";
import { ViewTrainingTypeComponent } from "./manageTrainingType/view-training-type.component";
import { AddTrainingTypeComponent } from "./manageTrainingType/add-training-type/add-training-type.component";
import { EditTrainingTypeComponent } from "./manageTrainingType/edit-training-type/edit-training-type.component";
import { ViewSelfTrainingRequestComponent } from "./selfTrainingRequest/view-self-training-request.component";
import { AddSelfTrainingRequestComponent } from "./selfTrainingRequest/add-self-training-request/add-self-training-request.component";
import { EditSelfTrainingRequestComponent } from "./selfTrainingRequest/edit-self-training-request/edit-self-training-request.component";
import { ViewTeacherForTrainingComponent } from "./selectTeacherForTraining/view-teacher-for-training.component";
import { AddTeacherForTrainingComponent } from "./selectTeacherForTraining/add-teacher-for-training/add-teacher-for-training.component";
import { EditTeacherForTrainingComponent } from "./selectTeacherForTraining/edit-teacher-for-training/edit-teacher-for-training.component";
import { ViewAssesmentQuestionComponent } from "./trainingAssessmentQuestion/view-assesment-question.component";
import { AddAssesmentQuestionComponent } from "./trainingAssessmentQuestion/add-assesment-question/add-assesment-question.component";
import { EditAssesmentQuestionComponent } from "./trainingAssessmentQuestion/edit-assesment-question/edit-assesment-question.component";
import { ViewTrainingComponent } from "./manageTraining/view-training.component";
import { ViewTrainingBatchComponent } from "./manageTrainingBatch/view-training-batch.component";
import { AddTrainingBatchComponent } from "./manageTrainingBatch/add-training-batch/add-training-batch.component";
import { EditTrainingBatchComponent } from "./manageTrainingBatch/edit-training-batch/edit-training-batch.component";
import { ViewTeacherListBatchComponent } from "./manageTrainingBatch/view-teacher-list-batch/view-teacher-list-batch.component";
import { ViewAssessmentComponent } from "./manageTrainingAssessment/selfAssessment/view-assessment.component";
import { AssessmentResultComponent } from "./manageTrainingAssessment/assessment-result/assessment-result.component";
import { AppearAssessmentComponent } from "./manageTrainingAssessment/selfAssessment/appear-assessment/appear-assessment.component";
import { ViewAttendenceComponent } from "./teacherTrainingAttendence/view-attendence.component";
import { AddAttendenceComponent } from "./teacherTrainingAttendence/add-attendence/add-attendence.component";
import { ViewAssessmentScheduleComponent } from "./manageAssessmentSchedule/view-assessment-schedule.component";
import { AddAssessmentScheduleComponent } from "./manageAssessmentSchedule/add-assessment-schedule/add-assessment-schedule.component";
import { EditAssessmentScheduleComponent } from "./manageAssessmentSchedule/edit-assessment-schedule/edit-assessment-schedule.component";

const routes: Routes = [
  {
    path: "manageTrainingType",
    component: TrainingComponent,
    children: [
      { path: "", redirectTo: "viewTrainingType" },
      { path: "addTrainingType", component: AddTrainingTypeComponent },
      { path: "viewTrainingType", component: ViewTrainingTypeComponent },
      { path: "editTrainingType/:encId", component: EditTrainingTypeComponent, },
      { path: "viewAssesmentQuestion", component: ViewAssesmentQuestionComponent, },
      { path: "addAssesmentQuestion", component: AddAssesmentQuestionComponent, },
      { path: "editAssesmentQuestion/:encId", component: EditAssesmentQuestionComponent, },
      { path: "ViewTraining", component: ViewTrainingComponent },
    ],
  },

  {
    path: "manageTrainingRequest",
    component: TrainingComponent,
    children: [
      { path: "", redirectTo: "view" },
      { path: "view", component: ViewSelfTrainingRequestComponent,},
      { path: "add", component: AddSelfTrainingRequestComponent, },
      { path: "edit/:encId", component: EditSelfTrainingRequestComponent,},
    ],
  },

  {
    path: "manageTeacherForTraining",
    component: TrainingComponent,
    children: [
      { path: "", redirectTo: "view" },
      { path: "view", component: ViewTeacherForTrainingComponent, },
      { path: "add/:encId", component: AddTeacherForTrainingComponent, },
      { path: "add", component: AddTeacherForTrainingComponent, },
      { path: "edit/:encId", component: EditTeacherForTrainingComponent, },
    ],
  },

  {
    path: "manageTrainingBatch",
    component: TrainingComponent,
    children: [
      { path: "", redirectTo: "viewTrainingBatch" },
      { path: "viewTrainingBatch", component: ViewTrainingBatchComponent },
      { path: "addTrainingBatch", component: AddTrainingBatchComponent },
      { path: "editTrainingBatch/:encId", component: EditTrainingBatchComponent, },
      { path: "viewTeacherListBatch", component: ViewTeacherListBatchComponent, },
    ],
  },
  {
    path: "manageAssessment",
    component: TrainingComponent,
    children: [
      { path: "", redirectTo: "view" },
      { path: "view", component: ViewAssessmentComponent },
      { path: "appear/:encId/:assessmentType", component: AppearAssessmentComponent, },
      { path: "result", component: AssessmentResultComponent },
    ],
  },

  {
    path: "manageTrainingAttendence",
    component: TrainingComponent,
    children: [
      { path: "", redirectTo: "viewAttendence" },
      { path: "viewAttendence", component: ViewAttendenceComponent },
      { path: "addAttendence", component: AddAttendenceComponent },
    ],
  },
  {
    path: "manageAssessmentSchedule",
    component: TrainingComponent,
    children: [
      { path: "", redirectTo: "view" },
      { path: "view", component: ViewAssessmentScheduleComponent },
      { path: "add", component: AddAssessmentScheduleComponent },
      { path: "edit/:encId", component: EditAssessmentScheduleComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TrainingRoutingModule {}
