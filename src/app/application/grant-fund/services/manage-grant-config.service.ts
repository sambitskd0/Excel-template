import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, Subject, throwError,tap } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ManageGrantConfigService {

  private apiURL = environment.grantAPI;

  private refreshRequired = new Subject<void>();
  get RefreshRequired() {
    return this.refreshRequired;
  }
 
  constructor(private httpClient:HttpClient) { }
  viewGrantConfig(post: any): Observable<any> {
    return this.httpClient
   .post(
     this.apiURL + '/viewGrantConfig',
     JSON.stringify(post)
   )
  }
  
  deleteGrantConfig(id: number,userId:any, profileId:any){
    console.log(id);
    return this.httpClient
      .post(this.apiURL + '/deleteGrantConfig',JSON.stringify({'encId':id, 'userId':userId, 'profileId':profileId}))
      .pipe(tap(()=>{
        this.RefreshRequired.next();
      }));
  }
  
  addGrantConfigData(post: any): Observable<any> {
    return this.httpClient.post(
      this.apiURL + '/addGrantConfig',
      JSON.stringify(post)
    )
  }
  
  getGrantTypeData(){
    let post="";
      return this.httpClient.post(
        this.apiURL + '/getGrantTypes',JSON.stringify(post))
    }
  getGrantConfigData(id: number): Observable<any> {
    const allData = {id};
    return this.httpClient.post(
      this.apiURL + '/getGrantConfigData',JSON.stringify(allData))
  }
  
  updateGrantConfigData(post: any){
    return this.httpClient.post(this.apiURL + '/updateGrantConfig', JSON.stringify(post))
  }
  getSchoolCategories(post:any){
    return this.httpClient.post(this.apiURL + '/getSchoolCategories', JSON.stringify({'catId':post}))
  }

  
}
