import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { TrainingRoutingModule } from "./training-routing.module";
import { ViewTrainingTypeComponent } from "./manageTrainingType/view-training-type.component";
import { AddTrainingTypeComponent } from "./manageTrainingType/add-training-type/add-training-type.component";
import { EditTrainingTypeComponent } from "./manageTrainingType/edit-training-type/edit-training-type.component";
import { TrainingComponent } from "./training.component";
import { DataTablesModule } from "angular-datatables";
import { AngularMaterialModule } from "src/app/shared/modules/angular-material.module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgxPaginationModule } from "ngx-pagination";
import { NgMultiSelectDropDownModule } from "ng-multiselect-dropdown";
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
import { MaskPipe } from "src/app/shared/pipes/mask.pipe";
import { ViewTrainingBatchComponent } from "./manageTrainingBatch/view-training-batch.component";
import { AddTrainingBatchComponent } from "./manageTrainingBatch/add-training-batch/add-training-batch.component";
import { EditTrainingBatchComponent } from "./manageTrainingBatch/edit-training-batch/edit-training-batch.component";
import { BsDatepickerModule } from "ngx-bootstrap/datepicker";
import { ViewTeacherListBatchComponent } from "./manageTrainingBatch/view-teacher-list-batch/view-teacher-list-batch.component";
import { AssessmentResultComponent } from "./manageTrainingAssessment/assessment-result/assessment-result.component";
import { ViewAssessmentComponent } from "./manageTrainingAssessment/selfAssessment/view-assessment.component";
import { AppearAssessmentComponent } from "./manageTrainingAssessment/selfAssessment/appear-assessment/appear-assessment.component";
import { ViewAttendenceComponent } from "./teacherTrainingAttendence/view-attendence.component";
import { AddAttendenceComponent } from "./teacherTrainingAttendence/add-attendence/add-attendence.component"; 
import { AddAssessmentScheduleComponent } from './manageAssessmentSchedule/add-assessment-schedule/add-assessment-schedule.component';
import { ViewAssessmentScheduleComponent } from './manageAssessmentSchedule/view-assessment-schedule.component';
import { EditAssessmentScheduleComponent } from './manageAssessmentSchedule/edit-assessment-schedule/edit-assessment-schedule.component';
import { CustomPipesModule } from "src/app/shared/modules/custom-pipes.module";
 

@NgModule({
  declarations: [
    ViewTrainingTypeComponent,
    AddTrainingTypeComponent,
    EditTrainingTypeComponent,
    TrainingComponent,
    ViewSelfTrainingRequestComponent,
    AddSelfTrainingRequestComponent,
    EditSelfTrainingRequestComponent,
    ViewTeacherForTrainingComponent,
    AddTeacherForTrainingComponent,
    EditTeacherForTrainingComponent,
    ViewAssesmentQuestionComponent,
    AddAssesmentQuestionComponent,
    EditAssesmentQuestionComponent,
    ViewTrainingComponent,
    ViewTrainingBatchComponent,
    AddTrainingBatchComponent,
    EditTrainingBatchComponent,
    ViewTeacherListBatchComponent,
    AssessmentResultComponent,
    ViewAssessmentComponent,
    AppearAssessmentComponent,
    ViewAttendenceComponent,
    AddAttendenceComponent, 
    AddAssessmentScheduleComponent,
    ViewAssessmentScheduleComponent,
    EditAssessmentScheduleComponent
  ],
  imports: [
    CommonModule,
    TrainingRoutingModule,
    DataTablesModule,
    AngularMaterialModule,
    FormsModule,
    ReactiveFormsModule,
    NgxPaginationModule,
    CustomPipesModule,
    NgMultiSelectDropDownModule.forRoot(),
    BsDatepickerModule.forRoot(),
  ],
})
export class TrainingModule {}
