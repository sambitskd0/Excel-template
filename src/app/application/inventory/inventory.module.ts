import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InventoryRoutingModule } from './inventory-routing.module';
import { InventoryComponent } from './inventory.component';
import { ViewOpeningStockComponent } from './manageOpeningStock/view-opening-stock.component';
import { AddOpeningStockComponent } from './manageOpeningStock/add-opening-stock/add-opening-stock.component';
import { EditOpeningStockComponent } from './manageOpeningStock/edit-opening-stock/edit-opening-stock.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DataTablesModule } from 'angular-datatables';
import { ViewStockInComponent } from './manageStockIn/view-stock-in.component';
import { AddStockInComponent } from './manageStockIn/add-stock-in/add-stock-in.component';
import { EditStockInComponent } from './manageStockIn/edit-stock-in/edit-stock-in.component';
import { ViewDamageLostItemComponent } from './manageDamageItem/view-damage-lost-item.component';
import { AddDamageLostItemComponent } from './manageDamageItem/add-damage-lost-item/add-damage-lost-item.component';
import { EditDamageLostItemComponent } from './manageDamageItem/edit-damage-lost-item/edit-damage-lost-item.component';
import { ViewBookMasterComponent } from './manageLibrary/view-book-master.component';
import { AddBookMasterComponent } from './manageLibrary/add-book-master/add-book-master.component';
import { EditBookMasterComponent } from './manageLibrary/edit-book-master/edit-book-master.component';
import { AddBookOpeningStockComponent } from './manageLibrary/add-book-opening-stock/add-book-opening-stock.component';
import { EditBookOpeningStockComponent } from './manageLibrary/edit-book-opening-stock/edit-book-opening-stock.component';
import { ViewBookOpeningStockComponent } from './manageLibrary/view-book-opening-stock/view-book-opening-stock.component';
import { AddBookReceiptComponent } from './manageLibrary/add-book-receipt/add-book-receipt.component';
import { EditBookReceiptComponent } from './manageLibrary/edit-book-receipt/edit-book-receipt.component';
import { ViewBookReceiptComponent } from './manageLibrary/view-book-receipt/view-book-receipt.component';
import { AddDamageBookComponent } from './manageLibrary/add-damage-book/add-damage-book.component';
import { EditDamageBookComponent } from './manageLibrary/edit-damage-book/edit-damage-book.component';
import { ViewDamageBookComponent } from './manageLibrary/view-damage-book/view-damage-book.component';
import { ViewStockStatusComponent } from './manageLibrary/view-stock-status/view-stock-status.component';
import { AngularMaterialModule } from 'src/app/shared/modules/angular-material.module';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { InventoryStockStatusComponent } from './stockStatus/inventory-stock-status.component';
import { ViewStockAssetListComponent } from './manageStockIn/view-stock-asset-list/view-stock-asset-list.component';
// import { NgbModule } from '@ng-bootstrap/ng-bootstrap';


@NgModule({
  declarations: [
    InventoryComponent,
    ViewOpeningStockComponent,
    AddOpeningStockComponent,
    EditOpeningStockComponent,
    ViewStockInComponent,
    AddStockInComponent,
    EditStockInComponent,
    ViewDamageLostItemComponent,
    AddDamageLostItemComponent,
    EditDamageLostItemComponent,
    ViewBookMasterComponent,
    AddBookMasterComponent,
    EditBookMasterComponent,
    AddBookOpeningStockComponent,
    EditBookOpeningStockComponent,
    ViewBookOpeningStockComponent,
    AddBookReceiptComponent,
    EditBookReceiptComponent,
    ViewBookReceiptComponent,
    AddDamageBookComponent,
    EditDamageBookComponent,
    ViewDamageBookComponent,
    ViewStockStatusComponent,
    InventoryStockStatusComponent,
    ViewStockAssetListComponent,
   
  ],
  imports: [
    CommonModule,
    InventoryRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    DataTablesModule,
    AngularMaterialModule,
    BsDatepickerModule.forRoot(),
    // NgbModule
  ]
})
export class InventoryModule { }
