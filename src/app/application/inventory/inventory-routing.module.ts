import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InventoryComponent } from './inventory.component';
import { AddDamageLostItemComponent } from './manageDamageItem/add-damage-lost-item/add-damage-lost-item.component';
import { EditDamageLostItemComponent } from './manageDamageItem/edit-damage-lost-item/edit-damage-lost-item.component';
import { ViewDamageLostItemComponent } from './manageDamageItem/view-damage-lost-item.component';
import { AddBookMasterComponent } from './manageLibrary/add-book-master/add-book-master.component';
import { AddBookOpeningStockComponent } from './manageLibrary/add-book-opening-stock/add-book-opening-stock.component';
import { AddBookReceiptComponent } from './manageLibrary/add-book-receipt/add-book-receipt.component';
import { AddDamageBookComponent } from './manageLibrary/add-damage-book/add-damage-book.component';
import { EditBookMasterComponent } from './manageLibrary/edit-book-master/edit-book-master.component';
import { EditBookOpeningStockComponent } from './manageLibrary/edit-book-opening-stock/edit-book-opening-stock.component';
import { EditBookReceiptComponent } from './manageLibrary/edit-book-receipt/edit-book-receipt.component';
import { EditDamageBookComponent } from './manageLibrary/edit-damage-book/edit-damage-book.component';
import { ViewBookMasterComponent } from './manageLibrary/view-book-master.component';
import { ViewBookOpeningStockComponent } from './manageLibrary/view-book-opening-stock/view-book-opening-stock.component';
import { ViewBookReceiptComponent } from './manageLibrary/view-book-receipt/view-book-receipt.component';
import { ViewDamageBookComponent } from './manageLibrary/view-damage-book/view-damage-book.component';
import { ViewStockStatusComponent } from './manageLibrary/view-stock-status/view-stock-status.component';
import { AddOpeningStockComponent } from './manageOpeningStock/add-opening-stock/add-opening-stock.component';
import { EditOpeningStockComponent } from './manageOpeningStock/edit-opening-stock/edit-opening-stock.component';
import { ViewOpeningStockComponent } from './manageOpeningStock/view-opening-stock.component';
import { AddStockInComponent } from './manageStockIn/add-stock-in/add-stock-in.component';
import { EditStockInComponent } from './manageStockIn/edit-stock-in/edit-stock-in.component';
import { ViewStockInComponent } from './manageStockIn/view-stock-in.component';
import { InventoryStockStatusComponent } from './stockStatus/inventory-stock-status.component';
import { RoleGuard } from 'src/app/core/guards/role.guard';
import { ViewStockAssetListComponent } from './manageStockIn/view-stock-asset-list/view-stock-asset-list.component';

const routes: Routes = [
  { path: "", component: InventoryComponent, pathMatch: "full",canActivate: [RoleGuard], data: {role: 'admin'} },
  {
    path: "manageOpeningStock",
    component: InventoryComponent,
    children: [
      { path: "", redirectTo: "viewOpeningStock" },
      { path: 'addOpeningStock', component: AddOpeningStockComponent,canActivate: [RoleGuard], data: {role: 'admin'}},
      { path: 'editOpeningStock/:encId', component: EditOpeningStockComponent,canActivate: [RoleGuard], data: {role: 'admin'}},
      { path: 'viewOpeningStock', component: ViewOpeningStockComponent,canActivate: [RoleGuard], data: {role: 'view'}},
    ]
  },
  {
    path: "manageStockIn",
    component: InventoryComponent,
    children: [
      { path: "", redirectTo: "viewStockIn" },
      { path: 'addStockIn', component: AddStockInComponent,canActivate: [RoleGuard], data: {role: 'admin'}},
      { path: 'editStockIn/:encId', component: EditStockInComponent,canActivate: [RoleGuard], data: {role: 'admin'}},
      { path: 'viewStockIn', component: ViewStockInComponent,canActivate: [RoleGuard], data: {role: 'view'}},
      { path: 'viewStockList/:encId', component: ViewStockAssetListComponent,canActivate: [RoleGuard], data: {role: 'view'}},
    ]
  },
  {
    path: "manageDamageItem",
    component: InventoryComponent,
    children: [
      { path: "", redirectTo: "viewDamageItem" },
      { path: 'addDamageItem', component: AddDamageLostItemComponent,canActivate: [RoleGuard], data: {role: 'admin'}},
      { path: 'editDamageItem/:encId', component: EditDamageLostItemComponent,canActivate: [RoleGuard], data: {role: 'admin'}},
      { path: 'viewDamageItem', component: ViewDamageLostItemComponent,canActivate: [RoleGuard], data: {role: 'view'}},
    ]
  },
  {
    path: "stockStatus",
    component: InventoryComponent,
    children: [
      { path: "", redirectTo: "viewStockStatus" },      
      { path: 'viewStockStatus', component: InventoryStockStatusComponent,canActivate: [RoleGuard], data: {role: 'view'}},
    ]
  },
  {
    path: "manageLibrary",
    component: InventoryComponent,
    children: [
      { path: "", redirectTo: "viewBook" },
      { path: 'addBook', component: AddBookMasterComponent,canActivate: [RoleGuard], data: {role: 'admin'}},
      { path: 'editBook/:encId', component: EditBookMasterComponent,canActivate: [RoleGuard], data: {role: 'admin'}},
      { path: 'viewBook', component: ViewBookMasterComponent,canActivate: [RoleGuard], data: {role: 'view'}},
      { path: 'addBookOpeningStock', component: AddBookOpeningStockComponent,canActivate: [RoleGuard], data: {role: 'admin'}},
      { path: 'editBookOpeningStock/:encId', component: EditBookOpeningStockComponent,canActivate: [RoleGuard], data: {role: 'admin'}},
      { path: 'viewBookOpeningStock', component: ViewBookOpeningStockComponent,canActivate: [RoleGuard], data: {role: 'view'}},
      { path: 'addBookReceipt', component: AddBookReceiptComponent,canActivate: [RoleGuard], data: {role: 'admin'}},
      { path: 'editBookReceipt/:encId', component: EditBookReceiptComponent,canActivate: [RoleGuard], data: {role: 'admin'}},
      { path: 'viewBookReceipt', component: ViewBookReceiptComponent,canActivate: [RoleGuard], data: {role: 'view'}},
      { path: 'addDamageBook', component: AddDamageBookComponent,canActivate: [RoleGuard], data: {role: 'admin'}},
      { path: 'editDamageBook/:encId', component: EditDamageBookComponent,canActivate: [RoleGuard], data: {role: 'admin'}},
      { path: 'viewDamageBook', component: ViewDamageBookComponent,canActivate: [RoleGuard], data: {role: 'view'}},
      { path: 'viewStockStatus', component: ViewStockStatusComponent,canActivate: [RoleGuard], data: {role: 'view'}},
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InventoryRoutingModule { }
