import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, Subject, throwError,tap} from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ManageAssetItemService {
  private apiURL = environment.masterAPI;
  private refreshRequired = new Subject<void>();
  get RefreshRequired() {
    return this.refreshRequired;
  }
//  httpOptions = {
//    headers: new HttpHeaders({
//      'Content-Type': 'application/json',
//    }),
//  }
  constructor(private httpClient:HttpClient) { }
  
  createAssetItem(post: any) : Observable<any>{
    return this.httpClient.post(this.apiURL + '/addAssetItem',JSON.stringify(post));
  }
  viewAssetItemData(post:any):Observable<any>{
    return this.httpClient.post(this.apiURL+'/viewAssetItem', JSON.stringify(post));
  }

  deleteAssetItemData(id: number,userId:any,profileId:any){
    return this.httpClient.post(this.apiURL + '/deleteAssetItem',JSON.stringify({'encId':id, 'userId':userId,'profileId':profileId}));
  }
  
  getAssetItemData(id: number): Observable<any> {
    const allData = {id};
    return this.httpClient.post(this.apiURL + '/getAssetItem',JSON.stringify(allData))
  }
  updateAssetItemData(post: any){
    return this.httpClient.post(this.apiURL + '/updateAssetItem', JSON.stringify(post))
  }

  getAssetnameByAssetId(assetType: any){
    return this.httpClient.post(this.apiURL + '/viewAssetCategory',JSON.stringify({assetType}))
  }
}
