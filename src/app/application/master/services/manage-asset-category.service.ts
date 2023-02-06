import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, Observable, Subject, throwError, tap } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ManageAssetCategoryService {

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
  constructor(private httpClient: HttpClient) { }

  viewAssetData(post: any): Observable<any> {
    return this.httpClient.post(this.apiURL + '/viewAssetCategory', JSON.stringify(post));
  }

  createAsset(post: any): Observable<any> {
    return this.httpClient.post(this.apiURL + '/addAssetCategory', JSON.stringify(post));
  }

  deleteAsset(id: number, userId: any,profileId:any) {
    return this.httpClient.post(this.apiURL + '/deleteAssetCategory', JSON.stringify({ 'encId': id, 'userId': userId,'profileId': profileId }));
  }

  getAssetData(id: number): Observable<any> {
    const allData = { id };
    return this.httpClient.post(this.apiURL + '/getAssetCategory', JSON.stringify(allData));
  }
  updateAsset(post: any) {
    return this.httpClient.post(this.apiURL + '/updateAssetCategory', JSON.stringify(post));
  }
}
function userId(id: number, number: any, userId: any, any: any) {
  throw new Error('Function not implemented.');
}

