import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError,Observable, Subject,throwError } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class InventoryService {

  constructor(private httpClient: HttpClient) { }
  private masterAPI = environment.masterAPI;
  private teacherAPI = environment.teacherAPI;
  private schoolAPI = environment.schoolAPI;
  private inventoryAPI = environment.inventoryAPI;
  private refreshRequired = new Subject<void>();
  get RefreshRequired() {
    return this.refreshRequired;
  }
  httpOptions = {
    headers: new HttpHeaders({
      "Content-Type": "multipart/form-data",
      Accept: "application/json",
    }),
  };

  getAssetType() {
    // alert(assetId);
    return this.httpClient
      .post(
        this.masterAPI + "/viewAssetCategory",      
        this.httpOptions
      )
      .pipe(catchError(this.errorHandler));
  }
  getAssetItemName(post:any) {
    // alert(assetId);
    return this.httpClient
      .post(
        this.masterAPI + "/viewAssetItem",
      JSON.stringify(post),    
        this.httpOptions
      )
      .pipe(catchError(this.errorHandler));
  }

  addOpeningStock(post: any): Observable<any> {
    return this.httpClient.post(
      this.inventoryAPI + "/addOpeningStock",
      JSON.stringify(post),
      this.httpOptions
    );
  }  
  viewOpeningStock(post: any): Observable<any> {
    return this.httpClient
    .post(
      this.inventoryAPI + "/viewOpeningStock",      
      Object.assign(post)
    )
    .pipe(catchError(this.errorHandler));   
  }
  deleteOpeningStock(postParams: any): Observable<any> {
    return this.httpClient
      .post(this.inventoryAPI + "/deleteOpeningStock" , postParams, this.httpOptions)
      .pipe(catchError(this.errorHandler));
  }  
  getOpeningStock(encId: string): Observable<any> {
    return this.httpClient
      .post(
        this.inventoryAPI + "/getOpeningStock",
        JSON.stringify({ encId: encId}),
        this.httpOptions
      )
      .pipe(catchError(this.errorHandler));
  }
  updateOpeningStock(post: any): Observable<any>{
    return this.httpClient.post(
      this.inventoryAPI + "/updateOpeningStock",
      JSON.stringify(post),
      this.httpOptions
    );
  }
  dupOpeningStock(post:any): Observable<any> {
    return this.httpClient
      .post(
        this.inventoryAPI + "/dupOpeningStock",
        JSON.stringify(post),
        this.httpOptions
      )
      .pipe(catchError(this.errorHandler));
  }
  
  addStockIn(post: any): Observable<any> {
    return this.httpClient.post(
      this.inventoryAPI + "/addStockIn",
      JSON.stringify(post),
      this.httpOptions
    );
  }
  dupStockIn(post:any): Observable<any> {
    return this.httpClient
      .post(
        this.inventoryAPI + "/dupStockIn",
        JSON.stringify(post),
        this.httpOptions
      )
      .pipe(catchError(this.errorHandler));
  }
  viewStockIn(post: any): Observable<any> {
    return this.httpClient
    .post(
      this.inventoryAPI + "/viewStockIn",      
      Object.assign(post)
    )
    .pipe(catchError(this.errorHandler));   
  }
  getStockInList(encId: string,schoolId:string): Observable<any> {
    return this.httpClient
      .post(
        this.inventoryAPI + "/getStockInList",
        JSON.stringify({ encId: encId ,schoolId:schoolId}),
        this.httpOptions
      )
      .pipe(catchError(this.errorHandler));
  }
  deleteStockIn(postParams: any): Observable<any> {
    return this.httpClient
      .post(this.inventoryAPI + "/deleteStockIn" , postParams, this.httpOptions)
      .pipe(catchError(this.errorHandler));
  } 
  addDamageItem(post: any): Observable<any> {
    return this.httpClient.post(
      this.inventoryAPI + "/addDamageItem",
      JSON.stringify(post),
      this.httpOptions
    );
  }
  dupDamageItem(post:any): Observable<any> {
    return this.httpClient
      .post(
        this.inventoryAPI + "/dupDamageItem",
        JSON.stringify(post),
        this.httpOptions
      )
      .pipe(catchError(this.errorHandler));
  }
  viewDamageItem(post: any): Observable<any> {
    return this.httpClient
    .post(
      this.inventoryAPI + "/viewDamageItem",      
      Object.assign(post)
    )
    .pipe(catchError(this.errorHandler));   
  }
  deleteDamageItem(postParams: any): Observable<any> {
    return this.httpClient
      .post(this.inventoryAPI + "/deleteDamageItem" , postParams, this.httpOptions)
      .pipe(catchError(this.errorHandler));
  }
  getDamageItem(encId: string): Observable<any> {
    return this.httpClient
      .post(
        this.inventoryAPI + "/getDamageItem",
        JSON.stringify({ encId: encId}),
        this.httpOptions
      )
      .pipe(catchError(this.errorHandler));
  }
  updateDamageItem(post: any): Observable<any>{
    return this.httpClient.post(
      this.inventoryAPI + "/updateDamageItem",
      JSON.stringify(post),
      this.httpOptions
    );
  }
  quantityCheckDamageItem(post:any): Observable<any> {
    return this.httpClient
      .post(
        this.inventoryAPI + "/quantityCheckDamageItem",
        JSON.stringify(post),
        this.httpOptions
      )
      .pipe(catchError(this.errorHandler));
  }
  getTotalStock(schoolId:any) {
    // alert(assetId);
    return this.httpClient
      .post(
        this.inventoryAPI + "/stockTotal",   
        Object.assign(schoolId),   
        this.httpOptions
      )
      .pipe(catchError(this.errorHandler));
  }
  viewInventoryStockStatus(post: any): Observable<any> {
    return this.httpClient
    .post(
      this.inventoryAPI + "/viewInventoryStockStatus",      
      Object.assign(post)
    )
    .pipe(catchError(this.errorHandler));   
  }
  getUnitofStock(schoolId:any) {
    // alert(assetId);
    return this.httpClient
      .post(
        this.inventoryAPI + "/getUnitofStock",   
        Object.assign(schoolId),   
        this.httpOptions
      )
      .pipe(catchError(this.errorHandler));
  }
  selectItemModal(post:any) {
    // alert(assetId);
    return this.httpClient
      .post(
        this.inventoryAPI + "/selectItemModal",   
        JSON.stringify(post),
        this.httpOptions
      )
      .pipe(catchError(this.errorHandler));
  }
  viewSystemGenCode(post: any): Observable<any> {
    return this.httpClient
    .post(
      this.inventoryAPI + "/viewSystemGenCode",      
      Object.assign(post)
    )
    .pipe(catchError(this.errorHandler));   
  }
  viewSystemGenCodeStockIn(post: any): Observable<any> {
    return this.httpClient
    .post(
      this.inventoryAPI + "/viewSystemGenCodeStockIn",      
      Object.assign(post)
    )
    .pipe(catchError(this.errorHandler));   
  }
  updateAssetItemCode(post: any): Observable<any>{
    return this.httpClient.post(
      this.inventoryAPI + "/updateAssetItemCode",
      JSON.stringify(post),
      this.httpOptions
    );
  }
  viewDamageList(post: any): Observable<any> {
    return this.httpClient
    .post(
      this.inventoryAPI + "/viewDamageList",      
      Object.assign(post)
    )
    .pipe(catchError(this.errorHandler));   
  }
  errorHandler(error: any) {
    let errorMessage = "";
    if (error.error instanceof ErrorEvent) {
      errorMessage = error.error.message;
    } else {
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    return throwError(() => new Error(errorMessage));
  }
}
