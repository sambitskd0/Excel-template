import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, Subject, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LibraryService {

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
  getSessionData(sessionValue:any): Observable<any> {    
    return this.httpClient
      .post(
        this.inventoryAPI + "/getSessionData",
        JSON.stringify(sessionValue),      
       
      )
      ;
  }
  addBook(post: any): Observable<any> {
    return this.httpClient.post(
      this.inventoryAPI + "/addBook",
      JSON.stringify(post),
     
    );
  }  
  viewBookMasterData(post: any): Observable<any> {
    return this.httpClient
    .post(
      this.inventoryAPI + "/viewBookMasterData",      
      Object.assign(post)
    )
    ;   
  }
  // viewBookMasterData(params: HttpParams):Observable<any>{
  //   return this.httpClient.get(this.inventoryAPI + '/viewBookMasterData?' + params.toString());    
  // }
  deleteBookMasterData(postParams: any): Observable<any> {
    return this.httpClient
      .post(this.inventoryAPI + "/deleteBookMasterData" , postParams,)
      ;
  } 
  getBookMaster(encId: string,schoolId:any): Observable<any> {
    return this.httpClient
      .post(
        this.inventoryAPI + "/getBookMaster",
        JSON.stringify({ encId: encId,schoolId:schoolId}),
       
      )
      ;
  }
  updateBookMaster(post: any): Observable<any>{
    return this.httpClient.post(
      this.inventoryAPI + "/updateBookMaster",
      JSON.stringify(post),
     
    );
  }
  viewBookOpeningStockData(post: any): Observable<any> {
    return this.httpClient
    .post(
      this.inventoryAPI + "/viewBookOpeningStockData",      
      Object.assign(post)
    )
    ;   
  }
  // viewBookOpeningStockData(params: HttpParams):Observable<any>{
  //   return this.httpClient.get(this.inventoryAPI + '/viewBookOpeningStockData?' + params.toString());    
  // }
  addBookOpeningStock(post: any): Observable<any> {
    return this.httpClient.post(
      this.inventoryAPI + "/addBookOpeningStock",
      JSON.stringify(post),
     
    );
  } 
  getOpeningStockList(encId: string,schoolId:string): Observable<any> {
    return this.httpClient
      .post(
        this.inventoryAPI + "/getOpeningStockList",
        JSON.stringify({ encId: encId ,schoolId:schoolId}),
       
      )
      ;
  } 
  deleteBookOpeningStock(postParams: any): Observable<any> {
    return this.httpClient
      .post(this.inventoryAPI + "/deleteBookOpeningStock" , postParams,)
      ;
  } 
  addBookReceipt(post: any): Observable<any> {
    return this.httpClient.post(
      this.inventoryAPI + "/addBookReceipt",
      JSON.stringify(post),
     
    );
  }  
  viewBookReceiptData(post: any): Observable<any> {
    return this.httpClient
    .post(
      this.inventoryAPI + "/viewBookReceiptData",      
      Object.assign(post)
    )
    ;   
  }
  // viewBookReceiptData(params: HttpParams):Observable<any>{
  //   return this.httpClient.get(this.inventoryAPI + '/viewBookReceiptData?' + params.toString());    
  // }
  getBookReceiptList(encId: string,schoolId:string): Observable<any> {
    return this.httpClient
      .post(
        this.inventoryAPI + "/getBookReceiptList",
        JSON.stringify({ encId: encId ,schoolId:schoolId}),
       
      )
      ;
  } 
  deleteBookReceipt(postParams: any): Observable<any> {
    return this.httpClient
      .post(this.inventoryAPI + "/deleteBookReceipt" , postParams,)
      ;
  } 
  getBookNo(bookId: string): Observable<any> {
    return this.httpClient
      .post(
        this.inventoryAPI + "/getBookNo",
        JSON.stringify({ bookId: bookId}),
       
      )
      ;
  }
  addDamageBook(post: any): Observable<any> {
    return this.httpClient.post(
      this.inventoryAPI + "/addDamageBook",
      JSON.stringify(post),
     
    );
  } 
  viewBookDamageData(post: any): Observable<any> {
    return this.httpClient
    .post(
      this.inventoryAPI + "/viewBookDamageData",      
      Object.assign(post)
    )
    ;   
  }
  // viewBookDamageData(params: HttpParams):Observable<any>{
  //   return this.httpClient.get(this.inventoryAPI + '/viewBookDamageData?' + params.toString());    
  // }
  deleteDamageBook(postParams: any): Observable<any> {
    return this.httpClient
      .post(this.inventoryAPI + "/deleteDamageBook" , postParams,)
      ;
  }
  getDamageBook(encId: string): Observable<any> {
    return this.httpClient
      .post(
        this.inventoryAPI + "/getDamageBook",
        JSON.stringify({ encId: encId}),
       
      )
      ;
  }
  updateDamageBook(post: any): Observable<any>{
    return this.httpClient.post(
      this.inventoryAPI + "/updateDamageBook",
      JSON.stringify(post),
     
    );
  }
  viewStockStatus(post: any): Observable<any> {
    return this.httpClient
    .post(
      this.inventoryAPI + "/viewStockStatus",      
      Object.assign(post)
    )
    ;   
  }
  // viewStockStatus(params: HttpParams):Observable<any>{
  //   return this.httpClient.get(this.inventoryAPI + '/viewStockStatus?' + params.toString());    
  // }
  getBookAcrdToStock(encId: string,schoolId:any): Observable<any> {
    return this.httpClient
      .post(
        this.inventoryAPI + "/getBookAcrdToStock",
        JSON.stringify({ encId: encId,schoolId:schoolId}),
       
      )
      ;
  }
  
}
