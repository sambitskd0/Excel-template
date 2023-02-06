import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddBlockComponent } from './manageBlock/add-block/add-block.component';
import { EditBlockComponent } from './manageBlock/edit-block/edit-block.component';
import { ViewBlockComponent } from './manageBlock/view-block.component';
import { AddClusterComponent } from './manageCluster/add-cluster/add-cluster.component';
import { EditClusterComponent } from './manageCluster/edit-cluster/edit-cluster.component';
import { ViewClusterComponent } from './manageCluster/view-cluster.component';
import { AddDistrictComponent } from './manageDistrict/add-district/add-district.component';
import { EditDistrictComponent } from './manageDistrict/edit-district/edit-district.component';
import { ViewDistrictComponent } from './manageDistrict/view-district.component';
import { AddNagarNigamComponent } from './manageNagarNigam/add-nagar-nigam/add-nagar-nigam.component';
import { EditNagarNigamComponent } from './manageNagarNigam/edit-nagar-nigam/edit-nagar-nigam.component';
import { ViewNagarNigamComponent } from './manageNagarNigam/view-nagar-nigam.component';
import { AddAppointSubjectComponent } from './manageAppointSubject/add-appoint-subject/add-appoint-subject.component';
import { EditAppointSubjectComponent } from './manageAppointSubject/edit-appoint-subject/edit-appoint-subject.component';
import { ViewAppointSubjectComponent } from './manageAppointSubject/view-appoint-subject.component';
import { MasterComponent } from './master.component';
import { AddWardVillageComponent } from './manageWardVillage/add-ward-village/add-ward-village.component';
import { EditWardVillageComponent } from './manageWardVillage/edit-ward-village/edit-ward-village.component';
import { ViewWardVillageComponent } from './manageWardVillage/view-ward-village.component';
import { ViewSubjectComponent } from './manageSubject/view-subject.component';
import { AddSubjectComponent } from './manageSubject/add-subject/add-subject.component';
import { EditSubjectComponent } from './manageSubject/edit-subject/edit-subject.component';

import { AddDeviceInfoComponent } from './manageDeviceInfo/add-device-info/add-device-info.component';
import { EditDeviceInfoComponent } from './manageDeviceInfo/edit-device-info/edit-device-info.component';
import { ViewDeviceInfoComponent } from './manageDeviceInfo/view-device-info.component';
import { EditConfigureGeofencingComponent } from './manageConfigureGeofencing/edit-configure-geofencing.component';

import {ViewFeedbackCategoryComponent} from './manageFeedbackCategory/view-feedback-category.component';
import { EditFeedbackCategoryComponent } from './manageFeedbackCategory/edit-feedback-category/edit-feedback-category.component';
import { AddFeedbackCategoryComponent } from './manageFeedbackCategory/add-feedback-category/add-feedback-category.component';

import { ViewAssetCategoryComponent } from './manageAssetCategory/view-asset-category.component';
import { AddAssetCategoryComponent } from './manageAssetCategory/add-asset-category/add-asset-category.component';
import { EditAssetCategoryComponent } from './manageAssetCategory/edit-asset-category/edit-asset-category.component';

import { AddAssetItemComponent } from './manageAssetCategory/items/add-asset-item/add-asset-item.component';
import { ViewAssetItemComponent } from './manageAssetCategory/items/view-asset-item.component';
import { EditAssetItemComponent } from './manageAssetCategory/items/edit-asset-item/edit-asset-item.component';

import { AddShiftmasterComponent } from './manageShiftMaster/add-shiftmaster/add-shiftmaster.component';
import { EditShiftmasterComponent } from './manageShiftMaster/edit-shiftmaster/edit-shiftmaster.component';
import { ViewShiftmasterComponent } from './manageShiftMaster/view-shiftmaster.component';
import { AddEventtypeComponent } from './manageEventType/add-eventtype/add-eventtype.component';
import { EditEventtypeComponent } from './manageEventType/edit-eventtype/edit-eventtype.component';
import { ViewEventtypeComponent } from './manageEventType/view-eventtype.component';
import { AddEventcategoryComponent } from './manageEventType/Eventcategory/add-eventcategory/add-eventcategory.component';
import { EditEventcategoryComponent } from './manageEventType/Eventcategory/edit-eventcategory/edit-eventcategory.component';
import { ViewEventcategoryComponent } from './manageEventType/Eventcategory/view-eventcategory.component';
import { AddEventmasterComponent } from './manageEventType/Eventmaster/add-eventmaster/add-eventmaster.component';
import { EditEventmasterComponent } from './manageEventType/Eventmaster/edit-eventmaster/edit-eventmaster.component';
import { ViewEventmasterComponent } from './manageEventType/Eventmaster/view-eventmaster.component';
import { ViewStudentgrademasterComponent } from './manageStudentGradeMaster/view-studentgrademaster.component';
import { RoleGuard } from 'src/app/core/guards/role.guard';
import { ViewSubjectTaggingComponent } from './manageSubject/subjectTagging/view-subject-tagging.component';
import { EditSubjectTaggingComponent } from './manageSubject/subjectTagging/edit-subject-tagging/edit-subject-tagging.component';
import { AddExaminationmasterComponent } from './manageExaminationMaster/add-examinationmaster/add-examinationmaster.component';
import { EditExaminationmasterComponent } from './manageExaminationMaster/edit-examinationmaster/edit-examinationmaster.component';
import { ViewExaminationmasterComponent } from './manageExaminationMaster/view-examinationmaster.component';
import { AddMarkconfigurationComponent } from './manageExaminationMaster/markConfiguration/add-markconfiguration/add-markconfiguration.component';
import { EditMarkconfigurationComponent } from './manageExaminationMaster/markConfiguration/edit-markconfiguration/edit-markconfiguration.component';
import { ViewMarkconfigurationComponent } from './manageExaminationMaster/markConfiguration/view-markconfiguration.component';
import { AddSubjecttaggingComponent } from './manageSubject/subjectTagging/add-subjecttagging/add-subjecttagging.component';
import { ViewNotificationCategoryComponent } from './manageNotificationCategory/view-notification-category.component';
import { EditNotificationCategoryComponent } from './manageNotificationCategory/edit-notification-category/edit-notification-category.component';
import { AddNotificationCategoryComponent } from './manageNotificationCategory/add-notification-category/add-notification-category.component';
import { ViewNotificationComponentComponent } from './manageNotificationComponent/view-notification-component.component';
import { EditNotificationComponentComponent } from './manageNotificationComponent/edit-notification-component/edit-notification-component.component';
import { AddNotificationComponentComponent } from './manageNotificationComponent/add-notification-component/add-notification-component.component';
import { AddAnnextureMasterComponent } from './manageAnnextureMaster/add-annexture-master/add-annexture-master.component';
import { EditAnnextureMasterComponent } from './manageAnnextureMaster/edit-annexture-master/edit-annexture-master.component';
import { ViewAnnextureMasterComponent } from './manageAnnextureMaster/view-annexture-master.component';


const routes: Routes = [
  {path:"", component:MasterComponent, canActivate: [RoleGuard], data: {role: 'admin'} },
  {
    path: 'manageDistrict',
    component: MasterComponent,
    children: [
      { path: '', redirectTo: 'viewDistrict' },
      { path: 'addDistrict', component: AddDistrictComponent,canActivate: [RoleGuard], data: {role: 'admin'} },
      { path: 'editDistrict/:encId', component: EditDistrictComponent,canActivate: [RoleGuard], data: {role: 'admin'} },
      { path: 'viewDistrict', component: ViewDistrictComponent,canActivate: [RoleGuard], data: {role: 'view'} },
    ],
  },
  {
    path: 'manageBlock',
    component: MasterComponent,
    children: [
      { path: '', redirectTo: 'viewBlock' },
      { path: 'addBlock', component: AddBlockComponent,canActivate: [RoleGuard], data: {role: 'admin'} },
      { path: 'editBlock/:encId', component: EditBlockComponent,canActivate: [RoleGuard], data: {role: 'admin'} },
      { path: 'viewBlock', component: ViewBlockComponent,canActivate: [RoleGuard], data: {role: 'view'} },
    ],
  },
  {
    path: 'manageCluster',
    component: MasterComponent,
    children: [
      { path: '', redirectTo: 'viewCluster' },
      { path: 'addCluster', component: AddClusterComponent,canActivate: [RoleGuard], data: {role: 'admin'} },
      { path: 'editCluster/:encId', component: EditClusterComponent,canActivate: [RoleGuard], data: {role: 'admin'} },
      { path: 'viewCluster', component: ViewClusterComponent,canActivate: [RoleGuard], data: {role: 'view'} },
    ],
  },
  {
    path: 'manageNagarNigam',
    component: MasterComponent,
    children: [
      { path: '', redirectTo: 'viewNagarNigam' },
      { path: 'addNagarNigam', component: AddNagarNigamComponent,canActivate: [RoleGuard], data: {role: 'admin'}  },
      { path: 'editNagarNigam/:encId', component: EditNagarNigamComponent,canActivate: [RoleGuard], data: {role: 'admin'}  },
      { path: 'viewNagarNigam', component: ViewNagarNigamComponent,canActivate: [RoleGuard], data: {role: 'view'} },
    ],
  },
  {
    path: 'manageAppointSubject',
    component: MasterComponent,
    children: [
      { path: '', redirectTo: 'viewAppointSubject' },
      { path: 'addAppointSubject', component: AddAppointSubjectComponent,canActivate: [RoleGuard], data: {role: 'admin'} },
      { path: 'editAppointSubject/:encId',component: EditAppointSubjectComponent,canActivate: [RoleGuard], data: {role: 'admin'} },
      { path: 'viewAppointSubject', component: ViewAppointSubjectComponent,canActivate: [RoleGuard], data: {role: 'view'} },
    ],
  },
  {
    path: 'manageWardVillage',
    component: MasterComponent,
    children: [
      { path: '', redirectTo: 'viewWardVillage' },
      { path: 'addWardVillage', component: AddWardVillageComponent,canActivate: [RoleGuard], data: {role: 'admin'}   },
      { path: 'editWardVillage/:encId', component: EditWardVillageComponent,canActivate: [RoleGuard], data: {role: 'admin'}   },
      { path: 'viewWardVillage', component: ViewWardVillageComponent,canActivate: [RoleGuard], data: {role: 'view'}   },
    ],
  },{

    path: 'manageSubject',
    component: MasterComponent,
    children: [
      { path: '', redirectTo: 'viewSubject' },
      { path: 'addSubject', component: AddSubjectComponent,canActivate: [RoleGuard], data: {role: 'admin'} },
      { path: 'editSubject/:encId', component: EditSubjectComponent,canActivate: [RoleGuard], data: {role: 'admin'} },
      { path: 'viewSubject', component: ViewSubjectComponent,canActivate: [RoleGuard], data: {role: 'view'} },
     
    ],
  },
  {

    path: 'manageSubject/subjectTagging',
    component: MasterComponent,
    children: [
      { path: '', redirectTo: 'viewSubjectTagging' },
      { path: 'addSubjectTagging', component: AddSubjecttaggingComponent,canActivate: [RoleGuard], data: {role: 'admin', linkType: 'TB'}},
    { path: 'viewSubjectTagging', component: ViewSubjectTaggingComponent,canActivate: [RoleGuard], data: {role: 'view', linkType: 'TB'} },
      { path: 'editSubjectTagging/:encId/:streamId/:groupId', component:  EditSubjectTaggingComponent,canActivate: [RoleGuard], data: {role: 'admin', linkType: 'TB'} },
    ],
  },
  {
  path: 'manageFeedbackCategory',
  component: MasterComponent,
  children: [
    { path: '', redirectTo: 'viewFeedbackCategory' },
    { path: 'addFeedbackCategory', component: AddFeedbackCategoryComponent,canActivate: [RoleGuard], data: {role: 'admin'}   },
    { path: 'editFeedbackCategory/:encId', component: EditFeedbackCategoryComponent,canActivate: [RoleGuard], data: {role: 'admin'}   },
    { path: 'viewFeedbackCategory', component: ViewFeedbackCategoryComponent,canActivate: [RoleGuard], data: {role: 'view'}   },
  ],
},
  {
    path: 'manageAssetCategory',
    component: MasterComponent,
    children: [
      { path: '', redirectTo: 'viewAssetCategory' },
      { path: 'addAssetCategory', component: AddAssetCategoryComponent, canActivate: [RoleGuard], data: {role: 'admin'}  },      
      { path: 'editAssetCategory/:encId', component: EditAssetCategoryComponent, canActivate: [RoleGuard], data: {role: 'admin'} },
      { path: 'viewAssetCategory', component: ViewAssetCategoryComponent, canActivate: [RoleGuard], data: {role: 'view'} },
    ],
  },
  {
    path: 'manageAssetCategory/items',
    component: MasterComponent,
    children: [
      { path: '', redirectTo: 'viewAssetItem' },
      { path: 'addAssetItem', component: AddAssetItemComponent, canActivate: [RoleGuard], data: {role: 'admin', linkType: 'TB'}  },      
      { path: 'editAssetItem/:encId', component: EditAssetItemComponent, canActivate: [RoleGuard], data: {role: 'admin', linkType: 'TB'}  },
      { path: 'viewAssetItem', component: ViewAssetItemComponent, canActivate: [RoleGuard], data: {role: 'view', linkType: 'TB'}  },
    ],
  },

{
  path: 'manageDeviceInfo',
  component: MasterComponent,
  children: [
    { path: '', redirectTo: 'viewDeviceInfo' },
    { path: 'addDeviceInfo', component: AddDeviceInfoComponent,canActivate: [RoleGuard], data: {role: 'admin'} },
    { path: 'editDeviceInfo/:encId', component: EditDeviceInfoComponent,canActivate: [RoleGuard], data: {role: 'admin'}},
    { path: 'viewDeviceInfo', component: ViewDeviceInfoComponent,canActivate: [RoleGuard], data: {role: 'view'} },
  ],
},
{
path: 'manageGeoFencing',
  component: MasterComponent,
  children: [
    { path: 'editGeoFencing', component: EditConfigureGeofencingComponent,canActivate: [RoleGuard], data: {role: 'admin'}},
    { path: '', redirectTo: 'editGeoFencing' },
  ],
},
{
  path: 'manageShiftMaster',
    component: MasterComponent,
    children: [
      {  path: '', redirectTo: 'viewShiftMaster' },
      { path: 'addShiftMaster', component: AddShiftmasterComponent,canActivate: [RoleGuard], data: {role: 'admin'} },
      { path: 'editShiftMaster/:encId', component: EditShiftmasterComponent,canActivate: [RoleGuard], data: {role: 'admin'} },
      { path: 'viewShiftMaster', component: ViewShiftmasterComponent,canActivate: [RoleGuard], data: {role: 'view'} },
    ],
  },
  //Event Type
  {
    path: 'manageEventType',
      component: MasterComponent,
      children: [
        {  path: '', redirectTo: 'viewEventType' },
        { path: 'addEventType', component: AddEventtypeComponent,canActivate: [RoleGuard], data: {role: 'admin'} },
        { path: 'editEventType/:encId', component: EditEventtypeComponent,canActivate: [RoleGuard], data: {role: 'admin'} },
        { path: 'viewEventType', component: ViewEventtypeComponent,canActivate: [RoleGuard], data: {role: 'view'} },
      ],
    },
  // Event category 
    {
      path: 'manageEventType/eventCategory',
        component: MasterComponent,
        children: [
          {  path: '', redirectTo: 'viewEventCategory' },
          { path: 'addEventCategory', component: AddEventcategoryComponent,canActivate: [RoleGuard], data: {role: 'admin'}},
          { path: 'editEventCategory/:encId', component: EditEventcategoryComponent,canActivate: [RoleGuard], data: {role: 'admin'}},
          { path: 'viewEventCategory', component: ViewEventcategoryComponent ,canActivate: [RoleGuard], data: {role: 'view'}},
        ],
      },
 //Event Master  
      {
        path: 'manageEventType/eventMaster',
          component: MasterComponent,
          children: [
            {
              path: '',
              children: [ 
                {  path: '', redirectTo: 'viewEventMaster' },
                { path: 'addEventMaster', component: AddEventmasterComponent,canActivate: [RoleGuard], data: {role: 'admin'} },
                { path: 'editEventMaster/:encId', component: EditEventmasterComponent,canActivate: [RoleGuard], data: {role: 'admin'} },
                { path: 'viewEventMaster', component: ViewEventmasterComponent,canActivate: [RoleGuard], data: {role: 'view'} },
              ],
            },
          ],
        },

        {
          path: 'manageStudentGradeMaster',
            component: MasterComponent,
            children: [
              {
                path: '',
                children: [ 
                  {  path: '', redirectTo: 'viewStudentGradeMaster' },
                 { path: 'viewStudentGradeMaster', component: ViewStudentgrademasterComponent,canActivate: [RoleGuard], data: {role: 'view'} },
                ],
              },
            ],
          }, 

          {
            path: 'manageExaminationMaster',
              component: MasterComponent,
              children: [
                {  path: '', redirectTo: 'viewExaminationMaster' },
                { path: 'addExaminationMaster', component: AddExaminationmasterComponent,canActivate: [RoleGuard], data: {role: 'admin'} },
                { path: 'editExaminationMaster/:encId', component: EditExaminationmasterComponent,canActivate: [RoleGuard], data: {role: 'admin'} },
                { path: 'viewExaminationMaster', component: ViewExaminationmasterComponent,canActivate: [RoleGuard], data: {role: 'view'} },
              ],
            }, 

            {
              path: 'manageExaminationMaster/markConfiguration',
                component: MasterComponent,
                children: [
                  {  path: '', redirectTo: 'addMarkConfiguration' },
                  { path: 'addMarkConfiguration', component: AddMarkconfigurationComponent,canActivate: [RoleGuard], data: {role: 'admin'}  },
                  { path: 'editMarkConfiguration/:encId', component: EditMarkconfigurationComponent,canActivate: [RoleGuard], data: {role: 'admin'} },
                  { path: 'viewMarkConfiguration', component: ViewMarkconfigurationComponent,canActivate: [RoleGuard], data: {role: 'view'}  },
                ],
              },
              {
                path: 'manageNotificationCategory',
                component: MasterComponent,
                children: [
                  { path: '', redirectTo: 'viewNotificationCategory' },
                  { path: 'addNotificationCategory', component: AddNotificationCategoryComponent,canActivate: [RoleGuard], data: {role: 'admin'} },
                  { path: 'editNotificationCategory/:encId', component: EditNotificationCategoryComponent,canActivate: [RoleGuard], data: {role: 'admin'} },
                  { path: 'viewNotificationCategory', component: ViewNotificationCategoryComponent,canActivate: [RoleGuard], data: {role: 'view'} },
                ],
              },
              {
                path: 'manageNotificationComponent',
                component: MasterComponent,
                children: [
                  { path: '', redirectTo: 'viewNotificationComponent' },
                  { path: 'addNotificationComponent', component: AddNotificationComponentComponent,canActivate: [RoleGuard], data: {role: 'admin'} },
                  { path: 'editNotificationComponent/:encId', component: EditNotificationComponentComponent,canActivate: [RoleGuard], data: {role: 'admin'} },
                  { path: 'viewNotificationComponent', component: ViewNotificationComponentComponent,canActivate: [RoleGuard], data: {role: 'view'} },
                ],
              }, 
              {
                path: 'manageAnnextureMaster',
                component: MasterComponent,
                children: [
                  { path: '', redirectTo: 'viewAnnextureMaster' },
                  { path: 'addAnnextureMaster', component: AddAnnextureMasterComponent },
                  { path: 'editAnnextureMaster/:encId', component: EditAnnextureMasterComponent },
                  { path: 'viewAnnextureMaster', component: ViewAnnextureMasterComponent },
                ],
              }, 
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MasterRoutingModule {}
