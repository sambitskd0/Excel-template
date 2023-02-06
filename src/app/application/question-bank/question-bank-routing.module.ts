import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AddAnswerSheetComponent } from "./manageAnswerSheet/add-answer-sheet/add-answer-sheet.component";
import { EditAnswerSheetComponent } from "./manageAnswerSheet/edit-answer-sheet/edit-answer-sheet.component";
import { ViewAnswerSheetComponent } from "./manageAnswerSheet/view-answer-sheet.component";
import { AppearAssessmentComponent } from "./manageAppearAssessment/appear-assessment/appear-assessment.component";
import { AssessmentQuestionComponent } from "./manageAppearAssessment/assessment-question/assessment-question.component";
import { DownloadQuestionComponent } from "./manageAppearAssessment/download-question/download-question.component";
import { ViewAssessmentComponent } from "./manageAppearAssessment/view-assessment.component";
import { AddAssessmentScheduleComponent } from "./manageAssessmentSchedule/add-assessment-schedule/add-assessment-schedule.component";
import { EditAssessmentScheduleComponent } from "./manageAssessmentSchedule/edit-assessment-schedule/edit-assessment-schedule.component";
import { ViewAssessmentScheduleComponent } from "./manageAssessmentSchedule/view-assessment-schedule.component";
import { AddQuestionBankComponent } from "./manageQuestionBank/add-question-bank/add-question-bank.component";
import { EditQuestionbankComponent } from "./manageQuestionBank/edit-questionbank/edit-questionbank.component";
import { ViewQuestionBankComponent } from "./manageQuestionBank/view-question-bank.component";
import { QuestionBankComponent } from "./question-bank.component";
import { RoleGuard } from 'src/app/core/guards/role.guard';
import { OnlineResultComponent } from "./manageResult/online-result/online-result.component";
import { AllResultComponent } from "./manageResult/all-result/all-result.component";

const routes: Routes = [
  { path: "", component: QuestionBankComponent, pathMatch: "full",canActivate: [RoleGuard], data: {role: 'admin'} },
  {
    path: "manageQuestionBank",
    component: QuestionBankComponent,
    children: [
      { path: "", redirectTo: "view" },
      { path: "view", component: ViewQuestionBankComponent,canActivate: [RoleGuard], data: {role: 'view'} },
      { path: "add", component: AddQuestionBankComponent,canActivate: [RoleGuard], data: {role: 'admin'} },
      { path: "edit/:encId", component: EditQuestionbankComponent,canActivate: [RoleGuard], data: {role: 'admin'} },
    ],
  },
  {
    path: "manageAssessmentSchedule",
    component: QuestionBankComponent,
    children: [
      { path: "", redirectTo: "view" },
      { path: "view", component: ViewAssessmentScheduleComponent,canActivate: [RoleGuard], data: {role: 'view'} },
      { path: "add", component: AddAssessmentScheduleComponent,canActivate: [RoleGuard], data: {role: 'admin'} },
      { path: "edit/:encId", component: EditAssessmentScheduleComponent,canActivate: [RoleGuard], data: {role: 'admin'} },
    ],
  },
  {
    path: "manageAppearAssessment",
    component: QuestionBankComponent,
    children: [
      { path: "", redirectTo: "view" },
      { path: "view", component: ViewAssessmentComponent,canActivate: [RoleGuard], data: {role: 'view'} },
      { path: "appear/:encId", component: AppearAssessmentComponent,canActivate: [RoleGuard], data: {role: 'admin'} },
      {
        path: "assessmentQuestion/:encId",
        component: AssessmentQuestionComponent,canActivate: [RoleGuard], data: {role: 'admin'}
      },
      { path: "downloadQuestion", component: DownloadQuestionComponent,canActivate: [RoleGuard], data: {role: 'admin'} },
    ],
  },
  {
    path: "manageViewResult",
    component: QuestionBankComponent,
    children: [
      { path: "", redirectTo: "online" },
      { path: "online", component: OnlineResultComponent,canActivate: [RoleGuard], data: {role: 'view'} },
      { path: "all", component: AllResultComponent,canActivate: [RoleGuard], data: {role: 'view'} },
    ],
  },
  {
    path: "manageAnswerSheet",
    component: QuestionBankComponent,
    children: [
      { path: "", redirectTo: "view" },
      { path: "view", component: ViewAnswerSheetComponent,canActivate: [RoleGuard], data: {role: 'view'} },
      { path: "add", component: AddAnswerSheetComponent,canActivate: [RoleGuard], data: {role: 'admin'} },
      { path: "edit/:encId", component: EditAnswerSheetComponent,canActivate: [RoleGuard], data: {role: 'admin'} },
    ],
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class QuestionBankRoutingModule {}
