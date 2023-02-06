import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { AlertHelper } from 'src/app/core/helpers/alert-helper';
import { InventoryService } from '../../services/inventory.service';
import { PrivilegeHelper } from 'src/app/core/helpers/privilege-helper';
import { CommonserviceService } from 'src/app/core/services/commonservice.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CustomValidators } from 'src/app/shared/validations/custom-validators';

@Component({
  selector: 'app-view-stock-asset-list',
  templateUrl: './view-stock-asset-list.component.html',
  styleUrls: ['./view-stock-asset-list.component.css']
})
export class ViewStockAssetListComponent implements OnInit {
  userProfile:any=[];
  id:any="";
  encId:any="";
  schoolId: any = ''; 
  assetList:any =[];
  assetNameChanged: boolean = false;
  assetData: any = [];
  assetTypeData:any =[];
  assetNameData:any =[];
  totalAmount:any="";
  quantityModal:any="";
  assetItemIdModal:any="";
  stkInIdModal:any="";
  resultListData: any = [];
  isLoading = false;
  constructor(
    private spinner: NgxSpinnerService,
    private alertHelper: AlertHelper,
    private inventoryService: InventoryService,
    private privilegeHelper: PrivilegeHelper,   //For menu privilege
    private route:Router,
    private router: ActivatedRoute,
    public customValidators: CustomValidators,
    private commonService: CommonserviceService) { 
      
    }

  ngOnInit(): void {
    this.userProfile = this.commonService.getUserProfile();
    this.id = this.router.snapshot.params["encId"];
    this.schoolId = this.userProfile.school;
    this.showAssetList(this.id);
    this.getAssetType();
  }
  getAssetType() {    
    this.assetNameChanged = true;
    this.spinner.show();
    this.inventoryService.getAssetType().subscribe({
      next: (data: any) => {
        this.assetData = data;
        this.assetData = this.assetData.data;        
        this.assetNameChanged = false;
        this.spinner.hide();
        this.assetData.forEach((value:any) => { 
            this.assetTypeData[value.assetType] = value.anexture.anxtName;
            this.assetNameData[value.assetCatId] = value.assetName;        
        });      
      },
    });
  }
  showAssetList(encId:string){    
    this.spinner.show();
    this.inventoryService.getStockInList(encId,this.schoolId).subscribe({
      next: (resp: any) => {
        this.assetList = resp?.data;       
        this.assetList.map((item: any) => {        
         this.totalAmount = item.invoiceAmount;
        });       
        this.spinner.hide();
      },
    });
  }
  viewCodeModal(asstItmId:any,qty:any,stkInId:any){
    this.quantityModal = qty; //quantity
    this.assetItemIdModal = asstItmId; //asset Item Name
    this.stkInIdModal = stkInId; //Opening stock id
    // this.beoInitialzeForm();
    // console.log(this.quantityModal,'Quantity');
    const obj ={stockInId : this.stkInIdModal,assetItemId:this.assetItemIdModal,schoolId:this.schoolId} // if Required add it assetItemName:  this.assetItemNameModal , quantity:this.quantityModal,
    this.inventoryService.viewSystemGenCodeStockIn(obj).subscribe({
      next: (res: any) => {
        this.resultListData = res?.data;
       
      },
      error: (error: any) => {
        this.isLoading = false;
        this.spinner.hide();
      },
    });
    
    
  }

}
