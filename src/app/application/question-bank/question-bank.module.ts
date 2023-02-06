import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { QuestionBankRoutingModule } from "./question-bank-routing.module";
import { QuestionBankComponent } from "./question-bank.component";
import { ViewQuestionBankComponent } from "./manageQuestionBank/view-question-bank.component";
import { AddQuestionBankComponent } from "./manageQuestionBank/add-question-bank/add-question-bank.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { AngularMaterialModule } from "src/app/shared/modules/angular-material.module";
import { EditQuestionbankComponent } from "./manageQuestionBank/edit-questionbank/edit-questionbank.component";
import { ViewAssessmentScheduleComponent } from "./manageAssessmentSchedule/view-assessment-schedule.component";
import { AddAssessmentScheduleComponent } from "./manageAssessmentSchedule/add-assessment-schedule/add-assessment-schedule.component";
import { EditAssessmentScheduleComponent } from "./manageAssessmentSchedule/edit-assessment-schedule/edit-assessment-schedule.component";
import { ViewAssessmentComponent } from "./manageAppearAssessment/view-assessment.component";
import { AppearAssessmentComponent } from "./manageAppearAssessment/appear-assessment/appear-assessment.component";
import { AssessmentQuestionComponent } from "./manageAppearAssessment/assessment-question/assessment-question.component";
import { ViewAnswerSheetComponent } from "./manageAnswerSheet/view-answer-sheet.component";
import { AddAnswerSheetComponent } from "./manageAnswerSheet/add-answer-sheet/add-answer-sheet.component";
import { EditAnswerSheetComponent } from "./manageAnswerSheet/edit-answer-sheet/edit-answer-sheet.component";
import { DownloadQuestionComponent } from "./manageAppearAssessment/download-question/download-question.component";
import { BsDatepickerModule } from "ngx-bootstrap/datepicker";
import { OnlineResultComponent } from "./manageResult/online-result/online-result.component";
import { AllResultComponent } from "./manageResult/all-result/all-result.component";
import { CustomPipesModule } from "src/app/shared/modules/custom-pipes.module";

@NgModule({
  declarations: [
    QuestionBankComponent,
    ViewQuestionBankComponent,
    AddQuestionBankComponent,
    EditQuestionbankComponent,
    ViewAssessmentScheduleComponent,
    AddAssessmentScheduleComponent,
    EditAssessmentScheduleComponent,
    ViewAssessmentComponent,
    AppearAssessmentComponent,
    AssessmentQuestionComponent,
    OnlineResultComponent,
    AllResultComponent,
    ViewAnswerSheetComponent,
    AddAnswerSheetComponent,
    EditAnswerSheetComponent,
    DownloadQuestionComponent,
  ],
  imports: [
    CommonModule,
    QuestionBankRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    AngularMaterialModule,
    CustomPipesModule,
    BsDatepickerModule.forRoot(),
  ],
})
export class QuestionBankModule {}
