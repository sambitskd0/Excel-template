
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MasterRoutingModule } from "./master-routing.module";
import { MasterComponent } from "./master.component";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { ViewDistrictComponent } from "./manageDistrict/view-district.component";
import { ViewBlockComponent } from "./manageBlock/view-block.component";
import { ViewClusterComponent } from "./manageCluster/view-cluster.component";
import { AddDistrictComponent } from "./manageDistrict/add-district/add-district.component";
import { EditDistrictComponent } from "./manageDistrict/edit-district/edit-district.component";
import { AddBlockComponent } from "./manageBlock/add-block/add-block.component";
import { EditBlockComponent } from "./manageBlock/edit-block/edit-block.component";
import { AddClusterComponent } from "./manageCluster/add-cluster/add-cluster.component";
import { EditClusterComponent } from "./manageCluster/edit-cluster/edit-cluster.component";
import { AutoFocusDirective } from "../../shared/directives/auto-focus.directive";
import { AddNagarNigamComponent } from "./manageNagarNigam/add-nagar-nigam/add-nagar-nigam.component";
import { ViewNagarNigamComponent } from "./manageNagarNigam/view-nagar-nigam.component";
import { EditNagarNigamComponent } from "./manageNagarNigam/edit-nagar-nigam/edit-nagar-nigam.component";
import { ViewAppointSubjectComponent } from './manageAppointSubject/view-appoint-subject.component';
import { AddAppointSubjectComponent } from './manageAppointSubject/add-appoint-subject/add-appoint-subject.component';
import { EditAppointSubjectComponent } from './manageAppointSubject/edit-appoint-subject/edit-appoint-subject.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { AddWardVillageComponent } from './manageWardVillage/add-ward-village/add-ward-village.component';
import { EditWardVillageComponent } from './manageWardVillage/edit-ward-village/edit-ward-village.component';
import { ViewWardVillageComponent } from './manageWardVillage/view-ward-village.component';
import { ViewSubjectComponent } from './manageSubject/view-subject.component';
import { AddSubjectComponent } from './manageSubject/add-subject/add-subject.component';
import { EditSubjectComponent } from './manageSubject/edit-subject/edit-subject.component';

import { ViewDeviceInfoComponent } from './manageDeviceInfo/view-device-info.component';
import { AddDeviceInfoComponent } from './manageDeviceInfo/add-device-info/add-device-info.component';
import { EditDeviceInfoComponent } from './manageDeviceInfo/edit-device-info/edit-device-info.component';

import { EditConfigureGeofencingComponent } from './manageConfigureGeofencing/edit-configure-geofencing.component';

import { ViewFeedbackCategoryComponent } from './manageFeedbackCategory/view-feedback-category.component';
import { EditFeedbackCategoryComponent } from './manageFeedbackCategory/edit-feedback-category/edit-feedback-category.component';
import { AddFeedbackCategoryComponent } from './manageFeedbackCategory/add-feedback-category/add-feedback-category.component';
import { ViewAssetCategoryComponent } from './manageAssetCategory/view-asset-category.component';
import { AddAssetCategoryComponent } from './manageAssetCategory/add-asset-category/add-asset-category.component';
import { EditAssetCategoryComponent } from './manageAssetCategory/edit-asset-category/edit-asset-category.component';
import { ViewAssetItemComponent } from './manageAssetCategory/items/view-asset-item.component';
import { AddAssetItemComponent } from './manageAssetCategory/items/add-asset-item/add-asset-item.component';
import { EditAssetItemComponent } from './manageAssetCategory/items/edit-asset-item/edit-asset-item.component';

import { ViewShiftmasterComponent } from './manageShiftMaster/view-shiftmaster.component';
import { AddShiftmasterComponent } from './manageShiftMaster/add-shiftmaster/add-shiftmaster.component';
import { EditShiftmasterComponent } from './manageShiftMaster/edit-shiftmaster/edit-shiftmaster.component';
import { ViewEventtypeComponent } from './manageEventType/view-eventtype.component';
import { AddEventtypeComponent } from './manageEventType/add-eventtype/add-eventtype.component';
import { EditEventtypeComponent } from './manageEventType/edit-eventtype/edit-eventtype.component';
import { ViewEventcategoryComponent } from './manageEventType/Eventcategory/view-eventcategory.component';
import { AddEventcategoryComponent } from './manageEventType/Eventcategory/add-eventcategory/add-eventcategory.component';
import { EditEventcategoryComponent } from './manageEventType/Eventcategory/edit-eventcategory/edit-eventcategory.component';
import { ViewEventmasterComponent } from './manageEventType/Eventmaster/view-eventmaster.component';
import { AddEventmasterComponent } from './manageEventType/Eventmaster/add-eventmaster/add-eventmaster.component';
import { EditEventmasterComponent } from './manageEventType/Eventmaster/edit-eventmaster/edit-eventmaster.component';
import { ViewStudentgrademasterComponent } from './manageStudentGradeMaster/view-studentgrademaster.component';
import { ViewSubjectTaggingComponent } from './manageSubject/subjectTagging/view-subject-tagging.component';
import { EditSubjectTaggingComponent } from './manageSubject/subjectTagging/edit-subject-tagging/edit-subject-tagging.component';
import { ViewExaminationmasterComponent } from './manageExaminationMaster/view-examinationmaster.component';
import { AddExaminationmasterComponent } from './manageExaminationMaster/add-examinationmaster/add-examinationmaster.component';
import { EditExaminationmasterComponent } from './manageExaminationMaster/edit-examinationmaster/edit-examinationmaster.component';
import { ViewMarkconfigurationComponent } from './manageExaminationMaster/markConfiguration/view-markconfiguration.component';
import { AddMarkconfigurationComponent } from './manageExaminationMaster/markConfiguration/add-markconfiguration/add-markconfiguration.component';
import { EditMarkconfigurationComponent } from './manageExaminationMaster/markConfiguration/edit-markconfiguration/edit-markconfiguration.component';

import { AddSubjecttaggingComponent } from './manageSubject/subjectTagging/add-subjecttagging/add-subjecttagging.component';
import { AngularMaterialModule } from "src/app/shared/modules/angular-material.module";
import { DataTablesModule } from "angular-datatables";
import { ViewNotificationCategoryComponent } from './manageNotificationCategory/view-notification-category.component';
import { AddNotificationCategoryComponent } from './manageNotificationCategory/add-notification-category/add-notification-category.component';
import { EditNotificationCategoryComponent } from './manageNotificationCategory/edit-notification-category/edit-notification-category.component';
import { ViewNotificationComponentComponent } from './manageNotificationComponent/view-notification-component.component';
import { EditNotificationComponentComponent } from './manageNotificationComponent/edit-notification-component/edit-notification-component.component';
import { AddNotificationComponentComponent } from './manageNotificationComponent/add-notification-component/add-notification-component.component';
import { AddAnnextureMasterComponent } from './manageAnnextureMaster/add-annexture-master/add-annexture-master.component';
import { EditAnnextureMasterComponent } from './manageAnnextureMaster/edit-annexture-master/edit-annexture-master.component';
import { ViewAnnextureMasterComponent } from './manageAnnextureMaster/view-annexture-master.component';
import { BsDatepickerModule } from "ngx-bootstrap/datepicker";
import { CustomPipesModule } from "src/app/shared/modules/custom-pipes.module";




@NgModule({
  declarations: [
    MasterComponent,
    ViewDistrictComponent,
    ViewBlockComponent,
    ViewClusterComponent,
    AddDistrictComponent,
    EditDistrictComponent,
    AddBlockComponent,
    EditBlockComponent,
    AddClusterComponent,
    EditClusterComponent,
    AutoFocusDirective,
    AddNagarNigamComponent,
    ViewNagarNigamComponent,
    EditNagarNigamComponent,
    ViewAppointSubjectComponent,
    AddAppointSubjectComponent,
    EditAppointSubjectComponent,
    AddWardVillageComponent,
    EditWardVillageComponent,
    ViewWardVillageComponent,
    ViewSubjectComponent,
    AddSubjectComponent,
    EditSubjectComponent,
    ViewSubjectTaggingComponent,
    EditSubjectTaggingComponent,
    ViewDeviceInfoComponent,
    AddDeviceInfoComponent,
    EditDeviceInfoComponent,
    EditConfigureGeofencingComponent,
    ViewFeedbackCategoryComponent,
    EditFeedbackCategoryComponent,
    AddFeedbackCategoryComponent,
    ViewAssetCategoryComponent,
    AddAssetCategoryComponent,
    EditAssetCategoryComponent,
    ViewAssetItemComponent,
    AddAssetItemComponent,
    EditAssetItemComponent,
    ViewShiftmasterComponent,
    AddShiftmasterComponent,
    EditShiftmasterComponent,
    ViewEventtypeComponent,
    AddEventtypeComponent,
    EditEventtypeComponent,
    ViewEventcategoryComponent,
    AddEventcategoryComponent,
    EditEventcategoryComponent,
    ViewEventmasterComponent,
    AddEventmasterComponent,
    EditEventmasterComponent,
    ViewStudentgrademasterComponent,
    ViewExaminationmasterComponent,
    AddExaminationmasterComponent,
    EditExaminationmasterComponent,
    ViewMarkconfigurationComponent,
    AddMarkconfigurationComponent,
    EditMarkconfigurationComponent,
    AddSubjecttaggingComponent,
    ViewNotificationCategoryComponent,
    AddNotificationCategoryComponent,
    EditNotificationCategoryComponent,
    ViewNotificationComponentComponent,
    EditNotificationComponentComponent,
    AddNotificationComponentComponent,
    AddAnnextureMasterComponent,
    EditAnnextureMasterComponent,
    ViewAnnextureMasterComponent, 
  ],
  imports: [
    CommonModule,
    MasterRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    FormsModule,
    NgxPaginationModule,
    DataTablesModule,
    AngularMaterialModule,
    CustomPipesModule,
    BsDatepickerModule.forRoot(),
  ],
  providers: [
    // CustomValidators,
    // {
    //   provide: HTTP_INTERCEPTORS,
    //   useClass: HttpErrorInterceptor,
    //   multi: true,
    // },
  ],
})
export class MasterModule { }
